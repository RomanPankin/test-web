"use client";

import type { Line } from "@estoreclub/storefront/web";

import { Image } from "@estoreclub/client";

import { photoUrl } from "@estoreclub/storefront";
import { productImage } from "@estoreclub/storefront/web";

/**
 * A bag line's picture, on the same cool grey the product photos are shot on. One photo for a
 * product; for a combo (a starter kit), its picks side by side - a phone beside its case reads
 * as the kit in a glance, where the phone alone read as a second phone.
 *
 * A line the server sent without a photo falls back to the product's own from the catalogue
 * (`ProductImagesSeed`), so a line is never an empty square.
 *
 * `className` sizes and rounds the box; the photos sit inside it, whole.
 */
export function LineImage({
  line,
  className,
}: {
  line: Line;
  className: string;
}) {
  const photos = line.images.filter(Boolean).slice(0, 3);
  const single = photos[0] || line.image || productImage(line.productId);

  if (photos.length < 2) {
    return (
      <span
        className={
          "grid shrink-0 place-items-center overflow-hidden bg-tile " +
          className
        }
      >
        {single ? (
          <Image
            alt=""
            className="h-[80%] w-[80%] object-contain mix-blend-darken"
            src={single}
          />
        ) : null}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={"flex shrink-0 gap-px overflow-hidden bg-white " + className}
    >
      {photos.map((photo, index) => (
        <span
          key={photoUrl(photo) + index}
          className="grid min-w-0 flex-1 place-items-center bg-tile"
        >
          <Image
            alt=""
            className="h-[80%] w-[80%] object-contain mix-blend-darken"
            src={photo}
          />
        </span>
      ))}
    </span>
  );
}
