'use client'
import React, { useEffect, useRef } from 'react';
import HeroCanvas from './HeroCanvas';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

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

  return (
    <section ref={container} className="relative h-screen w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
      <div className="hero-canvas-wrapper absolute inset-0 -z-10">
        <HeroCanvas />
      </div>
      
      <div className="z-10 w-full flex flex-col items-center mt-12">
        <h2 className="hero-reveal text-[#FF6B00] text-xl md:text-2xl font-medium tracking-widest uppercase mb-4 px-4">
          {portfolioData.personal.title}
        </h2>
        
        <h1 ref={headlineRef} className="hero-reveal text-[15vw] md:text-[12vw] font-bebas leading-[0.8] mb-8 uppercase whitespace-nowrap w-full">
          {portfolioData.personal.name}
        </h1>
        
        <div className="max-w-2xl px-4">
          <p className="hero-reveal text-lg md:text-xl mx-auto mb-10 text-white/70">
            {portfolioData.personal.location}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
