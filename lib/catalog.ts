import type { PublicDictionary, PublicProduct } from "@estoreclub/api";
import type { TechCategory } from "./product";

import { cache } from "react";
import {
  getCategories,
  getDictionary,
  getProductSettings,
  getProducts,
} from "@estoreclub/api";

import { photoOf, ruleFor, toRuleDeal } from "@estoreclub/storefront";
import { loadDiscountRules } from "./deals";
import { settingLabelsOf } from "./productSpecs";
import { slugOf } from "./slug";
import { COLOURS_LIST, coloursOf, toProduct } from "./toProduct";

/**
 * The shop's catalogue, read once per request — SERVER ONLY (it calls the API with the
 * company key). The layout, the home page and the shop page all ask; `cache()` makes it one
 * round trip of five reads.
 *
 * Deals: the discount rules on right now are read with it (`lib/deals.ts`), and each product
 * carries the one it shows as `deal`.
 *
 * Colours: each product is sold in colours, and each colour is one of its VARIANTS — see
 * `lib/toProduct.ts`, which the product opened from the address (`ProductFromUrl`) is built
 * with too.
 *
 * Specifications: the shop's settings catalogue names each field the dialog lists
 * (`lib/productSpecs.ts`); without it the fields are still listed, under the site's own words.
 */
export const loadCatalog = cache(async () => {
  const [categories, products, colours, rules, definitions] = await Promise.all(
    [
      getCategories({ include: ["media"] }).catch(() => []),
      getProducts({
        limit: 100,
        include: ["settings", "media", "categories"],
      })
        .then((answer) => answer.data)
        .catch(() => [] as PublicProduct[]),
      getDictionary({ identifier: COLOURS_LIST }).catch(
        () => null as PublicDictionary | null,
      ),
      loadDiscountRules(),
      getProductSettings().catch(() => []),
    ],
  );
  const hexOf = coloursOf(colours);
  const labels = settingLabelsOf(definitions);
  // Each product with the first rule that targets it (by id or by category) - one badge per
  // card, the way the shop orders its rules.
  const items = products.map((product) => {
    const item = toProduct(product, hexOf, labels);
    const rule = ruleFor(item.id, item.categoryIds, rules);
    const deal = rule ? toRuleDeal(rule, item.price) : undefined;

    return deal ? { ...item, deal } : item;
  });
  const sections: TechCategory[] = categories.map((category) => {
    const inIt = items.filter((item) => item.categoryIds.includes(category.id));
    const cover = category.media?.find((media) => media?.url);

    return {
      id: category.id,
      name: category.name,
      description: category.description ?? "",
      // The shop's own (untranslated) name: the anchor stays `#gaming` on a Russian page too, so
      // a link copied in one language lands in every other.
      slug: slugOf(category.canonicalName?.trim() || category.name) || category.id,
      // The category's own picture, else its first product's.
      image: cover ? photoOf(cover) : (inIt[0]?.image ?? ""),
      products: inIt,
    };
  });

  return { categories: sections, products: items };
});
