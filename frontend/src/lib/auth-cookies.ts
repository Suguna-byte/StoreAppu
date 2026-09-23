import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

const ACCESS_MAX_AGE = 60 * 25; // slightly under the 30 min Django access-token lifetime
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // matches Django refresh-token lifetime

export function setAuthCookies(res: NextResponse, access: string, refresh?: string) {
  res.cookies.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  if (refresh) {
    res.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("access_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { httpOnly: true, path: "/", maxAge: 0 });
}
