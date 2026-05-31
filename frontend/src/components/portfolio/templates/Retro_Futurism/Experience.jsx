import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  return (
    <section className="p-8 rounded-xl border border-yellow-500/30 bg-slate-950/80 backdrop-blur-md shadow-[0_0_30px_rgba(234,179,8,0.15)]">
      <SectionHeading><Briefcase size={36} className="text-yellow-500" /> Execution Logs</SectionHeading>
      <div className="space-y-8 border-l-2 border-pink-500/50 ml-4 pl-8 relative">
        {data.experience.map((exp) => (
          <motion.div key={exp.id ?? `${exp.role}-${exp.company}-${exp.period}`} whileHover={{ x: 10 }} className="relative bg-slate-900/50 p-6 rounded-lg border border-slate-800 hover:border-pink-500/50 transition-colors">
            <div className="absolute -left-[45px] top-6 w-5 h-5 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,1)]" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-300">{exp.role}</h3>
            <div className="text-yellow-400 text-xs sm:text-sm font-bold mb-3 flex items-center gap-2 mt-1">
              <ChevronRight size={14} /> {exp.company} <span className="text-slate-500">|</span> {exp.period}
            </div>
            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
