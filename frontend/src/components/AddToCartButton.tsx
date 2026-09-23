"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useToast } from "./ToastProvider";

export default function AddToCartButton({
  productId,
  disabled,
  className = "",
}: {
  productId: number;
  disabled?: boolean;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handleAdd() {
    setLoading(true);
    try {
      await apiFetch("/cart/", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      toast.success("Added to cart!");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("Please log in to add items to your cart.");
        router.push("/login");
      } else {
        toast.error(err instanceof Error ? err.message : "Could not add to cart.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`rounded-full bg-kerala-green px-4 py-2 text-sm font-semibold text-kerala-cream transition hover:bg-kerala-green-dark disabled:cursor-not-allowed disabled:bg-kerala-brown/40 ${className}`}
    >
      {loading ? "Adding…" : disabled ? "Out of stock" : "Add to cart"}
    </button>
  );
}
