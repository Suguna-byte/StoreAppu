"use client";

import { useEffect, useRef } from "react";

const MAX_PUPIL_OFFSET = 5;

// The character art is drawn on its own 340x380 grid, then centered inside a
// larger canvas with generous margin — that margin is what gives the CSS
// fade-mask room to blend the edges into the page background without eating
// into the crown, earrings or beard themselves.
const ART_W = 340;
const ART_H = 380;
const MARGIN_X = 62;
const MARGIN_Y = 65;
const VIEW_W = ART_W + MARGIN_X * 2;
const VIEW_H = ART_H + MARGIN_Y * 2;

// Eye centers are exact SVG coordinates (art-space + the same margin offset
// applied to everything else), so the tracking overlay always lands exactly
// on the painted eyes at any render size — no estimation involved.
const LEFT_EYE = { cx: 132 + MARGIN_X, cy: 206 + MARGIN_Y };
const RIGHT_EYE = { cx: 208 + MARGIN_X, cy: 206 + MARGIN_Y };
const pct = (v: number, total: number) => (v / total) * 100;

/**
 * An original, hand-built Kathakali face illustration (not a photo, and a
 * fresh design — not the earlier simplified version). The pupils track the
 * cursor anywhere on the page, with a spinning iris ring for the "rotating
 * eyes" effect, and the whole piece fades out in the margin around it via a
 * CSS mask so it blends into the hero section's background.
 */
