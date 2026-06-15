import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_72%_88%,rgba(112,24,54,0.15),transparent_42%),radial-gradient(circle_at_12%_38%,rgba(19,83,75,0.15),transparent_40%),linear-gradient(135deg,#030406_0%,#0b0a0d_48%,#050607_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
            <Briefcase className="h-4 w-4" />
            Case Files
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
            Career Evidence.
          </h2>
        </div>

        <div className="relative border-l border-dashed border-stone-500/30 pl-8 sm:pl-12">
          <div className="flex flex-col gap-12">
            {experience.map((exp, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-[41px] top-2 sm:-left-[57px] flex h-6 w-6 items-center justify-center rounded-full border border-stone-500/30 bg-[#030406] group-hover:border-red-300/40 group-hover:bg-red-950/40 transition-colors">
                  <div className="h-2 w-2 rounded-full bg-stone-500/50 group-hover:bg-red-300/60" />
                </div>
                
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                  <div>
                    <h3 className="font-serif text-2xl text-stone-100">{exp.company}</h3>
                    <div className="mt-2 text-sm uppercase tracking-[0.2em] text-emerald-100/75">
                      {exp.title}
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-xs text-stone-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {exp.startDate} – {exp.endDate || 'Present'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-stone-500/20 bg-black/45 p-6 shadow-xl shadow-black/40 backdrop-blur-sm transition duration-300 group-hover:border-amber-200/20 group-hover:bg-stone-950/60">
                    <p className="text-sm leading-7 text-stone-300">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}