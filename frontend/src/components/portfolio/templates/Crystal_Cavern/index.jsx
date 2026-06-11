import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function CrystalCavernPortfolio() {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, skills, projects, experience, testimonials } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-purple-500/30">
      <Hero personal={personal} socials={socials} />
      <div className="max-w-6xl mx-auto px-6 space-y-32 py-20 relative z-10">
        <About personal={personal} />
        {skills && skills.length > 0 && <Skills skills={skills} />}
        {projects && projects.length > 0 && <Projects projects={projects} />}
        {experience && experience.length > 0 && <Experience experience={experience} />}
        {testimonials && testimonials.length > 0 && (
          <Testimonials testimonials={testimonials} />
        )}
        <Contact socials={socials} />
      </div>
    </div>
  );
}