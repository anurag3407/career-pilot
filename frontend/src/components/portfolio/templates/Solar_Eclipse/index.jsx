import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Solar Eclipse Portfolio Template
 * Category: 3D / WebGL
 * Description: Dark space theme with a glowing eclipse hero animation, orbital project cards floating in space.
 * Uses CSS gradients, box-shadows, and radial glows to simulate the eclipse.
 */

/* ─── Navigation ─── */
function Navigation() {
  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/60 backdrop-blur-xl border-b border-gray-800/50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#hero" className="text-lg font-bold text-orange-400">
          ◐ {data.personal.name.split(' ')[0]}
        </a>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-orange-400 hover:bg-gray-800/50 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <MobileMenu navItems={navItems} />
      </div>
    </motion.nav>
  );
}

/* ─── Mobile Menu ─── */
function MobileMenu({ navItems }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-400 hover:text-orange-400 transition-colors"
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800"
        >
          <div className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800/50 text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Ambient Space Particles ─── */
function SpaceAmbience() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 0.15]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0"
    >
      {/* Subtle nebula glow */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #ff6a00 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </motion.div>
  );
}

/* ─── Section Divider ─── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-1 h-1 rounded-full bg-orange-500/40" />
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mx-3" />
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mx-3" />
      <div className="w-1 h-1 rounded-full bg-orange-500/40" />
    </div>
  );
}

/* ─── Main Template ─── */
export default function SolarEclipse() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden font-sans">
      {/* Ambient background */}
      <SpaceAmbience />

      {/* Navigation */}
      <Navigation />

      {/* Content */}
      <main className="relative z-10">
        <Hero personal={data.personal} />
        <SectionDivider />
        <About personal={data.personal} stats={data.stats} />
        <SectionDivider />
        <Skills skills={data.skills} />
        <SectionDivider />
        <Projects projects={data.projects} />
        <SectionDivider />
        <Experience experience={data.experience} />
        <SectionDivider />
        <Testimonials testimonials={data.testimonials} />
        <SectionDivider />
        <Contact socials={data.socials} name={data.personal.name} />
      </main>
    </div>
  );
}
