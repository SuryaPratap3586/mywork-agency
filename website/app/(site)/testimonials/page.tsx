import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { getPublishedTestimonials } from "@/lib/testimonials";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client testimonials",
  description: "What our clients say about working with us.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const items = await getPublishedTestimonials();
  return (
    <main>
      <PageHero title="What our clients say" description="Honest words from the people we have worked with." />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {items.length === 0 ? (
          <p className="text-[#4B5275]">Client testimonials will appear here soon.</p>
        ) : (
          <ul className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <li key={t.id}>
                <Reveal delay={(i % 3) * 0.07} className="h-full"><TestimonialCard t={t} /></Reveal>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CtaBanner title="Want results like these?" text="Tell us about your goals and we will show you how we can help." />
    </main>
  );
}
