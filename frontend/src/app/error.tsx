"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl">🥥</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-kerala-brown">Something went wrong</h1>
      <p className="mt-2 text-kerala-brown/70">
        We couldn&apos;t load this page right now. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-kerala-red px-6 py-2 font-semibold text-kerala-cream transition hover:bg-kerala-red-dark"
      >
        Try again
      </button>
    </div>
  );
}
