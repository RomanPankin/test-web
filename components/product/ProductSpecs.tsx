"use client";

import type { Spec } from "../../lib/product";
import type { TextOf } from "../../lib/content/types";

import { useText } from "../ContentProvider";

/** The site's sentence for a key, or null where neither the shop nor the interface words have one. */
function said(t: TextOf, key: string, vars?: Record<string, string | number>) {
  const text = t(key, vars);

  return text && text !== key ? text : null;
}

/**
 * The product's specifications, as a compact two-column table: what each field is, and what
 * this product has - "Brand · TechStore", "Warranty · 24 months".
 *
 * The rows are the shop's data (`lib/productSpecs.ts`); the words are the site's. A field's name
 * is `spec.<KEY>` in the site texts where they have it (so "Brand" reads "Бренд" in Russian),
 * else the shop's own name for the field. A value is `spec.<KEY>.value` with `{value}` filled
 * in where the texts have one ("{value} months"), else the number with the shop's unit.
 *
 * Nothing at all for a product with no fields filled in - a heading over an empty table would
 * promise details that are not there.
 */
export function ProductSpecs({ specs }: { specs: Spec[] }) {
  const t = useText();

  if (specs.length === 0) return null;

  return (
    <section className="mt-7">
      <h3 className="text-[13px] font-medium text-ink">{t("spec.title")}</h3>
      <dl className="mt-3 divide-y divide-line rounded-[10px] bg-tile px-4 text-[13px]">
        {specs.map((spec) => {
          const value =
            spec.value === true
              ? t("spec.yes")
              : (said(t, `spec.${spec.key}.value`, { value: spec.value }) ??
                (spec.suffix
                  ? `${spec.value} ${spec.suffix}`
                  : String(spec.value)));

          return (
            <div
              key={spec.key}
              className="flex items-baseline justify-between gap-4 py-2.5"
            >
              <dt className="text-muted">
                {said(t, `spec.${spec.key}`) ?? spec.label}
              </dt>
              <dd className="min-w-0 text-right font-medium text-ink">
                {value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
