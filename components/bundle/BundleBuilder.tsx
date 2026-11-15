"use client";

import type { PublicCombo } from "@estoreclub/api";
import type { BundleChoice, BundleProduct } from "../../lib/bundle";

import { useEffect, useState } from "react";

import { setCartOpen } from "@estoreclub/storefront/web";
import { money } from "@estoreclub/storefront";
import { addBundle } from "../../lib/addBundle";
import { setBundlePicks } from "../../lib/bundlePicks";
import {
  bundlePrice,
  choiceReady,
  choose,
  optionAvailable,
  placesOf,
} from "../../lib/bundle";
import { useText } from "../ContentProvider";
import { QuantityStepper } from "../QuantityStepper";

import { BundlePlace } from "./BundlePlace";

/** The places that have only one way to be filled, filled - the starter kit's case and charger. */
function startingChoices(
  combo: PublicCombo,
  products: Record<string, BundleProduct>,
): Record<string, BundleChoice> {
  const start: Record<string, BundleChoice> = {};

  for (const place of placesOf(combo)) {
    const slot = combo.slots.find((item) => item.id === place.slotId);
    const offered = (slot?.options ?? []).filter((option) =>
      optionAvailable(option, products[option.productId]),
    );

    if (offered.length === 1) {
      start[place.key] = choose(offered[0], products[offered[0].productId]);
    }
  }

  return start;
}

/**
 * Putting a bundle together on its page: one product per place, each in its colour, then into
 * the bag as one line.
 *
 * A place with a single product to offer starts filled with it, in its first colour on sale, so
 * a fixed kit asks only which colours. "Add bundle" stays off until every place is filled: the
 * server refuses a combo a slot short, and a shopper should hear that from the button, not from
 * a bag that did not change. The price on it follows the picks, as it will on the bill.
 *
 * An island: rendered on the server with the first picks made, so the page reads whole before
 * it hydrates.
 */
export function BundleBuilder({
  combo,
  products,
}: {
  combo: PublicCombo;
  products: Record<string, BundleProduct>;
}) {
  const t = useText();
  const places = placesOf(combo);
  const [choices, setChoices] = useState<Record<string, BundleChoice>>(() =>
    startingChoices(combo, products),
  );
  const [qty, setQty] = useState(1);

  // The first place of each slot names the product the details below describe.
  useEffect(() => {
    const picked: Record<string, string> = {};

    for (const place of places) {
      const choice = choices[place.key];

      if (choice && !picked[place.slotId]) {
        picked[place.slotId] = choice.option.productId;
      }
    }
    setBundlePicks(combo.id, picked);
  }, [choices, combo.id, places]);

  const filled = places.map((place) => choices[place.key]);
  const complete = places.every((place) => {
    const choice = choices[place.key];

    return choiceReady(choice, choice && products[choice.option.productId]);
  });
  const unit = bundlePrice(
    combo,
    filled.filter((choice): choice is BundleChoice => !!choice),
    products,
  );

  const add = () => {
    if (!complete) return;
    setCartOpen(true);
    void addBundle(combo, places, choices, products, qty);
  };

  return (
    <div>
      <div className="space-y-5">
        {places.map((place) => {
          const slot = combo.slots.find((item) => item.id === place.slotId);

          return (
            <BundlePlace
              key={place.key}
              choice={choices[place.key]}
              name={combo.id + "-" + place.key}
              options={slot?.options ?? []}
              products={products}
              // "Your controller", then "Your controller 2" for a slot that takes two.
              title={
                place.index > 0
                  ? `${place.name} ${place.index + 1}`
                  : place.name
              }
              onChoose={(choice) =>
                setChoices((current) => ({ ...current, [place.key]: choice }))
              }
            />
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <QuantityStepper qty={qty} onChange={setQty} />
        <button
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c9ccd2]"
          disabled={!complete}
          type="button"
          onClick={add}
        >
          <span className="min-w-0 truncate">
            {complete ? t("bundle.add") : t("bundle.chooseAll")}
          </span>
          {complete ? (
            <span className="shrink-0 tabular-nums">{money(unit * qty)}</span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
