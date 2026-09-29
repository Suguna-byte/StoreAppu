/**
 * Hand-drawn flat illustrations for each product category — real vector
 * images, not emoji glyphs. Each fills a 200x200 tile with a tinted circular
 * backdrop in its own accent color, matching the earthy site palette.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Tile({ bg, children, ...props }: { bg: string } & IconProps) {
  return (
    <svg viewBox="0 0 200 200" {...props}>
      <circle cx="100" cy="100" r="96" fill={bg} />
      {children}
    </svg>
  );
}

export function ClothingIllustration(props: IconProps) {
  return (
    <Tile bg="#e8c9a3" {...props}>
      <path d="M55 60 Q100 40 145 60 L138 150 Q100 165 62 150 Z" fill="#fdf6e8" stroke="#5c3a21" strokeWidth="2" />
      <path d="M55 60 Q100 40 145 60 L142 78 Q100 60 58 78 Z" fill="#e0a72e" />
      <path d="M62 150 Q100 165 138 150 L136 138 Q100 152 64 138 Z" fill="#e0a72e" />
      <path d="M70 90 L130 90" stroke="#b9860f" strokeWidth="2" strokeDasharray="3 4" />
      <path d="M70 112 L130 112" stroke="#b9860f" strokeWidth="2" strokeDasharray="3 4" />
    </Tile>
  );
}

export function GroceriesIllustration(props: IconProps) {
  return (
    <Tile bg="#e8d183" {...props}>
      <path
        d="M75 75 C 75 60 125 60 125 75 L132 145 C 132 158 68 158 68 145 Z"
        fill="#c9a05e"
        stroke="#8a6a3a"
        strokeWidth="2.5"
      />
      <path d="M82 75 Q100 65 118 75" fill="none" stroke="#8a6a3a" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 95 L125 95" stroke="#8a6a3a" strokeWidth="2" opacity="0.5" />
      <ellipse cx="145" cy="120" rx="7" ry="3.5" fill="#fdf6e8" transform="rotate(20 145 120)" />
      <ellipse cx="155" cy="130" rx="7" ry="3.5" fill="#fdf6e8" transform="rotate(-10 155 130)" />
      <ellipse cx="140" cy="135" rx="7" ry="3.5" fill="#fdf6e8" transform="rotate(45 140 135)" />
    </Tile>
  );
}

export function HomeEssentialsIllustration(props: IconProps) {
  return (
    <Tile bg="#d3c19c" {...props}>
      <path
        d="M60 95 C 60 130 75 150 100 150 C 125 150 140 130 140 95 Z"
        fill="#b9860f"
        stroke="#5c3a21"
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy="95" rx="40" ry="10" fill="#e0a72e" stroke="#5c3a21" strokeWidth="2" />
      <path d="M55 92 Q100 78 145 92" fill="none" stroke="#5c3a21" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="60" r="8" fill="#a3312a" />
      <path d="M92 68 Q100 58 108 68" fill="none" stroke="#2f5233" strokeWidth="3" strokeLinecap="round" />
    </Tile>
  );
}

export function KeralaSpecialsIllustration(props: IconProps) {
  const petals = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const x = 100 + Math.cos(angle) * 38;
    const y = 100 + Math.sin(angle) * 38;
    return (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx="16"
        ry="9"
        fill={i % 2 === 0 ? "#a3312a" : "#e0a72e"}
        transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`}
      />
    );
  });
  return (
    <Tile bg="#edc27e" {...props}>
      {petals}
      <circle cx="100" cy="100" r="22" fill="#2f5233" stroke="#e0a72e" strokeWidth="3" />
      <circle cx="100" cy="100" r="10" fill="#e0a72e" />
    </Tile>
  );
}

export function OilsGheeIllustration(props: IconProps) {
  return (
    <Tile bg="#cdd39c" {...props}>
      <path
        d="M85 70 L115 70 L120 85 C 138 95 140 160 100 160 C 60 160 62 95 80 85 Z"
        fill="#b9860f"
        stroke="#5c3a21"
        strokeWidth="2.5"
      />
      <rect x="88" y="55" width="24" height="18" rx="3" fill="#8a6a3a" stroke="#5c3a21" strokeWidth="2" />
      <ellipse cx="100" cy="105" rx="24" ry="10" fill="#e0a72e" opacity="0.7" />
      <path
        d="M130 90 Q145 100 140 118"
        fill="none"
        stroke="#2f5233"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="141" cy="124" rx="4" ry="6" fill="#2f5233" />
    </Tile>
  );
}

export function SnacksChipsIllustration(props: IconProps) {
  return (
    <Tile bg="#e8b769" {...props}>
      <path
        d="M55 110 C 55 90 145 90 145 110 L138 145 C 138 155 62 155 62 145 Z"
        fill="#a3312a"
        stroke="#7a2420"
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy="110" rx="45" ry="12" fill="#c9432c" />
      <circle cx="82" cy="100" r="11" fill="#e0a72e" stroke="#b9860f" strokeWidth="1.5" />
      <circle cx="108" cy="96" r="11" fill="#f2c157" stroke="#b9860f" strokeWidth="1.5" />
      <circle cx="120" cy="106" r="11" fill="#e0a72e" stroke="#b9860f" strokeWidth="1.5" />
      <circle cx="95" cy="110" r="11" fill="#f2c157" stroke="#b9860f" strokeWidth="1.5" />
    </Tile>
  );
}

export function SpicesMasalaIllustration(props: IconProps) {
  return (
    <Tile bg="#e0a688" {...props}>
      <path
        d="M65 110 C 65 130 75 145 100 145 C 125 145 135 130 135 110 Z"
        fill="#8a6a3a"
        stroke="#5c3a21"
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy="110" rx="35" ry="9" fill="#c9a05e" />
      <path d="M85 95 Q90 75 78 65" fill="none" stroke="#a3312a" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 92 Q100 70 100 58" fill="none" stroke="#2f5233" strokeWidth="5" strokeLinecap="round" />
      <path d="M115 95 Q112 75 124 65" fill="none" stroke="#e0a72e" strokeWidth="5" strokeLinecap="round" />
      <circle cx="78" cy="62" r="4" fill="#a3312a" />
      <circle cx="100" cy="55" r="4" fill="#2f5233" />
      <circle cx="124" cy="62" r="4" fill="#e0a72e" />
    </Tile>
  );
}

export const CATEGORY_ILLUSTRATIONS: Record<string, (props: IconProps) => React.ReactElement> = {
  cloth: ClothingIllustration,
  grocery: GroceriesIllustration,
  home: HomeEssentialsIllustration,
  kerala: KeralaSpecialsIllustration,
  oil: OilsGheeIllustration,
  snack: SnacksChipsIllustration,
  spice: SpicesMasalaIllustration,
};
