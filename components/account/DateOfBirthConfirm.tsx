"use client";

import { useText } from "../ContentProvider";

import { Spinner } from "./Spinner";
import { PRIMARY } from "./styles";
import { writtenDate } from "./writtenDate";

/**
 * "Is this date correct?" - asked before a date of birth is sent, because it is sent once: the
 * server refuses to change it afterwards (a minimum age is checked against it). The date is
 * written out in words (`writtenDate`). Shown in place of the form's buttons; "Change" goes
 * back to the lists.
 */
export function DateOfBirthConfirm({
  value,
  busy,
  onConfirm,
  onBack,
}: {
  /** `YYYY-MM-DD`. */
  value: string;
  busy: boolean;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const t = useText();
  const written = writtenDate(value);

  return (
    <div
      aria-live="polite"
      className="rounded-[12px] border border-line bg-white/70 p-4"
      role="alertdialog"
    >
      <p className="text-[15px] font-semibold text-ink">
        {t("account.dobConfirmTitle")}
      </p>
      <p className="mt-1 text-[22px] font-bold tracking-[-0.01em] text-ink">
        {written}
      </p>
      <p className="mt-2 text-[13px] leading-[1.5] text-muted">
        {t("account.dobConfirmText")}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          className={PRIMARY}
          disabled={busy}
          type="button"
          onClick={onConfirm}
        >
          {busy ? <Spinner /> : t("account.dobConfirmYes")}
        </button>
        <button
          className="text-[13px] text-muted underline-offset-2 hover:underline"
          disabled={busy}
          type="button"
          onClick={onBack}
        >
          {t("account.dobConfirmBack")}
        </button>
      </div>
    </div>
  );
}
