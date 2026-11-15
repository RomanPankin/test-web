"use client";

import type { PublicCustomerPaymentMethod } from "@estoreclub/api";

import { getCustomerPaymentMethods } from "@estoreclub/client";
import { useEffect, useState } from "react";

import { useText } from "../../ContentProvider";

import { PaymentCardRow } from "./PaymentCardRow";

/**
 * The cards the customer saved paying here - kept by the payment provider, shown by brand, last
 * four and expiry - each removable. Nothing here can pay. Said only once there is a card to
 * show: the account has no empty box for it.
 *
 * Like the address book, one card under another in the column beside the orders on a wide
 * screen, two side by side below that.
 */
export function PaymentCards({ customerId }: { customerId: string }) {
  const t = useText();
  const [cards, setCards] = useState<PublicCustomerPaymentMethod[] | null>(
    null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;

    setCards(null);
    getCustomerPaymentMethods()
      .then((answer) => current && setCards(answer.data))
      .catch(() => current && setFailed(true));

    return () => {
      current = false;
    };
  }, [customerId]);

  if (failed || !cards || cards.length === 0) return null;

  return (
    <section className="rounded-[20px] bg-white/70 p-5 sm:p-6">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
        {t("account.cards")}
      </h2>
      <p className="mt-1 text-[13.5px] text-muted">{t("account.cardsText")}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {cards.map((card) => (
          <PaymentCardRow
            key={card.id}
            card={card}
            onRemoved={() =>
              setCards((before) =>
                (before ?? []).filter((each) => each.id !== card.id),
              )
            }
          />
        ))}
      </ul>
    </section>
  );
}
