import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const S = {
  bg: '#0a0a0a',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

export default function Experience({ experience }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!experience || experience.length === 0) return null;

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Career History
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
          Professional<br /><span style={{ color: S.red }}>Journey</span>
        </motion.h2>

        <div style={{ position: 'relative' }}>
          {/* Timeline center line for large screens */}
          <div className="hidden md:block" style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px',
            background: `linear-gradient(180deg, ${S.red}, ${S.border} 20%, ${S.border} 80%, transparent)`,
            transform: 'translateX(-50%)'
          }} />

          {experience.map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex flex-col md:flex-row items-center justify-between"
                style={{ marginBottom: '3rem', position: 'relative' }}>
                
                {/* Left side */}
                <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:order-2 md:text-left'} mb-4 md:mb-0`}>
                  <div style={{
                    padding: '1.75rem', background: S.card, border: `1px solid ${S.border}`,
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <motion.div
                      whileHover={{ scaleX: 1 }}
                      initial={{ scaleX: 0 }}
                      style={{
                        position: 'absolute', top: 0, [isEven ? 'right' : 'left']: 0, height: '3px', width: '100%',
                        background: S.red, transformOrigin: isEven ? 'right' : 'left', transition: 'transform 0.3s ease'
                      }} />
                    
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      {exp.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                      @ {exp.company}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: S.muted, lineHeight: 1.7 }}>
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                  style={{ background: S.bg, border: `2px solid ${S.red}` }}>
                  <Shield size={16} color={S.red} fill={S.red + '20'} />
                </div>

                {/* Right side (Date) */}
                <div className={`w-full md:w-5/12 ${isEven ? 'md:order-2 md:text-left' : 'md:text-right'}`}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', background: S.red + '10', border: `1px solid ${S.red}30`,
                    color: S.red, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase'
                  }}>
                    <Zap size={14} />
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}