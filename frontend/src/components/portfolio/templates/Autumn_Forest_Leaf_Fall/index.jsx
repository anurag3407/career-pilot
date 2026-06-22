import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import LeafAnimation from './LeafAnimation';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

export default function AutumnForestLeafFall() {
  const { portfolioData: data } = usePortfolio();

  if (!data) return null;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-300 font-serif selection:bg-orange-900 selection:text-orange-100 relative overflow-hidden">
      <LeafAnimation />
      
      {/* Background gradient overlay for deeper atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-orange-900/10 via-stone-900/40 to-amber-900/20 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-32">
        <Hero data={data} />
        <About data={data} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects projects={data.projects} />
        <Contact personal={data.personal} socials={data.socials} />
      </div>
    </div>
  );
}
