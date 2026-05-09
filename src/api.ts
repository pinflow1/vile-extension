// This placeholder will be replaced by GitHub Actions during build
const BACKEND_URL = '__BACKEND_URL__';

export async function analyzeCode(code: string, token: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}
