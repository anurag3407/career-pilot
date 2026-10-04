import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function JapaneseZen() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-stone-100 text-stone-800 overflow-x-hidden">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}
