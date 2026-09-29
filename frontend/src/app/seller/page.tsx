"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import SellerShell from "@/components/SellerShell";
import { PackageIcon } from "@/components/icons/UiIcons";
import type { Paginated, ProductListItem } from "@/types";

const LOW_STOCK_THRESHOLD = 10;

function StatCard({ label, value, tone }: { label: string; value: number; tone: "green" | "yellow" | "red" }) {
  const toneClasses = {
    green: "border-kerala-green/30 bg-kerala-green/10 text-kerala-green-dark",
    yellow: "border-kerala-yellow/40 bg-kerala-yellow/10 text-kerala-yellow-dark",
    red: "border-kerala-red/30 bg-kerala-red/10 text-kerala-red-dark",
  }[tone];
  return (
    <div className={`rounded-2xl border px-5 py-4 ${toneClasses}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="font-display text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-kerala-red/15 px-3 py-1 text-xs font-bold text-kerala-red-dark">
        Out of stock
      </span>
    );
  }
  if (stock < LOW_STOCK_THRESHOLD) {
    return (
      <span className="rounded-full bg-kerala-yellow/25 px-3 py-1 text-xs font-bold text-kerala-yellow-dark">
        Low stock
      </span>
    );
  }
  return (
    <span className="rounded-full bg-kerala-green/15 px-3 py-1 text-xs font-bold text-kerala-green-dark">
      In stock
    </span>
  );
}

export default function SellerDashboard() {
  const { user, loading: sessionLoading } = useSession();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading || !user) return;
    apiFetch<Paginated<ProductListItem>>("/catalog/products/?mine=true")
      .then((data) => setProducts(data.results))
      .catch(() => toast.error("Could not load your products."))
      .finally(() => setLoading(false));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionLoading && !user) router.replace("/login?next=/seller");
  }, [sessionLoading, user, router]);

  async function updateStock(product: ProductListItem, stock: number) {
    setSavingId(product.id);
    try {
      await apiFetch(`/catalog/products/${product.slug}/`, {
        method: "PATCH",
        body: JSON.stringify({ stock }),
      });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock, in_stock: stock > 0 } : p)));
      toast.success(`Stock updated for ${product.name}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update stock.");
    } finally {
      setSavingId(null);
    }
  }

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category_name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const stats = useMemo(
    () => ({
      total: products.length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock < LOW_STOCK_THRESHOLD).length,
    }),
    [products]
  );

  if (sessionLoading || (user && loading)) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-kerala-brown/70">Loading dashboard…</div>;
  }

  if (user && !user.is_seller) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-kerala-brown">
          Your account isn&apos;t set up as a seller yet. Ask the store admin to enable seller access for your
          account in the Django admin.
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SellerShell>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Products" value={stats.total} tone="green" />
        <StatCard label="Low Stock" value={stats.lowStock} tone="yellow" />
        <StatCard label="Out of Stock" value={stats.outOfStock} tone="red" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <input
          type="search"
          placeholder="Search your products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
        />
        <Link
          href="/seller/new"
          className="rounded-sm bg-kerala-red px-5 py-2 font-semibold text-kerala-cream transition hover:bg-kerala-red-dark"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-kerala-green/30 bg-white/50 py-16 text-center">
          <p className="text-kerala-brown/70">You haven&apos;t listed any products yet.</p>
          <Link
            href="/seller/new"
            className="mt-4 inline-block rounded-sm bg-kerala-green px-5 py-2 font-semibold text-kerala-cream hover:bg-kerala-green-dark"
          >
            List your first product
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-kerala-brown/70">No products match &quot;{search}&quot;.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-kerala-yellow/30 bg-white p-4 shadow-sm"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-kerala-cream-dark">
                {p.primary_image ? (
                  <Image src={p.primary_image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-kerala-brown/30">
                    <PackageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="min-w-[10rem] flex-1">
                <p className="font-display font-semibold text-kerala-brown">{p.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-kerala-green">
                  {p.category_name}
                </p>
              </div>

              <span className="w-20 text-sm font-semibold text-kerala-brown/80">₹{p.price}</span>

              <StockBadge stock={p.stock} />

              <label className="flex items-center gap-2 text-sm text-kerala-brown/70">
                Stock
                <input
                  type="number"
                  min={0}
                  defaultValue={p.stock}
                  disabled={savingId === p.id}
                  onBlur={(e) => {
                    const next = Number(e.target.value);
                    if (!Number.isNaN(next) && next !== p.stock) updateStock(p, next);
                  }}
                  className="w-20 rounded-lg border border-kerala-green/30 px-2 py-1"
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </SellerShell>
  );
}
