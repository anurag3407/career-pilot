import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import TrophyCabinet from './TrophyCabinet';
import ResumeCTA from './ResumeCTA';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen text-foreground bg-background overflow-hidden relative" style={{ background: '#0a0a0a' }}>
      <Hero data={data} />
      <About data={data} />
      <Skills skills={data.skills} />
      <Experience experience={data.experience} />
      <Projects projects={data.projects} />
      <TrophyCabinet />
      <Testimonials testimonials={data.testimonials} />
      <ResumeCTA resume={data.resume} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}