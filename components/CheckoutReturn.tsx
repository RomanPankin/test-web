"use client";

import { useEffect, useState } from "react";

import { finishCart, setCartOpen } from "@estoreclub/storefront/web";

import { useText } from "./ContentProvider";

/** How long the thank-you stays before it takes itself away. */
const VISIBLE_MS = 10_000;

/**
 * Which orders this tab has already been thanked for.
 *
 * Per tab and not persisted beyond it: the point is that ONE payment is acknowledged once,
 * however many times the page is reloaded afterwards, and a shopper who orders again tomorrow
 * should be thanked again.
 */
const THANKED_KEY = "sample-tech:thanked";

function alreadyThanked(orderId: string): boolean {
  try {
    return window.sessionStorage.getItem(THANKED_KEY) === orderId;
  } catch {
    // Private windows and blocked storage: the URL strip below is the other half of this, so
    // forgetting here costs at most one extra thank-you.
    return false;
  }
}

function rememberThanked(orderId: string): void {
  try {
    window.sessionStorage.setItem(THANKED_KEY, orderId);
  } catch {
    // As above.
  }
}

/**
 * Where the hosted payment page hands the shopper back, and what the site does about it.
 *
 * Two addresses, both set by `startCheckout` (`@estoreclub/storefront/web`):
 *
 * - `/?order=<checkout id>` — paid. The basket is an order now, so the site lets go of it
 *   (`finishCart`: the cookie goes, the cart stays on the server as the order) and says so.
 * - `/?cart=open` — backed out. The basket is untouched, so the drawer reopens on it.
 *
 * Read from `location` in an effect rather than with `useSearchParams` — this is a layout island
 * and reads the URL after mount.
 *
 * ONCE per payment. `finishCart` now runs a plain client RPC (not a server action), so the
 * address can be stripped with a bare `history.replaceState` — there is no router re-render to
 * restore the parameter afterwards. The id is also remembered for the tab, so a URL that
 * survives (a reload before the strip lands, or a browser that blocks the history write) is
 * acknowledged only the first time.
 *
 * It links the order to /track (`account.trackOrder`), where the same number answers how far it
 * has got - the toast goes, the link's address can be kept.
 *
 * And it leaves by itself after ten seconds. It is a confirmation, not a dialogue: a shopper
 * who has read it is trying to look at the page underneath, and one who missed it has the
 * receipt in their inbox.
 */
export function CheckoutReturn() {
  const t = useText();
  // The checkout id of the order just paid for - also its number on /track.
  const [ordered, setOrdered] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("order");
    const isFresh = !!orderId && !alreadyThanked(orderId);

    if (orderId) {
      if (isFresh) {
        rememberThanked(orderId);
        setOrdered(orderId);
        void finishCart();
      }
    } else if (url.searchParams.get("cart") === "open") {
      setCartOpen(true);
    } else {
      return;
    }

    // Strip the parameter from the address bar without a navigation, so a reload does not thank
    // the shopper again and the page they are looking at does not jump.
    url.searchParams.delete("order");
    url.searchParams.delete("cart");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  // Ten seconds from the moment it appears. Re-armed if it ever appears twice in one visit, and
  // cleared when the shopper dismisses it — nothing is left running behind a closed message.
  useEffect(() => {
    if (!ordered) return;

    const timer = window.setTimeout(() => setOrdered(null), VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, [ordered]);

  if (!ordered) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-neutral-900 px-5 py-4 text-white shadow-xl"
      role="status"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t("checkout.thanks")}</p>
        <p className="mt-0.5 text-xs text-neutral-300">
          {t("checkout.receipt")}
        </p>
        {/* Where it has got to, any time later: the number /track asks for is this one. */}
        <a
          className="mt-2 inline-block text-xs font-medium text-brand-bright underline-offset-2 hover:underline"
          href={"/track?order=" + encodeURIComponent(ordered)}
        >
          {t("account.trackOrder")}
        </a>
      </div>
      <button
        aria-label={t("common.dismiss")}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-lg leading-none text-neutral-400 transition hover:bg-white/10 hover:text-white"
        type="button"
        onClick={() => setOrdered(null)}
      >
        ×
      </button>
    </div>
  );
}
