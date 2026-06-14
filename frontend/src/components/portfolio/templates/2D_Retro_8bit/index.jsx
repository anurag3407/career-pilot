import React from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

import { usePortfolio } from "../../../../context/PortfolioContext";

export default function Retro8BitTemplate() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="bg-[#0c051a] min-h-screen text-white font-retro-body selection:bg-[#00f0ff] selection:text-black">
      <Hero data={data} />
      <About data={data} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Testimonials testimonials={data.testimonials} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}
