import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

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

export default function Skills({ data }) {
  // Extract unique categories
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="relative px-6 py-24 text-left">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400">
            <Code2 size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Skills & Technologies</h2>
          </div>
        </div>

        {/* Bento-like Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, catIdx) => (
            <GlowingCard key={cat} className="p-6" delay={catIdx * 0.1}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-indigo-500/10">
                <h3 className="text-white font-bold text-lg">{cat}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-2xs uppercase font-extrabold tracking-widest">
                  Expertise
                </span>
              </div>
              <div className="space-y-4">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name} className="group/item">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-300 font-medium group-hover/item:text-cyan-300 transition-colors duration-200">
                          {skill.name}
                        </span>
                        <span className="text-cyan-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-950/75 border border-indigo-950/20 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
