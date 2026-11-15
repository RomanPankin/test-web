"use client";

import type { ProductCommentsState } from "@estoreclub/storefront/web";

import { useText } from "../ContentProvider";

import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";
import type { ProductVote } from "./VoteControls";

/**
 * What customers say about the product, at the foot of its dialog: their comments, with their
 * own votes inside each one.
 *
 * Follows the shop's rules (Sales rules → Social) as the server reads them for THIS product -
 * a product can opt out with its own fields: nothing until that has been read, nothing while
 * `allowComments` is off, and votes on a comment only by `commentVoting`. The votes on the
 * product itself are under its name - see `ProductRatingLine`.
 *
 * No heading and no fold, laid out the way a video's comments are: the line to write on first,
 * then the thread - faces down the left, names and how long ago, quiet actions under each.
 */
export function ProductFeedback({
  productId,
  feedback: state,
  ruled = true,
}: {
  productId: string;
  /** A hairline above it. Off where the panel starts with the comments. */
  ruled?: boolean;
  /** The product's feedback, read once by the dialog for this and the rating line. */
  feedback: ProductCommentsState;
}) {
  const t = useText();
  const {
    feedback,
    comments,
    hasNext,
    loading,
    loadMore,
    post,
    remove,
    countReply,
    voteNeedsComment,
  } = state;

  if (!feedback?.allowComments) return null;

  const commentVoting =
    feedback.commentVoting === "off"
      ? null
      : // 5 when the server leaves it out - the default scale. `up` (a like only) is drawn
        // as the thumb up alone.
        {
          kind:
            feedback.commentVoting === "up" ? "like" : feedback.commentVoting,
          likeOnly: feedback.commentVoting === "up",
          stars: feedback.commentStars || 5,
        };

  // How the product is voted on, for each reviewer's vote beside their name - and, while a
  // vote needs a comment, for the picker inside the form (the rating line then only shows).
  const productVote: ProductVote | null =
    feedback.productVoting === "off"
      ? null
      : {
          kind: feedback.productVoting === "range" ? "range" : "like",
          likeOnly: feedback.productVoting === "up",
          max: feedback.rating.max || 5,
        };

  return (
    <section
      aria-label={t("comments.title")}
      className={
        ruled ? "mt-[24px] border-t border-line pt-[26px]" : "mt-[26px]"
      }
    >
      <CommentComposer
        placeholder={t("comments.placeholder")}
        submitLabel={t("comments.post")}
        vote={
          voteNeedsComment && productVote
            ? { ...productVote, mine: feedback.rating.mine }
            : null
        }
        onSubmit={post}
      />

      {/* Nobody yet: just the line to write on - it says what it is for. */}
      {comments.length === 0 ? (
        loading ? (
          <CommentsSkeleton />
        ) : null
      ) : (
        <ul className="mt-7 space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              productId={productId}
              productVote={productVote}
              voting={commentVoting}
              onCount={(delta) => countReply(comment.id, delta)}
              onRemove={remove}
            />
          ))}
        </ul>
      )}

      {hasNext ? (
        <div className="mt-5 flex justify-center">
          <button
            className="h-9 rounded-full bg-white px-4 text-[13px] font-medium text-ink shadow-[0_2px_12px_-4px_rgba(19,26,34,0.14)] transition hover:text-brand disabled:opacity-50"
            disabled={loading}
            type="button"
            onClick={() => void loadMore()}
          >
            {loading ? t("comments.loading") : t("comments.more")}
          </button>
        </div>
      ) : null}
    </section>
  );
}

/** Three comments' shapes while the thread loads - the list grows into them, not out of nothing. */
function CommentsSkeleton() {
  return (
    <ul aria-hidden="true" className="mt-7 space-y-6">
      {[78, 92, 64].map((width, index) => (
        <li key={index} className="flex animate-pulse gap-3">
          <span className="h-10 w-10 shrink-0 rounded-full bg-black/[0.06]" />
          <span className="flex-1 space-y-2 pt-1">
            <span className="block h-3 w-32 rounded bg-black/[0.06]" />
            <span
              className="block h-3 rounded bg-black/[0.06]"
              style={{ width: `${width}%` }}
            />
            <span className="block h-3 w-1/3 rounded bg-black/[0.06]" />
          </span>
        </li>
      ))}
    </ul>
  );
}
