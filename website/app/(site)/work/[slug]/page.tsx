import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProjectCover from "@/components/work/ProjectCover";
import ProjectCard from "@/components/work/ProjectCard";
import { categoryLabel } from "@/lib/categories";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/projects";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  const title = project.meta_title || project.title;
  const description = project.meta_description || project.summary;
  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getPublishedProjects())
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);
  const paragraphs = project.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#E4E7F5] pb-12 pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full bg-[#7C3AED]/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Link href="/work" className="text-sm font-semibold text-[#3B5BFF] hover:underline">← All projects</Link>
          <p className="mt-6 inline-block rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#3B5BFF]">
            {categoryLabel(project.category)}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#0F1330]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#4B5275]">{project.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {project.client_name && (
              <div><dt className="text-[#8A90B0]">Client</dt><dd className="mt-0.5 font-semibold text-[#0F1330]">{project.client_name}</dd></div>
            )}
            {project.industry && (
              <div><dt className="text-[#8A90B0]">Industry</dt><dd className="mt-0.5 font-semibold text-[#0F1330]">{project.industry}</dd></div>
            )}
            <div><dt className="text-[#8A90B0]">Service</dt><dd className="mt-0.5 font-semibold text-[#0F1330]">{categoryLabel(project.category)}</dd></div>
          </dl>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(91,70,255,0.65)] transition-transform hover:-translate-y-0.5"
            >
              Visit live project
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#E4E7F5] shadow-[0_30px_80px_-40px_rgba(60,70,200,0.4)]">
          <ProjectCover project={project} sizes="(min-width: 1024px) 960px, 100vw" priority className="aspect-[16/9]" />
        </div>

        {project.results.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.results.map((r) => (
              <li key={r.label} className="rounded-2xl border border-[#E4E7F5] bg-[#FAFAFE] p-6">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#0F1330]">{r.value}</p>
                <p className="mt-1 text-sm text-[#4B5275]">{r.label}</p>
              </li>
            ))}
          </ul>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-12 max-w-3xl space-y-5 text-[17px] leading-8 text-[#3B4160]">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">{p}</p>
            ))}
          </div>
        )}

        {project.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-[#E4E7F5] bg-white px-3 py-1 text-sm text-[#4B5275]">{t}</li>
            ))}
          </ul>
        )}

        {project.gallery.length > 0 && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#E4E7F5]">
                <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="border-t border-[#E4E7F5] bg-[#FAFAFE]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">More {categoryLabel(project.category)} projects</h2>
            <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (<li key={p.id}><ProjectCard project={p} /></li>))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
