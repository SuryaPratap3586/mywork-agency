import "server-only";
import { getDb, isDbConfigured } from "./supabase";
import type { Video } from "./types";

// No sample videos on purpose: the slider only appears once you add real ones in the admin.
export async function getPublishedVideos(): Promise<Video[]> {
  if (!isDbConfigured()) return [];
  const { data, error } = await getDb()
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedVideos", error.message);
    return [];
  }
  return (data ?? []) as Video[];
}
