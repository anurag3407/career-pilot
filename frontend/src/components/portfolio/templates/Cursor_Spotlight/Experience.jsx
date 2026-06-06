import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Experience = ({ experience }) => {
  return (
    <section className="relative z-10 mx-auto max-w-4xl py-24 px-6">
      <div className="mb-12 flex items-center gap-4">
        <Briefcase className="text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Experience</h2>
      </div>
      <div className="relative border-l border-zinc-800 pl-8 md:pl-0 md:border-l-0">
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
        
        {experience.map((exp, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`mb-12 flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} justify-between items-center w-full`}
          >
            <div className="hidden md:block w-5/12" />
            
            <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 h-3 w-3 rounded-full bg-zinc-800 border-2 border-zinc-950 z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full w-full rounded-full bg-blue-500"
              />
            </div>

            <motion.div 
              whileHover={{ x: i % 2 === 0 ? -10 : 10, backgroundColor: "rgba(39, 39, 42, 0.8)" }}
              className="w-full md:w-5/12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md"
            >
              <span className="mb-2 block font-mono text-xs text-blue-500">{exp.period}</span>
              <h3 className="text-lg font-bold text-white">{exp.role}</h3>
              <h4 className="mb-4 text-sm font-medium text-zinc-400">{exp.company}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">{exp.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;