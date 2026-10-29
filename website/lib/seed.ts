import type { Project } from "./types";

// Sample placeholders shown ONLY while the database is not connected.
// Once Supabase is configured these are never used; add your real projects from /admin.
const now = "2026-01-01T00:00:00.000Z";
const base = {
  gallery: [],
  results: [],
  tags: [],
  project_url: "",
  published: true,
  meta_title: "",
  meta_description: "",
  created_at: now,
  updated_at: now,
};

export const SEED_PROJECTS: Project[] = [
  {
    ...base,
    id: "seed-1",
    slug: "sample-ecommerce-website",
    title: "Sample: E-commerce website",
    category: "website-development",
    client_name: "Sample client",
    industry: "Retail",
    summary:
      "A placeholder project. Add your real projects from the admin panel.",
    description:
      "This is sample content shown until the database is connected.\n\nReplace it with your own case study from /admin.",
    cover_image: "",
    results: [
      { label: "Load time", value: "1.2s" },
      { label: "Conversion", value: "+32%" },
    ],
    tags: ["Next.js", "Stripe"],
    featured: true,
    sort_order: 1,
  },
  {
    ...base,
    id: "seed-2",
    slug: "sample-social-campaign",
    title: "Sample: Social media campaign",
    category: "social-media-marketing",
    client_name: "Sample client",
    industry: "Food and beverage",
    summary:
      "A placeholder project. Add your real projects from the admin panel.",
    description: "Sample content shown until the database is connected.",
    cover_image: "",
    results: [{ label: "Reach", value: "1.4M" }],
    featured: true,
    sort_order: 2,
  },
  {
    ...base,
    id: "seed-3",
    slug: "sample-lead-generation",
    title: "Sample: Lead generation campaign",
    category: "digital-marketing",
    client_name: "Sample client",
    industry: "Real estate",
    summary:
      "A placeholder project. Add your real projects from the admin panel.",
    description: "Sample content shown until the database is connected.",
    cover_image: "",
    results: [{ label: "Leads", value: "+240%" }],
    featured: true,
    sort_order: 3,
  },
];
