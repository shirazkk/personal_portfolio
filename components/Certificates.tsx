'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';

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
                  <Image 
  src={cert.logo} 
  alt={cert.issuer} 
  width={32} 
  height={32} 
  className="object-contain" 
  priority={index < 3} // Eager load the first few
  sizes="(max-width: 768px) 32px, 32px"
/>
                </div>
                <h3 className="text-2xl font-bebas mb-2 leading-tight">{cert.name}</h3>
                <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">{cert.issuer}</p>
              </div>
              <p className="mt-8 text-right font-bebas text-xl text-[#FF6B00] opacity-50">{cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
