import type { Vocabulary } from "@estoreclub/storefront/web";
import type { Colour, TechProduct } from "./product";

/**
 * A product's colours, in the words the shared cart understands.
 *
 * The cart (`@estoreclub/storefront`) was written for a menu: a line's configuration is a size and
 * its extras, and the size is what names the product VARIANT the server prices. Here a colour is
 * the variant, so each colour is offered as a "size" - its id the variant's id, its label the
 * colour's name. The cart then sends the right variant with the line and writes the colour under
 * the product's name, with nothing in it knowing what a colour is.
 *
 * No extras, heats, bases or ingredients: a phone is not made to order.
 *
 * Pure, with no "use client": the layout builds every product's vocabulary on the server and
 * seeds it (`VocabularySeed`), and the bag builds one in the browser for a product the page
 * never rendered (`addToBag`).
 */
export function colourSize(colour: Pick<Colour, "id" | "name">, price = 0) {
  return { id: colour.id, label: colour.name, price, variantId: colour.id };
}

export function colourVocabulary(product: TechProduct): Vocabulary {
  return {
    // Only the colours on sale: one sold out cannot be added, and the cart would refuse it.
    sizes: product.colours
      .filter((colour) => colour.available)
      .map((colour) => colourSize(colour, colour.price - product.price)),
    extras: [],
    spices: [],
    bases: [],
    ingredients: [],
  };
}
