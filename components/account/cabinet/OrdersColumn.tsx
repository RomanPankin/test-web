"use client";

import type { CabinetLocation } from "./types";

import { useText } from "../../ContentProvider";

import { ActiveOrders } from "./ActiveOrders";
import { PastOrders } from "./PastOrders";
import { useCustomerOrders } from "./useCustomerOrders";

/**
 * The orders half of the page, on one card: what is being made now on its warm panel, then
 * everything finished below it.
 */
export function OrdersColumn({
  customerId,
  locations,
}: {
  customerId: string;
  locations: CabinetLocation[];
}) {
  const t = useText();
  const { orders, hasNext, failed, more, details, loadDetail } =
    useCustomerOrders(customerId);

  if (failed && !orders) {
    return (
      <p className="rounded-[20px] border border-line bg-white p-6 text-[14px] text-brand">
        {t("account.loadFailed")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] bg-white/70">
      {!orders ? (
        <div className="flex flex-col gap-4 p-6">
          {[180, 64, 64, 64].map((height, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl bg-soft"
              style={{ height }}
            />
          ))}
        </div>
      ) : (
        <>
          <ActiveOrders
            details={details}
            locations={locations}
            orders={orders.filter((order) => order.status === "open")}
          />
          <PastOrders
            details={details}
            hasNext={hasNext}
            locations={locations}
            orders={orders.filter((order) => order.status !== "open")}
            showBrowse={!orders.some((order) => order.status === "open")}
            onMore={more}
            onOpen={loadDetail}
          />
        </>
      )}
    </div>
  );
}
