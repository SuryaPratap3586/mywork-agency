import Image from "next/image";
import type { Project } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

const GRADIENTS = [
  "from-[#3B5BFF] to-[#7C3AED]",
  "from-[#6D5CF6] to-[#A78BFA]",
  "from-[#4F46E5] to-[#818CF8]",
  "from-[#2F6BFF] to-[#6D8BFF]",
];

export default function ProjectCover({
  project,
  sizes,
  priority = false,
  className = "aspect-[16/10]",
}: {
  project: Pick<Project, "title" | "cover_image" | "category">;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const idx = Math.max(0, CATEGORIES.findIndex((c) => c.value === project.category));
  const initials = project.title
    .replace(/^Sample:\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className={`relative overflow-hidden bg-[#EEF0FF] ${className}`}>
      {project.cover_image ? (
        <Image
          src={project.cover_image}
          alt={`${project.title} project preview`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${GRADIENTS[idx % GRADIENTS.length]}`}>
          <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-white/90">{initials}</span>
        </div>
      )}
    </div>
  );
}
