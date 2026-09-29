/**
 * A short hand-drawn-feeling wave, standing in for the plain colored
 * bar most templates put under a heading. Loosely nods to backwater
 * ripples without being a literal, busy illustration.
 */
export default function KeralaFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      className={`flourish-line ${className}`}
      aria-hidden="true"
    >
      <path d="M2 9c8-9 16 9 24 0s16-9 24 0 16 9 24 0 16-9 24 0 16 9 20 2" />
    </svg>
  );
}
