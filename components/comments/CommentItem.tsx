"use client";

import type { PublicProductComment } from "@estoreclub/api";

import { useState } from "react";
import { useReplies } from "@estoreclub/storefront/web";
import { showToast } from "@estoreclub/storefront/web";

import { useLanguage, useText } from "../ContentProvider";

import { Avatar } from "./Avatar";
import { CommentBody } from "./CommentBody";
import { CommentComposer } from "./CommentComposer";
import { type CommentVoting, CommentVotes } from "./CommentVotes";
import { AuthorVote, type ProductVote } from "./VoteControls";

/** "3 days ago", in the page's language (`lang`) - how long ago reads faster than a date. */
function agoOf(iso: string, lang: string | undefined): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  try {
    const format = new Intl.RelativeTimeFormat(lang || undefined, {
      numeric: "auto",
    });

    for (const [unit, size] of steps) {
      if (Math.abs(seconds) >= size)
        return format.format(Math.round(seconds / size), unit);
    }

    return format.format(0, "second");
  } catch {
    return "";
  }
}

/** "22 Oct 2026, 14:05", in the page's language - for the tooltip on "3 days ago". */
function fullDateOf(iso: string, lang: string | undefined): string {

  try {
    return new Date(iso).toLocaleString(lang || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

/** "22 Oct" - the year only when it is not this one, in the page's language. */
function shortDateOf(iso: string, lang: string | undefined): string {
  const date = new Date(iso);

  try {
    return date.toLocaleDateString(lang || undefined, {
      day: "numeric",
      month: "short",
      ...(date.getFullYear() === new Date().getFullYear()
        ? {}
        : { year: "numeric" }),
    });
  } catch {
    return "";
  }
}

/** Posted by them moments ago - this visit's own comment, which eases in. */
const isFresh = (comment: PublicProductComment) =>
  comment.mine && Date.now() - new Date(comment.createdAt).getTime() < 15_000;

/**
 * One comment, the way a video's are read: a face, a name and how long ago, the text, and a
 * thin row of actions under it - the votes, Reply, and a delete for their own. No bubble or
 * card: the faces down the left edge are what separate one comment from the next.
 */
export function CommentItem({
  productId,
  comment,
  voting,
  productVote = null,
  onRemove,
  onCount,
}: {
  productId: string;
  comment: PublicProductComment;
  /** How the shop lets customers vote on comments - null: no votes drawn. */
  voting: CommentVoting;
  /** How the product is voted on, for the author's own vote beside their name. */
  productVote?: ProductVote | null;
  onRemove: (comment: PublicProductComment) => Promise<void>;
  /** A reply was added under this root, or taken away. Only roots pass it. */
  onCount?: (delta: number) => void;
}) {
  const t = useText();
  // The page's language, the same on the server and in the browser: read from `<html lang>`,
  // the server (no `document`) wrote its own default ("4 days ago") and hydration kept it.
  const lang = useLanguage();
  const [removing, setRemoving] = useState(false);
  // Asked inline rather than with `window.confirm`: the editor's preview frame is sandboxed,
  // and there a native dialog answers "no" without ever showing.
  const [asking, setAsking] = useState(false);
  const [replying, setReplying] = useState(false);
  const isReply = !onCount;
  // No votes on their own comment - not even greyed out: there is nothing for them to do
  // there (and the server refuses one, `own_comment`).
  const showsVotes = Boolean(voting) && !comment.mine;

  async function remove(): Promise<void> {
    if (removing) return;

    setAsking(false);
    setRemoving(true);
    try {
      await onRemove(comment);
    } catch {
      showToast(t("account.failed"));
      setRemoving(false);
    }
  }

  return (
    <li
      className={
        "-mx-2 flex gap-3 rounded-xl px-2 py-1 transition-opacity " +
        (removing ? "opacity-50 " : "") +
        (isFresh(comment) ? "comment-in" : "")
      }
    >
      <Avatar
        avatarUrl={comment.author.avatarUrl}
        name={comment.author.name}
        size={isReply ? 24 : 40}
      />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-[12.5px] leading-[18px]">
          <span
            className={
              "font-semibold text-ink " +
              (comment.mine ? "rounded-full bg-black/[0.06] px-1.5" : "")
            }
          >
            {comment.author.name || t("comments.anonymous")}
          </span>
          {productVote && comment.authorVote ? (
            <AuthorVote value={comment.authorVote} vote={productVote} />
          ) : null}
          <time
            className="cursor-default text-muted"
            dateTime={comment.createdAt}
            title={fullDateOf(comment.createdAt, lang)}
          >
            {agoOf(comment.createdAt, lang)}
            <span aria-hidden="true"> · </span>
            {shortDateOf(comment.createdAt, lang)}
          </time>
        </p>
        <CommentBody text={comment.body} />

        {asking ? (
          <div className="mt-1.5 flex items-center gap-1 text-[12.5px] text-ink">
            <span className="mr-1">{t("comments.deleteConfirm")}</span>
            <ActionButton onClick={() => void remove()}>
              {t("comments.delete")}
            </ActionButton>
            <ActionButton onClick={() => setAsking(false)}>
              {t("comments.cancel")}
            </ActionButton>
          </div>
        ) : (
          <div
            className={
              "mt-0.5 flex items-center " + (showsVotes ? "" : "-ml-3")
            }
          >
            {showsVotes ? (
              <CommentVotes
                comment={comment}
                productId={productId}
                voting={voting!}
              />
            ) : null}
            {isReply ? null : (
              <ActionButton onClick={() => setReplying(!replying)}>
                {t("comments.reply")}
              </ActionButton>
            )}
            {comment.mine ? (
              <ActionButton onClick={() => setAsking(true)}>
                {t("comments.delete")}
              </ActionButton>
            ) : null}
          </div>
        )}

        {onCount ? (
          <Thread
            comment={comment}
            productId={productId}
            replying={replying}
            voting={voting}
            onCount={onCount}
            onReplyClose={() => setReplying(false)}
          />
        ) : null}
      </div>
    </li>
  );
}

/** A round, quiet button in the action row - Reply, Delete. */
function ActionButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      className="h-8 rounded-full px-3 text-[12.5px] font-semibold text-ink transition hover:bg-black/[0.06]"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/**
 * A root's replies: the box to answer in, while open, and the replies behind a coloured
 * "3 replies" toggle - read the first time they are opened.
 */
function Thread({
  productId,
  comment,
  voting,
  replying,
  onCount,
  onReplyClose,
}: {
  productId: string;
  comment: PublicProductComment;
  voting: CommentVoting;
  replying: boolean;
  onCount: (delta: number) => void;
  onReplyClose: () => void;
}) {
  const t = useText();
  const { replies, hasNext, loading, load, post, remove } = useReplies(
    productId,
    comment.id,
    onCount,
  );
  const [shown, setShown] = useState(false);

  async function toggle(): Promise<void> {
    if (!shown && replies.length === 0 && comment.replyCount > 0) {
      try {
        await load();
      } catch {
        showToast(t("account.failed"));

        return;
      }
    }

    setShown(!shown);
  }

  return (
    <>
      {replying ? (
        // Unfolds into place - `reply-open` in `globals.css`.
        <div className="reply-open">
          <div>
            <CommentComposer
              focusOnOpen
              placeholder={t("comments.replyPlaceholder")}
              submitLabel={t("comments.reply")}
              onCancel={onReplyClose}
              onSubmit={async (body) => {
                // The thread's earlier replies first, so the new one lands after them, not alone.
                if (replies.length === 0 && comment.replyCount > 0) {
                  await load().catch(() => undefined);
                }
                await post(body);
                // A reply is read where it lands: open the thread it went into.
                setShown(true);
              }}
            />
          </div>
        </div>
      ) : null}

      {comment.replyCount > 0 ? (
        <button
          aria-expanded={shown}
          className="-ml-3 mt-1 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold text-brand transition hover:bg-brand-tint"
          type="button"
          onClick={() => void toggle()}
        >
          <svg
            aria-hidden="true"
            className={"transition-transform " + (shown ? "rotate-180" : "")}
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          {comment.replyCount === 1
            ? t("comments.oneReply")
            : t("comments.replies", { count: comment.replyCount })}
        </button>
      ) : null}

      {/* Opens and closes by its height - a grid row from 0fr to 1fr - rather than jumping;
          kept once read, so closing it again animates too. */}
      <div
        className={
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none " +
          (shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
        }
        inert={!shown}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="mt-2 space-y-3">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                productId={productId}
                voting={voting}
                onRemove={remove}
              />
            ))}
            {hasNext ? (
              <li>
                <button
                  className="-ml-3 inline-flex h-8 items-center rounded-full px-3 text-[13px] font-semibold text-brand transition hover:bg-brand-tint"
                  type="button"
                  onClick={() => void load()}
                >
                  {loading ? t("comments.loading") : t("comments.moreReplies")}
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  );
}
