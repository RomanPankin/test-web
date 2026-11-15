/**
 * The small spaced capitals over a heading - "OUR STORY". TechStore's blue on the page, a light
 * tint of it over a dark photograph, where the full blue sinks into the shade. Nothing for an
 * eyebrow the shop has not written.
 */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: string;
  onDark?: boolean;
}) {
  if (!children) return null;

  return (
    <p
      className={
        "text-[11px] font-semibold uppercase tracking-[0.14em] " +
        (onDark ? "text-brand-soft" : "text-brand")
      }
    >
      {children}
    </p>
  );
}
