"use client";

import type { Photo } from "@estoreclub/storefront";

import { photoUrl } from "@estoreclub/storefront";
import { useText } from "../ContentProvider";

import { ProductImage } from "./ProductImage";

/**
 * The product's photos in the dialog: one large on the grey it was shot on, the rest as small
 * white tiles in a row along the bottom of the same grey - inside the picture rather than in a
 * strip under it, so the photo keeps the whole column and the dialog does not grow a row.
 *
 * No thumbnails for a product with one photo: a row of one is a button that does nothing.
 */
export function ProductGallery({
  name,
  images,
  current,
  onSelect,
}: {
  name: string;
  images: Photo[];
  /** Index of the photo shown large. */
  current: number;
  onSelect: (index: number) => void;
}) {
  const t = useText();
  const shown = images[current] ?? images[0] ?? "";

  return (
    <div className="relative grid aspect-square place-items-center bg-tile p-10 lg:sticky lg:top-0 lg:aspect-auto lg:min-h-[480px]">
      {/* Keyed by the photo, so a new one replaces the old at once instead of the browser
          drawing it into the old one's box as it loads. */}
      <ProductImage
        key={photoUrl(shown)}
        priority
        alt={name}
        className="h-[min(280px,60vw)] w-auto max-w-full"
        sizes="420px"
        src={shown}
      />

      {images.length > 1 ? (
        <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2 overflow-x-auto p-[2px] [scrollbar-width:none]">
          {images.map((photo, index) => (
            <button
              key={photoUrl(photo) + index}
              aria-current={index === current ? "true" : undefined}
              aria-label={t("gallery.showPhoto", { n: index + 1 })}
              className={
                "grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[8px] bg-white p-1.5 transition " +
                (index === current
                  ? "ring-2 ring-ink"
                  : "ring-1 ring-line hover:ring-ink/40")
              }
              type="button"
              onClick={() => onSelect(index)}
            >
              <ProductImage
                className="h-full w-full"
                sizes="52px"
                src={photo}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
