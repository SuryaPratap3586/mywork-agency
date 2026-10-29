import crypto from "node:crypto";
import { errorResponse, json } from "@/lib/api";
import { HttpError } from "@/lib/errors";
import { getIp, hit } from "@/lib/rate-limit";
import { assertSameOrigin } from "@/lib/security";
import { getDb, isDbConfigured } from "@/lib/supabase";
import { applicationInput } from "@/lib/validation";

const MAX_BYTES = 5 * 1024 * 1024;

// Real file type from the first bytes (the uploaded name/type is never trusted).
function sniff(b: Uint8Array): { ext: string; mime: string } | null {
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return { ext: "pdf", mime: "application/pdf" };
  if (b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04)
    return { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return { ext: "doc", mime: "application/msword" };
  return null;
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    if (hit(`apply:${getIp(req)}`, 60 * 60 * 1000) > 5) {
      throw new HttpError(429, "Too many applications from your network. Please try again later.");
    }
    if (!isDbConfigured()) throw new HttpError(503, "Applications are not open yet");

    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_BYTES + 128 * 1024) throw new HttpError(413, "Resume must be under 5 MB");

    const form = await req.formData();

    // Honeypot: real people never fill this hidden field. Bots do. Pretend success and drop it.
    if (String(form.get("website") ?? "") !== "") return json({ ok: true }, 201);

    const input = applicationInput.parse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") ?? "",
      job_id: form.get("job_id") || null,
      cover_letter: form.get("cover_letter") ?? "",
    });

    const file = form.get("resume");
    if (!(file instanceof File) || file.size === 0) throw new HttpError(400, "Please attach your resume");
    if (file.size > MAX_BYTES) throw new HttpError(413, "Resume must be under 5 MB");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = sniff(bytes);
    if (!type) throw new HttpError(415, "Resume must be a PDF, DOC or DOCX file");

    const db = getDb();
    let jobTitle = "General application";
    if (input.job_id) {
      const { data: job } = await db
        .from("jobs")
        .select("title,status,published")
        .eq("id", input.job_id)
        .maybeSingle();
      if (!job || !job.published || job.status !== "open") throw new HttpError(400, "This position is no longer open");
      jobTitle = job.title as string;
    }

    const path = `applications/${crypto.randomUUID()}.${type.ext}`;
    const up = await db.storage.from("resumes").upload(path, bytes, { contentType: type.mime, upsert: false });
    if (up.error) {
      console.error("resume upload", up.error.message);
      throw new HttpError(500, "Could not upload your resume. Please try again.");
    }

    const { error } = await db.from("applications").insert({
      job_id: input.job_id,
      job_title: jobTitle,
      name: input.name,
      email: input.email,
      phone: input.phone,
      cover_letter: input.cover_letter,
      resume_path: path,
    });
    if (error) {
      await db.storage.from("resumes").remove([path]);
      console.error("application insert", error.message);
      throw new HttpError(500, "Could not save your application. Please try again.");
    }
    return json({ ok: true }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
