import React from 'react';
import { Briefcase, Terminal, Activity } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section className="relative w-full min-h-[500px] bg-slate-950 p-6 md:p-12 overflow-hidden font-mono text-cyan-400 select-none border-y border-cyan-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Briefcase className="w-8 h-8 text-cyan-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
              SERVICE_RECORD
            </h2>
            <div className="text-sm text-cyan-600 mt-1">Operational history logged</div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {experience.map((exp, i) => (
            <div key={i} className="border border-cyan-900/50 bg-cyan-950/20 p-6 relative group hover:border-cyan-500/50 transition-colors">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyan-900/50 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg md:text-xl font-bold text-cyan-100 tracking-wider">
                    {exp.role || exp.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0 text-cyan-500 text-sm">
                  <Activity className="w-4 h-4" />
                  <span className="tracking-widest">{exp.period || `${exp.startDate} - ${exp.endDate}`}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="text-[10px] text-cyan-600 tracking-widest uppercase md:w-32 shrink-0">
                  <div className="mb-1">AFFILIATION</div>
                  <div className="text-cyan-300 text-sm">{exp.company}</div>
                </div>
                <div className="text-cyan-200 text-sm leading-relaxed border-l border-cyan-900/50 pl-4">
                  {exp.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}