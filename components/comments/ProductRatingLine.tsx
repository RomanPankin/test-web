"use client";

import { startReview } from "../../lib/reviewStart";
import type { ProductCommentsState } from "@estoreclub/storefront/web";

import { openSignIn, useCustomer } from "@estoreclub/storefront/web";
import { showToast } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { StarVotes, ThumbVotes } from "./VoteControls";

/**
 * The rating under the product's name.
 *
 * Where the shop lets customers vote on it (Sales rules → Social, `productVoting`), this is
 * their votes - stars or a thumb up and down - and the place to cast one: the line reads as
 * the current rating and turns into a control under the pointer. Nothing while the shop has
 * voting off, or before the product's feedback has been read: a TechStore product keeps no
 * rating of its own to fall back on.
 */
export function ProductRatingLine({
  feedback: state,
}: {
  feedback: ProductCommentsState;
}) {
  const t = useText();
  const { customer } = useCustomer();
  const { feedback, rate, voteNeedsComment } = state;

  if (!feedback || feedback.productVoting === "off") return null;

  /** A vote needs a customer: a guest is asked to sign in, and nothing is sent. */
  function vote(value: number): void {
    if (!customer) {
      openSignIn(t("votes.toVote"));

      return;
    }
    // A vote is cast with a review then: the stars pressed open the review form below, with
    // that vote picked and the cursor in it.
    if (voteNeedsComment) {
      startReview(value);

      return;
    }

    rate(value).catch((error: unknown) =>
      showToast(
        error instanceof Error && error.message
          ? error.message
          : t("account.failed"),
      ),
    );
  }

  const { rating } = feedback;

  return (
    <div className="mt-2">
      {/* Thumbs for likes - `up` takes the like alone - and stars only for `range`. */}
      {feedback.productVoting !== "range" ? (
        <ThumbVotes
          dislikes={rating.dislikes}
          likeOnly={feedback.productVoting === "up"}
          likes={rating.likes}
          mine={rating.mine}
          size="sm"
          onVote={vote}
        />
      ) : (
        <StarVotes
          average={rating.average}
          count={rating.count}
          max={rating.max}
          mine={rating.mine}
          size="sm"
          onVote={vote}
        />
      )}
      {voteNeedsComment ? (
        // The rating only shows here: a vote goes with a review, in the comment form.
        <p className="mt-1 text-[12.5px] text-muted">
          {t("votes.needsComment")}
        </p>
      ) : null}
    </div>
  );
}
