/**
 * The account page's line icons, drawn on one 20px grid with one stroke so they read as a set
 * beside the booking page's — no icon font, nothing to load.
 */
const PATHS = {
  mail: (
    <>
      <rect
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="15"
        x="2.5"
        y="4"
      />
      <path
        d="m3 5.5 7 5 7-5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </>
  ),
  phone: (
    <path
      d="M5.2 2.8h2.3l1.2 3.4-1.6 1.1a9 9 0 0 0 5.6 5.6l1.1-1.6 3.4 1.2v2.3c0 .9-.7 1.6-1.6 1.6A13.4 13.4 0 0 1 3.6 4.4c0-.9.7-1.6 1.6-1.6Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  ),
  calendar: (
    <>
      <rect
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="3"
        y="4.5"
      />
      <path
        d="M3 8.5h14M7 2.5v3.5M13 2.5v3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  pencil: (
    <path
      d="m12.6 3.9 3.5 3.5M3.5 16.5l.8-3.7 9.4-9.4a1.4 1.4 0 0 1 2 0l1.4 1.4a1.4 1.4 0 0 1 0 2l-9.4 9.4-4.2.3Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  ),
  pin: (
    <>
      <path
        d="M10 17.5s5.5-4.9 5.5-9.3a5.5 5.5 0 0 0-11 0c0 4.4 5.5 9.3 5.5 9.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8.2" r="2" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  delivery: (
    <>
      <path
        d="M2.5 5h9v8h-9zM11.5 8h3l2.5 2.6V13h-5.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="5.5"
        cy="14.5"
        fill="white"
        r="1.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="14"
        cy="14.5"
        fill="white"
        r="1.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  pickup: (
    <>
      <path
        d="M4 6.5h12l-1 10H5l-1-10Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 8.5V5.5a2.5 2.5 0 0 1 5 0v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  reservation: (
    <path
      d="M6 2.5v5a2 2 0 0 0 2 2M6 2.5v15M4 2.5v5M8 2.5v7M14.5 17.5v-15c-1.9.6-3 2.6-3 5.2V11h3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  ),
  people: (
    <>
      <circle cx="7.5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="13.5"
        cy="7.5"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.8 16c.4-2.8 2.3-4.5 4.7-4.5s4.3 1.7 4.7 4.5M12 11.6c2.4-.4 4.6.9 5.1 3.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  table: (
    <>
      <rect
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="13"
        x="3.5"
        y="3.5"
      />
      <path
        d="M7 7.5h6M7 10.5h6M7 13.5h3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  note: (
    <>
      <circle
        cx="10"
        cy="10"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7.2 8.6h5.6M7.2 11.4h3.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  chevronDown: (
    <path
      d="m5.5 8 4.5 4.5L14.5 8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  ),
  chevronRight: (
    <path
      d="m8 5.5 4.5 4.5L8 14.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  ),
  check: (
    <path
      d="m5 10.4 3.2 3.1L15 6.8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    />
  ),
  card: (
    <>
      <rect
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="15"
        x="2.5"
        y="4.5"
      />
      <path
        d="M2.5 8h15M5.5 12.5h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </>
  ),
  store: (
    <path
      d="M3 8.5V16.5h14V8.5M2.5 8.5 4 3.5h12l1.5 5c0 1.2-1 2-2.1 2s-2.2-.8-2.2-2c0 1.2-1 2-2.2 2s-2.2-.8-2.2-2c0 1.2-1 2-2.2 2s-2.1-.8-2.1-2ZM8 16.5v-4h4v4"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  ),
  plus: (
    <path
      d="M10 4.5v11M4.5 10h11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  ),
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 16,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={"shrink-0 " + className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      {PATHS[name]}
    </svg>
  );
}
