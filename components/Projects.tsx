'use client'
import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SectionTitle from './SectionTitle';

const Projects = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
      onComplete: () => ScrollTrigger.refresh()
    });
  }, { scope: container });

  return (
    <section id="projects" ref={container} className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <SectionTitle title="Selected Works" />
          <div className="h-2 w-32 bg-[#FF6B00]" />
        </div>
        <p className="max-w-md text-white/50 text-lg">
          A collection of intelligent systems and high-performance web experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {portfolioData.projects.map((project, index) => (
          <div key={index} className="project-card group relative overflow-hidden bg-white/5 border border-white/10 hover:border-[#FF6B00] transition-[border-color,background-color] duration-500">
            <div className="aspect-video w-full bg-[#111] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="px-6 py-2 bg-[#FF6B00] text-white font-bebas text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  View Case Study
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tag, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-widest text-[#FF6B00] font-bold">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-4xl font-bebas mb-4 group-hover:text-[#FF6B00] transition-colors">
                {project.title}
              </h3>
              <p className="text-white/60 mb-6 line-clamp-2">
                {project.description}
              </p>
              <a href={project.liveUrl || project.githubUrl} target="_blank" className="inline-flex items-center gap-2 text-white font-bebas text-xl group/link">
                Launch Project 
                <svg className="group-hover/link:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00] blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
