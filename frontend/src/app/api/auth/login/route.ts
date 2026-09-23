import { NextRequest, NextResponse } from "next/server";
import { DJANGO_API_URL } from "@/lib/django";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
  }

  const upstream = await fetch(`${DJANGO_API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(
      { detail: data.detail || "Invalid email or password." },
      { status: upstream.status }
    );
  }

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, data.access, data.refresh);
  return res;
}
