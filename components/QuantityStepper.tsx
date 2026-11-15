"use client";

import { useText } from "./ContentProvider";

/**
 * How many, as a pill: minus, the count, plus. Never below one - the product dialog is for
 * adding. The "Add to bag" button's height, so the two sit on one row.
 */
export function QuantityStepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  const t = useText();
  const button =
    "grid h-full w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 disabled:opacity-35 disabled:hover:bg-transparent";

  return (
    <div className="flex h-12 w-[124px] shrink-0 items-center justify-between rounded-full ring-1 ring-line">
      <button
        aria-label={t("qty.decrease")}
        className={button}
        disabled={qty === 1}
        type="button"
        onClick={() => onChange(Math.max(1, qty - 1))}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="12"
          viewBox="0 0 12 12"
          width="12"
        >
          <path
            d="M2 6h8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      <span
        aria-live="polite"
        className="text-[14.5px] font-medium tabular-nums text-ink"
      >
        {qty}
      </span>
      <button
        aria-label={t("qty.increase")}
        className={button}
        type="button"
        onClick={() => onChange(qty + 1)}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="12"
          viewBox="0 0 12 12"
          width="12"
        >
          <path
            d="M6 2v8M2 6h8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
}
