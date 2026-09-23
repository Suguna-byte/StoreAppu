"use client";

export default function QuantityStepper({
  quantity,
  onChange,
  max,
  disabled,
}: {
  quantity: number;
  onChange: (next: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-kerala-green/40">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="px-3 py-1 text-kerala-green-dark disabled:opacity-30"
      >
        −
      </button>
      <span className="min-w-[2ch] text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || (max !== undefined && quantity >= max)}
        onClick={() => onChange(quantity + 1)}
        className="px-3 py-1 text-kerala-green-dark disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
