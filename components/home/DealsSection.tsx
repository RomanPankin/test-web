import type { PublicCombo } from "@estoreclub/api";
import type { BundleProduct } from "../../lib/bundle";
import type { TextOf } from "../../lib/content/types";
import type { TechProduct } from "../../lib/product";

import { FRAME } from "../../lib/layout";
import { BundleCard } from "../bundle/BundleCard";
import { ArrowRight } from "../Icons";
import { ProductCard } from "../product/ProductCard";

/**
 * "Deals": the shop's bundles, then every product a discount rule is on - on the home page and
 * at the top of /shop (`#deals`, where the header's "Deals" link lands).
 *
 * One grid with the product rows' six columns, a bundle taking two of them, so a band of deals
 * lines up with "New arrivals" under it. Bundles first: they are the deal only this band sells,
 * where a discounted product is also on its own shelf. A shop with neither has no band at all -
 * a "Deals" heading over nothing is a promise broken in the first screen.
 *
 * `limit` caps the band in product cards (a bundle counts as two), so the home page shows two
 * rows and leaves the rest to /shop; without it, everything is shown.
 */
export function DealsSection({
  id,
  combos,
  bundleProducts,
  products,
  t,
  limit,
  viewAll,
  className = "mt-[44px] scroll-mt-20",
}: {
  id: string;
  combos: PublicCombo[];
  bundleProducts: Record<string, BundleProduct>;
  /** Products a discount rule is on - each carries its `deal`. */
  products: TechProduct[];
  t: TextOf;
  limit?: number;
  /** Where "View all" goes; none hides it. */
  viewAll?: string;
  /**
   * Its spacing, and how far below the top a jump to it stops - under the header alone on the
   * home page, under the header AND the category bar on /shop.
   */
  className?: string;
}) {
  if (combos.length === 0 && products.length === 0) return null;

  const room = limit ?? Infinity;
  const bundles = combos.slice(0, Math.floor(room / 2));
  const deals = products.slice(0, Math.max(0, room - bundles.length * 2));

  return (
    <section className={FRAME + " " + className} id={id}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink lg:text-[27px]">
            {t("deals.title")}
          </h2>
          <p className="mt-1 text-[13.5px] text-muted">{t("deals.text")}</p>
        </div>
        {viewAll ? (
          <a
            className="inline-flex shrink-0 items-center gap-[10px] text-[13px] font-medium text-brand transition hover:text-brand-hover"
            href={viewAll}
          >
            {t("arrivals.viewAll")}
            <ArrowRight size={13} strokeWidth={1.8} />
          </a>
        ) : null}
      </div>

      <ul className="mt-[16px] grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-[18px]">
        {bundles.map((combo) => (
          <li key={combo.id} className="col-span-2">
            <BundleCard combo={combo} products={bundleProducts} />
          </li>
        ))}
        {deals.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
