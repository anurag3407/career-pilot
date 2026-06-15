import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ data }) {
  const { name, title, bio } = data?.personalInfo || {};

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-20 px-6 border-b border-dashed border-[#8d6e63]">
      <div className="absolute top-10 left-10 w-24 h-24 border border-[#5d4037] rounded-full flex items-center justify-center opacity-30">
        <span className="text-[#5d4037] text-2xl font-bold font-serif">N</span>
      </div>
      <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-double border-[#5d4037] rounded-full flex items-center justify-center opacity-20">
        <div className="w-24 h-24 border border-[#5d4037] rounded-full flex items-center justify-center">
          <span className="text-[#5d4037] text-xl">S</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center max-w-4xl relative"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-[200px] h-1 bg-[#5d4037] rounded"></div>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-widest text-[#2e1d16] mb-6 font-serif drop-shadow-sm">
          {name || "Explorer Name"}
        </h1>
        <h2 className="text-2xl md:text-3xl text-[#5d4037] tracking-[0.2em] uppercase italic mb-8 border-y border-[#8d6e63] py-4 inline-block">
          {title || "Master Cartographer"}
        </h2>
        <p className="text-lg md:text-xl text-[#3e2723] max-w-2xl mx-auto leading-relaxed">
          {bio || "Charting the unknown territories of the digital realm, mapping complex systems into beautiful experiences."}
        </p>
        <div className="mt-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#5d4037] rounded-full animate-bounce flex items-center justify-center">
            <span className="text-[#5d4037] text-sm">↓</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
