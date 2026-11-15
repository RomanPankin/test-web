import type { PublicCombo } from "@estoreclub/api";
import type { SiteLink } from "./content/types";
import type { TechCategory, TechProduct } from "./product";

/**
 * Whether the shop has anything to put on the "Deals" shelf: a bundle, or a product a discount
 * rule is on that can still be bought. The same test as /shop's `#deals` shelf, so the header
 * never links to a shelf that is not there.
 */
export function hasDeals(combos: PublicCombo[], products: TechProduct[]): boolean {
  return (
    combos.length > 0 ||
    products.some((product) => product.deal && !product.soldOut)
  );
}

/**
 * The header's and the footer's category links, built from the shop's own categories rather
 * than written down: each category that has something in it, in the shop's order, pointing at
 * its section on /shop by the same slug the section's `id` is (`lib/catalog.ts`, the
 * untranslated name - so links and anchors match in every language). "Deals" last, only while
 * the shop has deals.
 */
export function navLinksOf(
  categories: TechCategory[],
  dealsLabel: string | null,
): SiteLink[] {
  const links = categories
    .filter((category) => category.products.length > 0)
    .map((category) => ({ label: category.name, url: "/shop#" + category.slug }));

  return dealsLabel ? [...links, { label: dealsLabel, url: "/shop#deals" }] : links;
}
