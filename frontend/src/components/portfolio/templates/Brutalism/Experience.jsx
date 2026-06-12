import React from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="border-4 border-black bg-yellow-400 p-2 md:p-4 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black m-0">Experience</h2>
      </div>
      <div className="space-y-8">
        {experience.map((exp, index) => (
          <div key={index} className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-4 border-black pb-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold uppercase">{exp.role}</h3>
                <h4 className="text-xl font-bold text-red-600 bg-black inline-block px-2 py-1 mt-2">{exp.company}</h4>
              </div>
              <div className="mt-4 md:mt-0 px-3 py-1 border-2 border-black font-bold uppercase bg-blue-400">
                {exp.duration}
              </div>
            </div>
            <p className="text-lg font-medium leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
