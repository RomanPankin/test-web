"use client";

import type { Line } from "@estoreclub/storefront/web";
import type { TechProduct } from "../lib/product";

import { useUpsell } from "@estoreclub/storefront/web";

import { productHref } from "../lib/productUrl";

import { useText } from "./ContentProvider";
import { ProductImage } from "./product/ProductImage";

/** Thumbnails in the card. Enough to say "accessories" without becoming a second shop. */
const SHOWN = 4;

/**
 * "Complete your order": the shop's accessories, offered under the bag (seeded by the layout,
 * `UpsellSeed`).
 *
 * Only what is not already in it - offering the case that is two lines up reads as not having
 * looked. Each thumbnail opens that product's dialog over the bag, and "+" opens the first:
 * picking a colour is still the dialog's job, and a one-tap add here would skip it.
 *
 * No discount is promised here. A deal on an accessory is the server's to apply, and the bag
 * shows it on the line once it is in.
 */
export function CartUpsell({ lines }: { lines: Line[] }) {
  const t = useText();
  const all = useUpsell<TechProduct>();
  const inCart = new Set(lines.map((line) => line.productId));
  const offered = all
    .filter(
      (item) =>
        !inCart.has(item.id) &&
        !item.soldOut &&
        // Nothing to sell in a product whose every colour is sold out.
        (item.colours.length === 0 ||
          item.colours.some((colour) => colour.available)),
    )
    .slice(0, SHOWN);

  if (offered.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl bg-tile px-5 pb-4 pt-5">
      <p className="text-[14px] font-medium text-ink">{t("upsell.title")}</p>
      {/* The shop's own line about what it offers here - none written, none drawn. */}
      {t("upsell.text") ? (
        <p className="mt-0.5 text-[12px] text-muted">{t("upsell.text")}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <ul className="flex min-w-0 gap-2.5">
          {offered.map((item) => (
            <li key={item.id}>
              <a
                aria-label={t("product.view", { name: item.name })}
                className="grid h-[52px] w-[52px] place-items-center rounded-lg bg-white transition hover:-translate-y-0.5"
                title={item.name}
                href={productHref(item)}
              >
                <ProductImage
                  className="h-[40px] w-[40px]"
                  sizes="52px"
                  src={item.image}
                />
              </a>
            </li>
          ))}
        </ul>
        <a
          aria-label={t("product.view", { name: offered[0].name })}
          className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-black active:scale-95"
          href={productHref(offered[0])}
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            viewBox="0 0 14 14"
            width="14"
          >
            <path
              d="M7 2.5v9M2.5 7h9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
