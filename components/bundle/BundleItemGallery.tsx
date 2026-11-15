"use client";

import type { Photo } from "@estoreclub/storefront";

import { useState } from "react";

import { ProductGallery } from "../product/ProductGallery";

/** A bundle item's photos - the product page's gallery, holding which one is shown large. */
export function BundleItemGallery({
  name,
  images,
}: {
  name: string;
  images: Photo[];
}) {
  const [current, setCurrent] = useState(0);

  return (
    <ProductGallery
      current={current}
      images={images}
      name={name}
      onSelect={setCurrent}
    />
  );
}
