"use client";

import type { Line } from "@estoreclub/storefront/web";

import { setLineQty } from "@estoreclub/storefront/web";
import { money } from "@estoreclub/storefront";

import { LineImage } from "./LineImage";
import { useText } from "./ContentProvider";

/**
 * One line of the bag: the photo, the product and its colour (or a kit's picks), what one
 * costs, how many, and what that comes to. Minus at one removes the line, as the bin beside it
 * does.
 *
 * Shown in full, never cut with "…": this is the order the shopper checks before paying, and a
 * starter kit's three picks are what they are paying for.
 */
export function CartLine({ line }: { line: Line }) {
  const t = useText();

  return (
    <li className="relative flex gap-4 py-5">
      <LineImage className="h-[88px] w-[88px] rounded-xl" line={line} />

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="break-words pr-9 text-[14.5px] font-medium text-ink">
          {line.name}
        </p>
        {line.options.length > 0 ? (
          // One choice per item, so a line wraps between picks rather than inside one.
          <ul className="mt-0.5 flex flex-wrap gap-x-1.5 text-[12.5px] leading-[18px] text-muted">
            {line.options.map((option, index) => (
              <li key={option + index} className="break-words">
                {index > 0 ? (
                  <span aria-hidden="true" className="mr-1.5">
                    ·
                  </span>
                ) : null}
                {option}
              </li>
            ))}
          </ul>
        ) : null}
        {/* What ONE costs, before any deal: with two in the bag, the total on the right can then
            be checked by eye. */}
        <p className="mt-0.5 text-[12.5px] tabular-nums text-muted">
          {money(line.unitPrice)}
        </p>
        {line.deals.length > 0 ? (
          <p className="mt-1 break-words text-[11.5px] font-medium text-deal">
            {line.deals.join(" · ")}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex h-9 w-[104px] items-center justify-between rounded-full ring-1 ring-line">
            <button
              aria-label={t("cart.fewer", { name: line.name })}
              className="grid h-full w-9 place-items-center rounded-full text-ink transition hover:bg-black/5"
              type="button"
              // At one, this removes the line - `setLineQty` treats zero as a deletion.
              onClick={() => setLineQty(line.key, line.qty - 1)}
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
            <span className="text-[13px] font-medium tabular-nums text-ink">
              {line.qty}
            </span>
            <button
              aria-label={t("cart.more", { name: line.name })}
              className="grid h-full w-9 place-items-center rounded-full text-ink transition hover:bg-black/5"
              type="button"
              onClick={() => setLineQty(line.key, line.qty + 1)}
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

          {/* After any deal, with what it was struck beside it - the server's saving on this
              line, so the bag and the bill agree. */}
          <span className="flex items-baseline gap-2">
            {line.discount > 0 ? (
              <s className="text-[12px] tabular-nums text-muted">
                {money(line.unitPrice * line.qty)}
              </s>
            ) : null}
            <span className="text-[14px] font-semibold tabular-nums text-ink">
              {money(line.unitPrice * line.qty - line.discount)}
            </span>
          </span>
        </div>
      </div>

      <button
        aria-label={t("cart.remove", { name: line.name })}
        className="absolute right-0 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink"
        type="button"
        onClick={() => setLineQty(line.key, 0)}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
        >
          <path
            d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 12.2a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9L17.5 7M10 10.5v6M14 10.5v6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </li>
  );
}
