import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MapPin, Target } from 'lucide-react';

function HexBolt({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" className={`text-slate-600/70 ${className}`} fill="none">
      <polygon points="9,1 16,4.5 16,13.5 9,17 2,13.5 2,4.5" stroke="currentColor" strokeWidth="1" fill="rgba(148,163,184,0.04)" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export default function About({ data }) {
  const { personal = {}, stats = {} } = data || {};

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0c0c0c]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      <HexBolt className="absolute left-4 top-4" />
      <HexBolt className="absolute right-4 top-4" />

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-sm border border-slate-600/50 bg-[#111]/90 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Cpu className="h-3.5 w-3.5 text-slate-400" />
            About Me
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
              Engineering polished digital products with a performance-first mindset.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400">{personal.bio}</p>
          </div>
          {/* Dashboard summary — instrument readout style */}
          <div className="relative rounded-sm border border-slate-600/50 bg-[#0a0a0a] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/60 via-slate-500/30 to-transparent" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Dashboard Summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Performance systems, polished UI layers, and durable architecture designed for the fast lane.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:max-w-xs w-full">
          <div className="relative rounded-sm border border-slate-600/50 bg-[#0d0d0d] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/50 via-slate-500/20 to-transparent" />
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Location</span>
            </div>
            <p className="mt-4 text-base font-semibold text-slate-100">{personal.location}</p>
          </div>
          <div className="relative rounded-sm border border-slate-600/50 bg-[#0d0d0d] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/50 via-slate-500/20 to-transparent" />
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Core Focus</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              {['Performance-first interfaces', 'High-fidelity product polish', 'Data-driven engineering practices'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-slate-500/60" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Experience', value: `${stats.yearsExperience || 0} yrs` },
          { label: 'Projects', value: stats.projectsCompleted || 0 },
          { label: 'Clients', value: stats.happyClients || 0 },
        ].map((item) => (
          <div key={item.label} className="relative rounded-sm border border-slate-600/50 bg-[#0a0a0a] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
            <p className="text-3xl font-black text-white tracking-tight">{item.value}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}