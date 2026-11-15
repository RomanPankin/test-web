import { siteInfo } from "@estoreclub/storefront/server";
import { AboutDelivery } from "../../components/about/AboutDelivery";
import { AboutStory } from "../../components/about/AboutStory";
import { AboutValues } from "../../components/about/AboutValues";
import { Eyebrow } from "../../components/about/Eyebrow";
import { PhotoBand } from "../../components/about/PhotoBand";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { imageOf, textOf } from "../../lib/content/textOf";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.about.title"),
    description: t("meta.about.description") || undefined,
  };
}

const H2_ON_DARK =
  "mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-white lg:text-[38px]";
const BODY_ON_DARK =
  "mt-4 max-w-[400px] text-[15px] leading-[1.65] text-white/85";
const BUTTON_ON_DARK =
  "mt-7 inline-flex h-[46px] items-center justify-center rounded-full bg-white px-7 text-[14.5px] font-medium text-ink transition hover:bg-white/90";

/**
 * Who the shop is: sample-asian's About page, for a shop with no premises.
 *
 * Top to bottom: the hero band, the story, four reasons to buy here (`AboutValues`), the band
 * about how a device is checked before it ships, where the shop delivers (`AboutDelivery` -
 * in place of sample-asian's restaurants and map: no customer is ever shown the warehouse),
 * and a last band back to the shop. Every word is "Site texts", every photograph "Site images".
 */
export default async function AboutPage() {
  const [content, site] = await Promise.all([loadContent(), siteInfo()]);
  const t = textOf(content);
  const image = (key: string) => imageOf(content, key);
  const delivers = site?.orderTypes?.includes("delivery") ?? false;
  // Each band is the shop's photo with its words; a band without its photo is not drawn
  // (`PhotoBand`), a line the shop has not written is left out.
  const line = (key: string, className: string) =>
    t(key) ? <p className={className}>{t(key)}</p> : null;
  const heading = (key: string) =>
    t(key) ? <h2 className={H2_ON_DARK}>{t(key)}</h2> : null;
  const heroTitle = t("about.hero.title");
  const heroAccent = t("about.hero.titleAccent");

  return (
    <main className="pb-6">
      <PhotoBand
        priority
        className="mt-6 sm:mt-8"
        height="lg:h-[460px]"
        image={image("about.hero")}
      >
        <Eyebrow onDark>{t("about.hero.eyebrow")}</Eyebrow>
        {heroTitle || heroAccent ? (
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-[52px]">
            {heroTitle}
            {heroAccent ? (
              <span className="block text-brand-soft">{heroAccent}</span>
            ) : null}
          </h1>
        ) : null}
        {line(
          "about.hero.text",
          "mt-5 max-w-[400px] text-[15.5px] leading-[1.65] text-white/85",
        )}
        <a className={BUTTON_ON_DARK} href="/shop">
          {t("hero.buy")}
        </a>
      </PhotoBand>

      <AboutStory image={image("about.story")} t={t} />
      <AboutValues t={t} />

      <PhotoBand
        className="mt-16 lg:mt-20"
        height="lg:h-[360px]"
        image={image("about.behind")}
        position="65% 50%"
      >
        <Eyebrow onDark>{t("about.behind.eyebrow")}</Eyebrow>
        {heading("about.behind.title")}
        {line("about.behind.text", BODY_ON_DARK)}
      </PhotoBand>

      {delivers ? (
        <AboutDelivery image={image("about.delivery")} t={t} />
      ) : null}

      {/* The page ends where it should lead: back to the shop. */}
      <PhotoBand
        className="mt-16 lg:mt-20"
        height="lg:h-[300px]"
        image={image("about.cta")}
        position="70% 50%"
      >
        {heading("about.cta.title")}
        {line("about.cta.text", BODY_ON_DARK)}
        <a className={BUTTON_ON_DARK} href="/shop">
          {t("about.cta.button")}
        </a>
      </PhotoBand>
    </main>
  );
}
