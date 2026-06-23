import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="py-24 px-6 relative bg-[#1a0f0a] border-t-[6px] border-double border-[#8b5a2b]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#c0803e_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-16 justify-center">
          <div className="h-[2px] w-12 md:w-24 bg-[#c0803e] relative">
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-[#8b5a2b] rounded-full border border-[#1a0f0a]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#e6c387] uppercase tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">
            Chronicles of Labour
          </h2>
          <div className="h-[2px] w-12 md:w-24 bg-[#c0803e] relative">
            <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-[#8b5a2b] rounded-full border border-[#1a0f0a]"></div>
          </div>
        </div>

        <div className="space-y-12 border-l-[3px] border-dashed border-[#8b5a2b] pl-8 relative ml-4 md:ml-0">
          {experience.map((exp, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative p-8 bg-[#2b1b11] border-[3px] border-[#8b5a2b] shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(192,128,62,0.1)] rounded-sm"
            >
              {/* Connector from dashed line */}
              <div className="absolute top-8 -left-[35px] w-[32px] h-[3px] bg-[#8b5a2b]"></div>
              
              {/* Main Rivet on the timeline */}
              <div className="absolute -left-[45px] top-[26px] w-6 h-6 bg-[#1a0f0a] border-[3px] border-[#c0803e] rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(192,128,62,0.5)]">
                <div className="w-2 h-2 bg-[#e6c387] rounded-full"></div>
              </div>

              {/* Corner Screws/Rivets */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#1a0f0a] border border-[#5c3a21] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1a0f0a] border border-[#5c3a21] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#1a0f0a] border border-[#5c3a21] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#1a0f0a] border border-[#5c3a21] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-4 border-b-[2px] border-double border-[#8b5a2b]/60 pb-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#f4d499] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {exp.title}
                </h3>
                <div className="mt-2 md:mt-0 text-[#e6c387] font-mono text-xs md:text-sm tracking-widest bg-[#1a0f0a] px-4 py-1.5 border border-[#8b5a2b] shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </div>
              </div>
              
              <div className="text-xl font-serif italic text-[#c0803e] mb-6">
                @ {exp.company}
              </div>
              
              <p className="text-[#d0b490] leading-relaxed font-serif text-base md:text-lg">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}