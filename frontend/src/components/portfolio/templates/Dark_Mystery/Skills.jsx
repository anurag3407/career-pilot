import React from 'react';
import { Fingerprint, Cpu } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8 border-y border-stone-800/50">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_50%,rgba(112,24,54,0.1),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
            <Cpu className="h-4 w-4" />
            Arsenal
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
            Acquired Capabilities.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="group relative flex items-center gap-3 border border-stone-500/20 bg-stone-950/55 px-5 py-3 shadow-lg shadow-black/50 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-emerald-200/30 hover:bg-black/80"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-900/0 via-emerald-900/10 to-emerald-900/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <Fingerprint className="h-4 w-4 text-stone-500 transition-colors group-hover:text-emerald-200/80" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-stone-300 group-hover:text-amber-50">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}