import React from 'react';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function ScandinavianLight() {
  return (
    <div
      className="min-h-screen overflow-hidden bg-[#F7F3EA] text-[#283028]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;500;600&display=swap');
        .scandi-serif { font-family: 'Lora', serif; }
        .scandi-wood {
          background-image:
            linear-gradient(115deg, rgba(177, 126, 82, 0.12) 0 1px, transparent 1px),
            linear-gradient(65deg, rgba(143, 165, 138, 0.10) 0 1px, transparent 1px);
          background-size: 34px 34px, 48px 48px;
        }
      `}</style>
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}
