import "server-only";
import { getDb, isDbConfigured } from "./supabase";
import { SEED_POSTS } from "./seed-posts";
import type { Post, PostSummary } from "./types";

export const POSTS_PER_PAGE = 9;

const LIST_COLS =
  "id,slug,title,excerpt,featured_image,image_alt,category,tags,author_name,author_image,author_bio,status,featured,published_at,meta_title,meta_description,focus_keyword,canonical_url,og_title,og_description,og_image,noindex,created_at,updated_at";

const strip = (p: Post): PostSummary => {
  const { content: _content, ...rest } = p;
  void _content;
  return rest;
};

/** Only letters, numbers, spaces and dashes reach the query filter (blocks filter injection). */
function cleanQuery(q: string) {
  return q.replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60);
}

function visibleSeed() {
  const now = Date.now();
  return SEED_POSTS.filter((p) => p.published_at && new Date(p.published_at).getTime() <= now);
}

export async function getPublishedPosts(opts: { q?: string; category?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const q = cleanQuery(opts.q ?? "");
  const category = (opts.category ?? "").trim();

  if (!isDbConfigured()) {
    let list = visibleSeed();
    if (category) list = list.filter((p) => p.category === category);
    if (q) list = list.filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase()));
    return { posts: list.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map(strip), total: list.length };
  }

  let query = getDb()
    .from("posts")
    .select(LIST_COLS, { count: "exact" })
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());
  if (category) query = query.eq("category", category);
  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,category.ilike.%${q}%`);
  const ranged = query
    .order("published_at", { ascending: false })
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  const { data, count, error } = await ranged;
  if (error) {
    console.error("getPublishedPosts", error.message);
    return { posts: [] as PostSummary[], total: 0 };
  }
  return { posts: (data ?? []) as unknown as PostSummary[], total: count ?? 0 };
}

export async function getFeaturedPosts(limit = 2): Promise<PostSummary[]> {
  if (!isDbConfigured()) return visibleSeed().filter((p) => p.featured).slice(0, limit).map(strip);
  const { data, error } = await getDb()
    .from("posts")
    .select(LIST_COLS)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as unknown as PostSummary[];
}

export async function getLatestPosts(limit = 3): Promise<PostSummary[]> {
  return (await getPublishedPosts({ page: 1 })).posts.slice(0, limit);
}

export async function getBlogCategories(): Promise<string[]> {
  if (!isDbConfigured()) return [...new Set(visibleSeed().map((p) => p.category))];
  const { data, error } = await getDb()
    .from("posts")
    .select("category")
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());
  if (error) return [];
  return [...new Set((data ?? []).map((r) => r.category as string))].sort();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  if (!isDbConfigured()) return visibleSeed().find((p) => p.slug === slug) ?? null;
  const { data, error } = await getDb()
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) return null;
  return (data as Post | null) ?? null;
}

export async function getRelatedPosts(post: Pick<Post, "id" | "category">, limit = 3): Promise<PostSummary[]> {
  if (!isDbConfigured()) return visibleSeed().filter((p) => p.id !== post.id).slice(0, limit).map(strip);
  const { data, error } = await getDb()
    .from("posts")
    .select(LIST_COLS)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(30);
  if (error) return [];
  const all = (data ?? []) as unknown as PostSummary[];
  const same = all.filter((p) => p.category === post.category);
  return [...same, ...all.filter((p) => p.category !== post.category)].slice(0, limit);
}

export async function getAllPostSlugs(): Promise<{ slug: string; updated_at: string; noindex: boolean }[]> {
  if (!isDbConfigured()) return visibleSeed().map((p) => ({ slug: p.slug, updated_at: p.updated_at, noindex: p.noindex }));
  const { data, error } = await getDb()
    .from("posts")
    .select("slug,updated_at,noindex")
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());
  if (error) return [];
  return (data ?? []) as { slug: string; updated_at: string; noindex: boolean }[];
}
