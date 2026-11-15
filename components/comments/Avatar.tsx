/** Warm pastels, a background and its ink - one per person, so a thread reads at a glance. */
const TINTS = [
  "bg-[#fcebdd] text-[#c23a1d]",
  "bg-[#e5f3e8] text-[#2f7d4f]",
  "bg-[#e7eefc] text-[#3657b5]",
  "bg-[#fdf1c7] text-[#94650a]",
  "bg-[#f1e8fb] text-[#7442c8]",
  "bg-[#fde4ec] text-[#b8325f]",
];

/** The same tint for the same name, every time. */
function tintOf(name: string): string {
  let hash = 0;

  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;

  return TINTS[Math.abs(hash) % TINTS.length];
}

/** A person's picture, or their initial on their own pastel. */
export function Avatar({
  name,
  avatarUrl,
  size = 36,
}: {
  name: string | null;
  avatarUrl: string | null;
  size?: number;
}) {
  const style = { width: size, height: size };

  if (avatarUrl) {
    return (
      <img
        alt=""
        className="shrink-0 rounded-full object-cover ring-2 ring-white"
        referrerPolicy="no-referrer"
        src={avatarUrl}
        style={style}
      />
    );
  }

  const label = (name ?? "").trim();

  return (
    <span
      aria-hidden="true"
      className={
        "grid shrink-0 place-items-center rounded-full font-semibold ring-2 ring-white " +
        tintOf(label || "?")
      }
      style={{ ...style, fontSize: Math.round(size * 0.4) }}
    >
      {label.slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}
