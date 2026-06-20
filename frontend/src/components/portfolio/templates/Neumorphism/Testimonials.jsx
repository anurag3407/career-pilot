import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-700 tracking-wide">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-gray-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] flex flex-col justify-between"
            >
              <div className="mb-6">
                <svg className="w-10 h-10 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z" />
                </svg>
                <p className="text-gray-600 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>
              <div className="mt-auto">
                <p className="text-xl font-bold text-gray-800">{t.author}</p>
                <p className="text-blue-600 font-medium">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}