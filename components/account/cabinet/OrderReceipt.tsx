"use client";

import type { PublicCustomerOrderDetail } from "@estoreclub/api";

import { productImage } from "@estoreclub/storefront/web";
import { useText } from "../../ContentProvider";

import { cents } from "./format";
import { Icon } from "./Icon";
import { Thumb } from "./OrderThumbs";

/**
 * What was in an order and what it came to: each line with its products, the discounts the lines
 * took as one tinted row, then subtotal, discount and tax, the total, any refund, and how it
 * was paid.
 *
 * A line's size and extras are not spelled out: the server sends them as the site's own
 * encoded choice, and the words for it live in the shop's lists, which this page does
 * not load. The variant's name ("Large") is enough to recognise it by.
 */
export function OrderReceipt({
  detail,
}: {
  detail: PublicCustomerOrderDetail | undefined;
}) {
  const t = useText();

  if (!detail)
    return <div className="mt-5 h-24 animate-pulse rounded-xl bg-soft" />;

  const lineDiscount = detail.lines.reduce(
    (sum, line) => sum + line.discountCents,
    0,
  );

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {detail.lines.map((line, index) => (
          <li
            key={index}
            className="flex items-center gap-4 border-b border-line py-3.5 text-[14px] text-ink"
          >
            <Thumb
              photo={productImage(line.productId ?? undefined) || undefined}
              size={40}
            />
            <span className="min-w-0 flex-1">
              {line.quantity} × {line.name}
              {line.variantName ? `, ${line.variantName}` : ""}
            </span>
            <span className="tabular-nums">
              {cents(line.unitPriceCents * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {lineDiscount ? (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-tint/70 px-5 py-2.5 text-[13.5px] text-brand">
          <span>{t("account.lineDiscount")}</span>
          <span className="tabular-nums">−{cents(lineDiscount)}</span>
        </div>
      ) : null}

      <dl className="mt-4 flex flex-col gap-1.5 text-[13.5px] text-muted">
        <Row label={t("cart.subtotal")} value={cents(detail.subtotalCents)} />
        {detail.discountCents ? (
          <Row
            brand
            label={t("account.discount")}
            value={`−${cents(detail.discountCents)}`}
          />
        ) : null}
        {detail.taxCents ? (
          <Row
            label={
              detail.taxInclusive
                ? t("account.taxIncluded", { tax: detail.taxName })
                : detail.taxName
            }
            value={cents(detail.taxCents)}
          />
        ) : null}
      </dl>

      <div className="mt-4 flex items-center justify-between text-[16px] font-bold text-ink">
        <span>{t("cart.total")}</span>
        <span className="tabular-nums">{cents(detail.totalCents)}</span>
      </div>
      {detail.refundedCents ? (
        <dl className="mt-1.5 text-[13.5px] text-muted">
          <Row
            brand
            label={t("account.refunded")}
            value={`−${cents(detail.refundedCents)}`}
          />
        </dl>
      ) : null}

      <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        <Icon
          name={detail.paymentMethod === "in_store" ? "store" : "card"}
          size={16}
        />
        {t(
          detail.paymentMethod === "in_store"
            ? "account.paidInStore"
            : "account.paidByCard",
        )}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  brand = false,
}: {
  label: string;
  value: string;
  brand?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className={"tabular-nums " + (brand ? "text-brand" : "text-ink")}>
        {value}
      </dd>
    </div>
  );
}
