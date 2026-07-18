import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="border-4 border-black bg-pink-500 p-2 md:p-4 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black m-0">Skills_&_Arsenal</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="px-6 py-3 border-4 border-black bg-green-400 font-bold text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-green-400 transition-colors">
            {skill.name || skill}
          </div>
        ))}
      </div>
    </section>
  );
}
