"use client";

import { dismissToast, useToasts } from "@estoreclub/storefront/web";

import { useText } from "./ContentProvider";

/**
 * Where toasts appear: bottom centre, above everything — the cart drawer and the product
 * dialog included, since a refused "Add" is raised while one of them is open.
 *
 * `role="status"` / `aria-live` on the stack, so a screen reader announces a toast as it
 * arrives without moving focus off what the shopper was doing.
 */
export function Toaster() {
  const t = useText();
  const toasts = useToasts();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
      role="status"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            (toast.leaving ? "toast-out " : "toast-in ") +
            "pointer-events-auto flex max-w-[440px] items-start gap-3 rounded-2xl bg-ink py-3 pl-4 pr-2 text-[13.5px] leading-snug text-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55)]"
          }
        >
          {toast.tone === "error" ? (
            <svg
              aria-hidden="true"
              className="mt-px shrink-0 text-brand-bright"
              fill="none"
              height="18"
              viewBox="0 0 24 24"
              width="18"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 7.5v5.5M12 16.5v.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          ) : null}
          <p className="min-w-0 flex-1 pt-px">{toast.message}</p>
          <button
            aria-label={t("common.close")}
            className="-my-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={() => dismissToast(toast.id)}
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="14"
              viewBox="0 0 18 18"
              width="14"
            >
              <path
                d="m4 4 10 10M14 4 4 14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
