import Image from 'next/image';
import { portfolioData } from '@/data/portfolio';

export default function Education() {
  return (
    <section id="education" className="px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex items-center gap-4">
          <span className="eyebrow">04 / Learning</span><span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="font-bebas text-5xl leading-none text-white md:text-6xl">Grounded in <span className="text-[#34d399]">learning.</span></h2>
          <p className="text-xs text-white/40">A foundation that keeps evolving.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {portfolioData.credentials.education.map((item, index) => (
            <article key={item.institution} className="education-card flex items-start gap-4 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition hover:border-[#34d399]/25">
              {item.logo && <Image src={item.logo} alt={`${item.institution} logo`} width={38} height={38} className="mt-1 size-9 rounded-lg object-contain" loading={index < 2 ? 'eager' : 'lazy'} sizes="38px" />}
              <div>
                <p className="font-mono text-[10px] text-[#34d399]">{item.year}</p>
                <h3 className="mt-2 text-sm font-bold leading-5 text-white/80">{item.degree}</h3>
                <p className="mt-1 text-xs text-white/40">{item.institution}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
