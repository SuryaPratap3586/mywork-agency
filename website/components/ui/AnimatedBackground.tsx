"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Light-theme animated backdrop shared by every page hero: dot grid + drifting gradient blobs. */
export default function AnimatedBackground() {
  const reduce = useReducedMotion();
  const drift = (x: number, y: number, duration: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#C9CEF0 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 65% 40%, #000 25%, transparent 75%)",
          maskImage: "radial-gradient(ellipse 70% 70% at 65% 40%, #000 25%, transparent 75%)",
        }}
      />
      <motion.div className="absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#7C3AED]/15 blur-3xl" {...drift(60, 40, 18)} />
      <motion.div className="absolute -right-24 top-0 h-[460px] w-[460px] rounded-full bg-[#3B5BFF]/15 blur-3xl" {...drift(-50, 60, 22)} />
      <motion.div className="absolute -bottom-40 left-1/3 h-[300px] w-[300px] rounded-full bg-[#A78BFA]/15 blur-3xl" {...drift(40, -30, 20)} />
    </div>
  );
}
