import React from 'react';

export default function Hero({ data }) {
  if (!data?.personal) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between min-h-[400px] w-full relative">
      {/* Dynamic Action Lines Background */}
      <div className="absolute inset-0 action-lines opacity-10 pointer-events-none" />

      {/* Hero Content Panel */}
      <div className="z-10 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-2xl transform -rotate-1">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter manga-title mb-4">
          {data.personal.name}
        </h1>
        <div className="bg-black text-white px-4 py-2 inline-block mb-6 transform rotate-2">
          <h2 className="text-2xl font-bold tracking-widest">{data.personal.title}</h2>
        </div>
        <p className="text-xl font-bold leading-relaxed border-l-4 border-black pl-4">
          {data.personal.bio}
        </p>
      </div>

      {/* Decorative Manga Graphic / Text */}
      <div className="hidden md:flex flex-col items-center justify-center opacity-20 pointer-events-none transform rotate-90 md:rotate-0">
        <span className="text-[10rem] font-black leading-none manga-title writing-vertical tracking-widest">
          主人公
        </span>
      </div>
    </div>
  );
}
