import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

export default function Skills({ data }) {
  // Group skills by category dynamically
  const categories = data.skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const [activeCategory, setActiveCategory] = useState(Object.keys(categories)[0] || 'Frontend');

  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-4">
        <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> INDEX: 03_SKILLS</span>
        <span className="text-cyan-400">PLAY: 0:04:45</span>
      </div>

      {/* Category selector VCR buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs font-bold rounded-md border transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#00f3ff] text-black border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.4)]'
                : 'bg-[#121319] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Dynamic LED VU Level Meters */}
      <div className="flex-1 flex flex-col justify-center gap-3 bg-[#121319] p-4 rounded-xl border border-cyan-500/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[300px]">
        {categories[activeCategory]?.map((skill, index) => {
          // Calculate number of active LED segments (max 15 segments)
          const totalSegments = 15;
          const activeSegments = Math.round((skill.level / 100) * totalSegments);

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs font-bold px-1 select-text">
                <span className="text-white">{skill.name}</span>
                <span className="text-pink-500">{skill.level}%</span>
              </div>
              
              {/* VU Meter Bar Layout */}
              <div className="flex items-center gap-1.5 bg-[#08080a] p-1.5 rounded border border-gray-900">
                <span className="text-[8px] text-gray-600 font-bold w-6 shrink-0">LEVEL</span>
                <div className="flex-1 flex gap-[3px]">
                  {Array.from({ length: totalSegments }).map((_, segmentIndex) => {
                    const isLit = segmentIndex < activeSegments;
                    
                    // Color segments: green for low, yellow for mid, red/pink for peak (standard VU meter colors)
                    let litColor = 'bg-[#10b981] shadow-[0_0_6px_#10b981]'; // Green
                    if (segmentIndex >= 9 && segmentIndex < 12) {
                      litColor = 'bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]'; // Yellow/Orange
                    } else if (segmentIndex >= 12) {
                      litColor = 'bg-[#ff0055] shadow-[0_0_8px_#ff0055]'; // Red Peak
                    }

                    const unlitColor = 'bg-gray-900 border border-gray-950';

                    return (
                      <div
                        key={segmentIndex}
                        className={`h-4 flex-1 rounded-sm transition-all duration-500 ${
                          isLit ? litColor : unlitColor
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-[8px] text-pink-500 font-bold w-6 text-right shrink-0">PEAK</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-4 text-right">
        LED DECAY: AUTO PEAK HOLD SYSTEM ENABLED
      </div>
    </div>
  );
}
