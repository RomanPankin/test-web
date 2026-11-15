import { ContentPage } from "../../components/pages/ContentPage";
import { TrackOrder } from "../../components/track/TrackOrder";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { textOf } from "../../lib/content/textOf";
import { siteInfo } from "@estoreclub/storefront/server";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.track.title"),
    description: t("meta.track.description") || undefined,
  };
}

/**
 * Where an order got to: the shopper types the number from their confirmation and reads the
 * answer - sample-asian's page, for parcels rather than dinners.
 *
 * The page itself is words; the form and the answer are one island (`TrackOrder`), which reads
 * `?order=` in the browser - see there for why the server cannot. A signed-in customer has every
 * order on their account page, and is pointed at it.
 */
export default async function TrackPage() {
  const [content, site] = await Promise.all([loadContent(), siteInfo()]);
  const t = textOf(content);

  return (
    <ContentPage intro={t("track.intro")} title={t("track.title")}>
      <TrackOrder allowsGuests={site?.publicOrderTracking === true} />

      <p className="mt-8 text-[14px] text-muted">
        {t("track.account")}{" "}
        <a
          className="font-medium text-brand underline-offset-2 hover:underline"
          href="/account"
        >
          {t("account.myAccount")}
        </a>
      </p>
    </ContentPage>
  );
}
