import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

export default function Experience({ data }) {
  return (
    <section className="relative px-6 py-24 text-left">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-16 justify-center text-center">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Briefcase size={20} />
          </div>
          <div className="text-left">
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Journey</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Work History</h2>
          </div>
        </div>

        {/* Timeline Pipeline */}
        <div className="relative">
          {/* Main timeline track with dual neon glow */}
          <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />

          <div className="space-y-12">
            {(data.experience || []).map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Neon timeline bullet point */}
                  <div className="absolute left-[18px] md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] z-10 w-3 h-3 rounded-full bg-cyan-400 border-2 border-gray-950 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

                  {/* Card Container */}
                  <div className={`w-full md:w-[46%] pl-12 md:pl-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                    <GlowingCard className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors duration-200">
                            {exp.role}
                          </h3>
                          <p className="text-cyan-400 font-semibold text-sm mt-0.5">{exp.company}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-gray-400 text-2xs font-bold tracking-wide whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      {/* Optional skills used */}
                      {exp.techStack && exp.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-500/5">
                          {exp.techStack.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded bg-indigo-500/5 text-cyan-300 text-[10px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </GlowingCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
