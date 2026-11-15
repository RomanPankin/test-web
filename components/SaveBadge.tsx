"use client";

import type { Discount } from "@estoreclub/storefront";

import { money } from "@estoreclub/storefront";

import { useText } from "./ContentProvider";
import { DealPill } from "./DealPill";

/** "Save 10%" - a deal that takes something off every unit, over the top-left of a photo. */
export function SaveBadge({
  discount,
  title,
  className = "",
}: {
  discount: Discount;
  /** The rule's own name, for a tooltip and a screen reader. */
  title?: string;
  className?: string;
}) {
  const t = useText();

  return (
    <DealPill className={className} title={title}>
      {t("deal.save", {
        amount: discount.isPercent
          ? discount.amount + "%"
          : money(discount.amount),
      })}
    </DealPill>
  );
}
