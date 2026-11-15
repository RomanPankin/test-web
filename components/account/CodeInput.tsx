"use client";

import { useEffect, useRef, useState } from "react";

const LENGTH = 6;

/**
 * The emailed sign-in code as six boxes, one per digit - the box being typed into is ringed
 * and carries a caret.
 *
 * The boxes are only a drawing. ONE real input lies over them, transparent: pasting the whole
 * code, the phone offering it from the email (`one-time-code`), backspace and the keyboard
 * all behave as in any field, which six separate inputs passing focus along never quite do.
 * 16px text in it, so iOS does not zoom the page on focus.
 */
export function CodeInput({
  value,
  label,
  disabled,
  onChange,
  onComplete,
}: {
  value: string;
  /** Names the field for screen readers - the visible sentence sits above it. */
  label: string;
  disabled?: boolean;
  onChange: (code: string) => void;
  /** All six digits are in. */
  onComplete?: (code: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Shown right after "Send code" - the code is the only thing left to do.
  useEffect(() => {
    input.current?.focus();
  }, []);
  // The box the next digit goes in; the last one once the code is full.
  const at = Math.min(value.length, LENGTH - 1);

  return (
    <div className="relative grid grid-cols-6 gap-2">
      {Array.from({ length: LENGTH }, (_, index) => {
        const active = focused && index === at;

        return (
          <span
            key={index}
            aria-hidden
            className={
              "flex h-[52px] items-center justify-center rounded-[10px] border bg-white text-[22px] font-semibold tabular-nums text-ink transition " +
              (active
                ? "border-brand-soft ring-2 ring-brand-tint"
                : value[index]
                  ? "border-ink/25"
                  : "border-line") +
              (disabled ? " bg-page text-muted" : "")
            }
          >
            {value[index] ??
              (active ? (
                <span className="h-6 w-[2px] animate-pulse rounded-full bg-brand" />
              ) : null)}
          </span>
        );
      })}

      <input
        ref={input}
        aria-label={label}
        autoComplete="one-time-code"
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-[16px] text-transparent caret-transparent opacity-0 outline-none"
        disabled={disabled}
        inputMode="numeric"
        maxLength={LENGTH}
        pattern="[0-9]*"
        value={value}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const code = event.target.value.replace(/\D/g, "").slice(0, LENGTH);

          onChange(code);
          if (code.length === LENGTH && code !== value) onComplete?.(code);
        }}
        onFocus={(event) => {
          setFocused(true);
          // Typing always continues at the end - a click on the first box must not put the
          // caret before digits already typed.
          const end = event.target.value.length;

          event.target.setSelectionRange(end, end);
        }}
      />
    </div>
  );
}
