import { z } from "zod";
import { CATEGORY_VALUES } from "./categories";

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Only http(s) URLs: blocks javascript:, data:, file: etc.
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((u) => /^https?:\/\//i.test(u), "Only http(s) links are allowed");

const httpsImage = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((u) => u.startsWith("https://"), "Images must use https");

export const projectInput = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().max(100).regex(slugRe, "Use lowercase letters, numbers and dashes"),
  category: z.enum(CATEGORY_VALUES),
  client_name: z.string().trim().max(120).default(""),
  industry: z.string().trim().max(80).default(""),
  summary: z.string().trim().min(10).max(300),
  description: z.string().trim().max(8000).default(""),
  cover_image: httpsImage.or(z.literal("")).default(""),
  gallery: z.array(httpsImage).max(12).default([]),
  results: z
    .array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(30) }))
    .max(6)
    .default([]),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
  project_url: httpUrl.or(z.literal("")).default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
  meta_title: z.string().trim().max(70).default(""),
  meta_description: z.string().trim().max(170).default(""),
});

export type ProjectInput = z.infer<typeof projectInput>;

export const projectPatch = z
  .object({ published: z.boolean().optional(), featured: z.boolean().optional() })
  .strict();

export const loginInput = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export const uuid = z.string().uuid();

/* ---------------- Blog ---------------- */

const optHttps = httpsImage.or(z.literal("")).default("");
const optHttp = httpUrl.or(z.literal("")).default("");
const slugField = z.string().trim().toLowerCase().max(100).regex(slugRe, "Use lowercase letters, numbers and dashes");

export const postInput = z
  .object({
    title: z.string().trim().min(3).max(160),
    slug: slugField,
    excerpt: z.string().trim().min(10).max(400),
    content: z.string().max(60000).default(""),
    featured_image: optHttps,
    image_alt: z.string().trim().max(160).default(""),
    category: z.string().trim().min(1).max(60).default("General"),
    tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
    author_name: z.string().trim().min(1).max(80).default("MyWorkAgency Team"),
    author_image: optHttps,
    author_bio: z.string().trim().max(300).default(""),
    status: z.enum(["draft", "published", "scheduled"]).default("draft"),
    featured: z.boolean().default(false),
    published_at: z.string().datetime().nullable().default(null),
    meta_title: z.string().trim().max(70).default(""),
    meta_description: z.string().trim().max(170).default(""),
    focus_keyword: z.string().trim().max(80).default(""),
    canonical_url: optHttp,
    og_title: z.string().trim().max(90).default(""),
    og_description: z.string().trim().max(200).default(""),
    og_image: optHttps,
    noindex: z.boolean().default(false),
  })
  .refine((v) => v.status !== "scheduled" || Boolean(v.published_at), {
    message: "Pick a publish date for scheduled posts",
    path: ["published_at"],
  })
  .transform((v) => ({
    ...v,
    published_at: v.status === "draft" ? v.published_at : (v.published_at ?? new Date().toISOString()),
  }));

export const postPatch = z
  .object({ status: z.enum(["draft", "published"]).optional(), featured: z.boolean().optional() })
  .strict();

/* ---------------- Testimonials ---------------- */

