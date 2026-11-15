import type { TextOf } from "../../lib/content/types";

import { FRAME } from "../../lib/layout";
import { LockIcon, ShieldCheckIcon, TradeInIcon, TruckIcon } from "../Icons";

/** The site's promises, `feature.1…4` in its content, and their icons - the product page lists the same. */
export const FEATURE_ICONS = [
  TruckIcon,
  ShieldCheckIcon,
  TradeInIcon,
  LockIcon,
];
/** Which of them is the warranty: a product stating its own months says that instead. */
export const WARRANTY_FEATURE = 1;

/**
 * The promises the shop has written (`feature.N.title` / `.text` in "Site texts"), each with
 * its icon and place - a pair it has not written is left out. None at all: no row.
 */
export function featuresOf(t: TextOf) {
  return FEATURE_ICONS.map((Icon, index) => ({
    Icon,
    index,
    title: t(`feature.${index + 1}.title`),
    text: t(`feature.${index + 1}.text`),
  })).filter((feature) => feature.title || feature.text);
}

/**
 * Four promises under a hairline, in columns divided by hairlines of their own: an outline icon,
 * a title and a line each. Two by two on a phone.
 */
export function Features({ t }: { t: TextOf }) {
  const features = featuresOf(t);

  if (features.length === 0) return null;

  return (
    <section className={FRAME + " mt-[32px]"}>
      <ul className="grid grid-cols-2 gap-y-8 border-t border-[#eef0f3] pt-8 lg:grid-cols-4 lg:gap-y-0 lg:pt-[29px]">
        {features.map(({ Icon, index, title, text }) => (
          <li
            key={index}
            className="flex gap-3 px-2 lg:justify-center lg:gap-[22px] lg:border-l lg:border-[#eef0f3] lg:px-0 lg:first:border-l-0"
          >
            <Icon
              className="-mt-1 shrink-0 text-ink"
              size={40}
              strokeWidth={1.2}
            />
            <div className="min-w-0 lg:w-[152px]">
              <p className="text-[13.5px] font-medium tracking-[-0.01em] text-ink lg:text-[14px]">
                {title}
              </p>
              <p className="mt-[8px] text-[12px] leading-[21px] text-[#75787f] lg:text-[12.5px]">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
