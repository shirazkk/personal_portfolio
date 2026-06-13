'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { portfolioData } from '@/data/portfolio';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lenis = useLenis();

  const navLinks = portfolioData.navigation.filter((link) => link.label !== 'Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Active section detection
      const sections = ['about', 'skills', 'projects', 'experience', 'blog', 'education', 'credentials', 'contact'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;

    e.preventDefault();
    lenis?.scrollTo(href, { offset: -80 });
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[95vw]">
      <div className={`flex items-center gap-4 md:gap-8 px-6 md:px-10 py-3 rounded-full transition-all duration-500 border shadow-2xl whitespace-nowrap overflow-x-auto no-scrollbar ${
        isScrolled 
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-[#FF6B00]/30 py-4' 
          : 'bg-transparent border-white/5'
      }`}>
        <Link 
          href="/" 
          onClick={(e) => { e.preventDefault(); lenis?.scrollTo(0); }}
          className="text-[#FF6B00] font-bebas text-2xl tracking-tighter mr-2 md:mr-4 shrink-0"
          aria-label="Go to top"
        >
          SA
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith('#') && activeSection === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 relative py-1 shrink-0 ${
                  isActive ? 'text-[#FF6B00]' : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#FF6B00] rounded-full" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
