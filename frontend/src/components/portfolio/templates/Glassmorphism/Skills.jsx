import React from 'react';
export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span key={i} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}