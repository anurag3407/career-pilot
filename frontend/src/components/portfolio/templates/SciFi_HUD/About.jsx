import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Code2, Cpu, Activity } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function About() {
  const personal = data?.personal || {};
  const skills = data?.skills || [];
  const resources = [
    { name: 'MERN_STACK', value: 92 },
    { name: 'FLUTTER_DEV', value: 85 },
    { name: 'GEN_AI_INTEGRATION', value: 78 },
    { name: 'SYSTEM_ARCHITECTURE', value: 88 }
  ];

  return (
    <section className="relative w-full min-h-[480px] bg-slate-950 text-cyan-400 font-mono p-6 md:p-12 overflow-hidden select-none border-y border-cyan-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        className="absolute inset-0 w-full h-[1px] bg-cyan-400/10 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="w-full rounded-xl border border-cyan-800/20 bg-cyan-950/5 p-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-cyan-200">About</h3>
          <p className="mt-3 text-sm md:text-base text-cyan-200/80 max-w-3xl">{personal?.bio || 'No bio available.'}</p>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-cyan-300">Skills</h4>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {skills.map((s, i) => (
                <div key={i} className="px-3 py-2 rounded bg-cyan-900/30 text-xs md:text-sm text-cyan-100">{s.name} <span className="text-cyan-300/70">· {s.level}</span></div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-cyan-300">Resources</h4>
            <div className="mt-3 flex gap-3 flex-wrap">
              {resources.map((r) => (
                <div key={r.name} className="px-3 py-2 rounded bg-cyan-900/20 text-xs text-cyan-100 border border-cyan-800/30">
                  <div className="text-[10px] text-cyan-500">{r.name}</div>
                  <div className="font-bold text-cyan-300">{r.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}