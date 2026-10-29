"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import HeroVisual from "./HeroVisual";

export type HeroStat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type HeroProps = {
  badge?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  stats?: HeroStat[];
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Placeholder numbers: replace with real figures (later load these from the admin panel / database).
const DEFAULT_STATS: HeroStat[] = [
  { value: 10, suffix: "+", label: "Brands served" },

  { value: 10, suffix: "%", label: "Clients who stay with us" },
];

const wordReveal: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.85, ease: EASE, delay: 0.15 + i * 0.06 },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

function Background({ reduce }: { reduce: boolean | null }) {
  const drift = (x: number, y: number, duration: number) =>
    reduce
      ? undefined
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#C9CEF0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 65% 40%, #000 25%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 65% 40%, #000 25%, transparent 75%)",
        }}
      />
      <motion.div
        className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#7C3AED]/15 blur-3xl"
        {...drift(70, 50, 18)}
      />
      <motion.div
        className="absolute -right-24 top-10 h-[520px] w-[520px] rounded-full bg-[#3B5BFF]/15 blur-3xl"
        {...drift(-60, 70, 22)}
      />
      <motion.div
        className="absolute bottom-[-160px] left-1/3 h-[360px] w-[360px] rounded-full bg-[#A78BFA]/15 blur-3xl"
        {...drift(50, -40, 20)}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

export default function Hero({
  badge = "Full-service digital marketing agency",
  title = "Marketing that fills your pipeline, not just your feed.",
  description = "MyWorkAgency plans, designs and builds campaigns, websites and apps that bring in qualified leads and turn them into customers.",
  primaryCta = { label: "See our work", href: "/work" },
  secondaryCta,
  stats = DEFAULT_STATS,
}: HeroProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  const afterTitle = 0.15 + words.length * 0.06 + 0.2;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <Background reduce={reduce} />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-32">
        {/* Left: copy */}
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="show"
          className="max-w-2xl"
        >
          <motion.div
            variants={fadeUp}
            custom={0.05}
            className="inline-flex items-center gap-2 rounded-full border border-[#E4E7F5] bg-white/80 px-4 py-1.5 text-sm font-medium text-[#4B5275] shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7C3AED] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7C3AED]" />
            </span>
            {badge}
          </motion.div>

          <h1
            id="hero-heading"
            aria-label={title}
            className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.5rem,5.6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[#0F1330]"
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                aria-hidden="true"
                className="-mb-[0.12em] mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <motion.span
                  className="inline-block"
                  variants={wordReveal}
                  custom={i}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fadeUp}
            custom={afterTitle}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#4B5275]"
          >
            {description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={afterTitle + 0.15}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.div
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
            >
              <Link
                href={primaryCta.href}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(91,70,255,0.65)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#7C3AED]"
              >
                <span className="relative z-10">{primaryCta.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </Link>
            </motion.div>

            {secondaryCta && (
              <motion.div
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
              >
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center rounded-full border border-[#D9DDF3] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#0F1330] transition-colors duration-300 hover:border-[#7C3AED]/50 hover:bg-[#F5F3FF] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#7C3AED]"
                >
                  {secondaryCta.label}
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.dl
            variants={fadeUp}
            custom={afterTitle + 0.3}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse border-l border-[#E4E7F5] pl-5 first:border-l-0 first:pl-0"
              >
                <dt className="mt-1 max-w-[9rem] text-sm leading-snug text-[#4B5275]">
                  {stat.label}
                </dt>
                <dd className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330]">
                  <AnimatedCounter
                    to={stat.value}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    delay={afterTitle + 0.4}
                  />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Right: animated dashboard visual */}
        <HeroVisual />
      </div>
    </section>
  );
}
