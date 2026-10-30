'use client';

import { useRef, type CSSProperties } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, revealOnce } from '@/lib/animations';
import { portfolioData } from '@/data/portfolio';
import { useStickyStack } from '@/lib/useStickyStack';

/** Per-card CSS vars: --stack-index drives the sticky `top`, zIndex stacks later cards on top. */
const stackCardStyle = (index: number) =>
  ({ '--stack-index': index, zIndex: index + 1 } as CSSProperties);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const projects = portfolioData.projects.filter((project) => project.featured);

  // Heading + row content reveal. Row shells are left untouched for the sticky scale.
  useGSAP(() => {
    const scope = sectionRef.current;
    if (!scope || prefersReducedMotion()) return;

    const heading = scope.querySelector('.project-heading');
    if (heading) revealOnce({ targets: heading, trigger: heading, y: 26 });

    scope.querySelectorAll<HTMLElement>('.project-row').forEach((row) => {
      revealOnce({
        targets: row.querySelectorAll('.project-content'),
        trigger: row,
        y: 14,
        stagger: 0.06,
        start: 'top 88%',
      });
    });
  }, { scope: sectionRef });

  // Optional depth: shrink each card as the next one covers it.
  useStickyStack(sectionRef, '.project-row');

  return (
    <section id="projects" ref={sectionRef} className="project-section px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1152px]">
        <header className="project-heading border-b border-[#17211c]/15 pb-12 md:pb-14">
          <h2 className="font-manrope font-extrabold text-[clamp(4.4rem,7vw,6rem)] leading-[.82] tracking-[-.075em] text-[#151a17]">
            SELECTED <span className="about-serif font-normal text-[#31b783]">works</span>
          </h2>
          <span className="mt-5 block h-[3px] w-20 bg-[#31b783]" />
        </header>

        <div className="project-stack">
          {projects.map((project, index) => {
            const href = project.liveUrl || project.githubUrl || '#contact';
            return (
              <article
                key={project.title}
                className="project-row group grid gap-3 border-b border-[#17211c]/15 py-9 md:grid-cols-[56px_1fr_auto] md:items-center md:gap-6 md:py-12"
                style={stackCardStyle(index)}
              >
                <span className="project-content font-mono text-xs text-[#52645a]/65">{String(index + 1).padStart(2, '0')}</span>
                <div className="project-content">
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[.18em] text-[#52645a]/65">{project.category}</p>
                  <h3 className="font-manrope text-3xl font-extrabold uppercase leading-[.98] tracking-[-.055em] text-[#151a17] transition-colors duration-300 group-hover:text-[#279c70] sm:text-4xl md:text-6xl">{project.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#26332c]/65 md:hidden">{project.description}</p>
                </div>
                <div className="project-content flex items-center gap-5 md:pl-8">
                  <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 self-start font-mono text-[10px] font-semibold uppercase tracking-[.12em] text-[#17211c] transition duration-200 hover:text-[#279c70] active:opacity-70 md:self-center">
                    {project.liveUrl ? 'View project' : 'View source'} <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  {project.githubUrl && project.liveUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code on GitHub`} className="text-[#52645a]/65 transition-colors hover:text-[#279c70]"><Code2 size={16} aria-hidden="true" /></a>}
                </div>
              </article>
            );
          })}
        </div>
        <a href="https://github.com/shirazkk" target="_blank" rel="noreferrer" className="group mt-8 inline-flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-[#26332c]/60 transition-colors hover:text-[#279c70]">More work on GitHub <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
      </div>
    </section>
  );
}
