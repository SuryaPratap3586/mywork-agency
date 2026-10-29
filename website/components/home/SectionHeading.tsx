import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  title,
  text,
  id,
  action,
  center = false,
}: {
  title: string;
  text?: string;
  id?: string;
  action?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={`flex flex-wrap items-end justify-between gap-4 ${center ? "justify-center text-center" : ""}`}>
      <div className={center ? "mx-auto max-w-2xl" : ""}>
        <h2 id={id} className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#0F1330] sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 max-w-2xl text-[#4B5275]">{text}</p>}
      </div>
      {action}
    </Reveal>
  );
}
