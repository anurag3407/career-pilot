import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const Skills = () => {
  const { skills } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
        OBJ_ID: SKILLS_03
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-white tracking-widest">Skills</h2>
        <div className="flex-1 h-px bg-[#333]"></div>
      </div>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <div key={i} className="border border-[#333] px-3 py-1.5 text-xs font-mono text-[#a0a0a0] hover:text-green-400 hover:border-green-400 bg-[#0a0a0a] transition-all duration-300">
            {skill.name} <span className="opacity-50 ml-1">[{skill.level}%]</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
