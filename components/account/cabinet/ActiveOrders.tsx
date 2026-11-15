"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";
import type { CabinetLocation } from "./types";

import { useText } from "../../ContentProvider";

import { ActiveOrderCard } from "./ActiveOrderCard";

/**
 * The orders still being made, on a warm tinted panel above the history — the first thing a
 * customer who just ordered is looking for. Not drawn when nothing is in progress.
 */
export function ActiveOrders({
  orders,
  details,
  locations,
}: {
  orders: PublicCustomerOrder[];
  details: Record<string, PublicCustomerOrderDetail>;
  locations: CabinetLocation[];
}) {
  const t = useText();

  if (orders.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-brand-tint/80 via-brand-tint/40 to-transparent px-5 pb-6 pt-6 sm:px-6">
      {/* The heading on the left, the way back to the shop on the right - something more to
          add while these are on their way. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
            {t("account.activeOrders")}
          </h2>
          <p className="mt-1 text-[13.5px] text-muted">
            {t("account.activeOrdersText")}
          </p>
        </div>
        <a
          className="inline-flex h-[40px] shrink-0 items-center rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition hover:bg-black"
          href="/shop"
        >
          {t("action.browseShop")}
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {orders.map((order) => (
          <ActiveOrderCard
            key={order.orderId}
            detail={details[order.orderId]}
            locations={locations}
            order={order}
          />
        ))}
      </div>
    </section>
  );
}
