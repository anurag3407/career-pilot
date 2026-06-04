// frontend/src/components/portfolio/templates/Elevator_Pitch/About.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const About = ({ personal, stats }) => {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-mono uppercase tracking-tight">About</h2>
      <p className="text-zinc-400 text-base md:text-lg leading-relaxed">{personal.bio}</p>
      
      <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
        {/* Mechanical Button Stats */}
        {[
          { value: `${stats.yearsExperience}+`, label: "Years" },
          { value: stats.projectsCompleted, label: "Projects" },
          { value: stats.happyClients, label: "Clients" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ 
              scale: 0.95, 
              boxShadow: "inset 0px 10px 20px rgba(0,0,0,0.8), inset 0px -2px 5px rgba(16,185,129,0.2)" 
            }}
            className="text-center p-3 md:p-4 border border-zinc-700 rounded-lg bg-zinc-900 cursor-pointer group shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-colors hover:border-emerald-500/50"
          >
            <div className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-emerald-400 transition-colors drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">{stat.value}</div>
            <div className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase group-hover:text-zinc-300">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};