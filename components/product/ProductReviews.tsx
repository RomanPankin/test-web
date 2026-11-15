"use client";

import { useCustomer, useProductComments } from "@estoreclub/storefront/web";
import { useText } from "../ContentProvider";
import { ProductFeedback } from "../comments/ProductFeedback";

/**
 * What customers say about a product, at the foot of its page (`#reviews`): the thread and the
 * way to add to it - only while the shop lets customers comment (Sales rules → Social). Nothing
 * at all otherwise, not even the heading.
 */
export function ProductReviews({ productId }: { productId: string }) {
  const t = useText();
  const { customer } = useCustomer();
  const feedback = useProductComments(
    productId,
    true,
    customer?.customerId ?? null,
  );

  if (!(feedback.feedback?.allowComments ?? false)) return null;

  return (
    <section className="scroll-mt-24" id="reviews">
      <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
        {t("page.reviews")}
      </h2>
      <div className="max-w-[720px]">
        <ProductFeedback feedback={feedback} productId={productId} ruled={false} />
      </div>
    </section>
  );
}
