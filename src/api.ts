const BACKEND_URL = 'https://vile-backend.vercel.app'; // Replace with your URL

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
