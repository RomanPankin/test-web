/**
 * Everything on the site that is the SHOP's to say — every sentence, every picture that is not
 * a product's own, every link — as read from its dictionaries.
 *
 * Three lists in the dashboard's "Site" folder, all optional:
 *
 *   - **Site texts** — one entry per sentence. The entry's name IS the text (so it is
 *     translated like any name), and its `KEY` column says where on the page it goes.
 *   - **Site images** — `KEY` + `IMAGE`: the hero's phone, the promo banners.
 *   - **Site links** — `KEY` + `URL`; the name is the link's label. The footer's support links
 *     are keyed `support`, the social profiles `social`, the legal row `legal`.
 *
 * Anything missing — a list deleted, an entry removed, a site not seeded with them — falls back
 * to the words and pictures in `defaults.ts` (and `locales/` for other languages), so the page
 * never renders a hole.
 */
export interface SiteLink {
  label: string;
  url: string;
}

export interface SiteContent {
  texts: Record<string, string>;
  images: Record<string, string[]>;
  links: Record<string, SiteLink[]>;
  /**
   * The language the page is read in - what dates and numbers are written in. The same on the
   * server and in the browser, unlike `<html lang>`, which the server cannot read.
   */
  language?: string;
}

/** Values put into a text — `{brand}`, `{count}`, `{name}`. */
export type TextVars = Record<string, string | number>;

/** Look a sentence up by its key, with any `{placeholders}` filled in. */
export type TextOf = (key: string, vars?: TextVars) => string;