export const testimonialInput = z.object({
  client_name: z.string().trim().min(2).max(80),
  designation: z.string().trim().max(80).default(""),
  company: z.string().trim().max(80).default(""),
  review: z.string().trim().min(10).max(1000),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  photo_url: optHttps,
  company_logo: optHttps,
  sort_order: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export const publishPatch = z.object({ published: z.boolean() }).strict();

/* ---------------- Careers ---------------- */

const lines = z.array(z.string().trim().min(1).max(240)).max(15).default([]);

export const jobInput = z.object({
  slug: slugField,
  title: z.string().trim().min(3).max(120),
  department: z.string().trim().max(80).default(""),
  location: z.string().trim().max(80).default(""),
  employment_type: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Remote"]).default("Full-time"),
  summary: z.string().trim().min(10).max(300),
  description: z.string().max(8000).default(""),
  responsibilities: lines,
  requirements: lines,
  status: z.enum(["open", "closed"]).default("open"),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const jobPatch = z
  .object({ status: z.enum(["open", "closed"]).optional(), published: z.boolean().optional() })
  .strict();

export const applicationInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).default(""),
  job_id: z.string().uuid().nullable().default(null),
  cover_letter: z.string().trim().max(3000).default(""),
});

export const applicationPatch = z
  .object({
    status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired"]).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strict();

/* ---------------- Page content ---------------- */

const short = (n: number) => z.string().trim().max(n).default("");
const longText = (n: number) => z.string().trim().max(n).default("");

export const homeContentSchema = z.object({
  badge: short(80),
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(10).max(300),
  primary_label: z.string().trim().min(1).max(40),
  primary_href: z.string().trim().max(200).regex(/^(\/|https?:\/\/|mailto:)/, "Use /page, https:// or mailto:"),
  secondary_label: short(40),
  secondary_href: z.string().trim().max(200).regex(/^(\/|https?:\/\/|mailto:)/, "Use /page, https:// or mailto:").or(z.literal("")).default(""),
  stats: z
    .array(
      z.object({
        value: z.number().min(0).max(1_000_000),
        decimals: z.number().int().min(0).max(2).default(0),
        prefix: short(4),
        suffix: short(6),
        label: z.string().trim().min(1).max(40),
      }),
    )
    .max(4)
    .default([]),
});

export const aboutContentSchema = z.object({
  hero_title: z.string().trim().min(3).max(120),
  hero_description: longText(300),
  story_title: z.string().trim().min(1).max(80),
  story: longText(4000),
  story_image: optHttps,
  mission: longText(800),
  vision: longText(800),
  values: z.array(z.object({ title: z.string().trim().min(1).max(60), text: z.string().trim().max(240).default("") })).max(8).default([]),
  stats: z
    .array(z.object({ value: z.number().min(0).max(1_000_000), suffix: short(6), label: z.string().trim().min(1).max(40) }))
    .max(6)
    .default([]),
  team: z
    .array(z.object({ name: z.string().trim().min(1).max(80), role: z.string().trim().max(80).default(""), photo: optHttps }))
    .max(24)
    .default([]),
  why: z.array(z.object({ title: z.string().trim().min(1).max(60), text: z.string().trim().max(240).default("") })).max(8).default([]),
  cta_title: short(100),
  cta_text: longText(240),
});

export const settingsContentSchema = z.object({
  company_name: z.string().trim().min(1).max(80),
  tagline: longText(200),
  email: z.string().trim().email().max(200).or(z.literal("")).default(""),
  phone: short(30),
  address: longText(240),
  facebook: optHttp,
  instagram: optHttp,
  linkedin: optHttp,
  x: optHttp,
  youtube: optHttp,
});



/* ---------------- Videos ---------------- */

import { parseVideoUrl } from "./video-url";

const VIDEO_BUCKET_PATH = "/storage/v1/object/public/videos/";

export const videoInput = z
  .object({
    source: z.enum(["upload", "link"]),
    file_url: z.string().trim().max(500).default(""),
    video_url: z.string().trim().max(300).default(""),
    thumbnail: optHttps,
    sort_order: z.number().int().min(0).max(9999).default(0),
    published: z.boolean().default(true),
  })
  .superRefine((v, ctx) => {
    if (v.source === "upload") {
      // Only files that live in our own videos bucket are accepted.
      const prefix = `${(process.env.SUPABASE_URL ?? "").replace(/\/$/, "")}${VIDEO_BUCKET_PATH}`;
      if (!process.env.SUPABASE_URL || !v.file_url.startsWith(prefix) || v.file_url.length <= prefix.length) {
        ctx.addIssue({ code: "custom", path: ["file_url"], message: "Please upload a video file" });
      }
    } else if (!parseVideoUrl(v.video_url)) {
      ctx.addIssue({ code: "custom", path: ["video_url"], message: "Paste a YouTube or Vimeo link" });
    }
  })
  .transform((v) => {
    if (v.source === "upload") {
      return { provider: "upload" as const, video_id: "", video_url: "", file_url: v.file_url, thumbnail: v.thumbnail, sort_order: v.sort_order, published: v.published };
    }
    const parsed = parseVideoUrl(v.video_url) as NonNullable<ReturnType<typeof parseVideoUrl>>;
    return { provider: parsed.provider, video_id: parsed.video_id, video_url: v.video_url, file_url: "", thumbnail: v.thumbnail, sort_order: v.sort_order, published: v.published };
  });

export const videoUploadRequest = z.object({ ext: z.enum(["mp4", "webm"]) });

/* ---------------- Extra home page content ---------------- */

export const homeExtrasSchema = z.object({
  intro_title: z.string().trim().max(100).default(""),
  intro_text: z.string().trim().max(1500).default(""),
  intro_image: optHttps,
  clients: z.array(z.object({ name: z.string().trim().min(1).max(60), logo: httpsImage })).max(14).default([]),
  process: z.array(z.object({ title: z.string().trim().min(1).max(50), text: z.string().trim().max(240).default("") })).max(6).default([]),
  industries: z.array(z.string().trim().min(1).max(40)).max(14).default([]),
  faqs: z.array(z.object({ q: z.string().trim().min(1).max(160), a: z.string().trim().min(1).max(800) })).max(12).default([]),
  videos_title: z.string().trim().max(100).default(""),
  videos_text: z.string().trim().max(240).default(""),
  included_title: z.string().trim().max(80).default(""),
  included_text: z.string().trim().max(300).default(""),
  included_cta_label: z.string().trim().max(40).default(""),
  included_cta_href: z.string().trim().max(200).regex(/^(\/|https?:\/\/|mailto:)/, "Use /page, https:// or mailto:").or(z.literal("")).default(""),
  included: z.array(z.object({ title: z.string().trim().min(1).max(60), text: z.string().trim().max(240).default("") })).max(6).default([]),
  process_title: z.string().trim().max(80).default(""),
  process_text: z.string().trim().max(240).default(""),
  process_cta_label: z.string().trim().max(40).default(""),
  process_cta_href: z.string().trim().max(200).regex(/^(\/|https?:\/\/|mailto:)/, "Use /page, https:// or mailto:").or(z.literal("")).default(""),
});

export const contentSchemas = {
  home: homeContentSchema.merge(homeExtrasSchema),
  about: aboutContentSchema,
  settings: settingsContentSchema,
} as const;