export default function KathakaliHero() {
  const leftAnchorRef = useRef<HTMLDivElement>(null);
  const rightAnchorRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      for (const [anchorRef, pupilRef] of [
        [leftAnchorRef, leftPupilRef],
        [rightAnchorRef, rightPupilRef],
      ] as const) {
        const anchor = anchorRef.current;
        const pupil = pupilRef.current;
        if (!anchor || !pupil) continue;
        const rect = anchor.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(MAX_PUPIL_OFFSET, Math.hypot(dx, dy) / 14);
        pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // `closest-side` sizing makes each gradient stop a straightforward percentage
  // of the distance from center to the nearest edge — the art's bounding box
  // reaches ~70% of that distance, so full opacity holds to 74% (fully
  // covering the character) and only the added margin fades out after that.
  const fadeMask =
    "radial-gradient(ellipse closest-side at 50% 50%, black 74%, rgba(0,0,0,0.5) 88%, transparent 100%)";

  return (
    <div
      className="relative mx-auto w-full select-none"
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}`, WebkitMaskImage: fadeMask, maskImage: fadeMask }}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full">
        <defs>
          <radialGradient id="faceGrad" cx="45%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#5c8f4f" />
            <stop offset="70%" stopColor="var(--kerala-green)" />
            <stop offset="100%" stopColor="var(--kerala-green-dark)" />
          </radialGradient>
          <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9432c" />
            <stop offset="100%" stopColor="var(--kerala-red-dark)" />
          </linearGradient>
        </defs>

        <g
          transform={`translate(${MARGIN_X}, ${MARGIN_Y})`}
          style={{ filter: "drop-shadow(0 10px 18px rgba(60, 40, 20, 0.22))" }}
        >
          {/* Outer crown tier */}
          <path
            d="M55 175 C 60 70 130 25 170 25 C 210 25 280 70 285 175 L 255 150 L 235 90 L 205 130 L 185 60 L 170 105 L 155 60 L 135 130 L 105 90 L 85 150 Z"
            fill="url(#crownGrad)"
            stroke="var(--kerala-yellow)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="170" cy="35" r="9" fill="var(--kerala-yellow)" />
          <circle cx="120" cy="58" r="5.5" fill="var(--kerala-yellow)" />
          <circle cx="220" cy="58" r="5.5" fill="var(--kerala-yellow)" />

          {/* Face */}
          <ellipse cx="170" cy="222" rx="100" ry="108" fill="url(#faceGrad)" />

          {/* Pearl-beaded headband (chuttipatti) — drawn after the face so it
              sits on top of the hairline instead of being painted over. */}
          <path
            d="M62 172 C 90 145 250 145 278 172 L 278 192 C 250 167 90 167 62 192 Z"
            fill="var(--kerala-green-dark)"
            stroke="var(--kerala-yellow-dark)"
            strokeWidth="1.5"
          />
          {Array.from({ length: 13 }).map((_, i) => {
            const x = 68 + i * 17.5;
            const y = 179 - Math.sin((i / 12) * Math.PI) * 6;
            return <circle key={i} cx={x} cy={y} r="4.6" fill="#f2f7fb" stroke="#7c93a3" strokeWidth="0.8" />;
          })}

          {/* White chutti ridge framing jaw. A thin dark rim underneath gives it
              definition against the page's own pale cream background (plain
              white-on-cream would otherwise have almost no contrast). */}
          <path
            d="M75 195 C 35 245 55 320 115 340 C 145 352 195 352 225 340 C 285 320 305 245 265 195"
            fill="none"
            stroke="#8a6a4a"
            strokeWidth="19"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M75 195 C 35 245 55 320 115 340 C 145 352 195 352 225 340 C 285 320 305 245 265 195"
            fill="none"
            stroke="#fbfaf6"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M75 195 C 35 245 55 320 115 340 C 145 352 195 352 225 340 C 285 320 305 245 265 195"
            fill="none"
            stroke="var(--kerala-red)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Earrings (thoda): layered rings + petals */}
          {[55, 285].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy={205} r="34" fill="var(--kerala-yellow)" stroke="var(--kerala-yellow-dark)" strokeWidth="3" />
              <circle cx={cx} cy={205} r="34" fill="none" stroke="var(--kerala-red-dark)" strokeWidth="1.5" strokeDasharray="4 3" />
              {Array.from({ length: 8 }).map((_, p) => {
                const angle = (p / 8) * Math.PI * 2;
                const px = cx + Math.cos(angle) * 22;
                const py = 205 + Math.sin(angle) * 22;
                return <circle key={p} cx={px} cy={py} r="5" fill="var(--kerala-red)" />;
              })}
              <circle cx={cx} cy={205} r="11" fill="var(--kerala-red)" stroke="var(--kerala-yellow-dark)" strokeWidth="2" />
            </g>
          ))}

          {/* Forehead marking: yellow chevron + red tilak + bindi */}
          <path d="M148 150 L170 128 L192 150 L170 168 Z" fill="var(--kerala-yellow)" opacity="0.9" />
          <path d="M155 172 L170 190 L185 172 Z" fill="var(--kerala-red)" />
          <ellipse cx="170" cy="145" rx="4" ry="8" fill="black" />
          <circle cx="170" cy="200" r="4" fill="var(--kerala-red-dark)" />

          {/* Eyebrows */}
          <path d="M100 190 Q118 172 145 186" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />
          <path d="M195 186 Q222 172 240 190" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />

          {/* Eyes: black kajal outline + white sclera (pupil overlay renders on top) */}
          <g>
            <ellipse cx="132" cy="206" rx="30" ry="19" fill="black" />
            <ellipse cx="132" cy="206" rx="23" ry="13" fill="white" />
          </g>
          <g>
            <ellipse cx="208" cy="206" rx="30" ry="19" fill="black" />
            <ellipse cx="208" cy="206" rx="23" ry="13" fill="white" />
          </g>

          {/* Nose shading */}
          <path d="M170 210 L162 245 Q170 251 178 245 Z" fill="var(--kerala-green-dark)" opacity="0.45" />

          {/* Moustache curls (classic Pacha upturned curls) */}
          <path d="M118 275 Q100 268 96 250 Q108 262 128 268" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />
          <path d="M222 275 Q240 268 244 250 Q232 262 212 268" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />

          {/* Lips */}
          <path
            d="M138 278 Q170 300 202 278 Q170 296 138 278 Z"
            fill="var(--kerala-red)"
            stroke="#5c1a15"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {[
        { key: "left", eye: LEFT_EYE, anchorRef: leftAnchorRef, pupilRef: leftPupilRef },
        { key: "right", eye: RIGHT_EYE, anchorRef: rightAnchorRef, pupilRef: rightPupilRef },
      ].map(({ key, eye, anchorRef, pupilRef }) => (
        <div
          key={key}
          ref={anchorRef}
          className="absolute flex items-center justify-center"
          style={{
            left: `${pct(eye.cx, VIEW_W)}%`,
            top: `${pct(eye.cy, VIEW_H)}%`,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        >
          <div
            ref={pupilRef}
            className="flex items-center justify-center transition-transform duration-75 ease-out"
            style={{ width: 20, height: 20 }}
          >
            <div className="animate-iris-spin absolute h-4 w-4 rounded-full border border-dashed border-kerala-yellow-dark/70" />
            <div className="h-2 w-2 rounded-full bg-black" />
          </div>
        </div>
      ))}
    </div>
  );
}
