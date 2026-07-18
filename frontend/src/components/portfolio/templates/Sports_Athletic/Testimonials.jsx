import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Zap } from 'lucide-react';

const S = {
  bg: '#0a0a0a',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

export default function Testimonials({ testimonials }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Scouting Reports
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
          Coach & Media<br /><span style={{ color: S.red }}>Quotes</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5, borderColor: S.red }}
              style={{
                background: S.card, padding: '2rem', border: `1px solid ${S.border}`,
                position: 'relative', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s'
              }}>
              <Quote size={32} color={S.red} style={{ opacity: 0.2, position: 'absolute', top: '1.5rem', right: '1.5rem' }} />
              
              <div style={{ flex: 1, marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '0.95rem', color: S.white, fontStyle: 'italic', lineHeight: 1.7, fontWeight: 500 }}>
                  "{t.content || t.text}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `1px solid ${S.border}`, paddingTop: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', background: S.border, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.muted, fontWeight: 900 }}>
                  {(t.author || t.name || 'A').charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: S.red, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    {t.author || t.name}
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: S.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {t.role || t.position || 'Coach'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}