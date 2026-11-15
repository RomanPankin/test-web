import { breadcrumbJsonLd, jsonLd, money } from "@estoreclub/storefront";

import { BundleBuilder } from "../../../components/bundle/BundleBuilder";
import { BundlePhotos } from "../../../components/bundle/BundlePhotos";
import { BundleDetails } from "../../../components/bundle/BundleDetails";
import { apartPrice, bundleHref, bundleProductsOf } from "../../../lib/bundle";
import { loadCatalog } from "../../../lib/catalog";
import { getText } from "../../../lib/content/server";
import { loadCombos } from "../../../lib/deals";
import { FRAME } from "../../../lib/layout";
import { shareImage, snippet } from "../../../lib/seo";

type Props = { params: Promise<{ id: string }> };

/** The bundle the address names, by its id, with the catalogue it is filled from. */
async function bundleOf(params: Props["params"]) {
  const { id } = await params;
  const [catalog, combos] = await Promise.all([loadCatalog(), loadCombos()]);
  const combo =
    combos.find((each) => each.id.toLowerCase() === id.toLowerCase()) ?? null;

  return { catalog, combo };
}

/** The bundle's name as the page title, its line as the description. */
export async function generateMetadata({ params }: Props) {
  const [t, { catalog, combo }] = await Promise.all([
    getText(),
    bundleOf(params),
  ]);

  if (!combo) return { title: t("meta.shop.title") };

  const description = snippet(combo.description);
  // The bundle's own cover, else the first thing in it - a set the shop has not photographed is
  // still shown by its picks on the page.
  const cover =
    combo.images[0]?.url ??
    catalog.products.find(
      (product) => product.id === combo.slots[0]?.options[0]?.productId,
    )?.image ??
    null;
  const image = shareImage(cover, combo.name);

  return {
    title: `${combo.name} - ${t("meta.shop.title")}`,
    description,
    openGraph: {
      title: combo.name,
      description,
      type: "website",
      ...(image ? { images: image } : {}),
    },
    alternates: { canonical: bundleHref(combo) },
  };
}

/**
 * One bundle's own page - what the bundle dialog was: the set as a picture, its name and line,
 * the price it starts from beside what the same things cost apart, and the picker
 * (`BundleBuilder`) - one product per place, each in its colour - then every product the bundle
 * fills, described - the one picked where a place offers a choice: its photos, overview and
 * main specs (`BundleDetails`), each leading to its own page.
 *
 * `/bundle/<id>?name=…`. A bundle the shop no longer offers (out of its dates, or deleted) says
 * so and leads back to the shop.
 */
export default async function BundlePage({ params }: Props) {
  const [t, { catalog, combo }] = await Promise.all([
    getText(),
    bundleOf(params),
  ]);

  if (!combo) {
    return (
      <main className={FRAME + " py-24 text-center"}>
        <p className="text-[18px] text-body">{t("bundle.notFound")}</p>
        <a
          className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-medium text-white transition hover:bg-black"
          href="/shop"
        >
          {t("page.backToShop")}
        </a>
      </main>
    );
  }

  const products = bundleProductsOf([combo], catalog.products);
  const apart = apartPrice(combo, products);
  const saving = apart > combo.fromPrice ? apart - combo.fromPrice : 0;
  // Each slot with the products it can be filled from - the details describe the one picked.
  const byId = new Map(
    catalog.products.map((product) => [product.id, product]),
  );
  const slots = combo.slots.map((slot) => ({
    id: slot.id,
    name: slot.name,
    products: slot.options.flatMap((option) => {
      const product = byId.get(option.productId);

      return product ? [product] : [];
    }),
  }));
  const hasDetails = slots.some((slot) => slot.products.length > 0);
  // The trail the breadcrumb above prints, for the search result's own.
  const trail = breadcrumbJsonLd([
    { name: t("shop.title"), url: "/shop" },
    { name: t("deals.title"), url: "/shop#deals" },
    { name: combo.name, url: bundleHref(combo) },
  ]);

  return (
    <main className="pb-16">
      <script
        dangerouslySetInnerHTML={{ __html: jsonLd(trail) }}
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
          <span aria-hidden="true">/</span>
          <a className="transition hover:text-ink" href="/shop#deals">
            {t("deals.title")}
          </a>
          <span aria-hidden="true">/</span>
          <span className="truncate text-ink">{combo.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-[20px] bg-tile p-4 sm:p-8 lg:aspect-square lg:sticky lg:top-24">
            <BundlePhotos
              className="h-[190px] w-full sm:h-[320px] lg:h-[360px]"
              combo={combo}
              products={products}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
              {t("bundle.eyebrow")}
            </p>
            <h1 className="mt-1.5 text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px]">
              {combo.name}
            </h1>
            {combo.description ? (
              <p className="mt-3 text-[15px] leading-[1.55] text-muted">
                {combo.description}
              </p>
            ) : null}

            <p className="mt-6 flex flex-wrap items-baseline gap-x-2.5 gap-y-2 text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-ink">
              <span className="text-[15px] font-normal text-muted">
                {t("bundle.from")}
              </span>
              {money(combo.fromPrice)}
              {saving ? (
                <>
                  <s className="text-[16px] font-normal text-muted">
                    {money(apart)}
                  </s>
                  <span className="self-center rounded-full bg-brand-tint px-2.5 py-1 text-[12px] font-semibold tracking-normal text-brand">
                    {t("deal.save", { amount: money(saving) })}
                  </span>
                </>
              ) : null}
            </p>

            <div className="mt-8 border-t border-line pt-7">
              <BundleBuilder combo={combo} products={products} />
            </div>
          </div>
        </div>
      </div>

      {hasDetails ? (
        <section className={FRAME + " mt-20"}>
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-ink">
            {t("bundle.inside")}
          </h2>
          <BundleDetails comboId={combo.id} slots={slots} />
        </section>
      ) : null}
    </main>
  );
}
