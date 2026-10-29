"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const wanted = params.get("service") ?? "";
  const [active, setActive] = useState<string>(CATEGORIES.some((c) => c.value === wanted) ? wanted : "all");

  const tabs = useMemo(
    () => CATEGORIES.filter((c) => projects.some((p) => p.category === c.value)),
    [projects],
  );
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  const tabClass = (on: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      on
        ? "border-transparent bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] text-white shadow-[0_8px_20px_-8px_rgba(91,70,255,0.6)]"
        : "border-[#E4E7F5] bg-white text-[#4B5275] hover:border-[#7C3AED]/40 hover:text-[#0F1330]"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter projects by service">
        <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={tabClass(active === "all")}>
          All
        </button>
        {tabs.map((t) => (
          <button key={t.value} type="button" aria-pressed={active === t.value} onClick={() => setActive(t.value)} className={tabClass(active === t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-[#4B5275]">No projects to show yet. Check back soon.</p>
      ) : (
        <motion.ul layout className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.04, 0.3) }}
              >
                <ProjectCard project={p} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
