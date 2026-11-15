import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";
import { ChevronRight } from "../Icons";

/**
 * The wide dark banner: two lines of headline, a sentence and a link on the left, the
 * headphones on the right, rising out of the dark with a blue horizon behind them.
 */
export function AudioBanner({ t, image }: { t: TextOf; image: string }) {
  return (
    <section className={FRAME + " mt-[28px]"}>
      <a
        className="group relative flex h-[420px] overflow-hidden rounded-[12px] bg-[#0a0c0f] sm:h-[315px]"
        href={t("audio.url")}
      >
        {image ? (
          <Image
            alt=""
            className="absolute bottom-0 left-[18%] h-[52%] w-auto max-w-none [mask-image:linear-gradient(180deg,transparent,#000_30%)] sm:[mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] transition duration-700 group-hover:scale-[1.02] sm:left-[54%] sm:h-[121%]"
            sizes="760px"
            src={image}
          />
        ) : null}
        <div className="relative z-10 px-7 pt-10 sm:px-12 sm:pt-[56px] lg:px-[70px]">
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[40px] lg:text-[44px] lg:leading-[50px]">
            {t("audio.title1")}
            <br />
            {t("audio.title2")}
          </h2>
          <p className="mt-[14px] max-w-[352px] text-[14.5px] leading-[24px] text-white/85 lg:text-[17px] lg:leading-[25px]">
            {t("audio.text")}
          </p>
          <span className="mt-[24px] inline-flex items-center gap-[10px] text-[14px] font-medium text-[#3b8bff] lg:text-[14.5px]">
            {t("audio.link")}
            <ChevronRight size={14} strokeWidth={2} />
          </span>
        </div>
      </a>
    </section>
  );
}
