"use client";

import type { TechProduct } from "../lib/product";

import { setUpsell } from "@estoreclub/storefront/web";

/**
 * Hands the shop's accessories to the bag, for its "Complete your order" (`CartUpsell`). Set
 * during render, like `VocabularySeed`, so the drawer has them the moment it opens. Renders
 * nothing.
 */
export function UpsellSeed({ items }: { items: TechProduct[] }) {
  setUpsell(items);

  return null;
}
