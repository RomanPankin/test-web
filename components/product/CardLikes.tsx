"use client";

import { type Likes, useProductLikes } from "@estoreclub/storefront/web";

import { useText } from "../ContentProvider";
import { ThumbIcon } from "../comments/VoteControls";

/**
 * The customers' likes on a product card, under its spec line - the like-mode twin of
 * `CardRating`. A thumb up with how many liked it, and a thumb down with how many did not.
 *
 * Read-only: voting is in the dialog, where there is room to take a vote back - and a vote cast
 * there shows here at once (`useProductLikes`). Nothing while nobody has voted. The thumb down
 * is left out while nobody has disliked it, which is also how a shop that takes likes only
 * (`up`, where `dislikes` is always 0) reads.
 */
export function CardLikes({
  productId,
  rendered,
}: {
  productId: string;
  /** The counts the product list had - absent when nobody had voted. */
  rendered?: Likes;
}) {
  const t = useText();
  const counts = useProductLikes(productId, rendered);

  if (!counts || (counts.likes === 0 && counts.dislikes === 0)) return null;

  const { likes, dislikes } = counts;

  return (
    <span
      className="flex shrink-0 items-center gap-2 text-[11.5px] tabular-nums text-muted"
      title={t("votes.cardLikes", { likes, dislikes })}
    >
      <span className="flex items-center gap-1">
        <span className="text-ink">
          <ThumbIcon filled size="xs" />
        </span>
        <span className="font-semibold text-ink">{likes}</span>
      </span>
      {dislikes > 0 ? (
        <span className="flex items-center gap-1">
          <ThumbIcon down size="xs" />
          <span>{dislikes}</span>
        </span>
      ) : null}
    </span>
  );
}
