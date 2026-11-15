"use client";

import type { PublicProductComment } from "@estoreclub/api";

import { voteComment } from "@estoreclub/client";
import { useState } from "react";

import { openSignIn, useCustomer } from "@estoreclub/storefront/web";
import { showToast } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { StarVotes, ThumbVotes } from "./VoteControls";

type Votes = {
  likes: number;
  dislikes: number;
  ratingAverage: number | null;
  ratingCount: number;
  myVote: number;
};

/** The counts as they will be once a like, a dislike or a take-back (0) has gone through. */
function likedAs(votes: Votes, value: number): Votes {
  const was = votes.myVote;

  return {
    ...votes,
    likes: votes.likes - (was === 1 ? 1 : 0) + (value === 1 ? 1 : 0),
    dislikes: votes.dislikes - (was === -1 ? 1 : 0) + (value === -1 ? 1 : 0),
    myVote: value,
  };
}

/** How the shop lets customers vote on a comment - null while it does not. */
export type CommentVoting = {
  kind: "like" | "range";
  stars: number;
  /** Likes only (`up`): no dislike. */
  likeOnly?: boolean;
} | null;

/**
 * The votes on one comment, the shop's way: a thumb up or down, or stars. The counts are kept
 * here and replaced by the server's answer to each vote; pressing their own vote again takes
 * it back (0).
 */
export function CommentVotes({
  productId,
  comment,
  voting,
}: {
  productId: string;
  comment: PublicProductComment;
  voting: NonNullable<CommentVoting>;
}) {
  const t = useText();
  const { customer } = useCustomer();
  const [votes, setVotes] = useState<Votes>({
    likes: comment.likes,
    dislikes: comment.dislikes,
    ratingAverage: comment.ratingAverage,
    ratingCount: comment.ratingCount,
    myVote: comment.myVote,
  });

  function vote(value: number): void {
    if (!customer) {
      openSignIn(t("votes.toVote"));

      return;
    }

    const next = votes.myVote === value ? 0 : value;
    const before = votes;

    // A like answers at once - counted here before the server has, and put back if it refuses.
    // Stars wait for the server: the average is its to work out.
    if (voting.kind === "like") setVotes(likedAs(before, next));

    voteComment({ productId, commentId: comment.id, value: next })
      .then(setVotes)
      .catch((error: unknown) => {
        setVotes(before);
        showToast(
          error instanceof Error && error.message
            ? error.message
            : t("account.failed"),
        );
      });
  }

  return (
    // A part of the comment's action row - see `CommentItem`.
    <div className="flex items-center">
      {voting.kind === "like" ? (
        <ThumbVotes
          ghost
          dislikes={votes.dislikes}
          likeOnly={voting.likeOnly}
          likes={votes.likes}
          mine={votes.myVote}
          size="sm"
          onVote={vote}
        />
      ) : (
        <StarVotes
          average={votes.ratingAverage}
          count={votes.ratingCount}
          max={voting.stars}
          mine={votes.myVote}
          size="sm"
          onVote={vote}
        />
      )}
    </div>
  );
}
