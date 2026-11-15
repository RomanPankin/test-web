import { getText } from "../lib/content/server";

/**
 * The ways a shopper can pay, as small marks in the footer's bottom row.
 *
 * The payment page runs on Stripe, which takes all four - so this is a statement of fact about
 * checkout, not decoration. Drawn inline rather than fetched: four tiny images would be four
 * requests for the least important thing on the page. Muted ink, like the row they sit in; only
 * Mastercard keeps its colours, which are its mark.
 */
export async function PaymentMarks() {
  const t = await getText();

  return (
    <ul
      aria-label={t("footer.weAccept")}
      className="flex items-center gap-[16px] text-ink/70"
    >
      <li className="text-[12.5px] font-black italic tracking-[-0.02em]">
        VISA
      </li>
      <li aria-label="Mastercard">
        <svg aria-hidden="true" height="14" viewBox="0 0 30 18" width="23">
          <circle cx="10" cy="9" fill="#eb001b" r="8" />
          <circle cx="20" cy="9" fill="#f79e1b" r="8" />
          <path d="M15 2.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4Z" fill="#ff5f00" />
        </svg>
      </li>
      <li className="flex items-center gap-[2px] text-[11px] font-semibold">
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="11"
          viewBox="0 0 24 24"
          width="11"
        >
          <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.9-.9-3.1-.8a4.6 4.6 0 0 0-3.9 2.4c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 3 2.4 1.2-.1 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.7-4.1ZM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3Z" />
        </svg>
        Pay
      </li>
      <li className="flex items-center gap-[2px] text-[11px] font-semibold">
        <span className="bg-[conic-gradient(from_-45deg,#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)] bg-clip-text font-bold text-transparent">
          G
        </span>
        Pay
      </li>
    </ul>
  );
}
