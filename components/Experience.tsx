'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SectionTitle from './SectionTitle';

const Experience = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline line animation
    gsap.from('.timeline-line', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: true,
      },
      scaleY: 0,
      transformOrigin: 'top center',
    });

    // Content items animation
    gsap.from('.experience-item', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 70%',
      },
      x: (i) => i % 2 === 0 ? -100 : 100,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'power4.out',
    });
  }, { scope: container });

  return (
    <section id="experience" ref={container} className="py-24 md:py-40 px-6 md:px-12 bg-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-20 text-center items-center">
          <SectionTitle title="The Journey" />
          <div className="h-2 w-32 bg-[#FF6B00]" />
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/20 z-0 hidden md:block" />
          
          <div className="flex flex-col gap-16 md:gap-32">
            {portfolioData.experience.map((exp, index) => (
              <div 
                key={index} 
                className={`experience-item flex flex-col md:flex-row items-center gap-8 md:gap-24 relative z-10 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <p className="text-[#FF6B00] font-bebas text-2xl mb-2">{exp.period}</p>
                  <h3 className="text-4xl md:text-5xl font-bebas mb-2">{exp.title}</h3>
                  <h4 className="text-xl text-white/50 font-medium mb-4">{exp.company}</h4>
                </div>
                
                {/* Timeline Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FF6B00] rounded-full hidden md:block border-4 border-[#0a0a0a]" />
                
                <div className="w-full md:w-1/2">
                  <ul className="flex flex-col gap-4 text-white/70">
                    {exp.achievements.map((point, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="w-1.5 h-1.5 bg-[#FF6B00] mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
