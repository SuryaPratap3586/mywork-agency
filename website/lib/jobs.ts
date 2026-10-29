import "server-only";
import { getDb, isDbConfigured } from "./supabase";
import type { Job } from "./types";

export async function getOpenJobs(): Promise<Job[]> {
  if (!isDbConfigured()) return [];
  const { data, error } = await getDb()
    .from("jobs")
    .select("*")
    .eq("published", true)
    .eq("status", "open")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getOpenJobs", error.message);
    return [];
  }
  return (data ?? []) as Job[];
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  if (!isDbConfigured() || !/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  const { data, error } = await getDb().from("jobs").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) return null;
  return (data as Job | null) ?? null;
}
