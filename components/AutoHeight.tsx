"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

/**
 * A box that grows and shrinks to what is in it smoothly instead of jumping - the search panel
 * as results come and go. Its height follows its content (a `ResizeObserver`), eased by CSS;
 * the first size is taken as it is, and with reduced motion nothing eases.
 */
export function AutoHeight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const element = inner.current;

    if (!element) return;

    const measure = () => setHeight(element.offsetHeight);

    measure();
    // Eased only from the second size on: opening shows the panel at its size at once.
    const frame = requestAnimationFrame(() => setReady(true));
    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={
        "overflow-hidden motion-reduce:transition-none " +
        (ready ? "transition-[height] duration-300 ease-out" : "")
      }
      style={height === null ? undefined : { height }}
    >
      <div ref={inner} className={className}>
        {children}
      </div>
    </div>
  );
}
