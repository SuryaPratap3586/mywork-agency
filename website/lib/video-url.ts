// Turns a pasted YouTube or Vimeo link into a provider + id. Rendering only ever uses these two
// validated values, never the raw URL, so a bad link can not inject anything into the page.
export type ParsedVideo = { provider: "youtube" | "vimeo"; video_id: string };

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;

export function parseVideoUrl(input: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return YT_ID.test(id) ? { provider: "youtube", video_id: id } : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = url.searchParams.get("v") ?? (["embed", "shorts", "live", "v"].includes(parts[0]) ? parts[1] : "");
    return id && YT_ID.test(id) ? { provider: "youtube", video_id: id } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((p) => VIMEO_ID.test(p));
    return id ? { provider: "vimeo", video_id: id } : null;
  }
  return null;
}
