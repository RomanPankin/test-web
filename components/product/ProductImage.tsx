"use client";

import type { Photo } from "@estoreclub/storefront";

import { Image } from "@estoreclub/client";

/**
 * A product photo on the grey it was shot on. `mix-blend-darken` melts the photo's own
 * near-white backdrop into the tile, so a picture with a slightly different grey still reads
 * as one surface rather than a box on a box.
 */
export function ProductImage({
  src,
  alt = "",
  className = "",
  sizes,
  priority = false,
}: {
  src: Photo;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) return null;

  return (
    <Image
      alt={alt}
      className={"object-contain mix-blend-darken " + className}
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}
