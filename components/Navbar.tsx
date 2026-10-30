'use client';

import { type MouseEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { portfolioData } from '@/data/portfolio';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#skills' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const sectionIds = ['home', ...navLinks.map(({ href }) => href.slice(1))];

type Bounds = { id: string; top: number; bottom: number };

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lenis = useLenis();
  const boundsRef = useRef<Bounds[]>([]);

  useEffect(() => {
    let frame = 0;

    // Measure section offsets only on mount/resize/content change, never per frame.
    const measure = () => {
      const scroll = window.scrollY;
      boundsRef.current = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { id, top: rect.top + scroll, bottom: rect.bottom + scroll };
        })
        .filter((item): item is Bounds => item !== null);
    };

    const update = () => {
      frame = 0;
      const scroll = window.scrollY;
      const line = scroll + 140; // reading line for the active section
      const navLine = scroll + 48; // what sits behind the navbar itself
      const current = boundsRef.current.find(({ top, bottom }) => line >= top && line <= bottom);

      const about = boundsRef.current.find(({ id }) => id === 'about');
      const projects = boundsRef.current.find(({ id }) => id === 'projects');

      const nextScrolled = scroll > 24 || Boolean(current);
      const nextActive = current?.id ?? 'home';
      // Hero + Selected Works are light surfaces; everything else is dark.
      const nextLight = Boolean(about && navLine < about.top) ||
        Boolean(projects && navLine >= projects.top && navLine <= projects.bottom);

      setIsScrolled((value) => (value === nextScrolled ? value : nextScrolled));
      setActiveSection((value) => (value === nextActive ? value : nextActive));
      setIsLightSection((value) => (value === nextLight ? value : nextLight));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize);
    lenis?.on('scroll', requestUpdate);

    // Re-measure when the document grows (filters, fonts, images).
    const resizeObserver = new ResizeObserver(() => {
      measure();
      requestUpdate();
    });
    resizeObserver.observe(document.body);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      lenis?.off('scroll', requestUpdate);
      resizeObserver.disconnect();
    };
  }, [lenis]);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      lenis?.start();
    };
  }, [isOpen, lenis]);

  // The menu is mobile-only; close it if the viewport grows past the breakpoint.
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [isOpen]);

  const handleScrollTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    lenis?.scrollTo(href, { offset: -72, duration: 1.15 });
    setIsScrolled(href !== '#home');
    setIsLightSection(href === '#projects');
    setActiveSection(href.slice(1));
    setIsOpen(false);
  };

  const tone = isLightSection
    ? {
        logo: 'text-[#27352d] hover:text-[#27875f]',
        link: 'text-[#536057] hover:text-[#172019]',
        linkActive: 'text-[#27875f]',
        underline: 'bg-[#27875f]',
        cta: 'bg-[#151a17] text-white hover:bg-[#27875f]',
        burger: 'border-[#151a17]/20 bg-[#f1f2ed]/80 text-[#151a17] hover:border-[#151a17]/40',
      }
    : {
        logo: 'text-white hover:text-[#7ee0b5]',
        link: 'text-white/55 hover:text-white',
        linkActive: 'text-[#7ee0b5]',
        underline: 'bg-[#7ee0b5]',
        cta: 'bg-[#34a978] text-[#08150f] hover:bg-[#5fd3a4]',
        burger: 'border-white/20 bg-white/[.04] text-white hover:border-white/40',
      };

  return (
    <nav aria-label="Main navigation" className="fixed left-0 top-0 z-50 w-full px-6 py-5 sm:px-9 md:px-12 lg:px-16">
      {/* Blurred bar surface fades in with scroll — opacity only, no layout shift. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 border-b transition-[opacity,background-color,border-color] duration-300 ease-out ${
          isScrolled
            ? isLightSection
              ? 'border-[#151a17]/10 bg-[#f1f2ed]/80 opacity-100 backdrop-blur-xl'
              : 'border-white/[.06] bg-[#0a0f0d]/70 opacity-100 backdrop-blur-xl'
            : 'border-transparent bg-transparent opacity-0'
        }`}
      />

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/#home"
          onClick={(event) => handleScrollTo(event, '#home')}
          aria-label="Shiraz Abubakar, home"
          className={`group flex items-center gap-2 transition-colors ${tone.logo}`}
        >
          <span className="font-mono text-xs text-[#2a9a6c]">©</span>
          <span className="text-[10px] font-bold uppercase tracking-[.16em] sm:text-[11px]">Shiraz Abubakar</span>
        </Link>

        {/* Desktop navigation — always visible inline, never inside the drawer. */}
        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {navLinks.map(({ label, href }) => {
            const active = activeSection === href.slice(1);
            return (
              <a
                key={label}
                href={href}
                onClick={(event) => handleScrollTo(event, href)}
                aria-current={active ? 'location' : undefined}
                className={`group relative py-2 text-[10px] font-semibold uppercase tracking-[.14em] transition-colors ${active ? tone.linkActive : tone.link}`}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-200 ease-out ${tone.underline} ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3 md:justify-self-end">
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-[9px] font-bold uppercase tracking-[.13em] transition duration-200 active:scale-[.97] md:inline-flex ${tone.cta}`}
          >
            Let&apos;s talk <ArrowUpRight size={13} aria-hidden="true" />
          </a>

          {/* Mobile-only trigger. */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className={`relative z-[60] grid size-10 place-items-center rounded-full border transition duration-200 active:scale-95 md:hidden ${tone.burger}`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="portfolio-menu"
          >
            {isOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="portfolio-menu" className="portfolio-menu fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-[#f1f2ed] px-7 pb-8 pt-28 sm:px-10 md:hidden">
          <div>
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[.2em] text-[#27875f]">Find your way around</p>
            {navLinks.map(({ label, href }, index) => (
              <a key={label} href={href} onClick={(event) => handleScrollTo(event, href)} style={{ animationDelay: `${90 + index * 55}ms` }} className="menu-item flex items-baseline gap-5 border-b border-[#151a17]/10 py-3.5 font-manrope text-5xl font-extrabold tracking-[-.07em] text-[#172019] transition-colors hover:text-[#27875f] sm:text-6xl">
                <span className="font-mono text-[10px] font-normal tracking-normal text-[#27875f]/65">0{index + 1}</span>{label}
              </a>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-[#151a17]/10 pt-6">
            <div>
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[.18em] text-[#78857c]">Elsewhere</p>
              <div className="flex gap-4">
                {portfolioData.personal.social.map(({ platform, url }) => <a key={platform} href={url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#46534a] transition-colors hover:text-[#27875f]">{platform}</a>)}
              </div>
            </div>
            <a href={`mailto:${portfolioData.personal.email}`} className="text-xs font-semibold text-[#172019]">{portfolioData.personal.email}</a>
          </div>
          <span className="pointer-events-none absolute -right-36 top-1/3 size-80 rounded-full border border-[#34a978]/10" />
        </div>
      )}
    </nav>
  );
}
