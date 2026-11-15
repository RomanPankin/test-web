import type { TextOf } from "../../lib/content/types";

import { FRAME } from "../../lib/layout";
import {
  BadgeCheckIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "../Icons";

import { Eyebrow } from "./Eyebrow";

/** The four, in order: genuine products, the warranty, fast delivery, people to ask. */
const ICONS = [BadgeCheckIcon, ShieldCheckIcon, TruckIcon, HeadsetIcon];

/**
 * Why buy here: four promises on the cards' grey, an outline icon, a title and a line each -
 * the home page's promise row grown into tiles. Icons, not photographs as on sample-asian's
 * page: a warranty or a support line has nothing to photograph that would not be a stock
 * picture of a handshake.
 *
 * Each is `about.value.<n>.title` / `.text` in "Site texts"; a pair the shop empties is left
 * out, and the row closes up.
 */
export function AboutValues({ t }: { t: TextOf }) {
  const values = ICONS.map((Icon, index) => ({
    Icon,
    title: t(`about.value.${index + 1}.title`),
    text: t(`about.value.${index + 1}.text`),
  })).filter((value) => value.title || value.text);

  if (values.length === 0) return null;

  return (
    <section className={FRAME + " mt-16 lg:mt-20"}>
      <Eyebrow>{t("about.values.eyebrow")}</Eyebrow>
      {t("about.values.title") ? (
        <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-ink lg:text-[30px]">
          {t("about.values.title")}
        </h2>
      ) : null}
      <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
        {values.map(({ Icon, title, text }) => (
          <li key={title} className="rounded-[10px] bg-tile px-6 pb-7 pt-6">
            <Icon className="text-ink" size={36} strokeWidth={1.2} />
            <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.02em] text-ink">
              {title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
