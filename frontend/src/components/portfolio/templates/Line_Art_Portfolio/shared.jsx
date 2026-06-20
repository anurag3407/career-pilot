import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const LineDivider = () => (
  <motion.hr
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="border-t border-zinc-200 origin-left my-16 md:my-24 w-full"
  />
);

export const WireframeCorners = () => (
  <>
    <Plus size={16} strokeWidth={1} className="absolute -top-2 -left-2 text-zinc-300" />
    <Plus size={16} strokeWidth={1} className="absolute -top-2 -right-2 text-zinc-300" />
    <Plus size={16} strokeWidth={1} className="absolute -bottom-2 -left-2 text-zinc-300" />
    <Plus size={16} strokeWidth={1} className="absolute -bottom-2 -right-2 text-zinc-300" />
  </>
);

export const AbstractLineArt = () => (
  <svg viewBox="0 0 200 200" className="w-64 h-64 mx-auto opacity-30" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 100 C 50 10, 150 10, 190 100 C 150 190, 50 190, 10 100 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-900" />
    <path d="M100 10 L 100 190 M 10 100 L 190 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-zinc-400" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-900" />
  </svg>
);

export default {};
