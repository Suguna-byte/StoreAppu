"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import type { Paginated, ProductListItem } from "@/types";

export default function SellerDashboard() {
  const { user, loading: sessionLoading } = useSession();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.replace("/login?next=/seller");
      return;
    }
    apiFetch<Paginated<ProductListItem>>("/catalog/products/?mine=true")
      .then((data) => setProducts(data.results))
      .catch(() => toast.error("Could not load your products."))
      .finally(() => setLoading(false));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (sessionLoading || loading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-kerala-brown/70">Loading dashboard…</div>;
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-kerala-green-dark">Seller Dashboard</h1>
        <Link
          href="/seller/new"
          className="rounded-full bg-kerala-red px-5 py-2 font-semibold text-kerala-cream hover:bg-kerala-red-dark"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-kerala-brown/70">You haven&apos;t listed any products yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-kerala-yellow/30 bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-kerala-green/10 text-kerala-brown">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-kerala-yellow/20">
                  <td className="p-3 font-semibold text-kerala-brown">{p.name}</td>
                  <td className="p-3 text-kerala-brown/70">{p.category_name}</td>
                  <td className="p-3 text-kerala-brown/70">₹{p.price}</td>
                  <td className="p-3">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
