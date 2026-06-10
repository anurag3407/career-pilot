import React from 'react';
import { User } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn, WireframeCorners } from './shared';

const AboutSection = () => {
  const { bio, avatar } = data.personal;
  const { yearsExperience, projectsCompleted, happyClients } = data.stats;

  return (
    <section id="about" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-4 mb-16">
          <User size={20} strokeWidth={1} className="text-zinc-400" />
          <h3 className="text-xl font-light uppercase tracking-widest">About</h3>
          <div className="flex-1 border-t border-zinc-200 ml-4"></div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <FadeIn delay={0.1} className="md:col-span-5 relative">
          <div className="relative p-4 border border-zinc-200 aspect-square flex items-center justify-center">
            <WireframeCorners />
            <div className="absolute top-2 left-2 text-[10px] text-zinc-400 font-mono">IMG_SRC</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400 font-mono">1:1 RATIO</div>

            <div className="w-full h-full border border-zinc-100 p-2">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </FadeIn>

        <div className="md:col-span-7 flex flex-col justify-center">
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-500 leading-loose font-light mb-16">{bio}</p>
          </FadeIn>

          <div className="grid grid-cols-3 gap-8 border-t border-zinc-200 pt-8 relative">
            <WireframeCorners />
            <FadeIn delay={0.3}>
              <div className="text-4xl font-light text-zinc-900 mb-2">{yearsExperience}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">Years Exp</div>
            </FadeIn>
            <FadeIn delay={0.4} className="border-l border-zinc-200 pl-8">
              <div className="text-4xl font-light text-zinc-900 mb-2">{projectsCompleted}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">Projects</div>
            </FadeIn>
            <FadeIn delay={0.5} className="border-l border-zinc-200 pl-8">
              <div className="text-4xl font-light text-zinc-900 mb-2">{happyClients}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">Clients</div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
