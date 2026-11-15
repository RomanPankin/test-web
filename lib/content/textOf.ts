import type { SiteContent, TextOf, TextVars } from "./types";

import { DEFAULT_CONTENT } from "./defaults";

/**
 * The text-lookup a component uses: the shop's sentence for a key, `{placeholders}` filled.
 *
 * `{brand}` is always available — the shop's name is written into a dozen sentences ("At
 * {brand}, we believe…"), and a rename in the dictionary should reach every one of them.
 *
 * A key the shop's list lacks falls back to the built-in sentence, and a key neither knows is
 * shown as itself: a visible `hero.title` on the page is a clue, where an empty string is a
 * mystery.
 */
export function textOf(content: SiteContent): TextOf {
  const brand =
    content.texts["brand.name"] ?? DEFAULT_CONTENT.texts["brand.name"];

  return (key: string, vars?: TextVars) => {
    const raw = content.texts[key] ?? DEFAULT_CONTENT.texts[key] ?? key;

    return fill(raw, { brand, ...vars });
  };
}

function fill(text: string, vars: TextVars): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** A collection of images by key, or the built-in one when the shop has none under it. */
export function imagesOf(content: SiteContent, key: string): string[] {
  const own = content.images[key];

  return own && own.length > 0 ? own : (DEFAULT_CONTENT.images[key] ?? []);
}

/** One image by key — the first of its collection. */
export function imageOf(content: SiteContent, key: string): string {
  return imagesOf(content, key)[0] ?? "";
}
