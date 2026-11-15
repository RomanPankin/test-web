import type { PublicDictionary } from "@estoreclub/api";
import type { SiteContent, SiteLink } from "./types";

import { cache } from "react";
import { getDictionaries } from "@estoreclub/api";
import { currentLanguage } from "@estoreclub/storefront/server";

import { defaultsFor } from "./locales";

/**
 * The lists this site reads, by IDENTIFIER — the handle the shop's lists carry for code.
 *
 * Not by name: a name is translated on its way out of the API, so asking for `Site\\Site texts`
 * in Russian is answered with nothing.
 */
export const CONTENT_LISTS = {
  texts: "site_site_texts",
  images: "site_site_images",
  links: "site_site_links",
} as const;

type Entry = PublicDictionary["entries"][number];

const str = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** Several entries under one key, as one list, in the list's own (dragged) order. */
function grouped<T>(
  dictionary: PublicDictionary | null,
  pick: (entry: Entry) => T | null,
): Record<string, T[]> {
  const out: Record<string, T[]> = {};

  for (const entry of dictionary?.entries ?? []) {
    const key = str(entry.values?.KEY);
    const value = pick(entry);

    if (!key || value === null) continue;
    (out[key] ??= []).push(value);
  }

  return out;
}

/**
 * The shop's words and pictures, read once per request.
 *
 * SERVER ONLY — it calls the API with the company key. `cache()` makes every server component
 * that asks during one request share the one read; the layout hands the result to the client
 * islands through `ContentSeed`.
 */
export const loadContent = cache(async (): Promise<SiteContent> => {
  const [fetched, language] = await Promise.all([
    getDictionaries({ identifiers: Object.values(CONTENT_LISTS) }).catch(
      () => [] as PublicDictionary[],
    ),
    currentLanguage(),
  ]);
  // What fills the gaps: the built-in words, in the language this page is read in.
  const defaults = defaultsFor(language);
  const byId = new Map(fetched.map((d) => [d.identifier, d]));
  const pick = (identifier: string) => byId.get(identifier) ?? null;

  const ownTexts: Record<string, string> = {};

  for (const entry of pick(CONTENT_LISTS.texts)?.entries ?? []) {
    const key = str(entry.values?.KEY);

    if (key && entry.name) ownTexts[key] = entry.name;
  }

  return {
    language,
    texts: { ...defaults.texts, ...ownTexts },
    images: {
      ...defaults.images,
      ...grouped(pick(CONTENT_LISTS.images), (entry) => str(entry.values?.IMAGE) || null),
    },
    links: {
      ...defaults.links,
      ...grouped<SiteLink>(pick(CONTENT_LISTS.links), (entry) =>
        entry.name ? { label: entry.name, url: str(entry.values?.URL) } : null,
      ),
    },
  };
});
