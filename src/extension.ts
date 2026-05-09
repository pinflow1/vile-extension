import * as vscode from 'vscode';
import { analyzeCode } from './api';
import { showAnalysis } from './webview';
import { getSupabaseToken, login } from './auth';

export async function activate(context: vscode.ExtensionContext) {
  // Register login command
  let loginCmd = vscode.commands.registerCommand('vile.login', async () => {
    const token = await login(context);
    if (token) {
      vscode.window.showInformationMessage('Logged in to Vile!');
    }
  });

  // Register analyze command
  let analyzeCmd = vscode.commands.registerCommand('vile.analyze', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor');
      return;
    }
    const selection = editor.selection;
    const code = editor.document.getText(selection);
    if (!code.trim()) {
      vscode.window.showWarningMessage('No code selected');
      return;
    }

    // Ensure we have a token
    let token = await getSupabaseToken(context);
    if (!token) {
      const choice = await vscode.window.showWarningMessage(
        'You need to log in to Vile first.',
        'Login'
      );
      if (choice === 'Login') {
        token = await login(context);
      }
      if (!token) return;
    }

    // Show progress
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Vile is analyzing your code...",
      cancellable: false
    }, async () => {
      try {
        const result = await analyzeCode(code, token);
        showAnalysis(result);
      } catch (err: any) {
        vscode.window.showErrorMessage(`Vile analysis failed: ${err.message}`);
      }
    });
  });

  context.subscriptions.push(loginCmd, analyzeCmd);
}

export function deactivate() {}
