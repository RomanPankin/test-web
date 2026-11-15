"use client";

import type { TechProduct } from "../../lib/product";

import { useState } from "react";

import { setCartOpen } from "@estoreclub/storefront/web";
import { discounted, money } from "@estoreclub/storefront";
import { addToBag } from "../../lib/addToBag";
import { productHref } from "../../lib/productUrl";
import { useText } from "../ContentProvider";
import { DealBadge } from "../DealBadge";

import { CardLikes } from "./CardLikes";
import { CardRating } from "./CardRating";
import { ProductImage } from "./ProductImage";
import { SoldOutBadge } from "./SoldOutBadge";
import { Swatches } from "./Swatches";

/**
 * One product on a light grey card: the photo, the name, the spec line, its colours, the price,
 * and a black "Add to bag".
 *
 * The whole card opens the product's page - the name's link is stretched over it - while the
 * swatches, the likes and the button sit above that link and keep their own clicks. The swatches
 * choose the colour the button adds and swap the photo to that colour's own picture, so a
 * shopper who knows what they want never has to open anything. An island of its own, fed the product as JSON by the server page.
 *
 * A product on a deal wears its pill over the photo's top-left (`DealBadge`), and one that takes
 * something off each unit shows the price after it with the old one struck beside it. The
 * server prices the deal in the bag; this only says it first.
 *
 * A product with none left (`soldOut` - the shop counts its stock) stays on the shelf: its photo
 * fades, "Sold out" sits over the photo's top-right, and the button says it and does nothing.
 * A sold-out colour alone does the same to the button while that colour is picked.
 *
 * Under the spec line, what customers make of it - their star average, or their likes - where
 * the shop has them vote and somebody has; nothing otherwise, so a shop with voting off gets
 * the card as it always was.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: TechProduct;
  priority?: boolean;
}) {
  const t = useText();
  const firstAvailable =
    product.colours.find((colour) => colour.available) ?? product.colours[0];
  const [colourId, setColourId] = useState<string | null>(
    firstAvailable?.id ?? null,
  );
  const colour = product.colours.find((item) => item.id === colourId) ?? null;
  const price = colour?.price ?? product.price;
  const saving = product.deal?.discount;
  const soldOut =
    product.soldOut ||
    (product.colours.length > 0 && !(colour?.available ?? true));

  const add = () => {
    setCartOpen(true);
    void addToBag(product.id, colour);
  };
  // The product's own page (`/product/PR-12`) - the picture and the name lead there.
  const href = productHref(product);

  return (
    <article className="group relative flex h-full flex-col items-center rounded-[10px] bg-tile px-3 pb-[25px] pt-[16px] text-center">
      {product.deal ? (
        <DealBadge
          className="pointer-events-none absolute left-3 top-3 z-[1]"
          deal={product.deal}
        />
      ) : null}
      {product.soldOut ? (
        <SoldOutBadge
          className="pointer-events-none absolute right-3 top-3 z-[1]"
          label={t("product.soldOut")}
        />
      ) : null}
      <div className="flex h-[146px] w-full items-center justify-center">
        <ProductImage
          className={
            "h-[146px] w-auto max-w-[80%] transition duration-300 group-hover:scale-[1.04] " +
            (product.soldOut ? "opacity-55" : "")
          }
          priority={priority}
          sizes="160px"
          src={colour?.image ?? product.image}
        />
      </div>

      <h3 className="mt-[14px] text-[13.5px] font-medium leading-tight tracking-[-0.01em] text-ink">
        <a
          aria-label={t("product.view", { name: product.name })}
          className="rounded-[10px] outline-offset-4 after:absolute after:inset-0 after:rounded-[10px] group-hover:underline"
          href={href}
        >
          {product.name}
        </a>
      </h3>
      {product.spec ? (
        <p className="mt-[7px] text-[11.5px] leading-tight text-muted">
          {product.spec}
        </p>
      ) : null}
      <div className="relative z-[2] mt-[7px] flex justify-center empty:hidden">
        {product.customerRating ? (
          <CardRating rating={product.customerRating} />
        ) : (
          <CardLikes productId={product.id} rendered={product.customerLikes} />
        )}
      </div>

      <Swatches
        className="relative z-[2] mt-[13px]"
        colours={product.colours}
        name={"card-" + product.id}
        value={colourId}
        onChange={setColourId}
      />

      <p className="mb-[24px] mt-[9px] flex items-baseline gap-1.5 text-[13.5px] font-semibold tabular-nums tracking-[-0.01em] text-ink">
        {money(discounted(price, saving))}
        {/* What it was, struck through - the one figure that says the deal is real. */}
        {saving ? (
          <s className="text-[11.5px] font-normal text-muted">{money(price)}</s>
        ) : null}
      </p>

      <button
        aria-label={t("product.addNamed", { name: product.name })}
        className="relative z-[2] mt-auto h-[30px] w-full max-w-[136px] rounded-full bg-ink text-[11px] font-medium text-white transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#c9ccd2]"
        disabled={soldOut}
        type="button"
        onClick={add}
      >
        {soldOut ? t("product.soldOut") : t("product.addToBag")}
      </button>
    </article>
  );
}
