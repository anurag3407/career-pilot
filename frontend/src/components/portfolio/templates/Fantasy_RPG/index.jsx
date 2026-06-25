import React from 'react';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import Projects from './Projects';
import Testimonials from './Testimonials';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';

export default function FantasyRPGTemplate() {
  return (
    <div className="bg-[#0a090e] min-h-screen font-sans text-amber-100 selection:bg-amber-900/50 selection:text-amber-200">
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Testimonials />
      <ResumeCTA />
      <Contact />
    </div>
  );
}