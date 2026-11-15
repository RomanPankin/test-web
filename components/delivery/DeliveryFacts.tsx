import type { ComponentType } from "react";

/** One fact: what it is ("Delivery fee") and what it comes to ("$9.90"). */
export interface DeliveryFact {
  label: string;
  value: string;
  Icon: ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
}

/**
 * The four things asked before an order is placed - where, what it costs, from when it is
 * free, how long it takes - as tiles on the cards' grey, before any prose. Somebody who opened
 * the delivery page for one figure finds it without reading a paragraph.
 *
 * Two by two on a phone, four across from `sm`. A fact the shop cleared (an empty value) is
 * left out rather than drawn as a label over nothing.
 */
export function DeliveryFacts({ facts }: { facts: DeliveryFact[] }) {
  const shown = facts.filter((fact) => fact.value);

  if (shown.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {shown.map(({ label, value, Icon }) => (
        <li key={label} className="rounded-[10px] bg-tile px-4 pb-4 pt-3.5">
          <Icon className="text-ink" size={26} strokeWidth={1.4} />
          <p className="mt-3 text-[12px] text-muted">{label}</p>
          <p className="mt-0.5 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
            {value}
          </p>
        </li>
      ))}
    </ul>
  );
}
