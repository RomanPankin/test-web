"use client";

import type { PublicCustomerAddress } from "@estoreclub/api";

import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
} from "@estoreclub/client";
import { useCallback, useEffect, useState } from "react";

export interface CustomerAddresses {
  /** Null until read; the one used last first. */
  addresses: PublicCustomerAddress[] | null;
  failed: boolean;
  /** Keep a new one - it goes first, as the one touched last. Throws the server's sentence. */
  add: (address: string, details: string) => Promise<void>;
  /** Change one. Throws the server's sentence. */
  edit: (
    before: PublicCustomerAddress,
    address: string,
    details: string,
  ) => Promise<void>;
  /** Forget one. Throws the server's sentence. */
  remove: (customerAddressId: string) => Promise<void>;
}

/**
 * The signed-in customer's address book: where their orders were delivered, kept by the
 * server as each order is written, and what they saved here themselves.
 */
export function useCustomerAddresses(customerId: string): CustomerAddresses {
  const [addresses, setAddresses] = useState<PublicCustomerAddress[] | null>(
    null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;

    setAddresses(null);
    getCustomerAddresses()
      .then((answer) => current && setAddresses(answer.data))
      .catch(() => current && setFailed(true));

    return () => {
      current = false;
    };
  }, [customerId]);

  // The same address again comes back as the row it already was - moved to the top.
  const keep = (saved: PublicCustomerAddress, dropped?: string) =>
    setAddresses((before) => [
      saved,
      ...(before ?? []).filter(
        (each) =>
          each.customerAddressId !== saved.customerAddressId &&
          each.customerAddressId !== dropped,
      ),
    ]);

  const add = useCallback(async (address: string, details: string) => {
    keep(
      await addCustomerAddress({
        address: address.trim(),
        details: details.trim() || null,
      }),
    );
  }, []);

  /**
   * The API keeps addresses, it does not change them: an edit saves the new one and forgets
   * the old. The same street keeps its point on the map and postcode - only the flat or gate
   * code moved.
   */
  const edit = useCallback(
    async (before: PublicCustomerAddress, address: string, details: string) => {
      const same = address.trim() === before.address;
      const saved = await addCustomerAddress({
        address: address.trim(),
        details: details.trim() || null,
        ...(same
          ? {
              latitude: before.latitude,
              longitude: before.longitude,
              postcode: before.postcode,
            }
          : {}),
      });

      if (saved.customerAddressId !== before.customerAddressId) {
        await deleteCustomerAddress({
          customerAddressId: before.customerAddressId,
        });
      }
      keep(saved, before.customerAddressId);
    },
    [],
  );

  const remove = useCallback(async (customerAddressId: string) => {
    await deleteCustomerAddress({ customerAddressId });
    setAddresses((before) =>
      (before ?? []).filter(
        (each) => each.customerAddressId !== customerAddressId,
      ),
    );
  }, []);

  return { addresses, failed, add, edit, remove };
}
