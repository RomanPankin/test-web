"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * The deal's pill over a product photo - `SaveBadge` and `DealBadge` both wear it, so a card
 * has one kind of badge whichever deal it is on.
 *
 * Small and blue, like the rest of TechStore's accents, and it arrives: hidden until the card
 * scrolls into view, then it rises in with a light passing across it (`deal-pill-in` in
 * globals.css). Once - a badge that moved every time it passed would be noise. Visitors who
 * asked for less motion get it shown, still.
 */
export function DealPill({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;
    // No observer to ask (an old browser): shown, rather than never.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      // Well inside the window, so the entrance is seen rather than spent at the very edge.
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={
        "deal-pill pointer-events-none overflow-hidden whitespace-nowrap rounded-full bg-brand px-2.5 py-[4px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white " +
        className
      }
      data-shown={shown ? "" : undefined}
      title={title}
    >
      {children}
    </span>
  );
}
