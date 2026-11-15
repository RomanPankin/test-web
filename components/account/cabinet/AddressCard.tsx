"use client";

import type { PublicCustomerAddress } from "@estoreclub/api";

import { useState } from "react";

import { useText } from "../../ContentProvider";

import { shortDay } from "./format";
import { Icon } from "./Icon";

/**
 * One saved address: the address, the flat or gate details under it, when it was last
 * delivered to, "Edit" - and "Remove", which asks once more before it forgets it.
 */
export function AddressCard({
  address,
  onEdit,
  onRemove,
}: {
  address: PublicCustomerAddress;
  onEdit: () => void;
  onRemove: () => Promise<void>;
}) {
  const t = useText();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await onRemove();
    } catch (failure) {
      setError(
        failure instanceof Error && failure.message
          ? failure.message
          : t("account.failed"),
      );
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <li className="flex min-w-0 gap-3 rounded-2xl bg-white py-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
        <Icon name="pin" size={17} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="break-words text-[14px] font-medium leading-snug text-ink">
          {address.address}
        </p>
        {address.details ? (
          <p className="mt-0.5 break-words text-[13px] text-muted">
            {address.details}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-3">
          <span className="text-[12px] text-muted">
            {t("account.addressUsed", { date: shortDay(address.lastUsedAt) })}
          </span>
          <div className="flex items-center gap-3">
            {confirming ? null : (
              <button
                className="text-[12.5px] font-medium text-ink underline underline-offset-4 transition hover:text-brand"
                disabled={busy}
                type="button"
                onClick={onEdit}
              >
                {t("account.editAddress")}
              </button>
            )}
            {/* Pressed twice: the first turns it into the question, a blur takes that back. */}
            <button
              className={
                "text-[12.5px] font-medium transition disabled:opacity-50 " +
                (confirming
                  ? "rounded-full bg-ink px-3 py-1 text-white"
                  : "text-muted underline underline-offset-4 hover:text-ink")
              }
              disabled={busy}
              type="button"
              onBlur={() => setConfirming(false)}
              onClick={() => (confirming ? void remove() : setConfirming(true))}
            >
              {confirming ? t("account.removeConfirm") : t("account.remove")}
            </button>
          </div>
        </div>
        {error ? (
          <p className="mt-2 text-[12.5px] text-brand">{error}</p>
        ) : null}
      </div>
    </li>
  );
}
