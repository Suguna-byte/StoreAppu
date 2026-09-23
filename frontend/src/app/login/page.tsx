"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid email or password.");
      toast.success("Welcome back!");
      router.push(searchParams.get("next") || "/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-kerala-yellow/30 bg-white/80 p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-kerala-green-dark">Welcome back</h1>
        <p className="mt-1 text-sm text-kerala-brown/70">Log in to shop and track your orders.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <span className="mb-1 block text-sm font-semibold text-kerala-brown">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
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
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-kerala-brown/70">
          New here?{" "}
          <Link href="/register" className="font-semibold text-kerala-red hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
