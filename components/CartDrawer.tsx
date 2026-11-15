"use client";

import type { OrderType, PublicPaymentDiscounts } from "@estoreclub/api";

import { useEffect, useSyncExternalStore } from "react";

import {
  applyOrderTypeFromUrl,
  getCartSnapshot,
  getServerCartSnapshot,
  hydrateCart,
  setCartOpen,
  subscribeCart,
} from "@estoreclub/storefront/web";

import { CartEmpty } from "./CartEmpty";
import { CartLine } from "./CartLine";
import { CartSummary } from "./CartSummary";
import { CartUpsell } from "./CartUpsell";
import { CloseIcon } from "./Icons";
import { Overlay } from "./Overlay";
import { useText } from "./ContentProvider";

/**
 * The bag, in a panel that slides in from the right.
 *
 * Mounted by the layout beside the header rather than inside it, and opened through the store —
 * the header's bag and every "Add to bag" open it, and a server component cannot hold that state.
 *
 * Three rows, and only the middle one scrolls: a header that stays reachable, the lines with
 * the accessories offer under them (`CartUpsell`), and the summary pinned to the bottom where
 * the total is always visible.
 *
 * The basket is the shared one (`@estoreclub/storefront/web`), as every other sample's is. An
 * online-only shop has none of a restaurant's extras around it - no table, no booking, no
 * pickup location: delivery and its address are asked on the payment page.
 */
export function CartDrawer({
  requireSignIn = false,
  paymentDiscounts = null,
  delivers = false,
  orderTypes = [],
}: {
  /** Only signed-in customers may order: Checkout asks a guest to sign in first. */
  requireSignIn?: boolean;
  /** The shop's money off for a way of paying, for the summary to say. */
  paymentDiscounts?: PublicPaymentDiscounts | null;
  /** The shop delivers - the summary says the address is asked at checkout. */
  delivers?: boolean;
  /** How the shop takes orders - what a QR code's `?orderType=` may ask for. */
  orderTypes?: OrderType[];
}) {
  const t = useText();

  // Read once the page is open: the checkout then starts with it (`startCheckout`).
  useEffect(() => {
    applyOrderTypeFromUrl(orderTypes);
  }, []);

  hydrateCart(null);

  const {
    lines,
    count,
    open,
    pending,
    subtotal,
    discounts,
    tax,
    taxRate,
    taxInclusive,
    total,
  } = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const close = () => setCartOpen(false);

  return (
    <Overlay
      label={t("cart.title")}
      open={open}
      placement="right"
      onClose={close}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 px-7 pb-4 pt-6">
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {t("cart.title")}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-muted">
            {t(count === 1 ? "cart.itemsOne" : "cart.itemsOther", { count })}
          </span>
          <button
            aria-label={t("common.close")}
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-black/5"
            type="button"
            onClick={close}
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </header>

      {lines.length === 0 && pending ? (
        // Opened by "Add to bag" while the line is still on its way: the line about to arrive,
        // not "Your bag is empty" for a moment before it does.
        <div className="min-h-0 flex-1 border-t border-line px-7 py-5" aria-busy="true">
          <div className="flex items-center gap-4">
            <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-soft" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3.5 w-3/5 animate-pulse rounded bg-soft" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-soft" />
            </div>
          </div>
        </div>
      ) : lines.length === 0 ? (
        <CartEmpty onBrowse={close} />
      ) : (
        // The lines and the offer under them scroll together; the header and the total stay.
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-line px-7 pb-4">
          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <CartLine key={line.key} line={line} />
            ))}
          </ul>
          <CartUpsell lines={lines} />
        </div>
      )}

      <div className="border-t border-line">
        <CartSummary
          busy={pending}
          delivers={delivers}
          discounts={discounts}
          empty={lines.length === 0}
          paymentDiscounts={paymentDiscounts}
          requiresSignIn={requireSignIn}
          subtotal={subtotal}
          tax={tax}
          taxInclusive={taxInclusive}
          taxRate={taxRate}
          total={total}
        />
      </div>
    </Overlay>
  );
}
