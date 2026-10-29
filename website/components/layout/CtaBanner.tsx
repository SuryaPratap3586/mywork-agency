import Link from "next/link";
import { getContent } from "@/lib/content";

/** Gradient call-to-action banner. Uses the contact email from Admin > Settings when set. */
export default async function CtaBanner({ title, text }: { title: string; text: string }) {
  const settings = await getContent("settings");
  const href = settings.email ? `mailto:${settings.email}` : "/work";
  const label = settings.email ? "Email us" : "See our work";
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] px-8 py-14 text-center text-white sm:px-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/85">{text}</p>
        <Link
          href={href}
          className="relative mt-8 inline-flex rounded-full bg-white px-8 py-3.5 text-[15px] font-semibold text-[#3B2FD0] shadow-lg transition-transform hover:-translate-y-0.5"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
