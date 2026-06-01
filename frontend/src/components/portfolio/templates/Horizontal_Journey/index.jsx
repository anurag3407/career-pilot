import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import ProjectsSection from './Projects';
import ExperienceSection from './Experience';
import TestimonialsSection from './Testimonials';
import Contact from './Contact';

// ----------------------------------------------------------------------
// DESKTOP: Horizontal Scroll-Jacking Filmstrip
// ----------------------------------------------------------------------
function DesktopJourneyShell({ isMobile }) {
  const containerRef = useRef(null);
  
  // 7 Fixed Slides total
  const totalSlides = 7;
  const containerHeight = `${totalSlides * 100}vh`;
  const trackWidth = `${totalSlides * 100}vw`;
  
  // Translation math: Move left by (Total Slides - 1) viewports
  const endTranslation = `-${(totalSlides - 1) * 100}vw`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0vw', endTranslation]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight }}
      className="relative bg-zinc-950 font-sans text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 overscroll-none"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center overflow-hidden bg-zinc-950 pointer-events-none">
        
        {/* Top Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 z-50 h-1 origin-left bg-zinc-100"
          style={{ scaleX: scrollYProgress, width: '100%' }}
        />

        {/* Translating Track */}
        <motion.div
          style={{ x: xTransform, width: trackWidth }}
          className="flex h-full will-change-transform transform-gpu pointer-events-auto"
        >
          <Hero isMobile={isMobile} />
          <About isMobile={isMobile} />
          <Skills isMobile={isMobile} />
          <ProjectsSection isMobile={isMobile} />
          <ExperienceSection isMobile={isMobile} />
          <TestimonialsSection isMobile={isMobile} />
          <Contact isMobile={isMobile} />
        </motion.div>

        {/* Persistent Scroll hint */}
        <div className="absolute right-4 bottom-4 z-40 rounded border border-zinc-800 bg-zinc-950/90 px-2 py-1 font-mono text-[9px] text-zinc-600 lg:right-8 lg:bottom-8 lg:border-none lg:text-sm animate-pulse">
          <div className="flex items-center gap-1 lg:gap-2 text-zinc-300">
            Scroll Page to Proceed <ArrowRight size={12} className="lg:h-4 lg:w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MOBILE: Native Vertical Stack (Guaranteed perfect scrolling)
// ----------------------------------------------------------------------
function MobileJourneyShell({ isMobile }) {
  // We use standard HTML flow for mobile. No scroll-jacking. No translation. 
  // It just scrolls up and down naturally like a normal website.
  return (
    <div className="flex flex-col w-full min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 font-sans overflow-x-hidden">
      <Hero isMobile={isMobile} />
      <About isMobile={isMobile} />
      <Skills isMobile={isMobile} />
      <ProjectsSection isMobile={isMobile} />
      <ExperienceSection isMobile={isMobile} />
      <TestimonialsSection isMobile={isMobile} />
      <Contact isMobile={isMobile} />
    </div>
  );
}


// --- MAIN EXPORT COMPONENT ---

export default function HorizontalJourney() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)'); // Standard md breakpoint

    const updateMobileState = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobileState();
    mediaQuery.addEventListener('change', updateMobileState);

    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, []);

  return (
    // Always use the desktop horizontal shell so vertical scroll drives horizontal movement on all devices
    <MotionConfig reducedMotion="never">
      <DesktopJourneyShell isMobile={isMobile} />
    </MotionConfig>
  );
}