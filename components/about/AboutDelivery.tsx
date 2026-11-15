import type { TextOf } from "../../lib/content/types";

import { ChevronRight } from "../Icons";

import { Eyebrow } from "./Eyebrow";
import { PhotoBand } from "./PhotoBand";

/**
 * Where sample-asian's About page has its restaurants and their map, this one says where the
 * shop DELIVERS - TechStore is online only, and its warehouse is not a place a customer is ever
 * sent. "We deliver across Auckland", how long it takes, what it costs and from when it is
 * free, and the way to the full delivery page.
 *
 * Drawn only for a shop whose order types include delivery (the page asks `siteInfo`); the
 * area and figures are the delivery page's own texts, so the two pages cannot disagree.
 */
export function AboutDelivery({ image, t }: { image: string; t: TextOf }) {
  // Each figure under its label ("Delivery fee · $9.90") - a bare "$9.90" says nothing.
  const figures = (
    [
      ["delivery.fact.eta", "delivery.eta"],
      ["delivery.fact.fee", "delivery.fee"],
      ["delivery.fact.free", "delivery.freeAbove"],
    ] as const
  )
    .filter(([, value]) => t(value))
    .map(([label, value]) => `${t(label)} · ${t(value)}`);

  return (
    <PhotoBand
      className="mt-16 lg:mt-20"
      height="lg:h-[400px]"
      image={image}
      position="75% 50%"
    >
      <Eyebrow onDark>{t("about.delivery.eyebrow")}</Eyebrow>
      <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-white lg:text-[38px]">
        {t("about.delivery.title", { zone: t("delivery.zone") })}
      </h2>
      <p className="mt-4 max-w-[400px] text-[15px] leading-[1.65] text-white/85">
        {t("about.delivery.text")}
      </p>
      {figures.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {figures.map((figure) => (
            <li
              key={figure}
              className="rounded-full bg-white/12 px-3.5 py-[7px] text-[12.5px] font-medium text-white ring-1 ring-white/20 backdrop-blur-sm"
            >
              {figure}
            </li>
          ))}
        </ul>
      ) : null}
      <a
        className="mt-7 inline-flex items-center gap-[10px] text-[14px] font-medium text-brand-bright transition hover:text-white"
        href="/delivery"
      >
        {t("about.delivery.link")}
        <ChevronRight size={14} strokeWidth={2} />
      </a>
    </PhotoBand>
  );
}
