import type {
  PublicProductSetting,
  PublicProductSettingDefinition,
} from "@estoreclub/api";
import type { Spec } from "./product";

/**
 * A product's specifications - every field the shop fills in and lets websites read, in the
 * order of its settings catalogue. Only TYPES from `@estoreclub/api`, so the server
 * (`lib/catalog.ts`) builds them.
 *
 * Data-driven rather than a fixed BRAND + WARRANTY pair: a shop that adds "Battery" or
 * "Screen size" to its product type sees it in the dialog without a line of code changing.
 *
 * Left out: what the page already says elsewhere (the badge, the spec line, the colours and
 * their prices), long text, a field nobody filled in, and a yes/no field that is off - "Water
 * resistant: No" is not a selling point.
 */
// WARRANTY_MONTHS too: the dialog's promises already say "N-month warranty".
const SHOWN_ELSEWHERE = new Set([
  "BADGE",
  "DESCRIPTION",
  "COLOUR",
  "PRICE",
  "WARRANTY_MONTHS",
  // The product page's own sections, not table rows.
  "OVERVIEW",
  "SPECIFICATIONS",
]);

/** Labels and units by key, from the shop's settings catalogue (`getProductSettings`). */
export type SettingLabels = Map<
  string,
  { label?: string; suffix?: string; order: number }
>;

export function settingLabelsOf(
  definitions: PublicProductSettingDefinition[],
): SettingLabels {
  return new Map(
    definitions.map((definition, order) => [
      definition.key,
      { label: definition.label, suffix: definition.suffix, order },
    ]),
  );
}

function valueOf(setting: PublicProductSetting): Spec["value"] | null {
  const { value } = setting;

  if (setting.type === "richtext" || value === "" || value === false)
    return null;
  if (value === true) return true;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") return value.trim() || null;
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || null;

  // A range - where the product sits on its scale.
  return `${value.value}/${value.max}`;
}

export function specsOf(
  settings: Record<string, PublicProductSetting> | undefined,
  labels: SettingLabels,
): Spec[] {
  const specs: Spec[] = [];

  for (const [key, setting] of Object.entries(settings ?? {})) {
    if (SHOWN_ELSEWHERE.has(key) || !setting) continue;

    const value = valueOf(setting);

    if (value === null) continue;

    const known = labels.get(key);

    specs.push({
      key,
      label: known?.label || setting.listName || key,
      value,
      ...(known?.suffix && typeof value === "number"
        ? { suffix: known.suffix }
        : {}),
    });
  }

  // The catalogue's order; a key it does not list (it can lag a field just added) goes last.
  const rank = (key: string) =>
    labels.get(key)?.order ?? Number.MAX_SAFE_INTEGER;

  return specs.sort((a, b) => rank(a.key) - rank(b.key));
}
