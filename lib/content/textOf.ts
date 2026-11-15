import type { SiteContent, TextOf, TextVars } from "./types";

/**
 * The text-lookup a component uses: the sentence for a key, `{placeholders}` filled.
 *
 * `{brand}` is always available - the shop's name is written into page titles ("Shop -
 * {brand}") and its own sentences, and a rename should reach every one of them.
 *
 * A key with no text - shop content the shop has not written - is "", never the key: the
 * component leaves the block out, where a visible `hero.title1` would be a hole in the page.
 */
export function textOf(content: SiteContent): TextOf {
  return (key: string, vars?: TextVars) => {
    const raw = content.texts[key];

    return raw ? fill(raw, { brand: content.brand, ...vars }) : "";
  };
}

function fill(text: string, vars: TextVars): string {
  let emptied = false;
  const filled = text.replace(/\{(\w+)\}/g, (match, name: string) => {
    if (!(name in vars)) return match;
    const value = String(vars[name]);

    if (!value) emptied = true;

    return value;
  });

  // "Shop - {brand}" for a shop whose name did not load: the title, not "Shop - ".
  return emptied ? filled.replace(/^[\s\-·]+|[\s\-·]+$/g, "") : filled;
}

/** A collection of images by key - none when the shop has none under it. */
export function imagesOf(content: SiteContent, key: string): string[] {
  return content.images[key] ?? [];
}

/** One image by key - the first of its collection, or "". */
export function imageOf(content: SiteContent, key: string): string {
  return imagesOf(content, key)[0] ?? "";
}
