import React from 'react';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function GlitchRevealPortfolio() {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-cyan-500 selection:text-zinc-950 font-sans overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes violent-jitter {
          0% { transform: translate(0, 0) skew(0deg); }
          20% { transform: translate(-2px, 2px) skew(-5deg); filter: hue-rotate(90deg); }
          40% { transform: translate(3px, -2px) skew(5deg); }
          60% { transform: translate(-3px, -3px) skew(-5deg); filter: hue-rotate(-90deg); }
          80% { transform: translate(2px, 3px) skew(5deg); }
          100% { transform: translate(0, 0) skew(0deg); }
        }
        .vibrate-hover:hover { animation: violent-jitter 0.15s infinite reverse; }
      `}} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <footer className="text-center py-8 border-t border-zinc-900 relative z-40 bg-zinc-950">
        <p className="text-zinc-600 font-mono text-sm hover:text-cyan-500 transition-colors cursor-crosshair">System.Exit(0) // Built by <span className="vibrate-hover inline-block">{data.personal.name}</span></p>
      </footer>
    </div>
  );
}