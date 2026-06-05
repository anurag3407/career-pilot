import React from 'react';
import data from '../../../../data/dummy_data.json';
import HeroSection from './Hero';
import AboutSection from './About';
import SkillsSection from './Skills';
import ProjectsSection from './Projects';
import ExperienceSection from './Experience';
import TestimonialsSection from './Testimonials';
import ContactSection from './Contact';
import { LineDivider } from './shared';

export default function LineArtPortfolio() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900 relative">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <main className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 pb-12 bg-[#fafafa]/80 backdrop-blur-sm border-x border-zinc-200/50 min-h-screen">
        <HeroSection />
        <LineDivider />
        <AboutSection />
        <LineDivider />
        <SkillsSection />
        <LineDivider />
        <ProjectsSection />
        <LineDivider />
        <ExperienceSection />
        <LineDivider />
        <TestimonialsSection />
        <ContactSection />

        <footer className="text-center pb-8 pt-12 text-[10px] uppercase font-mono text-zinc-400 tracking-[0.2em]">
          © {new Date().getFullYear()} {data.personal.name} // SYS.ONLINE
        </footer>
      </main>
    </div>
  );
}
