"use client";

import { siteTerms } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { TermsText } from "./TermsText";

/**
 * The shop's terms and privacy policy, for a signed-in customer who has not accepted them yet:
 * the text it wrote (scrolled in place), its two links, and a box they tick themselves - never
 * ticked for them. Ordering and booking wait on it: the server refuses both until it is given.
 */
export function TermsConsent({
  accepted,
  onChange,
}: {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}) {
  const t = useText();
  const terms = siteTerms();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12.5px] font-medium text-ink">
        {t("account.termsTitle")}
      </p>
      {terms?.markdown ? (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-line px-3.5 py-3">
          <TermsText markdown={terms.markdown} />
        </div>
      ) : (
        <p className="text-[13px] text-muted">{t("account.termsHint")}</p>
      )}
      <p className="flex flex-wrap gap-x-4 text-[13px]">
        <a
          className="text-brand underline underline-offset-2"
          href={terms?.termsUrl ?? "/terms"}
          rel="noreferrer noopener"
          target="_blank"
        >
          {t("account.termsLink")}
        </a>
        <a
          className="text-brand underline underline-offset-2"
          href={terms?.privacyUrl ?? "/privacy"}
          rel="noreferrer noopener"
          target="_blank"
        >
          {t("account.privacyLink")}
        </a>
      </p>
      <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-ink">
        <input
          checked={accepted}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
          type="checkbox"
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{t("account.termsAccept")}</span>
      </label>
    </div>
  );
}
