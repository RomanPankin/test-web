"use client";

import type { TechProduct } from "../../lib/product";

import { productHref } from "../../lib/productUrl";
import { useText } from "../ContentProvider";

import { BundleItemGallery } from "./BundleItemGallery";

/** How many spec groups an item shows before "All specifications" - the ones buyers read first. */
const SPEC_GROUPS = 3;

/**
 * One product of a bundle, described on the bundle's page: its photos (the product page's
 * gallery), which place it fills ("Your phone"), its name and spec line, its overview, and the
 * first groups of its spec sheet - with a link to its own page for everything else. A buyer
 * judging a kit should not have to open three pages to know what is in it.
 */
export function BundleItem({
  product,
  place,
  reversed,
}: {
  product: TechProduct;
  /** The slot it fills - "Your case". */
  place: string;
  /** Photo on the right: alternate items read as a sequence, not a list. */
  reversed: boolean;
}) {
  const t = useText();
  const href = productHref(product);
  const photos = product.images.length > 0 ? product.images : [product.image];
  const groups = product.specSheet.slice(0, SPEC_GROUPS);

  return (
    <article className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
      <div
        className={
          "overflow-hidden rounded-[20px] bg-tile lg:sticky lg:top-24 " +
          (reversed ? "lg:order-2" : "")
        }
      >
        <BundleItemGallery images={photos} name={product.name} />
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          {place}
        </p>
        <h3 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">
          <a className="hover:underline" href={href}>
            {product.name}
          </a>
        </h3>
        {product.spec ? (
          <p className="mt-1.5 text-[15px] text-muted">{product.spec}</p>
        ) : null}

        {product.overview.length > 0 ? (
          <div className="mt-5 space-y-3 text-[15px] leading-[1.65] text-body">
            {product.overview.slice(0, 2).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {groups.length > 0 ? (
          <div className="mt-6 divide-y divide-line border-y border-line">
            {groups.map((group, index) => (
              <div key={group.title + index} className="py-4">
                <h4 className="text-[13px] font-semibold text-ink">
                  {group.title}
                </h4>
                <dl className="mt-2 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {group.rows.map((row, rowIndex) => (
                    <div key={row.label + rowIndex}>
                      {row.label ? (
                        <dt className="text-[12px] text-muted">{row.label}</dt>
                      ) : null}
                      <dd className="text-[13.5px] leading-snug text-ink">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        ) : null}

        <a
          className="mt-5 inline-flex items-center gap-1 self-start text-[14px] font-medium text-brand hover:underline"
          href={product.specSheet.length > SPEC_GROUPS ? href + "#specs" : href}
        >
          {product.specSheet.length > SPEC_GROUPS
            ? t("bundle.allSpecs")
            : t("bundle.openProduct")}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
