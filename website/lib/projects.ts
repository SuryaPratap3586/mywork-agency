import "server-only";
import { getDb, isDbConfigured } from "./supabase";
import { SEED_PROJECTS } from "./seed";
import { HttpError } from "./errors";
import type { Project } from "./types";
import type { ProjectInput } from "./validation";

function requireDb() {
  if (!isDbConfigured()) throw new HttpError(503, "Database is not connected yet");
  return getDb();
}

/* ---------- Public (published only) ---------- */

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isDbConfigured()) return SEED_PROJECTS;
  const { data, error } = await getDb()
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedProjects", error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) return null;
  if (!isDbConfigured()) return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await getDb()
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getPublishedProjectBySlug", error.message);
    return null;
  }
  return (data as Project | null) ?? null;
}

/* ---------- Admin ---------- */

export async function adminListProjects(): Promise<Project[]> {
  const { data, error } = await requireDb()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function adminGetProject(id: string): Promise<Project | null> {
  const { data, error } = await requireDb().from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Project | null) ?? null;
}

function mapDbError(error: { code?: string; message: string }): never {
  if (error.code === "23505") throw new HttpError(409, "A project with this URL slug already exists");
  throw new Error(error.message);
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await requireDb().from("projects").insert(input).select("*").single();
  if (error) mapDbError(error);
  return data as Project;
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const { data, error } = await requireDb()
    .from("projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) mapDbError(error);
  if (!data) throw new HttpError(404, "Project not found");
  return data as Project;
}

export async function patchProject(
  id: string,
  patch: { published?: boolean; featured?: boolean },
): Promise<Project> {
  const { data, error } = await requireDb()
    .from("projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) mapDbError(error);
  if (!data) throw new HttpError(404, "Project not found");
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await requireDb().from("projects").delete().eq("id", id);
  if (error) mapDbError(error);
}
