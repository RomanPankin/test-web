"use client";

import type { RuleDeal } from "@estoreclub/storefront";

import { money } from "@estoreclub/storefront";

import { useText } from "./ContentProvider";
import { DealPill } from "./DealPill";
import { SaveBadge } from "./SaveBadge";

/**
 * A product's deal, as one pill: "Save 10%" for a rule that takes something off each unit, or
 * "Buy 2 get 1 free" / "3 for $20" for a group deal, which saves nothing on one unit and so has
 * no struck-through price to show beside it.
 */
export function DealBadge({
  deal,
  className = "",
}: {
  deal: RuleDeal;
  className?: string;
}) {
  const t = useText();

  if (deal.discount) {
    return (
      <SaveBadge
        className={className}
        discount={deal.discount}
        title={deal.name}
      />
    );
  }

  const group = deal.group;

  if (!group) return null;

  const text =
    group.kind === "bundle_price"
      ? t("deal.bundle", { count: group.count, price: money(group.price) })
      : group.price === 0
        ? t("deal.buyGetFree", { buy: group.buy, get: group.get })
        : t("deal.buyGet", {
            buy: group.buy,
            get: group.get,
            price: money(group.price),
          });

  return (
    <DealPill className={className} title={deal.name}>
      {text}
    </DealPill>
  );
}
