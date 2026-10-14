import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { PackageIcon } from "./icons/UiIcons";
import type { ProductListItem } from "@/types";

function ProductRow({ product }: { product: ProductListItem }) {
  return (
    <div className="flex items-center gap-3 border-b border-kerala-brown/10 py-3 last:border-0">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-kerala-cream-dark"
      >
        {product.primary_image ? (
          <Image src={product.primary_image} alt={product.name} fill sizes="56px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-kerala-brown/30">
            <PackageIcon className="h-6 w-6" />
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="ease-fluid block truncate text-sm font-semibold text-kerala-brown transition-colors duration-300 hover:text-kerala-red"
        >
          {product.name}
        </Link>
        <p className="text-sm font-semibold text-kerala-green-dark">
          &#8377;{product.price}
          <span className="ml-1 text-xs font-normal text-kerala-brown/60">/{product.unit}</span>
        </p>
      </div>
    </div>
  );
}

/** Reuses the same catalog as Featured Products but in a different,
 * spotlighted layout, real stock and prices throughout, no fabricated
 * ratings or review counts since this store has no review system. */
export default function CustomerFavorites({ products }: { products: ProductListItem[] }) {
  if (products.length < 3) return null;

  const [spotlight, ...rest] = products;
  const left = rest.slice(0, 2);
  const right = rest.slice(2, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-center">
      <div className="order-2 lg:order-1">{left.map((p) => <ProductRow key={p.id} product={p} />)}</div>

      <div className="order-1 flex flex-col items-center gap-3 rounded-lg border border-kerala-yellow/40 bg-white p-8 text-center shadow-sm lg:order-2">
        <div className="relative h-40 w-40 overflow-hidden rounded-full bg-kerala-cream-dark ring-4 ring-kerala-peach">
          {spotlight.primary_image ? (
            <Image src={spotlight.primary_image} alt={spotlight.name} fill sizes="160px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-kerala-brown/30">
              <PackageIcon className="h-12 w-12" />
            </div>
          )}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kerala-yellow-dark">
          {spotlight.category_name}
        </span>
        <h3 className="font-display text-xl font-semibold text-kerala-brown">{spotlight.name}</h3>
        <p className="font-display text-2xl font-bold text-kerala-green-dark">
          &#8377;{spotlight.price}
          <span className="text-sm font-normal text-kerala-brown/60">/{spotlight.unit}</span>
        </p>
        <p className="text-xs text-kerala-brown/60">
          {spotlight.in_stock ? `${spotlight.stock} in stock` : "Out of stock"}
        </p>
        <AddToCartButton productId={spotlight.id} disabled={!spotlight.in_stock} className="mt-1 w-full max-w-[220px]" />
      </div>

      <div className="order-3">{right.map((p) => <ProductRow key={p.id} product={p} />)}</div>
    </div>
  );
}
