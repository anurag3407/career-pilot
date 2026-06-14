import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t-2 border-[#2b2b2b] bg-[#f4f1ea] text-[#2b2b2b] font-serif">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black uppercase border-y-2 border-[#2b2b2b] py-3 inline-block">Public Endorsements</h2>
        <p className="italic mt-3">What the citizens are saying about our featured talent</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <blockquote key={i} className="relative p-6 border-l-4 border-[#2b2b2b] bg-white bg-opacity-40 shadow-sm">
            <span className="absolute top-0 left-2 text-6xl text-[#2b2b2b] opacity-20 font-serif">"</span>
            <p className="text-lg text-justify mb-4 relative z-10 leading-relaxed italic">
              {t.content}
            </p>
            <footer className="text-right border-t border-dashed border-[#2b2b2b] pt-2 mt-4">
              <strong className="block uppercase tracking-wider font-sans text-sm">{t.author}</strong>
              <span className="text-sm italic">{t.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}