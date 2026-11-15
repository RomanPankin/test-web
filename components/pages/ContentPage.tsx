import type { ReactNode } from "react";

/**
 * A page of words: a title, a line under it, and whatever the page has to say.
 *
 * The delivery terms, the questions, the legal pages — the parts of a shop that are read
 * once and never again, and which every site needs anyway. They share this shell so they
 * read as one site rather than four, and so a shop rewording them in its own lists does not
 * have to think about layout at all.
 *
 * Deliberately plain: no photograph, no accent band. These pages are reached from the footer
 * by somebody looking for one specific fact, and decoration between them and it is in the
 * way. The measure is held at 68 characters, which is where prose stops being comfortable.
 */
export function ContentPage({
  title,
  intro,
  children,
}: {
  title: string;
  /** One sentence saying what the page covers. */
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-10 xl:px-[72px]">
      <header className="max-w-[68ch]">
        <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.04em] text-ink sm:text-[42px]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-4 text-[15.5px] leading-[1.65] text-muted">{intro}</p>
        ) : null}
      </header>

      <div className="mt-10 max-w-[68ch]">{children}</div>
    </main>
  );
}

/** One titled block of prose. The pages are lists of these. */
export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-9 first:mt-0">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h2>
      <div className="mt-2.5 text-[15px] leading-[1.7] text-muted">
        {children}
      </div>
    </section>
  );
}
