import React from 'react';
import { motion } from 'framer-motion';

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export const drawLine = {
  hidden: { height: 0 },
  visible: { height: '100%', transition: { duration: 1.5, ease: 'easeInOut' } },
};

export const SectionHeading = ({ title, icon: Icon }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    className="mb-12 flex items-center gap-4"
  >
    <div className="rounded-full border border-cyan-500/20 bg-cyan-950/30 p-3 text-cyan-400">
      <Icon size={24} />
    </div>
    <h2 className="text-3xl font-light tracking-tight text-white md:text-5xl">
      {title}<span className="text-cyan-400">.</span>
    </h2>
    <div className="ml-4 h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />
  </motion.div>
);

export const SocialLink = ({ href, icon, ariaLabel }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    whileHover={{ y: -5, color: '#22d3ee', scale: 1.1 }}
    className="relative z-20 text-gray-500 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
  >
    {icon}
  </motion.a>
);