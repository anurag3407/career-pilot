import React from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section className="py-20 px-6 font-mono border-t border-foreground/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 uppercase tracking-widest border-b border-foreground/20 pb-4">
          // Experience
        </h2>
        <div className="space-y-12">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-8 border-l border-foreground/20">
              <div className="absolute w-3 h-3 bg-background border border-foreground/50 -left-[6.5px] top-1.5" />
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                <h3 className="text-lg font-bold">
                  {exp.title} <span className="opacity-60 font-normal">@ {exp.company}</span>
                </h3>
                <span className="text-sm opacity-60 font-mono mt-1 md:mt-0">
                  [{exp.startDate} - {exp.endDate}]
                </span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed mt-4">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}