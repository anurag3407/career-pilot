import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono overflow-x-hidden relative selection:bg-[#00ff41] selection:text-black">
      <Hero data={data} />
      <About data={data} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Skills skills={data.skills} />
      <Testimonials testimonials={data.testimonials} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}