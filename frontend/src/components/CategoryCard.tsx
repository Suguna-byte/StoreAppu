import Link from "next/link";
import type { Category } from "@/types";
import { CATEGORY_ILLUSTRATIONS, ClothingIllustration } from "@/components/icons/CategoryIllustrations";

export default function CategoryCard({ category }: { category: Category }) {
  const Illustration = CATEGORY_ILLUSTRATIONS[category.icon] || ClothingIllustration;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group overflow-hidden rounded-3xl border border-kerala-yellow/30 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden">
        <Illustration className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-display text-sm font-semibold text-kerala-brown group-hover:text-kerala-red">
          {category.name}
        </span>
        <span className="rounded-full bg-kerala-green/10 px-2.5 py-0.5 text-xs font-semibold text-kerala-green-dark">
          {category.product_count}
        </span>
      </div>
    </Link>
  );
}
