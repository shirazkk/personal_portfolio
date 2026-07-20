import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Certificates from '@/components/Certificates';
import BlogPreview from '@/components/BlogPreview';
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
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <BlogPreview />
      <Education />
      <Certificates />
      <Contact />
    </main>
  );
}
