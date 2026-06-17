import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

export default function Skills({ data }) {
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const sortedSkills = [...skills].sort((a, b) => (b.level || 0) - (a.level || 0)).slice(0, 10);

  // Chrome-to-silver gauge gradient — like a real tachometer needle
  const getBarColor = (level) => {
    if (level >= 90) return 'bg-gradient-to-r from-slate-200 via-white to-slate-400';
    if (level >= 75) return 'bg-gradient-to-r from-slate-300 via-slate-200 to-slate-500';
    return 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-600';
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0b0b0b]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.36em] text-slate-500 mb-4">
            <Gauge className="h-3.5 w-3.5" />
            Skills
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Strengths built for speed.</h2>
          <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-7">
            Modern toolchains, polished front-end systems, and rock-solid backend architecture. Each skill reflects a focus on practical delivery and industrial-grade reliability.
          </p>
        </div>
        <div className="rounded-sm border border-slate-600/50 bg-[#0d0d0d] px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] whitespace-nowrap">
          {skills.length} skills loaded
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {sortedSkills.map((skill) => (
          <div
            key={skill.name}
            className="relative rounded-sm border border-slate-700/50 bg-[#0a0a0a] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {/* Left chrome accent */}
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/70 via-slate-500/30 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-slate-100 tracking-wide">{skill.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-slate-600">{skill.category}</p>
              </div>
              <span className="text-sm font-black text-slate-300 tabular-nums">{skill.level || 0}%</span>
            </div>
            {/* Gauge track — machined groove */}
            <div className="h-2 overflow-hidden rounded-none bg-[#1a1a1a] border border-slate-700/40 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
              <div
                className={`h-full transition-all duration-700 ${getBarColor(skill.level || 0)} shadow-[0_0_6px_rgba(255,255,255,0.15)]`}
                style={{ width: `${Math.min(Math.max(skill.level || 0, 4), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}