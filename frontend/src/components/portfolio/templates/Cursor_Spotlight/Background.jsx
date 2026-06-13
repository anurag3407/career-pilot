import React from 'react';
import { motion } from 'framer-motion';

export const SpotlightOverlay = ({ mousePosition }) => {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50"
      animate={{
        background: `radial-gradient(circle 900px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.98) 100%)`,
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
    />
  );
};

export const AmbientBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-950">
    <motion.div
      className="absolute -inset-[100%] opacity-20"
      animate={{
        background: [
          'radial-gradient(circle at 0% 0%, #3b82f6 0%, transparent 50%)',
          'radial-gradient(circle at 100% 100%, #8b5cf6 0%, transparent 50%)',
          'radial-gradient(circle at 0% 100%, #3b82f6 0%, transparent 50%)',
          'radial-gradient(circle at 0% 0%, #3b82f6 0%, transparent 50%)',
        ],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
  </div>
);