/**
 * What the site says and shows, split in two:
 *
 *   - INTERFACE words - "Add to bag", "Your bag", the account's labels - every shop needs and
 *     nobody fills in. Built in (`ui.ts`, `locales/`), and a shop may reword any of them.
 *   - The SHOP's own content - its name, what it sells and promises, its story, policies,
 *     pictures and links. Read only from its dictionaries; nothing of it is in code, so a site
 *     the API cannot answer shows no shop at all rather than somebody else's.
 *
 * Three lists in the dashboard's "Site" folder, read by identifier:
 *
 *   - **Site texts** - one entry per sentence. The entry's name IS the text (so it is
 *     translated like any name), and its `KEY` column says where on the page it goes.
 *   - **Site images** - `KEY` + `IMAGE`: the logo, the hero's phone, the promo banners.
 *   - **Site links** - `KEY` + `URL`; the name is the link's label. The shop's pages over the
 *     header are keyed `pages`, the footer's support links `support`, the legal row `legal`,
 *     the social profiles `social`.
 *
 * A content key the shop does not have reads as "" and the block or line it fills is left out.
 */
export interface SiteLink {
  label: string;
  url: string;
}

export interface SiteContent {
  /** The shop's name: its "Site texts" `brand.name` where it has one, else its site info's. */
  brand: string;
  /** The interface words in the page's language, with the shop's own texts over them. */
  texts: Record<string, string>;
  images: Record<string, string[]>;
  links: Record<string, SiteLink[]>;
  /**
   * The language the page is read in - what dates and numbers are written in. The same on the
   * server and in the browser, unlike `<html lang>`, which the server cannot read.
   */
  language?: string;
}

/** Values put into a text - `{brand}`, `{count}`, `{name}`. */
export type TextVars = Record<string, string | number>;

/** Look a sentence up by its key, with any `{placeholders}` filled in. */
export type TextOf = (key: string, vars?: TextVars) => string;
