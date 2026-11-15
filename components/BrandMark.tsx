import { Image } from "@estoreclub/client";

/**
 * The shop's logo picture (`logo` in its site images) before its name - in the header, the
 * footer. None when the shop has no logo: the name alone is the wordmark.
 */
export function BrandMark({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  if (!src) return null;

  return (
    <Image
      alt=""
      className={"block shrink-0 object-contain " + className}
      sizes="64px"
      src={src}
    />
  );
}
