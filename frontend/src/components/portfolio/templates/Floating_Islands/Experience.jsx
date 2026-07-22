import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar } from 'lucide-react';

export default function Experience({ experience }) {
  return (
    <section id="experience" className="relative py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto"
      >
        {/* Island container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-8 py-12 md:px-14 md:py-14 shadow-2xl shadow-sky-200/40 border border-white/60">
          {/* Island bottom */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-b from-amber-100 to-amber-300 rounded-b-[60%] opacity-50" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-green-200 to-green-400 rounded-b-[50%] opacity-40" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center">
            Experience
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-sky-200" />

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={`${exp.company}-${exp.period}`}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative pl-12 md:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-4.5 top-1 w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-white shadow-md" />

                  <div className="p-5 rounded-xl bg-gradient-to-br from-sky-50/80 to-white border border-sky-100/60">
                    <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 mb-3">
                      <span className="inline-flex items-center gap-1 text-sm text-sky-600 font-medium">
                        <Building2 size={14} />
                        {exp.company}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                        <Calendar size={14} />
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
