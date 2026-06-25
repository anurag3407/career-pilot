import React from 'react';

export default function About({ data }) {
  if (!data || !data.personal || !data.personal.about) return null;

  return (
    <section className="py-24 px-6 bg-white text-gray-900 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">About Me</h2>
        <div className="w-12 h-px bg-gray-300 mx-auto mb-12"></div>
        <p className="text-lg text-gray-500 font-light leading-relaxed text-justify md:text-center">
          {data.personal.about}
        </p>
      </div>
    </section>
  );
}
