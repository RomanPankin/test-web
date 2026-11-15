import type { TechProduct } from "../../lib/product";

import { FRAME } from "../../lib/layout";
import { ArrowRight } from "../Icons";
import { ProductCard } from "../product/ProductCard";

/**
 * "New arrivals": the products the shop marked `BADGE: New`, in its own order, six across —
 * the heading on the left, "View all" on the right. A sideways scroll on a phone.
 */
export function NewArrivals({
  title,
  viewAll,
  products,
}: {
  title: string;
  viewAll: string;
  products: TechProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <section className={FRAME + " mt-[44px]"}>
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink lg:text-[27px]">
          {title}
        </h2>
        <a
          className="inline-flex items-center gap-[10px] text-[13px] font-medium text-brand transition hover:text-brand-hover"
          href="/shop"
        >
          {viewAll}
          <ArrowRight size={13} strokeWidth={1.8} />
        </a>
      </div>
      <ul className="no-scrollbar -mx-4 mt-[16px] flex snap-x scroll-px-4 gap-3 sm:scroll-px-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-[18px] lg:overflow-visible lg:px-0">
        {products.slice(0, 6).map((product, index) => (
          <li key={product.id} className="w-[200px] shrink-0 snap-start lg:w-auto">
            <ProductCard priority={index < 2} product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
