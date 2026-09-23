"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@/types";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-checks on every route change too: Header lives in the persistent root
    // layout, so a client-side navigation after login/logout wouldn't otherwise
    // remount it or refetch the session.
    // refresh() only sets state after its internal `await`, so this doesn't
    // cause a synchronous cascading render — it's the standard fetch-on-mount pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh, pathname]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  return { user, loading, refresh, logout };
}
