"use client";

import { openSignIn } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { LockedBoxArt } from "./LockedBoxArt";

/**
 * In place of a customer's own page when nobody is signed in.
 *
 * The whole page, so no card: a centred column on the page's own ground — the drawing, what
 * signing in opens up, the button, and the three things it is good for. The button opens the
 * sign-in dialog; signing in there swaps this for the page itself.
 */
export function SignedOutNotice({
  title,
  text,
  perks = [],
}: {
  title: string;
  text: string;
  /** Short lines under the button: what an account gives. */
  perks?: string[];
}) {
  const t = useText();

  return (
    <section className="mx-auto flex max-w-[520px] flex-col items-center py-10 text-center sm:py-16">
      <LockedBoxArt className="h-[150px] w-auto sm:h-[170px]" />

      <h1 className="mt-8 text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[36px]">
        {title}
      </h1>
      <p className="mt-3 max-w-[420px] text-[15.5px] leading-[1.6] text-muted">{text}</p>

      <button
        className="mt-8 inline-flex h-[50px] items-center gap-2.5 rounded-full bg-ink px-9 text-[15.5px] font-semibold text-white transition hover:bg-black active:scale-[0.98]"
        type="button"
        onClick={() => openSignIn()}
      >
        <svg aria-hidden fill="none" height="18" viewBox="0 0 24 24" width="18">
          <circle cx="12" cy="8.5" r="3.75" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4.75 19.25c1.3-3.1 4-4.75 7.25-4.75s5.95 1.65 7.25 4.75"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
        {t("account.signIn")}
      </button>
      <p className="mt-3 text-[12.5px] text-muted">{t("account.noPassword")}</p>

      {perks.length ? (
        <ul className="mt-10 grid w-full gap-3 border-t border-line pt-8 text-left sm:grid-cols-3 sm:gap-5">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5 text-[13.5px] leading-[1.45] text-ink">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                <svg aria-hidden fill="none" height="12" viewBox="0 0 20 20" width="12">
                  <path
                    d="m5 10.4 3.2 3.1L15 6.8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.6"
                  />
                </svg>
              </span>
              {perk}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
