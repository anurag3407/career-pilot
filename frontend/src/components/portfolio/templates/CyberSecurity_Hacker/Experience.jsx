import React from 'react';
import { Terminal, Calendar, Briefcase, ChevronRight } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-[#020804] font-mono overflow-hidden">
      <style>{`
        .exp-path {
          position: absolute;
          left: 24px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, #00ff4140 10%, #00ff4140 90%, transparent);
        }
        @media (min-width: 768px) {
          .exp-path { left: 50%; transform: translateX(-50%); }
        }
        .scanline {
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 65, 0.04) 51%);
          background-size: 100% 4px;
        }
      `}</style>

      {/* Grid / Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanline" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-16 border-b border-[#00ff41]/20 pb-4 flex items-end gap-4">
          <div>
            <div className="text-[10px] text-[#00ff41]/60 mb-1 tracking-widest">// DECRYPTING CAREER TRAJECTORY</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00ff41] tracking-[0.2em] uppercase" style={{ textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
              EXEC_LOG
            </h2>
          </div>
          <div className="ml-auto flex gap-1 mb-2 hidden sm:flex">
            <span className="w-2 h-2 bg-[#ff0040] rounded-sm animate-pulse" />
            <span className="w-2 h-2 bg-[#ffcc00] rounded-sm animate-pulse" style={{ animationDelay: '200ms' }} />
            <span className="w-2 h-2 bg-[#00ff41] rounded-sm animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>

        <div className="relative">
          <div className="exp-path" />
          
          <div className="space-y-12">
            {experience.map((exp, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Node */}
                  <div className="absolute left-[24px] md:left-1/2 transform -translate-x-1/2 top-0 mt-6 z-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#020804] border-2 border-[#00ff41] rotate-45 shadow-[0_0_10px_#00ff41]" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="group relative border border-[#00ff41]/20 bg-[#040f06] p-6 hover:border-[#00ff41]/60 transition-all duration-300">
                      {/* Corner brackets */}
                      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center justify-between mb-4 border-b border-[#00ff41]/10 pb-3">
                        <div className="text-[10px] text-[#00ff41]/50 tracking-widest uppercase">
                          SECTOR: {exp.company}
                        </div>
                        <div className="text-[10px] bg-[#00ff41]/10 text-[#00ff41] px-2 py-0.5 border border-[#00ff41]/20 tracking-wider">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#00ff41] mb-3 flex items-center gap-2 group-hover:text-white transition-colors">
                        <ChevronRight size={16} className="text-[#00ff41]" />
                        {exp.title}
                      </h3>

                      <p className="text-sm text-[#00ff41]/70 leading-relaxed font-mono">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}