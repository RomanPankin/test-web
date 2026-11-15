"use client";

import type { PublicCustomerOrderDetail } from "@estoreclub/api";

import { useText } from "../ContentProvider";
import { OrderProgress } from "../account/cabinet/OrderProgress";
import { cents, orderMoment } from "../account/cabinet/format";

import { TrackShipment } from "./TrackShipment";

/**
 * The order found: where it stands (the shop's own step while it is open, with the step bar
 * where the shop works through steps), its numbers, where it is going, the parcel once a
 * carrier has it, and what was in it.
 */
export function TrackResult({ order }: { order: PublicCustomerOrderDetail }) {
  const t = useText();
  // The shop's word for the step while it is open; the outcome once it is not. A word is more
  // use than a blank where a shop has cleared the text.
  const status =
    order.status === "open"
      ? order.state || t("track.status.open")
      : t(`track.status.${order.status}`) || order.status;
  const rows: [string, string, boolean?][] = [
    [t("track.number"), `#${order.orderNumber}`, true],
    // The number that finds this order here again - for a shopper who came by the
    // confirmation link and wants to look later without it.
    ...(order.trackingCode
      ? [[t("track.code"), order.trackingCode, true] as [string, string, boolean]]
      : []),
    ...(order.deliveryNumber
      ? [[t("track.deliveryNumber"), order.deliveryNumber, true] as [string, string, boolean]]
      : []),
    [t("track.placed"), orderMoment(order.paidAt)],
    ...(order.deliveryStatus
      ? [
          [
            t("track.deliveryStatus"),
            t(`track.delivery.${order.deliveryStatus}`) || order.deliveryStatus,
          ] as [string, string],
        ]
      : []),
    ...(order.deliveryAddress
      ? [[t("track.address"), order.deliveryAddress] as [string, string]]
      : []),
  ];

  return (
    <section className="mt-8 rounded-[12px] border border-line bg-white p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
        {t("track.statusLabel")}
      </p>
      <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
        {status}
      </p>
      {order.status === "open" && !order.shipment ? (
        <p className="mt-1 text-[14px] text-muted">{t("track.paidNote")}</p>
      ) : null}

      {order.status === "open" && order.progress?.steps?.length ? (
        <div className="mt-6">
          <OrderProgress progress={order.progress} />
        </div>
      ) : null}

      <dl className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-[14.5px]">
        {rows.map(([label, value, mono]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd
              className={
                "break-words text-right text-ink " +
                (mono ? "font-mono text-[13px] tabular-nums" : "")
              }
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {order.shipment ? <TrackShipment shipment={order.shipment} /> : null}

      <ul className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-[14px] text-muted">
        {order.lines.map((line, index) => (
          <li key={index} className="flex justify-between gap-4">
            <span>
              {line.name}
              {/* The colour it was bought in - two of the same phone differ by it. */}
              {line.variantName ? ` · ${line.variantName}` : ""}
              {line.quantity > 1 ? ` × ${line.quantity}` : ""}
            </span>
            <span className="tabular-nums">{cents(line.totalCents)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between gap-4 border-t border-line pt-4 text-[14.5px]">
        {/* The bag's own word, not a second one: a shop that renames "Total" should not have to
            find it twice. */}
        <span className="text-muted">{t("cart.total")}</span>
        <span className="font-semibold tabular-nums text-ink">
          {cents(order.totalCents)}
        </span>
      </div>
    </section>
  );
}
