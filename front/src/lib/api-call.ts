export async function apiCall(url: string, token: string, options: RequestInit = {}): Promise<any> {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || response.statusText);
  }
  return response.json();
}

export function apiCallBackground(url: string, token: string, options: RequestInit = {}): void {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };
  fetch(url, fetchOptions);
}
