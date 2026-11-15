import { signInConfigOf } from "@estoreclub/storefront";
import { siteInfo } from "@estoreclub/storefront/server";

import { getText } from "../../../lib/content/server";

import { AccountCabinet } from "./AccountCabinet";

const CONTAINER = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[72px]";

/**
 * The account page's frame, read on the server: whether the shop lets customers sign in at all,
 * and whether it delivers (the address book is only for a shop that does). The customer's own
 * data is read in the browser by `AccountCabinet` - who is signed in is an httpOnly cookie the
 * RPC side reads. An online-only store has no locations to describe, so the orders name none.
 */
export async function CabinetPage() {
  const [t, site] = await Promise.all([getText(), siteInfo()]);

  // The shop does not let customers sign in ("Allow customers to sign in" is off): there is no
  // account to show, and no sign-in to offer - say so, and point at the shop.
  if (!signInConfigOf(site)) {
    return (
      <main className={CONTAINER + " pb-20 pt-14 text-center sm:pt-20"}>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-ink sm:text-[34px]">
          {t("account.unavailableTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-[420px] text-[14.5px] leading-[1.6] text-muted">
          {t("account.unavailableText")}
        </p>
        <a
          className="mt-7 inline-flex h-[44px] items-center rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-black"
          href="/shop"
        >
          {t("action.browseShop")}
        </a>
      </main>
    );
  }

  return (
    <main className={CONTAINER + " pb-16 pt-10 sm:pt-14"}>
      <AccountCabinet
        locations={[]}
        showAddresses={site?.orderTypes?.includes("delivery") ?? false}
      />
    </main>
  );
}
