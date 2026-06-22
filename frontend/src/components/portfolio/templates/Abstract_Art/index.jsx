import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// Import existing (or placeholder) components
import Hero from './Hero';
import About from './About';
import Projects from './Projects';

// Import newly created components
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function AbstractArtPortfolio() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden">
      {/* 
        The Abstract Art theme features a smooth, continuous flow of sections.
        We render the existing standard components first, followed by our new abstract designs.
      */}
      <main className="flex flex-col w-full relative">
        <Hero data={data} />
        <About data={data} />
        <Projects data={data} />
        
        {/* Render new sections smoothly integrated below existing ones */}
        <Experience data={data} />
        <Skills data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </main>
    </div>
  );
}
