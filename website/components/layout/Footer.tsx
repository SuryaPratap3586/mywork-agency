import Link from "next/link";
import { getContent } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";

const SOCIALS = [
  { key: "facebook", label: "Facebook", path: "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" },
  { key: "instagram", label: "Instagram", path: "M7.5 3h9A4.500 4.500 0 0 1 21 7.500v9a4.500 4.500 0 0 1-4.500 4.500h-9A4.500 4.500 0 0 1 3 16.500v-9A4.500 4.500 0 0 1 7.500 3Zm0 1.800A2.700 2.700 0 0 0 4.800 7.500v9a2.700 2.700 0 0 0 2.700 2.700h9a2.700 2.700 0 0 0 2.700-2.700v-9a2.700 2.700 0 0 0-2.700-2.700h-9ZM12 7.800a4.200 4.200 0 1 1 0 8.400 4.200 4.200 0 0 1 0-8.400Zm0 1.800a2.400 2.400 0 1 0 0 4.800 2.400 2.400 0 0 0 0-4.800Zm4.700-3.300a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" },
  { key: "linkedin", label: "LinkedIn", path: "M6.9 8.9H4V20h2.900V8.900ZM5.500 4a1.700 1.700 0 1 0 0 3.400 1.700 1.700 0 0 0 0-3.400ZM20 13.600c0-2.700-1.400-4.900-3.800-4.900-1.200 0-2.100.6-2.600 1.400V8.900h-2.800V20h2.900v-6c0-1.500.7-2.600 2-2.600s1.600 1 1.600 2.500V20H20v-6.400Z" },
  { key: "x", label: "X", path: "M17.800 4h2.900l-6.300 7.200L21.800 20H16l-4.500-5.900L6.300 20H3.400l6.700-7.700L2.600 4h5.900l4.100 5.400L17.800 4Zm-1 14.300h1.600L7.500 5.600H5.800l11 12.700Z" },
  { key: "youtube", label: "YouTube", path: "M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800ZM10 15V9l5.200 3L10 15Z" },
] as const;

export default async function Footer() {
  const s = await getContent("settings");
  const head = "text-sm font-semibold text-[#0F1330]";
  const link = "text-sm text-[#4B5275] transition-colors hover:text-[#3B5BFF]";
  const socials = SOCIALS.filter((x) => s[x.key]);

  return (
    <footer className="border-t border-[#E4E7F5] bg-[#FAFAFE]" aria-label="Site footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr_1.2fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B5BFF] to-[#7C3AED] text-sm font-bold text-white">
              {s.company_name.slice(0, 1).toUpperCase()}
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#0F1330]">{s.company_name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#4B5275]">{s.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((x) => (
                <li key={x.key}>
                  <a
                    href={s[x.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={x.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7F5] bg-white text-[#4B5275] transition-all hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:text-[#3B5BFF]"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><path d={x.path} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Company">
          <p className={head}>Company</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link href="/" className={link}>Home</Link></li>
            <li><Link href="/about" className={link}>About us</Link></li>
            <li><Link href="/work" className={link}>Our work</Link></li>
            <li><Link href="/testimonials" className={link}>Testimonials</Link></li>
            <li><Link href="/careers" className={link}>Careers</Link></li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <p className={head}>Services</p>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.value}><Link href={`/work?service=${c.value}`} className={link}>{c.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <p className={head}>Resources</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link href="/blog" className={link}>Blog</Link></li>
            <li><Link href="/work" className={link}>Case studies</Link></li>
            <li><Link href="/privacy" className={link}>Privacy Policy</Link></li>
            <li><Link href="/terms" className={link}>Terms and Conditions</Link></li>
          </ul>
        </nav>

        <div>
          <p className={head}>Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-[#4B5275]">
            {s.email && <li><a href={`mailto:${s.email}`} className={link}>{s.email}</a></li>}
            {s.phone && <li><a href={`tel:${s.phone.replace(/[^+\d]/g, "")}`} className={link}>{s.phone}</a></li>}
            {s.address && <li className="whitespace-pre-line leading-relaxed">{s.address}</li>}
            {!s.email && !s.phone && !s.address && <li>Add contact details in the admin under Site settings.</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E4E7F5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-[#8A90B0] sm:px-8">
          <p>© {new Date().getFullYear()} {s.company_name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="hover:text-[#3B5BFF]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#3B5BFF]">Terms and Conditions</Link>
            <a href="#top" className="font-medium text-[#4B5275] hover:text-[#3B5BFF]">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
