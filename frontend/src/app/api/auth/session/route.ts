import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/auth-cookies";

async function fetchMe(accessToken: string) {
  return fetch(`${DJANGO_API_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

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

/** Client components poll this on mount to learn who (if anyone) is logged
 * in; it also transparently refreshes an expired access token. */
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null });
  }

  let token = accessToken;
  let meRes = token ? await fetchMe(token) : null;

  if ((!meRes || meRes.status === 401) && refreshToken) {
    const newAccess = await refreshAccessToken(refreshToken);
    if (newAccess) {
      token = newAccess;
      meRes = await fetchMe(newAccess);
    }
  }

  if (!meRes || !meRes.ok || !token) {
    return NextResponse.json({ user: null });
  }

  const user = await meRes.json();
  const res = NextResponse.json({ user });
  if (token !== accessToken) setAuthCookies(res, token);
  return res;
}
