import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen text-white bg-[#050816] overflow-hidden relative">
      <Hero data={data} />
      <About data={data} />
      <Skills skills={data.skills} />
      <Experience experience={data.experience} />
      <Projects projects={data.projects} />
      <Testimonials testimonials={data.testimonials} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}