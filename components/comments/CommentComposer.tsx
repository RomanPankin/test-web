"use client";

import { onReviewStart } from "../../lib/reviewStart";
import { useEffect, useRef, useState } from "react";

import { openSignIn, useCustomer } from "@estoreclub/storefront/web";
import { showToast } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { Avatar } from "./Avatar";
import { type ProductVote, ReviewVotePicker } from "./VoteControls";

/** The longest comment the server keeps. */
const MAX_LENGTH = 2000;

/**
 * Where a comment is written - or, for a guest, the way in to writing one.
 *
 * A guest sees the button that signs them in, not a box they would fill in only to be told
 * to sign in: the comment is the customer's, so who they are comes first.
 */
export function CommentComposer({
  placeholder,
  submitLabel,
  focusOnOpen = false,
  vote = null,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  submitLabel: string;
  focusOnOpen?: boolean;
  /**
   * A review: the shop's vote picker in the form, sent with the comment - while a vote needs a
   * comment (`voteNeedsComment`). `mine` is the customer's vote so far, picked to start with.
   */
  vote?: (ProductVote & { mine: number | null }) | null;
  /** Throws on a refusal; the text stays in the box to try again. */
  onSubmit: (body: string, vote?: number) => Promise<void>;
  /** A reply's box can be put away again; the product's own cannot. */
  onCancel?: () => void;
}) {
  const t = useText();
  const { customer, loading } = useCustomer();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);
  const [picked, setPicked] = useState(vote?.mine ?? 0);
  const field = useRef<HTMLTextAreaElement>(null);

  // Their vote as the server has it - after a review is posted, or when who is signed in changes.
  useEffect(() => {
    setPicked(vote?.mine ?? 0);
  }, [vote?.mine]);

  // The product's rating pressed while votes come with reviews: this box (the product's own,
  // with the vote picker) comes into view, takes that vote and the cursor.
  useEffect(() => {
    if (!vote || onCancel) return;

    return onReviewStart((value) => {
      setPicked(value);
      setFocused(true);
      field.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      field.current?.focus({ preventScroll: true });
    });
  }, [vote, onCancel]);

  // A reply's box is opened by pressing "Reply": the cursor belongs in it. The product's own
  // box is not focused - it sits in a dialog opened to order, not to write.
  useEffect(() => {
    if (focusOnOpen) field.current?.focus();
  }, [focusOnOpen, customer]);

  if (loading) return null;

  // A reply's box is smaller, and opens already in use; the product's own is a quiet line
  // until it is focused.
  const isReply = Boolean(onCancel);
  const face = isReply ? 24 : 40;

  if (!customer) {
    // The same line a customer writes on, pressed: it signs them in first.
    return (
      <div className={"flex items-center gap-3 " + (isReply ? "mt-3" : "")}>
        <span
          aria-hidden="true"
          className="grid shrink-0 place-items-center rounded-full bg-brand-tint text-brand"
          style={{ width: face, height: face }}
        >
          <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
          </svg>
        </span>
        <button
          className="min-w-0 flex-1 rounded-2xl bg-black/[0.04] px-3.5 py-2 text-left text-[14px] leading-[20px] text-muted transition hover:bg-black/[0.07]"
          type="button"
          onClick={() => openSignIn(t("comments.toComment"))}
        >
          {t("comments.signInPrompt")}
        </button>
      </div>
    );
  }

  const text = body.trim();
  const isOpen = isReply || focused || body.length > 0;

  async function submit(): Promise<void> {
    if (!text || sending) return;

    setSending(true);
    try {
      await (vote && picked ? onSubmit(text, picked) : onSubmit(text));
      setBody("");
      setFocused(false);
      field.current?.blur();
      onCancel?.();
    } catch (error) {
      showToast(
        error instanceof Error && error.message
          ? error.message
          : t("account.failed"),
      );
    } finally {
      setSending(false);
    }
  }

  function cancel(): void {
    setBody("");
    setFocused(false);
    setPicked(vote?.mine ?? 0);
    field.current?.blur();
    onCancel?.();
  }

  return (
    <div className={"flex gap-3 " + (isReply ? "mt-3" : "")}>
      <Avatar
        avatarUrl={customer.avatarUrl}
        name={customer.name ?? customer.email}
        size={face}
      />
      <div className="min-w-0 flex-1">
        {/* A soft grey field: it lights up with a ring while in use, and grows with the text. */}
        <textarea
          ref={field}
          className="peer block w-full resize-none rounded-2xl bg-black/[0.04] px-3.5 py-2 text-[14px] leading-[20px] text-ink outline-none ring-1 ring-inset ring-transparent transition-[background-color,box-shadow] duration-200 placeholder:text-muted hover:bg-black/[0.06] focus:bg-white focus:ring-brand-soft [field-sizing:content]"
          disabled={sending}
          maxLength={MAX_LENGTH}
          placeholder={placeholder}
          rows={1}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => {
            // Cmd/Ctrl+Enter sends; a plain Enter is a new line in a comment.
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        {isOpen ? (
          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            {vote ? (
              <div className="mr-auto">
                <ReviewVotePicker
                  value={picked}
                  vote={vote}
                  onChange={setPicked}
                />
              </div>
            ) : null}
            <button
              className="h-9 rounded-full px-4 text-[13.5px] font-medium text-ink transition hover:bg-black/[0.06]"
              type="button"
              onClick={cancel}
            >
              {t("comments.cancel")}
            </button>
            <button
              className="h-9 rounded-full bg-brand px-4 text-[13.5px] font-medium text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-muted"
              disabled={!text || sending}
              type="button"
              onClick={() => void submit()}
            >
              {submitLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
