import React from 'react';
import { motion } from 'framer-motion';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function Skills({ data }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="border-b border-black text-left">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>03 — Skills</Label>
        </div>

        <div className="md:col-span-9 px-5 md:px-12 py-8 md:py-12 space-y-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={ci}
              variants={fadeUp}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                {cat}
              </div>
              <div className="space-y-3">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill, si) => (
                    <div key={skill.name} className="flex items-center gap-4">
                      <span className="w-28 md:w-36 text-xs md:text-sm font-semibold text-black shrink-0">
                        {skill.name}
                      </span>
                      <div className="flex-1 relative" style={{ height: '2px', backgroundColor: '#e5e7eb' }}>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: si * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute inset-0 origin-left"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: ACCENT,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] font-black text-gray-400">
                        {skill.level}
                      </span>
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
