import React from 'react';
import { FreeFadeIn } from './Shared';
import { Rocket } from 'lucide-react';

export default function Experience({ experience }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24">
      <FreeFadeIn>
        <div className="mb-20 w-full flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-6 group">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase group-hover:text-orange-500 transition-colors">Experience</h2>
          <span className="text-xs font-mono tracking-widest text-slate-500 uppercase mt-2 md:mt-0">Work History</span>
        </div>
      </FreeFadeIn>

      <div className="w-full space-y-8 pl-4 border-l border-slate-800 relative">
        {(experience || []).map((exp, index) => (
          <FreeFadeIn key={index} delay={index * 0.1}>
            <div className="w-full grid md:grid-cols-12 items-start py-8 transition-all duration-300 group px-6 rounded-2xl relative">
              
              {/* ROCKET TIMELINE EFFECT */}
              <div className="absolute -left-[17px] top-8 text-slate-600 group-hover:text-orange-500 group-hover:-translate-y-8 transition-all duration-500 bg-black py-2">
                <Rocket size={20} className="group-hover:drop-shadow-[0_5px_10px_rgba(249,115,22,0.8)]" />
              </div>
              
              <div className="md:col-span-3 text-slate-500 group-hover:text-orange-400 font-mono text-sm tracking-wider mb-2 md:mb-0 transition-colors">
                {exp.period}
              </div>
              <div className="md:col-span-4 pr-4">
                <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-orange-300 transition-colors">{exp.role}</h3>
                <h4 className="text-sm font-mono text-slate-500 group-hover:text-orange-400/60 mt-1 flex items-center gap-1.5 transition-colors">{exp.company}</h4>
              </div>
              <div className="md:col-span-5 text-slate-400 group-hover:text-slate-200 font-light text-sm leading-relaxed mt-2 md:mt-0 transition-colors">
                {exp.description}
              </div>
            </div>
          </FreeFadeIn>
        ))}
      </div>
    </section>
  );
}