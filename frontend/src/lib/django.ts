/**
 * Server-only helper for public, unauthenticated reads (catalog, categories).
 * Called from Server Components so it can talk to Django directly over the
 * network without going through the browser — no CORS involved.
 */
const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

export class DjangoApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchPublic<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${DJANGO_API_URL}/api${path}`, {
    ...init,
    cache: "no-store",
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    throw new DjangoApiError(`Request to ${path} failed with ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

export { DJANGO_API_URL };
