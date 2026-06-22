import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Cloud, Palette } from 'lucide-react';

const categoryIcons = {
  Frontend: Code,
  Backend: Server,
  DevOps: Cloud,
  Design: Palette,
};

const categoryColors = {
  Frontend: { bg: 'bg-sky-100', text: 'text-sky-700', bar: 'bg-sky-400' },
  Backend: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-400' },
  DevOps: { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-400' },
  Design: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-400' },
};

export default function Skills({ skills }) {
  const grouped = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section id="skills" className="relative py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto"
      >
        {/* Island container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-8 py-12 md:px-14 md:py-14 shadow-2xl shadow-sky-200/40 border border-white/60">
          {/* Island bottom */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-b from-amber-100 to-amber-300 rounded-b-[60%] opacity-50" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-gradient-to-b from-green-200 to-green-400 rounded-b-[50%] opacity-40" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center">
            Skills & Expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(grouped).map(([category, categorySkills], catIndex) => {
              const Icon = categoryIcons[category] || Code;
              const colors = categoryColors[category] || categoryColors.Frontend;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1, duration: 0.6 }}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon size={18} className={colors.text} />
                    </span>
                    <h3 className="font-semibold text-slate-700 text-lg">{category}</h3>
                  </div>

                  <div className="space-y-3">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIndex * 0.1 + skillIndex * 0.05, duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-600">{skill.name}</span>
                          <span className="text-xs text-slate-400">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 + 0.3, duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${colors.bar}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
