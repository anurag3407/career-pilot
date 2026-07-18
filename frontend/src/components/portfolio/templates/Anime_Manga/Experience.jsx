import React from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative w-full">
      {/* Decorative Title Badge */}
      <div className="absolute -top-6 right-4 z-20 transform rotate-2">
        <div className="bg-white text-black px-6 py-2 border-4 border-black manga-title text-3xl shadow-[4px_4px_0_black]">
          QUEST LOG / EXP
        </div>
      </div>

      <div className="manga-panel p-8 pt-12 bg-black text-white relative">
        <div className="absolute inset-0 manga-screentone opacity-30 invert" />

        <div className="space-y-8 relative z-10">
          {experience.map((exp, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col md:flex-row gap-6 items-stretch ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Left/Right Action Panel */}
              <div className="flex-1 bg-white text-black border-4 border-white border-dashed p-1">
                <div className="bg-white border-4 border-black p-6 h-full flex flex-col justify-center transform transition-transform hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black uppercase tracking-wider">{exp.role}</h3>
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 rotate-3 border-2 border-white shadow-[0_0_0_2px_black]">
                      {exp.duration}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-4 italic">@ {exp.company}</h4>
                  
                  {Array.isArray(exp.description) ? (
                    <ul className="space-y-2 mb-4 list-none">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 mt-1">▶</span>
                          <span className="font-semibold leading-tight">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-semibold leading-tight mb-4">{exp.description}</p>
                  )}
                </div>
              </div>

              {/* Center Timeline Divider (Manga 'Gutter') */}
              <div className="hidden md:flex flex-col items-center justify-center w-12 relative">
                <div className="absolute h-full w-1 bg-white"></div>
                <div className="w-8 h-8 bg-black border-4 border-white rounded-full z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Decorative side panel (empty space for layout) */}
              <div className="flex-1 hidden md:block opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div className="w-full h-full border-4 border-white action-lines" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
