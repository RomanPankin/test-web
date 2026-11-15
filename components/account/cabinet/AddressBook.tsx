"use client";

import { useState } from "react";

import { useText } from "../../ContentProvider";

import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { Icon } from "./Icon";
import { useCustomerAddresses } from "./useCustomerAddresses";

/**
 * Where the customer has their orders delivered: every address an order went to (the server
 * keeps them as orders are written) and any they added here, the one used last first - with a
 * way to add one, change one and forget one. The checkout offers them back.
 *
 * It sits in the narrow column beside the orders on a wide screen, so the cards stack one under
 * another there; two side by side below that, where it runs the page's full width.
 */
export function AddressBook({ customerId }: { customerId: string }) {
  const t = useText();
  const { addresses, failed, add, edit, remove } =
    useCustomerAddresses(customerId);
  /** `"new"`, the id of the address being changed, or null. One form open at a time. */
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section className="rounded-[20px] bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] text-ink">
            {t("account.addresses")}
          </h2>
          <p className="mt-1 text-[13.5px] text-muted">
            {t("account.addressesText")}
          </p>
        </div>
        {addresses && editing === null ? (
          <button
            className="inline-flex h-[38px] items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[13.5px] font-semibold text-ink transition hover:border-brand-soft"
            type="button"
            onClick={() => setEditing("new")}
          >
            <Icon name="plus" size={15} />
            {t("account.addAddress")}
          </button>
        ) : null}
      </div>

      {failed ? (
        <p className="mt-4 text-[13.5px] text-brand">
          {t("account.loadFailed")}
        </p>
      ) : null}

      {!addresses ? (
        failed ? null : (
          <div className="mt-5 h-[92px] animate-pulse rounded-2xl bg-soft" />
        )
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {editing === "new" ? (
            <li className="sm:col-span-2 xl:col-span-1">
              <AddressForm onCancel={() => setEditing(null)} onSave={add} />
            </li>
          ) : null}
          {addresses.length === 0 && editing !== "new" ? (
            <li className="rounded-2xl bg-white px-4 py-5 text-center text-[13.5px] text-muted sm:col-span-2 xl:col-span-1">
              {t("account.noAddresses")}
            </li>
          ) : null}
          {addresses.map((address) =>
            editing === address.customerAddressId ? (
              <li
                key={address.customerAddressId}
                className="sm:col-span-2 xl:col-span-1"
              >
                <AddressForm
                  initial={address}
                  onCancel={() => setEditing(null)}
                  onSave={(line, details) => edit(address, line, details)}
                />
              </li>
            ) : (
              <AddressCard
                key={address.customerAddressId}
                address={address}
                onEdit={() => setEditing(address.customerAddressId)}
                onRemove={() => remove(address.customerAddressId)}
              />
            ),
          )}
        </ul>
      )}
    </section>
  );
}
