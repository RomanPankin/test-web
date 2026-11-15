import type { ReactNode } from "react";

/**
 * The account page's chip tones. One word each, so a status maps to a tone and not to a
 * colour: completed and seated are `good`, cancelled and missed are always `bad`.
 */
const TONES = {
  brand: "bg-brand-tint text-brand",
  good: "bg-[#e8f3ec] text-[#1d6b3c]",
  bad: "bg-[#fde7e3] text-[#c8321b]",
  wait: "bg-[#fdf1d8] text-[#9a6408]",
  calm: "bg-page text-muted",
  ink: "bg-[#eceef1] text-ink",
} as const;

export type ChipTone = keyof typeof TONES;

/** A small rounded label — a status, or what kind of order it was. */
export function Chip({
  tone,
  children,
}: {
  tone: ChipTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-[26px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12.5px] font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
