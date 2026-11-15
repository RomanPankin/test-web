import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";
import { ArrowRight } from "../Icons";

/**
 * The trade-in card: four phones fanned on the left, cut off at the card's foot, and the offer
 * on the right — a blue eyebrow, the headline, a sentence, the monthly price in blue and a link.
 *
 * The shop's own offer: drawn only with its "Site images" `promo-trade-in` picture and a title.
 * The price line needs the shop's `trade.amount`, the link its `trade.url`.
 */
export function TradeIn({ t, image }: { t: TextOf; image: string }) {
  const eyebrow = t("trade.eyebrow");
  const text = t("trade.text");
  const amount = t("trade.amount");
  const url = t("trade.url");

  if (!image || !t("trade.title")) return null;

  return (
    <section className={FRAME + " mt-[26px]"}>
      <div className="relative flex flex-col-reverse overflow-hidden rounded-[12px] bg-[#f2f4f8] lg:block lg:h-[239px]">
        <Image
          alt={t("trade.imageAlt")}
          className="relative mx-auto block w-[min(440px,100%)] mix-blend-darken max-w-none lg:absolute lg:bottom-0 lg:left-[40px] lg:w-[415px] xl:left-[110px]"
          sizes="520px"
          src={image}
        />
        <div className="relative px-7 pb-6 pt-8 lg:absolute lg:left-[56%] lg:top-0 xl:left-[688px] lg:p-0 lg:pt-[29px]">
          {eyebrow ? (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.04em] text-brand lg:text-[9.5px]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-[10px] text-[26px] font-semibold tracking-[-0.03em] text-ink lg:mt-[9px] lg:text-[30px]">
            {t("trade.title")}
          </h2>
          {text ? (
            <p className="mt-[8px] max-w-[340px] text-[13.5px] leading-[23px] text-[#7b808b] lg:text-[14px]">
              {text}
            </p>
          ) : null}
          {amount ? (
            <p className="mt-[10px] flex items-baseline gap-[7px] text-brand">
              <span className="text-[20px] font-medium tracking-[-0.02em]">{t("trade.from")}</span>
              <span className="text-[34px] font-medium leading-none tracking-[-0.03em]">
                {amount}
              </span>
              <span className="text-[20px] font-medium tracking-[-0.02em]">{t("trade.per")}</span>
            </p>
          ) : null}
          {url ? (
            <a
              className="mt-[14px] inline-flex items-center gap-[10px] text-[13.5px] font-medium text-brand transition hover:text-brand-hover"
              href={url}
            >
              {t("trade.link")}
              <ArrowRight size={13} strokeWidth={1.8} />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
