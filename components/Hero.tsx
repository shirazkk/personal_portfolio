'use client'
import React, { useRef } from 'react';
import HeroCanvas from './HeroCanvas';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ArrowDown, ArrowRight, Download } from 'lucide-react';

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lenis = useLenis();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    
    // Split text animation would be better with SplitText but we can do it manually or just animate the whole thing
    tl.from('.hero-reveal', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
    });

    // Parallax effect for 3D canvas
    gsap.to('.hero-canvas-wrapper', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 200,
      ease: 'none',
    });
  }, { scope: container });

  const scrollToContact = () => {
    lenis?.scrollTo('#contact', { offset: -80 });
  };

  const scrollToProjects = () => {
    lenis?.scrollTo('#projects', { offset: -80 });
  };

  return (
    <section ref={container} className="relative min-h-dvh w-full flex items-center px-6 md:px-12 overflow-hidden pt-28 pb-20">
      <div className="hero-canvas-wrapper absolute inset-0 -z-10">
        <HeroCanvas />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_34%,rgba(255,107,0,0.2),transparent_32%),linear-gradient(90deg,#0a0a0a_0%,rgba(10,10,10,0.84)_42%,rgba(10,10,10,0.4)_100%)]" />
      
      <div className="z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-end">
        <div>
          <h2 className="hero-reveal text-[#FF6B00] text-sm md:text-base font-bold tracking-[0.35em] uppercase mb-5">
          {portfolioData.personal.title}
        </h2>
        
          <h1 ref={headlineRef} className="hero-reveal text-[18vw] sm:text-[14vw] lg:text-[9.8vw] xl:text-[8.8rem] font-bebas leading-[0.78] mb-8 uppercase max-w-5xl">
          {portfolioData.personal.name}
        </h1>
        
          <p className="hero-reveal text-xl md:text-2xl max-w-2xl mb-8 text-white/70 leading-relaxed">
            {portfolioData.personal.heroStatement}
          </p>

          <div className="hero-reveal flex flex-col sm:flex-row gap-3 mb-10">
            <button
              type="button"
              onClick={scrollToContact}
              className="cursor-pointer inline-flex min-h-12 items-center justify-center gap-3 bg-[#FF6B00] px-7 py-3 font-bebas text-2xl text-white transition hover:bg-white hover:text-[#0a0a0a] active:scale-[0.98]"
            >
              Start a Project
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollToProjects}
              className="cursor-pointer inline-flex min-h-12 items-center justify-center gap-3 border border-white/15 px-7 py-3 font-bebas text-2xl text-white transition hover:border-[#FF6B00] hover:text-[#FF6B00] active:scale-[0.98]"
            >
              View Work
              <ArrowDown size={20} aria-hidden="true" />
            </button>
            <a
              href="/shiraz_cv.docx"
              className="cursor-pointer  inline-flex min-h-12 items-center justify-center gap-3 border border-white/15 px-7 py-3 font-bebas text-2xl text-white/75 transition hover:border-white hover:text-white"
            >
              Resume
              <Download size={20} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-reveal grid grid-cols-3 max-w-2xl border-y border-white/10">
            {portfolioData.stats.map((stat) => (
              <div key={stat.label} className="py-5 pr-4">
                <p className="font-bebas text-4xl text-[#FF6B00]">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-reveal hidden lg:block justify-self-end max-w-sm border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#FF6B00]">
            Available for
          </p>
          <div className="flex flex-wrap gap-2">
            {portfolioData.personal.badges.map((badge) => (
              <span key={badge} className="border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/65">
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-6 text-white/50 leading-relaxed">
            Based in {portfolioData.personal.location}. Building production
            web apps, AI agents, and polished product interfaces.
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 motion-safe:animate-bounce">
        <ArrowDown size={24} aria-hidden="true" />
      </div>
    </section>
  );
};

export default Hero;
