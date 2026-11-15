import type { Photo } from "@estoreclub/storefront";

/**
 * A location as the account page needs it: an order names its location only by name, a
 * booking by id — so both are kept, and the page adds the street and the photo.
 */
export interface CabinetLocation {
  id: string;
  name: string;
  /** "12 Market St" — the street line only; the name is already beside it. */
  address: string;
  photo: Photo | null;
}
