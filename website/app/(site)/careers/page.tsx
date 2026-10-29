import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Reveal from "@/components/ui/Reveal";
import { getOpenJobs } from "@/lib/jobs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description: "Join our team. See current openings in marketing, design and development.",
  alternates: { canonical: "/careers" },
};

const PERKS = [
  { title: "Learn fast", text: "Work on real client projects from your first week, with people who teach." },
  { title: "Real ownership", text: "Own your work end to end and see the results you create." },
  { title: "Flexible and fair", text: "We care about outcomes, not hours spent at a desk." },
  { title: "Grow your craft", text: "Room to try new tools, channels and ideas." },
];

export default async function CareersPage() {
  const jobs = await getOpenJobs();
  return (
    <main>
      <PageHero
        title="Build your career with us"
        description="We are a team of marketers, designers and developers who like doing great work together."
        actions={
          <a href="#openings" className="rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(91,70,255,0.65)] transition-transform hover:-translate-y-0.5">
            See open roles
          </a>
        }
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal><h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-4xl">Life at the agency</h2></Reveal>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-3xl border border-[#E4E7F5] bg-white p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330]">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4B5275]">{p.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="openings" className="border-t border-[#E4E7F5] bg-[#FAFAFE] scroll-mt-20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-4xl">Open positions</h2>
          {jobs.length === 0 ? (
            <p className="mt-6 text-[#4B5275]">There are no open positions right now. Please check back soon.</p>
          ) : (
            <ul className="mt-10 space-y-4">
              {jobs.map((j, i) => (
                <li key={j.id}>
                  <Reveal delay={Math.min(i * 0.05, 0.25)}>
                    <Link href={`/careers/${j.slug}`} className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E4E7F5] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(60,70,200,0.45)]">
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">{j.title}</h3>
                        <p className="mt-1 text-sm text-[#4B5275]">{[j.department, j.location, j.employment_type].filter(Boolean).join(" · ")}</p>
                        <p className="mt-3 max-w-2xl text-[15px] text-[#4B5275]">{j.summary}</p>
                      </div>
                      <span className="rounded-full border border-[#D9DDF3] px-5 py-2 text-sm font-semibold text-[#3B5BFF] transition-colors group-hover:bg-[#EEF0FF]">View role</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
