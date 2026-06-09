import React from 'react';
import { motion } from 'framer-motion';

export const GooeyFilter = () => (
  <svg className="hidden absolute w-0 h-0">
    <defs>
      <filter id="lava-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 35 -15"
          result="lava-goo"
        />
        <feBlend in="SourceGraphic" in2="lava-goo" />
      </filter>
    </defs>
  </svg>
);

export const WavyText = ({ text }) => {
  return (
    <div className="flex flex-wrap justify-center font-black uppercase text-[#2b1318] text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-none tracking-tighter max-w-full break-words" style={{ textShadow: '4px 4px 0px #f28e2b' }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          animate={{ y: ['-8px', '8px', '-8px'] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.1, ease: "easeInOut" }}
          className="inline-block will-change-transform"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

export const LiquidHeading = ({ title, colorCode }) => {
  return (
    <div className="flex justify-center mb-16 md:mb-20 relative w-full h-24 md:h-32 items-center">
      <div className="absolute inset-0 flex items-center justify-center z-0" style={{ filter: 'url(#lava-goo)' }}>
        <motion.div 
          animate={{ x: [-40, 40, -40], scale: [1, 1.5, 1] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`w-16 h-16 md:w-24 md:h-24 rounded-full absolute ${colorCode} will-change-transform`}
        />
        <motion.div 
          animate={{ x: [40, -40, 40], scale: [1.5, 1, 1.5] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`w-14 h-14 md:w-20 md:h-20 rounded-full absolute ${colorCode} will-change-transform`}
        />
        <motion.div 
          animate={{ y: [-20, 20, -20], scale: [1, 1.2, 1] }} 
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className={`w-20 h-8 md:w-28 md:h-12 rounded-full absolute ${colorCode} will-change-transform`}
        />
      </div>
      <h2 className="relative z-10 text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-widest text-[#fdf3e7] drop-shadow-[4px_4px_0px_#2b1318] pointer-events-none text-center px-4 break-words">
        {title}
      </h2>
    </div>
  );
};