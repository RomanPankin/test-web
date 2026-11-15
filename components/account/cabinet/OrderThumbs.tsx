"use client";

import { Image } from "@estoreclub/client";

import { productImage } from "@estoreclub/storefront/web";
import { photoUrl } from "@estoreclub/storefront";

/**
 * An order's products, as round photos overlapping a little — the products in it, first ordered
 * first. A product the site has no photo for (a combo, one since deleted) draws as a plain
 * tinted round, so the stack keeps its shape.
 */
export function OrderThumbs({
  productIds,
  max = 2,
  size = 56,
}: {
  productIds: string[];
  max?: number;
  size?: number;
}) {
  const photos = productIds.map(productImage).filter(Boolean).slice(0, max);

  if (photos.length === 0) return <Thumb size={size} />;

  return (
    <span className="flex shrink-0">
      {photos.map((photo, index) => (
        <span
          key={photoUrl(photo) + index}
          className="rounded-full ring-[3px] ring-white"
          style={{ marginLeft: index ? -size / 7 : 0 }}
        >
          <Thumb photo={photo} size={size} />
        </span>
      ))}
    </span>
  );
}

/** One round photo, or an empty tinted round. */
export function Thumb({
  photo,
  size,
}: {
  photo?: ReturnType<typeof productImage>;
  size: number;
}) {
  return photo ? (
    <Image
      alt=""
      className="block shrink-0 rounded-full bg-soft object-cover shadow-[0_4px_12px_-4px_rgba(17,18,22,0.3)]"
      height={size}
      src={photo}
      style={{ width: size, height: size }}
      width={size}
    />
  ) : (
    <span
      className="block shrink-0 rounded-full bg-brand-tint"
      style={{ width: size, height: size }}
    />
  );
}
