import type { SiteContent, TextOf } from "./types";

import { setStorefrontText } from "@estoreclub/storefront";

import { DEFAULT_CONTENT } from "./defaults";
import { textOf } from "./textOf";

/**
 * The shop's words for the client modules that are not React — the cart store and the
 * variant helpers, which write "No onions" into a cart line.
 *
 * Seeded by `ContentProvider` as it renders, the same way `MoneySeed` seeds the currency: those
 * modules cannot read a context, and passing the text into every call that describes a
 * variant would thread it through the whole cart.
 */
let current: TextOf = textOf(DEFAULT_CONTENT);
let seeded: SiteContent = DEFAULT_CONTENT;

export function seedClientText(content: SiteContent): void {
  if (content === seeded) return;
  seeded = content;
  current = textOf(content);
}

/** `t(key, vars)` outside a component. */
export const clientText: TextOf = (key, vars) => current(key, vars);

// The cart and the variant helpers of `@estoreclub/storefront` speak in these words too ("No
// onions", "Your order is empty") - handed over once, here, so they follow the seeded content.
setStorefrontText(clientText);

/**
 * The whole seeded content, for the hooks that need images too.
 *
 * A module singleton rather than React context, because context does NOT cross island
 * boundaries: every `"use client"` island hydrates as its OWN root, so a provider high in the
 * server tree never wraps a sibling island on the client. The content is seeded once (see the
 * content seed island) and read from here by every island — the same mechanism the currency and
 * vocabulary use.
 */
export function clientContent(): SiteContent {
  return seeded;
}
