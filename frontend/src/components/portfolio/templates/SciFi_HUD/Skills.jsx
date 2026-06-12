import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="relative w-full min-h-[400px] bg-slate-950 p-6 md:p-12 overflow-hidden font-mono text-cyan-400 select-none border-y border-cyan-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Cpu className="w-8 h-8 text-cyan-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
              CAPABILITIES
            </h2>
            <div className="text-sm text-cyan-600 mt-1">System processing units online</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <div key={i} className="border border-cyan-900/50 bg-cyan-950/20 p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500/50" />
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm tracking-widest text-cyan-100 uppercase flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-500" />
                  {skill.name}
                </span>
                <span className="text-xs text-cyan-500">{skill.level || 100}%</span>
              </div>
              
              <div className="w-full h-1 bg-cyan-950/50 overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level || 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.05 }}
                />
              </div>
              <div className="text-[10px] text-cyan-700 mt-2 tracking-widest text-right uppercase">
                MOD: {skill.category || 'GENERAL'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}