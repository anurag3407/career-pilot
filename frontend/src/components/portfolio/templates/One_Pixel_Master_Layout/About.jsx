import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const About = () => {
  const { personal } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
        OBJ_ID: ABOUT_02
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-white tracking-widest">About</h2>
        <div className="flex-1 h-px bg-[#333]"></div>
      </div>
      <div className="border border-[#333] p-6 bg-[#0a0a0a] hover:border-green-500/50 transition-colors duration-500 group">
        <p className="text-[#a0a0a0] leading-relaxed text-sm md:text-base font-mono whitespace-pre-line group-hover:text-[#c0c0c0] transition-colors">
          {personal.bio}
        </p>
      </div>
    </section>
  );
};

export default About;
