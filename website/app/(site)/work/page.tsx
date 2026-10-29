import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/layout/PageHero";
import WorkGrid from "@/components/work/WorkGrid";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Work",
  description: "Projects we have delivered across website development, social media, digital marketing, design and more.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <main>
      <PageHero title="Our work" description="Real projects, real results. Pick a service to filter, then open any project to see the full story." />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <Suspense fallback={null}>
          <WorkGrid projects={projects} />
        </Suspense>
      </section>
    </main>
  );
}
