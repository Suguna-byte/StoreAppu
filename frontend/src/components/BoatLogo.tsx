import Image from "next/image";
import Link from "next/link";

/**
 * Clickable brand mark, linking home. The badge art reads busy at small
 * sizes, so it gets real size and a plain white plate behind it to
 * separate it from the header instead of blending into the cream field,
 * with the wordmark carrying the brand at a glance beside it. `compact`
 * lets the header shrink it smoothly once the page is scrolled.
 */
export default function BoatLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Appu's Kerala Store, go to homepage" className={`group flex items-center gap-3 ${className}`}>
      <span
        className={`ease-fluid relative flex shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(36,27,15,0.18)] ring-1 ring-kerala-yellow/50 transition-all duration-500 group-hover:-translate-y-0.5 ${
          compact ? "h-11 w-11" : "h-16 w-16 sm:h-20 sm:w-20"
        }`}
      >
        <Image src="/logo.webp" alt="Appu's Kerala Store" width={400} height={400} priority className="h-[92%] w-[92%] object-contain" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`ease-fluid font-display font-semibold italic text-kerala-green-dark transition-all duration-500 ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
          Appu&apos;s
        </span>
        <span
          className={`ease-fluid overflow-hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-kerala-brown/70 transition-all duration-500 ${
            compact ? "mt-0 max-h-0 opacity-0" : "mt-1 max-h-4 opacity-100"
          }`}
        >
          Kerala Store
        </span>
      </span>
    </Link>
  );
}
