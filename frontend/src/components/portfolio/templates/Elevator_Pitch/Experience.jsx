// frontend/src/components/portfolio/templates/Elevator_Pitch/Experience.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Experience = ({ experience }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12 font-mono uppercase tracking-widest">Experience</h2>
      
      {/* Elevator Cable Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-zinc-900 before:via-zinc-700 before:to-zinc-900">
        {experience.map((exp, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ willChange: "transform, opacity" }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-default"
          >
            {/* Timeline Dot (Elevator Node) */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-950 bg-zinc-800 text-emerald-500 shadow-[0_0_0_2px_#27272a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300 group-hover:bg-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] group-hover:border-emerald-900">
              {/* Inner glowing dot */}
              <div className="w-2 h-2 rounded-full bg-zinc-900 group-hover:bg-white transition-colors" />
            </div>
            
            {/* Experience Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 md:p-6 rounded-xl border border-zinc-800 bg-zinc-900/80 transition-all duration-300 group-hover:bg-zinc-800 group-hover:-translate-y-1 group-hover:border-emerald-500/50 group-hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <h4 className="font-bold text-base md:text-lg text-white group-hover:text-emerald-300 transition-colors">{exp.role}</h4>
                <span className="text-[10px] md:text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded w-fit">{exp.period}</span>
              </div>
              <div className="text-emerald-500 opacity-70 group-hover:opacity-100 text-xs md:text-sm font-bold mb-3 font-mono tracking-wide transition-opacity">[{exp.company}]</div>
              <p className="text-zinc-400 text-sm leading-relaxed">{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};