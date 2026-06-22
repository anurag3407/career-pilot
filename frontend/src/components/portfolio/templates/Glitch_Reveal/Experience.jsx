import React from 'react';
import { Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      {/* The timeline layout uses a center rail and alternating content blocks. */}
      <div className="flex items-center gap-4 mb-12">
        <Briefcase className="text-cyan-400 animate-pulse" />
        <GlitchText text="Timeline" as="h2" className="text-4xl font-bold text-white" />
      </div>
      {/* The pseudo-element draws the vertical timeline line without extra markup. */}
      <div className="space-y-12 pl-4 md:pl-0 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:left-0 md:before:right-0 before:w-0.5 before:bg-zinc-800">
        {data.experience.map((exp, idx) => (
          <div key={idx} className="relative flex flex-col md:flex-row justify-between items-center group">
            {/* The node marks each experience entry on the timeline rail. */}
            <div className="absolute left-[-21px] md:left-1/2 md:-ml-[7px] w-4 h-4 rounded-full bg-zinc-950 border-2 border-cyan-500 group-hover:border-fuchsia-500 group-hover:bg-fuchsia-500 group-hover:shadow-[0_0_15px_#d946ef] transition-all z-10" />
            <div className="md:w-[45%] pl-8 md:pl-0 md:text-right md:pr-12 w-full mb-4 md:mb-0">
              <h4 className="text-xl font-bold text-white uppercase tracking-wider vibrate-hover inline-block cursor-crosshair group-hover:text-fuchsia-400 transition-colors">{exp.company}</h4>
              <div className="text-cyan-500 font-mono text-sm mt-1">{exp.period}</div>
            </div>
            <div className="md:w-[45%] pl-8 md:pl-12 w-full">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{exp.role}</h3>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
