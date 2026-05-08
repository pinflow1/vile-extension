import * as vscode from 'vscode';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-project.supabase.co'; // Replace
const SUPABASE_ANON_KEY = 'your-anon-key'; // Replace

export async function login(context: vscode.ExtensionContext): Promise<string | null> {
  // Use VS Code's built-in authentication or open a simple webview for Supabase login.
  // For simplicity, we'll prompt for email and password (not ideal but works for MVP).
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
