// frontend/src/components/portfolio/templates/Elevator_Pitch/Skills.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const Skills = ({ skills }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-2xl font-bold mb-4 font-mono text-zinc-500">Skills</h3>
      {skills.map((skill, index) => (
        <div key={index} className="space-y-2 group">
          <div className="flex justify-between text-xs md:text-sm font-mono">
            <span className="text-zinc-400 group-hover:text-white transition-colors">{skill.name}</span>
            <span className="text-emerald-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">{skill.level}%</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              style={{ willChange: "width" }}
              className="h-full bg-gradient-to-r from-emerald-800 to-emerald-400 relative overflow-hidden"
            >
              {/* Continuous scanning laser on skill bars */}
              <motion.div 
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.2 }}
                className="absolute top-0 bottom-0 w-8 bg-white/40 blur-[4px] skew-x-12"
              />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};