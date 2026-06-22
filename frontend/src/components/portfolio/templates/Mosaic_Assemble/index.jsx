import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const MosaicAssemble = () => {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-[#050816] min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Hero data={data.personal} socials={data.socials} />
      <About data={data.personal} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Testimonials testimonials={data.testimonials} />
      <Contact socials={data.socials} />
    </div>
  );
};

export default MosaicAssemble;