'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Copy, Send } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion, revealOnce } from '@/lib/animations';
import { portfolioData } from '@/data/portfolio';

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#skills' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('Click to copy email address');
  const [localTime, setLocalTime] = useState('');

  useGSAP(() => {
    const scope = sectionRef.current;
    if (!scope || prefersReducedMotion()) return;
    scope.querySelectorAll<HTMLElement>('.contact-reveal').forEach((element) => {
      revealOnce({ targets: element, trigger: element, y: 28 });
    });
  }, { scope: sectionRef });

  const mailtoHref = useMemo(() => {
    const subject = `Portfolio inquiry from ${form.name}`;
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, '', form.message].join('\n');
    return `mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  useEffect(() => {
    const update = () => setLocalTime(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi', hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date()) + ' PKT');
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('Your email draft is ready.');
    window.location.href = mailtoHref;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.personal.email);
      setCopyFeedback('Copied to clipboard');
    } catch {
      setCopyFeedback(portfolioData.personal.email);
    }
    window.setTimeout(() => setCopyFeedback('Click to copy email address'), 2200);
  };

  return (
    <>
      <section id="contact" ref={sectionRef} className="contact-section relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-0 size-[38rem] rounded-full bg-[#1e6b4d]/10 blur-[130px]" />
        <div className="relative mx-auto max-w-[1152px]">
          <header className="contact-reveal mb-12 max-w-4xl md:mb-16">
            <p className="eyebrow mb-5">05 / Get in touch</p>
            <h2 className="font-manrope font-extrabold text-[clamp(4.5rem,10vw,8rem)] leading-[.82] tracking-[-.075em] text-[#edf0eb]">LET&apos;S <span className="about-serif font-normal text-accent">talk</span></h2>
            <span className="mt-7 block h-[3px] w-20 bg-accent" />
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 md:text-lg">Have a project in mind or just want to say hello? Tell me a little about it and I&apos;ll get back to you.</p>
          </header>

          <form onSubmit={handleSubmit} className="contact-reveal contact-form rounded-[1.5rem] border border-white/10 bg-white/[.025] p-5 sm:p-7 md:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <label className="contact-field">Your Name *
                <input required autoComplete="name" name="name" placeholder="Your Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="contact-field">Your Email *
                <input required type="email" autoComplete="email" name="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </label>
            </div>
            <label className="contact-field mt-7">Message *
              <textarea required minLength={30} maxLength={1200} rows={5} name="message" placeholder="Write your message here..." value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
            </label>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[10px] text-white/35">{form.message.length} / 30 minimum characters</p>
              <button type="submit" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#34d399] px-7 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0a0f0d] transition duration-200 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:scale-[.98] focus-visible:outline-offset-4"><Send size={15} aria-hidden="true" />Send message</button>
            </div>
            <p className="sr-only" role="status" aria-live="polite">{feedback}</p>
          </form>

          <div className="contact-reveal direct-contact mt-12 flex flex-col items-center justify-center rounded-[1.5rem] border border-white/[.08] px-5 py-12 text-center sm:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/35">Direct contact</p>
            <button type="button" onClick={copyEmail} className="mt-4 flex items-center gap-3 text-center font-manrope text-[clamp(1.25rem,4.4vw,3rem)] font-bold uppercase tracking-[-.055em] text-white/85 transition-colors duration-200 hover:text-[#7fe4b2] active:opacity-70">
              <span>{portfolioData.personal.email}</span><Copy size={16} className="shrink-0 text-accent" aria-hidden="true" />
            </button>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[.14em] text-white/30" aria-live="polite">{copyFeedback}</p>
          </div>
        </div>
      </section>

      <footer className="portfolio-footer border-t border-white/10 px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-10 sm:grid-cols-2 md:grid-cols-3">
          <nav aria-label="Footer navigation">
            <h2 className="font-manrope text-base font-bold text-white/85">Menu</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => <li key={item.href}><a href={item.href} className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/45 transition-colors hover:text-accent">{item.label}</a></li>)}
            </ul>
          </nav>
          <nav aria-label="Social links">
            <h2 className="font-manrope text-base font-bold text-white/85">Socials</h2>
            <ul className="mt-5 space-y-3">
              {portfolioData.personal.social.map((item) => <li key={item.platform}><a href={item.url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/45 transition-colors hover:text-accent">{item.platform}</a></li>)}
              <li><a href="https://github.com/shirazkk" target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/45 transition-colors hover:text-accent">Source code</a></li>
            </ul>
          </nav>
          <div>
            <h2 className="font-manrope text-base font-bold text-white/85">Local time</h2>
            <p className="mt-5 text-sm text-white/55">{localTime || 'Loading local time...'}</p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-white/30">Karachi, Pakistan</p>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1280px] items-center justify-between border-t border-white/[.08] pt-5">
          <span className="font-mono text-[9px] uppercase tracking-[.13em] text-white/30">© {new Date().getFullYear()} Shiraz Abubakar</span>
          <a href="#home" aria-label="Scroll to top" className="grid size-11 place-items-center rounded-full border border-white/10 text-white/55 transition duration-200 hover:border-accent/40 hover:text-accent active:scale-95"><ArrowUp size={17} aria-hidden="true" /><span className="sr-only">Scroll to top</span></a>
        </div>
      </footer>
    </>
  );
}
