import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const S = {
  bg: '#0a0a0a',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
};

export default function About({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const personal = data?.personal || {};

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            The Athlete
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="md:w-1/2">
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
              textTransform: 'uppercase', color: S.white,
              letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '2rem',
            }}>
              Born to<br /><span style={{ color: S.red }}>Compete</span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: S.muted, lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {personal.bio || "Driven by an unrelenting pursuit of perfection, I've spent my entire life turning potential into power. Whether on the track, the court, or the field, the goal remains the same: complete domination of the sport."}
            </p>
            <p style={{ fontSize: '0.95rem', color: S.muted, lineHeight: 1.8 }}>
              "Discipline is the bridge between goals and accomplishment. Every drop of sweat is a down payment on the next championship."
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: S.red, lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.5rem' }}>Commitment</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: S.white, lineHeight: 1 }}>24/7</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.5rem' }}>Grind</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 relative">
            <div style={{
              width: '100%', height: '100%', minHeight: '400px', background: S.card,
              border: `1px solid ${S.border}`, position: 'relative', overflow: 'hidden'
            }}>
              {/* Abstract athletic graphic */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e11d48 10px, #e11d48 20px)' }} />
              <div style={{ position: 'absolute', inset: '2rem', border: `2px solid ${S.red}`, opacity: 0.2 }} />
              <div style={{ position: 'absolute', inset: '3rem', border: `1px solid ${S.white}`, opacity: 0.1 }} />
              
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, textTransform: 'uppercase' }}>
                  {personal.name || "ATHLETE"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
