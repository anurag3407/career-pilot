import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

export default function Skills() {
  const { portfolioData: data } = usePortfolio();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Group by category
  const categories = data.skills.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {});

  return (
    <section ref={sectionRef} style={{ background: F.surface, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Atelier</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>§ 02.5</span>
      </motion.div>

      <div className="px-5 md:px-16 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-xs font-black uppercase tracking-widest mb-12 text-center" style={{ color: F.gold }}>
          — Technical Repertoire
        </motion.p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {Object.entries(categories).map(([cat, items], i) => (
            <motion.div 
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}>
              <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${F.charcoal}` }}>
                <h3 className="text-xl font-black uppercase tracking-widest" style={{ color: F.charcoal }}>
                  {cat}
                </h3>
              </div>
              <ul className="space-y-4">
                {items.map((skill, j) => (
                  <motion.li 
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + (i * 0.1) + (j * 0.05) }}
                    className="flex items-center justify-between group">
                    <span className="text-sm font-semibold uppercase tracking-wider transition-colors group-hover:text-gold" 
                      style={{ color: F.charcoal }}>
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: F.gold }}>
                      {skill.level}%
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}