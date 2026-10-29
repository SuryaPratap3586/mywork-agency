import Image from "next/image";

export default function ClientLogos({ clients }: { clients: { name: string; logo: string }[] }) {
  if (clients.length === 0) return null;
  const loop = [...clients, ...clients];
  return (
    <section aria-label="Brands we have worked with" className="border-y border-[#E4E7F5] bg-white py-10">
      <p className="mb-6 text-center text-sm font-medium text-[#8A90B0]">Trusted by growing brands</p>
      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee-track flex w-max items-center gap-14 px-7">
          {loop.map((c, i) => (
            <li key={`${c.name}-${i}`} aria-hidden={i >= clients.length} className="relative h-10 w-32 shrink-0 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image src={c.logo} alt={i < clients.length ? c.name : ""} fill sizes="128px" className="object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
