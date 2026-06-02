import React from 'react';
import { History, Disc } from 'lucide-react';

export default function Experience({ data }) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-4">
        <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> INDEX: 05_HISTORY</span>
        <span className="text-cyan-400">PLAY: 0:10:15</span>
      </div>

      {/* Experience Scroll Timeline */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
        {data.experience.map((exp, idx) => (
          <div
            key={idx}
            className="bg-[#121319] p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row gap-3 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            {/* Spinning Tape Gear Icon representation */}
            <div className="md:w-32 shrink-0 flex md:flex-col justify-between items-start md:items-stretch gap-1 md:border-r border-gray-800 md:pr-3">
              <span className="text-xs font-bold text-pink-500 select-text">{exp.period}</span>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-bold">
                <Disc className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>REEL A-{idx + 1}</span>
              </div>
            </div>

            {/* Description Details */}
            <div className="flex-1">
              <h3 className="text-sm font-black text-white uppercase select-text">{exp.role}</h3>
              <h4 className="text-xs font-bold text-cyan-400 uppercase select-text">{exp.company}</h4>
              <p className="mt-2 text-xs text-gray-300 leading-relaxed font-sans select-text">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-4 text-right">
        INDEX SEARCHING ENABLED: FF/REW FIND RATIO 20:1
      </div>
    </div>
  );
}
