"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";

import { useText } from "../../ContentProvider";

/**
 * Where a delivered order is going (or went) and who takes it: the recipient's name and the
 * number the courier calls, and the address with its flat or gate details. Nothing for an order
 * that was not delivered - the store has no counter, but an order keyed in by hand may have none.
 * Once a carrier has the parcel, its carrier and tracking number, linked to the carrier's page.
 * First, the shop's own tracking number (`K7P-QX9-M2T`) - what the order's emails carry and
 * the tracking page asks for - while the shop lets guests track.
 */
export function DeliveryDetails({
  order,
  detail,
}: {
  order: PublicCustomerOrder;
  detail: PublicCustomerOrderDetail | undefined;
}) {
  const t = useText();

  if (order.orderType !== "delivery" || !order.deliveryAddress) return null;

  const rows: [string, string, string?][] = [
    ...(detail?.recipientName
      ? [[t("account.recipient"), detail.recipientName] as [string, string]]
      : []),
    ...(detail?.recipientPhone
      ? [
          [
            t("account.recipientPhone"),
            detail.recipientPhone,
            `tel:${detail.recipientPhone.replace(/\s+/g, "")}`,
          ] as [string, string, string],
        ]
      : []),
    [t("account.deliveryAddress"), order.deliveryAddress],
    ...(order.shipment
      ? [
          [
            t("account.shipment"),
            `${order.shipment.carrier} · ${order.shipment.trackingNumber}`,
            order.shipment.trackingUrl ?? undefined,
          ] as [string, string, string?],
        ]
      : []),
  ];

  return (
    <section className="mt-5 rounded-xl bg-soft px-4 py-3.5">
      <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
        {t("account.deliveryDetails")}
      </h4>
      <dl className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[13.5px]">
        {order.trackingCode ? (
          <div className="contents">
            <dt className="text-muted">{t("track.code")}</dt>
            <dd className="font-mono font-bold tracking-wide text-ink">
              {order.trackingCode}
            </dd>
          </div>
        ) : null}
        {rows.map(([label, value, href]) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="break-words text-ink">
              {href ? (
                <a
                  className="underline-offset-4 hover:underline"
                  href={href}
                  {...(href.startsWith("http")
                    ? { rel: "noopener noreferrer", target: "_blank" }
                    : {})}
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
