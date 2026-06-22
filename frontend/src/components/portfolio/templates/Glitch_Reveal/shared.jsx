import React from 'react';
import { motion } from 'framer-motion';

// Shared animation and wrapper primitives for the Glitch Reveal template.
// This keeps the section files focused on content while reusing the same
// reveal motion, scanline motion, and glitch text treatment everywhere.
export const glitchReveal = {
  hidden: { opacity: 0, scale: 0.95, filter: 'brightness(2) hue-rotate(90deg)' },
  visible: {
    opacity: [0, 1, 0.5, 1, 0.8, 1],
    x: [0, -15, 20, -10, 5, 0],
    y: [40, -10, 15, -5, 5, 0],
    skewX: [0, 25, -25, 10, -10, 0],
    filter: [
      'brightness(2) hue-rotate(90deg) blur(10px)',
      'brightness(1) hue-rotate(-90deg) blur(0px)',
      'brightness(1.5) hue-rotate(45deg) blur(4px)',
      'brightness(1) hue-rotate(0deg) blur(0px)',
    ],
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'linear',
      times: [0, 0.1, 0.2, 0.4, 0.6, 1],
    },
  },
};

export const scanline = {
  hidden: { top: '-10%' },
  visible: {
    top: '110%',
    transition: { repeat: Infinity, duration: 3, ease: 'linear' },
  },
};

export const GlitchText = ({ text, as = 'h2', className = '' }) => {
  const Tag = as;
  return (
    // The text-shadow hover effect creates the chromatic glitch split.
    <Tag
      data-text={text}
      className={`relative inline-block vibrate-hover cursor-crosshair uppercase tracking-tighter transition-all duration-75 hover:[text-shadow:-4px_3px_0_rgba(34,211,238,0.8),4px_-3px_0_rgba(217,70,239,0.8)] ${className}`}
    >
      {text}
    </Tag>
  );
};

export const SectionWrapper = ({ children, id }) => (
  // Each section fades and distorts into view using the same reveal motion.
  <section id={id} className="relative py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-zinc-800/50 overflow-hidden">
    <motion.div
      variants={glitchReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  </section>
);
