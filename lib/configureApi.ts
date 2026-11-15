import { setCompanyApiKey, setLanguageResolver } from "@estoreclub/api";

import { defaultLanguage } from "@estoreclub/storefront/server";

/**
 * Hand the API client the company's own key, from the environment.
 *
 * `COMPANY_API_KEY` is what every public endpoint authenticates with — it goes on the wire as
 * `x-company-api-key`, and the server resolves the company from it. It is the only credential
 * the client knows, and the reason it needs no domain.
 *
 * A side effect at module load, which is the point — importing this file configures the
 * client, so the layout below can do it once for every route rather than each page repeating
 * it. `@estoreclub/api` reads the key per request, so it is live from here on.
 *
 * SERVER ONLY. `process.env.COMPANY_API_KEY` has no `NEXT_PUBLIC_` prefix, so Next will not
 * inline it into a client bundle — and this file must never be imported from a `"use client"`
 * one, which would put the key where a visitor can read it.
 *
 * Absent, this does nothing and the client falls back to reading `COMPANY_API_KEY` from the
 * environment itself. With neither, every call rejects and the page renders its empty state.
 */
setCompanyApiKey(process.env.COMPANY_API_KEY);

/**
 * And the language every read answers in: the shop's default, until a render sets the visitor's
 * — see `lib/language.ts`. Without it the API answers in English whatever the shop writes in.
 * The DEFAULT, not `currentLanguage`, which asks this resolver and would ask itself.
 */
setLanguageResolver(defaultLanguage);
