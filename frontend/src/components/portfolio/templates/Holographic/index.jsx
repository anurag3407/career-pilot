import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import ResumeCTA from './ResumeCTA';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function HolographicTemplate() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-400/30 selection:text-cyan-100 overflow-x-hidden font-sans">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects projects={data?.projects} title="Projects" subtitle="Engineered at the intersection of imagination and reality" />
      <ResumeCTA data={{
        eyebrow: "Download Resume",
        heading: ["Ready to make", "an impression?"],
        body: "Every opportunity starts with a single document. My resume captures the full spectrum of my work — engineered to stand out in any dimension.",
        stats: [
          { value: data?.experience?.length || "5+", label: "Roles" },
          { value: data?.projects?.length || "40+", label: "Projects shipped" },
          { value: data?.skills?.length || "12", label: "Core Skills" }
        ],
        resumeUrl: "#",
        previewUrl: "#"
      }} />
      <Testimonials />
      <Contact />
    </div>
  );
}