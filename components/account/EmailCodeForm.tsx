"use client";

import { requestSignInCode, verifySignInCode } from "@estoreclub/client";
import { useState } from "react";

import { setCustomer } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";

import { CodeInput } from "./CodeInput";
import { FIELD, PRIMARY } from "./styles";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sign in with an emailed code: the email, then the six digits. No separate sign-up — an email
 * the shop has not seen becomes a customer on the way through.
 */
export function EmailCodeForm({
  onError,
}: {
  onError: (message: string | null) => void;
}) {
  const t = useText();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const fail = (error: unknown) =>
    onError(
      error instanceof Error && error.message ? error.message : t("account.failed"),
    );

  const send = async () => {
    setBusy(true);
    onError(null);
    try {
      await requestSignInCode({ email: email.trim() });
      setSent(true);
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (typed = code) => {
    setBusy(true);
    onError(null);
    try {
      setCustomer(
        await verifySignInCode({ email: email.trim(), code: typed }),
        { afterSignIn: true },
      );
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void (sent ? verify() : send());
      }}
    >
      <label className="flex flex-col gap-1.5 text-[12.5px] text-ink">
        {t("account.email")}
        <input
          autoComplete="email"
          className={FIELD}
          disabled={sent}
          inputMode="email"
          placeholder={t("account.emailPlaceholder")}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {sent ? (
        <div className="flex flex-col gap-2 text-[12.5px] text-ink">
          <span>{t("account.code", { email: email.trim() })}</span>
          {/* The last digit sends it - no reaching for the button. */}
          <CodeInput
            disabled={busy}
            label={t("account.code", { email: email.trim() })}
            value={code}
            onChange={setCode}
            onComplete={(typed) => void verify(typed)}
          />
        </div>
      ) : null}
      <button
        className={PRIMARY}
        disabled={busy || (sent ? code.length !== 6 : !EMAIL.test(email.trim()))}
        type="submit"
      >
        {sent ? t("account.signIn") : t("account.sendCode")}
      </button>
      {sent ? (
        <button
          className="text-[12.5px] text-muted underline-offset-2 hover:underline"
          type="button"
          onClick={() => {
            setSent(false);
            setCode("");
            onError(null);
          }}
        >
          {t("account.changeEmail")}
        </button>
      ) : null}
    </form>
  );
}
