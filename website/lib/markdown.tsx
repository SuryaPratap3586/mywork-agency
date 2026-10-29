// Safe Markdown renderer. It builds React elements (never raw HTML), so authors cannot inject scripts.
// Supported: # ## ### headings, paragraphs, - lists, 1. lists, > quotes, ![alt](url "caption"), [link](url),
// **bold**, *italic*, `code`, ``` code blocks, --- divider.
import type { ReactNode } from "react";
import { slugify } from "./slug";

type Block =
  | { type: "h"; level: 1 | 2 | 3; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "img"; alt: string; src: string; caption: string }
  | { type: "code"; text: string }
  | { type: "hr" };

export type TocItem = { id: string; text: string; level: 1 | 2 | 3 };

function safeHref(raw: string): string | null {
  const u = raw.trim();
  if (/^https?:\/\//i.test(u) || /^mailto:/i.test(u)) return u;
  if ((u.startsWith("/") && !u.startsWith("//")) || u.startsWith("#")) return u;
  return null;
}

function safeImageSrc(raw: string): string | null {
  const u = raw.trim();
  if (/^https:\/\//i.test(u)) return u;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  return null;
}

const STARTS_BLOCK = /^(#{1,3}\s|```|>|\s*[-*]\s|\s*\d+\.\s|!\[)/;

export function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: Block[] = [];
  const used = new Map<string, number>();
  const uniqueId = (text: string) => {
    const base = slugify(text) || "section";
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      out.push({ type: "code", text: buf.join("\n") });
      continue;
    }

    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      const text = h[2].trim();
      out.push({ type: "h", level: h[1].length as 1 | 2 | 3, text, id: uniqueId(text) });
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { out.push({ type: "hr" }); i++; continue; }

    const img = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/.exec(line.trim());
    if (img) { out.push({ type: "img", alt: img[1], src: img[2], caption: img[3] ?? "" }); i++; continue; }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push({ type: "quote", text: buf.join(" ") });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push({ type: "ul", items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push({ type: "ol", items });
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !STARTS_BLOCK.test(lines[i])) { buf.push(lines[i]); i++; }
    out.push({ type: "p", text: buf.join(" ") });
  }
  return out;
}

export function extractToc(md: string): TocItem[] {
  return parseBlocks(md)
    .filter((b): b is Extract<Block, { type: "h" }> => b.type === "h")
    .map((b) => ({ id: b.id, text: b.text, level: b.level }));
}

export function readingTime(md: string): number {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((part, idx) => {
    const key = `${keyBase}-${idx}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={key} className="font-semibold text-[#0F1330]">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return <code key={key} className="rounded bg-[#EEF0FF] px-1.5 py-0.5 text-[0.9em] text-[#3B3FD0]">{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={key}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = safeHref(link[2]);
      if (!href) return <span key={key}>{link[1]}</span>;
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          key={key}
          href={href}
          className="font-medium text-[#3B5BFF] underline decoration-[#3B5BFF]/30 underline-offset-2 hover:decoration-[#3B5BFF]"
          {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
        >
          {link[1]}
        </a>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className="space-y-5 text-[17px] leading-8 text-[#3B4160]">
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case "h": {
            // "#" is rendered as <h2> so every page keeps a single <h1> (the post title).
            const cls =
              b.level === 3
                ? "mt-8 text-xl font-bold"
                : b.level === 2
                  ? "mt-10 text-2xl font-bold"
                  : "mt-12 text-3xl font-bold";
            const Tag = b.level === 3 ? "h3" : "h2";
            return (
              <Tag key={key} id={b.id} className={`${cls} scroll-mt-28 font-[family-name:var(--font-display)] tracking-tight text-[#0F1330]`}>
                {inline(b.text, key)}
              </Tag>
            );
          }
          case "p":
            return <p key={key}>{inline(b.text, key)}</p>;
          case "ul":
            return (
              <ul key={key} className="list-disc space-y-2 pl-6 marker:text-[#7C3AED]">
                {b.items.map((it, j) => <li key={j}>{inline(it, `${key}-${j}`)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#7C3AED]">
                {b.items.map((it, j) => <li key={j}>{inline(it, `${key}-${j}`)}</li>)}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={key} className="rounded-r-2xl border-l-4 border-[#7C3AED] bg-[#F5F3FF] px-6 py-4 italic text-[#0F1330]">
                {inline(b.text, key)}
              </blockquote>
            );
          case "img": {
            const src = safeImageSrc(b.src);
            if (!src) return null;
            return (
              <figure key={key} className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={b.alt} loading="lazy" referrerPolicy="no-referrer" className="w-full rounded-2xl border border-[#E4E7F5]" />
                {b.caption && <figcaption className="mt-2 text-center text-sm text-[#8A90B0]">{b.caption}</figcaption>}
              </figure>
            );
          }
          case "code":
            return (
              <pre key={key} className="overflow-x-auto rounded-2xl bg-[#0F1330] p-5 text-sm leading-6 text-[#E4E7F5]">
                <code>{b.text}</code>
              </pre>
            );
          case "hr":
            return <hr key={key} className="my-10 border-[#E4E7F5]" />;
        }
      })}
    </div>
  );
}
