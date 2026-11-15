import type { SiteLink } from "../lib/content/types";

import { FRAME } from "../lib/layout";

import { TruckIcon } from "./Icons";

/**
 * The thin strip above the header, from `lg`: what delivery costs on the left, the shop's own
 * pages on the right (the "pages" Site links - About, Delivery & returns, FAQ, Track order).
 *
 * Here and not in the header: the header's middle is the categories, and four more links there
 * crowded them off a laptop's width. An electronics shop's visitors look for "where is my
 * order" and "what does delivery cost" above the header, where shops of its kind keep them.
 * Not sticky - only the header is - so it scrolls away with the page.
 *
 * The delivery line is said only by a shop that delivers. On a phone both move into the menu
 * (`MobileNav`).
 */
export function TopStrip({
  links,
  delivery,
}: {
  links: SiteLink[];
  /** The shop's delivery line, or empty where it does not deliver. */
  delivery: string;
}) {
  if (links.length === 0 && !delivery) return null;

  return (
    <div className="hidden border-b border-line/70 bg-soft lg:block">
      <div
        className={
          FRAME + " flex h-8 items-center justify-between gap-6 text-[11.5px]"
        }
      >
        <p className="flex min-w-0 items-center gap-2 truncate text-body">
          {delivery ? (
            <>
              <TruckIcon className="shrink-0 text-ink" size={16} />
              {delivery}
            </>
          ) : null}
        </p>
        <ul className="flex shrink-0 items-center gap-6">
          {links.map((link) => (
            <li key={link.label + link.url}>
              <a
                className="text-muted transition hover:text-ink"
                href={link.url || "/"}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
