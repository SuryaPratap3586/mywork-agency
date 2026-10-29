import PageHero from "@/components/layout/PageHero";
import { getContent } from "@/lib/content";

export default async function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: { h: string; p: string[] }[] }) {
  const s = await getContent("settings");
  return (
    <main>
      <PageHero title={title} description={intro} />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          This is a general template. Have it reviewed against the laws that apply to your business and replace it with your own wording before you rely on it.
        </div>
        <div className="space-y-10">
          {sections.map((sec) => (
            <div key={sec.h}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">{sec.h}</h2>
              <div className="mt-3 space-y-3 text-[17px] leading-8 text-[#3B4160]">{sec.p.map((t, i) => <p key={i}>{t}</p>)}</div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-sm text-[#4B5275]">
          Questions? {s.email ? <>Email us at <a className="font-medium text-[#3B5BFF]" href={`mailto:${s.email}`}>{s.email}</a>.</> : "Contact us using the details in the footer."}
        </p>
      </section>
    </main>
  );
}
