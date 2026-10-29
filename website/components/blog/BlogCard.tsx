import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/types";

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function PostCover({ post, sizes, priority = false, className = "aspect-[16/10]" }: { post: Pick<PostSummary, "title" | "featured_image" | "image_alt" | "category">; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#EEF0FF] ${className}`}>
      {post.featured_image ? (
        <Image
          src={post.featured_image}
          alt={post.image_alt || post.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] p-6 text-center">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold text-white/90">{post.category}</span>
        </div>
      )}
    </div>
  );
}

export default function BlogCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white shadow-[0_10px_40px_-24px_rgba(60,70,200,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(60,70,200,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
    >
      <PostCover post={post} priority={priority} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#3B5BFF]">{post.category}</span>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-[#0F1330]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[#4B5275]">{post.excerpt}</p>
        <p className="mt-5 text-sm text-[#8A90B0]">{post.author_name} · {formatDate(post.published_at)}</p>
      </div>
    </Link>
  );
}
