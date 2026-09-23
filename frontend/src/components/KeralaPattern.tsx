/**
 * Decorative full-bleed backdrop of Kerala mural-style motifs (temple arches,
 * paisley leaves, kolam dots) rendered as a low-opacity, non-interactive SVG
 * tile so it reads as texture rather than competing with foreground content.
 */
export default function KeralaPattern({
  variant = "mural",
  className = "",
}: {
  variant?: "mural" | "leaves";
  className?: string;
}) {
  const patternId = `kerala-pattern-${variant}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <svg width="100%" height="100%" className="opacity-[0.07]">
        <defs>
          <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
            {variant === "mural" ? (
              <>
                <path
                  d="M10 100 Q10 60 40 60 Q70 60 70 100"
                  fill="none"
                  stroke="var(--kerala-brown)"
                  strokeWidth="3"
                />
                <circle cx="40" cy="55" r="6" fill="var(--kerala-red)" />
                <path
                  d="M90 20 C 100 30 100 45 90 55 C 80 45 80 30 90 20 Z"
                  fill="var(--kerala-green)"
                />
                <circle cx="15" cy="20" r="3" fill="var(--kerala-yellow-dark)" />
                <circle cx="105" cy="95" r="3" fill="var(--kerala-yellow-dark)" />
              </>
            ) : (
              <>
                <path
                  d="M60 10 C 80 30 80 60 60 90 C 40 60 40 30 60 10 Z"
                  fill="var(--kerala-green)"
                />
                <path d="M60 10 L60 90" stroke="var(--kerala-green-dark)" strokeWidth="1.5" />
                <circle cx="15" cy="105" r="4" fill="var(--kerala-red)" />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
