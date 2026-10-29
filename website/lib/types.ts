import type { CategoryValue } from "./categories";

export type ProjectResult = { label: string; value: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: CategoryValue;
  client_name: string;
  industry: string;
  summary: string;
  description: string;
  cover_image: string;
  gallery: string[];
  results: ProjectResult[];
  tags: string[];
  project_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
};

export type PostStatus = "draft" | "published" | "scheduled";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_alt: string;
  category: string;
  tags: string[];
  author_name: string;
  author_image: string;
  author_bio: string;
  status: PostStatus;
  featured: boolean;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  noindex: boolean;
  created_at: string;
  updated_at: string;
};

export type PostSummary = Omit<Post, "content">;

export type Testimonial = {
  id: string;
  client_name: string;
  designation: string;
  company: string;
  review: string;
  rating: number | null;
  photo_url: string;
  company_logo: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"] as const;

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: (typeof EMPLOYMENT_TYPES)[number];
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: "open" | "closed";
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const APPLICATION_STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const;

export type Application = {
  id: string;
  job_id: string | null;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_path: string;
  status: (typeof APPLICATION_STATUSES)[number];
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  provider: "upload" | "youtube" | "vimeo";
  video_id: string;
  file_url: string;
  thumbnail: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
