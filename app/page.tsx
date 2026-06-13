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

export default function Home() {
  return (
    <main className="relative">
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
