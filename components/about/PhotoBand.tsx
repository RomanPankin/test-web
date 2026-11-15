import type { ReactNode } from "react";

import { Image } from "@estoreclub/client";

import { FRAME } from "../../lib/layout";

/**
 * A photograph with words on its left - the About page's hero, and the dark bands between its
 * sections. sample-asian's band, in TechStore's shape: a rounded card inside the page's frame,
 * like the home page's gaming and audio banners, rather than a full-bleed strip.
 *
 * The shade runs left to right: the words are on the left and the subject of the photo on the
 * right, so only the half that is read over is darkened. On a phone the words span the photo,
 * so the shade does too.
 *
 * A band is the shop's own photograph: without its "Site images" picture it is not drawn.
 *
 * `height` is a class rather than a number, because Tailwind emits only the class names it
 * finds written out - `h-[${n}px]` produces no CSS at all.
 */
export function PhotoBand({
  image,
  height,
  position = "70% 50%",
  priority = false,
  className = "",
  children,
}: {
  image: string;
  /** e.g. `lg:h-[460px]`. Below `lg` the band is as tall as its words. */
  height: string;
  /** Where the photo is anchored as the band narrows: keep the subject in frame. */
  position?: string;
  /** The page's hero, above the fold: loaded first rather than lazily. */
  priority?: boolean;
  /** Its spacing on the page. */
  className?: string;
  children: ReactNode;
}) {
  if (!image) return null;

  return (
    <section className={FRAME + " " + className}>
      <div
        className={
          "relative isolate flex items-center overflow-hidden rounded-[12px] bg-[#0b1018] " +
          height
        }
      >
        <Image
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          priority={priority}
          sizes="(min-width: 1440px) 1296px, 100vw"
          src={image}
          style={{ objectPosition: position }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,11,16,0.92)_0%,rgba(8,11,16,0.78)_32%,rgba(8,11,16,0.2)_62%,rgba(8,11,16,0)_78%)] max-lg:bg-none max-lg:bg-black/60"
        />
        <div className="max-w-[480px] px-7 py-14 sm:px-12 lg:px-[70px] lg:py-0">
          {children}
        </div>
      </div>
    </section>
  );
}
