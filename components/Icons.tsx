/**
 * The site's outline icons, drawn at 24×24 with a 1.6 stroke so they read as one family —
 * the header's search, account and bag, the features row, the footer's socials.
 *
 * Inline SVG components rather than an icon font or a sprite: they inherit `currentColor`,
 * need no request, and render on the server.
 */
type IconProps = { size?: number; className?: string; strokeWidth?: number };

function Svg({
  size = 24,
  className,
  children,
  strokeWidth = 1.6,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.75" cy="10.75" r="6.75" />
      <path d="m20 20-4.2-4.2" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c.9-3.9 3.9-6 7.5-6s6.6 2.1 7.5 6" />
    </Svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 8h13l-.9 12.1a1 1 0 0 1-1 .9H7.4a1 1 0 0 1-1-.9L5.5 8Z" />
      <path d="M8.75 10V6.75a3.25 3.25 0 0 1 6.5 0V10" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </Svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </Svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 6.25h11v10H2.75z" />
      <path d="M13.75 9.75h4.1l3.4 3.6v2.9h-7.5" />
      <circle cx="6.5" cy="17.5" fill="#fff" r="1.9" />
      <circle cx="17.25" cy="17.5" fill="#fff" r="1.9" />
    </Svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.75 4.75 5.5v5.75c0 4.6 3.1 8.4 7.25 9.9 4.15-1.5 7.25-5.3 7.25-9.9V5.5L12 2.75Z" />
      <path d="m8.75 12 2.3 2.3 4.2-4.6" />
    </Svg>
  );
}

export function TradeInIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3.5H5.5a2 2 0 0 0-2 2V8M16 3.5h2.5a2 2 0 0 1 2 2V8M8 20.5H5.5a2 2 0 0 1-2-2V16M16 20.5h2.5a2 2 0 0 0 2-2V16" />
      <path d="M8.5 10.5a3.75 3.75 0 0 1 6.6-1.6M15.5 13.5a3.75 3.75 0 0 1-6.6 1.6" />
      <path d="M15.5 6.75v2.4h-2.4M8.5 17.25v-2.4h2.4" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect height="11" rx="2" width="15" x="4.5" y="10" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" fill="currentColor" r="1" />
    </Svg>
  );
}

/** A speech bubble - the product dialog's way to the reviews. */
export function ChatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6a.5.5 0 0 1-.8-.4V16A2.5 2.5 0 0 1 4 13.5Z" />
      <path d="M8.5 8.5h7M8.5 11.5h4.5" />
    </Svg>
  );
}

/** A left arrow - "back" from one panel to the one before it. */
export function ArrowLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />
    </Svg>
  );
}

/** A map pin - where the shop delivers. */
export function PinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </Svg>
  );
}

/** A price tag - what delivery costs. */
export function TagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 12.6V4.75c0-.7.55-1.25 1.25-1.25h7.85l8.15 8.15a1.25 1.25 0 0 1 0 1.77l-7.08 7.08a1.25 1.25 0 0 1-1.77 0Z" />
      <circle cx="8.25" cy="8.25" fill="currentColor" r="1.15" />
    </Svg>
  );
}

/** A wrapped box - free delivery above an amount. */
export function GiftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 10.5h15v9.75h-15zM3.5 7.25h17v3.25h-17zM12 7.25v13" />
      <path d="M12 7.25S10.9 3.5 8.6 3.5a1.9 1.9 0 0 0 0 3.75M12 7.25s1.1-3.75 3.4-3.75a1.9 1.9 0 0 1 0 3.75" />
    </Svg>
  );
}

/** A clock - how long delivery takes. */
export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

/** A seal with a tick - genuine products. */
export function BadgeCheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 2.75 2.35 1.7 2.9-.05.9 2.75 2.35 1.7-.9 2.75.9 2.75-2.35 1.7-.9 2.75-2.9-.05L12 21.25l-2.35-1.7-2.9.05-.9-2.75-2.35-1.7.9-2.75-.9-2.75 2.35-1.7.9-2.75 2.9.05Z" />
      <path d="m8.9 12 2.1 2.1 4.1-4.3" />
    </Svg>
  );
}

/** A headset - people to ask. */
export function HeadsetIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect height="6" rx="1.5" width="3.5" x="3.5" y="13" />
      <rect height="6" rx="1.5" width="3.5" x="17" y="13" />
      <path d="M18.75 19v.25a2.25 2.25 0 0 1-2.25 2.25H13" />
    </Svg>
  );
}

/** A box going back - returns. */
export function ReturnIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 4.5H5.5v3.5" />
      <path d="M5.5 8A7.5 7.5 0 1 1 4.5 12" />
      <path d="M9.5 10.5 12 9.25l2.5 1.25v3L12 14.75l-2.5-1.25Z" />
    </Svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect height="17" rx="4.5" width="17" x="3.5" y="3.5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.1" cy="6.9" fill="currentColor" r="0.6" />
    </Svg>
  );
}

export function FacebookIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M12 2.5a9.5 9.5 0 0 0-1.5 18.9v-6.65H8.1V12h2.4V9.9c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 2.75h-2.2v6.65A9.5 9.5 0 0 0 12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YouTubeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M17.75 3.5h3.05l-6.66 7.6 7.83 10.4h-6.13l-4.8-6.28-5.5 6.28H2.48l7.12-8.14L2.1 3.5h6.29l4.34 5.74 5.02-5.74Zm-1.07 16.17h1.69L7.46 5.24H5.65l11.03 14.43Z"
        fill="currentColor"
      />
    </svg>
  );
}
