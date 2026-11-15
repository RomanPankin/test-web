import type { PublicCombo } from "@estoreclub/api";

import { cache } from "react";
import { getCombos, getDiscountRules } from "@estoreclub/api";

import { resolvePhotos } from "@estoreclub/storefront/server";

/**
 * The shop's discount rules on right now, read once per request - SERVER ONLY (it calls the API
 * with the company key).
 *
 * For the cards' badges and struck-through prices only: the SERVER prices every rule, and the
 * bag shows its answer (each line's saving, each deal by name in the summary). So a rule shown
 * here and the amount charged cannot disagree - the badge only says it first.
 *
 * An unreachable API answers as no deals rather than throwing: a shop with no badges is still a
 * shop, and one that cannot render is not.
 */
export const loadDiscountRules = cache(() =>
  getDiscountRules().catch(() => []),
);

/**
 * The bundles on sale right now - the shop's combos ("Phone 16 Pro Starter Kit"), as
 * `getCombos` lists them: only those inside their dates and hours, and only those every slot of
 * which something on sale can fill. Read once per request; empty when the API cannot be reached.
 *
 * A combo's own pictures come back as bare addresses; each is looked up here and handed on with
 * its resized copies (still `{ url }`), so a card's cover is drawn from a card-sized file. A
 * bundle the shop has not photographed shows its picks side by side instead (`BundlePhotos`).
 */
export const loadCombos = cache(async (): Promise<PublicCombo[]> => {
  const combos = await getCombos().catch(() => [] as PublicCombo[]);
  const photo = await resolvePhotos(
    combos.flatMap((combo) => combo.images.map((image) => image.url)),
  );

  return combos.map((combo) => ({
    ...combo,
    images: combo.images.map((image) => {
      const found = photo(image.url);

      return typeof found === "string" ? { url: found } : found;
    }),
  }));
});
