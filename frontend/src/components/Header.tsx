"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BoatLogo from "./BoatLogo";
import { useSession } from "@/lib/use-session";
import { apiFetch } from "@/lib/api-client";
import type { Category, Cart } from "@/types";

export default function Header({ categories }: { categories: Category[] }) {
  const { user, loading, logout } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    apiFetch<Cart>("/cart/")
      .then((cart) => setCartCount(cart.items.reduce((n, i) => n + i.quantity, 0)))
      .catch(() => setCartCount(0));
  }, [user, pathname]);

  const displayCartCount = user ? cartCount : 0;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b-4 border-kerala-yellow bg-kerala-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BoatLogo />

        <nav className="hidden items-center gap-5 lg:flex">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="text-sm font-semibold text-kerala-brown transition-colors hover:text-kerala-red"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-kerala-green-dark transition-colors hover:bg-kerala-green/10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {displayCartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-kerala-red px-1 text-[11px] font-bold text-kerala-cream">
                {displayCartCount}
              </span>
            )}
          </Link>

          {!loading && user ? (
            <div className="hidden items-center gap-3 sm:flex">
              {user.is_seller && (
                <Link href="/seller" className="text-sm font-semibold text-kerala-green-dark hover:text-kerala-red">
                  Seller
                </Link>
              )}
              <Link href="/orders" className="text-sm font-semibold text-kerala-green-dark hover:text-kerala-red">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-kerala-green px-4 py-1.5 text-sm font-semibold text-kerala-cream transition hover:bg-kerala-green-dark"
              >
                Logout
              </button>
            </div>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="hidden rounded-full bg-kerala-red px-4 py-1.5 text-sm font-semibold text-kerala-cream transition hover:bg-kerala-red-dark sm:block"
              >
                Login
              </Link>
            )
          )}

          <button
            aria-label="Toggle menu"
            className="rounded p-2 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-kerala-yellow/60 bg-kerala-cream px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="py-1 text-sm font-semibold text-kerala-brown hover:text-kerala-red"
              >
                {c.name}
              </Link>
            ))}
            <hr className="my-2 border-kerala-yellow/40" />
            {user ? (
              <>
                {user.is_seller && (
                  <Link href="/seller" onClick={() => setMenuOpen(false)} className="py-1 text-sm font-semibold text-kerala-green-dark">
                    Seller dashboard
                  </Link>
                )}
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="py-1 text-sm font-semibold text-kerala-green-dark">
                  My orders
                </Link>
                <button onClick={handleLogout} className="py-1 text-left text-sm font-semibold text-kerala-red">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="py-1 text-sm font-semibold text-kerala-red">
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
