import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function ArchitectureBlueprintTemplate() {
  return (
    <div className="w-full min-h-screen bg-[#030e1a] text-cyan-50 font-mono overflow-x-hidden selection:bg-cyan-500/30">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Testimonials />
      <Contact />
    </div>
  );
}
