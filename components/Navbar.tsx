'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { portfolioData } from '@/data/portfolio';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

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

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuRef.current && menuItemsRef.current) {
      if (isMobileMenuOpen) {
        // Open animation
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
        
        gsap.fromTo(menuItemsRef.current.children,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
        );
      } else {
        // Close animation
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.2,
          ease: 'power2.in'
        });
      }
    }
  }, [isMobileMenuOpen]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;

    e.preventDefault();
    lenis?.scrollTo(href, { offset: -80 });
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95vw]">
      <div className={`flex items-center justify-between px-6 md:px-10 py-3 rounded-full transition-all duration-500 border shadow-2xl ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-[#FF6B00]/30 py-4'
          : 'bg-transparent border-white/5'
      }`}>
        <Link
          href="/"
          onClick={(e) => { e.preventDefault(); lenis?.scrollTo(0); }}
          className="text-[#FF6B00] font-bebas text-2xl tracking-tighter"
          aria-label="Go to top"
        >
          SA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith('#') && activeSection === link.href.slice(1);
            const LinkComponent = link.href.startsWith('/') ? Link : 'a';
            const linkProps = link.href.startsWith('/')
              ? { href: link.href }
              : { href: link.href, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleScrollTo(e, link.href) };

            return (
              <LinkComponent
                key={link.label}
                {...linkProps}
                className={`text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 relative py-1 ${
                  isActive ? 'text-[#FF6B00]' : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#FF6B00] rounded-full" />
                )}
              </LinkComponent>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleMobileMenuToggle}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <div ref={menuItemsRef} className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = link.href.startsWith('#') && activeSection === link.href.slice(1);
              const LinkComponent = link.href.startsWith('/') ? Link : 'a';
              const linkProps = link.href.startsWith('/')
                ? { href: link.href }
                : { href: link.href, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleScrollTo(e, link.href) };

              return (
                <LinkComponent
                  key={link.label}
                  {...linkProps}
                  className={`text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 py-3 px-4 rounded-lg ${
                    isActive 
                      ? 'text-[#FF6B00] bg-[#FF6B00]/10' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </LinkComponent>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
