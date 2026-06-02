import React from 'react';
import { MapPin, Film } from 'lucide-react';

export default function About({ data }) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-6">
        <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5" /> INDEX: 02_BIO</span>
        <span className="text-cyan-400">PLAY: 0:02:15</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto items-center">
        {/* VHS Shell Tape Spools / Avatar display */}
        <div className="flex flex-col items-center gap-3">
          {/* Avatar Container with scanlines and glitch effect */}
          <div className="relative group w-36 h-36 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-[#121319] p-1.5 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 opacity-50 z-10 pointer-events-none" />
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500 select-text"
            />
            {/* Scanlines overlay on image */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.08)_50%,transparent_50%)] bg-size-[100%_4px] pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
            <MapPin className="w-3.5 h-3.5 text-pink-500" />
            <span className="select-text">{data.personal.location}</span>
          </div>
        </div>

        {/* Bio Text Details in VHS Cassette label look */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#121319] p-4 rounded-xl border border-cyan-500/20 relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
            {/* Cassette label details styling */}
            <div className="absolute top-2 right-3 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
              T-120 PREMIUM QUALITY
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 tracking-wide uppercase border-b border-gray-800 pb-1">
              // PROFILE OVERVIEW
            </h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans select-text">
              {data.personal.bio}
            </p>
          </div>

          {/* Stats Bar styled like Tape Reels Counter */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#121319] p-3 rounded-lg border border-pink-500/20 text-center">
              <div className="text-lg font-black text-white select-text">{data.stats.yearsExperience}+</div>
              <div className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">YRS EXP</div>
            </div>
            <div className="bg-[#121319] p-3 rounded-lg border border-cyan-500/20 text-center">
              <div className="text-lg font-black text-white select-text">{data.stats.projectsCompleted}+</div>
              <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">PROJ COMPLETED</div>
            </div>
            <div className="bg-[#121319] p-3 rounded-lg border border-pink-500/20 text-center">
              <div className="text-lg font-black text-white select-text">{data.stats.happyClients}+</div>
              <div className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">CLIENTS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-6 text-right">
        MAGNETIC TAPE RECORDING PROCESS SYSTEM VER 1.2
      </div>
    </div>
  );
}
