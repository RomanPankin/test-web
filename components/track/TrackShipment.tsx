"use client";

import type { PublicCustomerOrderShipment } from "@estoreclub/api";

import { useText } from "../ContentProvider";
import { shortDay } from "../account/cabinet/format";

/**
 * The parcel, once the shop has handed it to a carrier: who has it, its tracking number, the day
 * it left, and the carrier's own tracking page where the shop gave one.
 */
export function TrackShipment({
  shipment,
}: {
  shipment: PublicCustomerOrderShipment;
}) {
  const t = useText();

  return (
    <div className="mt-4 rounded-[12px] bg-tile p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
        {t("track.shipment")}
      </p>
      <dl className="mt-2.5 flex flex-col gap-1.5 text-[14px]">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t("track.carrier")}</dt>
          <dd className="text-right text-ink">{shipment.carrier}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-muted">{t("track.trackingNumber")}</dt>
          <dd className="break-all text-right font-mono text-[13px] text-ink">
            {shipment.trackingNumber}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t("track.shippedAt")}</dt>
          <dd className="text-right text-ink">{shortDay(shipment.shippedAt)}</dd>
        </div>
      </dl>
      {shipment.trackingUrl ? (
        <a
          className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-white transition hover:bg-black"
          href={shipment.trackingUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("track.trackParcel")}
        </a>
      ) : null}
    </div>
  );
}
