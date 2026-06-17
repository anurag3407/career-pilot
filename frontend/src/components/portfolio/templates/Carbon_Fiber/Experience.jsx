import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Briefcase } from 'lucide-react';

function HexBolt({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" className={`text-slate-600/70 ${className}`} fill="none">
      <polygon points="9,1 16,4.5 16,13.5 9,17 2,13.5 2,4.5" stroke="currentColor" strokeWidth="1" fill="rgba(148,163,184,0.04)" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export default function Experience({ data }) {
  const experiences = Array.isArray(data?.experience) ? data.experience : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0c0c0c]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      <HexBolt className="absolute left-4 top-4" />
      <HexBolt className="absolute right-4 top-4" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Experience</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Industrial-grade career timeline.</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-sm border border-slate-600/50 bg-[#0d0d0d] px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <Briefcase className="h-3.5 w-3.5" />
          {experiences.length} roles tracked
        </div>
      </div>

      <div className="mt-10 space-y-5">
        {experiences.map((item, index) => (
          <div
            key={`${item.role}-${item.company}-${index}`}
            className="relative overflow-hidden rounded-sm border border-slate-700/50 bg-[#0a0a0a] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {/* Left chrome rail */}
            <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-slate-200/60 via-slate-400/20 to-transparent" />
            {/* Bottom machined edge */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />

            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-slate-600/50 bg-[#111] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{item.role}</h3>
                    <p className="text-sm text-slate-500">{item.company}</p>
                  </div>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-slate-500">{item.period}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-[10px] uppercase tracking-[0.3em]">Role details</span>
                <span className="text-slate-600">›</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}