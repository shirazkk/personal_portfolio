'use client';

import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, revealOnce } from '@/lib/animations';
import Reveal from '@/components/Reveal';

const groups = [
  { name: 'Frontend', tools: [['JS', 'JavaScript'], ['TS', 'TypeScript'], ['⚛', 'React'], ['N', 'Next.js'], ['◉', 'Redux Toolkit'], ['≈', 'Tailwind CSS'], ['B', 'Bootstrap'], ['✳', 'GSAP']] },
  { name: 'Backend & Real-Time', tools: [['⬢', 'Node.js'], ['ex', 'Express.js'], ['ϟ', 'Socket.io'], ['◆', 'FastAPI']] },
  { name: 'Database & ORM', tools: [['M', 'MongoDB'], ['P', 'PostgreSQL'], ['S', 'Supabase'], ['S', 'Sanity CMS']] },
  { name: 'DevOps & Cloud', tools: [['▲', 'Vercel'], ['D', 'Docker'], ['G', 'Google Cloud'], ['F', 'Firebase']] },
  { name: 'AI, Testing & Tools', tools: [['◎', 'OpenAI Agent SDK'], ['C', 'CrewAI'], ['⌘', 'LangChain'], ['Q', 'Qdrant'], ['⌁', 'MCP'], ['⌘', 'Git']] },
] as const;

const filters = ['All Categories', ...groups.map((group) => group.name)];

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState('All Categories');
  const visibleGroups = useMemo(() => active === 'All Categories' ? groups : groups.filter((group) => group.name === active), [active]);

  // Heading + filters reveal once on mount. Groups animate themselves via <Reveal>,
  // so changing a filter never replays the whole section.
  useGSAP(() => {
    const scope = sectionRef.current;
    if (!scope || prefersReducedMotion()) return;

    const heading = scope.querySelector('.tech-heading');
    if (heading) revealOnce({ targets: heading, trigger: heading, y: 26 });

    const filterBar = scope.querySelector('.tech-filters');
    if (filterBar) {
      revealOnce({
        targets: filterBar.querySelectorAll('.tech-filter'),
        trigger: filterBar,
        y: 14,
        stagger: 0.04,
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="tech-stack" ref={sectionRef} className="tech-section px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1152px]">
        <header className="tech-heading">
          <p className="eyebrow mb-5">03 / The toolkit</p>
          <h2 className="font-manrope font-extrabold text-[clamp(4.6rem,10vw,8rem)] leading-[.82] tracking-[-.075em] text-[#edf0eb]">MY TECH <span className="about-serif font-normal text-accent">stack</span></h2>
          <span className="mt-7 block h-[3px] w-20 bg-accent" />
          <p className="mt-8 text-base leading-7 text-white/75 md:text-lg">A selection of technologies I use to design, build, and deploy full-stack web applications.</p>
        </header>

        <div className="tech-filters mt-14 flex flex-wrap gap-2.5" role="group" aria-label="Filter technologies by category">
          {filters.map((filter) => (
            <button key={filter} type="button" onClick={() => setActive(filter)} aria-pressed={active === filter}
              className={`tech-filter min-h-11 rounded-full border px-4 font-mono text-xs transition duration-200 active:scale-95 ${active === filter ? 'border-[#edf0eb] bg-[#edf0eb] text-[#101512]' : 'border-white/10 text-white/55 hover:border-accent/45 hover:text-white'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 space-y-16 md:space-y-24" aria-live="polite">
          {visibleGroups.map((group) => (
            <Reveal key={group.name} className="tech-group grid gap-7 md:grid-cols-[.58fr_1fr] md:gap-12" stagger={0.045} y={16}>
              <div data-reveal-item>
                <h3 className="max-w-sm font-manrope text-3xl font-extrabold uppercase leading-[.98] tracking-[-.055em] text-[#62d9a7] md:text-5xl">{group.name}</h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-white/30">{group.tools.length} technologies</p>
              </div>
              <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                {group.tools.map(([mark, name]) => (
                  <li key={name} data-reveal-item className="tech-tool flex min-h-[66px] items-center gap-3 rounded-lg border border-white/[.08] bg-white/[.015] px-3 transition duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white/[.035] sm:px-4">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-md bg-[#15221b] font-mono text-sm font-bold text-[#65dfa9]">{mark}</span>
                    <span className="text-xs font-bold leading-5 text-white/80 sm:text-sm">{name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
