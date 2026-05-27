import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Experience({ data }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <Briefcase className="text-indigo-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Timeline_</h2>
      </div>

      <div className="relative border-l-2 border-slate-800/80 ml-4 md:ml-6 space-y-16 pb-4">
        {data.experience.map((exp, idx) => (
          <div key={idx} className="relative pl-10 group">
            
            {/* Liquid boiling timeline nodes */}
            <div className="absolute left-[-17px] top-0 w-8 h-8 bg-slate-950 border-2 border-indigo-500 liquid-shape group-hover:bg-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.8)] group-hover:scale-125 transition-all duration-500" />
            
            <div className="space-y-3">
              <span className="inline-block text-xs font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 liquid-shape-fast">
                {exp.period}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {exp.role} <span className="text-slate-600 font-normal mx-2">/</span> <span className="text-cyan-400">{exp.company}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-4xl font-medium">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}