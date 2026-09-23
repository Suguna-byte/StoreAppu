import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/auth-cookies";

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(`${DJANGO_API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access ?? null;
}

async function forward(req: NextRequest, path: string[], accessToken?: string) {
  const url = `${DJANGO_API_URL}/api/${path.join("/")}/${req.nextUrl.search}`;
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  return fetch(url, { method: req.method, headers, body, cache: "no-store" });
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const cookieStore = await cookies();
  const originalAccessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  let accessToken = originalAccessToken;

  let upstream = await forward(req, path, accessToken);

  if (upstream.status === 401 && refreshToken) {
    const newAccess = await refreshAccessToken(refreshToken);
    if (newAccess) {
      accessToken = newAccess;
      upstream = await forward(req, path, accessToken);
    }
  }

  const responseBody = await upstream.arrayBuffer();
  const res = new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  });

  if (accessToken && accessToken !== originalAccessToken) {
    setAuthCookies(res, accessToken);
  }

  return res;
}

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };
