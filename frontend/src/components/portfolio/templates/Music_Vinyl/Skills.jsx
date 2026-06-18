import React from 'react';
import { Radio, Disc3 } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="w-full bg-[#0a0502] text-amber-50 py-20 px-4 sm:px-8 md:px-12 lg:px-20 font-serif border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 text-amber-500 mb-12 justify-center">
          <Radio className="w-8 h-8" />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-amber-100">Sonic Spectrum</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return (
              <div key={i} className="group bg-[#1a110a] p-6 rounded-xl border border-amber-900/40 shadow-xl hover:border-amber-500/50 transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-900/10 rounded-bl-full -z-0 group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <Disc3 className="w-8 h-8 text-amber-600/70 group-hover:text-amber-400 group-hover:animate-[spin_4s_linear_infinite] transition-colors" />
                    <span className="text-xs font-mono text-orange-500/50">CH {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-100 mb-2 truncate" title={skillName}>{skillName}</h3>
                  
                  {/* Equalizer visual instead of normal progress bar */}
                  <div className="flex items-end space-x-1 h-8 mt-6 opacity-70 group-hover:opacity-100 transition-opacity">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      // Generate a pseudo-random height based on index and skill name length
                      const height = Math.max(30, ((skillName.length * 7 + idx * 13) % 100));
                      return (
                        <div 
                          key={idx} 
                          className="w-full bg-gradient-to-t from-amber-900 to-amber-500 rounded-t-sm" 
                          style={{ 
                            height: `${height}%`,
                            transition: 'height 0.3s ease'
                          }}
                        ></div>
                      );
                    })}
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