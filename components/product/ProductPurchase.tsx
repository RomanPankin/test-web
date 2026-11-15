"use client";

import type { TechProduct } from "../../lib/product";

import { useState } from "react";

import {
  setCartOpen,
  useCustomer,
  useProductComments,
} from "@estoreclub/storefront/web";
import { discounted, money, photoUrl } from "@estoreclub/storefront";
import { addToBag } from "../../lib/addToBag";
import { useText } from "../ContentProvider";
import { ChatIcon } from "../Icons";
import { WARRANTY_FEATURE, featuresOf } from "../home/Features";
import { DealBadge } from "../DealBadge";
import { QuantityStepper } from "../QuantityStepper";
import { ProductRatingLine } from "../comments/ProductRatingLine";

import { ProductGallery } from "./ProductGallery";
import { SoldOutBadge } from "./SoldOutBadge";
import { Swatches } from "./Swatches";

/** A picture's file name, whatever host or size its address carries - how two are told alike. */
const fileOf = (url: string) =>
  (url.split("?")[0].split("/").pop() ?? "").replace(/@\d+(?=\.\w+$)/, "");

/**
 * The top of a product's page: its photos on the grey (`ProductGallery`), and beside them the
 * name, the spec line, what customers make of it, the colour picker with the colour named, the
 * price (after any deal, the old one struck beside it), how many, "Add to bag", and the
 * site's own promises (its `feature.N` content), the warranty the product's own where it has one. Picking a colour shows its own picture where it has one.
 *
 * An island: the colour, the count and the bag are the browser's. Rendered on the server with
 * the product first, so the page reads whole before it hydrates. What customers say is read once
 * it is up (`useProductComments`); the link under the rating goes to the page's reviews.
 */
export function ProductPurchase({ product }: { product: TechProduct }) {
  const t = useText();
  const features = featuresOf(t);
  const [chosen, setChosen] = useState<string | null>(
    product.colours[0]?.id ?? null,
  );
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(0);
  const { customer } = useCustomer();
  const feedback = useProductComments(
    product.id,
    true,
    customer?.customerId ?? null,
  );

  const colour = product.colours.find((item) => item.id === chosen) ?? null;
  const price = colour?.price ?? product.price;
  const saving = product.deal?.discount;
  const each = discounted(price, saving);
  const soldOut =
    product.soldOut ||
    (product.colours.length > 0 && !(colour?.available ?? true));
  const photos = product.images.length > 0 ? product.images : [product.image];
  // A colour with a picture of its own shows it; the colour the product's own photos show (its
  // picture IS the cover) shows them all - every view of it, not just the one.
  const images =
    colour?.image &&
    fileOf(photoUrl(colour.image)) !== fileOf(photoUrl(photos[0]))
      ? [colour.image]
      : photos;
  const badge = product.badge
    ? t("product.badge." + product.badge) === "product.badge." + product.badge
      ? product.badge
      : t("product.badge." + product.badge)
    : "";
  const allowComments = feedback.feedback?.allowComments ?? false;

  const add = () => {
    setCartOpen(true);
    void addToBag(product.id, colour, qty);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
      <div className="overflow-hidden rounded-[20px] bg-tile lg:sticky lg:top-24">
        <ProductGallery
          current={photo}
          images={images}
          name={product.name}
          onSelect={setPhoto}
        />
      </div>

      <div className="flex flex-col">
        {badge ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            {badge}
          </p>
        ) : null}
        <h1 className="mt-1.5 text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px]">
          {product.name}
        </h1>
        {product.spec ? (
          <p className="mt-2 text-[15px] text-muted">{product.spec}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ProductRatingLine feedback={feedback} />
          {allowComments ? (
            <a
              className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-[6px] text-[13px] font-medium text-brand transition hover:bg-brand-tint/70"
              href="#reviews"
            >
              <ChatIcon size={16} />
              {feedback.feedback && feedback.feedback.commentCount > 0
                ? t("comments.show", { count: feedback.feedback.commentCount })
                : t("comments.leave")}
            </a>
          ) : null}
        </div>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-2 text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-ink">
          {money(each)}
          {saving ? (
            <s className="text-[16px] font-normal text-muted">{money(price)}</s>
          ) : null}
          {product.deal ? (
            <DealBadge className="self-center" deal={product.deal} />
          ) : null}
          {product.soldOut ? (
            <SoldOutBadge
              className="self-center"
              label={t("product.soldOut")}
            />
          ) : null}
        </p>

        {product.colours.length > 0 ? (
          <div className="mt-7">
            <p className="text-[13px] text-ink">
              <span className="font-medium">{t("product.colour")}</span>
              {colour ? (
                <span className="text-muted"> · {colour.name}</span>
              ) : null}
            </p>
            <Swatches
              className="mt-3"
              colours={product.colours}
              name={"page-" + product.id}
              size={26}
              value={chosen}
              onChange={(next) => {
                setChosen(next);
                setPhoto(0);
              }}
            />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {soldOut ? null : <QuantityStepper qty={qty} onChange={setQty} />}
          <button
            className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14.5px] font-medium text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c9ccd2]"
            disabled={soldOut}
            type="button"
            onClick={add}
          >
            <span className="min-w-0 truncate">
              {soldOut ? t("product.soldOut") : t("product.addToBag")}
            </span>
            {soldOut ? null : (
              <span className="shrink-0 tabular-nums">{money(each * qty)}</span>
            )}
          </button>
          {soldOut ? (
            <p className="w-full text-[13px] text-muted">
              {t("product.soldOutText")}
            </p>
          ) : null}
        </div>

        {/* The site's own promises - the same `feature.N` content the home page lists, so the
            shop words them once. The warranty is the product's own where it states one. None
            written: no list. */}
        {features.length > 0 ? (
          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-[13px] text-body">
            {features.map(({ Icon, index, title, text }) => (
              <li key={index} className="flex items-start gap-3">
                <Icon className="shrink-0 text-ink" size={20} />
                <span>
                  <span className="font-medium text-ink">
                    {index === WARRANTY_FEATURE && product.warrantyMonths
                      ? t("product.warranty", { count: product.warrantyMonths })
                      : title}
                  </span>
                  {text ? <span className="text-muted">{" · " + text}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
