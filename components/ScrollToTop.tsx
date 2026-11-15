"use client";

import { useEffect } from "react";

/**
 * A new page starts at its top.
 *
 * Next.js does not scroll the WINDOW to the top on navigation: it scrolls the new page's first
 * element into view. Here that element sits under the header the layout draws above every page,
 * so going from the bottom of the menu to /about landed 70px down — the header's height — with
 * the top of the about banner hidden behind it.
 *
 * Instant rather than smooth: `globals.css` makes scrolling smooth for the in-page links
 * (`/#menu`), and a new page gliding up from wherever the last one was reads as the old page
 * still moving. A link to an anchor keeps its own behaviour — the hash says where to go.
 */
export function ScrollToTop() {
  useEffect(() => {
    // Moving between pages without a reload, the platform puts the scroll where it belongs
    // itself: the top of a new page, or where the visitor was on Back. Doing it here too sent
    // Back to the top.
    if (document.documentElement.hasAttribute("data-client-navigation")) return;
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
