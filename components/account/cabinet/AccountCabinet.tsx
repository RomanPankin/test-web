"use client";

import type { CabinetLocation } from "./types";

import { useCustomer } from "@estoreclub/storefront/web";
import { useText } from "../../ContentProvider";
import { SignedOutNotice } from "../SignedOutNotice";

import { AddressBook } from "./AddressBook";
import { OrdersColumn } from "./OrdersColumn";
import { PaymentCards } from "./PaymentCards";
import { ProfileHeader } from "./ProfileHeader";

/**
 * The customer's own page: who they are, then their orders - the ones on their way and the ones
 * that arrived - with where they have them delivered and the cards they saved beside them.
 *
 * An online store has no bookings column: the orders take the wide side, the addresses and
 * cards a narrow column on the right from `xl` (narrower than that, the order rows would lose
 * the columns they lay out in), and below the orders on anything smaller. A shop that does not
 * deliver has no address book; the cards then sit under the orders at full width.
 *
 * Read in the browser: who is signed in is an httpOnly cookie the RPC side reads, and the
 * render tier has no request cookies. Nobody signed in sees the way to sign in instead.
 */
export function AccountCabinet({
  locations,
  showAddresses,
}: {
  locations: CabinetLocation[];
  /** Only while the shop delivers. */
  showAddresses: boolean;
}) {
  const t = useText();
  const { customer, loading } = useCustomer();

  if (loading) {
    return (
      <div className="h-[420px] animate-pulse rounded-[20px] bg-white/70" />
    );
  }
  if (!customer) {
    return (
      <SignedOutNotice
        perks={[
          t("account.perk.track"),
          t("account.perk.reorder"),
          t("account.perk.details"),
        ]}
        text={t("account.signedOutOrders")}
        title={t("account.signedOutTitle")}
      />
    );
  }

  return (
    <>
      <ProfileHeader customer={customer} />

      <div
        className={
          // `minmax(0, 1fr)` on a phone too: a bare grid sizes its one column to the widest
          // content (the order tracker), which pushed the panels past the screen's edge.
          "mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-5 sm:mt-10 " +
          (showAddresses ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "")
        }
      >
        <div className="scroll-mt-28" id="account-orders">
          <OrdersColumn
            customerId={customer.customerId}
            locations={locations}
          />
        </div>

        {/* The cards they saved paying here - shown only once there is one, hence `empty:`. */}
        {showAddresses ? (
          <aside className="flex min-w-0 flex-col gap-5">
            <div className="scroll-mt-28" id="account-addresses">
              <AddressBook customerId={customer.customerId} />
            </div>
            <div className="empty:hidden">
              <PaymentCards customerId={customer.customerId} />
            </div>
          </aside>
        ) : (
          <div className="empty:hidden">
            <PaymentCards customerId={customer.customerId} />
          </div>
        )}
      </div>
    </>
  );
}
