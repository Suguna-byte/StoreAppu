"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { ProductListItem } from "@/types";

/** Real category-filtered tabs over the already-fetched product list, no
 * extra network round trip since the homepage has the full list in hand. */
export default function FeaturedProductsSection({ products }: { products: ProductListItem[] }) {
  const tabs = useMemo(() => {
    const names = Array.from(new Set(products.map((p) => p.category_name)));
    return ["All", ...names];
  }, [products]);
  const [active, setActive] = useState("All");

  const visible = active === "All" ? products : products.filter((p) => p.category_name === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`ease-fluid px-4 py-1.5 text-[13px] font-semibold transition-colors duration-300 ${
              active === tab
                ? "bg-kerala-green text-kerala-cream"
                : "bg-white text-kerala-brown/70 ring-1 ring-kerala-brown/15 hover:text-kerala-brown"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((p, i) => (
          <Reveal key={p.id} index={i}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
