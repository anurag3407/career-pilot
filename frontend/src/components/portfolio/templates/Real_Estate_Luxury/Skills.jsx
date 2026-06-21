import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

function getLevelPercent(level) {
  if (typeof level === 'number') {
    return Math.max(0, Math.min(100, level));
  }

  const normalized = String(level || '').toLowerCase();
  const levelMap = {
    expert: 90,
    advanced: 80,
    intermediate: 65,
    beginner: 40,
  };

  return levelMap[normalized] || 60;
}

export default function Skills({ data }) {
  return (
    <section className="bg-[#0A0A0F] px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-14 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">02 / EXPERTISE</p>
          <h2
            className="font-serif text-4xl font-light text-[#F5F0E8] md:text-6xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Core Competencies
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(data.skills || []).map((skill, index) => {
            const percent = getLevelPercent(skill?.level);

            return (
              <motion.div
                key={`${skill?.name}-${skill?.category}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.05, ease }}
                whileHover={{ y: -4 }}
                className="group border border-[#C9A96E]/20 bg-[#111118] p-6 transition-all duration-300 hover:border-[#E8D5A3]/70"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
                  {skill?.category}
                </p>
                <h3
                  className="font-serif text-2xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {skill?.name}
                </h3>
                <div className="mt-7 h-px w-full bg-[#1E1E2A]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-px bg-gradient-to-r from-[#8B6F3A] via-[#C9A96E] to-[#E8D5A3]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
