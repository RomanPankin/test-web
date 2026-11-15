"use client";

import { setSiteTerms, type SiteTerms } from "@estoreclub/storefront/web";

/**
 * Hands the server's read of the shop's terms to the account islands. Set during render, as
 * the other seeds are: the same value every time, and there before the dialog can open.
 * Renders nothing.
 */
export function TermsSeed({ terms }: { terms: SiteTerms | null }) {
  setSiteTerms(terms);

  return null;
}
