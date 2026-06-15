import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import './styles.css';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function RetroFuturismTemplate() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative min-h-screen text-slate-300 font-mono selection:bg-fuchsia-500 selection:text-white bg-slate-950 overflow-x-hidden">
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-[0] pointer-events-none">
        <div className="absolute inset-0 purple-dust-1" />
        <div className="absolute inset-0 purple-dust-2" />
        <div className="absolute inset-0 purple-dust-3" />
      </div>

      {/* HERO BACKGROUND (moon, road, car) and MIDGROUND TREES are kept here to preserve layering */}
      <div className="absolute top-0 left-0 right-0 h-screen z-[1] overflow-hidden pointer-events-none">
        <div className="absolute bottom-[44vh] sm:bottom-[40vh] md:bottom-[45vh] left-1/2 -translate-x-1/2">
          <div className="synth-sun" />
          <div className="absolute inset-0 flex items-start justify-center pt-4 sm:pt-4 md:pt-8">
            <div className="w-32 h-32 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-400 shadow-[0_0_24px_rgba(236,72,153,0.55)] translate-y-[0.75rem] sm:translate-y-[0.75rem] md:translate-y-[1rem]">
              <img src={data.personal.avatar} alt="" aria-hidden="true" role="presentation" className="w-full h-full rounded-full object-cover border-3 border-slate-900" />
            </div>
          </div>
        </div>
        <div className="hero-road">
          <div className="hero-road-inner" />
        </div>
        <div className="absolute bottom-6 md:bottom-12 w-full flex justify-center">
          <Hero showCarOnly={true} />
        </div>
      </div>

      <div className="fixed inset-0 z-[2] pointer-events-none">
        <div className="absolute bottom-24 md:bottom-28 left-[2%] md:left-[10%] w-32 md:w-48 opacity-90 tree-sway-left tree-anchor-left">
          <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            <path d="M100 300 Q110 200 90 100 L110 100 Q120 200 110 300 Z" fill="url(#palmGradient)" />
            <path d="M100 120 Q30 90 20 150 Q60 110 100 130 Z" fill="url(#palmGradient)" />
            <path d="M100 110 Q40 50 40 100 Q70 80 100 120 Z" fill="url(#palmGradient)" />
            <path d="M100 100 Q100 20 60 40 Q80 60 100 110 Z" fill="url(#palmGradient)" />
            <path d="M105 100 Q140 20 170 50 Q140 70 105 110 Z" fill="url(#palmGradient)" />
            <path d="M105 110 Q180 50 180 100 Q140 90 105 120 Z" fill="url(#palmGradient)" />
            <path d="M105 120 Q180 90 170 150 Q130 110 105 130 Z" fill="url(#palmGradient)" />
            <defs>
              <linearGradient id="palmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d946ef" /> 
                <stop offset="100%" stopColor="#1e1b4b" /> 
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="tree-right-offset absolute bottom-32 sm:bottom-28 md:bottom-32 right-[1%] sm:right-[2%] md:right-[8%] w-16 sm:w-20 md:w-36 opacity-90 tree-anchor-right">
          <div className="tree-sway-right w-full h-full">
            <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              <path d="M100 300 Q110 200 90 100 L110 100 Q120 200 110 300 Z" fill="url(#palmGradient)" />
              <path d="M100 120 Q30 90 20 150 Q60 110 100 130 Z" fill="url(#palmGradient)" />
              <path d="M100 110 Q40 50 40 100 Q70 80 100 120 Z" fill="url(#palmGradient)" />
              <path d="M100 100 Q100 20 60 40 Q80 60 100 110 Z" fill="url(#palmGradient)" />
              <path d="M105 100 Q140 20 170 50 Q140 70 105 110 Z" fill="url(#palmGradient)" />
              <path d="M105 110 Q180 50 180 100 Q140 90 105 120 Z" fill="url(#palmGradient)" />
              <path d="M105 120 Q180 90 170 150 Q130 110 105 130 Z" fill="url(#palmGradient)" />
            </svg>
          </div>
        </div>
      </div>

      {/* FOREGROUND CONTENT */}
      <main className="relative z-[10] max-w-6xl mx-auto px-6 py-24 space-y-40">
        <Hero />
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <About />
          <Skills />
        </div>
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}