import type { TechProduct } from "./product";

/**
 * The open product, in the address: `?product=PR-12` - so a reload, a link somebody shares or
 * a QR code (`estoreclub.links` in package.json) opens the same product again.
 *
 * Keyed by the shop's own product number (`PR-12`), the same in every language and readable;
 * the product's id where it has none, and the id is always accepted - it is what a QR code
 * carries. Written with `replaceState`, not as a new history entry: Back leaves the page as it
 * always did, and the client router (which reloads a page whose query changed on Back) never
 * sees a dialog as a page move.
 */
export const PRODUCT_PARAM = "product";

type Keyed = Pick<TechProduct, "id" | "number">;

export function productKey(product: Keyed): string {
  return product.number ? `PR-${product.number}` : product.id;
}

/** The address with `product` open in it - or with none, for `null`. */
export function withProduct(href: string, product: Keyed | null): string {
  const url = new URL(href);

  if (product) url.searchParams.set(PRODUCT_PARAM, productKey(product));
  else url.searchParams.delete(PRODUCT_PARAM);

  return url.pathname + url.search + url.hash;
}

/** Put the open product in the address bar, or take it out. */
export function showProductInUrl(product: Keyed | null): void {
  if (typeof window === "undefined") return;

  const next = withProduct(window.location.href, product);

  if (next === window.location.pathname + window.location.search + window.location.hash) {
    return;
  }

  try {
    // The router's own state (its scroll position) stays with the entry.
    window.history.replaceState(window.history.state, "", next);
  } catch {
    // A sandboxed frame may refuse; the dialog works all the same.
  }
}

/** What the address asks for - `PR-12` or an id - or null. */
export function productAskedFor(): string | null {
  if (typeof window === "undefined") return null;

  return new URL(window.location.href).searchParams.get(PRODUCT_PARAM)?.trim() || null;
}

/** Whether `asked` names this product: its `PR-12` key, or its id. */
export function isProduct(product: Keyed, asked: string): boolean {
  return (
    asked.toUpperCase() === productKey(product).toUpperCase() ||
    asked.toLowerCase() === product.id.toLowerCase()
  );
}

/** A name as an address reads it: `Phone 16 Pro` → `phone-16-pro`, letters of any language kept. */
export function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The product's own page: `/product/PR-12?name=phone-16-pro` - its key (its id where it has no
 * number), and its name so the address reads as the product. Only the key finds it: a renamed
 * product's old links still open it.
 */
export function productHref(product: Keyed & { name?: string }): string {
  const slug = product.name ? nameSlug(product.name) : "";

  return (
    `/product/${encodeURIComponent(productKey(product))}` +
    (slug ? `?name=${encodeURIComponent(slug)}` : "")
  );
}
