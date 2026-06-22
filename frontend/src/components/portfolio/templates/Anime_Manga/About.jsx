import React from 'react';

export default function About({ data }) {
  if (!data?.personal?.about) return null;

  return (
    <section className="relative w-full">
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* 'Character Intro' Panel */}
        <div className="w-full md:w-1/3 bg-black text-white border-4 border-black p-6 relative overflow-hidden flex flex-col justify-center transform -skew-x-2">
          <div className="absolute inset-0 manga-screentone opacity-30 invert" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-black uppercase mb-2 manga-title text-shadow-[2px_2px_0_gray]">ORIGIN</h2>
            <h2 className="text-4xl font-black uppercase manga-title text-shadow-[2px_2px_0_gray]">STORY</h2>
          </div>
        </div>

        {/* Text content panel */}
        <div className="w-full md:w-2/3 border-4 border-black bg-white p-8 relative">
          {/* Decorative speech bubble arrow pointing left */}
          <div className="hidden md:block absolute top-1/2 -left-5 w-8 h-8 bg-white border-b-4 border-l-4 border-black transform -translate-y-1/2 rotate-45" />
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-bold leading-relaxed whitespace-pre-line">
              {data.personal.about}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
