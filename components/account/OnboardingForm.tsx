"use client";

import type { PublicCustomer } from "@estoreclub/api";

import { completeOnboarding } from "@estoreclub/client";
import { useState } from "react";

import { closeAccountDialog, setCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { TermsConsent } from "./TermsConsent";
import { DateOfBirthConfirm } from "./DateOfBirthConfirm";
import { DateOfBirthField } from "./DateOfBirthField";
import { Spinner } from "./Spinner";
import { FIELD, PRIMARY } from "./styles";

type Field = "name" | "phone" | "dateOfBirth";

const FIELDS: Field[] = ["name", "phone", "dateOfBirth"];

/**
 * The onboarding step: the details the shop requires that this customer has not given yet.
 *
 * Offered after a sign-in and from the account menu. "Later" closes it and the customer goes on
 * as they were, signed in - unless the shop counts them as signed out until the details are in
 * (`missingDetailsStop: "sign_in"`): then there is no "Later". The answer to a save says
 * whether anything is still missing, and the form stays open on exactly that.
 */
export function OnboardingForm({
  customer,
  pending = false,
}: {
  /**
   * Who is asked: their missing fields, and what they already gave. Before the account is read,
   * only the fields the render knew of (`SignInGate`).
   */
  customer: Pick<PublicCustomer, "missingFields" | "missingDetailsStop"> &
    Partial<Pick<PublicCustomer, "name" | "phone" | "dateOfBirth">>;
  /** Saved, and the page is loading again: the button keeps turning until it has. */
  pending?: boolean;
}) {
  const t = useText();
  // The ones still missing when the step opened, in the form's order - the server says which
  // (`missingFields`); fixed for the life of the form, so a field stays while it is filled in.
  const [fields] = useState(() =>
    FIELDS.filter((field) => customer.missingFields?.includes(field)),
  );
  // The shop's terms, when accepting them is still missing - a box after the details, ticked
  // by the customer, and sent with them (`acceptTerms`).
  const [asksTerms] = useState(
    () => customer.missingFields?.includes("terms") ?? false,
  );
  const [accepted, setAccepted] = useState(false);
  const [values, setValues] = useState<Record<Field, string>>({
    name: customer.name ?? "",
    phone: customer.phone ?? "",
    dateOfBirth: customer.dateOfBirth ?? "",
  });
  const [saving, setSaving] = useState(false);
  const busy = saving || pending;
  const [error, setError] = useState<string | null>(null);
  const ready =
    fields.every((field) => values[field].trim() !== "") &&
    (!asksTerms || accepted);
  // A date of birth is given once: "Is this date correct?" before it is sent.
  const [confirming, setConfirming] = useState(false);
  const asksDate = fields.includes("dateOfBirth");

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await completeOnboarding({
        ...Object.fromEntries(
          fields.map((field) => [field, values[field].trim()]),
        ),
        ...(asksTerms ? { acceptTerms: true } : {}),
      });

      setCustomer(saved);
      if (!saved.onboarded) setError(t("account.stillMissing"));
    } catch (failure) {
      // Back to the fields, where the reason is shown and the date can be put right.
      setConfirming(false);
      setError(
        failure instanceof Error && failure.message
          ? failure.message
          : t("account.failed"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (asksDate) setConfirming(true);
        else void save();
      }}
    >
      {fields.map((field) => (
        <label
          key={field}
          className="flex flex-col gap-1.5 text-[12.5px] text-ink"
        >
          <span>
            {t(`account.field.${field}`)}
            <span className="ml-0.5 text-brand">*</span>
          </span>
          {field === "dateOfBirth" ? (
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
      {asksTerms ? (
        <TermsConsent accepted={accepted} onChange={setAccepted} />
      ) : null}
      {error ? <p className="text-[13px] text-brand">{error}</p> : null}
      {confirming ? (
        <DateOfBirthConfirm
          busy={busy}
          value={values.dateOfBirth}
          onBack={() => setConfirming(false)}
          onConfirm={() => void save()}
        />
      ) : (
        <>
          <button className={PRIMARY} disabled={busy || !ready} type="submit">
            {busy ? <Spinner /> : t("account.saveDetails")}
          </button>
          {/* No "Later" where the details are the way in: skipped, the customer would be left
              signed out of a shop that shows itself to signed-in customers only. */}
          {customer.missingDetailsStop === "sign_in" ? null : (
            <button
              className="text-[13px] text-muted underline-offset-2 hover:underline"
              type="button"
              onClick={closeAccountDialog}
            >
              {t("account.later")}
            </button>
          )}
        </>
      )}
    </form>
  );
}
