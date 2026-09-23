import Link from "next/link";

/** Clickable brand mark: a stylised Kerala snake-boat (houseboat) icon + wordmark, linking home. */
export default function BoatLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Appu's Kerala Store — go to homepage"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <svg
        viewBox="0 0 64 48"
        className="h-10 w-14 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
        role="img"
        aria-hidden="true"
      >
        <path
          d="M2 30 Q32 20 62 30 L58 26 Q32 17 6 26 Z"
          fill="var(--kerala-brown)"
        />
        <path
          d="M4 30 C 10 42, 54 42, 60 30 C 46 36, 18 36, 4 30 Z"
          fill="var(--kerala-red)"
          stroke="var(--kerala-red-dark)"
          strokeWidth="1"
        />
        <path d="M8 30 L56 30 L52 33 L12 33 Z" fill="var(--kerala-yellow)" opacity="0.85" />
        <path
          d="M30 26 L34 26 L34 6 C40 8 43 13 43 18 L34 18"
          fill="none"
          stroke="var(--kerala-green-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="30" r="1.6" fill="var(--kerala-cream)" />
        <circle cx="22" cy="30" r="1.6" fill="var(--kerala-cream)" />
        <circle cx="42" cy="30" r="1.6" fill="var(--kerala-cream)" />
        <circle cx="50" cy="30" r="1.6" fill="var(--kerala-cream)" />
      </svg>
      <span className="font-display leading-tight">
        <span className="block text-lg font-bold text-kerala-green-dark group-hover:text-kerala-red transition-colors">
          Appu&apos;s Kerala Store
        </span>
        <span className="block text-[11px] font-medium tracking-wide text-kerala-brown/80">
          Viman Nagar, Pune
        </span>
      </span>
    </Link>
  );
}
