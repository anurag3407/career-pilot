import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="py-24 px-6 relative bg-[#2b1b11] border-t-[6px] border-double border-[#c0803e]">
      {/* Background Gear watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[20px] border-dashed border-[#8b5a2b] rounded-full opacity-[0.03] pointer-events-none animate-[spin_40s_linear_infinite]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#e6c387] uppercase tracking-[0.2em] drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
            Mechanisms & Mastery
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-[1px] bg-[#8b5a2b]"></div>
            <p className="text-[#c0803e] font-mono text-sm uppercase tracking-[0.3em]">
              The Apparatus of my Trade
            </p>
            <div className="w-16 h-[1px] bg-[#8b5a2b]"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5 md:gap-6">
          {skills.map((skill, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.05, y: -4, transition: { duration: 0.2 } }}
              className="relative px-8 py-4 bg-[#1a0f0a] border-[2px] border-[#8b5a2b] rounded-sm shadow-[inset_0_0_15px_rgba(0,0,0,0.9),0_6px_10px_rgba(0,0,0,0.6)] cursor-default overflow-hidden group"
            >
              {/* Steampunk Brass Plate Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#c0803e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Corner Screws */}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#c0803e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"></div>
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c0803e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"></div>
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#c0803e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"></div>
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c0803e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"></div>

              <span className="relative z-10 font-serif font-bold text-[#f4d499] tracking-wider text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] group-hover:text-[#fff] transition-colors">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}