import Reveal from "@/components/ui/Reveal";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {items.map((f, i) => (
          <Reveal key={`${f.q}-${i}`} delay={Math.min(i * 0.05, 0.25)}>
            <details className="group rounded-2xl border border-[#E4E7F5] bg-white px-6 py-5 open:shadow-[0_16px_40px_-26px_rgba(60,70,200,0.4)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-display)] text-lg font-bold text-[#0F1330] [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#7C3AED] transition-transform duration-300 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              </summary>
              <p className="mt-3 leading-relaxed text-[#4B5275]">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </>
  );
}
