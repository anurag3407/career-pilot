import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="py-20 px-6 font-mono border-t border-foreground/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 uppercase tracking-widest border-b border-foreground/20 pb-4">
          // Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <div 
              key={i} 
              className="px-4 py-3 border border-foreground/20 text-center hover:bg-foreground hover:text-background transition-colors duration-200 cursor-default"
            >
              <span className="text-sm tracking-wider">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}