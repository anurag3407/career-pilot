import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import "./styles.css";
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function GlitchRevealPortfolio() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-cyan-500 selection:text-zinc-950 font-sans overflow-x-hidden relative">

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <footer className="text-center py-8 border-t border-zinc-900 relative z-40 bg-zinc-950">
        <p className="text-zinc-600 font-mono text-sm hover:text-cyan-500 transition-colors cursor-crosshair">System.Exit(0) // Built by <span className="vibrate-hover inline-block">{data.personal.name}</span></p>
      </footer>
    </div>
  );
}