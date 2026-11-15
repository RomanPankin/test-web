"use client";

import type { TechProduct } from "../../lib/product";

import { useBundlePicks } from "../../lib/bundlePicks";

import { BundleItem } from "./BundleItem";

/** A slot of the bundle with the products it may be filled from, in the shop's order. */
export interface BundleDetailsSlot {
  id: string;
  name: string;
  products: TechProduct[];
}

/**
 * What is in the bundle, described - one `BundleItem` per slot: the product picked for it in
 * `BundleBuilder` (shared through `useBundlePicks`), else the slot's first product. A slot
 * offering two consoles describes only the one chosen, and changes with the pick.
 */
export function BundleDetails({
  comboId,
  slots,
}: {
  comboId: string;
  slots: BundleDetailsSlot[];
}) {
  const picks = useBundlePicks(comboId);
  const seen = new Set<string>();
  const items = slots.flatMap((slot) => {
    const product =
      slot.products.find((each) => each.id === picks[slot.id]) ??
      slot.products[0];

    if (!product || seen.has(product.id)) return [];
    seen.add(product.id);

    return [{ product, place: slot.name }];
  });

  return (
    <div className="mt-10 space-y-16 lg:space-y-20">
      {items.map(({ product, place }, index) => (
        <BundleItem
          key={product.id}
          place={place}
          product={product}
          reversed={index % 2 === 1}
        />
      ))}
    </div>
  );
}
