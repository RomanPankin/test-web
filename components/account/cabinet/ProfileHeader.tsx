"use client";

import type { PublicCustomer } from "@estoreclub/api";
import type { ReactNode } from "react";

import { useState } from "react";

import { confirmSignOut, openProfile } from "@estoreclub/storefront/web";
import { pageLocale } from "@estoreclub/storefront";
import { useText } from "../../ContentProvider";

import { initialsOf } from "../initials";

import { Icon } from "./Icon";

/**
 * Who is signed in: their photo (or initials), name, email, phone and since when — with the
 * way to change their details and to sign out.
 */
export function ProfileHeader({ customer }: { customer: PublicCustomer }) {
  const t = useText();
  const [brokenAvatar, setBrokenAvatar] = useState(false);
  const since = customer.signedUpAt
    ? new Intl.DateTimeFormat(pageLocale(), {
        month: "long",
        year: "numeric",
      }).format(new Date(customer.signedUpAt))
    : null;

  return (
    // On a phone: a smaller photo with the details BESIDE it (the actions under both); from `sm`
    // one row - photo, details, actions.
    <header className="flex flex-wrap items-center gap-x-4 gap-y-5 sm:flex-nowrap sm:gap-6">
      <div className="grid h-[64px] w-[64px] shrink-0 place-items-center overflow-hidden rounded-full bg-brand-tint text-[20px] font-bold text-brand sm:h-[112px] sm:w-[112px] sm:text-[34px]">
        {customer.avatarUrl && !brokenAvatar ? (
          // Their Google photo. No referrer: Google refuses some photo requests carrying one.
          <img
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            src={customer.avatarUrl}
            onError={() => setBrokenAvatar(true)}
          />
        ) : (
          initialsOf(customer.name, customer.email)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[30px]">
          {customer.name || customer.email}
        </h1>
        <ul className="mt-1.5 flex flex-col gap-1 text-[13px] text-muted sm:mt-3 sm:gap-1.5 sm:text-[14px]">
          <Fact icon="mail">{customer.email}</Fact>
          {customer.phone ? <Fact icon="phone">{customer.phone}</Fact> : null}
          {since ? (
            <Fact icon="calendar">
              {t("account.memberSince", { date: since })}
            </Fact>
          ) : null}
        </ul>
      </div>

      <div className="flex w-full items-center gap-7 sm:w-auto">
        <button
          className="inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-white px-5 text-[14px] font-semibold text-ink shadow-[0_4px_14px_-8px_rgba(17,18,22,0.2)] transition hover:border-brand-soft"
          type="button"
          onClick={() => openProfile()}
        >
          <Icon name="pencil" size={16} />
          {t("account.editProfile")}
        </button>
        <button
          className="text-[14px] font-semibold text-brand transition hover:text-brand-hover"
          type="button"
          onClick={() => confirmSignOut()}
        >
          {t("account.signOut")}
        </button>
      </div>
    </header>
  );
}

function Fact({
  icon,
  children,
}: {
  icon: "mail" | "phone" | "calendar";
  children: ReactNode;
}) {
  return (
    <li className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <Icon className="shrink-0 text-ink/70" name={icon} size={16} />
      <span className="truncate">{children}</span>
    </li>
  );
}
