import { pageLocale } from "@estoreclub/storefront";

/**
 * `YYYY-MM-DD` as the visitor's language writes a date - "12 May 1990", "12 мая 1990 г." - so a
 * day and a month swapped are seen for what they are. Read from `pageLocale()`, as the render
 * knew it, so the server's HTML and the browser's agree.
 */
export function writtenDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  try {
    return new Intl.DateTimeFormat(pageLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  } catch {
    // An unknown language, or not a date: as it was given.
    return value;
  }
}
