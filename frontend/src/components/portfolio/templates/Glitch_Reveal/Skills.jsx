import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      {/* Each skill row animates its width when it scrolls into view. */}
      <div className="flex items-center gap-4 mb-12">
        <Code className="text-cyan-400 animate-pulse" />
        <GlitchText text="Tech_Stack" as="h2" className="text-4xl font-bold text-white" />
      </div>
      {/* Two columns on larger screens keep the list compact and readable. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.skills.map((skill, idx) => (
          <div key={idx} className="group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between mb-2">
              <span className="text-zinc-300 font-mono uppercase text-sm group-hover:text-cyan-400 transition-colors">{skill.name}</span>
              <span className="text-cyan-500 font-mono text-sm group-hover:text-fuchsia-500 transition-colors">{skill.level}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 relative">
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-[200%] animate-[scan_2s_linear_infinite]" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
