import React from 'react';
export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5">
              <p className="italic mb-4">"{t.content}"</p>
              <p className="font-bold">— {t.author}, <span className="opacity-70">{t.role}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}