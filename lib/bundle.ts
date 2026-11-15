import type { PublicCombo, PublicComboSlotOption } from "@estoreclub/api";
import type { Photo } from "@estoreclub/storefront";
import type { Colour, TechProduct } from "./product";

import { nameSlug } from "./productUrl";

/**
 * Bundles - the shop's combos, as TechStore sells them: "Phone 16 Pro Starter Kit", a phone
 * with its case and charger for one price. Plain functions with only TYPES from
 * `@estoreclub/api`, so the server page (which builds the products a bundle offers) and the
 * picker in the browser read a bundle the same way.
 *
 * A bundle is slots ("Your phone", "Your case"), each filled from a list of products. Where an
 * option leaves the variant open, the shopper picks one - here that is a COLOUR, since a
 * product's colours are its variants (`lib/toProduct.ts`).
 */

/** What the picker knows of a product a bundle offers: enough to show and price it. */
export interface BundleProduct {
  id: string;
  name: string;
  image: Photo;
  price: number;
  soldOut: boolean;
  colours: Colour[];
}

/** One filled place: which option, and - where the option leaves it open - which colour. */
export interface BundleChoice {
  option: PublicComboSlotOption;
  colourId?: string;
}

/** One place to fill. A slot taking two of something is two places, keyed `slotId:n`. */
export interface BundlePlace {
  key: string;
  slotId: string;
  name: string;
  index: number;
}

export function placesOf(combo: PublicCombo): BundlePlace[] {
  return combo.slots.flatMap((slot) =>
    Array.from({ length: Math.max(1, slot.quantity) }, (_, index) => ({
      key: `${slot.id}:${index}`,
      slotId: slot.id,
      name: slot.name,
      index,
    })),
  );
}

/** A colour the catalogue does not know, for a variant the combo names: grey, as elsewhere. */
const FALLBACK_HEX = "#c8c8cc";

/**
 * The colours a shopper chooses between for this option - none when the option names its own
 * variant, or the product comes in one colour only. Each wears the catalogue's swatch where it
 * has one; the combo answers only names.
 */
export function openColours(
  option: PublicComboSlotOption,
  product: BundleProduct | undefined,
): Colour[] {
  if (option.variantId !== null) return [];

  return (option.variants ?? []).map((variant) => {
    const known = product?.colours.find((colour) => colour.id === variant.id);

    return {
      id: variant.id,
      name: variant.name,
      hex: known?.hex ?? FALLBACK_HEX,
      price: known?.price ?? product?.price ?? 0,
      available: variant.isAvailable && (known?.available ?? true),
    };
  });
}

/** Whether an option can be picked at all: its product is on sale, in some colour. */
export function optionAvailable(
  option: PublicComboSlotOption,
  product: BundleProduct | undefined,
): boolean {
  if (product?.soldOut) return false;

  const colours = openColours(option, product);

  return colours.length === 0 || colours.some((colour) => colour.available);
}

/** A choice to start a place on: the option, in its first colour on sale. */
export function choose(
  option: PublicComboSlotOption,
  product: BundleProduct | undefined,
): BundleChoice {
  const colour = openColours(option, product).find((item) => item.available);

  return colour ? { option, colourId: colour.id } : { option };
}

/** The colour a choice is bought in - the option's own, or the one picked - or none. */
export function colourOf(
  choice: BundleChoice,
  product: BundleProduct | undefined,
): { id: string; name: string } | null {
  if (choice.option.variantId) {
    return {
      id: choice.option.variantId,
      name: choice.option.variantName ?? "",
    };
  }

  const picked = openColours(choice.option, product).find(
    (colour) => colour.id === choice.colourId,
  );

  return picked ? { id: picked.id, name: picked.name } : null;
}

/** Whether a choice is complete: on sale, and in a colour where it has colours to choose. */
export function choiceReady(
  choice: BundleChoice | undefined,
  product: BundleProduct | undefined,
): boolean {
  if (!choice || !optionAvailable(choice.option, product)) return false;

  const colours = openColours(choice.option, product);

  return (
    colours.length === 0 ||
    colours.some((colour) => colour.id === choice.colourId && colour.available)
  );
}

/** A pick's own price, as the server reads it for the two "off" kinds. */
function pickPrice(
  choice: BundleChoice,
  products: Record<string, BundleProduct>,
): number {
  const product = products[choice.option.productId];
  const colourId = choice.option.variantId ?? choice.colourId;

  if (!product) return 0;

  return (
    product.colours.find((colour) => colour.id === colourId)?.price ??
    product.price
  );
}

/**
 * What the bundle costs filled this way - the reading the server gives its `priceKind`. A
 * DISPLAY figure: the bag line is priced by the server, and that is what is charged.
 */
export function bundlePrice(
  combo: PublicCombo,
  choices: BundleChoice[],
  products: Record<string, BundleProduct>,
): number {
  if (combo.priceKind === "fixed_price") {
    return (
      combo.price +
      choices.reduce((sum, choice) => sum + choice.option.surcharge, 0)
    );
  }

  const apart = choices.reduce(
    (sum, choice) => sum + pickPrice(choice, products),
    0,
  );

  return combo.priceKind === "percent_off"
    ? (apart * (100 - combo.price)) / 100
    : Math.max(0, apart - combo.price);
}

/**
 * What the same things cost bought one by one - the cheapest product of each place at its own
 * price. Beside the bundle's "from" price it is the saving a card can promise; 0 when a product
 * is missing from the catalogue, so no saving is invented.
 */
export function apartPrice(
  combo: PublicCombo,
  products: Record<string, BundleProduct>,
): number {
  let total = 0;

  for (const slot of combo.slots) {
    const prices = slot.options.map(
      (option) => products[option.productId]?.price,
    );

    if (prices.some((price) => price === undefined)) return 0;
    total += Math.min(...(prices as number[])) * Math.max(1, slot.quantity);
  }

  return total;
}

/** The products the bundles offer, by id - what the cards and the picker are handed. */
export function bundleProductsOf(
  combos: PublicCombo[],
  catalogue: TechProduct[],
): Record<string, BundleProduct> {
  const wanted = new Set(
    combos.flatMap((combo) =>
      combo.slots.flatMap((slot) =>
        slot.options.map((option) => option.productId),
      ),
    ),
  );
  const out: Record<string, BundleProduct> = {};

  for (const product of catalogue) {
    if (!wanted.has(product.id)) continue;
    out[product.id] = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      soldOut: product.soldOut,
      colours: product.colours,
    };
  }

  return out;
}

/**
 * The bundle's own page: `/bundle/<id>?name=phone-16-pro-starter-kit` - the name only so the
 * address reads as the bundle; the id finds it.
 */
export function bundleHref(combo: Pick<PublicCombo, "id" | "name">): string {
  const slug = nameSlug(combo.name);

  return (
    `/bundle/${encodeURIComponent(combo.id)}` +
    (slug ? `?name=${encodeURIComponent(slug)}` : "")
  );
}
