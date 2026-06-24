// src/lib/api.ts
// Thin typed fetch wrapper — all API calls go through here.

const BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                       => request<T>(path),
  post:   <T>(path: string, body: unknown)        => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)        => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(path: string)                       => request<T>(path, { method: "DELETE" }),
};
