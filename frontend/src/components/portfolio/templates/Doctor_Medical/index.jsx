import React from 'react';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function DoctorMedical() {
  // Defensive check: If data hasn't loaded or is missing, fall back to an empty object
  const safeData = data || {};

  return (
    <div className="font-sans antialiased text-slate-800 w-full min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        * { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #93c5fd; }
      `}</style>

      <Hero data={safeData} />
      <About data={safeData} />
      <Skills data={safeData} />
      <Experience data={safeData} />
      <Projects data={safeData} />
      <Testimonials data={safeData} />
      <Contact data={safeData} />
    </div>
  );
}