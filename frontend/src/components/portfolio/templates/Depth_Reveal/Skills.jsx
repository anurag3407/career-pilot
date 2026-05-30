import React from 'react';
import { motion } from 'framer-motion';

const Skills = ({ skills = [] }) => (
  <section className="relative max-w-4xl mx-auto py-8 sm:py-10 md:py-20 px-5 md:px-6 overflow-hidden">
    <motion.h2
      initial={{ opacity: 0, y: 24, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.7 }}
      className="text-3xl font-bold mb-4 md:mb-10 text-center"
      style={{ transformPerspective: 900 }}
    >
      Tech Stack
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.06 }}
      className="text-center text-slate-400 max-w-2xl mx-auto mb-6 md:mb-10"
    >
      Core technologies with proficiency and category context, designed for quick recruiter scan.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5"
    >
      {skills.map((skill) => {
        const parsedLevel = Number(skill?.level);
        const clampedLevel = Number.isFinite(parsedLevel) ? Math.min(100, Math.max(0, parsedLevel)) : 0;

        return (
          <motion.div
            key={`${skill?.name || 'skill'}-${skill?.category || 'general'}`}
            variants={{ hidden: { opacity: 0, y: 24, scale: 0.78, rotateX: 16 }, show: { opacity: 1, y: 0, scale: 1, rotateX: 0 } }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-3 md:p-5 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-[0_0_0_1px_rgba(34,211,238,0.06)]"
            style={{ transformPerspective: 800 }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-cyan-300 font-semibold">{skill?.name}</p>
                <p className="text-slate-500 text-xs mt-1">{skill?.category}</p>
              </div>
              <span className="text-indigo-300 text-sm font-semibold">{clampedLevel}%</span>
            </div>

            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${clampedLevel}%` }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500"
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </section>
);

export default Skills;
