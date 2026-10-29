import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/posts";
import { getOpenJobs } from "@/lib/jobs";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const [projects, posts, jobs] = await Promise.all([getPublishedProjects(), getAllPostSlugs(), getOpenJobs()]);
  const fixed = ["", "/about", "/work", "/blog", "/testimonials", "/careers", "/privacy", "/terms"].map((p) => ({
    url: `${site}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...fixed,
    ...projects.map((p) => ({ url: `${site}/work/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.filter((p) => !p.noindex).map((p) => ({ url: `${site}/blog/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${site}/careers/${j.slug}`, lastModified: j.updated_at, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
