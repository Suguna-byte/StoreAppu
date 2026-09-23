"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { loadRazorpayScript } from "@/lib/load-razorpay";
import { useSession } from "@/lib/use-session";
import { useToast } from "@/components/ToastProvider";
import type { Cart, DeliveryAddress, Order } from "@/types";

interface RazorpayOrderInfo {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  order_id: number;
  store_name: string;
}

const initialAddress: DeliveryAddress = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Pune",
  state: "Maharashtra",
  pincode: "",
  latitude: null,
  longitude: null,
};

export default function CheckoutPage() {
  const { user, loading: sessionLoading } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState<DeliveryAddress>(initialAddress);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    apiFetch<Cart>("/cart/")
      .then((c) => {
        if (c.items.length === 0) {
          toast.error("Your cart is empty.");
          router.replace("/cart");
        } else {
          setCart(c);
        }
      })
      .catch(() => toast.error("Could not load your cart."));
  }, [user, sessionLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleUseLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress((a) => ({ ...a, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        toast.success("Location captured — please confirm your full address below.");
        setLocating(false);
      },
      () => {
        toast.error("Could not get your location. Please enter your address manually.");
        setLocating(false);
      }
    );
  }

  async function handlePay() {
    if (!address.full_name || !address.phone || !address.line1 || !address.pincode) {
      toast.error("Please fill in your name, phone, address and pincode.");
      return;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await apiFetch<Order>("/orders/checkout/", {
        method: "POST",
        body: JSON.stringify({ new_address: address }),
      });

      const rpOrder = await apiFetch<RazorpayOrderInfo>("/payments/create-order/", {
        method: "POST",
        body: JSON.stringify({ order_id: order.id }),
      });

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: rpOrder.key_id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        order_id: rpOrder.razorpay_order_id,
        name: rpOrder.store_name,
        description: `Order #${order.id}`,
        prefill: { name: address.full_name, contact: address.phone },
        theme: { color: "#2f5233" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await apiFetch("/payments/verify/", {
              method: "POST",
              body: JSON.stringify(response),
            });
            toast.success("Payment successful! Your order is confirmed.");
            router.push("/orders");
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Payment verification failed. Please contact us."
            );
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setSubmitting(false);
          },
        },
      });
      razorpay.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout.");
      setSubmitting(false);
    }
  }

  if (sessionLoading || !cart) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-kerala-brown/70">Loading checkout…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-kerala-green-dark">Checkout</h1>

      <div className="mt-6 rounded-2xl border border-kerala-yellow/30 bg-white/70 p-5">
        <div className="flex items-center justify-between font-display text-lg font-bold text-kerala-brown">
          <span>Order total</span>
          <span>₹{cart.total}</span>
        </div>
        <p className="mt-1 text-sm text-kerala-brown/60">{cart.items.length} item(s)</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePay();
        }}
        className="mt-6 space-y-4 rounded-2xl border border-kerala-yellow/30 bg-white/70 p-5"
      >
        <h2 className="font-display text-lg font-bold text-kerala-brown">Delivery Address</h2>

        <button
          type="button"
          onClick={handleUseLocation}
          disabled={locating}
          className="flex items-center gap-2 rounded-full border border-kerala-green px-4 py-2 text-sm font-semibold text-kerala-green-dark hover:bg-kerala-green/10"
        >
          📍 {locating ? "Locating…" : "Use my current location"}
        </button>
        {address.latitude && (
          <p className="text-xs text-kerala-green">
            Location captured ({address.latitude.toFixed(4)}, {address.longitude?.toFixed(4)})
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              required
              value={address.full_name}
              onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Phone number">
            <input
              required
              inputMode="numeric"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <Field label="Address line 1">
          <input
            required
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Address line 2 (optional)">
          <input
            value={address.line2}
            onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            className="input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City">
            <input
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="State">
            <input
              required
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Pincode">
            <input
              required
              inputMode="numeric"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-kerala-red py-3 font-semibold text-kerala-cream shadow transition hover:bg-kerala-red-dark disabled:opacity-60"
        >
          {submitting ? "Processing…" : `Pay ₹${cart.total} with Razorpay`}
        </button>
        <p className="text-center text-xs text-kerala-brown/50">
          Secured by Razorpay. We never store your card details.
        </p>
      </form>

      <Link href="/cart" className="mt-4 inline-block text-sm text-kerala-brown/60 hover:text-kerala-red">
        ← Back to cart
      </Link>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-kerala-brown">{label}</span>
      {children}
    </label>
  );
}
