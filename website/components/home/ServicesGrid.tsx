import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { CATEGORIES } from "@/lib/categories";
import { SERVICE_BLURBS } from "@/lib/services";

export default function ServicesGrid() {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((c, i) => (
        <li key={c.value}>
          <Reveal delay={(i % 3) * 0.07} className="h-full">
            <Link
              href={`/work?service=${c.value}`}
              className="group flex h-full flex-col rounded-3xl border border-[#E4E7F5] bg-white p-7 shadow-[0_10px_40px_-26px_rgba(60,70,200,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7C3AED]/30 hover:shadow-[0_24px_60px_-28px_rgba(60,70,200,0.45)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] font-[family-name:var(--font-display)] text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">{c.label}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#4B5275]">{SERVICE_BLURBS[c.value]}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#3B5BFF]">
                See projects
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
