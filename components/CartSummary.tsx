"use client";

import type { PublicPaymentDiscounts } from "@estoreclub/api";

import { useActionState, useEffect, useRef, useState } from "react";

import { startCheckout, type CheckoutState } from "@estoreclub/storefront/web";
import {
  heldForDetails,
  openOnboarding,
  openSignIn,
  useCustomer,
} from "@estoreclub/storefront/web";
import { money } from "@estoreclub/storefront";

import { Arrow } from "./Arrow";
import { useText } from "./ContentProvider";
import { PaymentSavings } from "./PaymentSavings";

/**
 * What the order costs, pinned below the scrolling list — and the way to pay for it.
 *
 * The figures are the store's: the subtotal at the site's own prices, then each deal the SERVER
 * applied — by name, so the shopper sees which offer they got — and the total after them,
 * which is what the checkout charges for these lines.
 *
 * Delivery is not priced here: its fee depends on the address, which the payment page asks for
 * (and prices by the shop's delivery zones). A shop that delivers gets a line under the total
 * saying so (`delivers`), so a total without a fee does not read as the whole price.
 *
 * Checkout is a FORM posting to a server action, not a click handler: the action builds the
 * order and answers with the platform's payment page, and the site never handles a card — nor
 * asks for an email, which that page does too.
 *
 * The browser LEAVES for that page (`location.assign`) rather than the action redirecting to
 * it. The payment page is a separate app behind the same host, so a router navigation would
 * fetch it as this app's own route and get an answer it cannot render; only a document request
 * reaches it.
 *
 * `busy` holds the button while a quantity change is still on its way to the server. The
 * checkout is built from the SERVER's basket, so submitting mid-change would charge for the
 * basket as it was a moment ago.
 *
 * `requiresSignIn`: the shop takes orders from signed-in customers only. A guest's Pay opens the
 * sign-in dialog instead of submitting, and the checkout goes ahead by itself once they are
 * signed in — as the booking form's "Confirm" does.
 */
export function CartSummary({
  subtotal,
  discounts,
  tax,
  taxRate,
  taxInclusive,
  total,
  empty,
  busy,
  paymentDiscounts = null,
  requiresSignIn = false,
  delivers = false,
}: {
  subtotal: number;
  discounts: { name: string; amount: number }[];
  /** The tax in the total, its rate, and whether the prices already carried it. */
  tax: number;
  taxRate: number;
  taxInclusive: boolean;
  total: number;
  empty: boolean;
  busy: boolean;
  /** Only signed-in customers may order: Pay asks a guest to sign in first. */
  requiresSignIn?: boolean;
  /** The shop's money off for a way of paying, said under the total — see `PaymentSavings`. */
  paymentDiscounts?: PublicPaymentDiscounts | null;
  /** The shop delivers: a line under the total says the fee is added at checkout. */
  delivers?: boolean;
}) {
  const t = useText();
  const [state, submit, submitting] = useActionState(
    // An online-only store: no location is sent - delivery and its address are asked on the
    // payment page itself.
    (previous: CheckoutState) =>
      startCheckout(previous, { sendsLocation: false }),
    { error: null },
  );
  const leaving = !!state.checkoutUrl;
  const form = useRef<HTMLFormElement>(null);
  const { customer, dialog, reason } = useCustomer();
  const mustSignIn = requiresSignIn && !customer;
  // Signed in but missing a detail the shop requires (a name, a phone, the terms accepted):
  // asked for here, before the payment page - which would otherwise refuse the order. The
  // server's own list (`missingFields`), so the site asks for exactly what it would refuse.
  const mustFinishProfile = heldForDetails(customer);
  const detailsReason = t("account.detailsToOrder");
  /**
   * Pay was pressed by a guest, or by a customer with details missing: the dialog is open, and
   * paying follows once they are signed in with every detail given.
   */
  const [payAfterSignIn, setPayAfterSignIn] = useState(false);

  // Signed in (and complete) after pressing Pay: on to the payment page. Signed in with details
  // missing: the dialog has moved on to them - said to be for this order.
  useEffect(() => {
    if (!payAfterSignIn || !customer) return;
    if (heldForDetails(customer)) {
      if (dialog === "onboarding" && reason !== detailsReason) {
        openOnboarding(detailsReason);
      }

      return;
    }
    setPayAfterSignIn(false);
    form.current?.requestSubmit();
  }, [payAfterSignIn, customer, dialog, reason, detailsReason]);

  // The dialog closed before they were ready: they changed their mind, and nothing is paid later.
  useEffect(() => {
    if (
      payAfterSignIn &&
      dialog === null &&
      (!customer || heldForDetails(customer))
    ) {
      setPayAfterSignIn(false);
    }
  }, [payAfterSignIn, dialog, customer]);

  useEffect(() => {
    // `assign`, not `replace`: the basket stays in history, so Back from the payment page is
    // the way out the shopper expects — and the cancel address it offers returns here anyway.
    if (state.checkoutUrl) window.location.assign(state.checkoutUrl);
  }, [state.checkoutUrl]);

  return (
    <form ref={form} action={submit} className="shrink-0 px-7 pb-7 pt-5">
      <dl className="space-y-1.5 text-[14px] text-muted">
        <div className="flex justify-between">
          <dt>{t("cart.subtotal")}</dt>
          <dd className="tabular-nums">{money(subtotal)}</dd>
        </div>
        {discounts.map((deal) => (
          <div key={deal.name} className="flex justify-between text-deal">
            <dt>{deal.name}</dt>
            <dd className="tabular-nums">−{money(deal.amount)}</dd>
          </div>
        ))}
        {/* Added on top: a line of its own, before the total it raises. Included: said under
            the total instead — it is part of the prices, not something more to pay. */}
        {tax > 0 && !taxInclusive ? (
          <div className="flex justify-between">
            <dt>{t("cart.tax", { rate: taxRate })}</dt>
            <dd className="tabular-nums">{money(tax)}</dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[19px] font-semibold text-ink">
        <span>{t("cart.total")}</span>
        <span className="tabular-nums">{money(total)}</span>
      </div>
      {tax > 0 && taxInclusive ? (
        <p className="mt-1 text-right text-[12.5px] text-muted tabular-nums">
          {t("cart.taxIncluded", { rate: taxRate, amount: money(tax) })}
        </p>
      ) : null}
      {empty ? null : <PaymentSavings discounts={paymentDiscounts} />}
      {!empty && delivers ? (
        <p className="mt-2 text-[12.5px] leading-snug text-muted">
          {t("cart.deliveryNote")}
        </p>
      ) : null}

      {state.error ? (
        <p className="mt-2 text-xs text-brand" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        className="mt-5 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[14.5px] font-medium text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:active:scale-100"
        disabled={empty || busy || submitting || leaving}
        // A guest where only signed-in customers may order: signing in first, from the button.
        // A customer missing required details: those first.
        type={mustSignIn || mustFinishProfile ? "button" : "submit"}
        onClick={
          mustSignIn
            ? () => {
                setPayAfterSignIn(true);
                openSignIn(t("account.toOrder"));
              }
            : mustFinishProfile
              ? () => {
                  setPayAfterSignIn(true);
                  openOnboarding(detailsReason);
                }
              : undefined
        }
      >
        {/* Held after success too: the browser is on its way out, and a button that re-enables
            for that moment invites a second checkout. */}
        {submitting || leaving ? (
          t("cart.paying")
        ) : (
          <>
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
            >
              <rect
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
                width="15"
                x="4.5"
                y="10.5"
              />
              <path
                d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </svg>
            {t("cart.pay")}
            <Arrow />
          </>
        )}
      </button>
    </form>
  );
}
