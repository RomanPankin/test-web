"use client";

import type { PublicCombo } from "@estoreclub/api";
import type { ImageSource } from "@estoreclub/client";
import type { BundleProduct } from "../../lib/bundle";
import type { Photo } from "@estoreclub/storefront";

import { Fragment } from "react";

import { photoUrl } from "@estoreclub/storefront";
import { ProductImage } from "../product/ProductImage";

/**
 * What a bundle is, as a picture: the shop's own photograph of the set where it took one, else
 * the first product of each slot side by side with a "+" between them - a phone, a case and a
 * charger read as "a phone with its case and charger" before a word of the name does.
 *
 * On the same cool grey as every product card, and blended into it the same way
 * (`ProductImage`), so the bundle sits among the products rather than on top of them.
 */
export function BundlePhotos({
  combo,
  products,
  className = "",
}: {
  combo: PublicCombo;
  products: Record<string, BundleProduct>;
  className?: string;
}) {
  // `loadCombos` hands the covers on with their resized copies; the API's type says `{ url }`.
  const cover = combo.images[0] as ImageSource | undefined;

  if (cover) {
    return (
      <div className={"grid place-items-center " + className}>
        <ProductImage className="h-full w-full" sizes="420px" src={cover} />
      </div>
    );
  }

  const photos: Photo[] = combo.slots
    .map((slot) => products[slot.options[0]?.productId ?? ""]?.image)
    .filter((image): image is Photo => !!image)
    .slice(0, 3);

  return (
    <div className={"flex items-center justify-center gap-1 px-3 " + className}>
      {photos.map((photo, index) => (
        <Fragment key={photoUrl(photo) + index}>
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="shrink-0 text-[18px] font-light text-muted"
            >
              +
            </span>
          ) : null}
          <span className="flex h-full min-w-0 flex-1 items-center justify-center">
            <ProductImage
              className="max-h-full w-auto max-w-full"
              sizes="(min-width: 1024px) 240px, 160px"
              src={photo}
            />
          </span>
        </Fragment>
      ))}
    </div>
  );
}
