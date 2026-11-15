import type { TextOf } from "../../../lib/content/types";
import type { CabinetLocation } from "./types";

import { currencyDigits, money, pageLocale } from "@estoreclub/storefront";

/** Minor units to the shop's money. */
export const cents = (value: number) => money(value / 10 ** currencyDigits());

/** "Sep 28, 2026, 19:12" — an order's moment, in the site's language. */
export function orderMoment(iso: string): string {
  return new Intl.DateTimeFormat(pageLocale(), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** "19:45" — a time of day. */
export function clock(iso: string): string {
  return new Intl.DateTimeFormat(pageLocale(), {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * "9:30" today, "Sat 1 Nov 9:30" on another day - when an order is due: the time alone said of
 * tomorrow's delivery read as this morning's.
 */
export function clockOrDay(iso: string): string {
  const at = new Date(iso);
  const today = new Date();
  const sameDay =
    at.getFullYear() === today.getFullYear() &&
    at.getMonth() === today.getMonth() &&
    at.getDate() === today.getDate();

  return sameDay ? clock(iso) : `${shortDay(iso)} ${clock(iso)}`;
}

/** "Fri 26 Sep" — a day: when an address was last delivered to. */
export function shortDay(iso: string): string {
  return new Intl.DateTimeFormat(pageLocale(), {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** The three parts of an upcoming booking's date block: "FRI", "10", "OCT". */
export function dateBlock(iso: string): {
  weekday: string;
  day: string;
  month: string;
} {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(pageLocale(), options)
      .format(date)
      .replace(".", "");

  return {
    weekday: part({ weekday: "short" }),
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
  };
}

/** "2 hours", "90 min" — how long a table is held. */
export function duration(minutes: number, t: TextOf): string {
  return minutes % 60 === 0
    ? t(minutes === 60 ? "account.hoursOne" : "account.hours", {
        count: minutes / 60,
      })
    : t("booking.lengthMinutes", { count: minutes });
}

/** "Downtown, 12 Market St" — the location's name with its street, when the page knows it. */
export function placeLine(
  locations: CabinetLocation[],
  { id, name }: { id?: string | null; name: string | null },
): string | null {
  const found = locations.find((each) =>
    id ? each.id === id : each.name === name,
  );
  const label = name ?? found?.name ?? null;

  if (!label) return null;

  return found?.address ? `${label}, ${found.address}` : label;
}
