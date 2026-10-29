"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Video } from "@/lib/types";

type SlideVideo = Pick<Video, "id" | "provider" | "video_id" | "file_url" | "thumbnail">;

const AUTOPLAY_MS = 4500;

/** True once the element has been on screen (and whether it is on screen right now). */
function useOnScreen<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [everVisible, setEverVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible, everVisible };
}

function embedSrc(v: SlideVideo) {
  // Autoplay needs the sound off. Looping, no controls, no related videos.
  return v.provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${v.video_id}?autoplay=1&mute=1&loop=1&playlist=${v.video_id}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3`
    : `https://player.vimeo.com/video/${v.video_id}?background=1&autoplay=1&muted=1&loop=1&autopause=0`;
}

/** One video-only card: plays by itself, muted and looping, only while it is on screen. */
function VideoCard({ v, reduce }: { v: SlideVideo; reduce: boolean | null }) {
  const { ref, visible, everVisible } = useOnScreen<HTMLDivElement>();
  const vid = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = vid.current;
    if (!el || v.provider !== "upload") return;
    el.muted = true; // must be set as a property for autoplay to be allowed on every browser
    if (reduce) return;
    if (visible) void el.play().catch(() => undefined);
    else el.pause();
  }, [visible, reduce, v.provider]);

  return (
    <div ref={ref} className="relative aspect-video overflow-hidden rounded-3xl border border-[#E4E7F5] bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] shadow-[0_14px_44px_-26px_rgba(60,70,200,0.4)]">
      {v.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {v.provider === "upload" ? (
        <video
          ref={vid}
          src={everVisible ? v.file_url : undefined}
          poster={v.thumbnail || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          controls={Boolean(reduce)}
          aria-hidden={reduce ? undefined : true}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        everVisible && !reduce && (
          <iframe
            src={embedSrc(v)}
            title="Video"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        )
      )}
    </div>
  );
}

export default function VideoSlider({ videos }: { videos: SlideVideo[] }) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      const card = el?.children[i] as HTMLElement | undefined;
      if (!el || !card) return;
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    },
    [reduce],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      let best = 0;
      let dist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < dist) { dist = d; best = i; }
      });
      setActive(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto slide: pauses while hovered/focused, when the tab is hidden, and for reduced motion
  useEffect(() => {
    if (reduce || paused || videos.length < 2) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const el = track.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      goTo(atEnd ? 0 : Math.min(active + 1, videos.length - 1));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, videos.length, active, goTo]);

  const step = (dir: 1 | -1) => goTo(Math.max(0, Math.min(videos.length - 1, active + dir)));
  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7F5] bg-white text-[#0F1330] shadow-sm transition-colors hover:border-[#7C3AED]/40 hover:text-[#3B5BFF] disabled:opacity-40";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Video showcase"
    >
      {videos.length > 1 && (
        <div className="mb-5 flex items-center justify-end gap-3">
          <button type="button" className={arrow} aria-label="Previous video" onClick={() => step(-1)} disabled={active === 0}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className={arrow} aria-label="Next video" onClick={() => step(1)} disabled={active >= videos.length - 1}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}

      <ul
        ref={track}
        className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <li key={v.id} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]" aria-roledescription="slide" aria-label={`${i + 1} of ${videos.length}`}>
            <motion.div
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <VideoCard v={v} reduce={reduce} />
            </motion.div>
          </li>
        ))}
      </ul>

      {videos.length > 1 && (
        <div className="mt-2 flex justify-center gap-2" role="group" aria-label="Choose a slide">
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              aria-label={`Go to video ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED]" : "w-2.5 bg-[#D9DDF3] hover:bg-[#B9BEE8]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
