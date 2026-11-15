"use client";

import type { SignInConfig } from "@estoreclub/storefront";

import { useRef, useState } from "react";

import { closeAccountDialog, useCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";
import { Overlay } from "../Overlay";

import { AppleButton } from "./AppleButton";
import { EmailCodeForm } from "./EmailCodeForm";
import { GoogleButton } from "./GoogleButton";
import { OnboardingForm } from "./OnboardingForm";
import { ProfileForm } from "./ProfileForm";
import { SignOutConfirm } from "./SignOutConfirm";

/**
 * The account dialog: signing in, then — when the shop requires details this customer has not
 * given — the onboarding step; and, once signed in, editing the profile and confirming a sign-out. Mounted once, by the layout; opened from anywhere through the
 * customer store (the header's button, the booking form).
 */
export function AccountDialog({ config }: { config: SignInConfig }) {
  const t = useText();
  const { customer, dialog, reason } = useCustomer();
  const [error, setError] = useState<string | null>(null);
  // Onboarding, the profile and signing out need somebody signed in; a sign-in dialog for a
  // signed-in customer has nothing to say — it closes itself (the store does that when the
  // answer lands).
  const live =
    customer &&
    (dialog === "onboarding" || dialog === "profile" || dialog === "signOut")
      ? dialog
      : "signIn";
  // Closing clears `dialog` at once, but the panel is still on screen while it animates out:
  // it keeps the step it was showing, or the profile would turn into the sign-in form as it left.
  const last = useRef(live);

  if (dialog !== null) last.current = live;
  const step = dialog !== null ? live : last.current;
  const open = dialog !== null && !(step === "signIn" && customer);
  const title =
    step === "onboarding"
      ? t("account.onboardingTitle")
      : step === "profile"
        ? t("account.editProfile")
        : step === "signOut"
          ? t("account.signOutTitle")
          : t("account.signIn");

  const close = () => {
    setError(null);
    closeAccountDialog();
  };

  return (
    <Overlay label={title} open={open} onClose={close}>
      <button
        aria-label={t("common.close")}
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-black/5"
        type="button"
        onClick={close}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          viewBox="0 0 18 18"
          width="18"
        >
          <path
            d="m4 4 10 10M14 4 4 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
        </svg>
      </button>

      <div className="flex flex-col gap-5 p-7 sm:p-8">
        <div className="pr-8">
          <h2 className="text-[22px] font-bold text-ink">{title}</h2>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-muted">
            {/* Why the details are asked now (an order waiting on them), else what they are for -
                never "you can do it later" where the shop will not let them in without them. */}
            {step === "onboarding"
              ? (reason ??
                (customer?.missingDetailsStop === "sign_in"
                  ? t("access.detailsText")
                  : t("account.onboardingText")))
              : step === "profile"
                ? t("account.editProfileText")
                : step === "signOut"
                  ? t("account.signOutText")
                  : (reason ?? t("account.text"))}
          </p>
        </div>

        {step === "signOut" ? (
          <SignOutConfirm reload={config.membersOnly} />
        ) : step === "profile" && customer ? (
          <ProfileForm customer={customer} />
        ) : step === "onboarding" && customer ? (
          <OnboardingForm customer={customer} />
        ) : (
          <>
            {config.google &&
            config.googleClientId &&
            config.googleSignInUrl ? (
              <GoogleButton
                clientId={config.googleClientId}
                signInUrl={config.googleSignInUrl}
                onError={setError}
              />
            ) : null}
            {config.apple && config.appleClientId && config.appleSignInUrl ? (
              <AppleButton
                clientId={config.appleClientId}
                signInUrl={config.appleSignInUrl}
                onError={setError}
              />
            ) : null}
            {(config.google || config.apple) && config.email ? (
              <div className="flex items-center gap-3 text-[12px] text-muted">
                <span className="h-px flex-1 bg-line" />
                {t("account.or")}
                <span className="h-px flex-1 bg-line" />
              </div>
            ) : null}
            {config.email ? <EmailCodeForm onError={setError} /> : null}
            {error ? <p className="text-[13px] text-brand">{error}</p> : null}
          </>
        )}
      </div>
    </Overlay>
  );
}
