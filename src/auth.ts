import * as vscode from 'vscode';
import { createClient } from '@supabase/supabase-js';

const BACKEND_URL = 'https://vile-backend.vercel.app'; // your backend URL

let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const response = await fetch(`${BACKEND_URL}/api/config`);
  if (!response.ok) throw new Error('Failed to fetch Supabase config');
  const { supabaseUrl, supabaseAnonKey } = await response.json();
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export async function login(context: vscode.ExtensionContext): Promise<string | null> {
  const email = await vscode.window.showInputBox({ prompt: 'Enter your Vile email' });
  if (!email) return null;
  const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });
  if (!password) return null;

  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    vscode.window.showErrorMessage(`Login failed: ${error.message}`);
    return null;
  }
  const token = data.session?.access_token;
  if (token) {
    await context.secrets.store('vile_token', token);
    return token;
  }
  return null;
}

export async function getSupabaseToken(context: vscode.ExtensionContext): Promise<string | null> {
  const token = await context.secrets.get('vile_token');
  return token || null;
}
