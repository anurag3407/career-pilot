import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  const { skills } = data;

  // Group skills by category
  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <section id="skills" className="py-24 bg-[#004b63] text-white overflow-hidden relative">
      {/* Animated Bubbles for background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-white/30"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#ff7f50] font-mono font-bold tracking-widest uppercase mb-4 block"
          >
            Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            My <span className="text-[#a3e635]">Tech Stack</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: catIdx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
              className="bg-[#001f2d]/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-8 text-[#ff7f50] flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#ff7f50]/20 flex items-center justify-center text-sm">0{catIdx + 1}</span>
                {category}
              </h3>
              
              <div className="space-y-6">
                {skills
                  .filter(skill => skill.category === category)
                  .map((skill, skillIdx) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-200">{skill.name}</span>
                        <span className="text-[#a3e635] font-mono">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + skillIdx * 0.1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#a3e635] to-[#4ade80]"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
