import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import SectionHeading from './SectionHeading';

const SEC = "relative z-10 py-24 px-4";

export default function Experience() {
  const { experience } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className={SEC}>
      <div className="max-w-3xl mx-auto">
        <SectionHeading>Experience</SectionHeading>
        <div ref={ref} className="relative space-y-8">
          {/* Center spine */}
          <motion.div
            className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent pointer-events-none hidden sm:block"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2 }}
          />

          {(experience || []).map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={`relative flex flex-col sm:flex-row items-start sm:justify-between ${isEven ? "sm:flex-row-reverse" : ""}`}
              >
                {/* Spine node */}
                <div className="absolute left-1/2 w-3 h-3 rounded-full bg-slate-950 border-2 border-indigo-400 -translate-x-1.5 mt-6 z-20 hidden sm:block"
                  style={{ boxShadow: "0 0 10px rgba(99,102,241,0.6)" }} />

                <motion.div
                  whileHover={{ borderColor: "rgba(99,102,241,0.25)", backgroundColor: "rgba(15,23,42,0.65)" }}
                  className="w-full sm:w-[calc(50%-24px)] p-6 bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-2xl group transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
                    <Calendar size={12} /> {exp.period}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{exp.role}</h3>
                  <h4 className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5 mb-4">
                    <Briefcase size={12} /> {exp.company}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}