"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Code, ArrowUpRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = ((y - height / 2) / height) * 6;
      const rotateY = ((x - width / 2) / width) * -6;

      gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });

      if (glowRef.current) {
        gsap.to(glowRef.current, { x: x - 150, y: y - 150, duration: 0.3, ease: "power2.out" });
      }
    };

    const onMouseLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, { scope: cardRef });

  const formattedIndex = (index + 1).toString().padStart(2, "0");

  return (
    <div
      ref={cardRef}
      style={{ transformStyle: "preserve-3d" }}
      className={`project-card group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#FF6B00]/40 transition-all duration-500 flex flex-col ${className}`}
    >
      {/* Hover glow */}
      <div
        ref={glowRef}
        className="absolute w-[300px] h-[300px] rounded-full bg-[#FF6B00]/10 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
      />

      {/* Inner border shimmer */}
      <div className="absolute inset-[1px] rounded-2xl border border-white/[0.04] pointer-events-none z-10" />

      <div className="relative z-20 p-7 flex flex-col h-full gap-6">
        {/* Top row: index + category + action buttons */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-bebas text-5xl leading-none text-white/[0.05] group-hover:text-[#FF6B00]/10 transition-colors duration-700 select-none">
              {formattedIndex}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#FF6B00] rounded-full animate-pulse" />
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/35 group-hover:text-[#FF6B00] transition-colors duration-500 font-semibold">
                {project.category}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white transition-all duration-300"
              >
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Code size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 className="font-bebas text-4xl md:text-5xl leading-[0.9] tracking-tight text-white/85 group-hover:text-white group-hover:translate-x-1 transition-all duration-500 mb-4">
            {project.title}
          </h3>

          <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-500 line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech tags + explore link */}
        <div className="border-t border-white/[0.06] pt-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tag, i) => (
              <span
                key={i}
                className="text-[8px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 group-hover:text-white/55 group-hover:border-[#FF6B00]/20 group-hover:bg-[#FF6B00]/[0.05] transition-all duration-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 w-fit">
            <div className="h-px w-8 bg-white/10 group-hover:w-12 group-hover:bg-[#FF6B00] transition-all duration-600" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 group-hover:text-[#FF6B00] transition-colors duration-500">
              Explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;