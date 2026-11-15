"use client";

import type { PublicLanguage } from "@estoreclub/api";

import { useEffect, useRef, useState } from "react";

import { useText } from "./ContentProvider";

/**
 * A language's name in ITSELF — "English", "Русский", "Deutsch" — from the runtime's own
 * locale data. The API's `codeLocal` is the code in the language's script ("РУ"), and its
 * `name` is in English, which is the one name a reader who needs Russian may not recognise.
 */
function nativeName(language: PublicLanguage): string {
  try {
    const name = new Intl.DisplayNames([language.code], {
      type: "language",
    }).of(language.code);

    if (name && name.toLowerCase() !== language.code.toLowerCase()) {
      return name.charAt(0).toLocaleUpperCase(language.code) + name.slice(1);
    }
  } catch {
    // A code the runtime does not know: the API's own name below.
  }

  return language.name || language.code;
}

/** A year: a visitor who picked a language should not have to pick it again next week. */
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * The languages the shop writes in: a pill in the header that opens a small card of them.
 *
 * A popover of its own rather than the browser's `<select>`: the native list is drawn by the
 * operating system — grey, square, in the system font — and was the one piece of the header
 * that did not look like the site. This keeps what the native list gave for free: arrow keys
 * move through the languages, Enter picks, Escape closes and hands focus back to the pill, and
 * it is announced as a listbox with the current language selected.
 *
 * Each language is named in ITSELF ("Deutsch", not "German") — the reader who needs a language
 * is the one who reads it — with its code beside it, and a tick on the one in use.
 *
 * Choosing writes the cookie the server reads (`lib/language.ts`) and re-renders the page on
 * the server, so every name and sentence comes back in the new language without a full
 * reload. Drawn only when the shop offers more than one language.
 */
export function LanguageSwitcher({
  current: initialCurrent,
  languages,
  up = false,
}: {
  current?: string;
  languages: PublicLanguage[];
  /** Open the card ABOVE the pill - in the footer, where there is no room below. */
  up?: boolean;
}) {
  const t = useText();
  // The chosen language lives in a cookie the server cannot read during the render (the sandbox
  // has none), so the highlight is decided HERE: seed from the server's default, then read the
  // cookie after mount. The first client render matches the server's, so no hydration mismatch.
  const [current, setCurrent] = useState(initialCurrent);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // The `?lang=` param first — it is what survives the editor's cross-site preview iframe, where
    // the cookie is neither sent nor reliably readable — then the cookie for a standalone site.
    const fromUrl = new URLSearchParams(window.location.search).get("lang");

    if (fromUrl) {
      setCurrent(fromUrl);

      return;
    }

    const match = document.cookie.match(/(?:^|;\s*)language=([^;]+)/);

    if (match) setCurrent(decodeURIComponent(match[1]));
  }, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // A STABLE id, not `useId()`: this component is a hydrated island, server-rendered deep in the
  // page tree but hydrated as its own root, so `useId` produces different ids on the two sides
  // (`_R_dm_` vs `_R_0_`) — a hydration mismatch. The page has one language switcher, so a
  // constant is safe and deterministic.
  const listId = "sp-language-list";

  const selectedIndex = Math.max(
    0,
    languages.findIndex((language) => language.code === current),
  );

  // Opening lands on the language in use, so Enter straight away changes nothing.
  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (open) optionRefs.current[active]?.focus();
  }, [open, active]);

  // A press anywhere else closes it — the way every menu on a page behaves.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (languages.length < 2) return null;

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (code: string) => {
    close();
    if (code === current) return;

    // Persist for a standalone (top-level) site, where the cookie rides future visits.
    document.cookie = `language=${encodeURIComponent(code)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;

    // Inside the editor's cross-site preview iframe the browser will not send the cookie on a
    // framed navigation, so there the language rides the URL instead. A standalone site has the
    // cookie and keeps a clean URL — any `?lang=` left over is dropped, since the server reads
    // the param BEFORE the cookie and a stale one would win. A full navigation (not a router
    // refresh) so the server re-renders the menu in the chosen language.
    setPending(true);
    const url = new URL(window.location.href);

    if (window.self !== window.top) url.searchParams.set("lang", code);
    else url.searchParams.delete("lang");
    window.location.assign(url.toString());
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const last = languages.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };

    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const shown = languages[selectedIndex];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={
          t("language.label") + ": " + (shown ? nativeName(shown) : "")
        }
        className={
          "group flex h-7 items-center gap-1 rounded-full px-2 text-[12px] font-medium uppercase tracking-[0.04em] text-ink transition hover:bg-black/5 " +
          (pending ? "opacity-60" : "")
        }
        disabled={pending}
        type="button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <GlobeIcon />
        {shown?.code ?? current}
        <svg
          aria-hidden="true"
          className={
            "transition-transform duration-200 " + (open ? "rotate-180" : "")
          }
          fill="none"
          height="10"
          viewBox="0 0 10 10"
          width="10"
        >
          <path
            d="m2.5 3.8 2.5 2.4 2.5-2.4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
        </svg>
      </button>

      {/* Always rendered, shown by state: the card fades and rises into place from the pill
          rather than popping in, and `invisible` keeps a closed one out of the tab order and
          the accessibility tree. */}
      <div
        className={
          (up
            ? "bottom-[calc(100%+8px)] origin-bottom-right "
            : "top-[calc(100%+8px)] origin-top-right ") +
          "absolute right-0 z-40 w-[200px] rounded-2xl bg-white p-1.5 shadow-[0_2px_6px_rgba(17,18,22,0.06),0_16px_36px_-12px_rgba(17,18,22,0.28)] ring-1 ring-line transition-[opacity,transform,visibility] duration-150 ease-out " +
          (open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.97] opacity-0")
        }
      >
        <p className="px-3 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
          {t("language.label")}
        </p>
        <ul
          aria-label={t("language.label")}
          className="flex flex-col"
          id={listId}
          role="listbox"
          onKeyDown={onListKeyDown}
        >
          {languages.map((language, index) => {
            const isCurrent = index === selectedIndex;

            return (
              <li key={language.code} role="presentation">
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  aria-selected={isCurrent}
                  className={
                    // The row under the pointer or the keyboard is said in colour — the name, its code
                    // and the tick turn the brand's orange — rather than with a grey plate.
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13.5px] outline-none transition-colors hover:text-brand focus-visible:text-brand " +
                    (isCurrent ? "font-semibold text-ink" : "text-ink/85")
                  }
                  lang={language.code}
                  role="option"
                  tabIndex={index === active ? 0 : -1}
                  type="button"
                  onClick={() => choose(language.code)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {nativeName(language)}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted transition-colors group-hover:text-brand group-focus-visible:text-brand">
                    {language.code}
                  </span>
                  {/* The tick, or the room for it, so the codes line up down the list. */}
                  <span aria-hidden="true" className="w-3.5 text-brand">
                    {isCurrent ? <CheckIcon /> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="text-muted transition-colors group-hover:text-brand"
      fill="none"
      height="15"
      viewBox="0 0 24 24"
      width="15"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}
