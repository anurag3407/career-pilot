import React from 'react';
import { Code } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn } from './shared';

const SkillsSection = () => {
  return (
    <section id="skills" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-4 mb-16">
          <Code size={20} strokeWidth={1} className="text-zinc-400" />
          <h3 className="text-xl font-light uppercase tracking-widest">Expertise</h3>
          <div className="flex-1 border-t border-zinc-200 ml-4"></div>
        </div>
      </FadeIn>

      <div className="flex flex-wrap gap-4">
        {data.skills.map((skill, index) => (
          <FadeIn key={index} delay={index * 0.05}>
            <div className="relative border border-zinc-200 px-6 py-3 hover:border-zinc-500 transition-colors duration-300 flex items-center gap-4 group cursor-crosshair">
              <div className="absolute -top-[5px] -left-[5px] text-zinc-300 opacity-0 group-hover:opacity-100">+</div>
              <div className="absolute -bottom-[5px] -right-[5px] text-zinc-300 opacity-0 group-hover:opacity-100">+</div>
              <span className="text-sm font-light text-zinc-700">{skill.name}</span>
              <div className="w-px h-3 bg-zinc-200"></div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">{skill.category}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
