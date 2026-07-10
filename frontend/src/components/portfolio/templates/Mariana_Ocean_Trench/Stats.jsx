import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Radio, HelpCircle } from 'lucide-react';

export default function Stats({ data }) {
  const statsList = [
    {
      label: "Missions Undertaken",
      value: data.projects?.length || 0,
      unit: "ACTIVE_MODS",
      color: "text-cyan-400",
      glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    },
    {
      label: "Bases Established",
      value: data.experience?.length || 0,
      unit: "CHECKPOINTS",
      color: "text-indigo-400",
      glow: "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
    },
    {
      label: "Capabilities Cataloged",
      value: data.skills?.length || 0,
      unit: "ACTIVE_VECTORS",
      color: "text-blue-400",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    {
      label: "Acoustic Logs Decrypted",
      value: data.testimonials?.length || 0,
      unit: "SIGNALS",
      color: "text-emerald-400",
      glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    },
  ];

  return (
    <section 
      id="stats-zone"
      className="relative w-full py-16 bg-[#00040c] border-y border-slate-900 text-white overflow-hidden select-none"
    >
      {/* Grid line background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-10">
        
        {/* Radar Graphic Display */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative w-44 h-44 rounded-full border border-cyan-500/20 bg-slate-950 flex items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
            {/* Pulsing ring */}
            <div className="absolute w-5/6 h-5/6 border border-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute w-2/3 h-2/3 border border-cyan-500/15 rounded-full" />
            <div className="absolute w-1/3 h-1/3 border border-cyan-500/20 rounded-full" />
            {/* Grid Crosshairs */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-cyan-500/10" />
            <div className="absolute left-0 right-0 h-[1px] bg-cyan-500/10" />
            {/* Radar sweep */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-transparent animate-radar-sweep origin-center" />
            {/* Detected blip dots */}
            <div className="absolute top-[25%] left-[30%] w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <div className="absolute bottom-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee] animation-delay-1500" />
            
            <div className="z-10 font-mono text-[9px] text-cyan-500 text-center uppercase tracking-widest leading-normal">
              <Activity className="w-4 h-4 mx-auto mb-1 animate-pulse text-cyan-400" />
              <span>RADAR_SWEEP</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-6">
          {statsList.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-slate-950/90 border border-slate-900 p-4 rounded-xl flex flex-col justify-between font-mono relative shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-slate-800 transition-colors"
            >
              {/* Corner decor */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700" />

              <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-tight mb-2">
                {stat.label}
              </span>
              
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {stat.unit}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
          animation: radar-sweep 5s linear infinite;
        }
      `}</style>
    </section>
  );
}
