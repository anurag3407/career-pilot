import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function CarbonFiber({portfolioData}) {
  const data = portfolioData || {};
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white font-sans selection:bg-slate-300 selection:text-slate-950">
      {/* True carbon fiber weave — tight 45/135 crosshatch */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.025),rgba(255,255,255,0.025)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.025),rgba(255,255,255,0.025)_1px,transparent_1px,transparent_8px)]" />
      {/* Depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      {/* Subtle warm depth — red/amber undertone like a race car interior */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,60,20,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(80,80,100,0.06),transparent_50%)]" />
      {/* Chrome horizontal rule at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Hero data={data} />
        <About data={data} />
        <Skills data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </div>
    </div>
  );
}