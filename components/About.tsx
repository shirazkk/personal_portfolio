"use client";
import React, { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import SectionTitle from "./SectionTitle";

const About = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".about-content-inner > *", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power4.out",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="about"
      ref={container}
      className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <SectionTitle title="About Me" className="mb-20" />

      <div className="about-content grid md:grid-cols-2 gap-12 md:gap-24 items-start about-content-inner">
        <div className="relative">
          <div className="absolute -left-4 -top-8 h-24 w-24 border-l-2 border-t-2 border-[#FF6B00]/60" />
          <h2 className="text-4xl md:text-6xl font-bebas leading-tight relative z-10 max-w-xl">
            Building intelligent futures, one agent at a time.
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {portfolioData.about.interests.slice(0, 4).map((interest) => (
              <span
                key={interest}
                className="border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/55"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-[#FF6B00] font-medium tracking-widest uppercase">
            The Perspective
          </p>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            {portfolioData.about.bio}
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {portfolioData.stats.map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-4xl font-bebas text-[#FF6B00]">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
