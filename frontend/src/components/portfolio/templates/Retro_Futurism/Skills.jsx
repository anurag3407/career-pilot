import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl border border-cyan-500/30 p-8 bg-slate-950/80 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <SectionHeading><Code2 size={36} className="text-cyan-500" /> Tech Stack</SectionHeading>
      <div className="flex flex-wrap gap-4 mt-2">
        {data.skills.map((skill) => (
          <motion.div key={skill.id ?? skill.name} whileHover={{ y: -3 }} className="px-4 py-2 bg-slate-900/80 border border-cyan-500/50 text-cyan-400 rounded cursor-default transition-colors hover:bg-pink-500/20">
            {skill.name}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
