'use client';

import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, revealOnce } from '@/lib/animations';
import { useStickyStack } from '@/lib/useStickyStack';

const services = [
  {
    number: "01",
    title: "Full Stack Development",
    description:
      "End-to-end development of modern web applications, from considered frontend interfaces to dependable APIs and the systems behind them.",
    tools: ["Next.js & React", "TypeScript", "Node.js", "FastAPI", "Sanity CMS"],
  },
  {
    number: "02",
    title: "Agentic AI Products",
    description:
      "Practical AI products that connect models, tools, and data into workflows people can understand and use with confidence.",
    tools: ["OpenAI Agent SDK", "CrewAI", "RAG Pipelines", "MCP", "Qdrant"],
  },
  {
    number: "03",
    title: "Interface & Experience",
    description:
      "Responsive, accessible interfaces with purposeful motion, clear visual hierarchy, and the performance to feel effortless.",
    tools: ["UI/UX Design", "Tailwind CSS", "Framer Motion", "Performance", "Accessibility"],
  },
];

/** Per-card CSS vars: --stack-index drives the sticky `top`, zIndex stacks later cards on top. */
const stackCardStyle = (index: number) =>
  ({ '--stack-index': index, zIndex: index + 1 } as CSSProperties);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  // Heading + each card's content reveal. Card shells stay free for the sticky
  // scale transform written by useStickyStack.
  useGSAP(() => {
    const scope = sectionRef.current;
    if (!scope || prefersReducedMotion()) return;

    const heading = scope.querySelector('.service-heading');
    if (heading) revealOnce({ targets: heading, trigger: heading, y: 28 });

    scope.querySelectorAll<HTMLElement>('.service-row').forEach((row) => {
      revealOnce({
        targets: row.querySelectorAll('.service-content'),
        trigger: row,
        y: 18,
        stagger: 0.07,
        start: 'top 88%',
      });
    });
  }, { scope: sectionRef });

  // Optional depth: shrink each card as the next one covers it.
  useStickyStack(sectionRef, '.service-row');

  return (
    <section id="skills" ref={sectionRef} className="service-section px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="service-heading grid gap-12 pb-20 md:grid-cols-[1fr_.58fr] md:items-end md:pb-28">
          <div>
            <p className="eyebrow mb-5">02 / Services</p>
            <h2 className="service-title font-manrope font-extrabold text-[clamp(4.8rem,11vw,10rem)] leading-[.78] tracking-[-.075em]">
              WHAT <span className="about-serif text-accent">i</span> DO
            </h2>
            <span className="mt-8 block h-[3px] w-20 bg-accent" />
          </div>
          <div className="grid gap-4 md:grid-cols-[.5fr_1fr] md:gap-8">
            <span className="font-mono text-xs uppercase tracking-[.3em] text-white/35">( Services )</span>
            <p className="max-w-xl text-base leading-8 text-white/75 md:text-lg">
              I build full-stack web applications and AI-powered products that are fast, reliable, and easy to use—from the first interface to the systems that keep it running.
            </p>
          </div>
        </div>

        <div className="service-stack border-t border-white/15">
          {services.map((service, index) => (
            <article
              key={service.number}
              data-stack-index={index}
              className="service-row grid gap-8 border-b border-white/15 py-9 md:grid-cols-[.85fr_1fr] md:gap-16 md:py-12"
              style={stackCardStyle(index)}
            >
              <div className="service-content flex items-start gap-5 md:gap-8">
                <span className="mt-2 font-mono text-sm text-accent">{service.number}</span>
                <h3 className="max-w-lg font-manrope text-3xl font-bold leading-[.95] tracking-[-.045em] text-white md:text-5xl">{service.title}</h3>
              </div>
              <div className="service-content md:pl-2">
                <p className="max-w-2xl text-sm leading-7 text-white/65 md:text-base md:leading-8">{service.description}</p>
                <ul className="mt-6">
                  {service.tools.map((tool, index) => (
                    <li key={tool} className="flex items-center gap-4 border-b border-white/10 py-3 text-sm font-semibold text-white/80 last:border-0">
                      <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>{tool}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
