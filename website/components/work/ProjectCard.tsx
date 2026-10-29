import Link from "next/link";
import type { Project } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import ProjectCover from "./ProjectCover";

export default function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white shadow-[0_10px_40px_-24px_rgba(60,70,200,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(60,70,200,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
    >
      <div className="relative">
        <ProjectCover project={project} priority={priority} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3B5BFF] backdrop-blur">
          {categoryLabel(project.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-[#0F1330]">
          {project.title}
        </h3>
        {(project.client_name || project.industry) && (
          <p className="mt-1 text-sm text-[#8A90B0]">
            {[project.client_name, project.industry].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-[#4B5275]">{project.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#3B5BFF]">
          View project
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
