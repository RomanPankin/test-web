"use client";

import type { PublicCustomerOrderDetail } from "@estoreclub/api";

import { setCartOpen } from "@estoreclub/storefront/web";

import { addToBag } from "../../../lib/addToBag";

/**
 * Put an old order's lines back in the basket, in the colours they were bought in, and open it.
 *
 * Product lines only: a combo line carries what was picked in its snapshot, not in a shape the
 * cart takes back, and a product since deleted has nothing to add. A line the shop no longer
 * sells is refused by the cart, which says so in a toast; the rest still go in. Answers how
 * many lines were sent, so the page can say when none could be.
 */
export async function reorder(
  order: PublicCustomerOrderDetail,
): Promise<number> {
  const lines = order.lines.filter((line) => line.productId && !line.comboId);

  if (lines.length === 0) return 0;
  setCartOpen(true);
  await Promise.all(
    lines.map((line) =>
      addToBag(
        line.productId as string,
        // The colour by its variant id; its name in the language the order was read in - the
        // stored configuration is the cart's encoding now, not a word.
        line.variantId
          ? { id: line.variantId, name: line.variantName ?? "" }
          : null,
        line.quantity,
      ),
    ),
  );

  return lines.length;
}
