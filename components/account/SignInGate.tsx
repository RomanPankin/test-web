"use client";

import type { Access } from "@estoreclub/storefront/server";

import { useEffect, useState } from "react";

import { closeAccountDialog, useCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { OnboardingForm } from "./OnboardingForm";
import { SignedOutNotice } from "./SignedOutNotice";

/** When the page last reloaded itself for a sign-in - so a refusal never reloads in a loop. */
const RELOADED = "gate-reloaded-at";

/**
 * Every page, for a guest of a shop that shows itself to signed-in customers only (see
 * `signInRequired` in `@estoreclub/storefront/server`): what the shop is, and the way in.
 *
 * Signing in here (or a session the browser still holds - the access cookie lapses after a few
 * minutes, and the header's account read renews it) loads the page again, now rendered as the
 * customer. Not while the account dialog is still open: a first sign-in goes on to the details
 * step, which a reload would cut short.
 *
 * Signed in but still refused: the shop counts a customer as signed out until they add a
 * required detail (`missingDetailsStop: "sign_in"`). Then this asks for the details, right
 * here - "Sign in" would be a lie, and a reload would change nothing - and loads the page once
 * they are in.
 *
 * `access` is what the render already knew: the details step, with the fields the API says this
 * customer still owes, when it refused a signed-in customer for them. The page then opens on
 * that form, drawn at once - no "Sign in" first, and no wait for the account read; the form
 * stays the same form when the account arrives.
 */
export function SignInGate({
  access = { step: "sign_in" },
}: {
  access?: Access;
}) {
  const t = useText();
  const { customer, loading, dialog } = useCustomer();
  // Reloaded a moment ago and still refused: show the way in again rather than a placeholder
  // that never resolves.
  const [stuck, setStuck] = useState(false);
  const held = customer?.missingDetailsStop === "sign_in";
  // Once the details were asked for here, the form stays until the page loads again: their
  // save lifts the hold, and the page goes on showing the form with its button turning.
  const [asked, setAsked] = useState(false);

  if (held && !asked) setAsked(true);

  // The details are asked for HERE, on the page: the account dialog moving on to its own
  // details step after a sign-in would ask the same thing twice, one form over the other.
  useEffect(() => {
    if (held && dialog === "onboarding") closeAccountDialog();
  }, [held, dialog]);

  useEffect(() => {
    if (!customer || dialog || held) return;

    let last = 0;

    try {
      last = Number(sessionStorage.getItem(RELOADED)) || 0;
      sessionStorage.setItem(RELOADED, String(Date.now()));
    } catch {
      // No storage (a private window): reload anyway - the guard is only against a loop.
    }
    if (Date.now() - last < 10_000) {
      setStuck(true);

      return;
    }

    window.location.reload();
  }, [customer, dialog, held]);

  // The render said details: the form is drawn from what it knew while the session is read;
  // only a session that turns out gone goes back to the sign-in.
  const known = access.step === "details" && loading ? access : null;
  const details = (customer && (held || asked)) || known;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-[72px]">
      {details ? (
        <section className="mx-auto flex max-w-[440px] flex-col py-10 sm:py-16">
          <h1 className="text-center text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[36px]">
            {t("access.detailsTitle")}
          </h1>
          <p className="mb-8 mt-3 text-center text-[15.5px] leading-[1.6] text-muted">
            {t("access.detailsText")}
          </p>
          <OnboardingForm
            customer={
              customer ?? {
                missingFields: known?.missingFields ?? [],
                missingDetailsStop: "sign_in",
              }
            }
            pending={!!customer && !held}
          />
        </section>
      ) : loading || (customer && !dialog && !stuck) ? (
        <div className="mx-auto h-[420px] max-w-[520px] animate-pulse rounded-[20px] bg-white/70" />
      ) : (
        <SignedOutNotice
          perks={[
            t("account.perk.track"),
            t("account.perk.reorder"),
            t("account.perk.details"),
          ]}
          text={t("access.text")}
          title={t("access.title")}
        />
      )}
    </main>
  );
}
