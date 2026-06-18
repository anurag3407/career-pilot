import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto">
      <motion.h3 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12 text-center text-orange-200"
      >
        Experience Journey
      </motion.h3>

      <div className="relative border-l-2 border-amber-900/40 pl-8 ml-4 md:ml-0 space-y-12">
        {experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-stone-900 border-2 border-amber-600 rounded-full" />
            
            <div className="bg-stone-800/40 p-6 rounded-xl border border-stone-700 hover:border-amber-700/50 transition-colors">
              <span className="text-amber-500 text-sm font-semibold tracking-wider uppercase mb-2 block">
                {exp.duration}
              </span>
              <h4 className="text-xl font-bold text-stone-100">{exp.role}</h4>
              <h5 className="text-lg text-orange-300/80 mb-4">{exp.company}</h5>
              <p className="text-stone-400 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
