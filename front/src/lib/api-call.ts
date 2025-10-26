export async function apiCall(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<{ data: any; status: number }> {
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
  const data = await response.json();
  return { data, status: response.status };
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
