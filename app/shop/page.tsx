import { Image } from "@estoreclub/client";

import { DealsSection } from "../../components/home/DealsSection";
import { ProductCard } from "../../components/product/ProductCard";
import { bundleProductsOf } from "../../lib/bundle";
import { loadCatalog } from "../../lib/catalog";
import { loadContent } from "../../lib/content/loadContent";
import { getText } from "../../lib/content/server";
import { imageOf } from "../../lib/content/textOf";
import { loadCombos } from "../../lib/deals";
import { FRAME } from "../../lib/layout";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.shop.title"),
    description: t("meta.shop.description"),
  };
}

/**
 * Everything the shop sells, grouped by its categories in its own order. Each section carries
 * its category's anchor (`#phones`), which the header's links and the home page's tiles point
 * at; a strip of the categories jumps between them.
 *
 * The strip STICKS under the header while the shelves scroll, as sample-asian's course bar
 * does: on a long page of phones and cables, the way to the next category is always one tap
 * away. Plain CSS (`sticky`), so it needs no island; it is a sibling of the sections rather than
 * inside the title band, because a sticky element only sticks within its own parent. Every
 * section's `scroll-mt` clears the header and the strip together, so a jump lands on the
 * heading rather than under the bar.
 *
 * "Deals" (`#deals`, the header's link) is the first shelf: the shop's bundles and every
 * product a discount rule is on (`DealsSection`). A shop with no deals has no such shelf, and the
 * anchor falls on the top of the page instead.
 */
export default async function ShopPage() {
  const [t, catalog, combos, content] = await Promise.all([
    getText(),
    loadCatalog(),
    loadCombos(),
    loadContent(),
  ]);
  // The band's picture - "Site images" → `shop.hero`, else the sample's lineup.
  const image = imageOf(content, "shop.hero");
  const onDeal = catalog.products.filter(
    (product) => product.deal && !product.soldOut,
  );
  const hasDeals = combos.length > 0 || onDeal.length > 0;
  const sections = catalog.categories.filter(
    (category) => category.products.length > 0,
  );
  const filed = new Set(
    sections.flatMap((section) => section.products.map((p) => p.id)),
  );
  // Products filed under no category still have to appear, or the page hides part of the shop.
  const loose = catalog.products.filter((product) => !filed.has(product.id));

  return (
    <main className="pb-6">
      <section
        className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(105deg,#f3f5f9_0%,#eef1f6_45%,#e4e9f1_100%)]"
        // The anchor stays on the page when there is no deals shelf to carry it.
        id={hasDeals ? undefined : "deals"}
      >
        {/* Two soft washes of colour - lavender behind the phones' screens, sky blue at the far
            end - so the band is lit rather than flat. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[18%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(140,110,255,0.22),transparent_65%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-[-6%] h-[380px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(10,99,238,0.16),transparent_65%)] blur-2xl"
        />
        <div
          className={
            FRAME +
            " relative pb-8 pt-12 sm:pt-14 lg:grid lg:min-h-[320px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-8 lg:pb-10"
          }
        >
          <div className="relative z-10">
            <h1 className="text-[40px] font-semibold leading-none tracking-[-0.045em] text-ink sm:text-[56px]">
              {t("shop.title")}
            </h1>
            <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-body sm:text-[17px]">
              {t("shop.intro")}
            </p>
          </div>
          {/* The lineup, cut out of its backdrop: it stands on the band on a soft floor
              shadow. Beside the words from `lg`, under them on a phone. */}
          {image ? (
            <div className="pointer-events-none relative mt-8 lg:mt-0">
              <div
                aria-hidden="true"
                className="absolute bottom-[2%] left-[6%] right-[6%] h-[10%] rounded-[50%] bg-[rgba(17,18,22,0.22)] blur-2xl"
              />
              <Image
                priority
                alt={t("shop.imageAlt")}
                className="relative block w-full [filter:drop-shadow(0_14px_18px_rgba(17,18,22,0.12))]"
                sizes="(min-width: 1024px) 680px, 100vw"
                src={image}
              />
            </div>
          ) : null}
        </div>
      </section>

      {sections.length > 0 ? (
        <nav
          aria-label={t("categories.label")}
          className="sticky top-14 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md backdrop-saturate-150"
        >
          {/* A row of the categories as a store's own nav draws them: the category's picture
              over its name, no frame or ring - a light wash under the pointer, the picture
              lifting a little. Scrolls sideways where they do not fit. */}
          <ul
            className={
              FRAME + " no-scrollbar flex gap-1 overflow-x-auto py-2 sm:gap-2"
            }
          >
            {sections.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  className="group flex w-[88px] flex-col items-center gap-1.5 rounded-2xl px-1 pb-2 pt-2.5 transition-colors hover:bg-black/[0.04] sm:w-[104px]"
                  href={"#" + section.slug}
                >
                  {/* The category's picture in a soft tile of its own backdrop's grey, cropped in
                      so the product fills it rather than floating small in a square. */}
                  <span className="block h-14 w-14 overflow-hidden rounded-[18px] bg-tile shadow-[inset_0_0_0_1px_rgba(17,18,22,0.04)] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <Image
                      alt=""
                      className="h-full w-full scale-[1.45] object-cover"
                      sizes="56px"
                      src={section.image}
                    />
                  </span>
                  <span className="line-clamp-2 max-w-full text-center text-[12px] font-medium leading-[1.25] tracking-[-0.01em] text-body transition-colors group-hover:text-ink sm:text-[12.5px]">
                    {section.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <DealsSection
        bundleProducts={bundleProductsOf(combos, catalog.products)}
        className="mt-10 scroll-mt-[172px]"
        combos={combos}
        id="deals"
        products={onDeal}
        t={t}
      />

      {sections.length === 0 && loose.length === 0 ? (
        <div className={FRAME + " py-16"}>
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="text-lg font-semibold">{t("shop.emptyTitle")}</p>
            <p className="mt-2 text-muted">{t("shop.emptyText")}</p>
          </div>
        </div>
      ) : null}

      {[
        ...sections,
        ...(loose.length > 0
          ? [
              {
                id: "more",
                slug: "more",
                name: t("nav.shop"),
                description: "",
                products: loose,
              },
            ]
          : []),
      ].map((section) => (
        <section
          key={section.id}
          className={FRAME + " mt-12 scroll-mt-[172px]"}
          id={section.slug}
        >
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink lg:text-[27px]">
            {section.name}
          </h2>
          {section.description ? (
            <p className="mt-1 text-[14px] text-muted">{section.description}</p>
          ) : null}
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-[18px]">
            {section.products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
