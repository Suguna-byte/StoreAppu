"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { CheckIcon } from "@/components/icons/UiIcons";
import { emitCartUpdated } from "@/lib/cart-events";
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
  const [justAdded, setJustAdded] = useState(false);
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
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 400);
      emitCartUpdated();
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-kerala-green px-4 py-2 text-sm font-semibold text-kerala-cream transition hover:bg-kerala-green-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-kerala-brown/40 ${
        justAdded ? "animate-pop" : ""
      } ${className}`}
    >
      {justAdded && <CheckIcon className="h-4 w-4" />}
      {loading ? "Adding…" : disabled ? "Out of stock" : justAdded ? "Added" : "Add to cart"}
    </button>
  );
}
