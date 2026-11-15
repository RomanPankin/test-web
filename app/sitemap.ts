// Run without the layout, so it configures the API client itself - the same side effect the
// layout imports for every page.
import "../lib/configureApi";

import type { PublicCombo, PublicProduct } from "@estoreclub/api";

import { getCombos, getProducts } from "@estoreclub/api";

import { bundleHref } from "../lib/bundle";
import { productHref } from "../lib/productUrl";

/** The pages with a fixed address a search engine should know - the visitor's own are not. */
const PAGES = ["/shop", "/about", "/delivery", "/faq", "/privacy", "/terms"];

/**
 * `/sitemap.xml`: the home page, the fixed pages, every product's page and every bundle's.
 *
 * Run per request on the server, like a page: products change without a rebuild, so the list
 * is read when a crawler asks. URLs are relative - the platform puts the host in front.
 *
 * A category has no page of its own: it is a shelf on /shop (`/shop#phones`), and an anchor is
 * not an address a search engine lists apart. The same 100 products the shop page shows - one
 * read, with only the photos, since a sitemap needs no specifications.
 */
export default async function sitemap() {
  const [products, combos] = await Promise.all([
    getProducts({ limit: 100, include: ["media"] })
      .then((page) => page.data)
      .catch(() => [] as PublicProduct[]),
    // The raw read: `loadCombos` also looks up resized copies, which a sitemap has no use for.
    getCombos().catch(() => [] as PublicCombo[]),
  ]);

  return [
    { url: "/", changeFrequency: "daily" as const, priority: 1 },
    ...PAGES.map((url) => ({
      url,
      changeFrequency: url === "/shop" ? ("daily" as const) : ("monthly" as const),
      priority: url === "/shop" ? 0.9 : 0.4,
    })),
    ...products.map((product) => {
      const photo = product.media?.find((media) => media?.url)?.url;

      return {
        url: productHref({
          id: product.id,
          number: product.productNumber,
          name: product.name,
        }),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        ...(photo ? { images: [photo] } : {}),
      };
    }),
    ...combos.map((combo) => {
      const cover = combo.images[0]?.url;

      return {
        url: bundleHref(combo),
        changeFrequency: "weekly" as const,
        priority: 0.6,
        ...(cover ? { images: [cover] } : {}),
      };
    }),
  ];
}
