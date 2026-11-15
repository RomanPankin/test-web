"use client";

import type { PublicCustomerOrderProgress } from "@estoreclub/api";

import { useText } from "../../ContentProvider";

import { Icon } from "./Icon";

/**
 * Where an open order has got to, as a row of dots on a line: the shop's own working steps,
 * between "Received" (it is paid for and in) and "Handed over" (the shop is done with it).
 *
 * Passed dots are filled with a tick, the one the order is at is a ring, the rest are grey; the
 * line is red as far as the order has come.
 */
export function OrderProgress({
  progress,
}: {
  progress: PublicCustomerOrderProgress | null;
}) {
  const t = useText();
  const steps = [
    t("account.step.received"),
    ...(progress?.steps ?? []),
    t("account.step.done"),
  ];
  // -1 (not picked up yet) is still "received"; past the shop's last step is "handed over".
  const at = Math.min(
    Math.max((progress?.current ?? -1) + 1, 0),
    steps.length - 1,
  );
  const filled = steps.length > 1 ? (at / (steps.length - 1)) * 100 : 0;

  return (
    <ol
      aria-label={t("account.progress")}
      className="relative grid"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {/* The line runs between the first dot's centre and the last's. */}
      <span
        aria-hidden
        className="absolute top-[9px] h-[2px] bg-line"
        style={{
          left: `calc(100% / ${steps.length * 2})`,
          right: `calc(100% / ${steps.length * 2})`,
        }}
      >
        <span
          className="block h-full bg-brand"
          style={{ width: `${filled}%` }}
        />
      </span>

      {steps.map((label, index) => {
        const done = index < at;
        const current = index === at;

        return (
          <li
            key={index}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            <span
              className={
                "grid h-5 w-5 place-items-center rounded-full " +
                (done
                  ? "bg-brand text-white"
                  : current
                    ? "border-[2.5px] border-brand bg-white"
                    : "border-2 border-[#d9d7d2] bg-white")
              }
            >
              {done ? <Icon name="check" size={12} /> : null}
            </span>
            <span
              className={
                "px-0.5 text-[10.5px] leading-[1.25] sm:px-1 sm:text-[12px] " +
                (current
                  ? "font-semibold text-ink"
                  : done
                    ? "text-ink"
                    : "text-muted")
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
