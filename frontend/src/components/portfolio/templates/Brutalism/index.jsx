import React from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function BrutalismTemplate({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white min-h-screen text-black font-mono selection:bg-black selection:text-white pb-20">
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
