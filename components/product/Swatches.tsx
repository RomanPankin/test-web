"use client";

import type { Colour } from "../../lib/product";

import { useText } from "../ContentProvider";

/**
 * A product's colours as round swatches, the chosen one ringed. Radio buttons underneath, so
 * arrow keys move between them and a screen reader hears "Colour: Black Titanium".
 *
 * `size` is the dot's diameter: small on a card, larger in the dialog.
 */
export function Swatches({
  colours,
  value,
  onChange,
  size = 13,
  name,
  className = "",
}: {
  colours: Colour[];
  value: string | null;
  onChange: (id: string) => void;
  size?: number;
  /** The radio group's name - unique per card, so two cards' groups do not join up. */
  name: string;
  className?: string;
}) {
  const t = useText();

  if (colours.length === 0) return null;

  return (
    <div
      aria-label={t("product.colour")}
      className={"flex items-center " + className}
      role="radiogroup"
      style={{ gap: Math.round(size * 0.5) }}
    >
      {colours.map((colour) => {
        const selected = colour.id === value;

        return (
          <label
            key={colour.id}
            className="relative grid cursor-pointer place-items-center rounded-full"
            style={{ width: size + 6, height: size + 6 }}
            title={colour.name}
          >
            <input
              aria-label={t("product.colourNamed", { name: colour.name })}
              checked={selected}
              className="peer sr-only"
              name={name}
              type="radio"
              value={colour.id}
              onChange={() => onChange(colour.id)}
            />
            {/* The ring round the chosen one, and a focus ring for the keyboard. */}
            <span
              aria-hidden="true"
              className={
                "absolute inset-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand " +
                (selected ? "ring-1 ring-ink/45" : "")
              }
            />
            <span
              aria-hidden="true"
              className="block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
              style={{ width: size, height: size, backgroundColor: colour.hex }}
            />
          </label>
        );
      })}
    </div>
  );
}
