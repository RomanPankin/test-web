"use client";

import { useEffect } from "react";

import { productAskedFor } from "../../lib/productUrl";

/**
 * The old way to name a product - `?product=PR-12` on any page, what QR codes printed before
 * products had pages - forwarded to the product's own page (`/product/PR-12`). Renders nothing.
 */
export function ProductFromUrl() {
  useEffect(() => {
    const asked = productAskedFor();

    if (asked) window.location.replace(`/product/${encodeURIComponent(asked)}`);
  }, []);

  return null;
}
