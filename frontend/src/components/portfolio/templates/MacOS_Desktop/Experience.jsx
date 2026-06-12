import React from 'react';
export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section className={`py-16 px-6 ${"bg-black/20"} bg-opacity-50`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={i} className="border border-white/10 p-6 rounded-xl bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold">{exp.title} <span className="opacity-70">@ {exp.company}</span></h3>
              <p className="text-sm opacity-60 mb-4">{exp.startDate} - {exp.endDate}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}