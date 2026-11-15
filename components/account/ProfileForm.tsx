"use client";

import type { PublicCustomer } from "@estoreclub/api";

import { updateCustomerProfile } from "@estoreclub/client";
import { useState } from "react";

import { closeAccountDialog, setCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { DateOfBirthConfirm } from "./DateOfBirthConfirm";
import { DateOfBirthField } from "./DateOfBirthField";
import { FIELD, PRIMARY } from "./styles";
import { writtenDate } from "./writtenDate";

type Field = "name" | "phone" | "dateOfBirth";

const FIELDS: Field[] = ["name", "phone", "dateOfBirth"];

/**
 * The account page's "Edit profile": every detail the customer can change, whatever the shop
 * requires — the email stays, it is who they sign in as. A field cleared is saved as cleared.
 */
export function ProfileForm({ customer }: { customer: PublicCustomer }) {
  const t = useText();
  const [values, setValues] = useState<Record<Field, string>>({
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    dateOfBirth: customer.dateOfBirth ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Given once, kept for good (the server refuses a change): shown, not offered. A date
  // entered here for the first time is confirmed before it is sent.
  const dateGiven = Boolean(customer.dateOfBirth);
  const [confirming, setConfirming] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const saved = await updateCustomerProfile(
        Object.fromEntries(
          FIELDS.map((field) => [field, values[field].trim() || null]),
        ),
      );

      setCustomer(saved);
      closeAccountDialog();
    } catch (failure) {
      setConfirming(false);
      setError(
        failure instanceof Error && failure.message
          ? failure.message
          : t("account.failed"),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!dateGiven && values.dateOfBirth) setConfirming(true);
        else void save();
      }}
    >
      <label className="flex flex-col gap-1.5 text-[12.5px] text-ink">
        {t("account.email")}
        <input disabled className={FIELD} value={customer.email} />
      </label>
      {FIELDS.map((field) => (
        <label
          key={field}
          className="flex flex-col gap-1.5 text-[12.5px] text-ink"
        >
          {t(`account.field.${field}`)}
          {field === "dateOfBirth" && dateGiven ? (
            <>
              <input
                disabled
                className={FIELD}
                value={writtenDate(customer.dateOfBirth ?? "")}
              />
              <span className="text-[11.5px] text-muted">
                {t("account.dobLocked")}
              </span>
            </>
          ) : field === "dateOfBirth" ? (
            <DateOfBirthField
              value={values[field]}
              onChange={(next) =>
                setValues((current) => ({ ...current, [field]: next }))
              }
            />
          ) : (
            <input
              autoComplete={field === "name" ? "name" : "tel"}
              className={FIELD}
              inputMode={field === "phone" ? "tel" : undefined}
              type="text"
              value={values[field]}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
            />
          )}
        </label>
      ))}
      {error ? <p className="text-[13px] text-brand">{error}</p> : null}
      {confirming ? (
        <DateOfBirthConfirm
          busy={busy}
          value={values.dateOfBirth}
          onBack={() => setConfirming(false)}
          onConfirm={() => void save()}
        />
      ) : (
        <button className={PRIMARY} disabled={busy} type="submit">
          {t("account.saveDetails")}
        </button>
      )}
    </form>
  );
}
