import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Zap } from 'lucide-react';

const S = {
  bg: '#070707',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
};

export default function Skills({ skills }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!skills || skills.length === 0) return null;

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Attributes
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
            textTransform: 'uppercase', color: S.white,
            letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '3rem',
          }}>
          Core<br /><span style={{ color: S.red }}>Strengths</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          {skills.map((skill, i) => {
            // Defaulting to random levels if not provided, just for visual flair
            const level = skill.level || Math.floor(Math.random() * 20 + 80); 
            
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.05 }}
                style={{ padding: '1.5rem', background: S.card, border: `1px solid ${S.border}` }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={16} color={S.red} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: S.white, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: S.red, lineHeight: 1 }}>
                    {level}
                  </span>
                </div>

                {/* Progress bar container */}
                <div style={{ width: '100%', height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={inView ? { width: `${level}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                    style={{
                      height: '100%', background: S.red,
                      boxShadow: `0 0 10px ${S.red}80`
                    }} />
                </div>
                
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}