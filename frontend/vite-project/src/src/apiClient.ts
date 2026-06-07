const BASE_URL = "https://job-application-tracker-wiqx.onrender.com/api/v1";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
