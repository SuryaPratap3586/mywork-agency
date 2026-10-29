import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const ICONS = [
  "M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A3.7 3.7 0 0 0 21 10.7C21 6.4 17 3 12 3ZM7 12a1.3 1.3 0 1 1 0-2.6A1.3 1.3 0 0 1 7 12Zm3-4a1.3 1.3 0 1 1 0-2.6A1.3 1.3 0 0 1 10 8Zm4 0a1.3 1.3 0 1 1 0-2.6A1.3 1.3 0 0 1 14 8Zm3 4a1.3 1.3 0 1 1 0-2.6A1.3 1.3 0 0 1 17 12Z",
  "M12 2c3.5 1.5 6 5 6 9 0 1.3-.2 2.500-.6 3.600l2.100 2.100c.3.300.4.800.2 1.200l-1 2.300-3.100-1.100c-1 .6-2.100 1-3.600 1.100-1.500-.1-2.600-.5-3.600-1.100l-3.100 1.100-1-2.300c-.2-.4-.1-.9.200-1.200l2.100-2.100A10.500 10.500 0 0 1 6 11c0-4 2.500-7.500 6-9Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  "M12 2.500 4.500 5.500v5.700c0 4.600 3.100 8.900 7.500 10.300 4.400-1.400 7.500-5.700 7.500-10.300V5.500L12 2.500Zm-1.200 13.800-3.300-3.300 1.400-1.400 1.900 1.900 4.400-4.400 1.400 1.400-5.800 5.800Z",
  "M4 19V5h2v12h14v2H4Zm4-4V9h3v6H8Zm5 0V6h3v9h-3Zm5 0v-4h3v4h-3Z",
  "M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1Z",
  "M12 2l3.100 6.300 6.900 1-5 4.900 1.200 6.900L12 17.800 5.800 21.100 7 14.200 2 9.300l6.900-1L12 2Z",
];

export default function IncludedSection({
  title,
  text,
  items,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  text: string;
  items: { title: string; text: string }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="relative overflow-hidden" aria-labelledby="included-heading">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[360px] w-[360px] rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2 id="included-heading" className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-5xl">{title}</h2>
            {text && <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#4B5275]">{text}</p>}
          </Reveal>
          {ctaLabel && ctaHref && (
            <Reveal delay={0.1} className="lg:text-right">
              <Link href={ctaHref} className="inline-flex rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(91,70,255,0.65)] transition-transform hover:-translate-y-0.5">
                {ctaLabel}
              </Link>
            </Reveal>
          )}
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <li key={`${it.title}-${i}`}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-[#E4E7F5] bg-white p-8 shadow-[0_10px_40px_-26px_rgba(60,70,200,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7C3AED]/30 hover:shadow-[0_24px_60px_-28px_rgba(60,70,200,0.45)]">
                  <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#3B5BFF]/10 to-[#7C3AED]/10 transition-transform duration-500 group-hover:scale-150" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] shadow-[0_12px_28px_-12px_rgba(91,70,255,0.7)]">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor" aria-hidden="true"><path d={ICONS[i % ICONS.length]} /></svg>
                  </span>
                  <h3 className="relative mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">{it.title}</h3>
                  <p className="relative mt-3 leading-relaxed text-[#4B5275]">{it.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
