"use client";

import { useState } from "react";

import { useText } from "../ContentProvider";

// The two ways a shop lets customers vote - a thumb up or down, or stars - drawn the same for
// a product and for a comment, at two sizes. Pure controls: the caller holds the counts and
// decides what a press does (sign in first, take a vote back).

type Size = "md" | "sm" | "xs";

export function ThumbIcon({
  down,
  size,
  filled = false,
}: {
  down?: boolean;
  size: Size;
  filled?: boolean;
}) {
  const px = size === "md" ? 18 : size === "sm" ? 15 : 13;

  return (
    <svg
      aria-hidden="true"
      className={down ? "rotate-180" : undefined}
      fill={filled ? "currentColor" : "none"}
      height={px}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width={px}
    >
      <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4-7a2 2 0 0 1 2.9 1.9L13 9h5.4a2 2 0 0 1 2 2.3l-1.2 7.6a2 2 0 0 1-2 1.7H7" />
    </svg>
  );
}

/** A like and a dislike with their counts; the customer's own is filled in the brand colour. */
export function ThumbVotes({
  likes,
  dislikes,
  mine,
  size = "md",
  ghost = false,
  disabled = false,
  disabledHint,
  likeOnly = false,
  onVote,
}: {
  likes: number;
  dislikes: number;
  /** 1, -1, or 0 / null for none. */
  mine: number | null;
  size?: Size;
  /**
   * No outline - round icon buttons in a comment's action row, the thumb filled once it is
   * theirs. The dislike carries no count there: a thread is read for what people liked.
   */
  ghost?: boolean;
  /** Shown, not pressable - with `disabledHint` as the reason. */
  disabled?: boolean;
  disabledHint?: string;
  /** The shop takes likes only (`up`): no dislike to press, and none to count. */
  likeOnly?: boolean;
  onVote: (value: 1 | -1) => void;
}) {
  const t = useText();

  if (ghost) {
    const icon = (value: 1 | -1, count: number | null, label: string) => (
      <button
        aria-label={label}
        aria-pressed={mine === value}
        className={
          "inline-flex h-8 items-center gap-1 rounded-full px-2 text-[12.5px] tabular-nums transition " +
          (disabled
            ? "cursor-default text-muted/60"
            : mine === value
              ? "text-ink hover:bg-black/[0.06]"
              : "text-muted hover:bg-black/[0.06] hover:text-ink")
        }
        disabled={disabled}
        title={disabled ? disabledHint : undefined}
        type="button"
        onClick={() => onVote(value)}
      >
        <ThumbIcon down={value === -1} filled={mine === value} size="sm" />
        {count ? count : null}
      </button>
    );

    return (
      <div className="-ml-2 flex items-center">
        {icon(1, likes, t("votes.like"))}
        {likeOnly ? null : icon(-1, null, t("votes.dislike"))}
      </div>
    );
  }

  const pill =
    size === "md"
      ? "h-9 gap-1.5 px-3.5 text-[13.5px]"
      : "h-7 gap-1 px-2 text-[12px]";

  const button = (value: 1 | -1, count: number, label: string) => {
    const isMine = mine === value;

    return (
      <button
        aria-label={label}
        aria-pressed={isMine}
        className={
          `inline-flex items-center rounded-full border font-medium tabular-nums transition ${pill} ` +
          (isMine
            ? "border-brand bg-brand-tint text-brand"
            : disabled
              ? "cursor-default border-line bg-white text-muted"
              : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink")
        }
        disabled={disabled}
        title={disabled ? disabledHint : undefined}
        type="button"
        onClick={() => onVote(value)}
      >
        <ThumbIcon down={value === -1} size={size} />
        {count}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {button(1, likes, t("votes.like"))}
      {likeOnly ? null : button(-1, dislikes, t("votes.dislike"))}
    </div>
  );
}

/**
 * How a product's vote is cast, for drawing one: stars out of `max`, or a thumb (`likeOnly`
 * under `up` - no dislike).
 */
export interface ProductVote {
  kind: "like" | "range";
  likeOnly: boolean;
  max: number;
}

/**
 * The vote a reviewer gave the product, beside their name - small stars, or a thumb up or
 * down. Read-only.
 */
export function AuthorVote({
  vote,
  value,
}: {
  vote: ProductVote;
  /** Their stars, or 1 / -1. */
  value: number;
}) {
  const t = useText();

  if (vote.kind === "like") {
    return (
      <span
        className={
          "inline-flex self-center " + (value < 0 ? "text-muted" : "text-brand")
        }
        title={value < 0 ? t("votes.dislike") : t("votes.like")}
      >
        <ThumbIcon filled down={value < 0} size="xs" />
        <span className="sr-only">
          {value < 0 ? t("votes.dislike") : t("votes.like")}
        </span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center self-center text-brand"
      title={t("votes.stars", { count: value })}
    >
      {Array.from({ length: vote.max }, (_, index) => (
        <StarIcon key={index} filled={index < value} px={12} />
      ))}
      <span className="sr-only">{t("votes.stars", { count: value })}</span>
    </span>
  );
}

/**
 * The vote picker inside the review form, while a vote needs a comment: the shop's stars or
 * thumbs, chosen before posting and sent with the comment. Pressing the chosen one again
 * clears it.
 */
export function ReviewVotePicker({
  vote,
  value,
  onChange,
}: {
  vote: ProductVote;
  /** The chosen vote, or 0 for none. */
  value: number;
  onChange: (value: number) => void;
}) {
  const t = useText();
  const pick = (next: number) => onChange(next === value ? 0 : next);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12.5px] text-muted">{t("comments.yourVote")}</span>
      {vote.kind === "like" ? (
        <ThumbVotes
          ghost
          dislikes={0}
          likeOnly={vote.likeOnly}
          likes={0}
          mine={value || null}
          onVote={pick}
        />
      ) : (
        <StarVotes
          average={null}
          count={0}
          max={vote.max}
          mine={value || null}
          size="sm"
          onVote={pick}
        />
      )}
    </div>
  );
}

function StarIcon({ filled, px }: { filled: boolean; px: number }) {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      height={px}
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={px}
    >
      <path d="m12 2.8 2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.1l-5.7 3 1.2-6.3-4.6-4.4 6.3-.8Z" />
    </svg>
  );
}

