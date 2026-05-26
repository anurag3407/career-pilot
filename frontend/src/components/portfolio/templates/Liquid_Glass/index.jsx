import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Home, User, Lightbulb, FolderOpen, Briefcase,
  MessageCircle, Mail, Menu, X, Sparkles
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import './styles.css';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/* ─────────────────────────────────────────────────────────────
   Navigation items
───────────────────────────────────────────────────────────── */
const navItems = [
  { id: 'hero',         label: 'Home',        icon: Home          },
  { id: 'about',        label: 'About',       icon: User          },
  { id: 'skills',       label: 'Skills',      icon: Lightbulb     },
  { id: 'projects',     label: 'Projects',    icon: FolderOpen    },
  { id: 'experience',   label: 'Experience',  icon: Briefcase     },
  { id: 'testimonials', label: 'Reviews',     icon: MessageCircle },
  { id: 'contact',      label: 'Contact',     icon: Mail          },
];

/* ─────────────────────────────────────────────────────────────
   Ambient orbs — positioned carefully so they complement
   each section as you scroll through the page
───────────────────────────────────────────────────────────── */
const ambientOrbs = [
  { style: { top: '6%',  left: '-14%',  width: 700, height: 700, background: 'radial-gradient(circle, rgba(56,189,248,0.22) 0%, transparent 72%)', animationName: 'orbDrift1', animationDuration: '23s' } },
  { style: { top: '20%', right: '-12%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)',  animationName: 'orbDrift2', animationDuration: '28s' } },
  { style: { top: '44%', left: '6%',    width: 480, height: 480, background: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 72%)',  animationName: 'orbDrift3', animationDuration: '32s' } },
  { style: { top: '63%', right: '8%',   width: 420, height: 420, background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 72%)',  animationName: 'orbDrift4', animationDuration: '25s' } },
  { style: { top: '81%', left: '28%',   width: 380, height: 380, background: 'radial-gradient(circle, rgba(56,189,248,0.13) 0%, transparent 70%)',  animationName: 'orbDrift1', animationDuration: '36s' } },
  { style: { top: '92%', right: '18%',  width: 320, height: 320, background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)',  animationName: 'orbDrift3', animationDuration: '30s' } },
];

/* ─────────────────────────────────────────────────────────────
   LIQUID GLASS PORTFOLIO  –  Root Component
───────────────────────────────────────────────────────────── */
/**
 * Liquid Glass Portfolio Template
 * Category: Glass / Modern UI
 * Description: Apple Liquid Glass style with translucent panels with depth layers,
 * subtle refraction, background content visible through glassy UI elements.
 */
export default function LiquidGlass() {
  const [activeSection, setActiveSection]   = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [navHovered, setNavHovered]         = useState(false);

  /* ── Scroll tracking ─────────────────────────── */
  useEffect(() => {
    const ids = navItems.map(n => n.id);

    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="lg-root relative min-h-screen overflow-x-hidden text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-5 focus:z-[70] focus:rounded-full focus:bg-white/90 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-slate-900"
      >
        Skip to content
      </a>

      {/* ── Deep-space background ────────────────── */}
      <div className="lg-bg fixed inset-0 -z-20" aria-hidden="true" />

      {/* ── Ambient orb layer ────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {ambientOrbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              ...orb.style,
              filter: 'blur(80px)',
              animation: `${orb.style.animationName} ${orb.style.animationDuration} ease-in-out infinite`,
              animationDelay: `${i * -3.5}s`,
            }}
          />
        ))}
        {/* Fine grain mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ══════════════════════════════════════════
          FLOATING NAV — Apple Island Design
         ══════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        {/* Desktop Navigation Island */}
        <nav
          className="hidden md:flex lg-glass rounded-2xl px-2 py-1.5"
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
          style={{
            boxShadow: navHovered
              ? 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.05), 0 12px 48px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.08), 0 0 40px rgba(99,102,241,0.12)'
              : 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'lg-nav-active text-white'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                {/* Active background pill with spring animation */}
                {isActive && (
                  <motion.span
                    layoutId="navActivePill"
                    className="absolute inset-0 rounded-xl lg-nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    size={15}
                    className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                  />
                  <span className="hidden lg:inline tracking-wide">{item.label}</span>
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden w-full flex justify-end pr-4">
          <motion.button
            onClick={() => setMobileMenuOpen(v => !v)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            className="lg-glass flex items-center justify-center w-12 h-12 rounded-2xl text-white/80 cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{    rotate:  90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.22 }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════════
          MOBILE MENU FULLSCREEN OVERLAY
         ══════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg-mobile-overlay flex flex-col items-center justify-center md:hidden"
          >
            {/* Decorative orbs inside overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            {/* Brand label */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase"
            >
              <Sparkles size={12} />
              <span>Portfolio</span>
            </motion.div>

            {/* Nav items */}
            <div className="relative z-10 flex flex-col items-center gap-2 w-full max-w-xs px-6">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
                    exit={{    opacity: 0, x:  40, filter: 'blur(6px)' }}
                    transition={{ delay: index * 0.055 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'lg-glass lg-nav-active text-white'
                        : 'text-white/55 hover:text-white/90 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'bg-white/[0.05] text-white/50'
                    }`}>
                      <Icon size={18} />
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="mobileActiveIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 text-white/20 text-xs tracking-wider"
            >
              Tap a section to navigate
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          PAGE SECTIONS
         ══════════════════════════════════════════ */}
      <main id="main-content">
        <SectionWrapper id="hero">
          <Hero data={data} />
        </SectionWrapper>

        <SectionWrapper id="about">
          <About data={data} />
        </SectionWrapper>

        <SectionWrapper id="skills">
          <Skills data={data} />
        </SectionWrapper>

        <SectionWrapper id="projects">
          <Projects data={data} />
        </SectionWrapper>

        <SectionWrapper id="experience">
          <Experience data={data} />
        </SectionWrapper>

        <SectionWrapper id="testimonials">
          <Testimonials data={data} />
        </SectionWrapper>

        {/* Contact already has id="contact" internally */}
        <Contact data={data} />
      </main>

      {/* ── Scroll-progress indicator ────────────── */}
      <ScrollProgress />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SectionWrapper — adds id & scroll-margin to each section
───────────────────────────────────────────────────────────── */
function SectionWrapper({ id, children }) {
  return (
    <div id={id} className="lg-section-anchor">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ScrollProgress — thin liquid-glass bar at the very top
───────────────────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #38bdf8, #22d3ee, #2dd4bf, #38bdf8)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}
