import * as vscode from 'vscode';
import { createClient } from '@supabase/supabase-js';

// These placeholders will be replaced by GitHub Actions during build
const SUPABASE_URL = '__SUPABASE_URL__';
const SUPABASE_ANON_KEY = '__SUPABASE_ANON_KEY__';

export async function login(context: vscode.ExtensionContext): Promise<string | null> {
  const email = await vscode.window.showInputBox({ prompt: 'Enter your Vile email' });
  if (!email) return null;
  const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });
  if (!password) return null;

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    vscode.window.showErrorMessage(`Login failed: ${error.message}`);
    return null;
  }
  const token = data.session?.access_token;
  if (token) {
    await context.secrets.store('vile_token', token);
  }
  return token;
}

export async function getSupabaseToken(context: vscode.ExtensionContext): Promise<string | null> {
  return await context.secrets.get('vile_token');
}
