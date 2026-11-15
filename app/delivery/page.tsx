import { Image } from "@estoreclub/client";

import { siteInfo } from "@estoreclub/storefront/server";
import { DeliveryFacts } from "../../components/delivery/DeliveryFacts";
import { ClockIcon, GiftIcon, PinIcon, TagIcon } from "../../components/Icons";
import {
  ContentPage,
  ContentSection,
} from "../../components/pages/ContentPage";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { imageOf, textOf } from "../../lib/content/textOf";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.delivery.title"),
    description: t("meta.delivery.description"),
  };
}

/** How many blocks each half can draw. A shop that empties one shortens the page by one. */
const SECTIONS = [1, 2, 3, 4, 5];

/**
 * Delivery & returns: how an order reaches the customer, and how it goes back.
 *
 * The four figures first - where the shop delivers, the fee, from when it is free, how long it
 * takes (`DeliveryFacts`) - then the details as prose, then returns and the warranty under a
 * heading of their own (`#returns`, where the footer's "Returns" link lands).
 *
 * Every word is the shop's ("Site texts"), as on sample-asian's page. The figures too: the API
 * a site reads has no delivery zones to ask (the zone, fee and threshold are priced by the
 * platform's payment page, which asks for the address), so they are written down here - seeded
 * to match the sample's own Auckland zone - and a shop that changes its zone rewrites them. What
 * the page does read from the shop is WHETHER it delivers: one that does not is told so rather
 * than shown a fee it does not charge.
 *
 * A section whose title and body are both empty is skipped: emptying the pair is how a shop
 * deletes it.
 */
export default async function DeliveryPage() {
  const [content, site] = await Promise.all([loadContent(), siteInfo()]);
  const t = textOf(content);
  const delivers = site?.orderTypes?.includes("delivery") ?? false;
  const image = imageOf(content, "delivery.hero");
  const sections = (prefix: string) =>
    SECTIONS.map((index) => {
      const title = t(`${prefix}.s${index}.title`);
      const body = t(`${prefix}.s${index}.body`);

      if (!title && !body) return null;

      return (
        <ContentSection key={index} title={title}>
          <p>{body}</p>
        </ContentSection>
      );
    });

  return (
    <ContentPage intro={t("delivery.intro")} title={t("delivery.title")}>
      {image ? (
        <Image
          alt={t("delivery.imageAlt")}
          className="mb-8 aspect-[2/1] w-full rounded-[12px] bg-tile object-cover"
          sizes="(min-width: 768px) 680px, 100vw"
          src={image}
        />
      ) : null}

      {delivers ? (
        <>
          <DeliveryFacts
            facts={[
              {
                label: t("delivery.fact.zone"),
                value: t("delivery.zone"),
                Icon: PinIcon,
              },
              {
                label: t("delivery.fact.fee"),
                value: t("delivery.fee"),
                Icon: TagIcon,
              },
              {
                label: t("delivery.fact.free"),
                value: t("delivery.freeAbove"),
                Icon: GiftIcon,
              },
              {
                label: t("delivery.fact.eta"),
                value: t("delivery.eta"),
                Icon: ClockIcon,
              },
            ]}
          />
          <div className="mt-10">{sections("delivery")}</div>
        </>
      ) : (
        <p className="rounded-[10px] bg-tile px-4 py-3.5 text-[14.5px] text-ink">
          {t("delivery.none")}
        </p>
      )}

      <section
        className="mt-14 scroll-mt-24 border-t border-line pt-10"
        id="returns"
      >
        <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-ink">
          {t("returns.title")}
        </h2>
        <p className="mt-2 text-[15px] leading-[1.65] text-muted">
          {t("returns.intro")}
        </p>
        <div className="mt-8">{sections("returns")}</div>
      </section>
    </ContentPage>
  );
}
