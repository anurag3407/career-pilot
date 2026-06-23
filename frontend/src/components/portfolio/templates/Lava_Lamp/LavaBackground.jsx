import React from 'react';
import { motion } from 'framer-motion';

const LavaBackground = () => (
  <div className="fixed inset-0 z-0 bg-[#2b1318] overflow-hidden pointer-events-none">
    
    {/* The magic 'goo' filter is applied to this container so the blobs merge when they touch */}
    <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#lava-goo)' }}>
      <motion.div
        animate={{ y: ['-10%', '110%', '-10%'], x: ['20%', '80%', '20%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] bg-[#f28e2b] rounded-full will-change-transform"
      />
      <motion.div
        animate={{ y: ['110%', '-10%', '110%'], x: ['80%', '10%', '80%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] max-w-[500px] max-h-[500px] bg-[#ff5e57] rounded-full will-change-transform"
      />
      <motion.div
        animate={{ y: ['20%', '80%', '20%'], x: ['-10%', '110%', '-10%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[65vw] h-[65vw] md:w-[45vw] md:h-[45vw] max-w-[700px] max-h-[700px] bg-[#e15f41] rounded-full will-change-transform"
      />
      <motion.div
        animate={{ y: ['80%', '20%', '80%'], x: ['110%', '-10%', '110%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[45vw] h-[45vw] md:w-[30vw] md:h-[30vw] max-w-[400px] max-h-[400px] bg-[#f28e2b] rounded-full will-change-transform"
      />
    </div>

    {/* Retro Noise Overlay */}
    <div 
      className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    ></div>
  </div>
);

export default LavaBackground;