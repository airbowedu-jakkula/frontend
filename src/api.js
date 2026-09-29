// Backend base URL. Override in production with a .env file:
//   VITE_API_URL=https://your-backend.example.com
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("admin_token");
}
export function setToken(t) {
  localStorage.setItem("admin_token", t);
}
export function clearToken() {
  localStorage.removeItem("admin_token");
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, { auth, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }
  if (!res.ok) {
    throw new ApiError((data && data.error) || `Request failed (${res.status})`, res.status);
  }
  return data;
}
