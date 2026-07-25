import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronUp } from 'lucide-react';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function DarkMeshGradient() {
  const { portfolioData: data } = usePortfolio();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          setShowScrollTop(scrollY > 500);

          const scrollPosition = scrollY + 200;
          let currentSection = activeSection;

          for (const item of navItems) {
            const el = document.getElementById(item.id);
            if (!el) continue;

            const top = el.offsetTop;
            const height = el.offsetHeight;

            if (scrollPosition >= top && scrollPosition < top + height) {
              currentSection = item.id;
              break;
            }
          }

          if (currentSection !== activeSection) {
            setActiveSection(currentSection);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // initialize state immediately
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500/30 overflow-x-hidden scroll-smooth">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -80, 50, 0], scale: [1, 1.15, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[10%] w-96 h-96 md:w-[500px] md:h-[500px] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen"
        />

        <motion.div
          animate={{ x: [0, -50, 70, 0], y: [0, 90, -60, 0], scale: [1, 0.85, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-[10%] w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-pink-600/15 rounded-full blur-[130px] mix-blend-screen"
        />

        <motion.div
          animate={{ x: [0, 80, -50, 0], y: [0, -40, 70, 0], scale: [1, 1.1, 0.85, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-[25%] w-[380px] h-[380px] md:w-[480px] md:h-[480px] bg-blue-600/15 rounded-full blur-[125px] mix-blend-screen"
        />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <button type="button"
            onClick={() => scrollToSection('home')}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            {data.personal.name}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Button */}
          <button type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="dark-mesh-mobile-nav"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 md:hidden"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="dark-mesh-mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-gray-950/95 border-b border-white/10 py-6 px-6 md:hidden flex flex-col gap-3"
          >
            {navItems.map((item) => (
              <button type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-5 py-3 rounded-xl text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto w-full pt-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      {/* SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-xl bg-purple-600 text-white"
            aria-label="Scroll to top"
          >
            <ChevronUp />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
