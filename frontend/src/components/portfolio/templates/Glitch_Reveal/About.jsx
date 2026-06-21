import React from 'react';
import { User } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function About() {
  return (
    <SectionWrapper id="about">
      {/* Section title uses the shared glitch text treatment for consistency. */}
      <div className="flex items-center gap-4 mb-12">
        <User className="text-fuchsia-500 animate-pulse" />
        <GlitchText text="About_Me" as="h2" className="text-4xl font-bold text-white" />
      </div>

      {/* The profile image sits in a 3-column grid so the bio can span wider. */}
      <div className="grid md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 relative group cursor-crosshair">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 blur-xl opacity-20 group-hover:opacity-50 transition-opacity animate-pulse" />
          <img src={data.personal.avatar} alt={data.personal.name || "Profile Avatar"} className="relative w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-300 border border-zinc-800 vibrate-hover" />
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500" />
        </div>

        <div className="md:col-span-2">
          <p className="text-lg text-zinc-400 font-mono leading-relaxed mb-8 hover:text-zinc-300 transition-colors">{data.personal.bio}</p>
          {/* These stat cards summarize experience without adding more copy. */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 border-l-cyan-500 hover:bg-zinc-800/50 transition-colors vibrate-hover cursor-crosshair">
              <h4 className="text-cyan-400 text-3xl font-black mb-1">{data.stats.yearsExperience}+</h4>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Years EXP</p>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 border-l-fuchsia-500 hover:bg-zinc-800/50 transition-colors vibrate-hover cursor-crosshair">
              <h4 className="text-fuchsia-500 text-3xl font-black mb-1">{data.stats.projectsCompleted}</h4>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Projects</p>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 border-l-cyan-500 hidden md:block hover:bg-zinc-800/50 transition-colors vibrate-hover cursor-crosshair">
              <h4 className="text-cyan-400 text-3xl font-black mb-1">{data.stats.happyClients}</h4>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">Clients</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
