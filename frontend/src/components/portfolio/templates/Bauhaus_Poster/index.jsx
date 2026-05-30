import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import FooterContact from './FooterContact';

// Required data import per issue description
import data from '../../../../data/dummy_data.json';

const colors = ['#E3000F', '#00509E', '#FFD700', '#000000', '#FFFFFF'];

const BauhausPortfolioIntegrated = () => {
  // Bauhaus Primary Palette
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Generate static random values for background shapes so they don't jump on re-renders
  // Optimized for mobile performance (removed blur filters which break mobile renderers)
  const backgroundShapes = useMemo(() => {
    const brightCount = isMobile ? 8 : 20;
    const darkCount = isMobile ? 5 : 12;

    const brightShapes = Array.from({ length: brightCount }).map((_, i) => {
      const size = Math.random() * 60 + 20; // Slightly smaller base sizes for mobile
      const isTriangle = Math.random() > 0.7;
      return {
        id: `bright-${i}`,
        kind: 'bright',
        size,
        color: colors[Math.floor(Math.random() * 3)],
        isCircle: Math.random() > 0.5,
        isTriangle,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        // shorter durations = faster motion
        duration: Math.random() * (isMobile ? 6 : 10) + (isMobile ? 4 : 6),
        delay: Math.random() * -20
      };
    });

    const darkShapes = Array.from({ length: darkCount }).map((_, i) => {
      const size = Math.random() * 100 + 40;
      const points = [
        [0, 10], [18, 0], [44, 8], [70, 2], [100, 18], [92, 52], [100, 78], [72, 100], [38, 92], [12, 100], [0, 74], [8, 42]
      ]
        .map(([x, y]) => `${x}% ${y}%`)
        .join(', ');

      return {
        id: `dark-${i}`,
        kind: 'dark',
        size,
        color: ['#111111', '#171717', '#222222', '#2B2B2B'][i % 4],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        // shorten dark shape cycles for snappier motion
        duration: Math.random() * (isMobile ? 8 : 12) + (isMobile ? 6 : 8),
        delay: Math.random() * -28,
        clipPath: `polygon(${points})`
      };
    });

    return [...brightShapes, ...darkShapes];
  }, [isMobile]);

  // (nameLetters and section variants were moved into the extracted components)

  return (
    <div className="relative min-h-screen bg-[#F4F0EC] text-black overflow-x-hidden font-sans selection:bg-black selection:text-white">
      
      {/* ================= DYNAMIC BACKGROUND ================= */}
      {/* Force hardware acceleration on mobile using transform-gpu */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transform-gpu">
        {backgroundShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute will-change-transform"
            style={{
              width: shape.isTriangle ? 0 : shape.size,
              height: shape.isTriangle ? 0 : shape.size,
              backgroundColor: shape.kind === 'dark' ? shape.color : (shape.isTriangle ? 'transparent' : shape.color),
              borderRadius: shape.kind === 'dark' ? '28% 72% 63% 37% / 46% 39% 61% 54%' : (shape.isCircle && !shape.isTriangle ? '50%' : '0%'),
              borderLeft: shape.kind === 'dark' ? 'none' : (shape.isTriangle ? `${shape.size / 2}px solid transparent` : 'none'),
              borderRight: shape.kind === 'dark' ? 'none' : (shape.isTriangle ? `${shape.size / 2}px solid transparent` : 'none'),
              borderBottom: shape.kind === 'dark' ? 'none' : (shape.isTriangle ? `${shape.size}px solid ${shape.color}` : 'none'),
              left: shape.left,
              top: shape.top,
              clipPath: shape.kind === 'dark' ? shape.clipPath : undefined,
              opacity: shape.kind === 'dark' ? 0.15 : 0.2, // Slightly bumped opacity
              mixBlendMode: 'multiply',
              transformOrigin: 'center'
            }}
            animate={{
              y: shape.kind === 'dark' ? [0, -80, 20, 0] : [0, -100, 0],
              x: shape.kind === 'dark' ? [0, 30, -10, 0] : [0, 0, 0],
              rotate: shape.kind === 'dark' ? [0, 90, 180, 360] : [0, 360],
              scale: shape.kind === 'dark' ? [1, 1.1, 0.95, 1] : [1, 1.2, 1],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto bg-[#F4F0EC]/90 md:bg-[#F4F0EC]/80 backdrop-blur-sm border-x-0 md:border-x-4 border-black flex flex-col md:shadow-[24px_0px_0px_0px_rgba(0,0,0,1)]">

        <Hero colors={colors} />
        <About />
        <Skills colors={colors} />
        <Projects />
        <Experience />
        <Testimonials />
        <FooterContact />

      </div>
    </div>
  );
};

export default BauhausPortfolioIntegrated;