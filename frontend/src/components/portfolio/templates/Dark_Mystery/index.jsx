import React from 'react';
import Hero from './Hero';
import About from './About';
import ClueBoard from './ClueBoard';
import Projects from './Projects';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';

export default function DarkMystery() {
  return (
    <div className="min-h-screen bg-[#030406] text-stone-100">
      <Hero />
      <About />
      <ClueBoard />
      <Projects />
      <ResumeCTA />
      <Contact />
    </div>
  );
}
