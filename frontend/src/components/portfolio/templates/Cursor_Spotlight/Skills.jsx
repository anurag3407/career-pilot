import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const Skills = ({ skills }) => {
  return (
    <section className="relative z-10 mx-auto max-w-5xl py-24 px-6">
      <div className="mb-12 flex items-center gap-4">
        <Terminal className="text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Skills</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ 
              scale: 1.05, 
              textShadow: "0px 0px 8px rgb(59 130 246)",
              boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.5)"
            }}
            className="relative cursor-none overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 px-6 py-3 text-zinc-300 backdrop-blur-sm"
          >
            <span className="relative z-10 font-mono text-sm">{skill.name}</span>
            <motion.div 
              className="absolute inset-0 z-0 bg-blue-600/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ type: 'tween', ease: 'circOut' }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;