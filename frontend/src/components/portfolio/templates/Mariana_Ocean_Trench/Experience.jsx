import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Calendar, MapPin, Anchor, CircleDot } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section 
      id="abyss-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#020617] via-[#01030a] to-[#000105] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Abyss background: Deep dark void with ancient shipwreck particle floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow spots */}
        <div className="absolute bottom-[10%] left-[15%] w-72 h-72 rounded-full bg-blue-600/5 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        
        {/* Silent floating particles (Deep sea dust) */}
        <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-bubble-rise" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[60%] right-[30%] w-1 h-1 bg-blue-400/30 rounded-full animate-bubble-rise" style={{ animationDuration: '18s', animationDelay: '3s' }} />
        <div className="absolute bottom-[20%] left-[45%] w-2 h-2 bg-cyan-400/25 rounded-full animate-bubble-rise" style={{ animationDuration: '15s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-indigo-500/30 pb-4">
          <Compass className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '15s' }} />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              04 // THE_ABYSS: EXPEDITION_TIMELINE
            </h2>
            <p className="text-xs text-indigo-500/80 font-mono mt-1">Status: Ambient Light Level 0.1% | Pressure Level 580 atm | Thermals: 2°C</p>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative flex flex-col gap-12 pl-6 md:pl-0 mt-8">
          
          {/* Vertical track line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/30 via-indigo-500/40 to-cyan-500/10 transform md:-translate-x-1/2" />

          {experience.map((exp, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div 
                key={idx}
                className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full"
              >
                {/* Checkpoint Node Marker */}
                <div 
                  className="absolute left-[-6px] md:left-1/2 top-1.5 md:top-auto w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center transform md:-translate-x-1/2 z-20 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                >
                  <CircleDot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  {/* Glowing halo */}
                  <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping" />
                </div>

                {/* Left side column wrapper (desktop only) */}
                <div className={`w-full md:w-[45%] flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
                  {isLeft && (
                    <div className="font-mono text-xs text-indigo-400 font-bold mb-1">
                      CHECKPOINT_0{idx + 1} // DEPTH_{4000 + idx * 450}M
                    </div>
                  )}
                  {isLeft && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 md:justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                  )}
                </div>

                {/* Right/Content column wrapper */}
                <motion.div 
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`w-full md:w-[45%] bg-slate-950/70 border border-slate-800/80 p-6 rounded-2xl relative shadow-xl hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all ${!isLeft ? 'md:self-end' : ''}`}
                >
                  {/* Mobile header info */}
                  <div className="block md:hidden font-mono text-[9px] text-indigo-400 font-bold mb-1">
                    CHECKPOINT_0{idx + 1} // DEPTH_{4000 + idx * 450}M
                  </div>
                  <div className="block md:hidden flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                  </div>

                  {/* Company / Position */}
                  <h3 className="text-lg md:text-xl font-bold font-sans text-slate-100 flex items-center gap-2 flex-wrap">
                    <Anchor className="w-4 h-4 text-indigo-400" />
                    <span>{exp.company}</span>
                  </h3>
                  <div className="text-sm font-semibold text-cyan-400 font-mono mt-1">
                    {exp.title}
                  </div>

                  {/* Location */}
                  {exp.location && (
                    <div className={`flex items-center gap-1.5 text-slate-400 text-xs mt-2 font-mono ${isLeft ? 'md:justify-end' : ''} md:hidden`}>
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      <span>{exp.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-sans mt-3.5">
                    {exp.description}
                  </p>

                  {/* Highlights (if any) */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2 border-t border-slate-900 pt-3 text-xs text-slate-400">
                      {exp.highlights.map((highlight, hidx) => (
                        <li key={hidx} className="flex gap-2 items-start font-sans">
                          <span className="text-indigo-400 mt-1 select-none font-bold">›</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>

                {/* Left side wrapper when content is on the right */}
                <div className={`w-full md:w-[45%] flex flex-col ${!isLeft ? 'md:items-start md:text-left' : 'hidden md:flex opacity-0 pointer-events-none'}`}>
                  {!isLeft && (
                    <div className="font-mono text-xs text-indigo-400 font-bold mb-1">
                      CHECKPOINT_0{idx + 1} // DEPTH_{4000 + idx * 450}M
                    </div>
                  )}
                  {!isLeft && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
