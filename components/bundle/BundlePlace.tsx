"use client";

import type { PublicComboSlotOption } from "@estoreclub/api";
import type { BundleChoice, BundleProduct } from "../../lib/bundle";

import { money, signedMoney } from "@estoreclub/storefront";
import { choose, openColours, optionAvailable } from "../../lib/bundle";
import { useText } from "../ContentProvider";
import { ProductImage } from "../product/ProductImage";
import { Swatches } from "../product/Swatches";

/**
 * One place in a bundle - "Your console" - and what may fill it: the products as rows with
 * their photos, the picked one ringed, then its colours as swatches with the chosen colour
 * named. A place with one product (the starter kit's case) shows it already picked, so all that
 * is left is its colour, if it has a choice of any.
 *
 * A product with none left stays in the list, greyed and saying so - which console the shop
 * sells is still worth knowing - but cannot be picked. Only the colours on sale are offered.
 * A surcharge is shown on the row it applies to; the rows otherwise cost the bundle's price.
 */
export function BundlePlace({
  name,
  title,
  options,
  products,
  choice,
  onChoose,
}: {
  /** The radio groups' name - unique per place, so two places' swatches do not join up. */
  name: string;
  title: string;
  options: PublicComboSlotOption[];
  products: Record<string, BundleProduct>;
  choice: BundleChoice | undefined;
  onChoose: (choice: BundleChoice) => void;
}) {
  const t = useText();
  const product = choice ? products[choice.option.productId] : undefined;
  const colours = choice
    ? openColours(choice.option, product).filter((colour) => colour.available)
    : [];
  const colour = colours.find((item) => item.id === choice?.colourId);

  return (
    <fieldset className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <legend className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink">
        {title}
      </legend>

      <ul className="mt-3 grid gap-2">
        {options.map((option) => {
          const item = products[option.productId];
          const available = optionAvailable(option, item);
          const picked =
            choice?.option.productId === option.productId &&
            choice.option.variantId === option.variantId;

          return (
            <li key={option.productId + (option.variantId ?? "")}>
              <button
                aria-pressed={picked}
                className={
                  "flex w-full items-center gap-3 rounded-[10px] border p-2 pr-3 text-left transition disabled:cursor-not-allowed " +
                  (picked
                    ? "border-ink bg-white"
                    : "border-line bg-white hover:border-ink/30 disabled:hover:border-line")
                }
                disabled={!available}
                type="button"
                onClick={() => onChoose(choose(option, item))}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-tile">
                  {item?.image ? (
                    <ProductImage
                      className={"h-10 w-10 " + (available ? "" : "opacity-50")}
                      sizes="48px"
                      src={item.image}
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={
                      "block truncate text-[14px] font-medium " +
                      (available ? "text-ink" : "text-muted")
                    }
                  >
                    {option.name}
                  </span>
                  <span className="block text-[12px] text-muted">
                    {available
                      ? (option.variantName ?? (item ? money(item.price) : ""))
                      : t("product.soldOut")}
                  </span>
                </span>
                {option.surcharge > 0 ? (
                  <span className="shrink-0 text-[12.5px] tabular-nums text-muted">
                    {signedMoney(option.surcharge)}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {choice && colours.length > 0 ? (
        <div className="mt-4">
          <p className="text-[13px] text-ink">
            <span className="font-medium">{t("product.colour")}</span>
            {colour ? (
              <span className="text-muted"> · {colour.name}</span>
            ) : null}
          </p>
          <Swatches
            className="mt-2.5"
            colours={colours}
            name={name}
            size={20}
            value={choice.colourId ?? null}
            onChange={(colourId) => onChoose({ ...choice, colourId })}
          />
        </div>
      ) : null}
    </fieldset>
  );
}
