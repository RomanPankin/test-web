/**
 * "Sold out", over the top-right of a product's photo - the corner the deal pill does not take,
 * so a sold-out product on a deal still says both. Grey, not the brand's blue: it is news, not
 * an offer, and blue is what TechStore's offers wear.
 *
 * The words come in as a prop rather than from the content store, so a server page can draw it
 * as readily as an island.
 */
export function SoldOutBadge({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={
        "pointer-events-none whitespace-nowrap rounded-full bg-[#5c616b] px-2.5 py-[4px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white " +
        className
      }
    >
      {label}
    </span>
  );
}
