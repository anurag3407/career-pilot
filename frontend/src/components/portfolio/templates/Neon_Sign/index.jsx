import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

import Hero from './Hero';
import StatsBar from './StatsBar';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Neon Sign Portfolio Template
 * Category: Colorful / Vibrant
 * Description: Realistic neon sign text effects with glowing tube letters with flicker animations. Dark brick wall background. Bar/club signage aesthetic.
 */

/* ─── Global brick-wall + neon keyframes injected once ─── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  :root {
    --neon-pink:   #ff2bd6;
    --neon-blue:   #00d4ff;
    --neon-cyan:   #00ffff;
    --neon-yellow: #ffd000;
    --neon-orange: #ff8c00;
    --neon-green:  #39ff14;
    --neon-purple: #b026ff;
  }

  /* ── Brick wall ── */
  .neon-wall {
    background-color: #050505;
    background-image:
      /* mortar horizontal */
      repeating-linear-gradient(
        180deg,
        transparent 0px, transparent 26px,
        rgba(0,0,0,0.85) 26px, rgba(0,0,0,0.85) 30px
      ),
      /* mortar vertical – odd rows */
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 56px,
        rgba(0,0,0,0.7) 56px, rgba(0,0,0,0.7) 60px
      );
    background-size: 120px 60px;
  }

  /* offset every second row of bricks */
  .neon-wall::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 56px,
        rgba(0,0,0,0.7) 56px, rgba(0,0,0,0.7) 60px
      );
    background-size: 120px 60px;
    background-position: 0 30px;   /* shift half a brick height */
    pointer-events: none;
  }

  /* ── Neon glow keyframes ── */
  @keyframes neonFlicker {
    0%,19%,21%,23%,25%,54%,56%,100% {
      opacity: 1;
      text-shadow:
        0 0 7px #fff,
        0 0 10px #fff,
        0 0 21px var(--neon-pink),
        0 0 42px var(--neon-pink),
        0 0 82px var(--neon-pink);
    }
    20%,24%,55% { opacity: 0.35; text-shadow: none; }
  }

  @keyframes tubeGlow {
    0%,100% { box-shadow: 0 0 6px var(--neon-blue), 0 0 12px var(--neon-blue), 0 0 24px var(--neon-blue); }
    50%      { box-shadow: 0 0 12px var(--neon-blue), 0 0 24px var(--neon-blue), 0 0 48px var(--neon-blue); }
  }

  @keyframes pulseGlowPink {
    0%,100% { box-shadow: 0 0 20px var(--neon-pink), 0 0 40px var(--neon-pink)40; }
    50%      { box-shadow: 0 0 35px var(--neon-pink), 0 0 70px var(--neon-pink)60; }
  }

  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }

  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes shimmerMove {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }

  @keyframes mobileMenuIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Neon scrollbar ── */
  * { scrollbar-width: thin; scrollbar-color: var(--neon-pink) #0d0d0d; }
  *::-webkit-scrollbar { width: 6px; }
  *::-webkit-scrollbar-track { background: #0d0d0d; }
  *::-webkit-scrollbar-thumb { background: var(--neon-pink); border-radius: 3px; box-shadow: 0 0 6px var(--neon-pink); }
`;

/* ─── Mobile accordion section ─── */
const MOBILE_SECTIONS = [
  { id: 'about', label: 'ABOUT', color: '#00d4ff' },
  { id: 'skills', label: 'SKILLS', color: '#39ff14' },
  { id: 'projects', label: 'PROJECTS', color: '#ff2bd6' },
  { id: 'experience', label: 'EXPERIENCE', color: '#ffd000' },
  { id: 'testimonials', label: 'TESTIMONIALS', color: '#b026ff' },
  { id: 'contact', label: 'CONTACT', color: '#00d4ff' },
];

const NAV_LINKS = ['ABOUT', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'TESTIMONIALS', 'CONTACT'];

/* ─── Navbar ─── */
function NeonNav({ menuOpen, setMenuOpen }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/5"
      style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)' }}
    >
      {/* Brand */}
      <div
        className="font-black text-lg uppercase tracking-widest"
        style={{
          fontFamily: "'Courier New', monospace",
          color: '#ff2bd6',
          textShadow: '0 0 10px #ff2bd6, 0 0 20px #ff2bd6',
        }}
      >
        {data.personal.name.split(' ')[0]}
        <span style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff' }}>
          .DEV
        </span>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-200 relative group"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {link}
            <span
              className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
              style={{ background: '#ff2bd6', boxShadow: '0 0 6px #ff2bd6' }}
            />
          </a>
        ))}
      </div>

      {/* Hire Me pill */}
      <Motion.a
        href={`mailto:${data.socials.email}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded border-2 text-xs font-black uppercase tracking-widest cursor-pointer transition-all"
        style={{
          borderColor: '#ff2bd6',
          color: '#ff2bd6',
          background: 'rgba(255,43,214,0.08)',
          textShadow: '0 0 6px #ff2bd6',
          boxShadow: '0 0 10px #ff2bd640',
          fontFamily: "'Courier New', monospace",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px #ff2bd6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 10px #ff2bd640'; }}
      >
        HIRE ME
      </Motion.a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 rounded border border-pink-500/40 text-pink-400 cursor-pointer"
        style={{ background: 'rgba(255,43,214,0.06)', boxShadow: '0 0 8px #ff2bd620' }}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </nav>
  );
}

/* ─── Mobile menu ─── */
function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed top-14 left-0 right-0 z-40 flex flex-col gap-1 px-4 py-4 md:hidden border-b border-white/5"
          style={{ background: 'rgba(5,5,5,0.96)', backdropFilter: 'blur(20px)' }}
        >
          {NAV_LINKS.map((link, i) => {
            const colors = ['#ff2bd6', '#00d4ff', '#ff2bd6', '#ffd000', '#b026ff', '#00d4ff'];
            const color = colors[i % colors.length];
            return (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-black uppercase tracking-widest text-sm"
                style={{
                  fontFamily: "'Courier New', monospace",
                  color,
                  background: `${color}08`,
                  border: `1px solid ${color}30`,
                  textShadow: `0 0 6px ${color}`,
                }}
              >
                <span style={{ textShadow: `0 0 8px ${color}` }}>→</span>
                {link}
              </a>
            );
          })}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Mobile accordion sections ─── */
function MobileAccordion({ sectionId, label, color, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/5"
      style={{ borderColor: `${color}20` }}
    >
      <button
        id={sectionId}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ background: open ? `${color}06` : 'transparent' }}
      >
        <span
          className="font-black text-sm uppercase tracking-widest"
          style={{
            fontFamily: "'Courier New', monospace",
            color,
            textShadow: open ? `0 0 8px ${color}` : 'none',
          }}
        >
          {label}
        </span>
        <Motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color }}
        >
          <ChevronDown size={18} />
        </Motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {children}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main export ─── */
