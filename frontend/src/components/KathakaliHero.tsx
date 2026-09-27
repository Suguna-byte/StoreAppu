"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_PUPIL_OFFSET = 4;

// Precisely measured against public/kathakali-hero.png (a real Kathakali face
// cutout, background removed): center of each painted pupil, as a percentage
// of the image's width/height, so the overlay tracks exactly the right spot
// at any render size.
const LEFT_EYE = { xPct: 41.4, yPct: 56.8 };
const RIGHT_EYE = { xPct: 67.6, yPct: 57.3 };

/**
 * Hero image: the real Kathakali mask photo (background removed) with two
 * small tracking "pupils" overlaid exactly on the painted eyes. They follow
 * the cursor anywhere on the page, with a spinning iris ring for the
 * "rotating eyes" effect.
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
        const ox = Math.cos(angle) * distance;
        const oy = Math.sin(angle) * distance;
        pupil.style.transform = `translate(${ox}px, ${oy}px)`;
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md select-none" style={{ aspectRatio: "350 / 334" }}>
      <Image
        src="/kathakali-hero.png"
        alt="Kathakali dancer's face — the mascot of Appu's Kerala Store"
        fill
        priority
        sizes="(max-width: 768px) 90vw, 420px"
        className="object-contain drop-shadow-xl"
      />

      {[
        { key: "left", eye: LEFT_EYE, anchorRef: leftAnchorRef, pupilRef: leftPupilRef },
        { key: "right", eye: RIGHT_EYE, anchorRef: rightAnchorRef, pupilRef: rightPupilRef },
      ].map(({ key, eye, anchorRef, pupilRef }) => (
        <div
          key={key}
          ref={anchorRef}
          className="absolute flex items-center justify-center"
          style={{
            left: `${eye.xPct}%`,
            top: `${eye.yPct}%`,
            width: 18,
            height: 18,
            marginLeft: -9,
            marginTop: -9,
          }}
        >
          <div
            ref={pupilRef}
            className="flex items-center justify-center transition-transform duration-75 ease-out"
            style={{ width: 18, height: 18 }}
          >
            <div className="animate-iris-spin absolute h-4 w-4 rounded-full border border-dashed border-kerala-yellow-dark/70" />
            <div className="h-1.5 w-1.5 rounded-full bg-black" />
          </div>
        </div>
      ))}
    </div>
  );
}
