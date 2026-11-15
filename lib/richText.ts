/**
 * A product's rich-text fields, read back into plain data - never put into the page as HTML.
 *
 * The admin's editor stores markup (`OVERVIEW`, `SPECIFICATIONS`), and nothing on a shop's site
 * may run what an admin's paste carried in. So the markup is taken apart here into text - tags
 * dropped, entities decoded - and the page draws that text with React, which escapes it.
 */

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

/** Markup to its words: tags out, entities decoded, runs of space one space. */
export function textOf(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#?\w+);/g, (whole, name: string) => {
      if (ENTITIES[name]) return ENTITIES[name];
      const code = name.startsWith("#x")
        ? parseInt(name.slice(2), 16)
        : name.startsWith("#")
          ? parseInt(name.slice(1), 10)
          : NaN;

      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/** The paragraphs of a prose field - a `<p>` each, else the lines of plain text. */
export function paragraphsOf(html: string | null | undefined): string[] {
  if (!html?.trim()) return [];

  const blocks = /<p[\s>]/i.test(html)
    ? html.split(/<\/p>/i)
    : html.split(/\n{2,}|<br\s*\/?>\s*<br\s*\/?>/i);

  return blocks.map(textOf).filter(Boolean);
}

/** One group of a spec sheet - "Display" and its rows. */
export interface SpecGroup {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

/**
 * A spec sheet as the editor holds it - a heading per group, a list of "Label: value" lines
 * under it - into its groups. A line with no colon is a value without a label; rows before any
 * heading go in an untitled group.
 */
export function specSheetOf(html: string | null | undefined): SpecGroup[] {
  if (!html?.trim()) return [];

  const groups: SpecGroup[] = [];
  let current: SpecGroup | null = null;
  const token = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<li[^>]*>([\s\S]*?)<\/li>|<p[^>]*>([\s\S]*?)<\/p>/gi;

  for (const match of html.matchAll(token)) {
    if (match[1] !== undefined) {
      const title = textOf(match[1]);

      if (!title) continue;
      current = { title, rows: [] };
      groups.push(current);
      continue;
    }

    const line = textOf(match[2] ?? match[3] ?? "");

    if (!line) continue;
    if (!current) {
      current = { title: "", rows: [] };
      groups.push(current);
    }

    const colon = line.indexOf(":");

    current.rows.push(
      colon > 0 && colon < 48
        ? {
            label: line.slice(0, colon).trim(),
            value: line.slice(colon + 1).trim(),
          }
        : { label: "", value: line },
    );
  }

  return groups.filter((group) => group.rows.length > 0);
}
