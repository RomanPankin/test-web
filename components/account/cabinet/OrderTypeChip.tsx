"use client";

import { useText } from "../../ContentProvider";

import { Chip } from "./Chip";
import { Icon } from "./Icon";

/** Taken away (collected or delivered) or eaten here — the two the page tells apart. */
export const isReservation = (orderType: string | null) =>
  orderType === "reservation";

/** The top edge of an order's tile: the brand for a takeaway, ink for a table. */
export const typeEdge = (orderType: string | null) =>
  isReservation(orderType) ? "border-t-ink" : "border-t-brand";

/** How the order was had — delivery, pickup or at a table — with its icon. */
export function OrderTypeChip({ orderType }: { orderType: string | null }) {
  const t = useText();

  if (
    orderType !== "delivery" &&
    orderType !== "pickup" &&
    orderType !== "reservation"
  ) {
    return null;
  }

  return (
    <Chip tone={isReservation(orderType) ? "ink" : "brand"}>
      <Icon name={orderType} size={14} />
      {t(`account.orderType.${orderType}`)}
    </Chip>
  );
}
