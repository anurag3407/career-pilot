import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import CoverStory from './CoverStory';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen text-[#1a1a1a] bg-[#f5f0e8] overflow-hidden relative">
      <CoverStory />
      <Experience experience={data.experience} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Testimonials testimonials={data.testimonials} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}