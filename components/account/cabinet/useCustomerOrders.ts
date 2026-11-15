"use client";

import type {
  PublicCustomerOrder,
  PublicCustomerOrderDetail,
} from "@estoreclub/api";

import { getCustomerOrder, getCustomerOrders } from "@estoreclub/client";
import { useCallback, useEffect, useState } from "react";

const PAGE = 10;
/** How often an order still being made is read again — the tracker moves on its own. */
const POLL_MS = 30_000;

export interface CustomerOrders {
  /** Null until the first page answers. */
  orders: PublicCustomerOrder[] | null;
  hasNext: boolean;
  failed: boolean;
  more: () => void;
  /** Each order's lines and totals, once read. */
  details: Record<string, PublicCustomerOrderDetail>;
  /** Read an order's lines, if they are not read yet. */
  loadDetail: (orderId: string) => void;
}

/**
 * The signed-in customer's orders, newest first, a page at a time — and the lines of the ones
 * the page opens. Open orders are read in full straight away (their ready-by time is in the
 * detail), and the first page is read again every half minute while any order is still open.
 */
export function useCustomerOrders(customerId: string | null): CustomerOrders {
  const [orders, setOrders] = useState<PublicCustomerOrder[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [failed, setFailed] = useState(false);
  const [details, setDetails] = useState<
    Record<string, PublicCustomerOrderDetail>
  >({});

  useEffect(() => {
    if (!customerId) {
      setOrders(null);

      return;
    }
    let current = true;

    getCustomerOrders({ page, limit: PAGE })
      .then((answer) => {
        if (!current) return;
        setOrders((before) =>
          page === 1 ? answer.data : [...(before ?? []), ...answer.data],
        );
        setHasNext(answer.pagination.hasNext);
      })
      .catch(() => current && setFailed(true));

    return () => {
      current = false;
    };
  }, [customerId, page]);

  const fetchDetail = useCallback((orderId: string) => {
    getCustomerOrder({ orderId })
      .then((detail) => setDetails((all) => ({ ...all, [orderId]: detail })))
      .catch(() => setFailed(true));
  }, []);

  const loadDetail = useCallback(
    (orderId: string) => {
      if (!details[orderId]) fetchDetail(orderId);
    },
    [details, fetchDetail],
  );

  const openIds = (orders ?? [])
    .filter((order) => order.status === "open")
    .map((order) => order.orderId)
    .join(",");

  // Open orders: their detail now, and again on every poll — the ready-by time can move.
  useEffect(() => {
    if (!openIds) return;
    const ids = openIds.split(",");

    ids.forEach(fetchDetail);
    const timer = window.setInterval(() => {
      getCustomerOrders({ page: 1, limit: PAGE })
        .then((answer) =>
          setOrders((before) => {
            const fresh = new Map(
              answer.data.map((order) => [order.orderId, order]),
            );

            return (before ?? []).map(
              (order) => fresh.get(order.orderId) ?? order,
            );
          }),
        )
        .catch(() => undefined);
      ids.forEach(fetchDetail);
    }, POLL_MS);

    return () => window.clearInterval(timer);
  }, [openIds, fetchDetail]);

  return {
    orders,
    hasNext,
    failed,
    more: () => setPage((n) => n + 1),
    details,
    loadDetail,
  };
}
