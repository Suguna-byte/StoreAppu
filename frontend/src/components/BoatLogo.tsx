import Image from "next/image";
import Link from "next/link";

/** Clickable brand mark, linking home. */
export default function BoatLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Appu's Kerala Store — go to homepage"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <Image
        src="/logo.webp"
        alt="Appu's Kerala Store"
        width={400}
        height={400}
        priority
        className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-16 sm:w-16"
      />
      <span className="text-[11px] font-medium tracking-wide text-kerala-brown/80">
        Viman Nagar, Pune
      </span>
    </Link>
  );
}
