"use client";
import React, { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { MoveRight } from "lucide-react";

import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate each card individually as it enters the viewport
      // This prevents cards being invisible if user lands directly on section
      const cards = document.querySelectorAll(".project-card");

      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 95%", // fire as soon as card top is 95% down the viewport
            toggleActions: "play none none none",
            once: true,
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.05, // subtle stagger via delay
          ease: "power3.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      id="projects"
      ref={container}
      className="py-32 md:py-48 px-6 md:px-12 max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
        <div className="relative">
          <SectionTitle title="Selected Works" />
          <div className="absolute -bottom-3 left-0 h-[2px] w-24 bg-gradient-to-r from-[#FF6B00] to-transparent" />
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <p className="text-white/40 text-base leading-relaxed">
            From autonomous AI agents to cinematic frontends, these projects
            represent my obsession with performance, intelligence, and high-end design.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-white/15" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>

      {/* Simple uniform grid — 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portfolioData.projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            index={index}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-24 flex flex-col items-center gap-5">
        <p className="text-white/20 text-sm font-light italic">
          More systems being built in the dark...
        </p>

        <a
          href={
            portfolioData.personal.social.find((s) => s.platform === "GitHub")?.url
          }
          target="_blank"
          rel="noreferrer"
          className="group relative flex items-center gap-3 px-10 py-4 bg-white text-black font-bebas text-xl overflow-hidden rounded-full hover:bg-[#FF6B00] hover:text-white transition-colors duration-500"
        >
          <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
          <span className="relative z-10 flex items-center gap-3">
            Explore All Repositories
            <MoveRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </a>
      </div>
    </section>
  );
};

export default Projects;