import React from 'react';
import { Zap } from 'lucide-react';

const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="comic-dots-skills" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.5" fill="black" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#comic-dots-skills)" />
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

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  const bgColors = ["bg-sky-400", "bg-red-500", "bg-yellow-400", "bg-green-400", "bg-purple-400", "bg-pink-400", "bg-orange-400"];

  return (
    <section id="skills" className="relative w-full overflow-hidden bg-white py-20 px-4 sm:px-8 border-b-4 border-black">
      <DotPattern />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-16 text-center">
          <div className="relative inline-block">
            <h2 className="relative z-10 text-5xl sm:text-7xl font-black uppercase text-black tracking-tighter rotate-1 drop-shadow-[6px_6px_0px_rgba(239,68,68,1)]">
              Super Powers
            </h2>
            <div className="absolute -bottom-2 right-0 w-full h-4 bg-sky-400 border-2 border-black rotate-1 -z-0" />
          </div>
          <div className="mt-6 -rotate-1">
            <SpeechBubble text="💥 Tools in my utility belt!" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {skills.map((skill, i) => {
            const randomRotate = i % 2 === 0 ? "rotate-2" : "-rotate-2";
            const color = bgColors[i % bgColors.length];
            return (
              <div 
                key={i} 
                className={`relative group transition-all duration-200 hover:scale-110 hover:z-20 ${randomRotate}`}
              >
                <div className={`${color} border-4 border-black px-6 py-4 flex items-center gap-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`}>
                  <Zap className="w-5 h-5 text-black" fill="currentColor" />
                  <span className="font-black text-black uppercase text-xl tracking-wider">
                    {skill.name || skill}
                  </span>
                  {skill.level && (
                    <span className="ml-2 bg-white text-black text-sm px-2 py-1 border-2 border-black font-black">
                      {skill.level}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}