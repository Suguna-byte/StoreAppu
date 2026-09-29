"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import SellerShell from "@/components/SellerShell";
import { PackageIcon } from "@/components/icons/UiIcons";
import type { Category, ProductDetail } from "@/types";

const UNITS = [
  { value: "pc", label: "piece" },
  { value: "kg", label: "kilogram" },
  { value: "g", label: "gram" },
  { value: "l", label: "litre" },
  { value: "ml", label: "millilitre" },
  { value: "pack", label: "pack" },
];

export default function NewProductPage() {
  const { user, loading: sessionLoading } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    unit: "pc",
    stock: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading || !user) return;
    apiFetch<Category[]>("/catalog/categories/")
      .then((data) => {
        setCategories(data);
        if (data[0]) setForm((f) => ({ ...f, category: data[0].slug }));
      })
      .catch(() => toast.error("Could not load categories."));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionLoading && !user) router.replace("/login?next=/seller/new");
  }, [sessionLoading, user, router]);

  const imagePreviewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); }, [imagePreviewUrl]);

  const categoryName = categories.find((c) => c.slug === form.category)?.name;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const product = await apiFetch<ProductDetail>("/catalog/products/", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          price: form.price,
          unit: form.unit,
          stock: Number(form.stock),
        }),
      });

      if (image) {
        const fd = new FormData();
        fd.append("image", image);
        await apiFetch(`/catalog/products/${product.slug}/upload_image/`, {
          method: "POST",
          body: fd,
        });
      }

      toast.success(`${product.name} added to your store!`);
      router.push("/seller");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add product.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-kerala-brown/70">Loading…</div>;
  }
  if (!user) return null;

  return (
    <SellerShell>
      <h2 className="font-display text-xl font-bold text-kerala-brown">Add a Product</h2>
      <p className="mt-1 text-sm text-kerala-brown/70">
        Fill in the details below — customers will see this exactly as it appears in the preview.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-kerala-yellow/30 bg-white p-6">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Product name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Category</span>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-kerala-brown">Price (₹)</span>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-kerala-brown">Unit</span>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input">
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-kerala-brown">Stock quantity</span>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Product image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="input"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-kerala-green py-3 font-semibold text-kerala-cream transition hover:bg-kerala-green-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Add Product"}
          </button>
        </form>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-kerala-brown/60">Live preview</p>
          <div className="overflow-hidden rounded-2xl border border-kerala-yellow/30 bg-white shadow-sm">
            <div className="relative aspect-square bg-kerala-cream-dark">
              {imagePreviewUrl ? (
                <Image src={imagePreviewUrl} alt="Product preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-kerala-brown/30">
                  <PackageIcon className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="p-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-kerala-green">
                {categoryName || "Category"}
              </span>
              <h3 className="font-display text-base font-semibold text-kerala-brown">
                {form.name || "Product name"}
              </h3>
              <span className="font-display text-lg font-bold text-kerala-green-dark">
                ₹{form.price || "0.00"}
                <span className="text-xs font-normal text-kerala-brown/70">/{form.unit}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </SellerShell>
  );
}
