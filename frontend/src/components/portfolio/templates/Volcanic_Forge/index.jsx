import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import GlobalBackground from './GlobalBackground';
import LavaAnimate from './LavaAnimate';

import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';

export default function VolcanicForgeTemplate() {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, skills, projects, experience, stats } = data;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden relative">
      <GlobalBackground />

      <main className="container mx-auto px-6 md:px-12 lg:px-24">
        <LavaAnimate className="!flex w-full" particleCount={90} formedDelay={1800} meltAmount={4}>
          <Hero personal={personal} socials={socials} />
        </LavaAnimate>

        <About personal={personal} stats={stats} skills={skills} />
        
        <Skills skills={skills} />

        <Projects projects={projects} />

        <Experience experience={experience} />

        <Contact email={socials.email} location={personal.location} />
      </main>

      <footer className="py-8 text-center text-stone-600 text-sm border-t border-stone-900 relative z-10 bg-stone-950/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} {personal.name}. Forged with Volcanic Template.</p>
      </footer>
    </div>
  );
}