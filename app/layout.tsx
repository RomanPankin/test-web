import type { ReactNode } from "react";

// Imported for its side effect: it gives the API client this site's key before anything reads.
// In the layout because the layout wraps every route, so no page has to remember to.
import "../lib/configureApi";
import { AccountButton } from "../components/account/AccountButton";
import { AccountDialog } from "../components/account/AccountDialog";
import { CartButton } from "../components/CartButton";
import { CartDrawer } from "../components/CartDrawer";
import { CheckoutReturn } from "../components/CheckoutReturn";
import { ContentSeed } from "../components/ContentProvider";
import { HeaderShadow } from "../components/HeaderShadow";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { SearchButton } from "../components/SearchButton";
import { MobileNav } from "../components/MobileNav";
import { MoneySeed } from "../components/MoneySeed";
import { ProductFromUrl } from "../components/product/ProductFromUrl";
import { ProductImagesSeed } from "../components/ProductImagesSeed";
import { ScrollToTop } from "../components/ScrollToTop";
import { SiteFooter } from "../components/SiteFooter";
import { TopStrip } from "../components/TopStrip";
import { Toaster } from "../components/Toaster";
import { UpsellSeed } from "../components/UpsellSeed";
import { VocabularySeed } from "../components/VocabularySeed";
import { loadCatalog } from "../lib/catalog";
import { colourVocabulary } from "../lib/colourVocabulary";
import { loadCombos } from "../lib/deals";
import { hasDeals, navLinksOf } from "../lib/navLinks";
import { loadContent } from "../lib/content/loadContent";
import { imageOf, textOf } from "../lib/content/textOf";
import { BrandMark } from "../components/BrandMark";
import { currentLanguage } from "@estoreclub/storefront/server";
import { FRAME } from "../lib/layout";
import { signInConfigOf } from "@estoreclub/storefront";
import { loadTerms } from "@estoreclub/storefront/server";
import { TermsSeed } from "../components/account/TermsSeed";
import { signInRequired } from "@estoreclub/storefront/server";
import { SignInGate } from "../components/account/SignInGate";
import { siteInfo } from "@estoreclub/storefront/server";
import "./globals.css";

