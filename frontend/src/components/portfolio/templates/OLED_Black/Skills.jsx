import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { fadeUp, staggerContainer, SectionHeading } from './shared';

const Skills = ({ skills }) => (
  <section className="py-24">
    <SectionHeading title="Capabilities" icon={Terminal} />
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-4">
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            borderColor: 'rgba(34, 211, 238, 0.5)',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
          }}
          className="flex cursor-default items-center gap-3 rounded-none border border-gray-800 bg-black px-5 py-3 text-gray-300 transition-all"
        >
          <span className="font-mono text-xs text-cyan-400 opacity-70">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-medium tracking-wide">{skill.name}</span>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Skills;