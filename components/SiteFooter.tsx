import type { PublicLanguage } from "@estoreclub/api";
import type { SiteLink } from "../lib/content/types";

import { loadContent } from "../lib/content/loadContent";
import { imageOf, textOf } from "../lib/content/textOf";
import { FRAME } from "../lib/layout";

import { BrandMark } from "./BrandMark";
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from "./Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PaymentMarks } from "./PaymentMarks";

/** A social profile's icon, by the link's label. A label it does not know gets none. */
const SOCIAL: Record<string, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  x: XIcon,
  twitter: XIcon,
};

/**
 * The footer on its light grey: the name and its line with the social icons, the shop's
 * categories and the support links - then the copyright with the ways to pay, the
 * language and the legal links. The categories are the header's (`lib/navLinks.ts`); every
 * other label is the shop's ("Site texts", "Site links"), and a column or line it has not
 * written is left out.
 */
export async function SiteFooter({
  current,
  languages,
  nav,
}: {
  current?: string;
  languages: PublicLanguage[];
  /** The shop's categories, as the header links them. */
  nav: SiteLink[];
}) {
  const content = await loadContent();
  const t = textOf(content);
  const links = content.links;
  const brand = content.brand;
  const tagline = t("brand.tagline");
  const social = (links.social ?? []).filter(
    (link) => link.url && SOCIAL[link.label.trim().toLowerCase()],
  );

  return (
    <footer className="mt-[29px] bg-soft">
      <div className={FRAME + " pb-[34px] pt-7 lg:pt-[23px]"}>
        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] xl:gap-x-0 xl:grid-cols-[358px_296px_1fr]">
          <div>
            <p className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-ink lg:mt-[7px] lg:text-[16px]">
              <BrandMark className="h-6 w-6" src={imageOf(content, "logo")} />
              {brand}
            </p>
            {tagline ? (
              <p className="mt-[3px] text-[12px] text-muted lg:text-[10.5px]">
                {tagline}
              </p>
            ) : null}
            {social.length > 0 ? (
              <ul
                aria-label={t("footer.social")}
                className="mt-[19px] flex items-center gap-[13px]"
              >
                {social.map((link) => {
                  const Icon = SOCIAL[link.label.trim().toLowerCase()];

                  return (
                    <li key={link.label}>
                      <a
                        aria-label={link.label}
                        className="grid h-[24px] w-[24px] place-items-center text-ink/80 transition hover:text-ink"
                        href={link.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Icon size={17} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <FooterColumn links={nav} title={t("footer.shop")} />
          <FooterColumn
            links={links.support ?? []}
            title={t("footer.support")}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t lg:mt-[17px] border-[#e6e8ee] pt-[13px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-[26px] gap-y-3">
            {/* "© 2026 . All rights reserved." says nothing: only with the shop's name. */}
            {brand ? (
              <p className="text-[11px] text-muted lg:text-[9.5px]">
                {t("footer.rights", { year: new Date().getFullYear() })}
              </p>
            ) : null}
            <PaymentMarks />
          </div>
          <div className="flex flex-wrap items-center gap-x-[26px] gap-y-2">
            <LanguageSwitcher up current={current} languages={languages} />
            {(links.legal ?? []).map((link) => (
              <a
                key={link.label}
                className="text-[11px] text-muted transition hover:text-ink lg:text-[9.5px]"
                href={link.url || "/terms"}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; url: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <p className="text-[12px] font-medium text-ink lg:text-[10.5px]">
        {title}
      </p>
      <ul className="mt-[3px]">
        {links.map((link) => (
          <li key={link.label + link.url}>
            <a
              className="block text-[12.5px] leading-[1.75] text-[#7a828f] transition hover:text-ink lg:text-[10.5px] lg:leading-[17.5px]"
              href={link.url || "/shop"}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
