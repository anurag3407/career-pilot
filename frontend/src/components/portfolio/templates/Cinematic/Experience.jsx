import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

export default function Experience({ data }) {
  if (!data?.experience || data.experience.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center animate-cinematic">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
            <Briefcase size={14} className="text-neutral-600" /> Career Timeline
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg">
            Director's Cut
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {data.experience.map((exp, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-2 h-2 bg-neutral-600 rounded-full transform -translate-x-[4px] md:-translate-x-[4px] mt-6 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500" />

                {/* Content Box */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                  <div className="bg-[#0a0a0a] border border-neutral-800/50 p-8 hover:border-neutral-700 hover:bg-[#0c0c0c] transition-all duration-500 group-hover:-translate-y-1 shadow-2xl relative overflow-hidden rounded-sm">
                    {/* Subtle Film Grain Noise Overlay */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                    <div className="relative z-10 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 mb-2">
                        <Calendar size={12} />
                        <span>{exp.startDate}</span>
                        <span className="opacity-50">-</span>
                        <span>{exp.endDate}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">{exp.role}</h3>
                      <h4 className="text-sm tracking-[0.2em] text-neutral-400 uppercase mb-4">{exp.company}</h4>
                      <p className="text-neutral-400 font-light text-sm leading-relaxed font-serif italic mb-4">
                        {exp.description}
                      </p>
                    </div>
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
