import { TermsText } from "../../components/account/TermsText";
import { loadTermsText } from "@estoreclub/storefront/server";
import { ContentPage, ContentSection } from "../../components/pages/ContentPage";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { textOf } from "../../lib/content/textOf";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.terms.title"),
    description: t("meta.terms.description") || undefined,
  };
}

/** How many blocks the page can draw. A shop that empties one shortens the page by one. */
const SECTIONS = [1, 2, 3, 4, 5];

/**
 * One of the footer's help pages, written entirely from the shop's own texts.
 *
 * Every line is a key in "Site texts" — `terms.s1.title`, `terms.s1.body` and so on — so a shop
 * rewrites it from the dashboard, in whichever language it is read in, without anybody
 * touching the site. A section whose title and body are both empty is skipped rather than
 * drawn as a heading over nothing: emptying the pair is how a shop deletes a section.
 *
 * The shop's own terms. The seeded text is a starting point and says so: a real shop replaces it with wording its own lawyer has read.
 */
export default async function TermsPage() {
  // The shop's own text, written in Sales rules, when it wrote one.
  const written = await loadTermsText();
  const content = await loadContent();
  const t = textOf(content);

  if (written) {
    return (
      <ContentPage intro={t("terms.intro")} title={t("terms.title")}>
        <TermsText markdown={written} />
      </ContentPage>
    );
  }

  return (
    <ContentPage intro={t("terms.intro")} title={t("terms.title")}>
      {SECTIONS.map((index) => {
        const title = t(`terms.s${index}.title`);
        const body = t(`terms.s${index}.body`);

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
