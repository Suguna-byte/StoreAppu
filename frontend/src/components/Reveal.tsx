"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades + slides children in once they scroll into view. Used to give grids
 * (categories, products) a staggered entrance instead of popping in at once.
 */
export default function Reveal({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger position within a grid/list, each step adds ~60ms of delay. */
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${Math.min(index, 8) * 60}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
