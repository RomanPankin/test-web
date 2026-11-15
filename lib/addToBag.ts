"use client";

import {
  addItem,
  encodeVariant,
  getVocabularies,
  setVocabularies,
  vocabularyFor,
} from "@estoreclub/storefront/web";

import { colourSize } from "./colourVocabulary";

/**
 * One product in one colour, into the shared bag.
 *
 * The colour travels as the line's "size" (`lib/colourVocabulary.ts`): encoded the way the cart
 * encodes every configuration, so a second tap on the same colour adds to its line rather than
 * opening another, and the cart sends the colour's variant id with it.
 *
 * A colour the page has no vocabulary for - a product opened from a QR code that no card on the
 * page rendered, a past order's line - is learned here first. Without it the encoding would drop
 * the colour, the line would go without a variant, and the server would refuse it.
 *
 * Imported only by client modules, like the cart store it writes to.
 */
export function addToBag(
  productId: string,
  colour: { id: string; name: string } | null,
  qty = 1,
): Promise<void> {
  if (colour) learnColour(productId, colour);

  return addItem(
    productId,
    encodeVariant(productId, { size: colour?.id ?? "", extras: [] }),
    qty,
  );
}

/** Teaches the bag a colour it was not seeded with - see above. Also used by `addBundle`. */
export function learnColour(
  productId: string,
  colour: { id: string; name: string },
): void {
  const known = vocabularyFor(productId);

  if (known.sizes.some((size) => size.id === colour.id)) return;

  setVocabularies({
    ...getVocabularies(),
    [productId]: { ...known, sizes: [...known.sizes, colourSize(colour)] },
  });
}
