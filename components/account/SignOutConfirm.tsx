"use client";

import { useState } from "react";

import { closeAccountDialog, signOutCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { PRIMARY } from "./styles";

/**
 * "Sign out?" — asked first, because it is one click away from the account button and signing
 * back in means a code or a Google round trip. The store closes the dialog once it is done.
 *
 * `reload`: the shop shows itself to signed-in customers only, so the page on screen was
 * rendered for the customer - it is loaded again, and a guest gets the sign-in instead.
 */
export function SignOutConfirm({ reload = false }: { reload?: boolean }) {
  const t = useText();
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        className={PRIMARY}
        disabled={busy}
        type="button"
        onClick={() => {
          setBusy(true);
          void signOutCustomer().finally(() => {
            if (reload) window.location.reload();
          });
        }}
      >
        {t("account.signOut")}
      </button>
      <button
        className="h-[44px] w-full rounded-full border border-line bg-white text-[15px] font-semibold text-ink transition hover:border-brand-soft"
        type="button"
        onClick={closeAccountDialog}
      >
        {t("account.stayIn")}
      </button>
    </div>
  );
}
