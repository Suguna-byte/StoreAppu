"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data.email?.[0] || data.full_name?.[0] || data.password?.[0] || data.detail || "Could not create account.";
        throw new Error(message);
      }
      toast.success("Account created! Welcome to Appu's Kerala Store.");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-kerala-yellow/30 bg-white/80 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-kerala-green-dark">Create your account</h1>
        <p className="mt-1 text-sm text-kerala-brown/70">Join us for authentic Kerala groceries, delivered.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Full name</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Phone (optional)</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-kerala-green py-3 font-semibold text-kerala-cream transition hover:bg-kerala-green-dark disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-kerala-brown/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-kerala-red hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
