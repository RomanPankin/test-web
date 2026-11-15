import type { ReactNode } from "react";

/**
 * The shop's terms, written in Markdown, drawn as text: headings, paragraphs, lists, bold,
 * italics and links. Only that - every character is a React text node, so raw HTML in the
 * text shows as typed and cannot put markup on the page; a link is kept only to an http(s),
 * mailto or same-site address.
 */
export function TermsText({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-2 text-[13px] leading-relaxed text-ink">
      {blocksOf(markdown).map((block, index) => {
        if (block.kind === "heading") {
          return (
            <p key={index} className="pt-1 font-semibold">
              {inline(block.text)}
            </p>
          );
        }
        if (block.kind === "list") {
          const List = block.ordered ? "ol" : "ul";

          return (
            <List
              key={index}
              className={`space-y-1 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}
            >
              {block.items.map((item, at) => (
                <li key={at}>{inline(item)}</li>
              ))}
            </List>
          );
        }

        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}

type Block =
  | { kind: "heading" | "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

const HEADING = /^#{1,6}\s+(.*)$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function blocksOf(markdown: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (const raw of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const heading = HEADING.exec(line);
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);

    if (!line.trim() || /^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      flush();
    } else if (heading) {
      flush();
      blocks.push({ kind: "heading", text: heading[1] });
    } else if (bullet || numbered) {
      flush();
      const ordered = Boolean(numbered);
      const last = blocks[blocks.length - 1];
      const item = (bullet ?? numbered)![1];

      if (last?.kind === "list" && last.ordered === ordered) last.items.push(item);
      else blocks.push({ kind: "list", ordered, items: [item] });
    } else {
      paragraph.push(line.trim());
    }
  }
  flush();

  return blocks;
}

const INLINE = /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Bold, italics and links in one line of text. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let at = 0;

  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;

    if (index > at) out.push(text.slice(at, index));
    const [, bold, bold2, italic, italic2, label, href] = match;

    if (bold ?? bold2) {
      out.push(<strong key={index}>{inline(bold ?? bold2)}</strong>);
    } else if (italic ?? italic2) {
      out.push(<em key={index}>{inline(italic ?? italic2)}</em>);
    } else if (label && /^(https?:\/\/|mailto:|\/(?!\/))/i.test(href)) {
      out.push(
        <a
          key={index}
          className="text-brand underline underline-offset-2"
          href={href}
          rel="noreferrer noopener"
          target="_blank"
        >
          {label}
        </a>,
      );
    } else {
      out.push(label ?? match[0]);
    }
    at = index + match[0].length;
  }
  if (at < text.length) out.push(text.slice(at));

  return out;
}
