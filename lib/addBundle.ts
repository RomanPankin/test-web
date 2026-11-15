"use client";

import type { PublicCombo } from "@estoreclub/api";
import type { BundleChoice, BundlePlace, BundleProduct } from "./bundle";

import { addCombo, encodeVariant } from "@estoreclub/storefront/web";

import { learnColour } from "./addToBag";
import { colourOf } from "./bundle";

/**
 * A filled bundle, into the shared bag as ONE line - the server prices it as the combo, and
 * the drawer shows its picks side by side (`LineImage`).
 *
 * Each pick carries its colour twice, for two readers: `variantId` is what the server sells
 * (a product with colours is refused without one), and `variant` is the colour encoded as the
 * line's "size" the way `addToBag` encodes it - so the bag writes "Phone 16 Pro (Black
 * Titanium)" under the bundle rather than a bare name. A colour the page was not seeded with is
 * learned first, or the encoding would drop it.
 */
export function addBundle(
  combo: PublicCombo,
  places: BundlePlace[],
  choices: Record<string, BundleChoice>,
  products: Record<string, BundleProduct>,
  qty: number,
): Promise<void> {
  const picks = places.map((place) => {
    const choice = choices[place.key];
    const productId = choice.option.productId;
    const colour = colourOf(choice, products[productId]);

    if (colour) learnColour(productId, colour);

    return {
      slotId: place.slotId,
      productId,
      ...(colour
        ? {
            variantId: colour.id,
            variant: encodeVariant(productId, { size: colour.id, extras: [] }),
          }
        : {}),
    };
  });

  return addCombo(combo.id, picks, qty);
}
