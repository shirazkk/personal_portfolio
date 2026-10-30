'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { portfolioData } from '@/data/portfolio';

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.experience-item', {
      y: 28,
      opacity: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', once: true },
    });
  }, { scope: sectionRef });

  return (
    <section id="experience" ref={sectionRef} className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex items-center gap-4">
          <span className="eyebrow">03 / Experience</span><span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="font-bebas text-6xl leading-[.9] text-white md:text-8xl">Built through<br /><span className="text-[#34d399]">doing.</span></h2>
          <p className="max-w-md text-sm leading-7 text-white/50">A hands-on path through product building, team leadership, and independent work.</p>
        </div>

        <div className="grid gap-4">
          {portfolioData.experience.map((item, index) => (
            <article key={`${item.company}-${item.title}`} className="experience-item glass-surface grid gap-6 rounded-[1.6rem] p-6 md:grid-cols-[.38fr_1fr] md:gap-10 md:p-8">
              <div className="flex items-start justify-between gap-4 md:flex-col md:justify-start">
                <span className="rounded-full border border-[#34d399]/20 bg-[#34d399]/[.06] px-3 py-2 font-mono text-[10px] text-[#34d399]">{item.period}</span>
                <span className="font-mono text-[10px] text-white/25">ROLE / 0{index + 1}</span>
              </div>
              <div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-bebas text-3xl leading-none text-white md:text-4xl">{item.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-white/55">{item.company}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-white/35">{item.location}<ArrowUpRight size={13} aria-hidden="true" /></span>
                </div>
                <p className="mt-5 max-w-4xl text-sm leading-7 text-white/50">{item.description}</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.achievements.slice(0, 4).map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-xs leading-6 text-white/55"><span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#34d399]" />{achievement}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.technologies.slice(0, 6).map((technology) => <span key={technology} className="text-[9px] uppercase tracking-[.1em] text-white/30">{technology}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
