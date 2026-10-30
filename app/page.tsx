import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import { Metadata } from 'next';
import { portfolioData } from '@/data/portfolio';

export const metadata: Metadata = {
  title: portfolioData.meta.title,
  description: portfolioData.meta.description,
  alternates: {
    canonical: 'https://shirazabubakar.xyz',
  },
};

export default function Home() {
  return (
    <main id="main-content" className="relative">
      <Navbar />
      <div className="hero-about-stack">
        <div className="hero-stack-stage">
          <Hero />
        </div>
        <About />
      </div>
      <Skills />
      <TechStack />
      <Projects />
      <Contact />
    </main>
  );
}
