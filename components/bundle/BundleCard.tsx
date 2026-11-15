"use client";

import type { PublicCombo } from "@estoreclub/api";
import type { BundleProduct } from "../../lib/bundle";

import { money } from "@estoreclub/storefront";
import { apartPrice, bundleHref, optionAvailable } from "../../lib/bundle";
import { useText } from "../ContentProvider";
import { DealPill } from "../DealPill";
import { SoldOutBadge } from "../product/SoldOutBadge";

import { BundlePhotos } from "./BundlePhotos";

/**
 * One bundle in the deals band: what is in it as a picture (`BundlePhotos`), its name and line,
 * the price it starts from beside what the same things cost apart - struck through, with the
 * saving - and the way in. Two product cards wide, on the same grey, so it reads as a bigger
 * shelf item rather than an advert.
 *
 * The whole card opens the bundle's own page (`/bundle/<id>`, the name's link stretched over the
 * card): even a bundle of fixed products needs its colours chosen there, and a one-tap add would
 * choose them for the shopper. A bundle with a place nothing on sale can fill says "Sold out" -
 * its page still opens, to say what is in it.
 */
export function BundleCard({
  combo,
  products,
}: {
  combo: PublicCombo;
  products: Record<string, BundleProduct>;
}) {
  const t = useText();
  const apart = apartPrice(combo, products);
  const saving = apart > combo.fromPrice ? apart - combo.fromPrice : 0;
  const soldOut = combo.slots.some(
    (slot) =>
      !slot.options.some((option) =>
        optionAvailable(option, products[option.productId]),
      ),
  );
  const href = bundleHref(combo);

  return (
    <article className="group relative flex h-full flex-col rounded-[10px] bg-tile px-4 pb-[22px] pt-[16px] sm:px-6">
      <DealPill className="pointer-events-none absolute left-3 top-3 z-[1]">
        {saving ? t("deal.save", { amount: money(saving) }) : t("bundle.badge")}
      </DealPill>
      {soldOut ? (
        <SoldOutBadge
          className="pointer-events-none absolute right-3 top-3 z-[1]"
          label={t("product.soldOut")}
        />
      ) : null}

      <div
        className={
          "w-full transition duration-300 group-hover:scale-[1.02] " +
          (soldOut ? "opacity-55" : "")
        }
      >
        <BundlePhotos className="h-[146px]" combo={combo} products={products} />
      </div>

      <div className="mt-[14px] flex flex-1 flex-col items-center text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand">
          {t("bundle.badge")}
        </p>
        <h3 className="mt-1 text-[15px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          <a
            aria-label={t("bundle.view", { name: combo.name })}
            className="rounded-[10px] outline-offset-4 after:absolute after:inset-0 after:rounded-[10px] group-hover:underline"
            href={href}
          >
            {combo.name}
          </a>
        </h3>
        {combo.description ? (
          <p className="mt-[7px] max-w-[340px] text-[12px] leading-[1.45] text-muted">
            {combo.description}
          </p>
        ) : null}

        <p className="mb-[20px] mt-[12px] flex items-baseline gap-1.5 text-[15px] font-semibold tabular-nums tracking-[-0.01em] text-ink">
          <span className="text-[11.5px] font-normal text-muted">
            {t("bundle.from")}
          </span>
          {money(combo.fromPrice)}
          {saving ? (
            <s className="text-[11.5px] font-normal text-muted">
              {money(apart)}
            </s>
          ) : null}
        </p>

        {/* What the card does when clicked anywhere, said as a button - the stretched link is the
            real target, so this one is only its picture. */}
        <span
          aria-hidden="true"
          className={
            "mt-auto grid h-[30px] w-full max-w-[176px] place-items-center rounded-full text-[11px] font-medium text-white transition " +
            (soldOut ? "bg-[#c9ccd2]" : "bg-ink group-hover:bg-black")
          }
        >
          {soldOut ? t("product.soldOut") : t("bundle.choose")}
        </span>
      </div>
    </article>
  );
}
