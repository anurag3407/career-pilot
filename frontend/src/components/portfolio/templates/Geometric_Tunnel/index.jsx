import React, { useEffect } from 'react';

// Import all modular section components
import GlobalTunnel from './GlobalTunnel';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function GeometricTunnel() {
  useEffect(() => {
    // Load the custom font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      className="relative min-h-screen text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden"
      style={{ background: "#05050a", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Background Canvas Tunnel */}
      <GlobalTunnel />

      {/* Page Sections (Navbar Removed) */}
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