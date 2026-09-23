import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/types";
import AddToCartButton from "./AddToCartButton";

const UNIT_LABELS: Record<string, string> = {
  pc: "piece",
  kg: "kg",
  g: "g",
  l: "litre",
  ml: "ml",
  pack: "pack",
};

export default function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-kerala-yellow/30 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-kerala-cream-dark">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🥥</div>
        )}
        {!product.in_stock && (
          <span className="absolute left-2 top-2 rounded-full bg-kerala-red px-2 py-0.5 text-xs font-bold text-kerala-cream">
            Out of stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-kerala-green">
          {product.category_name}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base font-semibold text-kerala-brown line-clamp-2 hover:text-kerala-red">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-kerala-green-dark">
            ₹{product.price}
            <span className="text-xs font-normal text-kerala-brown/70">/{UNIT_LABELS[product.unit] || product.unit}</span>
          </span>
        </div>
        <AddToCartButton productId={product.id} disabled={!product.in_stock} className="mt-2 w-full" />
      </div>
    </div>
  );
}
