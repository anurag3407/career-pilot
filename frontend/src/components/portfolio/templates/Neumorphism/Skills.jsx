import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-700 tracking-wide">
          Skills & Expertise
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] transition-all duration-300 cursor-default"
            >
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}