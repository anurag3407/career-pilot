import React from 'react';
import { motion } from 'framer-motion';
import { Crystal } from './Crystal';
import { AnimatedHeading } from './AnimatedHeading';

export default function Skills({ skills = [] }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const safeSkills = Array.isArray(skills) ? skills : [];
  if (safeSkills.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-slate-900/20">
      <Crystal className="top-20 right-1/4" size="w-32 h-32" duration={6} delay={2} color="from-indigo-500/20 via-blue-500/10 to-purple-500/10" />
      <Crystal className="-bottom-16 left-1/4" size="w-48 h-48" duration={8} delay={1} color="from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="Skills" gradientClass="from-indigo-300 to-indigo-500" lineClass="bg-indigo-400" />
        <div className="flex flex-wrap gap-4">
          {safeSkills.map((skill, index) => (
            <motion.div 
              key={skill.name || index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="px-6 py-3 bg-slate-950/80 border border-indigo-500/20 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-3"
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              />
              <span className="font-medium text-slate-200">{skill.name}</span>
              <span className="text-xs text-indigo-300 px-2 py-1 bg-indigo-950 rounded-md border border-indigo-500/30">{skill.level}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}