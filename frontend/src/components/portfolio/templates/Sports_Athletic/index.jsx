import React from 'react';
import Hero from './Hero';
import About from './About';
import TrophyCabinet from './TrophyCabinet';
import Projects from './Projects';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';

export default function SportsAthleticTemplate({ portfolioData }) {
  return (
    <div className="bg-[#070707] min-h-screen text-slate-100 selection:bg-rose-600/30 selection:text-rose-100">
      <Hero />
      <About />
      <TrophyCabinet />
      <Projects />
      <ResumeCTA />
      <Contact />
    </div>
  );
}
