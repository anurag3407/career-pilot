import React from 'react';
import { motion } from 'framer-motion';

export const FreeFadeIn = ({ children, delay = 0, xOffset = 0, duration = 0.9 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, x: xOffset }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    className="w-full h-full relative z-10"
  >
    {children}
  </motion.div>
);

export const AshEmitter = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] overflow-visible">
      {particles.map((_, i) => {
        const left = Math.random() * 100;
        const duration = 1.5 + Math.random() * 2.5;
        const delay = Math.random() * 2;
        const isOrange = Math.random() > 0.4;
        
        return (
          <div
            key={i}
            className="absolute bottom-0 w-1.5 h-1.5 rounded-full"
            style={{
              left: `${left}%`,
              backgroundColor: isOrange ? '#f97316' : '#9ca3af',
              boxShadow: isOrange ? '0 0 10px 2px rgba(249, 115, 22, 0.6)' : 'none',
              animation: `ashRise ${duration}s ease-out ${delay}s infinite`,
              '--tx': `${(Math.random() - 0.5) * 80}px`,
              '--s': `${Math.random() * 1.5 + 0.5}`
            }}
          />
        );
      })}
    </div>
  );
};