import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { useScroll } from 'framer-motion';

import RocketBackground from './RocketBackground';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';

export default function RocketLaunchPortfolio() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();

  return (
    <div className="relative w-full bg-black text-slate-100 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* FIXED BACKGROUND ROCKET AND STARS */}
      <RocketBackground scrollYProgress={scrollYProgress} />

      {/* FOREGROUND PORTFOLIO CONTENT */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-28 pb-32">
        <Hero personal={data?.personal} socials={data?.socials} />
        <About personal={data?.personal} />
        <Skills skills={data?.skills} />
        <Projects projects={data?.projects} />
        <Experience experience={data?.experience} />
        <Contact personal={data?.personal} socials={data?.socials} />
      </div>
      
    </div>
  );
}