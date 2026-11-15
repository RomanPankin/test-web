import { ContentPage } from "../../components/pages/ContentPage";
import { FaqList } from "../../components/pages/FaqList";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { textOf } from "../../lib/content/textOf";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.faq.title"),
    description: t("meta.faq.description"),
  };
}

/** How many questions the page can hold. A pair the shop empties simply is not asked. */
const QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * What an electronics shop is asked before it is trusted with an order: the warranty, how long
 * delivery takes, returns, paying, what "sold out" means, trade-in.
 *
 * Question and answer are two keys apiece in "Site texts" — `faq.q1`, `faq.a1` — so the list
 * is the shop's to rewrite, reorder by rewriting, or shorten by clearing a pair. A question
 * with no answer is left out: half a pair is worse than neither half.
 */
export default async function FaqPage() {
  const content = await loadContent();
  const t = textOf(content);

  const items = QUESTIONS.map((index) => ({
    question: t(`faq.q${index}`),
    answer: t(`faq.a${index}`),
  })).filter((item) => item.question && item.answer);

  return (
    <ContentPage intro={t("faq.intro")} title={t("faq.title")}>
      {items.length > 0 ? <FaqList items={items} /> : null}
      {/* The question nobody wrote down: the way to ask it. */}
      <p className="mt-8 text-[14.5px] text-muted">
        {t("faq.more")}{" "}
        <a
          className="font-medium text-brand underline-offset-2 hover:underline"
          href={t("faq.contactUrl")}
        >
          {t("faq.contact")}
        </a>
      </p>
    </ContentPage>
  );
}
