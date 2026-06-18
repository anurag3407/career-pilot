import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t-4 border-[#2b2b2b] bg-[#f4f1ea] text-[#2b2b2b] font-serif">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 border-b-2 border-[#2b2b2b] pb-2">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Areas of Expertise</h2>
        <span className="text-sm uppercase tracking-widest mt-4 md:mt-0">Certified Proficiencies</span>
      </div>
      
      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {skills.map((skill, i) => (
          <div key={i} className="break-inside-avoid border-2 border-[#2b2b2b] p-3 text-center bg-[#eae5d8] shadow-[4px_4px_0px_#2b2b2b] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_#2b2b2b] transition-all cursor-default">
            <h3 className="font-bold text-xl uppercase tracking-wider">{skill.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}