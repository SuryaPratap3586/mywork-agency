import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard, { PostCover, formatDate } from "@/components/blog/BlogCard";
import { Markdown, extractToc, readingTime } from "@/lib/markdown";
import { getContent } from "@/lib/content";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };
const SITE = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  // Sensible defaults when optional SEO fields are blank.
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const image = post.og_image || post.featured_image;
  return {
    title,
    description,
    keywords: post.focus_keyword ? [post.focus_keyword, ...post.tags] : post.tags,
    alternates: { canonical: post.canonical_url || `/blog/${post.slug}` },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: post.og_title || title,
      description: post.og_description || description,
      images: image ? [{ url: image, alt: post.image_alt || post.title }] : undefined,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags,
    },
    twitter: { card: image ? "summary_large_image" : "summary" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const [related, settings] = await Promise.all([getRelatedPosts(post, 3), getContent("settings")]);
  const toc = extractToc(post.content);
  const url = `${SITE()}/blog/${post.slug}`;
  const enc = encodeURIComponent;
  const shares = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${post.title} ${url}`)}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.og_image || post.featured_image || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: settings.company_name },
    mainEntityOfPage: url,
    keywords: post.tags.join(", ") || undefined,
  };

  const initials = post.author_name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const ctaHref = settings.email ? `mailto:${settings.email}` : "/work";

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative overflow-hidden border-b border-[#E4E7F5] bg-white pb-12 pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#7C3AED]/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <Link href="/blog" className="text-sm font-semibold text-[#3B5BFF] hover:underline">← All articles</Link>
          <p className="mt-6"><span className="rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#3B5BFF]">{post.category}</span></p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#0F1330]">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#4B5275]">{post.excerpt}</p>
          <div className="mt-7 flex items-center gap-3 text-sm text-[#4B5275]">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E4E7F5]">
              {post.author_image ? <Image src={post.author_image} alt={post.author_name} fill sizes="40px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] text-xs font-bold text-white">{initials}</span>}
            </span>
            <span><span className="font-semibold text-[#0F1330]">{post.author_name}</span><br />{formatDate(post.published_at)} · {readingTime(post.content)} min read</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article>
          <div className="overflow-hidden rounded-3xl border border-[#E4E7F5]">
            <PostCover post={post} priority sizes="(min-width: 1024px) 740px, 100vw" className="aspect-[16/9]" />
          </div>

          <div className="mt-10"><Markdown source={post.content} /></div>

          {post.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => <li key={t} className="rounded-full border border-[#E4E7F5] bg-white px-3 py-1 text-sm text-[#4B5275]">#{t}</li>)}
            </ul>
          )}

          <div className="mt-12 flex gap-5 rounded-3xl border border-[#E4E7F5] bg-[#FAFAFE] p-6">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#E4E7F5]">
              {post.author_image ? <Image src={post.author_image} alt={post.author_name} fill sizes="64px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] text-lg font-bold text-white">{initials}</span>}
            </span>
            <div>
              <p className="text-sm text-[#8A90B0]">Written by</p>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330]">{post.author_name}</p>
              {post.author_bio && <p className="mt-1 text-[15px] leading-relaxed text-[#4B5275]">{post.author_bio}</p>}
            </div>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          {toc.length > 0 && (
            <nav aria-label="Table of contents" className="rounded-3xl border border-[#E4E7F5] bg-white p-6">
              <p className="font-[family-name:var(--font-display)] font-bold text-[#0F1330]">On this page</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {toc.map((t) => (
                  <li key={t.id} className={t.level === 3 ? "pl-4" : ""}>
                    <a href={`#${t.id}`} className="text-[#4B5275] transition-colors hover:text-[#3B5BFF]">{t.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="rounded-3xl border border-[#E4E7F5] bg-white p-6">
            <p className="font-[family-name:var(--font-display)] font-bold text-[#0F1330]">Share this article</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shares.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#E4E7F5] px-3.5 py-1.5 text-sm font-medium text-[#4B5275] transition-colors hover:border-[#7C3AED]/40 hover:text-[#3B5BFF]">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] p-6 text-white">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold">Want help growing your business?</p>
            <p className="mt-2 text-sm text-white/85">Talk to our team about your goals.</p>
            <Link href={ctaHref} className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#3B2FD0]">{settings.email ? "Email us" : "See our work"}</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[#E4E7F5] bg-[#FAFAFE]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">Related articles</h2>
            <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <li key={p.id}><BlogCard post={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
