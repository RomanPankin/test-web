"use client";

import { useEffect, useRef, useState } from "react";

import {
  confirmSignOut,
  openOnboarding,
  openSignIn,
  useCustomer,
} from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { UserIcon } from "../Icons";

import { initialsOf } from "./initials";
import { useAccountHint } from "./rememberedAccount";

const ROUND =
  "relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 active:scale-95";

/**
 * The visitor's account, as the person icon beside the bag — only on a shop that lets customers
 * sign in (the layout decides). Signed out it opens the sign-in dialog; signed in it shows their
 * initials and a small menu: who they are, their account page (their orders), the
 * onboarding step while details are missing, and signing out. A dot on it says the profile is not complete — a nudge, not a lock.
 */
/** The initials for a customer - stable, so the hint hook does not re-run every render. */
const initialsFor = (customer: { name: string | null; email: string }) =>
  initialsOf(customer.name, customer.email);

export function AccountButton() {
  const t = useText();
  const { customer, loading } = useCustomer();
  const [menu, setMenu] = useState(false);
  /** A photo that would not load falls back to the initials. */
  const [brokenAvatar, setBrokenAvatar] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const hint = useAccountHint(customer, loading, initialsFor);

  // A click anywhere else closes the menu.
  useEffect(() => {
    if (!menu) return;
    const close = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setMenu(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  // Still finding out who this is: the face remembered from last time, else an empty circle -
  // never the signed-out icon, which would blink into the avatar a moment later.
  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={
          ROUND +
          " overflow-hidden text-[12px] font-semibold" +
          (hint?.avatarUrl ? "" : " bg-soft")
        }
      >
        {hint?.avatarUrl ? (
          <img
            alt=""
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
            src={hint.avatarUrl}
          />
        ) : (
          (hint?.initials ?? null)
        )}
      </span>
    );
  }

  if (!customer) {
    return (
      <button
        aria-haspopup="dialog"
        aria-label={t("account.signIn")}
        className={ROUND}
        type="button"
        onClick={() => openSignIn()}
      >
        <UserIcon size={22} />
      </button>
    );
  }

  return (
    <div ref={box} className="relative">
      <button
        aria-expanded={menu}
        aria-haspopup="menu"
        aria-label={t("account.menu")}
        // A photo fills the circle edge to edge; only initials sit on the soft ground.
        className={
          ROUND +
          " overflow-visible text-[12px] font-semibold" +
          (customer.avatarUrl && !brokenAvatar ? "" : " bg-soft")
        }
        type="button"
        onClick={() => setMenu((open) => !open)}
      >
        {customer.avatarUrl && !brokenAvatar ? (
          // Their Google photo. No referrer: Google refuses some photo requests carrying one.
          <img
            alt=""
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
            src={customer.avatarUrl}
            onError={() => setBrokenAvatar(true)}
          />
        ) : (
          initialsOf(customer.name, customer.email)
        )}
        {customer.onboarded ? null : (
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-brand" />
        )}
      </button>

      {menu ? (
        <div
          className="absolute right-0 top-[48px] z-40 w-[250px] rounded-2xl bg-white p-2 shadow-[0_18px_40px_-16px_rgba(17,18,22,0.35)]"
          role="menu"
        >
          <div className="px-3 py-2.5">
            {customer.name ? (
              <p className="truncate text-[14px] font-semibold text-ink">{customer.name}</p>
            ) : null}
            <p className="truncate text-[12.5px] text-muted">{customer.email}</p>
          </div>
          <a
            className="block rounded-xl px-3 py-2.5 text-[14px] text-ink hover:bg-soft"
            href="/account"
            role="menuitem"
          >
            {t("account.myAccount")}
          </a>
          {customer.onboarded ? null : (
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-brand hover:bg-soft"
              role="menuitem"
              type="button"
              onClick={() => {
                setMenu(false);
                openOnboarding();
              }}
            >
              {t("account.completeProfile")}
            </button>
          )}
          <button
            className="w-full rounded-xl px-3 py-2.5 text-left text-[14px] text-ink hover:bg-soft"
            role="menuitem"
            type="button"
            onClick={() => {
              setMenu(false);
              confirmSignOut();
            }}
          >
            {t("account.signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
