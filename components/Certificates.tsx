'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SectionTitle from './SectionTitle';

const Certificates = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.cert-card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    });
  }, { scope: container });

  return (
    <section id="credentials" ref={container} className="py-24 md:py-40 px-6 md:px-12 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16 text-right items-end">
          <SectionTitle title="Credentials" />
          <div className="h-2 w-32 bg-[#FF6B00]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.credentials.certifications.map((cert, index) => (
            <div key={index} className="cert-card p-8 bg-[#111] border border-white/5 hover:border-[#FF6B00]/30 transition-[border-color,background-color] duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-[#FF6B00]/10 flex items-center justify-center mb-6 group-hover:bg-[#FF6B00] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-white text-[#FF6B00]">
                    <path d="M12 15l-2 5L12 18l2 2-2-5z"/>
                    <path d="M12 2l3 9H9l3-9z"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bebas mb-2 leading-tight">{cert.name}</h3>
                <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">{cert.issuer}</p>
              </div>
              <p className="mt-8 text-right font-bebas text-xl text-[#FF6B00] opacity-50">{cert.date}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-32 pt-20 border-t border-white/10 flex flex-col items-center gap-10">
          <h3 className="text-4xl md:text-6xl font-bebas text-center">Ready to build the future?</h3>
          <a 
            href="mailto:shirazkk8@gmail.com" 
            className="px-12 py-5 bg-[#FF6B00] text-white font-bebas text-3xl hover:bg-white hover:text-[#0a0a0a] transition-all transform hover:scale-105 active:scale-95"
          >
            Get In Touch
          </a>
          <div className="flex gap-8 text-white/50 font-medium uppercase tracking-widest text-sm">
            <a href="https://linkedin.com/in/shirazali8" className="hover:text-[#FF6B00] transition-colors">LinkedIn</a>
            <a href="https://github.com/shirazkk" className="hover:text-[#FF6B00] transition-colors">GitHub</a>
            <a href="https://twitter.com/KkShiraz" className="hover:text-[#FF6B00] transition-colors">Twitter</a>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 text-center text-white/20 text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Shiraz Ali. Engineered with Next.js & GSAP.
      </footer>
    </section>
  );
};

export default Certificates;
