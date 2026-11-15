"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";
import type { CabinetLocation } from "./types";

import { useState } from "react";

import { useText } from "../../ContentProvider";

import { Chip } from "./Chip";
import { Collapse } from "./Collapse";
import { DeliveryDetails } from "./DeliveryDetails";
import { cents, clockOrDay, placeLine } from "./format";
import { Icon } from "./Icon";
import { OrderProgress } from "./OrderProgress";
import { OrderReceipt } from "./OrderReceipt";
import { OrderThumbs } from "./OrderThumbs";
import { OrderTypeChip, typeEdge } from "./OrderTypeChip";

/**
 * An order still being made: its number, how it is had and the step it is at; when it will
 * arrive; the tracker; and on the right its products, its count and total, and the button that
 * folds open where it is going and what was in it.
 */
export function ActiveOrderCard({
  order,
  detail,
  locations,
}: {
  order: PublicCustomerOrder;
  detail: PublicCustomerOrderDetail | undefined;
  locations: CabinetLocation[];
}) {
  const t = useText();
  const [open, setOpen] = useState(false);
  // Where the order is going: a delivery's own address - the shop's warehouse means nothing to
  // the customer waiting at home. A pickup or a table is at the shop's location.
  const place =
    order.orderType === "delivery"
      ? (order.deliveryAddress ?? null)
      : placeLine(locations, { name: order.locationName });
  // A delivery: when it comes, where the shop tells it. Else a time chosen, or when it is ready.
  // With the day too when that is not today.
  const when = detail?.deliverBy
    ? t("account.deliverBy", { time: clockOrDay(detail.deliverBy) })
    : detail?.scheduledFor
      ? t("account.scheduledFor", { time: clockOrDay(detail.scheduledFor) })
      : detail?.readyBy
        ? t("account.readyBy", { time: clockOrDay(detail.readyBy) })
        : null;

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-t-[3px] border-line bg-white shadow-[0_6px_20px_-14px_rgba(17,18,22,0.25)] ${typeEdge(order.orderType)}`}
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-0 sm:p-6">
        <div className="min-w-0 flex-1 sm:pr-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="mr-1 text-[18px] font-bold tabular-nums text-ink">
              #{order.orderNumber}
            </h3>
            <OrderTypeChip orderType={order.orderType} />
            {order.state ? <Chip tone="brand">{order.state}</Chip> : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13.5px] text-ink">
            {when ? <span>{when}</span> : null}
            {place ? (
              <span className="flex items-center gap-1.5 text-muted">
                <Icon name="pin" size={15} />
                {place}
              </span>
            ) : null}
            {/* The number the order's emails carry and the tracking page asks for. */}
            {order.trackingCode ? (
              <span className="text-muted">
                {t("track.code")}:{" "}
                <span className="font-mono font-bold tracking-wide text-ink">
                  {order.trackingCode}
                </span>
              </span>
            ) : null}
          </div>

          {/* Only where the shop works an order through steps of its own: "Received" to
              "Handed over" alone says nothing the status chip does not. */}
          {order.progress?.steps?.length ? (
            <div className="mt-6">
              <OrderProgress progress={order.progress} />
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-4 border-line sm:w-[188px] sm:border-l sm:pl-6">
          <OrderThumbs productIds={order.productIds} />
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="text-ink">
              {t(order.itemCount === 1 ? "cart.itemsOne" : "cart.itemsOther", {
                count: order.itemCount,
              })}
            </span>
            <span className="text-[15px] font-bold tabular-nums text-ink">
              {cents(order.totalCents)}
            </span>
          </div>
          <button
            aria-expanded={open}
            className="mt-auto inline-flex h-[42px] items-center justify-center rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-black"
            type="button"
            onClick={() => setOpen((was) => !was)}
          >
            {open ? t("account.hideOrder") : t("account.showDetails")}
          </button>
        </div>
      </div>

      <Collapse open={open}>
        <div className="border-t border-line px-5 pb-5 sm:px-6">
          <DeliveryDetails detail={detail} order={order} />
          <OrderReceipt detail={detail} />
        </div>
      </Collapse>
    </article>
  );
}
