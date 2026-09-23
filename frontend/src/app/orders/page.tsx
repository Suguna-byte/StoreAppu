"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import type { Order, Paginated } from "@/types";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-kerala-yellow/30 text-kerala-yellow-dark",
  paid: "bg-kerala-green/20 text-kerala-green-dark",
  failed: "bg-kerala-red/20 text-kerala-red-dark",
  shipped: "bg-kerala-green/20 text-kerala-green-dark",
  delivered: "bg-kerala-green/30 text-kerala-green-dark",
  cancelled: "bg-kerala-brown/20 text-kerala-brown",
};

export default function OrdersPage() {
  const { user, loading: sessionLoading } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    apiFetch<Paginated<Order>>("/orders/")
      .then((data) => setOrders(data.results))
      .catch(() => toast.error("Could not load your orders."))
      .finally(() => setLoading(false));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (sessionLoading || loading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-kerala-brown/70">Loading orders…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-kerala-green-dark">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-kerala-brown/70">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/" className="font-semibold text-kerala-red">Start shopping</Link>
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border border-kerala-yellow/30 bg-white/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display font-bold text-kerala-brown">Order #{order.id}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-kerala-brown/60">
                {new Date(order.created_at).toLocaleString("en-IN")}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-kerala-brown/80">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product_name} — ₹{item.subtotal}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-kerala-yellow/20 pt-3">
                <span className="text-sm text-kerala-brown/70">
                  Delivering to {order.address.city}, {order.address.pincode}
                </span>
                <span className="font-display text-lg font-bold text-kerala-green-dark">₹{order.total_amount}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
