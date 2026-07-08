import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import "./styles.css";
import { motion } from 'framer-motion';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

// Fluid stretch & drop reveal
const liquidReveal = {
  hidden: { opacity: 0, scaleY: 0.8, y: 80, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

const SectionWrapper = ({ children, id, index }) => (
  <>
    {/* Added hover:cursor-crosshair to the section container */}
    <section id={id} className="relative py-28 px-6 md:px-12 max-w-6xl mx-auto z-10 hover:cursor-crosshair transition-all">
    
    <div className="absolute top-0 left-0 right-0 h-px bg-slate-800/40" />
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 pointer-events-none -z-10" style={{ filter: "url(#goo)" }}>
      <motion.div 
        animate={{ x: [-100, 100, -100], scale: [1, 1.5, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-md"
      />
      <motion.div 
        animate={{ x: [100, -100, 100], scale: [1.5, 1, 1.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-1/3 w-32 h-32 bg-cyan-500/10 rounded-full blur-md"
      />
    </div>

    <motion.div variants={liquidReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
      {children}
    </motion.div>
    </section>
  </>
);

export default function LiquidMorphPortfolio() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* Hidden SVG Filter for the "Hardcore Liquid Goo" effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>



      {/* Background Liquid Ambient Blobs melting into each other */}
      <div className="fixed inset-0 pointer-events-none z-0 liquid-blob-container opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 liquid-shape blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-l from-cyan-600 via-indigo-600 to-purple-500 liquid-shape-fast blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Hero data={data} />
        <SectionWrapper id="about" index={1}><About data={data} /></SectionWrapper>
        <SectionWrapper id="skills" index={2}><Skills data={data} /></SectionWrapper>
        <SectionWrapper id="projects" index={3}><Projects data={data} /></SectionWrapper>
        <SectionWrapper id="experience" index={4}><Experience data={data} /></SectionWrapper>
        <SectionWrapper id="testimonials" index={5}><Testimonials data={data} /></SectionWrapper>
        <SectionWrapper id="contact" index={6}><Contact data={data} /></SectionWrapper>
      </div>

      <footer className="text-center py-10 border-t border-slate-900/60 relative z-20 bg-[#0B0B0C]">
        <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">
          System.Exit(0) // Rendered via {data.personal.name}
        </p>
      </footer>
    </div>
  );
}