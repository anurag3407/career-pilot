import React from "react";
import { Flag, Star, Target, ShieldAlert } from "lucide-react";

export default function Experience({ experience = [] }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="relative min-h-screen w-full bg-[#120a2a] py-20 px-4 sm:px-6 lg:px-8 border-b-8 border-black select-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,127,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(255,0,127,0.05)_2px,transparent_2px)] bg-[length:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* Header Marquee */}
        <div className="w-full max-w-4xl bg-neutral-900 border-4 border-black p-6 mb-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2 animate-bounce">
            <Flag className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
            <span className="font-retro-title text-[#00f0ff] text-[10px] sm:text-xs bg-black px-3 py-1 border-2 border-[#00f0ff]">
              CAMPAIGN MODE
            </span>
            <Flag className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
          </div>
          <h2 className="font-retro-title text-2xl sm:text-3xl md:text-4xl text-white tracking-wider my-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#ffde00] to-[#00f0ff]" style={{ animation: "neon-glow-cyan 3s infinite" }}>
              BATTLE HISTORY
            </span>
          </h2>
          <p className="font-retro-body text-lg md:text-2xl text-neutral-400 max-w-2xl uppercase tracking-wider mt-1">
            PAST MISSIONS AND ACHIEVEMENTS
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-8 md:before:left-1/2 before:w-2 before:bg-[#ff007f] before:border-x-2 before:border-black before:-translate-x-1/2">
          {experience.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className="relative flex items-center justify-between md:justify-normal w-full mb-12">
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 w-8 h-8 bg-[#ffde00] border-4 border-black rounded-full -translate-x-1/2 z-10 flex items-center justify-center shadow-[0_0_10px_#ffde00]">
                  <div className="w-2 h-2 bg-black rounded-full animate-ping" />
                </div>

                {/* Content Box */}
                <div className={`w-full ml-20 md:ml-0 md:w-5/12 ${isLeft ? 'md:pr-12 md:text-right md:mr-auto' : 'md:pl-12 md:ml-auto'}`}>
                  <div className="bg-neutral-900 border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all relative group">
                    {/* Stage Banner */}
                    <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                      <span className="font-retro-title text-[8px] bg-[#00f0ff] text-black px-2 py-1 border-2 border-black">
                        STAGE {index + 1}
                      </span>
                      <span className="font-retro-body text-sm text-[#ffde00] tracking-widest">
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="font-retro-title text-sm sm:text-base text-white mb-1 group-hover:text-[#ff007f] transition-colors uppercase">
                      {exp.role}
                    </h3>
                    <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                      <Target className="w-4 h-4 text-[#00f0ff]" />
                      <h4 className="font-retro-title text-[10px] text-neutral-400 uppercase">
                        {exp.company}
                      </h4>
                    </div>

                    <p className="font-retro-body text-lg text-neutral-300 leading-snug">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Timeline End Node */}
          <div className="relative flex items-center justify-start md:justify-center w-full mt-8">
            <div className="absolute left-8 md:left-1/2 w-12 h-12 bg-black border-4 border-[#00f0ff] -translate-x-1/2 z-10 flex items-center justify-center shadow-[0_0_15px_#00f0ff]">
              <ShieldAlert className="w-6 h-6 text-[#00f0ff] animate-pulse" />
            </div>
            <div className="w-full ml-20 md:ml-0 md:w-5/12 md:text-center mt-12 md:mt-16">
               <span className="font-retro-title text-[10px] text-[#00f0ff] tracking-widest uppercase">
                 AWAITING NEXT MISSION...
               </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
