import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import ProjectsZoom from './ProjectsZoom';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function ZoomIntoWorkTemplate() {
  return (
    <div className="bg-zinc-950 min-h-screen overflow-x-clip selection:bg-cyan-500/30 selection:text-cyan-100">
      <Hero />
      <About />
      <Skills />
      <ProjectsZoom />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}