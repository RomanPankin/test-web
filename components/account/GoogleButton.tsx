"use client";

import { signInWithGoogle } from "@estoreclub/client";
import { useEffect, useRef, useState } from "react";

import { setCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

/** What the platform's sign-in page posts back — see `PublicSiteInfo.googleSignInUrl`. */
const CREDENTIAL_MESSAGE = "salespoint:google-credential";

/**
 * "Continue with Google" — opens the platform's Google sign-in page in a popup, and signs the
 * customer in with the ID token it posts back.
 *
 * Google's own button cannot be drawn here: Google wants every page that shows it registered
 * by exact origin, and a shop lives on its own subdomain. So it is drawn on the platform's one
 * registered page, and this button opens it. Only a message from that page's origin is taken.
 */
export function GoogleButton({
  clientId,
  signInUrl,
  onError,
}: {
  clientId: string;
  /** The platform's sign-in page (`PublicSiteInfo.googleSignInUrl`). */
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
      const data = event.data as { type?: string; credential?: string } | null;

      if (data?.type !== CREDENTIAL_MESSAGE || !data.credential) return;
      popup.current = null;
      setBusy(true);
      signInWithGoogle({ idToken: data.credential })
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

    // Centred over the page, sized like Google's own chooser.
    const width = 460;
    const height = 560;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    popup.current = window.open(
      url.toString(),
      "salespoint-google-sign-in",
      `popup,width=${width},height=${height},left=${left},top=${top}`,
    );

    // A blocked popup: nothing opened, so say so rather than seem to do nothing.
    if (!popup.current) onError(t("account.googleUnavailable"));
  };

  return (
    <button
      aria-busy={busy}
      className={
        "flex h-11 w-full max-w-[320px] items-center justify-center gap-3 self-center rounded-full border border-line bg-white px-5 text-[14px] font-medium text-ink transition-colors hover:bg-soft disabled:opacity-50"
      }
      disabled={busy}
      type="button"
      onClick={open}
    >
      <GoogleMark />
      {t("account.continueWithGoogle")}
    </button>
  );
}

/** Google's "G", in its four colours — the mark that says this is Google signing you in. */
function GoogleMark() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 48 48" width="18">
      <path
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
        fill="#FFC107"
      />
      <path
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        fill="#FF3D00"
      />
      <path
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
        fill="#4CAF50"
      />
      <path
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"
        fill="#1976D2"
      />
    </svg>
  );
}
