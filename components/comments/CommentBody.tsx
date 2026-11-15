"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { useText } from "../ContentProvider";

/**
 * A comment's text, kept to four lines until asked: one long comment must not push the rest
 * of the thread out of sight. "Read more" appears only when there is more - measured, not
 * guessed from the length, since a narrow column wraps sooner than a wide one.
 */
export function CommentBody({ text }: { text: string }) {
  const t = useText();
  const body = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);

  useLayoutEffect(() => {
    const node = body.current;

    if (!node || open) return;

    const measure = () => setClipped(node.scrollHeight > node.clientHeight + 1);
    const observer = new ResizeObserver(measure);

    measure();
    observer.observe(node);

    return () => observer.disconnect();
  }, [text, open]);

  return (
    <>
      <p
        ref={body}
        className={
          "mt-0.5 whitespace-pre-line break-words text-[14px] leading-[20px] text-ink " +
          (open ? "" : "line-clamp-4")
        }
      >
        {text}
      </p>
      {clipped || open ? (
        <button
          className="mt-0.5 text-[13px] font-semibold text-muted transition hover:text-ink"
          type="button"
          onClick={() => setOpen(!open)}
        >
          {open ? t("comments.showLess") : t("comments.readMore")}
        </button>
      ) : null}
    </>
  );
}
