import React from "react";
import { Cpu } from "lucide-react";

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-20 px-6 md:px-12 border-t border-cyan-500/20">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <Cpu className="text-pink-500" size={20} />
            <p className="tracking-[0.3em] text-pink-400 uppercase text-sm">
              Neural Upgrades
            </p>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white">
            System
            <span className="bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Capabilities
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] overflow-hidden"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 w-full h-[2px] bg-cyan-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>
                <span className="text-sm font-mono text-pink-400">
                  {skill.level}%
                </span>
              </div>
              
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full relative"
                  style={{ width: `${skill.level || Math.floor(Math.random() * 40) + 60}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
      `}</style>
    </section>
  );
}