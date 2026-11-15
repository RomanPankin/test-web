import { ContentPage, ContentSection } from "../../components/pages/ContentPage";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { textOf } from "../../lib/content/textOf";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.privacy.title"),
    description: t("meta.privacy.description") || undefined,
  };
}

/** How many blocks the page can draw. A shop that empties one shortens the page by one. */
const SECTIONS = [1, 2, 3, 4, 5];

/**
 * One of the footer's help pages, written entirely from the shop's own texts.
 *
 * Every line is a key in "Site texts" — `privacy.s1.title`, `privacy.s1.body` and so on — so a shop
 * rewrites it from the dashboard, in whichever language it is read in, without anybody
 * touching the site. A section whose title and body are both empty is skipped rather than
 * drawn as a heading over nothing: emptying the pair is how a shop deletes a section.
 *
 * What the shop does with a customer's details. Seeded as a starting point, like the terms beside it — the words are the shop's to get right.
 */
export default async function PrivacyPage() {
  const content = await loadContent();
  const t = textOf(content);

  return (
    <ContentPage intro={t("privacy.intro")} title={t("privacy.title")}>
      {SECTIONS.map((index) => {
        const title = t(`privacy.s${index}.title`);
        const body = t(`privacy.s${index}.body`);

        if (!title && !body) return null;

        return (
          <ContentSection key={index} title={title}>
            <p>{body}</p>
          </ContentSection>
        );
      })}
    </ContentPage>
  );
}
