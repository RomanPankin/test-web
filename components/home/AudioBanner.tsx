import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";
import { ChevronRight } from "../Icons";

/**
 * The wide dark banner: two lines of headline, a sentence and a link on the left, the
 * headphones on the right, rising out of the dark with a blue horizon behind them.
 *
 * The shop's own: drawn only with its "Site images" `promo-audio` picture and a headline.
 */
export function AudioBanner({ t, image }: { t: TextOf; image: string }) {
  const title = [t("audio.title1"), t("audio.title2")].filter(Boolean);
  const text = t("audio.text");
  const link = t("audio.link");

  if (!image || title.length === 0) return null;

  return (
    <section className={FRAME + " mt-[28px]"}>
      <a
        className="group relative flex h-[420px] overflow-hidden rounded-[12px] bg-[#0a0c0f] sm:h-[315px]"
        href={t("audio.url") || "/shop"}
      >
        <Image
          alt=""
          className="absolute bottom-0 left-[18%] h-[52%] w-auto max-w-none [mask-image:linear-gradient(180deg,transparent,#000_30%)] sm:[mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] transition duration-700 group-hover:scale-[1.02] sm:left-[54%] sm:h-[121%]"
          sizes="760px"
          src={image}
        />
        <div className="relative z-10 px-7 pt-10 sm:px-12 sm:pt-[56px] lg:px-[70px]">
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[40px] lg:text-[44px] lg:leading-[50px]">
            {title.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          {text ? (
            <p className="mt-[14px] max-w-[352px] text-[14.5px] leading-[24px] text-white/85 lg:text-[17px] lg:leading-[25px]">
              {text}
            </p>
          ) : null}
          {link ? (
            <span className="mt-[24px] inline-flex items-center gap-[10px] text-[14px] font-medium text-[#3b8bff] lg:text-[14.5px]">
              {link}
              <ChevronRight size={14} strokeWidth={2} />
            </span>
          ) : null}
        </div>
      </a>
    </section>
  );
}
