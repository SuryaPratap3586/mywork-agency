import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import ApplyForm from "@/components/careers/ApplyForm";
import { Markdown } from "@/lib/markdown";
import { getJobBySlug } from "@/lib/jobs";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug((await params).slug);
  if (!job) return { title: "Position not found", robots: { index: false } };
  return {
    title: `${job.title} | Careers`,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
    robots: job.status === "closed" ? { index: false } : undefined,
  };
}

export default async function JobPage({ params }: Props) {
  const job = await getJobBySlug((await params).slug);
  if (!job) notFound();

  const list = (items: string[]) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-8 text-[#3B4160] marker:text-[#7C3AED]">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
  const h2 = "font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]";

  return (
    <main>
      <PageHero title={job.title} description={job.summary}>
        <div className="flex flex-wrap gap-2">
          {[job.department, job.location, job.employment_type].filter(Boolean).map((t) => (
            <span key={t} className="rounded-full border border-[#E4E7F5] bg-white px-4 py-1.5 text-sm font-medium text-[#4B5275]">{t}</span>
          ))}
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Link href="/careers" className="text-sm font-semibold text-[#3B5BFF] hover:underline">← All openings</Link>
          {job.description && <div className="mt-8"><Markdown source={job.description} /></div>}
          {job.responsibilities.length > 0 && (<div className="mt-10"><h2 className={h2}>Responsibilities</h2>{list(job.responsibilities)}</div>)}
          {job.requirements.length > 0 && (<div className="mt-10"><h2 className={h2}>Requirements</h2>{list(job.requirements)}</div>)}
        </div>
        <div className="lg:sticky lg:top-24 lg:h-fit">
          {job.status === "open" ? (
            <ApplyForm jobId={job.id} jobTitle={job.title} />
          ) : (
            <div className="rounded-3xl border border-[#E4E7F5] bg-[#FAFAFE] p-8">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">This position is closed</p>
              <p className="mt-2 text-[#4B5275]">We are no longer accepting applications for this role.</p>
              <Link href="/careers" className="mt-5 inline-block font-semibold text-[#3B5BFF]">See other openings</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
