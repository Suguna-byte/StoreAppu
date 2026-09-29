import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";
import { CATEGORY_ILLUSTRATIONS, ClothingIllustration } from "@/components/icons/CategoryIllustrations";

/**
 * Full-bleed photo tile with the name captioned directly over it, magazine
 * style, rather than a photo-plus-caption-box app icon. `large` sizes the
 * caption up for the featured tile in the homepage's bento layout.
 */
export default function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  const Illustration = CATEGORY_ILLUSTRATIONS[category.icon] || ClothingIllustration;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block h-full min-h-[150px] overflow-hidden rounded-lg"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <Illustration className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <span className={`font-display font-semibold text-white drop-shadow-sm ${large ? "text-2xl" : "text-[15px]"}`}>
          {category.name}
        </span>
        <span className="shrink-0 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-kerala-green-dark">
          {category.product_count}
        </span>
      </div>
    </Link>
  );
}
