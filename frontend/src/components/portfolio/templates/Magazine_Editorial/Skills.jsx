import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

function SectionLabel({ children }) {
  return (
    <p className="text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#C41E3A]">
      {children}
    </p>
  );
}

export default function Skills({ skills }) {
  const rootRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, margin: '-80px' });

  if (!skills || skills.length === 0) return null;

  // Group skills if possible, else chunk them visually
  const categories = ['Frontend', 'Backend', 'Design', 'Tools', 'Languages', 'Other'];
  let grouped = categories.map(cat => ({ category: cat, items: [] }));
  let ungrouped = [];

  skills.forEach(skill => {
    let placed = false;
    for (let g of grouped) {
      if (skill.category === g.category) {
        g.items.push(skill);
        placed = true;
        break;
      }
    }
    if (!placed) ungrouped.push(skill);
  });

  if (ungrouped.length > 0) {
    grouped.push({ category: 'Core Competencies', items: ungrouped });
  }

  const validGroups = grouped.filter(g => g.items.length > 0);

  return (
    <section
      ref={rootRef}
      className="bg-[#1a1a1a] text-[#f5f0e8] overflow-hidden border-b border-white/10"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <div className="px-6 md:px-16 pt-16 pb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
          className="flex items-center gap-4 mb-12"
        >
          <SectionLabel>Toolkit & Capabilities</SectionLabel>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-white/40 border border-white/20 px-2.5 py-1">
            Technical
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {validGroups.map((group, groupIdx) => (
            <motion.div
              key={group.category}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.1 + groupIdx * 0.1}
            >
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-[0.45rem] font-black uppercase tracking-[0.3em] text-[#C41E3A] shrink-0 mt-0.5">
                  {String(groupIdx + 1).padStart(2, '0')}
                </span>
                <h3
                  className="text-white leading-tight border-b border-white/10 pb-3 w-full"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                    fontWeight: 700,
                    fontStyle: 'italic',
                  }}
                >
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {group.items.map((skill, i) => (
                  <span
                    key={i}
                    className="group border border-white/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white hover:border-[#C41E3A] transition-colors duration-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}