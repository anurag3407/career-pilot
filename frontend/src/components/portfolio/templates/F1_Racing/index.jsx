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
    <div className="min-h-screen text-white bg-[#070709] overflow-hidden relative selection:bg-[#E10600] selection:text-white">
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Experience data={data} />
      <Projects data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}