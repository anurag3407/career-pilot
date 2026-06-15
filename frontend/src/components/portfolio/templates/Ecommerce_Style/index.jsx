import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// Existing components
import Hero from './Hero';
import About from './About';
import Projects from './Projects';

// New components
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();

  if (!data) return null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
      <Hero data={data} />
      <About data={data} />
      <Projects projects={data.projects} />
      
      {/* Newly added sections */}
      <Skills data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}