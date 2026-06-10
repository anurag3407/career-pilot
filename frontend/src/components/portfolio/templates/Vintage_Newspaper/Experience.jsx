import React from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t-4 border-double border-[#2b2b2b] bg-[#f4f1ea] text-[#2b2b2b] font-serif">
      <div className="text-center mb-8 border-b-2 border-[#2b2b2b] pb-4">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Professional Journey</h2>
        <p className="text-sm uppercase tracking-widest mt-2 border-t border-[#2b2b2b] pt-2 inline-block">Chronicles of Employment</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experience.map((exp, i) => (
          <article key={i} className={`flex flex-col ${i === 0 ? 'md:col-span-2 lg:col-span-2 border-r-0 md:border-r-2 border-[#2b2b2b] md:pr-8' : 'border-t-2 md:border-t-0 border-[#2b2b2b] pt-6 md:pt-0'}`}>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-2 uppercase">{exp.title}</h3>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 border-b border-[#2b2b2b] pb-2">
              <span className="font-sans font-bold text-lg uppercase tracking-wider">{exp.company}</span>
              <span className="text-sm italic">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-justify leading-relaxed text-lg first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-4px]">
              {exp.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}