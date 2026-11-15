"use client";

import type { PublicCustomerOrderDetail } from "@estoreclub/api";

import { useEffect, useState } from "react";

import { trackOrder } from "@estoreclub/client";

import { useText } from "../ContentProvider";

import { TrackForm } from "./TrackForm";
import { TrackResult } from "./TrackResult";

/** Where the read is: nothing asked yet, on its way, answered, or no such order. */
type Lookup =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "found"; order: PublicCustomerOrderDetail }
  | { state: "missing" };

/**
 * The tracking form and, once one is asked, where that order got to.
 *
 * The form is a plain `method="get"`: submitting it navigates to `/track?code=…&email=…`, so a
 * result has an address a shopper can bookmark or send to the shop. The thank-you after paying
 * links to `/track?order=<checkout id>` (`CheckoutReturn`) - the checkout's id is a credential of
 * its own, so that link needs no email.
 *
 * The ANSWER is read here, in the browser, rather than by the page on the server: a page on the
 * platform is rendered ahead of any request, with empty `searchParams`, so a server read never
 * saw the number and the page always drew the empty form. `trackOrder` through
 * `@estoreclub/client` is relayed by the site's own server, so no key reaches the visitor - and
 * the delivery's tracking number with the order's email is the credential, so the read needs no
 * sign-in - offered only while the shop allows it (`allowsGuests`, the site's
 * `publicOrderTracking`). Never an order number: numbers count up.
 *
 * Any miss - an unknown number, another email, half the form - is answered as "we cannot find
 * it", not as an error: the server does not say which part was wrong, and neither does the page.
 */
export function TrackOrder({ allowsGuests }: { allowsGuests: boolean }) {
  const t = useText();
  const [initial, setInitial] = useState({ code: "", email: "" });
  const [lookup, setLookup] = useState<Lookup>({ state: "idle" });

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const checkoutId = params.get("order")?.trim() ?? "";
    const code = params.get("code")?.trim() ?? "";
    const email = params.get("email")?.trim() ?? "";

    setInitial({ code, email });
    if (!checkoutId && !code && !email) return;
    if (!checkoutId && (!code || !email || !allowsGuests)) {
      setLookup({ state: "missing" });
      return;
    }

    let live = true;

    setLookup({ state: "loading" });
    trackOrder(checkoutId ? { checkoutId } : { code, email })
      .then((order) => {
        if (live) setLookup({ state: "found", order });
      })
      .catch(() => {
        if (live) setLookup({ state: "missing" });
      });

    return () => {
      live = false;
    };
  }, [allowsGuests]);

  return (
    <>
      {/* The form only where the shop lets guests track; the confirmation link (`?order=`)
          works either way. Keyed so the fields take the asked values once the URL is read. */}
      {allowsGuests ? (
        <TrackForm
          key={`${initial.code}|${initial.email}`}
          code={initial.code}
          email={initial.email}
        />
      ) : (
        <p className="text-[15px] text-ink">{t("track.signInOnly")}</p>
      )}

      {lookup.state === "loading" ? (
        <div
          aria-hidden="true"
          className="mt-8 h-[220px] animate-pulse rounded-[12px] bg-tile"
        />
      ) : null}

      {lookup.state === "missing" ? (
        <p className="mt-8 rounded-[10px] bg-tile px-4 py-3.5 text-[14.5px] text-ink">
          {t("track.notFound")}
        </p>
      ) : null}

      {lookup.state === "found" ? <TrackResult order={lookup.order} /> : null}
    </>
  );
}
