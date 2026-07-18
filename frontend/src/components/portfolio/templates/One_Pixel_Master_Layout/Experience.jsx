import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const Experience = () => {
  const { experience } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
        OBJ_ID: EXP_05
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-white tracking-widest">Experience</h2>
        <div className="flex-1 h-px bg-[#333]"></div>
      </div>
      
      <div className="border-l border-[#333] ml-2 flex flex-col gap-8">
        {experience.map((exp, i) => (
          <div key={i} className="relative pl-8 group">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 border border-[#333] bg-[#0a0a0a] group-hover:border-green-400 group-hover:bg-green-400/20 transition-colors"></div>
            <div className="absolute -left-6 top-3 w-4 h-px bg-[#333] group-hover:bg-green-400/50 transition-colors"></div>
            
            <div className="border border-[#333] p-6 bg-[#0a0a0a] group-hover:border-green-500/50 transition-colors duration-500">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">{exp.title}</h3>
                  <p className="text-green-500 text-sm">{exp.company}</p>
                </div>
                <div className="border border-[#333] px-3 py-1 text-xs text-[#a0a0a0] self-start uppercase">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
              <p className="text-[#a0a0a0] text-sm leading-relaxed whitespace-pre-line group-hover:text-[#c0c0c0] transition-colors">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
