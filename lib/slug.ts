/**
 * A category's anchor on /shop - `Phones` → `phones`, `Носимые устройства` →
 * `nosimye-ustrojstva`.
 *
 * Cyrillic is spelled out in Latin letters so a Russian page gets readable anchors too; the
 * header's links (the "Site links" list, keyed `nav`) point at these, in each language.
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
