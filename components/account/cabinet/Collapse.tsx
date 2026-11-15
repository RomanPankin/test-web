"use client";

import type { ReactNode } from "react";

import { useEffect, useRef, useState } from "react";

/** How long the fold takes, in ms - the same figure the chevron turns in. */
const DURATION = 260;

/**
 * Content that folds open and shut, animated to its own height - an order's receipt.
 *
 * `height: auto` cannot be transitioned, so the fold MEASURES: opening runs from 0 to the
 * content's `scrollHeight` and then lets go to `auto` (so a receipt whose lines arrive while
 * open still fits); shutting pins the current height first and then runs to 0. A
 * `grid-template-rows: 0fr → 1fr` transition needs no measuring, but not every browser
 * animates it - there the receipt simply jumped open.
 *
 * The children stay MOUNTED, since nothing can animate out of a tree it has left; `inert` keeps
 * a shut fold out of the keyboard's and the screen reader's way.
 */
export function Collapse({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  // Server and first paint agree: shut is 0, open is auto - no animation on mount.
  const [height, setHeight] = useState<string>(open ? "auto" : "0px");
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      return;
    }

    const element = box.current;

    if (!element) return;

    const full = `${element.scrollHeight}px`;

    if (open) {
      setHeight(full);
      const settle = window.setTimeout(() => setHeight("auto"), DURATION);

      return () => window.clearTimeout(settle);
    }

    // From wherever it is (`auto` included) to 0: pin the height, let the browser see it, then
    // let go - two frames, or both values land in one style recalculation and nothing moves.
    setHeight(full);
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setHeight("0px"));
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div
      ref={box}
      className="overflow-hidden transition-[height,opacity] ease-out motion-reduce:transition-none"
      inert={!open}
      style={{
        height,
        opacity: open ? 1 : 0,
        transitionDuration: `${DURATION}ms`,
      }}
    >
      {children}
    </div>
  );
}
