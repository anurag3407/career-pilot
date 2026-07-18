import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';

const Experience = ({ experience = [] }) => (
  <section className="relative max-w-4xl mx-auto py-8 sm:py-10 md:py-20 px-5 md:px-6 overflow-hidden">
    <motion.h2
      initial={{ opacity: 0, y: 24, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.75 }}
      className="text-3xl md:text-4xl font-bold mb-5 md:mb-12 text-center"
      style={{ transformPerspective: 900 }}
    >
      Experience
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.08 }}
      className="text-center text-slate-400 max-w-2xl mx-auto mb-6 md:mb-12"
    >
      A timeline of roles, impact, and responsibilities across product and engineering teams.
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="space-y-5 md:space-y-8 relative before:absolute before:left-3 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-cyan-500/50 before:to-indigo-500/30"
    >
      {experience.map((exp, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, x: -36, y: 24, scale: 0.94 }, show: { opacity: 1, x: 0, y: 0, scale: 1 } }}
          whileHover={{ x: 8, scale: 1.01 }}
          className="relative ml-10 md:ml-0 md:w-[48%] md:odd:mr-auto md:odd:pr-6 md:even:ml-auto md:even:pl-6"
        >
          <div className="absolute -left-9 top-5 md:left-auto md:-right-3 md:odd:-right-3 md:odd:left-auto md:even:-left-3 w-6 h-6 rounded-full border border-cyan-400/70 bg-slate-950 flex items-center justify-center">
            <BriefcaseBusiness size={12} className="text-cyan-300" />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5">
            <p className="text-xs uppercase tracking-wider text-cyan-300 mb-2">{exp.period}</p>
            <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
            <p className="text-indigo-300 mb-3">{exp.company}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Experience;
