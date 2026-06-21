import React from 'react';
import { User } from 'lucide-react';

export default function About({ data }) {
  return (
    <div className="space-y-12 relative z-10">
      <div className="flex items-center gap-3">
        <User className="text-indigo-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Identity_</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          {/* Constantly morphing liquid picture frame */}
          <div className="w-64 h-64 md:w-full aspect-square bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-1 shadow-[0_0_40px_rgba(99,102,241,0.3)] liquid-shape overflow-hidden">
            <img 
              src={data.personal.avatar} 
              alt={data.personal.name || "Profile Avatar"} 
              // Fix: Removed double liquid-shape, added object-cover, and hover-only filters
              className="w-full h-full object-cover transition-all duration-500 hover:mix-blend-luminosity hover:brightness-110 hover:scale-105 cursor-crosshair"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
            {data.personal.bio}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-[40px] hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 liquid-shape opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              <h4 className="relative text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-black mb-1">{data.stats.yearsExperience}+</h4>
              <p className="relative text-xs font-mono text-slate-500 uppercase tracking-widest">Experience</p>
            </div>
            <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-[40px] hover:border-cyan-500/50 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 liquid-shape-fast opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              <h4 className="relative text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-4xl font-black mb-1">{data.stats.projectsCompleted}</h4>
              <p className="relative text-xs font-mono text-slate-500 uppercase tracking-widest">Builds</p>
            </div>
            <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-[40px] hover:border-purple-500/50 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 liquid-shape opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              <h4 className="relative text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-4xl font-black mb-1">{data.stats.happyClients}</h4>
              <p className="relative text-xs font-mono text-slate-500 uppercase tracking-widest">Clients</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}