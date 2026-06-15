import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

export default function CartographerAntiquityMapRoom() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="w-full min-h-screen bg-[#f4ebd8] text-[#3e2723] font-serif overflow-x-hidden relative selection:bg-[#8d6e63] selection:text-[#f4ebd8]">
      {/* Background texture layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/aged-paper.png')`
        }}
      ></div>

      <main className="flex flex-col w-full relative z-10 max-w-7xl mx-auto border-x-4 border-double border-[#5d4037]">
        <Hero data={data} />
        <About data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Skills data={data} />
        <Contact data={data} />
      </main>
    </div>
  );
}
