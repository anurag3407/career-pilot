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

export default function Experience() {
  const { portfolioData: data } = usePortfolio();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} style={{ background: F.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Experience</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>§ 02</span>
      </motion.div>

      <div className="px-5 md:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-xs font-black uppercase tracking-widest mb-10" style={{ color: F.gold }}>
            — Career Path
          </motion.p>
          
          <div className="space-y-0" style={{ borderTop: `1px solid ${F.border}` }}>
            {data.experience.map((exp, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="grid md:grid-cols-12 gap-6 md:gap-10 py-10 group transition-colors"
                style={{ borderBottom: `1px solid ${F.border}` }}>
                
                {/* Left: Company & Period */}
                <div className="md:col-span-4 flex flex-col md:pr-10">
                  <p className="text-2xl font-black tracking-tight" style={{ color: F.charcoal }}>
                    {exp.company}
                  </p>
                  <p className="text-xs uppercase tracking-widest mt-2 font-semibold" style={{ color: F.muted }}>
                    {exp.period}
                  </p>
                </div>
                
                {/* Right: Role & Description */}
                <div className="md:col-span-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: F.charcoal }}>
                    {exp.role}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: F.muted }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}