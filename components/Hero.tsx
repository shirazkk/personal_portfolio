'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { portfolioData } from '@/data/portfolio';
import HeroCanvasWrapper from './HeroCanvasWrapper';

const roles = ['FULL-STACK ENGINEER', 'AGENTIC AI BUILDER', 'NEXT.JS DEVELOPER'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const lenis = useLenis();
  const [roleIndex, setRoleIndex] = useState(0);
  const name = useMemo(() => portfolioData.personal.name.split(' '), []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2800);
    return () => window.clearInterval(timer);
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const letters = nameRef.current?.querySelectorAll<HTMLElement>('.hero-letter');
    if (!letters?.length || reduced) return;

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro.fromTo(letters, { yPercent: 115, rotateX: -65, opacity: 0 }, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
    });
    intro.fromTo('.hero-intro', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.35');
    intro.fromTo('.hero-seal', { scale: 0.7, rotate: -18, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.65)' }, '-=0.45');

    const aboutSection = document.querySelector('#about');
    const stackStage = sectionRef.current?.parentElement;
    if (aboutSection && stackStage) {
      ScrollTrigger.create({
        trigger: stackStage,
        start: 'top top',
        endTrigger: aboutSection,
        end: 'bottom top',
        pin: stackStage,
        pinSpacing: false,
        anticipatePin: 1,
      });
      gsap.fromTo(sectionRef.current,
        { y: 0, scale: 1, opacity: 1 },
        {
          y: -18,
          scale: 0.965,
          opacity: 0.48,
          transformOrigin: 'center top',
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.7,
          },
        },
      );
    }

    const onEnter = () => gsap.to(letters, { yPercent: -5, duration: 0.35, stagger: { each: 0.012, from: 'center' }, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' });
    nameRef.current?.addEventListener('mouseenter', onEnter);
    return () => nameRef.current?.removeEventListener('mouseenter', onEnter);
  }, { scope: sectionRef });

  const scrollTo = (target: string) => lenis?.scrollTo(target, { offset: -88 });

  return (
    <section ref={sectionRef} id="home" className="hero-section relative isolate flex min-h-[100svh] items-center overflow-hidden px-6 pb-14 pt-28 text-[#151a17] sm:px-9 md:px-12 md:pt-24 lg:px-16">
      <div className="pointer-events-none absolute inset-0 z-0">
        <HeroCanvasWrapper />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-[#edf0e8] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] text-center">
        <div className="relative mx-auto max-w-[1240px]">
          <h1 ref={nameRef} aria-label={portfolioData.personal.name} className="hero-name select-none font-manrope font-black uppercase leading-[.76] tracking-[-.095em]">
            {name.map((part, partIndex) => (
              <span key={part} aria-hidden="true" className={`hero-name-line block whitespace-nowrap ${partIndex === 1 ? 'hero-surname' : ''}`}>
                {Array.from(part).map((letter, index) => (
                  <span className="hero-letter inline-block" key={`${letter}-${index}`}>{letter}</span>
                ))}
              </span>
            ))}
          </h1>

          <button type="button" onClick={() => scrollTo('#contact')} aria-label="Contact me about a project" className="hero-seal group absolute -right-1 -top-12 hidden size-28 place-items-center rounded-full sm:grid lg:-right-4 lg:top-2 lg:size-36">
            <svg viewBox="0 0 200 200" className="hero-seal-ring absolute inset-0 h-full w-full" aria-hidden="true">
              <defs><path id="hero-seal-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" /></defs>
              <text><textPath href="#hero-seal-circle">AVAILABLE FOR SELECT PROJECTS • LET&apos;S BUILD • </textPath></text>
            </svg>
            <span className="grid size-12 place-items-center rounded-full bg-[#34a978] text-white transition duration-300 group-hover:-rotate-45 group-hover:scale-110 lg:size-14"><ArrowUpRight size={22} aria-hidden="true" /></span>
          </button>
        </div>

        <div className="mx-auto mt-8 max-w-xl px-3 sm:mt-10 md:mt-12">
          <p className="hero-intro text-base leading-7 text-[#4a554f] sm:text-lg md:text-xl">{portfolioData.personal.heroStatement}</p>
          <div className="hero-intro mt-5 h-6 overflow-hidden font-mono text-[10px] font-semibold tracking-[.22em] text-[#27976a] sm:text-xs" aria-label={roles[roleIndex]}>
            <span key={roleIndex} className="hero-role-word inline-block">{roles[roleIndex]}</span>
          </div>
          <div className="hero-intro mt-7 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => scrollTo('#projects')} className="group inline-flex min-h-12 items-center gap-4 rounded-full bg-[#151a17] px-5 text-[10px] font-bold tracking-[.16em] text-white transition duration-200 hover:bg-[#27875f] active:scale-[.97] sm:px-6">
              VIEW SELECTED WORK <ArrowDownRight size={16} className="transition-transform duration-200 group-hover:translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollTo('#contact')} className="inline-flex min-h-12 items-center gap-3 rounded-full border border-[#151a17]/20 px-5 text-[10px] font-bold tracking-[.16em] text-[#151a17] transition duration-200 hover:border-[#27875f] hover:text-[#27875f] active:scale-[.97] sm:px-6">CONTACT</button>
            <a href="/shiraz_cv.docx" download className="inline-flex min-h-12 items-center gap-3 rounded-full px-4 text-[10px] font-bold tracking-[.16em] text-[#59635d] transition duration-200 hover:text-[#151a17] active:scale-[.97]">RESUME <Download size={14} aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-6 z-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.16em] text-[#647169] sm:left-9 md:left-12 lg:left-16">
        <span className="size-1.5 rounded-full bg-[#34a978]" />Based in {portfolioData.personal.location}
      </div>
      <div className="pointer-events-none absolute bottom-7 right-6 z-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.16em] text-[#647169] sm:right-9 md:right-12 lg:right-16">
        Scroll to explore <span className="h-px w-8 bg-[#34a978]/50" />01 / 07
      </div>
    </section>
  );
}
