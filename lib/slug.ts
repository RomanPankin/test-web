/**
 * A category's anchor on /shop - `Phones` → `phones`. Made from the category's canonical
 * (untranslated) name, so it is the same in every language the page is read in; the header's
 * and footer's category links (`lib/navLinks.ts`) point at the same slug.
 *
 * Cyrillic is spelled out in Latin letters only for a shop whose OWN name for a category is
 * Cyrillic (`Носимые устройства` → `nosimye-ustrojstva`), so its anchors are still readable.
 */
const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "j",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugOf(name: string): string {
  return name
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
