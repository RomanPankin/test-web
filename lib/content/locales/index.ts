import type { SiteContent } from "../types";

import { DEFAULT_CONTENT } from "../defaults";

import { RU } from "./ru";

/** The built-in words in the languages the sample is written in, beside English. */
const LOCALES: Record<
  string,
  { texts: Record<string, string>; links: SiteContent["links"] }
> = { ru: RU };

/**
 * The built-in content in the visitor's language: English with the language's own sentences
 * over it, so a key it has not translated still reads in English rather than as its key. The
 * shop's own "Site ..." lists are laid over THIS (`loadContent`).
 */
export function defaultsFor(language: string | undefined): SiteContent {
  const locale = language ? LOCALES[language.split("-")[0]] : undefined;

  if (!locale) return DEFAULT_CONTENT;

  return {
    ...DEFAULT_CONTENT,
    texts: { ...DEFAULT_CONTENT.texts, ...locale.texts },
    links: { ...DEFAULT_CONTENT.links, ...locale.links },
  };
}
