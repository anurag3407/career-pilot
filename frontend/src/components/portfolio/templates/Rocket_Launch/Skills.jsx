import React from 'react';
import { FreeFadeIn } from './Shared';

export default function Skills({ skills }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24">
      <FreeFadeIn>
        <div className="mb-16 w-full flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-6 group">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase group-hover:text-orange-500 transition-colors">Skills</h2>
          <span className="text-xs font-mono tracking-widest text-slate-500 uppercase mt-2 md:mt-0">Technologies & Tools</span>
        </div>
      </FreeFadeIn>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 w-full">
        {(skills || []).map((skill, index) => (
          <FreeFadeIn key={index} delay={index * 0.05}>
            <div className="flex flex-col justify-between py-3 border-l-2 border-slate-800 hover:border-orange-500 pl-4 transition-all duration-300 group cursor-default">
              <div>
                <span className="text-xs font-mono tracking-widest text-slate-500 uppercase block mb-1 group-hover:text-orange-400">{skill.category}</span>
                <span className="font-bold text-xl text-white tracking-wide group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{skill.name}</span>
              </div>
              <div className="w-full bg-slate-900 h-[2px] mt-4 relative overflow-visible">
                <div className="absolute left-0 top-0 bottom-0 bg-slate-600 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-yellow-400 group-hover:shadow-[0_0_12px_rgba(249,115,22,1)] transition-all duration-500" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          </FreeFadeIn>
        ))}
      </div>
    </section>
  );
}