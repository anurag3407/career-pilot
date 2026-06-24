import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import StockTicker from './StockTicker';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';
import ResumeCTA from './ResumeCTA';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen text-slate-300 bg-gray-950 overflow-hidden relative font-sans">
      <Hero data={data} />
      <StockTicker />
      <About data={data} />
      <Experience experience={data.experience} data={data} />
      <Skills skills={data.skills} data={data} />
      <Projects projects={data.projects} data={data} />
      <ResumeCTA data={data} />
      <Testimonials testimonials={data.testimonials} data={data} />
      <Contact personal={data.personal} socials={data.socials} data={data} />
    </div>
  );
}