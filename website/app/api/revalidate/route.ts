import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { errorResponse, json } from "@/lib/api";
import { HttpError } from "@/lib/errors";
import { getIp, hit } from "@/lib/rate-limit";

// Called by your separate admin app right after you publish or edit something, so the public site updates
// instantly instead of waiting for the one-minute refresh. Protected by a shared secret.
const PATH = /^\/(?:(?:work|blog|careers)(?:\/[a-z0-9-]{1,100})?|about|testimonials|privacy|terms|sitemap\.xml)?$/;
const body = z.object({ paths: z.array(z.string().regex(PATH)).max(30).default([]), layout: z.boolean().default(false) });

const digest = (v: string) => crypto.createHash("sha256").update(v).digest();

export async function POST(req: Request) {
  try {
    const secret = process.env.REVALIDATE_SECRET ?? "";
    if (secret.length < 24) throw new HttpError(404, "Not found");
    if (hit(`revalidate:${getIp(req)}`, 60_000) > 120) throw new HttpError(429, "Too many requests");

    const given = req.headers.get("x-revalidate-secret") ?? "";
    if (!crypto.timingSafeEqual(digest(given), digest(secret))) throw new HttpError(401, "Unauthorized");

    const input = body.parse(await req.json().catch(() => ({})));
    for (const p of new Set(input.paths)) revalidatePath(p);
    if (input.layout) revalidatePath("/", "layout");
    return json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
