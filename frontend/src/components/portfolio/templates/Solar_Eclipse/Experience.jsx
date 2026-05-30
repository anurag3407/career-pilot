import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar } from 'lucide-react';

export default function Experience({ experience }) {
  return (
    <section id="experience" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          Work <span className="text-orange-400">Experience</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/60 via-orange-400/30 to-transparent"
            style={{ boxShadow: '0 0 8px 1px #ff6a0030' }}
          />

          <div className="space-y-10">
            {experience.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${exp.period}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                className="relative pl-12 md:pl-16"
              >
                {/* Glowing node */}
                <div className="absolute left-2.5 md:left-4.5 top-2 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-gray-950"
                  style={{ boxShadow: '0 0 10px 3px #ff6a0050' }}
                />

                <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 text-sm text-orange-400 font-medium">
                      <Building2 size={14} />
                      {exp.company}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
