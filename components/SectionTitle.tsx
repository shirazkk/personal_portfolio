'use client'
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = "" }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const letters = containerRef.current?.querySelectorAll('.letter');
    if (!letters) return;

    gsap.from(letters, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      skewY: 6,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <h2 
      ref={containerRef} 
      className={`text-6xl md:text-8xl font-bebas mb-4 flex flex-wrap ${className}`}
    >
      {title.split('').map((char, index) => (
        <span 
          key={index} 
          className="letter inline-block overflow-hidden"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </h2>
  );
};

export default SectionTitle;
