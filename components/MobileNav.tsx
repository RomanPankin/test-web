"use client";

import type { PublicLanguage } from "@estoreclub/api";
import type { SiteLink } from "../lib/content/types";

import { useEffect, useState } from "react";

import {
  confirmSignOut,
  openSignIn,
  useCustomer,
} from "@estoreclub/storefront/web";

import { useText } from "./ContentProvider";
import { CloseIcon, MenuIcon } from "./Icons";
import { Overlay } from "./Overlay";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * The header's links on a phone and a tablet: a menu button that opens them as a panel from
 * the left. Below `lg` the header holds the wordmark, this button and the bag; the account, the
 * shop's own pages (the strip over the header from `lg`, `TopStrip`) and the language choice
 * move in here too, in words.
 */
export function MobileNav({
  links,
  pages = [],
  signIn = false,
  current: initialCurrent,
  languages,
  wide = false,
}: {
  links: SiteLink[];
  /** The shop's own pages (About, Delivery & returns, FAQ, Track order) - the "pages" links. */
  pages?: SiteLink[];
  /** Whether the shop lets customers sign in — the account section is drawn only then. */
  signIn?: boolean;
  current?: string;
  languages: PublicLanguage[];
  /** The header's row waits for `xl` (too many categories for a laptop): the menu stays till then. */
  wide?: boolean;
}) {
  const t = useText();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(initialCurrent);
  const { customer, loading } = useCustomer();

  // The visitor's own choice, from the cookie the switcher writes — after mount, so the first
  // render matches the server's.
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)language=([^;]+)/);

    if (match) setCurrent(decodeURIComponent(match[1]));
  }, []);

  // The same switch the footer's dropdown makes — see `LanguageSwitcher`.
  const choose = (code: string) => {
    document.cookie = `language=${encodeURIComponent(code)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    const url = new URL(window.location.href);

    url.searchParams.set("lang", code);
    window.location.assign(url.toString());
  };

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("nav.site")}
        className={
          "-ml-2 grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 " +
          (wide ? "xl:hidden" : "lg:hidden")
        }
        type="button"
        onClick={() => setOpen(true)}
      >
        <MenuIcon size={22} />
      </button>

      <Overlay
        label={t("nav.site")}
        open={open}
        placement="left"
        onClose={() => setOpen(false)}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-4">
          <button
            aria-label={t("common.close")}
            className="-mr-2 ml-auto grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5"
            type="button"
            onClick={() => setOpen(false)}
          >
            <CloseIcon size={20} />
          </button>

          <nav aria-label={t("nav.main")} className="mt-2">
            <ul className="divide-y divide-line">
              {links.map((link) => (
                <li key={link.label + link.url}>
                  <a
                    className="flex h-[52px] items-center text-[17px] font-medium tracking-[-0.01em] text-ink transition hover:text-brand"
                    href={link.url || "/shop"}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {pages.length > 0 ? (
            <ul className="mt-5 border-t border-line pt-4">
              {pages.map((link) => (
                <li key={link.label + link.url}>
                  <a
                    className="flex h-10 items-center text-[15px] text-body transition hover:text-brand"
                    href={link.url || "/"}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {signIn ? (
            <div className="mt-6 border-t border-line pt-6">
              {customer ? (
                <>
                  <p className="truncate text-[15px] font-semibold text-ink">
                    {customer.name || customer.email}
                  </p>
                  <a
                    className="mt-3 flex h-11 items-center text-[15px] text-ink hover:text-brand"
                    href="/account"
                  >
                    {t("account.myAccount")}
                  </a>
                  <button
                    className="flex h-11 items-center text-[15px] text-muted hover:text-ink"
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      confirmSignOut();
                    }}
                  >
                    {t("account.signOut")}
                  </button>
                </>
              ) : (
                <button
                  className="h-11 w-full rounded-full bg-ink text-[14.5px] font-medium text-white transition hover:bg-black disabled:opacity-50"
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openSignIn();
                  }}
                >
                  {t("account.signIn")}
                </button>
              )}
            </div>
          ) : null}

          {languages.length > 1 ? (
            <nav
              aria-label={t("language.label")}
              className="mt-auto flex items-center justify-center gap-3 pt-10 text-[14px] uppercase text-muted"
            >
              {languages.map((language, index) => {
                const selected = language.code === current;

                return (
                  <span key={language.code} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-line">
                        |
                      </span>
                    ) : null}
                    <button
                      aria-pressed={selected}
                      className={
                        "py-2 transition hover:text-ink " +
                        (selected ? "font-semibold text-ink" : "")
                      }
                      type="button"
                      onClick={() => !selected && choose(language.code)}
                    >
                      {language.code}
                    </button>
                  </span>
                );
              })}
            </nav>
          ) : null}
        </div>
      </Overlay>
    </>
  );
}
