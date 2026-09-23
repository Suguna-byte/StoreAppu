"use client";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/** Flattens a DRF error payload (`{field: ["msg"]}` or `{detail: "msg"}`) into one readable line. */
function firstErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.detail === "string") return obj.detail;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (Array.isArray(value) && typeof value[0] === "string") {
      return key === "non_field_errors" ? value[0] : `${key}: ${value[0]}`;
    }
    if (typeof value === "string") return value;
  }
  return null;
}

/** All authenticated browser requests go through our own /api/proxy route,
 * which attaches the JWT server-side — the browser never sees the token. */
export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    credentials: "include",
    headers: isFormData
      ? init.headers
      : { "Content-Type": "application/json", ...(init.headers || {}) },
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = firstErrorMessage(data) || "Something went wrong. Please try again.";
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}
