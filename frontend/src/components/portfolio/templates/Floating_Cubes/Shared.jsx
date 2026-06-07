import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedHeading = ({ children }) => (
  <div className="flex items-center gap-4 mb-12">
    <motion.div
      className="h-1 w-12 bg-cyan-400 rounded-full"
      animate={{ width: [48, 96, 48], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.h2
      className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-300"
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'],
        y: [-2, 2, -2]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ backgroundSize: '200% auto' }}
    >
      {children}
    </motion.h2>
    <motion.div
      className="h-1 w-12 bg-cyan-400 rounded-full"
      animate={{ width: [48, 96, 48], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    />
  </div>
);

export const GlassCard = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group ${className}`}
    whileHover={{ 
      scale: 1.02,
      rotateX: 2,
      rotateY: -2,
      boxShadow: "0 25px 50px -12px rgba(192, 132, 252, 0.25)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <motion.div 
      className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
      animate={{ left: ['-100%', '200%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      style={{ transform: 'skewX(-20deg)' }}
    />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);