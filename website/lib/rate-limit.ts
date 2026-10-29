import "server-only";

// In-memory limiter: good for a single server / local use.
// On Vercel (serverless) each instance has its own memory, so for production-grade limits
// swap this for Upstash Redis (@upstash/ratelimit). The call sites stay the same.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function hit(key: string, windowMs: number): number {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  bucket.count += 1;
  return bucket.count;
}

export function reset(key: string) {
  buckets.delete(key);
}

export function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}
