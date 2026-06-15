import React from 'react';
import { Calendar } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn } from './shared';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-4 mb-16">
          <Calendar size={20} strokeWidth={1} className="text-zinc-400" />
          <h3 className="text-xl font-light uppercase tracking-widest">History</h3>
          <div className="flex-1 border-t border-zinc-200 ml-4"></div>
        </div>
      </FadeIn>

      <div className="relative border-l border-zinc-200 ml-2 md:ml-4 space-y-16 pb-4">
        {data.experience.map((job, index) => (
          <FadeIn key={index} delay={index * 0.1} className="relative pl-8 md:pl-16">
            <div className="absolute -left-[5px] top-2 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-white border border-zinc-900 rounded-none transform rotate-45" />
              <div className="absolute w-8 h-px bg-zinc-200 left-full"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
              <h4 className="text-2xl font-light text-zinc-900">{job.role}</h4>
              <span className="text-[11px] tracking-[0.1em] text-zinc-400 mt-2 md:mt-0 font-mono border border-zinc-200 px-3 py-1">{job.period}</span>
            </div>
            <div className="text-zinc-900 uppercase tracking-widest text-xs mb-6 font-medium">{job.company}</div>
            <p className="text-zinc-500 font-light leading-relaxed max-w-3xl">{job.description}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
