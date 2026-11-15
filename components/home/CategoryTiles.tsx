import type { TechCategory } from "../../lib/product";

import { FRAME } from "../../lib/layout";
import { ProductImage } from "../product/ProductImage";

/**
 * Six equal light-grey tiles, a picture and a name each — the shop's categories, in its own
 * order, each a link to its section of /shop. A row on a desktop; a sideways scroll on a phone.
 */
export function CategoryTiles({
  categories,
  label,
}: {
  categories: TechCategory[];
  label: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label={label} className={FRAME + " mt-[34px]"}>
      <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 sm:scroll-px-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-[18px] lg:overflow-visible lg:px-0">
        {categories.slice(0, 6).map((category) => (
          <li key={category.id} className="w-[132px] shrink-0 snap-start lg:w-auto">
            <a
              className="group flex h-[150px] flex-col items-center justify-between rounded-[10px] bg-tile pb-[20px] pt-[18px] lg:h-[184px] lg:pb-[16px] lg:pt-[16px]"
              href={"/shop#" + category.slug}
            >
              <span className="flex h-[86px] w-full items-center justify-center lg:h-[124px]">
                <ProductImage
                  className="h-[96px] w-auto max-w-none transition duration-300 group-hover:scale-[1.05] lg:h-[136px]"
                  sizes="180px"
                  src={category.image}
                />
              </span>
              <span className="text-[12.5px] font-medium tracking-[-0.01em] text-ink">
                {category.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
