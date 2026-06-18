import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const DepthReveal = () => {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans overflow-x-hidden [perspective:1200px]">
      <Hero data={data.personal} socials={data.socials} />

      <ScrollReveal depth="extreme" delay={0.03} sectionIndex={0}>
        <About data={data.personal} stats={data.stats} />
      </ScrollReveal>
      <ScrollReveal depth="heavy" delay={0.06} sectionIndex={1}>
        <Skills skills={data.skills} />
      </ScrollReveal>
      <ScrollReveal depth="extreme" delay={0.07} sectionIndex={2}>
        <Projects projects={data.projects} />
      </ScrollReveal>
      <ScrollReveal depth="heavy" delay={0.06} sectionIndex={3}>
        <Experience experience={data.experience} />
      </ScrollReveal>
      <ScrollReveal depth="heavy" delay={0.06} sectionIndex={4}>
        <Testimonials testimonials={data.testimonials} />
      </ScrollReveal>
      <ScrollReveal depth="extreme" delay={0.06} sectionIndex={5}>
        <Contact data={data.personal} socials={data.socials} />
      </ScrollReveal>
    </div>
  );
};

export default DepthReveal;
