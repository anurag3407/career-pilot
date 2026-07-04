import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative w-full bg-gray-950 text-white py-24 px-6 md:px-16 overflow-hidden border-t border-white/5">
      <div className="relative max-w-4xl mx-auto md:ml-auto md:mr-auto pl-0 md:pl-12 border-l-0 md:border-l border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:-ml-12"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-3 pl-0 md:pl-12">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs tracking-widest uppercase">Career Track</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight pl-0 md:pl-12">
            Professional <span className="text-emerald-400">Experience</span>
          </h2>
        </motion.div>

        <div className="space-y-12">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group md:pl-12"
            >
              {/* Timeline dot */}
              <div className="hidden md:flex flex-col items-center absolute -left-[5px] top-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white/90">{exp.company}</h3>
                    <p className="text-emerald-400 font-medium mt-1">{exp.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 w-fit">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-mono tracking-wider">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-4">
                  {exp.description}
                </p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 mt-4 pt-4 border-t border-white/10">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-400">
                        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}