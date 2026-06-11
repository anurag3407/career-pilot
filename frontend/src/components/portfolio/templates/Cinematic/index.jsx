import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Skills from './Skills';
import Projects from './Projects';
import Testimonials from './Testimonials';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';
import MovieCredits from './MovieCredits';

/**
 * Cinematic Portfolio Template
 * Category: Creative / Portfolio
 * Description: High-end film industry aesthetic with dark backgrounds, dramatic typography, cinematic transitions, and a director's cut feel.
 */
export default function CinematicTemplate() {
  const { portfolioData: data } = usePortfolio();

  if (!data) return null;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-neutral-800 w-full overflow-x-hidden">
      <Hero data={data} />
      <About data={data} />
      <Experience data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Testimonials data={data} />
      <ResumeCTA data={data} />
      <Contact data={data} />
      <MovieCredits data={data} />
    </div>
  );
}
