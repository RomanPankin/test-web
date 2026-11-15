"use client";

import type { PublicCustomerAddress } from "@estoreclub/api";

import { useEffect, useRef, useState } from "react";

import { useText } from "../../ContentProvider";
import { FIELD } from "../styles";

/**
 * An address to save - a new one, or `initial` changed: the address on one line and what the
 * courier needs on top of it (flat, floor, gate code). A new one is saved without a point on
 * the map - the checkout places it when it is first delivered to.
 */
export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: PublicCustomerAddress;
  onSave: (address: string, details: string) => Promise<void>;
  onCancel: () => void;
}) {
  const t = useText();
  const [address, setAddress] = useState(initial?.address ?? "");
  const [details, setDetails] = useState(initial?.details ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const first = useRef<HTMLInputElement>(null);

  // Opened by "Add address" or "Edit": the address is the next thing to type.
  useEffect(() => {
    first.current?.focus();
  }, []);

  const unchanged =
    !!initial &&
    address.trim() === initial.address &&
    details.trim() === (initial.details ?? "");

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await onSave(address, details);
      onCancel();
    } catch (failure) {
      setError(
        failure instanceof Error && failure.message
          ? failure.message
          : t("account.failed"),
      );
      setBusy(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <label className="flex flex-col gap-1.5 text-[12.5px] text-ink">
        {t("account.addressField")}
        <input
          ref={first}
          autoComplete="street-address"
          className={FIELD}
          maxLength={512}
          placeholder={t("account.addressPlaceholder")}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[12.5px] text-ink">
        {t("account.addressDetails")}
        <input
          className={FIELD}
          maxLength={256}
          placeholder={t("account.addressDetailsPlaceholder")}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
      </label>
      {error ? <p className="text-[12.5px] text-brand">{error}</p> : null}
      <div className="flex items-center justify-end gap-3">
        <button
          className="h-[38px] rounded-full px-4 text-[13.5px] font-medium text-muted transition hover:text-ink"
          type="button"
          onClick={onCancel}
        >
          {t("account.cancel")}
        </button>
        <button
          className="h-[38px] rounded-full bg-ink px-5 text-[13.5px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy || !address.trim() || unchanged}
          type="submit"
        >
          {t("account.saveAddress")}
        </button>
      </div>
    </form>
  );
}
