"use client";

import { useEffect, useRef } from "react";

const MAX_PUPIL_OFFSET = 6;

/**
 * Stylised, original SVG Kathakali face (not a photo of a real performer) —
 * the eyes' pupils track the cursor anywhere on the page, and a decorative
 * iris ring behind each pupil spins continuously, giving the "rotating eyes
 * follow the cursor" effect the hero asks for.
 */
export default function KathakaliHero() {
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      for (const [eyeRef, pupilRef] of [
        [leftEyeRef, leftPupilRef],
        [rightEyeRef, rightPupilRef],
      ] as const) {
        const eye = eyeRef.current;
        const pupil = pupilRef.current;
        if (!eye || !pupil) continue;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(MAX_PUPIL_OFFSET, Math.hypot(dx, dy) / 12);
        const ox = Math.cos(angle) * distance;
        const oy = Math.sin(angle) * distance;
        pupil.style.transform = `translate(${ox}px, ${oy}px)`;
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md select-none">
      <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-xl">
        {/* Crown (kireedam) */}
        <path
          d="M60 90 C 90 20 210 20 240 90 L225 80 L205 55 L190 80 L170 45 L150 78 L130 45 L110 80 L95 55 L75 80 Z"
          fill="var(--kerala-red)"
          stroke="var(--kerala-yellow)"
          strokeWidth="3"
        />
        <circle cx="150" cy="40" r="10" fill="var(--kerala-yellow)" />
        <circle cx="110" cy="55" r="6" fill="var(--kerala-yellow)" />
        <circle cx="190" cy="55" r="6" fill="var(--kerala-yellow)" />

        {/* Face - Pacha (green) makeup */}
        <ellipse cx="150" cy="175" rx="88" ry="95" fill="var(--kerala-green)" />

        {/* White rice-paste chutti ridge framing the face */}
        <path
          d="M70 150 C 40 190 55 250 100 265 C 130 278 170 278 200 265 C 245 250 260 190 230 150"
          fill="none"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M70 150 C 40 190 55 250 100 265 C 130 278 170 278 200 265 C 245 250 260 190 230 150"
          fill="none"
          stroke="var(--kerala-red)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyebrows */}
        <path d="M105 145 Q120 132 138 142" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <path d="M162 142 Q180 132 195 145" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />

        {/* Eye sockets (black kajal outline + white sclera) */}
        <g>
          <ellipse cx="122" cy="168" rx="26" ry="17" fill="black" />
          <ellipse cx="122" cy="168" rx="20" ry="12" fill="white" />
          <circle ref={leftEyeRef} cx="122" cy="168" r="1" fill="transparent" />
        </g>
        <g>
          <ellipse cx="178" cy="168" rx="26" ry="17" fill="black" />
          <ellipse cx="178" cy="168" rx="20" ry="12" fill="white" />
          <circle ref={rightEyeRef} cx="178" cy="168" r="1" fill="transparent" />
        </g>

        {/* Nose + lips */}
        <path d="M150 175 L144 205 Q150 210 156 205 Z" fill="var(--kerala-green-dark)" opacity="0.5" />
        <path
          d="M120 230 Q150 250 180 230 Q150 245 120 230 Z"
          fill="var(--kerala-red)"
          stroke="black"
          strokeWidth="1.5"
        />

        {/* Beard/jaw white fringe */}
        <path
          d="M85 210 C 80 245 110 270 150 270 C 190 270 220 245 215 210"
          fill="none"
          stroke="white"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

      {/* Pupils rendered as HTML absolutely positioned over the SVG so they can
          use a simple CSS transform for tracking + a spinning iris ring. */}
      <div
        ref={leftPupilRef}
        className="absolute flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ left: "40.6%", top: "56%", width: 22, height: 22, marginLeft: -11, marginTop: -11 }}
      >
        <div className="animate-iris-spin absolute h-full w-full rounded-full border-2 border-dashed border-kerala-yellow-dark" />
        <div className="h-3 w-3 rounded-full bg-kerala-brown" />
      </div>
      <div
        ref={rightPupilRef}
        className="absolute flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ left: "59.4%", top: "56%", width: 22, height: 22, marginLeft: -11, marginTop: -11 }}
      >
        <div className="animate-iris-spin absolute h-full w-full rounded-full border-2 border-dashed border-kerala-yellow-dark" />
        <div className="h-3 w-3 rounded-full bg-kerala-brown" />
      </div>
    </div>
  );
}
