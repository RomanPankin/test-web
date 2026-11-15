"use client";

import type { SiteContent, TextOf } from "../lib/content/types";
import type { Photo } from "@estoreclub/storefront";

import { imageOf, imagesOf, textOf } from "../lib/content/textOf";
import { clientContent, seedClientText } from "../lib/content/clientText";

/**
 * The shop's words and pictures, for the client islands.
 *
 * Seeded, NOT provided through React context: every `"use client"` island hydrates as its own
 * root, so a context provider high in the server tree never wraps a sibling island on the client
 * — `useContext` there would read the default and mismatch the server. So the content is seeded
 * once into a module singleton (`seedClientText`) by `ContentSeed`, and the hooks below read it
 * from there. The same mechanism `MoneySeed` and `VocabularySeed` use.
 *
 * Server components do not use these; they call `loadContent()` and read it directly.
 */

/**
 * Seeds the content for every island. Renders nothing and takes NO children — a childless island,
 * which is the only kind the platform hydrates correctly. Placed first in the layout so it seeds
 * before any island that reads the content hydrates.
 */
export function ContentSeed({ content }: { content: SiteContent }) {
  seedClientText(content);

  return null;
}

/** `t(key, vars)` for a client component. */
export function useText(): TextOf {
  return textOf(clientContent());
}

/** The language the page is read in - for dates and numbers written in it. */
export function useLanguage(): string | undefined {
  return clientContent().language;
}

/** The images under a key, for a client component. */
export function useImages(key: string): Photo[] {
  return imagesOf(clientContent(), key);
}

/** One image by key, for a client component. */
export function useImage(key: string): Photo {
  return imageOf(clientContent(), key);
}
