import type { Post } from "./types";

// Sample posts shown ONLY while the database is not connected.
const now = "2026-01-01T00:00:00.000Z";
const base = {
  featured_image: "", image_alt: "", tags: [], author_name: "MyWorkAgency Team", author_image: "", author_bio: "",
  status: "published" as const, meta_title: "", meta_description: "", focus_keyword: "", canonical_url: "",
  og_title: "", og_description: "", og_image: "", noindex: false, created_at: now, updated_at: now,
};

export const SEED_POSTS: Post[] = [
  {
    ...base,
    id: "seed-post-1",
    slug: "sample-how-to-plan-a-content-calendar",
    title: "Sample: How to plan a content calendar that works",
    excerpt: "A placeholder article. Write your real blogs from Admin > Blog.",
    content:
      "## Why a calendar matters\n\nThis is sample content shown until the database is connected. Write and publish real articles from the admin panel.\n\n## Start with goals\n\nPick one number that matters, then plan content around it.\n\n- Decide the channels\n- Set a posting rhythm\n- Review results monthly\n\n### Keep it simple\n\nA calendar you actually follow beats a perfect one you ignore.",
    category: "Social Media",
    tags: ["content", "planning"],
    featured: true,
    published_at: "2026-01-01T00:00:00.000Z",
  },
  {
    ...base,
    id: "seed-post-2",
    slug: "sample-seo-basics-for-new-websites",
    title: "Sample: SEO basics for new websites",
    excerpt: "A placeholder article. Write your real blogs from Admin > Blog.",
    content: "## Start here\n\nSample content shown until the database is connected.\n\n## Technical basics\n\nFast pages, clean URLs and useful content.",
    category: "SEO",
    tags: ["seo"],
    featured: false,
    published_at: "2025-12-20T00:00:00.000Z",
  },
];
