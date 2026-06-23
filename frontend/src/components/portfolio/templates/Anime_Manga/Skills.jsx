import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="relative w-full">
      {/* Decorative Title Badge */}
      <div className="absolute -top-6 -left-4 z-20 transform -rotate-3">
        <div className="bg-black text-white px-6 py-2 border-4 border-black manga-title text-3xl shadow-[4px_4px_0_white,-4px_-4px_0_white,4px_-4px_0_white,-4px_4px_0_white]">
          SKILLS / ABILITIES
        </div>
      </div>

      <div className="manga-panel p-8 pt-12 relative overflow-hidden bg-white">
        {/* Background Action Lines for the section */}
        <div className="absolute top-0 right-0 w-64 h-full action-lines opacity-10" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="relative group">
              {/* Category Panel */}
              <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all h-full flex flex-col">
                <h3 className="text-xl font-black uppercase mb-4 border-b-4 border-black pb-2 flex items-center justify-between">
                  {skillGroup.category}
                  <span className="text-xs bg-black text-white px-2 py-1 ml-2 rounded-full">LVL {idx + 1}</span>
                </h3>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {skillGroup.items.map((item, itemIdx) => (
                    <span 
                      key={itemIdx} 
                      className="text-sm font-bold border-2 border-black px-3 py-1 bg-white hover:bg-black hover:text-white transition-colors cursor-default transform hover:scale-105"
                      style={{ transform: `rotate(${Math.random() * 4 - 2}deg)` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative Screentone Shadow underneath */}
              <div className="absolute inset-0 bg-black manga-screentone opacity-20 -z-10 translate-x-3 translate-y-3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
