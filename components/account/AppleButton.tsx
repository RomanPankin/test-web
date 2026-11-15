"use client";

import { signInWithApple } from "@estoreclub/client";
import { useEffect, useRef, useState } from "react";

import { setCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

/** What the platform's sign-in page posts back — see `PublicSiteInfo.appleSignInUrl`. */
const CREDENTIAL_MESSAGE = "salespoint:apple-credential";

/**
 * "Continue with Apple" — opens the platform's Apple sign-in page in a popup, and signs the
 * customer in with the ID token it posts back, and the name beside it.
 *
 * Apple sends the customer back to one return address registered with it, so the sign-in runs
 * on the platform's page, not here, and this button opens it. Only a message from that page's
 * origin is taken. Apple tells the name on the first sign-in only (`name`, else null).
 */
export function AppleButton({
  clientId,
  signInUrl,
  onError,
}: {
  /** The shop's Apple Services ID (`PublicSiteInfo.appleClientId`). */
  clientId: string;
  /** The platform's sign-in page (`PublicSiteInfo.appleSignInUrl`). */
  signInUrl: string;
  onError: (message: string) => void;
}) {
  const t = useText();
  const [busy, setBusy] = useState(false);
  const popup = useRef<Window | null>(null);
  const pageOrigin = new URL(signInUrl).origin;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== pageOrigin) return;
      const data = event.data as {
        type?: string;
        credential?: string;
        name?: string | null;
      } | null;

      if (data?.type !== CREDENTIAL_MESSAGE || !data.credential) return;
      popup.current = null;
      setBusy(true);
      signInWithApple({ idToken: data.credential, name: data.name })
        .then((customer) => setCustomer(customer, { afterSignIn: true }))
        .catch((error: unknown) =>
          onError(
            error instanceof Error && error.message
              ? error.message
              : t("account.failed"),
          ),
        )
        .finally(() => setBusy(false));
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [pageOrigin]);

  const open = () => {
    const url = new URL(signInUrl);

    url.searchParams.set("origin", window.location.origin);
    url.searchParams.set("client", clientId);
    url.searchParams.set("lang", document.documentElement.lang || "en");

    // Centred over the page, sized like Apple's own sign-in.
    const width = 500;
    const height = 640;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    popup.current = window.open(
      url.toString(),
      "salespoint-apple-sign-in",
      `popup,width=${width},height=${height},left=${left},top=${top}`,
    );

    // A blocked popup: nothing opened, so say so rather than seem to do nothing.
    if (!popup.current) onError(t("account.appleUnavailable"));
  };

  return (
    // Apple's own look for its button: black, the white logo and words.
    <button
      aria-busy={busy}
      className={
        "flex h-11 w-full max-w-[320px] items-center justify-center gap-3 self-center rounded-full bg-black px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
      }
      disabled={busy}
      type="button"
      onClick={open}
    >
      <AppleMark />
      {t("account.continueWithApple")}
    </button>
  );
}

/** Apple's logo, in white — the mark that says this is Apple signing you in. */
function AppleMark() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="18"
      viewBox="0 0 384 512"
      width="16"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}
