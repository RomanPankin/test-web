"use client";

import { useText } from "../ContentProvider";

/**
 * What customers' stars come to, on a product card under its spec line: one star, the average,
 * and how many rated it - the star-mode twin of `CardLikes`.
 *
 * As the product list had it, so it is the rating at page load; a vote is cast in the dialog,
 * which re-reads its own. Only rendered where the shop has customers vote with stars and
 * somebody has (`customerRating` is absent otherwise).
 */
export function CardRating({
  rating,
}: {
  rating: { average: number; count: number };
}) {
  const t = useText();
  const average = rating.average.toFixed(1);

  return (
    <span
      className="flex items-center gap-1 text-[11.5px] tabular-nums text-muted"
      title={
        rating.count === 1
          ? t("votes.cardRatingOne", { average })
          : t("votes.cardRating", { average, count: rating.count })
      }
    >
      <svg
        aria-hidden="true"
        className="text-ink"
        fill="currentColor"
        height="12"
        viewBox="0 0 24 24"
        width="12"
      >
        <path d="m12 2.8 2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.1l-5.7 3 1.2-6.3-4.6-4.4 6.3-.8Z" />
      </svg>
      <span className="font-semibold text-ink">{average}</span>
      <span>({rating.count})</span>
    </span>
  );
}
