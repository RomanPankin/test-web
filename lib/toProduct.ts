import type { PublicDictionary, PublicProduct } from "@estoreclub/api";
import type { TechProduct } from "./product";
import type { SettingLabels } from "./productSpecs";

import { photoOf } from "@estoreclub/storefront";

import { paragraphsOf, specSheetOf } from "./richText";

import { specsOf } from "./productSpecs";

/**
 * A product from the API, in the shape the cards and the product page render. Plain functions
 * with only TYPES from `@estoreclub/api`, built on the server (`lib/catalog.ts`).
 *
 * Colours: each product is sold in colours, and each colour is one of its VARIANTS — the
 * variant's name is the colour's name. The swatch comes from the shop's `Catalog\Colours` list
 * (`HEX`), matched by that name: both come back in the page's language, so they still match in
 * Russian.
 *
 * Specifications: the product's other fields, named by the shop's settings catalogue
 * (`labels`) - see `lib/productSpecs.ts`.
 */
export const COLOURS_LIST = "catalog_colours";

/** A colour the list does not know: a neutral grey rather than no swatch at all. */
const FALLBACK_HEX = "#c8c8cc";

/** The swatches of the colours list, by the colour's name in lower case. */
export function coloursOf(
  colours: PublicDictionary | null,
): Map<string, string> {
  const hexOf = new Map<string, string>();

  for (const entry of colours?.entries ?? []) {
    const hex = entry.values?.HEX;

    if (typeof hex === "string" && hex.trim()) {
      hexOf.set(entry.name.trim().toLowerCase(), hex.trim());
    }
  }

  return hexOf;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function toProduct(
  product: PublicProduct,
  hexOf: Map<string, string>,
  labels: SettingLabels = new Map(),
): TechProduct {
  const price = typeof product.price === "number" ? product.price : 0;
  // `filter`, because the API can hand back a hole where a photo was deleted.
  const photos = (product.media ?? [])
    .filter((item) => item && item.url)
    .map(photoOf);
  const settings = product.settings ?? {};
  const months = Number(settings.WARRANTY_MONTHS?.value);
  const variants = product.variants ?? [];

  return {
    id: product.id,
    number: product.productNumber,
    name: product.name,
    spec: product.description ?? "",
    price,
    image: photos[0] ?? "",
    images: photos,
    badge: text(settings.BADGE?.value),
    brand: text(settings.BRAND?.value),
    warrantyMonths: Number.isFinite(months) && months > 0 ? months : 0,
    categoryIds: (product.categories ?? [])
      .filter(Boolean)
      .map((category) => category.id),
    colours: variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      hex: hexOf.get(variant.name.trim().toLowerCase()) ?? FALLBACK_HEX,
      price: typeof variant.price === "number" ? variant.price : price,
      available: variant.isAvailable !== false,
      ...(variant.image ? { image: variant.image } : {}),
    })),
    // The count is the product's, not a colour's (one stock for the whole business): the API
    // says it as `soldOut`. A product whose every colour is off sale cannot be bought either.
    soldOut:
      product.soldOut === true ||
      (variants.length > 0 &&
        variants.every((variant) => variant.isAvailable === false)),
    specs: specsOf(settings, labels),
    overview: paragraphsOf(text(settings.OVERVIEW?.value)),
    specSheet: specSheetOf(text(settings.SPECIFICATIONS?.value)),
    // Only where the shop has customers vote and somebody has - absent keys stay absent, so
    // the islands are not sent `undefined`s.
    ...(product.customerRating
      ? { customerRating: product.customerRating }
      : {}),
    ...(product.customerLikes ? { customerLikes: product.customerLikes } : {}),
  };
}
