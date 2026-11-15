"use client";

import type { ReactNode } from "react";

import { useRef } from "react";
import { createPortal } from "react-dom";

import { useOverlay } from "@estoreclub/storefront/web";

/**
 * A backdrop with a panel on it, and the animation both need.
 *
 * Motion respects `prefers-reduced-motion`: the panel still moves, because a drawer that
 * teleports is harder to follow than one that slides, but it does it in a fraction of the
 * time — the override is beside the keyframes in `globals.css`.
 *
 * Shared by the order dialog and the cart drawer, which differ only in where the panel comes
 * from: `center` grows from slightly below and behind, `right` slides in from the edge.
 *
 * The drawer keeps square corners. A rounded edge against the side of the window reads as a
 * card that failed to finish rather than as a panel attached to the viewport — the radius
 * belongs on the dialog, which floats.
 *
 * PORTALLED to `<body>`. `position: fixed` covers the viewport only while no ancestor has a
 * `transform` — one that does becomes the containing block, and the product card lifts on
 * hover with exactly that, which shrank the dialog into the card it was opened from. The
 * portal is safe to create here: nothing renders until the overlay is opened, which only ever
 * happens in the browser, so the server never reaches `createPortal`.
 */
interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Where the panel comes from. Dialogs are centred; the cart slides in from the right, the
   *  phone's site menu from the left. */
  placement?: "center" | "right" | "left";
  /**
   * How wide a centred panel is. `md` is a form; `xl` is the product dialog, which puts a
   * gallery beside the order and needs most of the window for both. Ignored for the drawer.
   */
  size?: "md" | "lg" | "xl";
  /**
   * A bottom sheet on a phone (below `sm`) rather than a card in the middle. On by default
   * for the product dialog (`xl`); any centred dialog can ask for it.
   */
  sheet?: boolean;
  /** Names the dialog for screen readers — there is no visible title to point at. */
  label: string;
  children: ReactNode;
}

export function Overlay({
  open,
  onClose,
  placement = "center",
  size = "md",
  sheet,
  label,
  children,
}: OverlayProps) {
  const { rendered, closing } = useOverlay(open, onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const isSheet = placement === "center" && (sheet ?? size === "xl");

  if (!rendered) return null;

  /**
   * The sheet's handle: the panel follows a finger pulled down, and lets go into a close past
   * a third of its height or a quick flick - short of that it springs back. `transform`, not
   * `translate`, so it never fights the open and close animations, which use the other.
   */
  const handle = {
    onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
      drag.current = { y: event.clientY, dy: 0 };
      event.currentTarget.setPointerCapture(event.pointerId);
      if (panelRef.current) panelRef.current.style.transition = "none";
    },
    onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
      if (!drag.current || !panelRef.current) return;

      drag.current.dy = Math.max(0, event.clientY - drag.current.y);
      panelRef.current.style.transform = `translateY(${drag.current.dy}px)`;
    },
    onPointerUp() {
      const panelEl = panelRef.current;
      const dy = drag.current?.dy ?? 0;

      drag.current = null;
      if (!panelEl) return;

      if (dy > Math.min(160, panelEl.offsetHeight / 3)) {
        onClose();

        return;
      }

      panelEl.style.transition =
        "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
      panelEl.style.transform = "";
    },
  };

  /**
   * The animation is a CLASS NAME, not a pair of states.
   *
   * `globals.css` holds the keyframes; this only chooses which way it is going. Nothing here
   * has to be applied a frame after mount, which is what used to make the enter unreliable —
   * see `useOverlay`.
   */
  const panel =
    placement === "right"
      ? "ml-auto h-full w-full max-w-[478px] bg-white " +
        (closing ? "overlay-drawer-out" : "overlay-drawer-in")
      : placement === "left"
        ? "mr-auto h-full w-[85%] max-w-[340px] bg-white " +
          (closing ? "overlay-drawer-left-out" : "overlay-drawer-left-in")
        : (size === "xl"
          ? // Inset from the window on every side: a panel this wide that touched the edges
            // would read as a page, not as something laid over one.
            "m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-[1280px] rounded-2xl bg-white "
          : size === "lg"
            ? // Two columns side by side.
              "m-auto max-h-full w-full max-w-lg rounded-3xl bg-white transition-[max-width] duration-300 ease-out lg:max-w-[56rem] "
            : "m-auto max-h-full w-full max-w-lg rounded-3xl bg-white transition-[max-width] duration-300 ease-out ") +
        // On a phone, a SHEET instead - full width on the bottom edge, rounded only on top,
        // rising from below (`overlay-sheet` in `globals.css`), with a handle to pull it back
        // down. After the size's classes, so these win below `sm`.
        (isSheet
          ? "overlay-sheet max-sm:mb-0 max-sm:mt-auto max-sm:max-h-[92dvh] max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:rounded-t-3xl "
          : "") +
        (closing ? "overlay-dialog-out" : "overlay-dialog-in");

  return createPortal(
    <div
      aria-label={label}
      aria-modal="true"
      // The backdrop fades on its own clock — faster in, so the page behind is dimmed before
      // the panel has finished travelling and the panel does not appear to drag a shadow in
      // with it.
      className={
        "fixed inset-0 z-50 flex " +
        (closing ? "overlay-backdrop-out" : "overlay-backdrop-in")
      }
      role="dialog"
    >
      {/* The backdrop is a BUTTON, not a div with a click handler: closing is an action, and
          a div that closes things is unreachable by keyboard and invisible to a screen
          reader. Behind the panel rather than around it, so a click on the content cannot
          land on it — which is what the old `stopPropagation` was compensating for. */}
      <button
        aria-label={`Close ${label}`}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        tabIndex={-1}
        type="button"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        // `overflow-hidden` so a full-bleed child — the dialog's photo — is cut to the
        // panel's corner radius instead of squaring them off. Harmless for the drawer,
        // which has no radius to clip to. The scrolling region is a child, so this does not
        // trap it.
        className={"relative flex flex-col overflow-hidden shadow-2xl " + panel}
      >
        {isSheet ? (
          // Phones only: a bar to pull the sheet down by, in a strip tall enough to catch a
          // thumb. Over the content's top padding, so it takes no room of its own.
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 z-20 flex h-6 w-32 -translate-x-1/2 cursor-grab touch-none justify-center pt-2 active:cursor-grabbing sm:hidden"
            onPointerCancel={handle.onPointerUp}
            onPointerDown={handle.onPointerDown}
            onPointerMove={handle.onPointerMove}
            onPointerUp={handle.onPointerUp}
          >
            <span className="h-1 w-10 rounded-full bg-black/20" />
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
