import type { PublicMedia } from "@estoreclub/api";
import type { Photo } from "@estoreclub/storefront";
import type { SiteLink } from "./content/types";
import type { TechProduct } from "./product";

import { photoUrl, productJsonLd } from "@estoreclub/storefront";

/**
 * What search engines and link previews read about the shop's pages - shared by the product
 * and bundle pages' `generateMetadata` and their structured data. SERVER side: plain functions
 * over the shapes the pages already hold, so nothing here reads the API on its own.
 */

/** The longest description worth writing: search results cut a snippet at about this. */
const SNIPPET = 160;

/**
 * Text as a `<meta name="description">` wants it: no markup, one line, cut at a word under 160
 * characters. A product's overview is written for its page, and the whole of it would be cut
 * mid-word by the search engine instead.
 */
export function snippet(text: string | null | undefined): string {
  const plain = (text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= SNIPPET) return plain;

  const cut = plain.slice(0, SNIPPET - 1);
  const space = cut.lastIndexOf(" ");

  return (space > SNIPPET / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:-]+$/, "") + "…";
}

/** A share picture as the platform's `openGraph.images` reads it - with its size when known. */
export function shareImage(photo: Photo | null | undefined, alt: string) {
  if (!photo) return undefined;

  const url = photoUrl(photo);

  if (!url) return undefined;
  if (typeof photo === "string") return { url, alt };

  return {
    url,
    alt,
    ...(photo.width ? { width: photo.width } : {}),
    ...(photo.height ? { height: photo.height } : {}),
  };
}

/**
 * A product as schema.org reads it, from the shape the page renders. `productJsonLd` reads the
 * API's product; this one carries the same facts under the site's own field names, so the page
 * needs no second read for it.
 */
export function techProductJsonLd(
  product: TechProduct,
  options: { currency: string; url: string; shopName: string },
) {
  const media = product.images
    .map((photo) => photoUrl(photo))
    .filter(Boolean)
    .map((url) => ({ id: url, url, type: "image" }) as PublicMedia);

  return productJsonLd(
    {
      name: product.name,
      description: product.overview.join(" ") || product.spec,
      price: product.price,
      media,
      soldOut: product.soldOut,
      customerRating: product.customerRating,
      productNumber: product.number ?? 0,
      kind: "product",
    },
    {
      currency: options.currency,
      url: options.url,
      // The maker the shop typed (`BRAND`), else the shop itself.
      brand: product.brand || options.shopName,
    },
  );
}

/**
 * The shop's profiles elsewhere, from its "Site links" `social` list - only real profiles. The
 * template's own links are the networks' home pages (`https://instagram.com`), which say nothing
 * about this shop, so a link with no path is left out.
 */
export function profilesOf(links: SiteLink[] | undefined): string[] {
  return (links ?? []).flatMap((link) => {
    try {
      const url = new URL(link.url);

      return /^https?:$/.test(url.protocol) && url.pathname.replace(/\/+$/, "")
        ? [url.toString()]
        : [];
    } catch {
      return [];
    }
  });
}
