import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";

/**
 * The opening band: a very light cool-grey wash across the full width, the two-line headline,
 * the line under it and two pills on the left — and the phone, floating, on the right.
 *
 * The phones are cut out of their backdrop (a transparent picture), so they float on the band
 * itself - no frame, no grey patch where the photo's own background met the band's - lit by a
 * soft glow in the screens' blue and grounded by a floor shadow. On a phone the picture moves
 * under the words.
 *
 * The shop's own band: without its "Site images" `hero` picture it is left out, and each line
 * the shop has not written is too.
 */
export function Hero({
  t,
  image,
  learnMore,
}: {
  t: TextOf;
  image: string;
  /** Where "Learn more" goes - the first category's section of the shop. */
  learnMore: string;
}) {
  if (!image) return null;

  const title = [t("hero.title1"), t("hero.title2")].filter(Boolean);
  const text = t("hero.text");

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(100deg,#eef1f6_0%,#e6eaf1_45%,#d9dfe9_100%)]">
      {/* The light, falling from the top left — where the headline is. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_90%_at_22%_30%,#eceef4_0%,rgba(236,238,244,0)_70%)]"
      />
      <div className={FRAME + " relative lg:h-[500px]"}>
        <div className="relative z-10 pt-12 sm:pt-16 xl:pl-[101px] lg:pt-[120px]">
          {title.length > 0 ? (
            <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[60px] lg:text-[66px] lg:leading-[69px]">
              {title.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>
          ) : null}
          {text ? (
            <p className="mt-4 text-[16px] tracking-[-0.01em] text-body sm:text-[18px] lg:mt-[16px] lg:text-[19.5px]">
              {text}
            </p>
          ) : null}
          <div className="mt-7 flex gap-[18px] lg:mt-[26px]">
            <a
              className="inline-flex h-[46px] w-[138px] items-center justify-center rounded-full bg-ink text-[14.5px] font-medium text-white transition hover:bg-black"
              href="/shop"
            >
              {t("hero.buy")}
            </a>
            <a
              className="inline-flex h-[46px] w-[144px] items-center justify-center rounded-full border-[1.5px] border-ink text-[14.5px] font-medium text-ink transition hover:bg-white/60"
              href={learnMore}
            >
              {t("hero.learn")}
            </a>
          </div>
        </div>

        {/* The phones with their light: a soft glow in the screens' blue behind them, and a
            floor shadow under them, so they hang IN the band rather than stand cut out on it. */}
        <div className="pointer-events-none relative mx-auto mt-6 w-[min(420px,90%)] max-lg:mb-8 lg:absolute lg:right-4 lg:top-[24px] lg:mt-0 lg:w-[420px] xl:left-[720px] xl:right-auto xl:top-[18px] xl:w-[460px]">
          {/* A white spotlight first, then the screens' blue in it. */}
          <div
            aria-hidden="true"
            className="absolute -inset-[6%] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.95),rgba(255,255,255,0)_62%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_58%_46%,rgba(10,99,238,0.45),rgba(124,92,255,0.22)_48%,transparent_74%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[1%] left-1/2 h-[6%] w-[44%] -translate-x-[40%] rounded-[50%] bg-[rgba(17,18,22,0.30)] blur-xl"
          />
          <Image
            priority
            alt={t("hero.imageAlt")}
            className="relative block w-full [filter:drop-shadow(0_18px_22px_rgba(17,18,22,0.14))]"
            sizes="(min-width: 1280px) 460px, (min-width: 1024px) 420px, 90vw"
            src={image}
          />
        </div>
      </div>
    </section>
  );
}
