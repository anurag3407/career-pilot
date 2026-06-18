import React from 'react';
import { motion } from 'framer-motion';

// Imports
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const FloatingCubesBackground = () => {
  const cubes = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950" style={{ perspective: '1000px' }}>
      {cubes.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/5 border border-white/20 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          style={{
            width: Math.random() * 120 + 40,
            height: Math.random() * 120 + 40,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
          }}
          animate={{
            y: [0, -800, 0],
            x: [0, Math.random() * 300 - 150, 0],
            rotateX: [0, 720],
            rotateY: [0, 360],
            rotateZ: [0, 180]
          }}
          transition={{
            duration: Math.random() * 25 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function FloatingCubesPortfolio() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 font-sans selection:bg-cyan-400 selection:text-slate-900 overflow-x-hidden">
      <FloatingCubesBackground />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}