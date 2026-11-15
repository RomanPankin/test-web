import { AudioBanner } from "../components/home/AudioBanner";
import { CategoryTiles } from "../components/home/CategoryTiles";
import { DealsSection } from "../components/home/DealsSection";
import { Features } from "../components/home/Features";
import { Hero } from "../components/home/Hero";
import { NewArrivals } from "../components/home/NewArrivals";
import { PromoCards } from "../components/home/PromoCards";
import { TradeIn } from "../components/home/TradeIn";
import { bundleProductsOf } from "../lib/bundle";
import { loadCatalog } from "../lib/catalog";
import { loadContent } from "../lib/content/loadContent";
import { getText } from "../lib/content/server";
import { imageOf, textOf } from "../lib/content/textOf";
import { loadCombos } from "../lib/deals";
import { profilesOf } from "../lib/seo";
import { jsonLd, organizationJsonLd, websiteJsonLd } from "@estoreclub/storefront";
import { siteInfo } from "@estoreclub/storefront/server";

/** The page's title and summary, in the shop's own words — see "Site texts". */
export async function generateMetadata() {
  const t = await getText();

  return {
    title: t("meta.home.title"),
    description: t("meta.home.description"),
    openGraph: {
      title: t("brand.name"),
      description: t("meta.home.ogDescription"),
      type: "website",
    },
  };
}

/** The badge that puts a product in "New arrivals" — the `BADGE` setting, as the shop typed it. */
const NEW_BADGE = "new";

/** The home page's deals band: two rows of six product cards (a bundle counts as two). */
const DEALS_BAND = 12;

/**
 * The home page, top to bottom: the hero, the category tiles, two promo cards, the new
 * arrivals, the deals (bundles, then products on a discount rule), the audio banner, four
 * promises, the trade-in card. Everything is read here, on the server; the product and bundle
 * cards are the only islands.
 */
export default async function Page() {
  const [site, content, catalog, combos] = await Promise.all([
    siteInfo(),
    loadContent(),
    loadCatalog(),
    loadCombos(),
  ]);
  const t = textOf(content);
  const fresh = catalog.products.filter(
    (product) => product.badge.toLowerCase() === NEW_BADGE,
  );
  // A shop that marked nothing new still shows its first six.
  const arrivals = fresh.length > 0 ? fresh : catalog.products;
  const tiles = catalog.categories.filter(
    (category) => category.products.length > 0,
  );
  // On a deal and still for sale: a sold-out product is no offer, wherever else it is shown.
  const onDeal = catalog.products.filter(
    (product) => product.deal && !product.soldOut,
  );

  const name = (site && site.siteName) || t("brand.name");
  // The shop as search engines describe it: the organisation (its logo, its profiles) with a few
  // of what it sells, and the site itself. No search box is declared - the header's search is a
  // panel with no address of its own for a search engine to send a query to.
  const structured = [
    {
      ...organizationJsonLd({
        name,
        logo: imageOf(content, "logo") || undefined,
        sameAs: profilesOf(content.links.social),
      }),
      description: t("meta.site.description"),
      makesOffer: arrivals.slice(0, 6).map((product) => ({
        "@type": "Offer",
        price: product.price,
        priceCurrency: site?.currency || "USD",
        itemOffered: {
          "@type": "Product",
          name: product.name,
          description: product.spec,
        },
      })),
    },
    websiteJsonLd({ name }),
  ];

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: jsonLd(structured) }}
        type="application/ld+json"
      />
      <Hero
        image={imageOf(content, "hero")}
        learnMore={tiles[0] ? "/shop#" + tiles[0].slug : "/shop"}
        t={t}
      />
      <CategoryTiles categories={tiles} label={t("categories.label")} />
      <PromoCards
        gaming={imageOf(content, "promo-gaming")}
        t={t}
        tablets={imageOf(content, "promo-tablets")}
      />
      <NewArrivals
        products={arrivals}
        title={t("arrivals.title")}
        viewAll={t("arrivals.viewAll")}
      />
      <DealsSection
        bundleProducts={bundleProductsOf(combos, catalog.products)}
        combos={combos}
        id="deals"
        limit={DEALS_BAND}
        products={onDeal}
        t={t}
        viewAll="/shop#deals"
      />
      <AudioBanner image={imageOf(content, "promo-audio")} t={t} />
      <Features t={t} />
      <TradeIn image={imageOf(content, "promo-trade-in")} t={t} />
    </main>
  );
}
