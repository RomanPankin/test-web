"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";
import type { CabinetLocation } from "./types";

import { useEffect, useState } from "react";

import { useText } from "../../ContentProvider";

import { PastOrderRow } from "./PastOrderRow";

/**
 * The finished orders, newest first, as one list on a white card - each opens and closes its
 * receipt in place on its own, several open at once if wanted (to compare two), all closed to
 * begin with.
 */
export function PastOrders({
  orders,
  details,
  locations,
  hasNext,
  showBrowse = true,
  onMore,
  onOpen,
}: {
  orders: PublicCustomerOrder[];
  details: Record<string, PublicCustomerOrderDetail>;
  locations: CabinetLocation[];
  hasNext: boolean;
  /** The way to the shop under "no past orders" - off while active orders carry it. */
  showBrowse?: boolean;
  onMore: () => void;
  /** An order was opened — read its lines. */
  onOpen: (orderId: string) => void;
}) {
  const t = useText();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const opened = [...openIds].join();

  // Each one opened reads its lines - once each (`onOpen` skips what it has); the receipt waits
  // for them.
  useEffect(() => {
    for (const id of opened.split(",")) if (id) onOpen(id);
  }, [opened, onOpen]);

  const toggle = (orderId: string) =>
    setOpenIds((before) => {
      const next = new Set(before);

      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);

      return next;
    });

  return (
    <section className="px-5 pb-6 pt-7 sm:px-6">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
        {t("account.pastOrders")}
      </h2>
      <p className="mt-1 text-[13.5px] text-muted">
        {t("account.pastOrdersText")}
      </p>

      {orders.length === 0 ? (
        <div className="mt-5">
          <p className="text-[14px] text-muted">{t("account.noPastOrders")}</p>
          {showBrowse ? (
            <a
              className="mt-4 inline-flex h-[40px] items-center rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition hover:bg-black"
              href="/shop"
            >
              {t("action.browseShop")}
            </a>
          ) : null}
        </div>
      ) : (
        <ul className="mt-5 overflow-hidden rounded-2xl border border-line bg-[#fdfcfa]">
          {orders.map((order) => (
            <PastOrderRow
              key={order.orderId}
              detail={details[order.orderId]}
              locations={locations}
              open={openIds.has(order.orderId)}
              order={order}
              onToggle={() => toggle(order.orderId)}
            />
          ))}
        </ul>
      )}

      {hasNext ? (
        <div className="mt-5 flex justify-center">
          <button
            className="rounded-full border border-line bg-white px-6 py-2.5 text-[14px] font-medium text-ink transition hover:border-brand-soft"
            type="button"
            onClick={onMore}
          >
            {t("account.more")}
          </button>
        </div>
      ) : null}
    </section>
  );
}
