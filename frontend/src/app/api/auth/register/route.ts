import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.full_name) {
    return NextResponse.json({ detail: "Name, email and password are required." }, { status: 400 });
  }

  const registerRes = await fetch(`${DJANGO_API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const registerData = await registerRes.json().catch(() => ({}));

  if (!registerRes.ok) {
    return NextResponse.json(registerData, { status: registerRes.status });
  }

  // Auto-login right after signup so the user lands in an authenticated session.
  const loginRes = await fetch(`${DJANGO_API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  });
  const loginData = await loginRes.json().catch(() => ({}));

  if (!loginRes.ok) {
    // Account created but auto-login failed for some reason — still a success for the user.
    return NextResponse.json({ ok: true, autoLogin: false });
  }

  const res = NextResponse.json({ ok: true, autoLogin: true });
  setAuthCookies(res, loginData.access, loginData.refresh);
  return res;
}