// The layout, as in the App Router: it wraps the page and holds what every screen shares. An
// async SERVER component, so it reads the shop's currency, words and catalogue itself.
//
// Metadata declared here is a DEFAULT — a page's own `metadata` replaces it.
export async function generateMetadata() {
  const content = await loadContent();
  const t = textOf(content);

  return {
    title: content.brand || undefined,
    description: t("meta.site.description") || undefined,
    // Installable: "Add to Home Screen" opens the site full screen, like an app.
    pwa: {
      name: content.brand || undefined,
      description: t("meta.site.description") || undefined,
      themeColor: "#ffffff",
      backgroundColor: "#ffffff",
    },
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  // Together: none depends on another, and awaiting them in turn would make every page load
  // pay for each round trip end to end.
  const [site, content, language, catalog, combos] = await Promise.all([
    siteInfo(),
    loadContent(),
    currentLanguage(),
    loadCatalog(),
    loadCombos(),
  ]);
  const t = textOf(content);
  // A shop that shows itself to signed-in customers only, to a guest: the sign-in in place of
  // every page, and nothing of the shop around it - no links, search or bag.
  const gated = await signInRequired(site);
  // The shop's categories (and "Deals" while it has any) - see `lib/navLinks.ts`.
  const nav = gated
    ? []
    : navLinksOf(
        catalog.categories,
        hasDeals(combos, catalog.products) ? t("nav.deals") : null,
      );
  // The categories are the shop's, so how many and how long is not known here: a row longer
  // than the sample's (or in longer words - "Носимые устройства") would run under the logo or
  // the icons on a laptop, so it waits for `xl` and stays in the menu until then. A rough
  // measure in characters, since nothing can be measured on the server.
  const wideNav =
    nav.length > 7 || nav.reduce((sum, link) => sum + link.label.length, 0) > 56;
  // The shop's own pages - About, Delivery & returns, FAQ, Track order: over the header from
  // `lg` (`TopStrip`), under the categories in the phone's menu.
  const pages = gated ? [] : (content.links.pages ?? []);
  const delivers = site?.orderTypes?.includes("delivery") ?? false;
  /** The shop's sign-in, when it lets customers sign in — null hides the account button. */
  const signIn = signInConfigOf(site);
  // The terms a customer accepts, while the shop asks them to - for the onboarding step. Read
  // here, on the server, where the API key is.
  const terms = signIn ? await loadTerms() : null;
  // What the prices are written in — seeded into the client modules that print one.
  const currency = site
    ? {
        code: site.currency,
        symbol: site.currencySymbol,
        position: site.currencySymbolPosition,
        // Whose dollar to name: none to a visitor in the shop's own country.
        country: site.countryCode,
        viewer: site.visitorCountry,
      }
    : null;
  // Every product's photo, for a bag line or a past order the server names only by id.
  const productImages = Object.fromEntries(
    catalog.products.map((product) => [product.id, product.image]),
  );
  // Each bundle's own cover, for its line in the bag - only the bundles the shop photographed;
  // the rest are drawn from their picks' photos.
  const comboCovers = Object.fromEntries(
    combos.flatMap((combo) =>
      combo.images[0] ? [[combo.id, combo.images[0]]] : [],
    ),
  );
  // Every product's colours, as the shared bag's "sizes" - so a line says its colour and is sent
  // with its variant (`lib/colourVocabulary.ts`). Here rather than on a page: the bag is on every
  // page, and a reload must still describe the lines already in it.
  const vocabularies = Object.fromEntries(
    catalog.products.map((product) => [product.id, colourVocabulary(product)]),
  );
  // What the bag offers to "complete your order" with: the accessories, found by the
  // category's name (in English or Russian, as the sample is written).
  const upsell =
    catalog.categories.find((category) =>
      /accessor|аксессуар/i.test(category.name),
    )?.products ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-page font-sans text-ink antialiased">
      {/* Seeds FIRST, before any island that reads them: content and money reach islands through
          module singletons, not React context (context does not cross island roots). */}
      <ContentSeed content={content} />
      {/* The shop's terms, for the onboarding step - seeded before the account islands. */}
      <TermsSeed terms={terms} />
      <MoneySeed currency={currency} locale={language} />
      <ProductImagesSeed comboCovers={comboCovers} images={productImages} />
      <VocabularySeed vocabularies={vocabularies} />
      <UpsellSeed items={upsell} />
      <ScrollToTop />
      {/* The typeface, loaded here so React hoists the <link> into <head> on every page — a
          remote `@import` in globals.css is dropped at compile time. */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <TopStrip
        delivery={delivers && !gated ? t("delivery.strip") : ""}
        links={pages}
      />

      {/* Sticky at the top (only /shop's category bar sticks too, under it). A plain SERVER header: the shadow it grows on
          scroll is added by `HeaderShadow`, a childless island that toggles a class by id. */}
      <header
        className="sticky top-0 z-30 border-b border-line/70 bg-white/95 backdrop-blur-sm transition-shadow duration-200"
        id="site-header"
      >
        <div className={FRAME + " relative flex h-14 items-center"}>
          <MobileNav
            current={language}
            languages={site?.languages ?? []}
            links={nav}
            pages={pages}
            signIn={!!signIn}
            wide={wideNav}
          />
          <a
            className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.03em] text-ink max-lg:ml-1"
            href="/"
          >
            <BrandMark className="h-7 w-7" src={imageOf(content, "logo")} />
            {content.brand}
          </a>

          <nav
            aria-label={t("nav.main")}
            className={
              "absolute left-1/2 hidden -translate-x-1/2 " +
              (wideNav ? "xl:block" : "lg:block")
            }
          >
            <ul className="flex items-center gap-7 xl:gap-10">
              {nav.map((link) => (
                <li key={link.label + link.url}>
                  <a
                    className="whitespace-nowrap text-[12.5px] text-ink/90 transition hover:text-brand"
                    href={link.url || "/shop"}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="-mr-2 ml-auto flex items-center gap-1 sm:gap-2">
            {/* The languages the shop writes in - on a phone they are in the menu instead. */}
            <span className="hidden sm:block">
              <LanguageSwitcher
                current={language}
                languages={site?.languages ?? []}
              />
            </span>
            {gated ? null : <SearchButton />}
            {gated ? null : <CartButton />}
            {/* Only where customers can sign in - the last thing on the row, after the bag. */}
            {signIn ? (
              <span className="hidden sm:block">
                <AccountButton />
              </span>
            ) : null}
          </div>
        </div>
      </header>
      <HeaderShadow />

      {/* OUTSIDE the header: an ancestor with a backdrop filter is the containing block for
          `position: fixed`, which would trap a full-height drawer inside the header strip. */}
      {gated ? null : (
        <CartDrawer
          delivers={delivers}
          paymentDiscounts={site?.paymentDiscounts ?? null}
          // Only with a way to sign in here — otherwise the server's refusal says it.
          requireSignIn={!!signIn && (site?.orderRequiresSignIn ?? false)}
          // What a QR code's `?orderType=` may choose for the checkout.
          orderTypes={site?.orderTypes ?? []}
        />
      )}
      {signIn ? <AccountDialog config={signIn} /> : null}
      {/* Where the payment page sends the shopper back to — see the file. */}
      <CheckoutReturn />
      <Toaster />

      <div className="flex-1">
        {gated ? <SignInGate access={gated} /> : children}
      </div>
      {/* After the page, so its cards have rendered: they hand the product over without a
          read - `?product=PR-12`, or the id a QR code carries. */}
      {gated ? null : <ProductFromUrl />}

      <SiteFooter
        current={language}
        languages={site?.languages ?? []}
        nav={nav}
      />
    </div>
  );
}
