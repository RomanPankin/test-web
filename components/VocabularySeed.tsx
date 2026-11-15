"use client";

import type { Vocabularies } from "@estoreclub/storefront/web";

import { setVocabularies } from "@estoreclub/storefront/web";

/**
 * Hands every product's colours to the shared bag, as the "sizes" it understands - see
 * `lib/colourVocabulary.ts`.
 *
 * Set during RENDER rather than in an effect, and deliberately: the bag describes its lines the
 * moment it hydrates, and colours that arrived one effect later would draw the first paint of
 * an open bag without them. Writing to a module store during render is safe here because it is
 * the same value every time - the server read it once for this page.
 *
 * Renders nothing. It exists to be mounted.
 */
export function VocabularySeed({
  vocabularies,
}: {
  vocabularies: Vocabularies;
}) {
  setVocabularies(vocabularies);

  return null;
}
