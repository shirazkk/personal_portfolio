"use client";

import { FormEvent, useMemo, useState } from "react";
import { ExternalLink, Mail, Send } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const mailtoHref = useMemo(() => {
    const subject = form.subject || "Portfolio inquiry";
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      "",
      form.message,
    ].join("\n");

    return `mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = mailtoHref;
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 md:py-40 px-6 md:px-12 bg-white/[0.04]"
    >
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FF6B00]/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
        <div>
          <p className="text-[#FF6B00] uppercase tracking-[0.35em] text-xs font-bold mb-4">
            Start a build
          </p>
          <SectionTitle title="Contact" />
          <div className="h-2 w-24 bg-[#FF6B00] mb-8" />
          <p className="text-xl md:text-2xl text-white/65 leading-relaxed max-w-xl">
            Have an AI product, agent workflow, or cinematic web experience in
            mind? Send the basics and I will reply with the next practical step.
          </p>

          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#FF6B00] px-6 py-3 font-bebas text-2xl text-white transition hover:bg-white hover:text-[#0a0a0a]"
          >
            <Mail size={22} aria-hidden="true" />
            {portfolioData.personal.email}
          </a>

          <div className="mt-10 flex flex-wrap gap-3">
            {portfolioData.personal.social
              .filter((social) => social.url !== "#")
              .map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] text-white/65 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                >
                  {social.platform}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-[#0d0d0d]/80 p-5 md:p-8 shadow-2xl shadow-black/30"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
              Name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-base normal-case tracking-normal text-white outline-none transition focus:border-[#FF6B00]"
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-base normal-case tracking-normal text-white outline-none transition focus:border-[#FF6B00]"
                autoComplete="email"
              />
            </label>
          </div>

          <label className="mt-5 flex flex-col gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
            Subject
            <input
              required
              value={form.subject}
              onChange={(event) =>
                setForm((current) => ({ ...current, subject: event.target.value }))
              }
              className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-base normal-case tracking-normal text-white outline-none transition focus:border-[#FF6B00]"
            />
          </label>

          <label className="mt-5 flex flex-col gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
            Message
            <textarea
              required
              rows={7}
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
              className="resize-none border border-white/10 bg-white/[0.04] px-4 py-3 text-base normal-case tracking-normal text-white outline-none transition focus:border-[#FF6B00]"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#FF6B00] px-6 py-3 font-bebas text-2xl text-white transition hover:bg-white hover:text-[#0a0a0a] active:scale-[0.99]"
          >
            <Send size={20} aria-hidden="true" />
            Open Email Draft
          </button>
        </form>
      </div>

      <footer className="relative mt-20 text-center text-white/25 text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Shiraz Ali. Engineered with Next.js,
        Three.js, and GSAP.
      </footer>
    </section>
  );
}
