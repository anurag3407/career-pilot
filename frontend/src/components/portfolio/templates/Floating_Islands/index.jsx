import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Floating Islands Portfolio Template
 * Category: 3D / WebGL
 * Description: Floating island world with parallax depth, clouds drifting across, and sky-based navigation. Each island represents a portfolio section.
 */

/* ─── Cloud SVG Component ─── */
function Cloud({ className, style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <svg
      viewBox="0 0 200 80"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="50" rx="50" ry="25" opacity="0.8" />
      <ellipse cx="100" cy="40" rx="45" ry="28" />
      <ellipse cx="140" cy="50" rx="50" ry="25" opacity="0.8" />
      <ellipse cx="100" cy="55" rx="60" ry="20" opacity="0.6" />
    </svg>
  );
}

/* ─── Animated Background Clouds ─── */
function BackgroundClouds() {
  const { portfolioData: data } = usePortfolio();

  const clouds = [
    { top: '8%', duration: 45, delay: 0, size: 'w-40 md:w-56', opacity: 0.15 },
    { top: '18%', duration: 60, delay: -15, size: 'w-32 md:w-44', opacity: 0.1 },
    { top: '35%', duration: 50, delay: -25, size: 'w-48 md:w-64', opacity: 0.12 },
    { top: '52%', duration: 55, delay: -10, size: 'w-36 md:w-48', opacity: 0.08 },
    { top: '68%', duration: 40, delay: -30, size: 'w-44 md:w-60', opacity: 0.1 },
    { top: '82%', duration: 65, delay: -5, size: 'w-28 md:w-40', opacity: 0.12 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((cloud, i) => (
        <motion.div
          key={i}
          className={`absolute ${cloud.size} text-white`}
          style={{ top: cloud.top, opacity: cloud.opacity }}
          animate={{ x: ['-20%', '120vw'] }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Cloud />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Parallax Sky Layers ─── */
function SkyLayers() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Deep sky layer */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-sky-600 to-sky-300"
      />
      {/* Mid sky layer */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-100/20"
      />
      {/* Warm sunset glow at bottom */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-200/30 via-rose-100/10 to-transparent"
      />
    </div>
  );
}

/* ─── Navigation ─── */
function Navigation() {
  const { portfolioData: data } = usePortfolio();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-lg shadow-sky-100/30 border-b border-white/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#hero" className="text-lg font-bold text-white drop-shadow-sm">
          ☁️ {data.personal.name.split(' ')[0]}
        </a>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        {/* Mobile menu button */}
        <MobileMenu navItems={navItems} scrolled={scrolled} />
      </div>
    </motion.nav>
  );
}

/* ─── Mobile Menu ─── */
function MobileMenu({ navItems, scrolled }) {
  const { portfolioData: data } = usePortfolio();

  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button type="button"
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-lg ${scrolled ? 'text-slate-600' : 'text-white'}`}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-white/50 shadow-lg"
        >
          <div className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 text-sm font-medium transition-colors"
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

/* ─── Decorative Floating Elements ─── */
function FloatingDecorations() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Small floating clouds at different parallax speeds */}
      <motion.div style={{ y: y1 }} className="absolute top-[20%] left-[5%] w-20 text-white/20">
        <Cloud />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[40%] right-[8%] w-24 text-white/15">
        <Cloud />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute top-[60%] left-[10%] w-16 text-white/10">
        <Cloud />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[75%] right-[15%] w-20 text-white/12">
        <Cloud />
      </motion.div>
    </div>
  );
}

/* ─── Main Template ─── */
export default function FloatingIslands() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      {/* Sky Background */}
      <SkyLayers />

      {/* Animated Clouds */}
      <BackgroundClouds />

      {/* Parallax Decorations */}
      <FloatingDecorations />

      {/* Navigation */}
      <Navigation />

      {/* Content Sections */}
      <main className="relative z-10">
        <Hero personal={data.personal} socials={data.socials} />
        <About personal={data.personal} stats={data.stats} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experience={data.experience} />
        <Testimonials testimonials={data.testimonials} />
        <Contact socials={data.socials} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/60 text-sm">
        <p>&copy; {new Date().getFullYear()} {data.personal.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
