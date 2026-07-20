'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';

const Education = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.education-card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <section id="education" ref={container} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col mb-16">
        <h2 className="text-6xl md:text-8xl font-bebas mb-4">Academic Foundation</h2>
        <div className="h-2 w-32 bg-[#FF6B00]" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolioData.credentials.education.map((edu, index) => (
          <div key={index} className="education-card p-10 bg-white/5 border-l-4 border-[#FF6B00] hover:bg-white/10 transition-[background-color] group">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[#FF6B00] font-bebas text-2xl">{edu.year}</p>
              {edu.logo && (
                <Image
                  src={edu.logo}
                  alt={`${edu.institution} logo`}
                  width={40}
                  height={40}
                  className="object-contain opacity-70"
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes="40px"
                />
              )}
            </div>
            <h2 className="text-3xl font-bebas mb-2 group-hover:tracking-wider transition-all duration-300">
              {edu.degree}
            </h2>
            <p className="text-xl text-white/50">{edu.institution}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
