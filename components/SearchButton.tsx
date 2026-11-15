"use client";

import type { PublicProduct } from "@estoreclub/api";

import { useEffect, useRef, useState } from "react";
import { getProducts } from "@estoreclub/client";
import { money, photoOf } from "@estoreclub/storefront";

import { productHref } from "../lib/productUrl";

import { AutoHeight } from "./AutoHeight";
import { useText } from "./ContentProvider";
import { SearchIcon } from "./Icons";
import { Overlay } from "./Overlay";
import { ProductImage } from "./product/ProductImage";

/** How long the typing rests before the shop is asked - one read per word, not per letter. */
const DEBOUNCE_MS = 220;

/**
 * The header's search: the magnifier opens a panel with a box, and what is typed is looked up
 * in the shop (`getProducts({ search })`, through the site's own server - no key in the page).
 * The products found are listed with their picture, short spec and price, each leading to its
 * page. Enter goes to the first. Nothing typed, it says what it searches.
 */
export function SearchButton() {
  const t = useText();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => input.current?.focus(), 60);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const words = query.trim();

    if (words.length < 2) {
      setResults(null);
      setLoading(false);

      return;
    }

    let current = true;

    setLoading(true);
    const timer = setTimeout(() => {
      getProducts({ search: words, limit: 8, include: ["media"] })
        .then((page) => {
          if (current) setResults(page.data);
        })
        .catch(() => {
          if (current) setResults([]);
        })
        .finally(() => {
          if (current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query]);

  const hrefOf = (product: PublicProduct) =>
    productHref({
      id: product.id,
      number: product.productNumber ?? undefined,
      name: product.name,
    });

  return (
    <>
      <button
        aria-label={t("nav.search")}
        className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5"
        type="button"
        onClick={() => setOpen(true)}
      >
        <SearchIcon size={21} />
      </button>

      <Overlay
        label={t("nav.search")}
        open={open}
        placement="center"
        size="md"
        onClose={() => setOpen(false)}
      >
        <form
          className="border-b border-line px-5 py-4"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (results?.[0]) window.location.assign(hrefOf(results[0]));
          }}
        >
          <label className="flex items-center gap-3">
            <SearchIcon className="shrink-0 text-muted" size={20} />
            <input
              ref={input}
              aria-label={t("nav.search")}
              autoComplete="off"
              className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
              placeholder={t("search.placeholder")}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </form>

        {/* Grows and shrinks with what is found, rather than jumping as results arrive. */}
        <AutoHeight className="max-h-[60vh] overflow-y-auto px-2 py-2">
        <div aria-live="polite">
          {query.trim().length < 2 ? (
            <p className="px-3 py-6 text-center text-[13.5px] text-muted">
              {t("search.hint")}
            </p>
          ) : loading && !results ? (
            <p className="px-3 py-6 text-center text-[13.5px] text-muted">
              {t("search.searching")}
            </p>
          ) : results && results.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13.5px] text-muted">
              {t("search.empty", { query: query.trim() })}
            </p>
          ) : (
            <ul className="flex flex-col">
              {(results ?? []).map((product) => {
                const cover = product.media?.[0];

                return (
                  <li key={product.id}>
                    <a
                      className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition hover:bg-tile"
                      href={hrefOf(product)}
                    >
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-tile">
                        {cover ? (
                          <ProductImage
                            className="h-11 w-11"
                            sizes="56px"
                            src={photoOf(cover)}
                          />
                        ) : null}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[14px] font-medium text-ink">
                          {product.name}
                        </span>
                        {product.description ? (
                          <span className="truncate text-[12.5px] text-muted">
                            {product.description}
                          </span>
                        ) : null}
                      </span>
                      {typeof product.price === "number" ? (
                        <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink">
                          {money(product.price)}
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        </AutoHeight>
      </Overlay>
    </>
  );
}
