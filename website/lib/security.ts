import "server-only";
import { HttpError } from "./errors";

/** CSRF defence in depth (cookies are also SameSite=Strict): the Origin header must match our host. */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) throw new HttpError(403, "Forbidden");
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Forbidden");
  }
  if (originHost !== host) throw new HttpError(403, "Forbidden");
}
