import Image from "next/image";
import type { Testimonial } from "@/lib/types";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={`h-4 w-4 ${i <= n ? "text-[#F5A524]" : "text-[#E4E7F5]"}`} fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.client_name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-[#E4E7F5] bg-white p-7 shadow-[0_10px_40px_-24px_rgba(60,70,200,0.35)]">
      {t.rating ? <Stars n={t.rating} /> : null}
      <blockquote className="mt-4 flex-1 leading-relaxed text-[#3B4160]">&ldquo;{t.review}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E4E7F5]">
          {t.photo_url ? (
            <Image src={t.photo_url} alt={`Photo of ${t.client_name}`} fill sizes="48px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] text-sm font-bold text-white">{initials}</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-[#0F1330]">{t.client_name}</span>
          <span className="block truncate text-sm text-[#4B5275]">{[t.designation, t.company].filter(Boolean).join(", ")}</span>
        </span>
        {t.company_logo && (
          <span className="relative h-8 w-16 shrink-0">
            <Image src={t.company_logo} alt={`${t.company} logo`} fill sizes="64px" className="object-contain" />
          </span>
        )}
      </figcaption>
    </figure>
  );
}
