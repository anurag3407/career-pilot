import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <>
      <style>{`
        .sb-body  { font-family: 'Patrick Hand', cursive; }
        .sb-hand  { font-family: 'Caveat', cursive; }
        .sb-marker{ font-family: 'Permanent Marker', cursive; }
      `}</style>
      <section className="relative w-full py-20 px-4 sm:px-8 bg-[#f5efe6] overflow-hidden sb-body"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(180,160,130,0.15) 27px, rgba(180,160,130,0.15) 28px),
            repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(180,160,130,0.10) 27px, rgba(180,160,130,0.10) 28px)
          `,
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
             <div className="inline-block mb-2 w-24 h-6 bg-blue-200/55 border border-blue-400/30 rounded-sm rotate-2" />
             <h2 className="sb-marker text-5xl sm:text-6xl text-[#2d1f0e] rotate-[1deg] inline-block leading-none absolute left-1/2 -translate-x-1/2 -top-1">
               Experience
             </h2>
             <div className="h-1 w-[40%] bg-[#e05a3a] mx-auto mt-2 -rotate-[1deg] -skew-x-6 rounded" />
          </div>

          <div className="relative space-y-12">
            {/* Thread line connecting them */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-[#d4b896] border-l border-dashed border-[#c4a882]" />
            
            {experience.map((exp, i) => {
              const isEven = i % 2 === 0;
              const rotation = isEven ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]';
              const tapeColors = ['bg-rose-200/80', 'bg-emerald-200/80', 'bg-amber-200/80', 'bg-blue-200/80'];
              const tapeColor = tapeColors[i % tapeColors.length];

              return (
                <div key={i} className={`relative flex flex-col sm:flex-row items-center gap-8 ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-8 sm:left-1/2 w-4 h-4 bg-[#e05a3a] rounded-full border-2 border-[#2d1f0e] shadow-[2px_2px_0px_rgba(45,31,14,1)] -translate-x-[7px] sm:-translate-x-1/2 z-20" />
                  
                  {/* Content Card */}
                  <div className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${isEven ? 'sm:pr-12' : 'sm:pl-12'} relative`}>
                    <div className={`relative bg-[#fffdf5] p-6 shadow-[3px_5px_15px_rgba(0,0,0,0.1)] border-[1.5px] border-[#d4b896] transform ${rotation} hover:rotate-0 transition-transform duration-300`}>
                      
                      {/* Washi Tape */}
                      <div className={`absolute -top-3 ${isEven ? 'right-10' : 'left-10'} w-24 h-8 ${tapeColor} shadow-sm backdrop-blur-sm border border-black/10 z-20 mix-blend-multiply ${isEven ? 'rotate-3' : '-rotate-3'}`} />
                      
                      <div className="flex items-center justify-between mb-2 mt-2">
                        <h3 className="sb-marker text-2xl text-[#2d1f0e]">{exp.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[#4a3828] mb-4 sb-hand text-[22px] font-bold">
                        <span className="flex items-center gap-1"><Briefcase size={20} className="text-[#a07850]"/> {exp.company}</span>
                        <span className="flex items-center gap-1 text-[#e05a3a]"><Calendar size={20} /> {exp.startDate} - {exp.endDate}</span>
                      </div>
                      
                      <p className="sb-body text-[17px] text-[#4a3828] leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}