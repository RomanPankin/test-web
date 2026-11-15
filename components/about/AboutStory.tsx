import type { TextOf } from "../../lib/content/types";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";

import { Eyebrow } from "./Eyebrow";

/**
 * The photo on the left, the story on the right; stacked on a phone, the photo first. The
 * shop's own story: a line it has not written is left out, and with no title and no text the
 * section is.
 */
export function AboutStory({ image, t }: { image: string; t: TextOf }) {
  const title = t("about.story.title");
  const paragraphs = [t("about.story.text1"), t("about.story.text2")].filter(Boolean);

  if (!title && paragraphs.length === 0) return null;

  return (
    <section
      className={
        FRAME +
        " mt-16 grid items-center gap-10 lg:mt-20 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-[72px]"
      }
    >
      {image ? (
        <Image
          alt={t("about.story.imageAlt")}
          className="aspect-[4/3] w-full rounded-[12px] bg-tile object-cover"
          sizes="(min-width: 1024px) 560px, 100vw"
          src={image}
        />
      ) : null}
      <div>
        <Eyebrow>{t("about.story.eyebrow")}</Eyebrow>
        {title ? (
          <h2 className="mt-3 max-w-[460px] text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-ink lg:text-[36px]">
            {title}
          </h2>
        ) : null}
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={
              (index === 0 ? "mt-5" : "mt-4") +
              " max-w-[480px] text-[15px] leading-[1.75] text-body"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
