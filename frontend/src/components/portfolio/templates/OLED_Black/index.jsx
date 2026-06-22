import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function OLED_Black_Portfolio() {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div className="min-h-screen bg-black text-gray-200 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000000; }
        ::-webkit-scrollbar-thumb { background: #1f2937; }
        ::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
      `}} />

      <main className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <Hero personal={personal} stats={stats} socials={socials} />
        <About personal={personal} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Testimonials testimonials={testimonials} />
        <Contact socials={socials} />
      </main>

      <footer className="border-t border-gray-900 py-8 text-center bg-black relative z-10">
        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} {personal.name}. System Built.
        </p>
      </footer>
    </div>
  );
}