"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINE_PATH =
  "M0 130 C40 128, 40 116, 70 116 S120 118, 150 100 S210 84, 240 76 S300 52, 330 40 S375 20, 396 14";
const AREA_PATH = `${LINE_PATH} L396 160 L0 160 Z`;

const BARS = [38, 54, 46, 72, 92];

function Float({
  children,
  distance = 10,
  duration = 5,
  delay = 0,
  reduce,
}: {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroVisual() {
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 16, mass: 0.6 });

  const mainX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const mainY = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const aX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const aY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const bX = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const bY = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const cX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const cY = useTransform(sy, [-0.5, 0.5], [-12, 12]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto h-[470px] w-full max-w-[560px] sm:h-[500px]"
      role="img"
      aria-label="Illustration of a campaign growth dashboard showing rising traffic, leads and return on ad spend"
    >
      {/* Main card: traffic chart */}
      <motion.div
        style={{ x: mainX, y: mainY }}
        {...enter(0.35)}
        className="absolute left-0 top-12 z-10 w-[90%] rounded-3xl border border-[#E4E7F5] bg-white p-5 shadow-[0_30px_80px_-30px_rgba(60,70,200,0.35)] sm:p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[#4B5275]">Organic traffic</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[#0F1330]">
              <AnimatedCounter to={248} prefix="+" suffix="%" delay={1.2} />
            </p>
          </div>
          <span className="rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-medium text-[#3B5BFF]">
            Last 6 months
          </span>
        </div>

        <svg
          viewBox="0 0 400 160"
          className="mt-4 h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B5BFF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D5CF6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6D5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[40, 80, 120].map((y) => (
            <line
              key={y}
              x1="0"
              x2="400"
              y1={y}
              y2={y}
              stroke="#E9ECF8"
              strokeDasharray="4 6"
            />
          ))}

          <motion.path
            d={AREA_PATH}
            fill="url(#heroArea)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
          />
          <motion.path
            d={LINE_PATH}
            fill="none"
            stroke="url(#heroLine)"
            strokeWidth={3.5}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.9, ease: EASE }}
          />

          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.4 }}
          >
            <circle cx="396" cy="14" r="5.5" fill="#7C3AED" />
            <circle cx="396" cy="14" r="5.5" fill="#7C3AED" opacity="0.5">
              {!reduce && (
                <>
                  <animate
                    attributeName="r"
                    values="5.5;16"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
          </motion.g>
        </svg>

        <div className="mt-2 flex justify-between text-xs text-[#8A90B0]">
          {["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </motion.div>

      {/* Floating card A: leads */}
      <motion.div
        style={{ x: aX, y: aY }}
        {...enter(0.8)}
        className="absolute right-0 top-0 z-20"
      >
        <Float reduce={reduce} duration={5.5} distance={10}>
          <div className="w-[190px] rounded-2xl border border-[#E4E7F5] bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(60,70,200,0.4)] backdrop-blur">
            <p className="text-xs font-medium text-[#4B5275]">Qualified leads</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">
              <AnimatedCounter to={1284} delay={1.4} />
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[
                  "from-[#3B5BFF] to-[#6D8BFF]",
                  "from-[#7C3AED] to-[#A78BFA]",
                  "from-[#4F46E5] to-[#818CF8]",
                ].map((g) => (
                  <span
                    key={g}
                    className={`h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br ${g}`}
                  />
                ))}
              </div>
              <span className="rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[11px] font-semibold text-[#5B3FE0]">
                +18%
              </span>
            </div>
          </div>
        </Float>
      </motion.div>

      {/* Floating card B: ROAS */}
      <motion.div
        style={{ x: bX, y: bY }}
        {...enter(1.0)}
        className="absolute bottom-0 left-2 z-20"
      >
        <Float reduce={reduce} duration={6.2} distance={12} delay={0.6}>
          <div className="w-[190px] rounded-2xl border border-[#E4E7F5] bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(60,70,200,0.4)] backdrop-blur">
            <p className="text-xs font-medium text-[#4B5275]">Return on ad spend</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">
                <AnimatedCounter to={4.8} decimals={1} suffix="x" delay={1.6} />
              </p>
              <div className="flex h-10 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-2 origin-bottom rounded-sm bg-gradient-to-t from-[#3B5BFF] to-[#7C3AED]"
                    style={{ height: `${h}%` }}
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 1.6 + i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Float>
      </motion.div>

      {/* Floating chip C: ranking */}
      <motion.div
        style={{ x: cX, y: cY }}
        {...enter(1.2)}
        className="absolute bottom-24 right-0 z-20 sm:bottom-20"
      >
        <Float reduce={reduce} duration={4.8} distance={8} delay={1.1}>
          <div className="flex items-center gap-2.5 rounded-full border border-[#E4E7F5] bg-white/95 py-2 pl-2 pr-4 shadow-[0_16px_40px_-18px_rgba(60,70,200,0.45)] backdrop-blur">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#0F1330]">Page 1 on Google</span>
          </div>
        </Float>
      </motion.div>
    </div>
  );
}
