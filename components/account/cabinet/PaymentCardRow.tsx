"use client";

import type { PublicCustomerPaymentMethod } from "@estoreclub/api";

import { deleteCustomerPaymentMethod } from "@estoreclub/client";
import { useState } from "react";

import { useText } from "../../ContentProvider";

import { cardBrand } from "./cardBrand";
import { Icon } from "./Icon";

/** "Visa •••• 4242", when it expires, and Remove - pressed twice, as an address is. */
export function PaymentCardRow({
  card,
  onRemoved,
}: {
  card: PublicCustomerPaymentMethod;
  onRemoved: () => void;
}) {
  const t = useText();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteCustomerPaymentMethod({ paymentMethodId: card.id });
      onRemoved();
    } catch (failure) {
      setError(
        (failure instanceof Error && failure.message.trim()) ||
          t("account.failed"),
      );
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="flex min-w-0 gap-3 rounded-2xl bg-white py-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
        <Icon name="card" size={17} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[14px] font-medium leading-snug text-ink">
          {cardBrand(card.brand)}{" "}
          <span className="tabular-nums tracking-[0.04em]">
            •••• {card.last4}
          </span>
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          {t("account.cardExpires", {
            date: `${String(card.expMonth).padStart(2, "0")}/${String(card.expYear).slice(-2)}`,
          })}
        </p>
        {error ? (
          <p className="mt-1 text-[12.5px] text-brand">{error}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {/* Held by the server for a charge still to come: it stays until that is settled. */}
          {card.inUse ? (
            <span className="text-[12px] text-muted">
              {t("account.cardInUse")}
            </span>
          ) : (
            <span />
          )}
          {card.inUse ? null : (
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
          )}
        </div>
      </div>
    </li>
  );
}
