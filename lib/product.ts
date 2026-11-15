import type { Photo, RuleDeal } from "@estoreclub/storefront";
import type { SpecGroup } from "./richText";

/**
 * A product, in the shape every card, the product dialog and the shop page render.
 *
 * Plain JSON on purpose: built on the server (`lib/catalog.ts`) and handed to the client islands
 * as props, so it carries nothing an island cannot be sent — and nothing secret.
 */
export interface Colour {
  /** The product variant this colour is — what the cart is sent. */
  id: string;
  /** "Black Titanium", in the page's language. */
  name: string;
  /** The swatch, from the shop's `Catalog\Colours` list. Grey when the list has none for it. */
  hex: string;
  price: number;
  available: boolean;
  /** The colour's own picture - the pink phone. Absent: the product's photos show it. */
  image?: Photo;
}

export interface TechProduct {
  id: string;
  /** The shop's own number for it (`PR-12`) - its key in the address (`lib/productUrl.ts`). */
  number?: number;
  name: string;
  /** The short spec line under the name - `6.3" display · 256 GB`. */
  spec: string;
  price: number;
  /** The first photo - the card's, and the bag's. */
  image: Photo;
  /** Every photo, the first included - the dialog's gallery. */
  images: Photo[];
  /** "New" and the like - the product's `BADGE` setting, as the shop typed it. */
  badge: string;
  brand: string;
  /** Months of warranty (`WARRANTY_MONTHS`), 0 when the shop gave none. */
  warrantyMonths: number;
  categoryIds: string[];
  colours: Colour[];
  /**
   * None left to sell: the shop counts its stock, stops selling at zero, and this one is at zero
   * (the API's `soldOut`) - or every colour it comes in is off sale. Shown, never hidden: a
   * sold-out phone still tells a visitor the shop sells it, and the add buttons are off.
   */
  soldOut: boolean;
  /** The product's other fields the shop shows, for the dialog's specifications - see `Spec`. */
  specs: Spec[];
  /** The long description for its page (`OVERVIEW`), a paragraph each - plain text. */
  overview: string[];
  /** Its full characteristics (`SPECIFICATIONS`), grouped - plain text, see `lib/richText.ts`. */
  specSheet: SpecGroup[];
  /** What customers' stars come to, where the shop has them vote with stars and somebody has. */
  customerRating?: { average: number; count: number; max: number };
  /** What customers' likes come to, where the shop has them vote with likes and somebody has. */
  customerLikes?: { likes: number; dislikes: number };
  /**
   * The shop's discount rule on it, as a card shows it - "Save 10%", "Buy 2 get 1 free". Read
   * on the server with the catalogue (`lib/catalog.ts`); absent on a product read in the
   * browser, which has no rules to match it against.
   */
  deal?: RuleDeal;
}

/**
 * One line of the dialog's specifications - a product field the shop fills in and lets websites
 * read (`BRAND`, `WARRANTY_MONTHS`, or one the shop added itself), built by `lib/productSpecs.ts`.
 *
 * Raw on purpose: the words around it ("Brand", "24 months", "Yes") are the page's, in the
 * visitor's language, so they are put on in the browser (`ProductSpecs`).
 */
export interface Spec {
  key: string;
  /** The shop's own name for the field ("Warranty"), for a key the site texts do not name. */
  label: string;
  /** A number, the text (list entries joined), or `true` for a yes/no field that is on. */
  value: string | number | true;
  /** The unit the shop writes after a number ("g", "mAh"). */
  suffix?: string;
}

export interface TechCategory {
  id: string;
  name: string;
  description: string;
  /** The anchor its section on /shop carries - `phones`. */
  slug: string;
  image: Photo;
  products: TechProduct[];
}
