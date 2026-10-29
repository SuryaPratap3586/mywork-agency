import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const a = await getContent("about");
  return {
    title: "About us",
    description: a.hero_description.slice(0, 160),
    alternates: { canonical: "/about" },
  };
}

function Initials({ name }: { name: string }) {
  const t = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]">
      <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white/90">{t}</span>
    </div>
  );
}

export default async function AboutPage() {
  const a = await getContent("about");
  const paragraphs = a.story.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const h2 = "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-4xl";
  const card = "rounded-3xl border border-[#E4E7F5] bg-white p-7 shadow-[0_10px_40px_-24px_rgba(60,70,200,0.35)]";

  return (
    <main>
      <PageHero title={a.hero_title} description={a.hero_description} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className={`grid items-center gap-12 ${a.story_image ? "lg:grid-cols-2" : ""}`}>
          <Reveal>
            <h2 className={h2}>{a.story_title}</h2>
            <div className="mt-6 max-w-2xl space-y-5 text-[17px] leading-8 text-[#4B5275]">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
          {a.story_image && (
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E4E7F5] shadow-[0_30px_80px_-40px_rgba(60,70,200,0.4)]">
                <Image src={a.story_image} alt="Our team at work" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {(a.mission || a.vision) && (
        <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-2">
            {a.mission && (
              <Reveal className={card}>
                <p className="text-sm font-semibold text-[#3B5BFF]">Our mission</p>
                <p className="mt-3 text-lg leading-relaxed text-[#0F1330]">{a.mission}</p>
              </Reveal>
            )}
            {a.vision && (
              <Reveal delay={0.1} className={card}>
                <p className="text-sm font-semibold text-[#7C3AED]">Our vision</p>
                <p className="mt-3 text-lg leading-relaxed text-[#0F1330]">{a.vision}</p>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {a.values.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal><h2 className={h2}>What we value</h2></Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {a.values.map((v, i) => (
              <li key={`${v.title}-${i}`}>
                <Reveal delay={i * 0.06} className={`${card} h-full`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] font-[family-name:var(--font-display)] font-bold text-[#3B5BFF]">{i + 1}</span>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-[#4B5275]">{v.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {a.stats.length > 0 && (
        <section className="bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]">
          <dl className="mx-auto grid max-w-7xl gap-8 px-5 py-14 text-center text-white sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {a.stats.map((s, i) => (
              <div key={`${s.label}-${i}`} className="flex flex-col-reverse">
                <dt className="mt-1 text-white/80">{s.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-5xl font-bold">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {a.team.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal><h2 className={h2}>Meet the team</h2></Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.team.map((m, i) => (
              <li key={`${m.name}-${i}`}>
                <Reveal delay={(i % 4) * 0.06}>
                  <div className="group overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white">
                    <div className="relative aspect-square overflow-hidden">
                      {m.photo ? (
                        <Image src={m.photo} alt={`${m.name}, ${m.role}`} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <Initials name={m.name} />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330]">{m.name}</p>
                      {m.role && <p className="text-sm text-[#4B5275]">{m.role}</p>}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {a.why.length > 0 && (
        <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <Reveal><h2 className={h2}>Why clients choose us</h2></Reveal>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {a.why.map((w, i) => (
                <li key={`${w.title}-${i}`}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <div className="flex gap-4">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                      </span>
                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330]">{w.title}</h3>
                        <p className="mt-1.5 leading-relaxed text-[#4B5275]">{w.text}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner title={a.cta_title || "Ready to grow your business?"} text={a.cta_text || "Tell us about your goals."} />
    </main>
  );
}
