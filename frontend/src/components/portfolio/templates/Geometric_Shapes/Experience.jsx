import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="relative w-full overflow-hidden bg-[#050816] py-24 px-6 sm:px-8 lg:px-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-fuchsia-100/90 backdrop-blur-md mb-6">
            <Briefcase size={14} className="text-fuchsia-300" />
            Experience
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-400 to-indigo-300">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-fuchsia-400/50 via-cyan-400/50 to-transparent md:-translate-x-1/2" />

          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative mb-12 flex flex-col md:flex-row gap-8 md:gap-0 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Node */}
              <div className="absolute left-[16px] md:left-1/2 w-6 h-6 rounded-sm bg-[#050816] border-2 border-fuchsia-400 md:-translate-x-1/2 rotate-45 z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-300 rounded-full" />
              </div>

              {/* Content Box */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0">
                <div className={`p-6 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all ${
                  index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                    <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-cyan-300 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                      <Calendar size={12} />
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-fuchsia-300 mb-4 uppercase tracking-widest flex items-center gap-2">
                    {exp.company}
                    {exp.location && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span className="text-slate-400">{exp.location}</span>
                      </>
                    )}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {exp.summary || exp.description}
                  </p>
                  
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <ChevronRight size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}