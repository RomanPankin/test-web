"use client";

import type { PublicPaymentDiscounts } from "@estoreclub/api";

import { currencyDigits, money } from "@estoreclub/storefront";

import { useText } from "./ContentProvider";

/**
 * "Pay online and save 10%" — the shop's money off for a way of paying, said in the basket.
 *
 * Said, not taken: the customer chooses how to pay on the payment page, which takes the discount
 * off there, so the basket's own total stays the one before it. Only for a way the shop takes
 * (the site info leaves the others null).
 */
export function PaymentSavings({
  discounts,
}: {
  discounts: PublicPaymentDiscounts | null;
}) {
  const t = useText();
  const amount = (discount: { kind: "amount" | "percent"; value: number }) =>
    discount.kind === "percent"
      ? `${discount.value}%`
      : money(discount.value / 10 ** currencyDigits());
  const lines = [
    // Money off only: a surcharge for paying this way is said on the payment page, not sold here.
    discounts?.online && discounts.online.value > 0
      ? t("cart.saveOnline", { amount: amount(discounts.online) })
      : null,
    // Money off only: a surcharge for paying this way is said on the payment page, not sold here.
    discounts?.inStore && discounts.inStore.value > 0
      ? t("cart.saveInStore", { amount: amount(discounts.inStore) })
      : null,
  ].filter((line): line is string => Boolean(line));

  if (lines.length === 0) return null;

  return (
    <ul className="mt-3 space-y-1 text-[13px] font-medium text-deal">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
