"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BoatLogo from "./BoatLogo";
import { useSession } from "@/lib/use-session";
import { apiFetch } from "@/lib/api-client";
import { CART_UPDATED_EVENT } from "@/lib/cart-events";
import { MapPinIcon } from "@/components/icons/UiIcons";
import type { Category, Cart } from "@/types";

export default function Header({ categories }: { categories: Category[] }) {
  const { user, loading, logout } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const prevCountRef = useRef(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    function refreshCartCount() {
      apiFetch<Cart>("/cart/")
        .then((cart) => setCartCount(cart.items.reduce((n, i) => n + i.quantity, 0)))
        .catch(() => setCartCount(0));
    }
    refreshCartCount();
    window.addEventListener(CART_UPDATED_EVENT, refreshCartCount);
    return () => window.removeEventListener(CART_UPDATED_EVENT, refreshCartCount);
  }, [user, pathname]);

  const displayCartCount = user ? cartCount : 0;

  useEffect(() => {
    if (displayCartCount > prevCountRef.current) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 400);
      prevCountRef.current = displayCartCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = displayCartCount;
  }, [displayCartCount]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-kerala-cream/95 backdrop-blur-sm">
      <div className="hidden bg-kerala-green-dark text-kerala-cream/85 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[12px]">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5" />
            Viman Nagar, Pune &middot; Open daily, 9am to 9pm
          </span>
          <span className="tracking-wide text-kerala-yellow/90">Free local delivery over &#8377;499</span>
        </div>
      </div>

      <div className="border-b border-kerala-brown/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <BoatLogo />

          <nav className="hidden items-center gap-7 lg:flex">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="relative text-[13px] font-semibold uppercase tracking-wide text-kerala-brown transition-colors hover:text-kerala-red after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-kerala-red after:transition-all after:duration-300 hover:after:w-full"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-1 text-kerala-green-dark transition-colors hover:text-kerala-red"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {displayCartCount > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-kerala-red px-1 text-[11px] font-bold text-kerala-cream ${
                    cartBump ? "animate-pop" : ""
                  }`}
                >
                  {displayCartCount}
                </span>
              )}
            </Link>

            {!loading && user ? (
              <div className="hidden items-center gap-4 sm:flex">
                {user.is_seller && (
                  <Link href="/seller" className="text-[13px] font-semibold uppercase tracking-wide text-kerala-green-dark hover:text-kerala-red">
                    Seller
                  </Link>
                )}
                <Link href="/orders" className="text-[13px] font-semibold uppercase tracking-wide text-kerala-green-dark hover:text-kerala-red">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-kerala-green-dark px-4 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-kerala-green-dark transition hover:bg-kerala-green-dark hover:text-kerala-cream"
                >
                  Logout
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  href="/login"
                  className="hidden bg-kerala-red px-4 py-1.5 text-[13px] font-semibold uppercase tracking-wide text-kerala-cream transition hover:bg-kerala-red-dark sm:block"
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-fade-up-in border-t border-kerala-yellow/60 bg-kerala-cream px-4 py-3 lg:hidden">
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
