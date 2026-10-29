import "server-only";
import { cache } from "react";
import { getDb, isDbConfigured } from "./supabase";
import { CONTENT_DEFAULTS, type ContentKey, type ContentMap } from "./content-defaults";

async function load<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const fallback = CONTENT_DEFAULTS[key];
  if (!isDbConfigured()) return fallback;
  const { data, error } = await getDb().from("site_content").select("data").eq("key", key).maybeSingle();
  if (error || !data) return fallback;
  return { ...fallback, ...(data.data as object) } as ContentMap[K];
}

/** Page content with safe defaults. Deduplicated per request. */
export const getContent = cache(load) as typeof load;

export async function saveContent<K extends ContentKey>(key: K, data: ContentMap[K]) {
  const { error } = await getDb()
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
}
