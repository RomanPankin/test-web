"use client";

import { useText } from "../ContentProvider";

const FIELD =
  "h-12 rounded-[10px] border border-line bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-brand";

/**
 * The delivery's tracking number (from the order's email) and the email the order was placed
 * with. A plain GET form to `/track`: the result's address carries both, so it can be bookmarked.
 */
export function TrackForm({ code, email }: { code: string; email: string }) {
  const t = useText();

  return (
    <form
      action="/track"
      className="flex flex-wrap items-end gap-3"
      method="get"
    >
      <label className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <span className="text-[13px] font-medium text-ink">
          {t("track.code")}
        </span>
        <input
          required
          autoCapitalize="characters"
          autoComplete="off"
          className={
            FIELD +
            " uppercase tracking-[0.08em] placeholder:normal-case placeholder:tracking-normal"
          }
          defaultValue={code}
          maxLength={13}
          name="code"
          placeholder={t("track.codePlaceholder")}
          spellCheck={false}
          type="text"
        />
      </label>

      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
        <span className="text-[13px] font-medium text-ink">
          {t("track.email")}
        </span>
        <input
          required
          autoComplete="email"
          className={FIELD}
          defaultValue={email}
          name="email"
          placeholder={t("track.emailPlaceholder")}
          type="email"
        />
      </label>

      <button
        className="h-12 rounded-full bg-ink px-7 text-[14.5px] font-medium text-white transition hover:bg-black"
        type="submit"
      >
        {t("track.button")}
      </button>
    </form>
  );
}
