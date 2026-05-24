'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SectionTitle from './SectionTitle';

const Skills = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.skill-category', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <section id="skills" ref={container} className="py-24 px-6 md:px-12 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16">
          <SectionTitle title="Tech Arsenal" />
          <div className="h-2 w-32 bg-[#FF6B00]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData.credentials.skills.map((skill, index) => (
            <div key={index} className="skill-category p-8 border border-white/10 hover:border-[#FF6B00]/50 transition-[border-color] duration-300 group">
              <h3 className="text-[#FF6B00] text-2xl font-bebas mb-6 tracking-wide group-hover:translate-x-2 transition-transform">
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 text-sm font-medium border border-white/5 hover:bg-[#FF6B00] hover:text-white transition-[background-color,color] cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
