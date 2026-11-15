import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";
import { ChevronRight } from "../Icons";

/**
 * The two banners side by side: the dark gaming card and the light tablets card. Each picture
 * is shot on its card's own colour and faded in from the left, so the words sit on the card and
 * the product rises out of it. The wide tablets picture keeps to the card's right three fifths and
 * the words to the left two, so a long title never runs into the tablet. The light card is the tablets photo's own grey, so the picture has no edge. Stacked below `lg`.
 */
export function PromoCards({
  t,
  gaming,
  tablets,
}: {
  t: TextOf;
  gaming: string;
  tablets: string;
}) {
  return (
    <div className={FRAME + " mt-[35px] grid gap-5 lg:grid-cols-2"}>
      <a
        className="group relative flex h-[400px] overflow-hidden rounded-[12px] bg-[#0b1018] sm:h-[300px] lg:h-[323px]"
        href={t("promo.gaming.url")}
      >
        {gaming ? (
          <Image
            alt=""
            className="absolute bottom-0 right-0 h-[58%] w-auto max-w-none [mask-image:linear-gradient(180deg,transparent,#000_30%)] sm:[mask-image:linear-gradient(90deg,transparent,#000_22%)] transition duration-500 group-hover:scale-[1.03] sm:h-full"
            sizes="340px"
            src={gaming}
          />
        ) : null}
        <div className="relative z-10 px-7 pt-9 sm:pt-[60px] lg:px-[36px] lg:pt-[61px]">
          <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white lg:text-[34px]">
            {t("promo.gaming.title")}
          </h2>
          <p className="mt-[12px] whitespace-pre-line text-[14px] leading-[1.5] text-white/85 lg:text-[15.5px] lg:leading-[24px]">
            {t("promo.gaming.text")}
          </p>
          <span className="mt-[26px] inline-flex items-center gap-[10px] text-[14px] font-medium text-[#3b8bff] lg:text-[14.5px]">
            {t("promo.gaming.link")}
            <ChevronRight size={14} strokeWidth={2} />
          </span>
        </div>
      </a>

      <a
        className="group relative flex h-[400px] overflow-hidden rounded-[12px] bg-[#f4f6f8] sm:h-[300px] lg:h-[323px]"
        href={t("promo.tablets.url")}
      >
        {tablets ? (
          <Image
            alt=""
            className="absolute bottom-0 right-0 h-[56%] w-auto max-w-none [mask-image:linear-gradient(180deg,transparent,#000_30%)] transition duration-500 group-hover:scale-[1.03] sm:top-1/2 sm:bottom-auto sm:h-auto sm:max-h-full sm:w-[62%] sm:-translate-y-1/2 sm:object-contain sm:object-right sm:[mask-image:linear-gradient(90deg,transparent,#000_14%)] sm:group-hover:-translate-y-1/2"
            sizes="420px"
            src={tablets}
          />
        ) : null}
        <div className="relative z-10 max-w-[260px] px-7 pt-9 sm:max-w-[42%] sm:pr-0 sm:pt-[60px] lg:px-[40px] lg:pr-0 lg:pt-[63px]">
          <h2 className="text-[28px] font-semibold leading-[1.18] tracking-[-0.03em] text-ink lg:text-[35px] lg:leading-[43px]">
            {t("promo.tablets.title")}
          </h2>
          <p className="mt-[16px] max-w-[200px] text-[14px] leading-[1.6] text-[#7b808b] lg:text-[15px] lg:leading-[24px]">
            {t("promo.tablets.text")}
          </p>
          <span className="mt-[22px] inline-flex items-center gap-[10px] text-[14px] font-medium text-brand lg:text-[14.5px]">
            {t("promo.tablets.link")}
            <ChevronRight size={14} strokeWidth={2} />
          </span>
        </div>
      </a>
    </div>
  );
}
