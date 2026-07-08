import React from 'react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-700 tracking-wide">
          Experience
        </h2>
        <div className="space-y-10">
          {experience.map((exp, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-gray-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff]"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {exp.title}
                </h3>
                <span className="text-gray-500 font-semibold mt-2 md:mt-0 py-2 px-4 rounded-full bg-gray-100 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-lg font-medium text-blue-600 mb-4">
                {exp.company}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}