/**
 * A rating that is also the way to give one.
 *
 * At rest it reads as the rating: the stars are the customer's own vote when they have cast
 * one, the average otherwise, and the number beside them is always the average. Under the
 * pointer the stars follow it - up to the one it is on - and a press votes that many; leaving
 * puts the rating back. Pressing their own vote again takes it back (the caller decides).
 */
export function StarVotes({
  max,
  average,
  count,
  mine,
  size = "md",
  disabled = false,
  disabledHint,
  onVote,
}: {
  max: number;
  average: number | null;
  count: number;
  /** Their stars, or 0 / null for none. */
  mine: number | null;
  size?: Size;
  /** Shown as the rating, not a control - with `disabledHint` as the reason. */
  disabled?: boolean;
  disabledHint?: string;
  onVote: (value: number) => void;
}) {
  const t = useText();
  const [hovered, setHovered] = useState(0);
  const px = size === "md" ? 22 : 16;
  const shown = hovered || mine || Math.round(average ?? 0);

  return (
    <div className="flex items-center gap-2">
      <div
        className="-mx-0.5 flex items-center text-brand"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: max }, (_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              aria-label={t("votes.stars", { count: value })}
              aria-pressed={mine === value}
              className={
                "grid place-items-center transition-transform duration-150 " +
                (disabled ? "cursor-default " : "hover:scale-125 ") +
                (size === "md" ? "h-8 w-8" : "h-6 w-6") +
                // Faded while it shows the average, solid once it is theirs or being chosen.
                (hovered || mine ? "" : " opacity-75")
              }
              disabled={disabled}
              title={disabled ? disabledHint : undefined}
              type="button"
              onBlur={() => setHovered(0)}
              onClick={() => onVote(value)}
              onFocus={() => setHovered(value)}
              onMouseEnter={() => !disabled && setHovered(value)}
            >
              <StarIcon filled={value <= shown} px={px} />
            </button>
          );
        })}
      </div>
      {count > 0 && average !== null ? (
        <span
          className={
            "tabular-nums text-muted " +
            (size === "md" ? "text-[13.5px]" : "text-[13px]")
          }
        >
          <span className="font-medium text-ink">{average.toFixed(1)}</span>
          {" · "}
          {count === 1 ? t("votes.countOne") : t("votes.count", { count })}
        </span>
      ) : null}
    </div>
  );
}
