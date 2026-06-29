import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function ExperienceSection({ data, onChoice }) {
  const { experience } = data;

  const choices = [
    { label: 'Hear what my colleagues say', next: 'testimonials' },
    { label: 'Explore the projects I built', next: 'projects' },
    { label: 'Reach out and connect', next: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-indigo-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Chapter 4 — The Journey
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-8 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-7">
            <Briefcase size={16} className="text-violet-400" />
            <h2 className="text-xl font-bold text-white">Work Experience</h2>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-violet-800/50" />

            <div className="space-y-8">
              {experience.map((exp, i) => (
                <motion.div
                  key={i}
                  className="pl-10 relative"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.1 } }}
                >
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#0f0e17] border-2 border-violet-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  </div>

                  <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-semibold text-white text-base">{exp.role}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                      <Calendar size={11} />
                      {exp.period}
                    </div>
                  </div>

                  <p className="text-sm text-violet-300 mb-2">{exp.company}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.08 } }}
              whileHover={{ x: 6 }}
              onClick={() => onChoice(choice.next)}
              className="w-full flex items-center gap-3 text-left px-5 py-4 rounded-xl border border-violet-700/40 hover:border-violet-400/70 bg-violet-950/30 hover:bg-violet-900/40 text-violet-200 hover:text-white transition-all duration-200 group"
            >
              <ChevronRight size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="text-sm">{choice.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
