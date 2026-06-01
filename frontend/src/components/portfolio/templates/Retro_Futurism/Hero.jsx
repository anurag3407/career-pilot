import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

const CyberCar = ({ className = '' }) => (
  <motion.div
    animate={{ y: [0, -3, 0, -1, 0], scale: [1, 1.01, 1] }}
    transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
    className={`relative w-64 md:w-80 h-32 flex justify-center items-end ${className}`}
  >
    <div className="absolute bottom-[-10px] w-3/4 h-6 bg-black/80 blur-md rounded-[100%]" />
    <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-2xl">
      <rect x="20" y="80" width="40" height="35" rx="5" fill="#111" stroke="#333" strokeWidth="2"/>
      <rect x="240" y="80" width="40" height="35" rx="5" fill="#111" stroke="#333" strokeWidth="2"/>
      <path d="M40 100 L260 100 L280 60 L20 60 Z" fill="#1e1b4b" stroke="#db2777" strokeWidth="2"/>
      <path d="M60 60 L240 60 L200 20 L100 20 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="3"/>
      <path d="M70 55 L230 55 L195 25 L105 25 Z" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" filter="drop-shadow(0 0 10px #06b6d4)"/>
      <rect x="45" y="65" width="70" height="15" rx="3" fill="#f43f5e" filter="drop-shadow(0 0 15px #f43f5e)"/>
      <rect x="185" y="65" width="70" height="15" rx="3" fill="#f43f5e" filter="drop-shadow(0 0 15px #f43f5e)"/>
      <rect x="130" y="70" width="40" height="20" fill="#facc15" stroke="#ca8a04"/>
      <text x="150" y="85" fontSize="12" fill="#000" fontWeight="bold" textAnchor="middle" fontFamily="monospace">KODE</text>
    </svg>
  </motion.div>
);

export default function Hero({ showCarOnly = false }) {
  if (showCarOnly) return <CyberCar />;

  return (
    <section className="relative z-[10] h-screen flex flex-col items-center justify-start pt-[44vh] sm:pt-[34vh] md:pt-[43vh]">
      <div className="relative flex flex-col items-center text-center px-6 max-w-5xl mx-auto gap-1 sm:gap-3">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl sm:text-4xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-pink-500 to-purple-600 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] mb-0"
        >
          {data.personal.name}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] sm:text-lg md:text-3xl font-bold text-cyan-300 tracking-widest uppercase shadow-cyan-500/50 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
        >
          &gt; {data.personal.title} <span className="animate-pulse text-pink-500">_</span>
        </motion.p>
      </div>
    </section>
  );
}
