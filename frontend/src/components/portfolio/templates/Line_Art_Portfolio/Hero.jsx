import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn, WireframeCorners, AbstractLineArt } from './shared';

const HeroSection = () => {
  const { name, title, location } = data.personal;

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 relative">
      <div className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none hidden lg:block">
        <AbstractLineArt />
      </div>

      <FadeIn>
        <div className="inline-flex items-center gap-2 border border-zinc-200 px-4 py-1.5 text-[10px] uppercase tracking-widest text-zinc-500 mb-8 relative">
          <WireframeCorners />
          <MapPin size={12} strokeWidth={1} />
          {location}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter text-zinc-900 mb-4">{name}</h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h2 className="text-2xl md:text-4xl text-zinc-400 font-light tracking-wide max-w-2xl">{title}</h2>
      </FadeIn>

      <FadeIn delay={0.3} className="flex gap-6 mt-16">
        <a href="#projects" className="group relative px-8 py-3 border border-zinc-900 text-zinc-900 text-xs tracking-[0.2em] uppercase hover:bg-zinc-50 transition-colors">
          <WireframeCorners />
          <span className="flex items-center gap-2">View Projects <ArrowUpRight size={14} strokeWidth={1} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
        </a>
      </FadeIn>
    </section>
  );
};

export default HeroSection;
