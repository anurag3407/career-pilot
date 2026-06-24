import React from 'react';
import { Film } from 'lucide-react';

export default function Skills({ data }) {
  if (!data?.skills || data.skills.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/20 via-[#050505] to-[#050505] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center animate-cinematic">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
            <Film size={14} className="text-neutral-600" /> Technical Arsenal
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg">
            Special Effects
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
          {data.skills.map((skill, index) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return (
              <div 
                key={index} 
                className="group relative px-6 py-3 border border-neutral-800 bg-[#0a0a0a] hover:bg-white hover:text-black transition-all duration-500 overflow-hidden rounded-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-neutral-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10 text-xs sm:text-sm font-mono tracking-widest uppercase">
                  {skillName}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
