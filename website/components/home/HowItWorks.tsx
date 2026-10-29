"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

/** Numbered steps with a gradient progress line that fills as the visitor scrolls through them. */
export default function HowItWorks({
  title,
  text,
  steps,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  text: string;
  steps: { title: string; text: string }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.round(v * (steps.length - 1)))));
  });

  if (steps.length === 0) return null;
  const last = steps.length - 1;
  const current = reduce ? last : active;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-labelledby="how-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="how-heading" className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-5xl">{title}</h2>
        {text && <p className="mt-4 text-lg leading-relaxed text-[#4B5275]">{text}</p>}
      </Reveal>

      <ol
        ref={ref}
        className="relative mt-16 grid gap-10 lg:gap-6"
        style={{ "--cols": steps.length } as CSSProperties}
      >
        {/* progress line: vertical on small screens */}
        <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-0.5 rounded-full bg-[#E4E7F5] lg:hidden">
          <motion.span className="block h-full origin-top rounded-full bg-gradient-to-b from-[#3B5BFF] to-[#7C3AED]" style={{ scaleY: reduce ? 1 : scrollYProgress }} />
        </span>
        {/* progress line: horizontal on large screens */}
        <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-[27px] hidden h-0.5 rounded-full bg-[#E4E7F5] lg:block">
          <motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED]" style={{ scaleX: reduce ? 1 : scrollYProgress }} />
        </span>

        {steps.map((s, i) => {
          const on = i <= current;
          return (
            <li
              key={`${s.title}-${i}`}
              className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
            >
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-[family-name:var(--font-display)] text-lg font-bold transition-all duration-500 ${
                  on
                    ? "border-transparent bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] text-white shadow-[0_12px_28px_-10px_rgba(91,70,255,0.7)]"
                    : "border-[#E4E7F5] bg-white text-[#8A90B0]"
                } ${i === current && !reduce ? "scale-110" : ""}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1 lg:pt-5">
                <p className="text-xs font-semibold text-[#8A90B0] lg:hidden">Step {i + 1}</p>
                <h3 className={`font-[family-name:var(--font-display)] text-xl font-bold transition-colors duration-500 ${on ? "text-[#0F1330]" : "text-[#8A90B0]"}`}>{s.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-[#4B5275]">{s.text}</p>
                {i === last && ctaLabel && ctaHref && (
                  <Link href={ctaHref} className="mt-4 inline-flex rounded-full border border-[#D9DDF3] px-5 py-2 text-sm font-semibold text-[#3B5BFF] transition-colors hover:bg-[#EEF0FF]">{ctaLabel}</Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
