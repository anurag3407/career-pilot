import React from 'react';

const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="comic-dots-exp" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.5" fill="black" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#comic-dots-exp)" />
  </svg>
);

const SpeechBubble = ({ text }) => (
  <div className="relative inline-block">
    <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black text-black uppercase text-lg tracking-widest shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
      {text}
    </div>
    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[14px] border-l-transparent border-t-[18px] border-t-black border-r-[0px] border-r-transparent" />
    <div className="absolute -bottom-[13px] left-[35px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[14px] border-t-white border-r-[0px] border-r-transparent" />
  </div>
);

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  const bgColors = ["bg-sky-400", "bg-pink-400", "bg-yellow-400", "bg-green-400"];

  return (
    <section id="experience" className="relative w-full overflow-hidden bg-red-500 py-20 px-4 sm:px-8 border-b-4 border-black">
      <DotPattern />
      <div className="relative max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-16 text-center">
          <div className="relative inline-block">
            <h2 className="relative z-10 text-5xl sm:text-7xl font-black uppercase text-white tracking-tighter -rotate-2 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              Origin Story
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-400 border-2 border-black -rotate-1 -z-0" />
          </div>
          <div className="mt-6 rotate-2">
            <SpeechBubble text="📅 The Adventures So Far..." />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {experience.map((exp, i) => {
            const isLeft = i % 2 === 0;
            const color = bgColors[i % bgColors.length];
            return (
              <div 
                key={i} 
                className={`relative flex flex-col md:flex-row gap-6 items-center ${isLeft ? '' : 'md:flex-row-reverse'}`}
              >
                <div className={`w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isLeft ? 'rotate-1' : '-rotate-1'} transition-transform hover:scale-[1.02] z-10 p-0 flex flex-col`}>
                  <div className={`${color} border-b-4 border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                    <div>
                      <h3 className="font-black text-black uppercase text-2xl tracking-tight">
                        {exp.title}
                      </h3>
                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-sm mt-1">
                        @ {exp.company}
                      </h4>
                    </div>
                    <span className="bg-black text-white font-black px-4 py-2 uppercase text-sm border-2 border-black whitespace-nowrap -rotate-2">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-base font-bold text-gray-800 leading-relaxed whitespace-pre-line">
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
  );
}