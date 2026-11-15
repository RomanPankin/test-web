import { UI_TEXTS } from "../ui";

import { RU } from "./ru";

/** The interface words in the languages the sample is written in, beside English. */
const LOCALES: Record<string, Record<string, string>> = { ru: RU };

/**
 * The interface words in the visitor's language: English with the language's own over it, so a
 * key it has not translated still reads in English rather than as nothing. Only interface words
 * - the shop's own content has no built-in copy in any language.
 */
export function uiTextsFor(language: string | undefined): Record<string, string> {
  const locale = language ? LOCALES[language.split("-")[0]] : undefined;

  return locale ? { ...UI_TEXTS, ...locale } : UI_TEXTS;
}
