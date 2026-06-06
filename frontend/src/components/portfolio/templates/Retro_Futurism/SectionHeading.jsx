import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({ children, className = '' }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`flex items-center gap-3 md:gap-4 text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] mb-8 md:mb-12 ${className}`}
    >
      {children}
    </motion.h2>
  );
}
