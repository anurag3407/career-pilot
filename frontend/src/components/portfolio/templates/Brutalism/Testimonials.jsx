import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="border-4 border-black bg-blue-500 p-2 md:p-4 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black m-0">Testimonials</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((test, index) => (
          <div key={index} className="border-4 border-black p-6 bg-white relative pt-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 font-black text-2xl -mt-4 -ml-4 border-4 border-black">
              "{index + 1}
            </div>
            <p className="text-xl font-medium mb-6 italic">
              "{test.content || test.text}"
            </p>
            <div className="border-t-4 border-black pt-4">
              <h3 className="text-2xl font-black uppercase">{test.author || test.name}</h3>
              <p className="font-bold text-gray-600 uppercase">{test.role || test.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
