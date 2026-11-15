"use client";

import type { SiteCurrency } from "@estoreclub/storefront";

import { setMoneyLocale, setSiteCurrency } from "@estoreclub/storefront";

/**
 * Hands the server's read of the shop's currency and language to the client modules that price
 * with them.
 *
 * Set during RENDER rather than in an effect, for the same reason `VocabularySeed` does: the cart
 * prices its lines the moment it hydrates, and a currency that arrived one effect later would
 * paint every price in the default sign first and correct it a frame afterwards.
 *
 * The `locale` matters as much as the currency: it fixes how the number is grouped, and it must
 * be the SAME on the server and the client or every price is a hydration mismatch — which is why
 * it is seeded here (from the shop's language) rather than left to `Intl`'s ambient default.
 *
 * Renders nothing. It exists to be mounted.
 */
export function MoneySeed({
  currency,
  locale,
}: {
  currency: Partial<SiteCurrency> | null;
  locale?: string;
}) {
  setSiteCurrency(currency);
  setMoneyLocale(locale);

  return null;
}
