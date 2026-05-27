import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

export default function Skills({ data }) {
  const skills = Array.isArray(data.skills) ? data.skills : [];

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <Code className="text-cyan-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Capabilities_</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills.map((skill, idx) => {
          const sanitizedLevel = Math.max(0, Math.min(100, Number(skill?.level) || 0));
          const skillName = typeof skill?.name === 'string' ? skill.name : 'Unknown skill';

          return (
          <div key={skill?.id || `${skillName}-${idx}`} className="p-6 bg-slate-900/20 border border-slate-800/40 rounded-[32px] hover:bg-slate-900/60 transition-all duration-300 group">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-200 font-semibold uppercase text-sm tracking-wider">{skillName}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 liquid-shape-fast border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all">
                {sanitizedLevel}%
              </span>
            </div>
            
            {/* Melting liquid progress bar */}
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 relative liquid-blob-container">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${sanitizedLevel}%` }}
                transition={{ duration: 1.8, ease: "anticipate" }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-r-full"
              >
                {/* Wavy gradient animation overlay inside the bar */}
                <div className="absolute inset-0 w-[200%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[gradient-flow_2s_linear_infinite]" />
              </motion.div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}