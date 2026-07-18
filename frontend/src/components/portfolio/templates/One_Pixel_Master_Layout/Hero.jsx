import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const Hero = () => {
  const { personal, socials } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="border border-[#333] p-8 bg-[#0a0a0a] relative overflow-hidden group hover:border-green-500/50 transition-colors duration-500">
        <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
          OBJ_ID: HERO_01
        </div>
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-[#333] p-1 shrink-0 group-hover:border-green-500/50 transition-colors duration-500">
              <img 
                src={personal.image || "https://github.com/identicons/onepixel.png"} 
                alt={personal.name}
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase text-white">
                {personal.name}
              </h1>
              <p className="text-green-500 text-sm md:text-base mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
                {personal.title}
              </p>
            </div>
          </div>
          
          <div className="border-t border-[#333] pt-6">
            <p className="text-[#a0a0a0] leading-relaxed text-sm md:text-base max-w-2xl">
              {personal.tagline || personal.bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-[#666] hover:text-green-400 hover:border-green-400 border border-[#333] px-4 py-2 transition-colors">
                [ GITHUB ]
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-[#666] hover:text-green-400 hover:border-green-400 border border-[#333] px-4 py-2 transition-colors">
                [ LINKEDIN ]
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-[#666] hover:text-green-400 hover:border-green-400 border border-[#333] px-4 py-2 transition-colors">
                [ TWITTER ]
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
