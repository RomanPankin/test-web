"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import {
  getCartSnapshot,
  getServerCartSnapshot,
  hydrateCart,
  setCartOpen,
  subscribeCart,
} from "@estoreclub/storefront/web";

import { useText } from "./ContentProvider";
import { BagIcon } from "./Icons";

/**
 * The bag in the header, with a count once there is something in it. Opens the drawer.
 *
 * An island reading the SAME store as the "Add to bag" buttons, which works because the shared
 * `cartStore` is imported only by client code and is therefore bundled once. The cart loads in the browser
 * (the render has no request cookies), so the badge fills in right after hydration.
 */
export function CartButton() {
  const t = useText();

  hydrateCart(null);

  const { count } = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  // No pop for the count the page loads with - only for one that changes after.
  const [canPop, setCanPop] = useState(false);

  useEffect(() => setCanPop(true), []);

  return (
    <button
      aria-haspopup="dialog"
      aria-label={
        count === 0
          ? t("cart.emptyLabel")
          : t(count === 1 ? "cart.countOne" : "cart.countOther", { count })
      }
      className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-black/5 active:scale-95"
      type="button"
      onClick={() => setCartOpen(true)}
    >
      <BagIcon size={22} />
      {count > 0 ? (
        <span
          // Keyed on the count, so each change mounts it afresh and its pop plays again.
          key={count}
          aria-hidden="true"
          className={`${canPop ? "cart-badge-pop " : ""}absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-white ring-2 ring-white`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
