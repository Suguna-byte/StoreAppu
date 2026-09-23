import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/checkout", "/orders", "/seller"];

/**
 * Optimistic auth gate: redirects to /login when neither auth cookie is
 * present. This is a fast, request-data-only check — the real authorization
 * (e.g. is_seller) is always re-verified by Django on every API call.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has("access_token") || request.cookies.has("refresh_token");
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/seller/:path*"],
};
