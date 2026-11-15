"use client";

import { BagIcon } from "./Icons";
import { useText } from "./ContentProvider";

/**
 * The bag with nothing in it — a way back rather than an apology: the drawer covers the shop,
 * so the useful thing to offer is the button that gets out of the way.
 */
export function CartEmpty({ onBrowse }: { onBrowse: () => void }) {
  const t = useText();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 border-t border-line px-8 text-center">
      <span className="grid h-16 w-16 place-items-center text-ink">
        <BagIcon size={44} strokeWidth={1.2} />
      </span>
      <p className="text-[16px] font-semibold text-ink">{t("cart.emptyTitle")}</p>
      <p className="max-w-[280px] text-[13.5px] leading-relaxed text-muted">
        {t("cart.emptyText")}
      </p>
      <button
        className="mt-3 h-11 rounded-full bg-ink px-6 text-[13.5px] font-medium text-white transition hover:bg-black"
        type="button"
        onClick={onBrowse}
      >
        {t("action.browseShop")}
      </button>
    </div>
  );
}
