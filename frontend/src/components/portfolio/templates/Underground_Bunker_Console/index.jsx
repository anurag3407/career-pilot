import React from 'react';
import data from '../../../../data/dummy_data.json';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';

export default function UndergroundBunkerConsole() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#33ff33', fontFamily: '"JetBrains Mono", "Courier New", monospace', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0a; }
        ::selection { background: rgba(51, 255, 51, 0.3); color: #0a0a0a; }
        @keyframes crt-flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.85; }
          10% { opacity: 0.98; }
          15% { opacity: 0.9; }
          20% { opacity: 0.97; }
          50% { opacity: 0.98; }
          80% { opacity: 0.95; }
          90% { opacity: 0.88; }
          100% { opacity: 0.97; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
        .crt-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          animation: crt-flicker 8s infinite;
        }
        .crt-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        .glitch-text:hover {
          animation: glitch 0.3s infinite;
        }
        .bunker-section {
          padding: 80px 24px;
          border-bottom: 1px solid rgba(51, 255, 51, 0.1);
        }
      `}</style>
      <div className="crt-overlay" />
      <Navbar data={data} />
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Contact data={data} />
    </div>
  );
}
