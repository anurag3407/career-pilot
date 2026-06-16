import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import InteractiveModel from './InteractiveModel';
import Testimonials from './Testimonials';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';

export default function IsometricTheme() {
  const { portfolioData } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-500 selection:text-white">
      <Hero data={portfolioData} />
      <About data={portfolioData} />
      <Skills data={portfolioData} />
      <Experience data={portfolioData} />
      <Projects data={portfolioData} />
      <InteractiveModel data={portfolioData} />
      <Testimonials data={portfolioData} />
      <ResumeCTA data={portfolioData} />
      <Contact data={portfolioData} />
    </div>
  );
}
