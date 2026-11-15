/** A small turning ring in the button's own colour - the wait shown where it was asked for. */
export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`${className} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        opacity="0.3"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
