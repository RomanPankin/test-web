"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";
import type { CabinetLocation } from "./types";

import { useState } from "react";

import { getCustomerOrder } from "@estoreclub/client";

import { useText } from "../../ContentProvider";

import { Chip } from "./Chip";
import { Collapse } from "./Collapse";
import { DeliveryDetails } from "./DeliveryDetails";
import { cents, orderMoment, placeLine } from "./format";
import { Icon } from "./Icon";
import { OrderReceipt } from "./OrderReceipt";
import { OrderThumbs } from "./OrderThumbs";
import { OrderTypeChip } from "./OrderTypeChip";
import { reorder } from "./reorder";

/**
 * One finished order: its products, number and time; how it was had and where; its count and
 * total (and any refund); how it ended; "Reorder"; and a chevron that folds open where it was
 * delivered and its receipt.
 */
export function PastOrderRow({
  order,
  detail,
  open,
  locations,
  onToggle,
}: {
  order: PublicCustomerOrder;
  detail: PublicCustomerOrderDetail | undefined;
  open: boolean;
  locations: CabinetLocation[];
  onToggle: () => void;
}) {
  const t = useText();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  // A delivery went to the customer's address, not the shop's warehouse - see `ActiveOrderCard`.
  const place =
    order.orderType === "delivery"
      ? (order.deliveryAddress ?? null)
      : placeLine(locations, { name: order.locationName });

  const again = async () => {
    setBusy(true);
    setNote(null);
    try {
      const sent = await reorder(
        detail ?? (await getCustomerOrder({ orderId: order.orderId })),
      );

      if (!sent) setNote(t("account.reorderNothing"));
    } catch {
      setNote(t("account.failed"));
    } finally {
      setBusy(false);
    }
  };

  // The type column never narrower than its chip ("Home delivery" does not wrap): squeezed,
  // it ran under the count and total beside it.
  return (
    <li
      className={
        "border-b border-line last:border-b-0 " + (open ? "bg-white" : "")
      }
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-4 md:grid-cols-[auto_minmax(132px,auto)_minmax(max-content,1fr)_auto_auto_auto_24px] md:gap-x-5">
        <span className="col-start-1 row-start-1 md:col-start-auto md:row-start-auto">
          <OrderThumbs max={1} productIds={order.productIds} size={44} />
        </span>

        <div className="col-start-2 row-start-1 min-w-0 md:col-start-auto md:row-start-auto">
          <p className="text-[14.5px] font-bold tabular-nums text-ink">
            #{order.orderNumber}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-[12.5px] text-muted">
            {orderMoment(order.paidAt)}
          </p>
        </div>

        <div className="col-span-2 col-start-2 row-start-2 flex min-w-0 flex-col items-start gap-1 md:col-span-1 md:col-start-auto md:row-start-auto">
          <span className="flex flex-wrap items-center gap-2">
            <OrderTypeChip orderType={order.orderType} />
            {/* On a phone the count, total and ending have no columns of their own. */}
            <span className="md:hidden">
              <Chip tone={order.status === "cancelled" ? "bad" : "good"}>
                {cents(order.totalCents)}
              </Chip>
            </span>
          </span>
          {place ? (
            <span className="flex max-w-full items-center gap-1 truncate text-[12.5px] text-muted">
              <Icon name="pin" size={13} />
              <span className="truncate">{place}</span>
            </span>
          ) : null}
        </div>

        <div className="hidden text-[12.5px] md:block">
          <p className="text-muted">
            {t(order.itemCount === 1 ? "cart.itemsOne" : "cart.itemsOther", {
              count: order.itemCount,
            })}
          </p>
          <p className="mt-0.5 text-[14px] font-semibold tabular-nums text-ink">
            {cents(order.totalCents)}
          </p>
          {order.refundedCents ? (
            <p className="whitespace-nowrap text-[12px] text-brand">
              {t("account.refundedAmount", {
                amount: cents(order.refundedCents),
              })}
            </p>
          ) : null}
        </div>

        <div className="hidden md:block">
          <Chip tone={order.status === "cancelled" ? "bad" : "good"}>
            {t(
              order.status === "cancelled"
                ? "track.status.cancelled"
                : "account.orderStatus.completed",
            )}
          </Chip>
        </div>

        <div className="col-start-3 row-start-1 flex items-center gap-2 md:contents">
          <button
            className="inline-flex h-[32px] items-center rounded-full border border-line bg-white px-4 text-[12.5px] font-semibold text-brand transition hover:border-brand-soft hover:bg-brand-tint/40 disabled:opacity-50"
            disabled={busy}
            type="button"
            onClick={() => void again()}
          >
            {t("account.reorder")}
          </button>
          <button
            aria-expanded={open}
            aria-label={t("account.orderDetails")}
            className="grid h-6 w-6 place-items-center rounded-full text-muted transition hover:bg-soft hover:text-ink"
            type="button"
            onClick={onToggle}
          >
            <Icon
              className={"transition-transform " + (open ? "rotate-180" : "")}
              name="chevronDown"
              size={18}
            />
          </button>
        </div>
      </div>

      {note ? (
        <p className="px-5 pb-3 text-[12.5px] text-brand">{note}</p>
      ) : null}

      <Collapse open={open}>
        <div className="px-5 pb-5">
          <DeliveryDetails detail={detail} order={order} />
          <OrderReceipt detail={detail} />
        </div>
      </Collapse>
    </li>
  );
}
