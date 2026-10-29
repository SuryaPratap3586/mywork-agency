import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import ClientLogos from "@/components/home/ClientLogos";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import IncludedSection from "@/components/home/IncludedSection";
import Faq from "@/components/home/Faq";
import SectionHeading from "@/components/home/SectionHeading";
import VideoSlider from "@/components/home/VideoSlider";
import CtaBanner from "@/components/layout/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ProjectCard from "@/components/work/ProjectCard";
import BlogCard from "@/components/blog/BlogCard";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { getContent } from "@/lib/content";
import { getLatestPosts } from "@/lib/posts";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedTestimonials } from "@/lib/testimonials";
import { getPublishedVideos } from "@/lib/videos";

export const revalidate = 60;

const viewAll = "rounded-full border border-[#D9DDF3] px-5 py-2.5 text-sm font-semibold text-[#0F1330] transition-colors hover:border-[#7C3AED]/50 hover:bg-[#F5F3FF]";
const wrap = "mx-auto max-w-7xl px-5 py-20 sm:px-8";

function Check() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </span>
  );
}

export default async function HomePage() {
  const [home, about, projects, testimonials, posts, videos] = await Promise.all([
    getContent("home"),
    getContent("about"),
    getPublishedProjects(),
    getPublishedTestimonials(),
    getLatestPosts(3),
    getPublishedVideos(),
  ]);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const introParagraphs = home.intro_text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <main>
      {/* 1. Hero */}
      <Hero
        badge={home.badge}
        title={home.title}
        description={home.description}
        primaryCta={{ label: home.primary_label, href: home.primary_href }}
        secondaryCta={home.secondary_label && home.secondary_href ? { label: home.secondary_label, href: home.secondary_href } : undefined}
        stats={home.stats}
      />

      {/* 2. Trusted clients */}
      <ClientLogos clients={home.clients} />

      {/* 3. Company introduction */}
      <section className={wrap} aria-labelledby="intro-heading">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 id="intro-heading" className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-4xl">{home.intro_title}</h2>
            <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#4B5275]">
              {introParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <Link href="/about" className="mt-8 inline-flex rounded-full border border-[#D9DDF3] px-6 py-3 text-sm font-semibold text-[#0F1330] transition-colors hover:border-[#7C3AED]/50 hover:bg-[#F5F3FF]">More about us</Link>
          </Reveal>
          <Reveal delay={0.1}>
            {home.intro_image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E4E7F5] shadow-[0_30px_80px_-40px_rgba(60,70,200,0.4)]">
                <Image src={home.intro_image} alt="Our team at work" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] p-8 text-white shadow-[0_30px_80px_-40px_rgba(60,70,200,0.6)] sm:p-10">
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold">What you get</p>
                <ul className="mt-6 space-y-5">
                  {about.why.slice(0, 4).map((w, i) => (
                    <li key={`${w.title}-${i}`} className="flex gap-4">
                      <Check />
                      <div><p className="font-semibold">{w.title}</p><p className="mt-1 text-sm text-white/80">{w.text}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* 4. Services overview */}
      <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]" aria-labelledby="services-heading">
        <div className={wrap}>
          <SectionHeading id="services-heading" center title="Everything your brand needs to grow" text="Ten services, one team. Pick what you need today and add more as you grow." />
          <ServicesGrid />
        </div>
      </section>

      {/* 4b. Everything included */}
      <IncludedSection title={home.included_title} text={home.included_text} items={home.included} ctaLabel={home.included_cta_label} ctaHref={home.included_cta_href} />

      {/* 5. Why choose us */}
      {about.why.length > 0 && (
        <section className={wrap} aria-labelledby="why-heading">
          <SectionHeading id="why-heading" title="Why clients choose us" text="The reasons brands stay with us year after year." />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {about.why.map((w, i) => (
              <li key={`${w.title}-${i}`}>
                <Reveal delay={i * 0.07} className="h-full">
                  <div className="h-full rounded-3xl border border-[#E4E7F5] bg-white p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF] font-[family-name:var(--font-display)] text-lg font-bold text-[#3B5BFF]">{i + 1}</span>
                    <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">{w.title}</h3>
                    <p className="mt-2 leading-relaxed text-[#4B5275]">{w.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Statistics with animated counters */}
      {about.stats.length > 0 && (
        <section className="bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]" aria-label="Company statistics">
          <dl className="mx-auto grid max-w-7xl gap-8 px-5 py-14 text-center text-white sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {about.stats.map((s, i) => (
              <div key={`${s.label}-${i}`} className="flex flex-col-reverse">
                <dt className="mt-1 text-white/80">{s.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-5xl font-bold"><AnimatedCounter to={s.value} suffix={s.suffix} /></dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 7. Featured projects */}
      {featured.length > 0 && (
        <section className={wrap} aria-labelledby="featured-heading">
          <SectionHeading id="featured-heading" title="Work we are proud of" text="A few recent projects across development, social media and digital marketing." action={<Link href="/work" className={viewAll}>View all projects</Link>} />
          <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (<li key={p.id}><Reveal delay={i * 0.07} className="h-full"><ProjectCard project={p} /></Reveal></li>))}
          </ul>
        </section>
      )}

      {/* 8. Video slider: video-only cards, autoplay, muted, loop (managed in the admin) */}
      {videos.length > 0 && (
        <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]" aria-labelledby="videos-heading">
          <div className={wrap}>
            {home.videos_title ? (
              <SectionHeading id="videos-heading" title={home.videos_title} text={home.videos_text || undefined} />
            ) : (
              <h2 id="videos-heading" className="sr-only">Video showcase</h2>
            )}
            <div className={home.videos_title ? "mt-8" : ""}><VideoSlider videos={videos} /></div>
          </div>
        </section>
      )}

      {/* 9. How it works (scroll-driven steps) */}
      <HowItWorks title={home.process_title} text={home.process_text} steps={home.process} ctaLabel={home.process_cta_label} ctaHref={home.process_cta_href} />

      {/* 10. Testimonials */}
      {testimonials.length > 0 && (
        <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]" aria-labelledby="testimonials-heading">
          <div className={wrap}>
            <SectionHeading id="testimonials-heading" title="What clients say" action={<Link href="/testimonials" className={viewAll}>Read more</Link>} />
            <ul className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (<li key={t.id}><Reveal delay={i * 0.07} className="h-full"><TestimonialCard t={t} /></Reveal></li>))}
            </ul>
          </div>
        </section>
      )}

      {/* 11. Team */}
      {about.team.length > 0 && (
        <section className={wrap} aria-labelledby="team-heading">
          <SectionHeading id="team-heading" title="Meet the team" action={<Link href="/about" className={viewAll}>Full team</Link>} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.team.slice(0, 4).map((m, i) => (
              <li key={`${m.name}-${i}`}>
                <Reveal delay={i * 0.06}>
                  <div className="overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white">
                    <div className="relative aspect-square bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]">
                      {m.photo ? <Image src={m.photo} alt={`${m.name}, ${m.role}`} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" /> : (
                        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-display)] text-4xl font-bold text-white/90">{m.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")}</span>
                      )}
                    </div>
                    <div className="p-5"><p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330]">{m.name}</p>{m.role && <p className="text-sm text-[#4B5275]">{m.role}</p>}</div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 12. Industries */}
      {home.industries.length > 0 && (
        <section className="border-y border-[#E4E7F5] bg-[#FAFAFE]" aria-labelledby="industries-heading">
          <div className={wrap}>
            <SectionHeading id="industries-heading" center title="Industries we serve" text="Marketing and technology built around how your industry works." />
            <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
              {home.industries.map((x, i) => (
                <li key={`${x}-${i}`}>
                  <Reveal delay={Math.min(i * 0.04, 0.3)}>
                    <span className="inline-block rounded-full border border-[#E4E7F5] bg-white px-5 py-2.5 text-[15px] font-medium text-[#0F1330] shadow-sm transition-colors hover:border-[#7C3AED]/40 hover:text-[#3B5BFF]">{x}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 13. Latest blog posts */}
      {posts.length > 0 && (
        <section className={wrap} aria-labelledby="blog-heading">
          <SectionHeading id="blog-heading" title="Latest from the blog" text="Practical guides on marketing, SEO, design and development." action={<Link href="/blog" className={viewAll}>All articles</Link>} />
          <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (<li key={p.id}><Reveal delay={i * 0.07} className="h-full"><BlogCard post={p} /></Reveal></li>))}
          </ul>
        </section>
      )}

      {/* 14. FAQ */}
      {home.faqs.length > 0 && (
        <section className="border-t border-[#E4E7F5] bg-[#FAFAFE]" aria-labelledby="faq-heading">
          <div className={wrap}>
            <SectionHeading id="faq-heading" center title="Frequently asked questions" />
            <Faq items={home.faqs} />
          </div>
        </section>
      )}

      {/* 15. Final call to action */}
      <CtaBanner title="Ready to grow your business?" text="Tell us about your goals and we will show you how we can help." />
    </main>
  );
}
