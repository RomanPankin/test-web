"use client";

import type { Photo } from "@estoreclub/storefront";

import { setComboCovers, setProductImages } from "@estoreclub/storefront/web";

/**
 * Hands every product's photo to the cart and the account page — see `@estoreclub/storefront`
 * (`productImages.ts`) — and every bundle's own cover, for a bundle line, which the server sends
 * without a picture. Set during render, so the first draw already has them. Renders nothing.
 */
export function ProductImagesSeed({
  images,
  comboCovers = {},
}: {
  images: Record<string, Photo>;
  /** Each bundle's own cover, by combo id - only those the shop photographed. */
  comboCovers?: Record<string, Photo>;
}) {
  setProductImages(images);
  setComboCovers(comboCovers);

  return null;
}
