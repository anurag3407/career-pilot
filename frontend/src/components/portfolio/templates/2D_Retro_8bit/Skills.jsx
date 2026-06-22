import React, { useState } from "react";
import { Zap, Code, Terminal, Cpu } from "lucide-react";

export default function Skills({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  if (!skills || skills.length === 0) {
    return null;
  }

  // Extract unique categories
  const categories = ["All", ...new Set(skills.map((s) => s.category || "General"))];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => (s.category || "General") === activeCategory);

  return (
    <section id="skills" className="relative min-h-screen w-full bg-[#0c051a] py-20 px-4 sm:px-6 lg:px-8 border-b-8 border-black select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#1c0f3a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      
      <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Marquee */}
        <div className="w-full max-w-4xl bg-neutral-900 border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2 animate-bounce">
            <Zap className="w-8 h-8 text-[#ffde00] drop-shadow-[0_0_8px_#ffde00]" />
            <span className="font-retro-title text-[#ffde00] text-[10px] sm:text-xs bg-black px-3 py-1 border-2 border-[#ffde00]">
              POWER-UPS
            </span>
            <Zap className="w-8 h-8 text-[#ffde00] drop-shadow-[0_0_8px_#ffde00]" />
          </div>
          <h2 className="font-retro-title text-2xl sm:text-3xl md:text-4xl text-white tracking-wider my-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff007f] to-[#ffde00]" style={{ animation: "neon-glow-cyan 3s infinite" }}>
              SKILL TREE
            </span>
          </h2>
          <p className="font-retro-body text-lg md:text-2xl text-neutral-400 max-w-2xl uppercase tracking-wider mt-1">
            ACQUIRED ABILITIES & TECH STACK
          </p>
        </div>

        {/* Categories Control Panel */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mb-10 bg-neutral-900 border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000] relative">
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <span className="font-retro-title text-[9px] text-[#ffde00] mr-2">FILTER TYPE:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-retro-title text-[9px] px-3.5 py-2 border-2 border-black transition-all cursor-pointer relative
                  ${
                    activeCategory === cat
                      ? "bg-[#ff007f] text-white shadow-[2px_2px_0px_0px_#000000] translate-x-[2px] translate-y-[2px]"
                      : "bg-neutral-800 text-neutral-400 hover:text-white shadow-[4px_4px_0px_0px_#000000] hover:bg-neutral-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000]"
                  }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill, index) => {
            // Determine level tier (1 to 5 based on percentage)
            const levelNum = Math.ceil((skill.level || 50) / 20);
            return (
              <div
                key={index}
                className="flex flex-col bg-[#120a2a] border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:border-[#ffde00] transition-all relative overflow-hidden group"
              >
                {/* Top decorative stripe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-[#ff007f]" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-neutral-900 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                    <Code className="w-4 h-4 text-[#00f0ff]" />
                  </div>
                  <div className="bg-black border border-[#ff007f] px-2 py-1">
                    <span className="font-retro-title text-[8px] text-[#ff007f]">LVL {levelNum}</span>
                  </div>
                </div>

                <h3 className="font-retro-title text-sm text-white mb-2 tracking-wide group-hover:text-[#ffde00] transition-colors">
                  {skill.name}
                </h3>
                
                {/* Level Progress Bar */}
                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-retro-body text-sm text-neutral-400">MASTERY</span>
                    <span className="font-retro-body text-sm text-[#00f0ff]">{skill.level || 50}%</span>
                  </div>
                  <div className="h-2 w-full bg-black border border-neutral-700 p-[1px]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff007f]" 
                      style={{ width: `${skill.level || 50}%` }}
                    />
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
