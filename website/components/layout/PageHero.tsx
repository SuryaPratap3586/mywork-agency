"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Standard hero used on every inner page: animated light background, word-by-word headline, description, CTAs. */
export default function PageHero({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  const after = 0.15 + words.length * 0.06 + 0.1;

  return (
    <section className="relative isolate overflow-hidden border-b border-[#E4E7F5] pb-16 pt-32 sm:pt-36">
      <AnimatedBackground />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h1
          aria-label={title}
          className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.06] tracking-tight text-[#0F1330]"
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} aria-hidden="true" className="-mb-[0.12em] mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.85, ease: EASE, delay: 0.1 + i * 0.06 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        {description && (
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-[#4B5275]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: after }}
          >
            {description}
          </motion.p>
        )}

        {actions && (
          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: after + 0.12 }}
          >
            {actions}
          </motion.div>
        )}

        {children && (
          <motion.div
            className="mt-10"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: after + 0.24 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
