import Link from "next/link";
import type { Category } from "@/types";

const ICONS: Record<string, string> = {
  grocery: "🌾",
  oil: "🥥",
  snack: "🍌",
  spice: "🌶️",
  kerala: "🎊",
  cloth: "👘",
  home: "🏺",
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-kerala-yellow/40 bg-white/70 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-kerala-yellow hover:shadow-md"
    >
      <span className="text-4xl transition-transform group-hover:scale-110">
        {ICONS[category.icon] || "🛍️"}
      </span>
      <span className="font-display text-sm font-semibold text-kerala-brown group-hover:text-kerala-red">
        {category.name}
      </span>
      <span className="text-xs text-kerala-green">{category.product_count} items</span>
    </Link>
  );
}
