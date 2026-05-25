"use client";
import React, { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Code, Globe } from "lucide-react";

import SectionTitle from "./SectionTitle";

const Projects = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: container },
  );

  return (
    <section
      id="projects"
      ref={container}
      className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <SectionTitle title="Selected Works" />
          <div className="h-2 w-32 bg-[#FF6B00]" />
        </div>
        <p className="max-w-md text-white/50 text-lg">
          A collection of intelligent systems and high-performance web
          experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {portfolioData.projects.map((project, index) => (
          <div
            key={index}
            className="project-card group relative overflow-hidden bg-white/5 border border-white/10 hover:border-[#FF6B00] transition-[border-color,background-color] duration-500"
          >
            <div className="aspect-video w-full bg-[#111] overflow-hidden relative">
              <img
                src={project.bannerImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] uppercase tracking-widest text-[#FF6B00] font-bold"
                  >
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
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    className="text-white hover:text-[#FF6B00] transition-colors"
                  >
                    <Code size={24} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    className="text-white hover:text-[#FF6B00] transition-colors"
                  >
                    <Globe size={24} />
                  </a>
                )}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00] blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <a
          href={portfolioData.personal.social.find(s => s.platform === 'GitHub')?.url}
          target="_blank"
          className="px-8 py-3 border border-white/20 text-white font-bebas text-xl hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300"
        >
          See More Projects
        </a>
      </div>
    </section>
  );
};

export default Projects;
