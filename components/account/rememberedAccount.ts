"use client";

import type { PublicCustomer } from "@estoreclub/api";

import { useEffect, useState } from "react";

/**
 * Who was signed in on this browser last time - enough to draw the header's avatar while the
 * real answer is on its way.
 *
 * The server render cannot know the visitor (the page never sees their token), so the account
 * button starts every page "loading". Drawing the signed-out icon then and swapping in the
 * avatar a moment later made the header blink on every page. With this hint a returning
 * customer sees their own avatar at once; the read that follows confirms it, or clears it.
 *
 * Only the face is kept - initials and photo - never the email or anything private. Browser
 * storage can be missing (a private window, a preview): then there is no hint, which is fine.
 */
const KEY = "techstore:account";

export interface AccountHint {
  initials: string;
  avatarUrl: string | null;
}

function read(): AccountHint | null {
  try {
    const raw = window.localStorage.getItem(KEY);

    return raw ? (JSON.parse(raw) as AccountHint) : null;
  } catch {
    return null;
  }
}

function write(hint: AccountHint | null): void {
  try {
    if (hint) window.localStorage.setItem(KEY, JSON.stringify(hint));
    else window.localStorage.removeItem(KEY);
  } catch {
    // No storage: the next page simply has no hint.
  }
}

/**
 * The hint to draw while the customer is loading, kept in step with the answer once it comes:
 * remembered on a sign-in, forgotten on a sign-out. Read after mount, so the server's HTML and
 * the first client render agree.
 */
export function useAccountHint(
  customer: PublicCustomer | null,
  loading: boolean,
  initials: (customer: PublicCustomer) => string,
): AccountHint | null {
  const [hint, setHint] = useState<AccountHint | null>(null);

  useEffect(() => {
    if (loading) {
      setHint(read());

      return;
    }

    const next = customer
      ? { initials: initials(customer), avatarUrl: customer.avatarUrl ?? null }
      : null;

    write(next);
    setHint(next);
  }, [customer, loading, initials]);

  return hint;
}
