"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import QuantityStepper from "@/components/QuantityStepper";
import type { Cart } from "@/types";

export default function CartPage() {
  const { user, loading: sessionLoading } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading || !user) return;
    apiFetch<Cart>("/cart/")
      .then(setCart)
      .catch(() => toast.error("Could not load your cart."))
      .finally(() => setLoading(false));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function updateQuantity(itemId: number, quantity: number) {
    try {
      const updated = await apiFetch<Cart>(`/cart/${itemId}/`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCart(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update quantity.");
    }
  }

  async function removeItem(itemId: number) {
    try {
      const updated = await apiFetch<Cart>(`/cart/${itemId}/`, { method: "DELETE" });
      setCart(updated);
      toast.success("Item removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove item.");
    }
  }

  if (sessionLoading || (user && loading)) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-kerala-brown/70">Loading your cart…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-kerala-brown">Please log in to view your cart.</p>
        <Link href="/login" className="mt-4 inline-block rounded-full bg-kerala-red px-6 py-2 font-semibold text-kerala-cream">
          Log in
        </Link>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-kerala-green-dark">Your Cart</h1>

      {isEmpty ? (
        <div className="mt-10 text-center text-kerala-brown/70">
          Your cart is empty.{" "}
          <Link href="/#categories" className="font-semibold text-kerala-red">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-kerala-yellow/30">
            {cart!.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-kerala-cream-dark">
                  {item.product.primary_image ? (
                    <Image src={item.product.primary_image} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🥥</div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-kerala-brown hover:text-kerala-red">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-kerala-brown/60">₹{item.product.price} / {item.product.unit}</p>
                </div>
                <QuantityStepper
                  quantity={item.quantity}
                  max={item.product.stock}
                  onChange={(q) => updateQuantity(item.id, q)}
                />
                <span className="w-20 text-right font-semibold text-kerala-green-dark">₹{item.subtotal}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                  className="text-kerala-red/70 hover:text-kerala-red"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t border-kerala-yellow/40 pt-4">
            <span className="font-display text-xl font-bold text-kerala-brown">Total</span>
            <span className="font-display text-2xl font-extrabold text-kerala-green-dark">₹{cart!.total}</span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 w-full rounded-full bg-kerala-red py-3 font-semibold text-kerala-cream shadow transition hover:bg-kerala-red-dark"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
