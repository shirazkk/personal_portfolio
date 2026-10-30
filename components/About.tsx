'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, revealOnce } from '@/lib/animations';
import { portfolioData } from '@/data/portfolio';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const milestones = useMemo(() => [
    ...portfolioData.experience.map((item) => ({
      kind: 'Experience',
      period: item.period,
      title: item.title,
      place: item.company,
      detail: item.description,
    })),
    ...portfolioData.credentials.education.map((item) => ({
      kind: 'Education',
      period: item.year,
      title: item.degree,
      place: item.institution,
      detail: '',
    })),
  ].slice(0, 4), []);

  useGSAP(() => {
    const scope = sectionRef.current;
    if (!scope || prefersReducedMotion()) return;

    // Section blocks fade in one by one as they enter the viewport.
    scope.querySelectorAll<HTMLElement>('.about-reveal').forEach((element) => {
      revealOnce({ targets: element, trigger: element, y: 28 });
    });

    // Grids + lists stagger their children (70ms / 50ms).
    const milestones = scope.querySelector('.milestone-grid');
    if (milestones) {
      revealOnce({
        targets: milestones.querySelectorAll('.milestone-card'),
        trigger: milestones,
        y: 22,
      });
    }

    const interests = scope.querySelector('.interest-list');
    if (interests) {
      revealOnce({ targets: interests.children, trigger: interests, y: 14, stagger: 0.05 });
    }

    const stats = scope.querySelector('.stats-grid');
    if (stats) {
      revealOnce({ targets: stats.children, trigger: stats, y: 18, stagger: 0.06 });
    }
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="about-stack-panel relative z-10 -mt-1 overflow-hidden rounded-t-[1.5rem] bg-[#0a0f0d] px-6 py-24 text-white sm:px-9 md:-mt-2 md:rounded-t-[2rem] md:px-12 md:py-32 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-32 size-[34rem] rounded-full bg-[#1e6b4d]/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px]">
        <header className="about-reveal mb-12 max-w-5xl md:mb-16">
          <p className="eyebrow mb-5">01 / About me</p>
          <h2 className="font-manrope text-6xl font-extrabold leading-[.9] tracking-[-.07em] text-[#f1f2ed] sm:text-7xl md:text-8xl">
            WHO <span className="about-serif text-[#34d399]">am</span> I?
          </h2>
          <span className="mt-7 block h-[2px] w-16 bg-[#34d399]" />
          <p className="mt-7 max-w-5xl text-base leading-7 text-white/65 sm:text-lg md:text-xl">{portfolioData.about.bio.split('. ')[0]}.</p>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
          <figure className="about-reveal relative isolate min-h-[390px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#101813] sm:min-h-[470px]">
            <Image
              src="/about_pic.png"
              alt="Portrait of Shiraz Abubakar"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </figure>

          <div className="about-reveal pt-1 lg:pt-2">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[.22em] text-white/35">The perspective</p>
            <p className="text-base leading-8 text-white/75 sm:text-lg">{portfolioData.about.bio.split('. ').slice(1).join('. ')}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55">A thoughtful blend of product thinking, strong engineering, and a feel for the details people notice.</p>
            <div className="interest-list mt-8 flex flex-wrap gap-2">
              {portfolioData.about.interests.slice(0, 5).map((interest) => (
                <span key={interest} className="rounded-full border border-white/10 px-3.5 py-2 text-[10px] uppercase tracking-[.08em] text-white/55 transition duration-200 hover:-translate-y-0.5 hover:border-[#34d399]/45 hover:text-[#a4edc9]">{interest}</span>
              ))}
            </div>
            <a href="#experience" className="group mt-9 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a6e4c2] transition-colors hover:text-[#34d399]">Follow the path <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
          </div>
        </div>

        <div id="experience" className="about-timeline mt-24 border-t border-white/10 pt-8 md:mt-32 md:pt-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="eyebrow mb-3">Experience / Education</p><h3 className="font-manrope text-3xl font-bold tracking-[-.06em] text-[#f1f2ed] md:text-5xl">The path so far.</h3></div>
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/35">Selected milestones · 01—04</span>
          </div>
          <div className="milestone-grid grid gap-3 sm:grid-cols-2">
            {milestones.map((item, index) => (
              <article key={`${item.title}-${item.place}`} className="milestone-card group grid gap-5 rounded-xl border border-white/[.09] bg-white/[.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#34d399]/30 hover:bg-white/[.045] sm:grid-cols-[.36fr_1fr] sm:p-6">
                <div className="flex items-start justify-between gap-4 sm:flex-col">
                  <span className="font-mono text-[10px] text-[#34d399]">{item.period}</span><span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/25">{item.kind} / 0{index + 1}</span>
                </div>
                <div><h4 className="font-manrope text-base font-semibold leading-6 text-white/90 sm:text-lg">{item.title}</h4><p className="mt-1 text-xs text-white/45">{item.place}</p>{item.detail && <p className="mt-4 line-clamp-2 text-xs leading-6 text-white/40">{item.detail}</p>}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="stats-grid mt-8 grid grid-cols-3 border-t border-white/10 pt-5">
          {portfolioData.stats.map(({ label, value }) => <div key={label} className="pr-3"><p className="font-bebas text-3xl text-[#34d399] md:text-4xl">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.12em] text-white/40">{label}</p></div>)}
        </div>
      </div>
    </section>
  );
}
