import "server-only";
import { getDb, isDbConfigured } from "./supabase";
import type { Testimonial } from "./types";

// No sample testimonials on purpose: only real, admin-entered reviews are ever shown.
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  if (!isDbConfigured()) return [];
  const { data, error } = await getDb()
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedTestimonials", error.message);
    return [];
  }
  return (data ?? []) as Testimonial[];
}
