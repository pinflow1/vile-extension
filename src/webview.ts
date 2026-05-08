import * as vscode from 'vscode';

export function showAnalysis(analysis: any) {
  const panel = vscode.window.createWebviewPanel(
    'vileAnalysis',
    'Vile Analysis',
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  );
  panel.webview.html = getWebviewContent(analysis);
}

function getWebviewContent(analysis: any): string {
  const analysisText = analysis.analysis || JSON.stringify(analysis, null, 2);
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Space Mono', monospace; padding: 20px; background: #0d0d0d; color: #e0e0e0; }
        pre { white-space: pre-wrap; word-wrap: break-word; background: #1a1a1a; padding: 16px; border-radius: 12px; }
      </style>
    </head>
    <body>
      <h2>Vile Analysis</h2>
      <pre>${escapeHtml(analysisText)}</pre>
    </body>
    </html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}
