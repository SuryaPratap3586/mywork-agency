import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import BlogCard, { PostCover, formatDate } from "@/components/blog/BlogCard";
import { POSTS_PER_PAGE, getBlogCategories, getFeaturedPosts, getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on digital marketing, SEO, design and development.",
  alternates: { canonical: "/blog" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

function href(params: { q?: string; category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export default async function BlogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q).slice(0, 60);
  const category = one(sp.category).slice(0, 60);
  const page = Math.min(500, Math.max(1, parseInt(one(sp.page) || "1", 10) || 1));
  const filtering = Boolean(q || category);

  const [{ posts, total }, categories, featured] = await Promise.all([
    getPublishedPosts({ q, category, page }),
    getBlogCategories(),
    !filtering && page === 1 ? getFeaturedPosts(1) : Promise.resolve([]),
  ]);

  const lead = featured[0];
  const list = lead ? posts.filter((p) => p.id !== lead.id) : posts;
  const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      on
        ? "border-transparent bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] text-white shadow-[0_8px_20px_-8px_rgba(91,70,255,0.6)]"
        : "border-[#E4E7F5] bg-white text-[#4B5275] hover:border-[#7C3AED]/40 hover:text-[#0F1330]"
    }`;

  return (
    <main>
      <PageHero title="Insights and guides" description="Practical advice on digital marketing, SEO, design and development.">
        <form action="/blog" method="get" role="search" className="flex max-w-xl gap-3">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="blog-q" className="sr-only">Search articles</label>
          <input
            id="blog-q"
            name="q"
            defaultValue={q}
            maxLength={60}
            placeholder="Search articles"
            className="min-w-0 flex-1 rounded-full border border-[#D9DDF3] bg-white px-5 py-3 text-[15px] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
          />
          <button type="submit" className="rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-6 py-3 text-[15px] font-semibold text-white">Search</button>
        </form>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2.5" aria-label="Filter by category">
            <Link href={href({ q })} className={chip(!category)}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={href({ q, category: c })} className={chip(category === c)} aria-current={category === c ? "true" : undefined}>{c}</Link>
            ))}
          </div>
        )}

        {lead && (
          <Reveal className="mt-10">
            <Link href={`/blog/${lead.slug}`} className="group grid overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white shadow-[0_20px_60px_-30px_rgba(60,70,200,0.4)] md:grid-cols-2">
              <PostCover post={lead} priority sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10] md:aspect-auto md:min-h-[320px]" />
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="w-fit rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#3B5BFF]">Featured · {lead.category}</span>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-[#0F1330]">{lead.title}</h2>
                <p className="mt-4 text-[#4B5275]">{lead.excerpt}</p>
                <p className="mt-5 text-sm text-[#8A90B0]">{lead.author_name} · {formatDate(lead.published_at)}</p>
              </div>
            </Link>
          </Reveal>
        )}

        {list.length === 0 && !lead ? (
          <p className="mt-12 text-[#4B5275]">{filtering ? "No articles match your search." : "Articles will appear here soon."}</p>
        ) : (
          <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <li key={p.id}><Reveal delay={(i % 3) * 0.07} className="h-full"><BlogCard post={p} priority={i < 3 && !lead} /></Reveal></li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && <Link href={href({ q, category, page: page - 1 })} className={chip(false)} rel="prev">Previous</Link>}
            {Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((n) => (
              <Link key={n} href={href({ q, category, page: n })} className={chip(n === page)} aria-current={n === page ? "page" : undefined}>{n}</Link>
            ))}
            {page < pages && <Link href={href({ q, category, page: page + 1 })} className={chip(false)} rel="next">Next</Link>}
          </nav>
        )}
      </section>
    </main>
  );
}
