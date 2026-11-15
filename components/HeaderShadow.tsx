"use client";

import { useEffect } from "react";

/**
 * Grows a shadow under the sticky header once the page has scrolled beneath it.
 *
 * A childless BEHAVIOR island — it renders nothing and takes no children, which is the only kind
 * the platform hydrates. The header itself is a plain SERVER element (`#site-header` in the
 * layout), so its markup and everything inside it stay server-rendered; this only toggles a class
 * on it. A client component that WRAPPED the header would have to receive the header's contents as
 * children, and island props are JSON — children are dropped, so the header would hydrate empty.
 *
 * The shadow class is written as a literal here so Tailwind generates it (its scanner reads this
 * source). At rest the header is flush with the top and a shadow would underline nothing.
 */
const SHADOW = "shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)]";

export function HeaderShadow() {
  useEffect(() => {
    const header = document.getElementById("site-header");

    if (!header) return;

    function onScroll() {
      // A few pixels rather than zero: browsers restore scroll and rubber-band past the top, and
      // a threshold of exactly 0 makes the shadow flicker during both.
      header?.classList.toggle(SHADOW, window.scrollY > 4);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
