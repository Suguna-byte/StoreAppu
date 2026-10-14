import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { CATEGORY_ILLUSTRATIONS, ClothingIllustration } from "@/components/icons/CategoryIllustrations";

/** Horizontal strip of every category as a small photo + name + count,
 * the primary way to browse from anywhere on the site, not just home. */
export default function CategoryIconNav({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="border-b border-kerala-brown/15 bg-kerala-cream">
      <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const Illustration = CATEGORY_ILLUSTRATIONS[c.icon] || ClothingIllustration;
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="ease-fluid group flex shrink-0 items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
            >
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-kerala-brown/10">
                {c.image ? (
                  <Image src={c.image} alt="" fill sizes="36px" className="object-cover" />
                ) : (
                  <Illustration className="h-full w-full" />
                )}
              </span>
              <span className="whitespace-nowrap text-[13px] font-semibold text-kerala-brown">
                {c.name}
                <span className="ml-1 font-normal text-kerala-brown/50">({c.product_count})</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
