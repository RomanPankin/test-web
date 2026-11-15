"use client";

import { useMemo, useState } from "react";

import { pageLocale } from "@estoreclub/storefront";
import { FIELD } from "./styles";

type Part = "day" | "month" | "year";

/** How much of the row each list takes - the month's name is the longest. */
const GROW: Record<Part, string> = {
  day: "flex-[1]",
  month: "flex-[1.7]",
  year: "flex-[1.2]",
};

/**
 * A date of birth as three lists - day, month, year - instead of `<input type="date">`.
 *
 * The browser's own date field writes its hint ("dd/mm/yyyy") and its calendar in the BROWSER's
 * language, whatever the page is in, and nothing on the page can change that. These lists speak
 * the page's language (`<html lang>`): the months by name, "Day / Month / Year" from the
 * runtime's own words for them, and in the order that language writes a date.
 *
 * `value` is `YYYY-MM-DD`, or "" until all three are chosen. A day past the month's end (the
 * 31st, then February) is pulled back to its last day.
 */
export function DateOfBirthField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // The page's language as the render knew it (`MoneySeed`), so the server's HTML and the
  // browser's agree - `<html lang>` is only written after hydration, and read during the server
  // render it gave English, swapped for the page's language a moment later.
  const language = pageLocale();
  const [initialYear, initialMonth, initialDay] = value
    ? value.split("-")
    : ["", "", ""];
  const [parts, setParts] = useState<Record<Part, string>>({
    day: initialDay ? String(Number(initialDay)) : "",
    month: initialMonth ? String(Number(initialMonth)) : "",
    year: initialYear ?? "",
  });

  const { order, names, months } = useMemo(() => {
    const format = (options: Intl.DateTimeFormatOptions) => {
      try {
        return new Intl.DateTimeFormat(language, options);
      } catch {
        return new Intl.DateTimeFormat("en", options);
      }
    };
    const fieldName = (part: Part, fallback: string) => {
      try {
        const said = new Intl.DisplayNames(language, {
          type: "dateTimeField",
        }).of(part);

        return said
          ? said.charAt(0).toLocaleUpperCase(language) + said.slice(1)
          : fallback;
      } catch {
        return fallback;
      }
    };
    const sequence = format({ day: "numeric", month: "long", year: "numeric" })
      .formatToParts(new Date(2000, 10, 25))
      .map((piece) => piece.type)
      .filter(
        (type): type is Part =>
          type === "day" || type === "month" || type === "year",
      );
    const monthName = format({ month: "long" });

    return {
      order:
        sequence.length === 3 ? sequence : (["day", "month", "year"] as Part[]),
      names: {
        day: fieldName("day", "Day"),
        month: fieldName("month", "Month"),
        year: fieldName("year", "Year"),
      },
      months: Array.from({ length: 12 }, (_, index) =>
        monthName.format(new Date(2000, index, 1)),
      ),
    };
  }, [language]);

  const thisYear = new Date().getFullYear();
  const lastDay =
    parts.month && parts.year
      ? new Date(Number(parts.year), Number(parts.month), 0).getDate()
      : parts.month
        ? new Date(2000, Number(parts.month), 0).getDate()
        : 31;

  const choose = (part: Part, picked: string) => {
    const next = { ...parts, [part]: picked };
    const end =
      next.month && next.year
        ? new Date(Number(next.year), Number(next.month), 0).getDate()
        : next.month
          ? new Date(2000, Number(next.month), 0).getDate()
          : 31;

    if (next.day && Number(next.day) > end) next.day = String(end);
    setParts(next);
    onChange(
      next.day && next.month && next.year
        ? `${next.year}-${next.month.padStart(2, "0")}-${next.day.padStart(2, "0")}`
        : "",
    );
  };

  const options: Record<Part, { value: string; label: string }[]> = {
    day: Array.from({ length: lastDay }, (_, index) => ({
      value: String(index + 1),
      label: String(index + 1),
    })),
    month: months.map((label, index) => ({ value: String(index + 1), label })),
    year: Array.from({ length: 111 }, (_, index) => ({
      value: String(thisYear - index),
      label: String(thisYear - index),
    })),
  };

  return (
    <span className="flex gap-2">
      {order.map((part) => (
        <select
          key={part}
          aria-label={names[part]}
          autoComplete={`bday-${part}`}
          className={
            FIELD +
            " min-w-0 px-2 " +
            GROW[part] +
            (parts[part] ? "" : " text-[#a7aab0]")
          }
          value={parts[part]}
          onChange={(event) => choose(part, event.target.value)}
        >
          <option value="">{names[part]}</option>
          {options[part].map((option) => (
            <option
              key={option.value}
              className="text-ink"
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </span>
  );
}
