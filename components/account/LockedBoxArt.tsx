/**
 * The signed-out account page's drawing: a shopping bag with a phone peeking out and a padlock
 * on its front — "this is yours, once we know it is you". Flat shapes in the site's palette on a
 * soft blue blot, one accent; no gradients.
 */
export function LockedBoxArt({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 240 170">
      <ellipse cx="120" cy="96" fill="#e8f0fe" rx="104" ry="66" />
      <ellipse cx="120" cy="154" fill="#111216" opacity="0.06" rx="74" ry="7" />

      {/* A phone, standing in the bag. */}
      <rect fill="#111216" height="70" rx="9" width="40" x="122" y="18" />
      <rect fill="#3b6fd8" height="60" rx="6" width="32" x="126" y="23" />
      <path d="M130 50c8-14 18-20 24-22M131 66c10-10 16-12 23-12" stroke="#9cc0fb" strokeLinecap="round" strokeWidth="2" />

      {/* The bag and its handles. */}
      <path d="M96 58V48a24 24 0 0 1 48 0v10" stroke="#111216" strokeLinecap="round" strokeWidth="3" />
      <path d="M62 58h116l-8 92H70l-8-92Z" fill="#fff" stroke="#111216" strokeLinejoin="round" strokeWidth="2" />
      <path d="M66 74h108" stroke="#e8eaee" strokeWidth="2" />

      {/* The padlock on the front. */}
      <path d="M110 112v-9a10 10 0 0 1 20 0v9" stroke="#111216" strokeLinecap="round" strokeWidth="3" />
      <rect fill="#0a63ee" height="28" rx="6" width="34" x="103" y="110" />
      <circle cx="120" cy="121" fill="#fff" r="3.5" />
      <path d="M120 123v6" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}
