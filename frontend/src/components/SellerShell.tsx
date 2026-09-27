"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/new", label: "Add Product" },
];

/** Shared header + tab nav for the seller area, so it reads as one branded
 * dashboard (matching the storefront's look) rather than a bare form/table. */
export default function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-kerala-yellow/40 bg-kerala-green-dark px-6 py-5 text-kerala-cream shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-kerala-yellow">
            Appu&apos;s Kerala Store
          </p>
          <h1 className="font-display text-2xl font-bold">Seller Dashboard</h1>
        </div>
        <nav className="flex gap-2">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-kerala-yellow text-kerala-green-dark"
                    : "bg-white/10 text-kerala-cream hover:bg-white/20"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
