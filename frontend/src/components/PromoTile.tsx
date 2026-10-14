import Image from "next/image";
import Link from "next/link";

/** A single promotional banner tile linking to a category, real photo and
 * real product count, used in the homepage's banner grid and promo strip. */
export default function PromoTile({
  href,
  image,
  eyebrow,
  title,
  cta = "Shop now",
  className = "",
}: {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  cta?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-lg ${className}`}>
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="ease-fluid object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kerala-yellow">{eyebrow}</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-white">{title}</h3>
        <span className="ease-fluid mt-2 inline-block text-sm font-semibold text-white underline decoration-kerala-yellow decoration-2 underline-offset-4 transition-colors duration-300 group-hover:text-kerala-yellow">
          {cta}
        </span>
      </div>
    </Link>
  );
}
