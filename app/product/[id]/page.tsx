import { ProductCard } from "../../../components/product/ProductCard";
import { ProductPurchase } from "../../../components/product/ProductPurchase";
import { ProductReviews } from "../../../components/product/ProductReviews";
import { loadCatalog } from "../../../lib/catalog";
import { getText } from "../../../lib/content/server";
import { FRAME } from "../../../lib/layout";
import { isProduct, productHref } from "../../../lib/productUrl";
import { shareImage, snippet, techProductJsonLd } from "../../../lib/seo";
import { breadcrumbJsonLd, jsonLd } from "@estoreclub/storefront";
import { siteInfo } from "@estoreclub/storefront/server";

type Props = { params: Promise<{ id: string }> };

/** The product the address names - its `PR-12` key or its id - from the shop's catalogue. */
async function productOf(params: Props["params"]) {
  const { id } = await params;
  const catalog = await loadCatalog();
  const product =
    catalog.products.find((each) => isProduct(each, id)) ?? null;

  return { catalog, product };
}

/** The product's name as the page title, its first lines as the description. */
export async function generateMetadata({ params }: Props) {
  const [t, { product }] = await Promise.all([getText(), productOf(params)]);

  if (!product) return { title: t("meta.shop.title") };

  const title = `${product.name} - ${t("meta.shop.title")}`;
  const description = snippet(product.overview[0] || product.spec);
  const image = shareImage(product.image, product.name);

  return {
    title,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      ...(image ? { images: image } : {}),
    },
    // One address per product: the key finds it and the name only reads well, so the same
    // product reached by its id, or with a stale name after a rename, still counts as this page.
    alternates: { canonical: productHref(product) },
  };
}

/**
 * One product's own page - what the dialog was, with room for everything a buyer needs: its
 * photos and the order (`ProductPurchase`), then its long OVERVIEW, its full SPECIFICATIONS
 * grouped the way buyers compare them (display, battery, size and weight…), what customers say,
 * and more from its category.
 *
 * `/product/PR-12`, or the product's id - what a QR code carries (`estoreclub.links`). A product
 * the shop no longer sells says so and leads back to the shop.
 */
export default async function ProductPage({ params }: Props) {
  const [t, { catalog, product }, site] = await Promise.all([
    getText(),
    productOf(params),
    siteInfo(),
  ]);

  if (!product) {
    return (
      <main className={FRAME + " py-24 text-center"}>
        <p className="text-[18px] text-body">{t("page.notFound")}</p>
        <a
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-white transition hover:bg-black"
          href="/shop"
        >
          {t("page.backToShop")}
        </a>
      </main>
    );
  }

  const category = catalog.categories.find((each) =>
    product.categoryIds.includes(each.id),
  );
  const related = (category?.products ?? [])
    .filter((each) => each.id !== product.id)
    .slice(0, 4);
  const shopName = (site && site.siteName) || t("brand.name");
  // What a search result draws: the product with its price, stock and stars, and the trail the
  // breadcrumb above prints - Shop, its category, the product.
  const structured = [
    techProductJsonLd(product, {
      currency: site?.currency || "USD",
      url: productHref(product),
      shopName,
    }),
    breadcrumbJsonLd([
      { name: shopName, url: "/" },
      { name: t("shop.title"), url: "/shop" },
      ...(category ? [{ name: category.name, url: "/shop#" + category.slug }] : []),
      { name: product.name, url: productHref(product) },
    ]),
  ];

  return (
    <main className="pb-16">
      <script
        dangerouslySetInnerHTML={{ __html: jsonLd(structured) }}
        type="application/ld+json"
      />
      <div className={FRAME + " pt-6 sm:pt-8"}>
        <nav
          aria-label={t("categories.label")}
          className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted"
        >
          <a className="transition hover:text-ink" href="/shop">
            {t("shop.title")}
          </a>
          {category ? (
            <>
              <span aria-hidden="true">/</span>
              <a
                className="transition hover:text-ink"
                href={"/shop#" + category.slug}
              >
                {category.name}
              </a>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="mt-6">
          <ProductPurchase product={product} />
        </div>
      </div>

      {product.overview.length > 0 ? (
        <section className={FRAME + " mt-20"}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">
              {t("page.overview")}
            </h2>
            <div className="space-y-4 text-[16.5px] leading-[1.65] text-body">
              {product.overview.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.specSheet.length > 0 ? (
        <section className={FRAME + " mt-20"} id="specs">
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">
            {t("page.specs")}
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {product.specSheet.map((group, index) => (
              <div
                key={group.title + index}
                className="grid gap-3 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14"
              >
                <h3 className="text-[15px] font-semibold text-ink">
                  {group.title}
                </h3>
                <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {group.rows.map((row, rowIndex) => (
                    <div key={row.label + rowIndex}>
                      {row.label ? (
                        <dt className="text-[12.5px] text-muted">{row.label}</dt>
                      ) : null}
                      <dd className="mt-0.5 text-[14.5px] leading-snug text-ink">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className={FRAME + " mt-20"}>
        <ProductReviews productId={product.id} />
      </div>

      {related.length > 0 ? (
        <section className={FRAME + " mt-20"}>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
            {t("page.related")}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-[18px]">
            {related.map((each) => (
              <li key={each.id}>
                <ProductCard product={each} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
