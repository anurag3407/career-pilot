import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ data }) {
  const { personal } = data;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-orange-800/40 mb-8 shadow-2xl shadow-orange-900/20"
      >
        <img 
          src={personal.avatar || 'https://via.placeholder.com/200?text=Profile'} 
          alt={personal.name} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-orange-100">
        {personal.name}
      </h1>
      <h2 className="text-2xl md:text-3xl text-amber-600/90 font-medium mb-6">
        {personal.title}
      </h2>
      <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed italic">
        "{personal.tagline}"
      </p>
    </motion.section>
  );
}