export default function NeonSign() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="neon-wall relative min-h-screen text-white overflow-x-hidden"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Inject global styles */}
      <style>{GLOBAL_STYLES}</style>

      {/* Ambient neon spill across whole page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[200px] bg-pink-600 opacity-5" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[180px] bg-cyan-500 opacity-5" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[180px] bg-purple-700 opacity-5" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[160px] bg-yellow-500 opacity-4" />
      </div>

      {/* ── Nav ── */}
      <NeonNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Desktop layout ── */}
      <div className="hidden md:block pt-14 relative z-10">
        <Hero data={data} />
        <StatsBar data={data} />
        <About data={data} />
        <Skills data={data} />
        <Projects data={data} />
        <Experience data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </div>

      {/* ── Mobile layout — accordion ── */}
      <div className="md:hidden pt-14 relative z-10">
        {/* Hero always visible */}
        <Hero data={data} />
        <StatsBar data={data} />

        <div
          className="mx-4 my-4 rounded-2xl overflow-hidden border border-white/5"
          style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}
        >
          {MOBILE_SECTIONS.map(({ id, label, color }) => {
            const componentMap = {
              about: <About data={data} />,
              skills: <Skills data={data} />,
              projects: <Projects data={data} />,
              experience: <Experience data={data} />,
              testimonials: <Testimonials data={data} />,
              contact: <Contact data={data} />,
            };
            return (
              <MobileAccordion key={id} sectionId={id} label={label} color={color}>
                {componentMap[id]}
              </MobileAccordion>
            );
          })}
        </div>
      </div>

      {/* ── Footer strip ── */}
      <footer
        className="relative z-10 py-6 flex flex-col items-center gap-2 border-t border-white/5"
        style={{ background: 'rgba(5,5,5,0.9)' }}
      >
        {/* Rainbow neon tube */}
        <div
          className="w-3/4 h-0.5 rounded-full mb-4"
          style={{
            background: 'linear-gradient(90deg, #ff2bd6, #00d4ff, #39ff14, #ffd000, #b026ff, #ff8c00)',
            boxShadow: '0 0 12px #00d4ff',
          }}
        />
        <p
          className="text-gray-600 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          © {new Date().getFullYear()}{' '}
          <span style={{ color: '#ff2bd6', textShadow: '0 0 6px #ff2bd6' }}>
            {data.personal.name}
          </span>
          {' '}— All rights reserved
        </p>
        <p
          className="text-gray-700 text-xs tracking-widest"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          Built with{' '}
          <span style={{ color: '#ff2bd6', textShadow: '0 0 4px #ff2bd6' }}>♥</span>
          {' '}& neon lights
        </p>
      </footer>
    </div>
  );
}
