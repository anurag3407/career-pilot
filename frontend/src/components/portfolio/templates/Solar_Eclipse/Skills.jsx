import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Cloud, Palette } from 'lucide-react';

const categoryConfig = {
  Frontend: { icon: Code, glow: '#ff6a00', bar: 'from-orange-500 to-amber-400' },
  Backend: { icon: Server, glow: '#3b82f6', bar: 'from-blue-500 to-cyan-400' },
  DevOps: { icon: Cloud, glow: '#8b5cf6', bar: 'from-purple-500 to-violet-400' },
  Design: { icon: Palette, glow: '#ec4899', bar: 'from-pink-500 to-rose-400' },
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
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          Skills & <span className="text-orange-400">Expertise</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([category, categorySkills], catIndex) => {
            const config = categoryConfig[category] || categoryConfig.Frontend;
            const Icon = config.icon;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.6 }}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="p-2.5 rounded-lg bg-gray-800"
                    style={{ boxShadow: `0 0 12px 2px ${config.glow}30` }}
                  >
                    <Icon size={20} style={{ color: config.glow }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                </div>

                <div className="space-y-4">
                  {categorySkills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: catIndex * 0.1 + skillIndex * 0.06 + 0.3,
                            duration: 0.9,
                            ease: 'easeOut',
                          }}
                          className={`h-full rounded-full bg-gradient-to-r ${config.bar}`}
                          style={{
                            boxShadow: `0 0 8px 1px ${config.glow}40`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
