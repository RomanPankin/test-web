/**
 * The questions, each one folded away behind its own answer - sample-asian's list, in
 * TechStore's type.
 *
 * A native `<details>`: it opens with a keyboard, it is found by the browser's own in-page
 * search even while shut, and it needs no JavaScript on a page that otherwise needs none.
 *
 * It UNFOLDS rather than jumping - `.disclosure` in `globals.css`, which animates the height of
 * the browser's own `::details-content` box. In a browser without that pseudo-element the
 * answer simply appears.
 */
export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="disclosure group py-[18px]">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15.5px] font-medium tracking-[-0.01em] text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            {/* A plus that turns into a cross: the shop's other controls are round and light,
                and an arrow pointing sideways read as a link away. */}
            <svg
              aria-hidden="true"
              className="mt-[3px] shrink-0 text-muted transition-transform duration-[240ms] ease-out group-open:rotate-45 motion-reduce:duration-[80ms]"
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                d="M8 2.5v11M2.5 8h11"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
            </svg>
          </summary>
          <p className="mt-2.5 pr-8 text-[15px] leading-[1.7] text-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
