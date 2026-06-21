import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';

const S = {
  bg: '#070707',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
};

export default function Projects({ projects }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!projects || projects.length === 0) return null;

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Featured Highlights
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
          Top<br /><span style={{ color: S.red }}>Performances</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((proj, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -8 }}
              style={{
                background: S.card, border: `1px solid ${S.border}`,
                display: 'flex', flexDirection: 'column', transition: 'transform 0.3s',
                overflow: 'hidden'
              }}>
              
              {/* Image / Video thumbnail placeholder */}
              <div style={{
                height: '240px', background: '#1a1a1a', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.4,
                  background: 'repeating-linear-gradient(45deg, #111 0, #111 2px, transparent 2px, transparent 8px)'
                }} />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: S.red,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 1, boxShadow: `0 0 20px ${S.red}60`
                  }}>
                  <Play size={24} color={S.white} fill={S.white} style={{ marginLeft: '4px' }} />
                </motion.div>
              </div>

              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {proj.title || proj.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: S.muted, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {proj.description || "A remarkable performance demonstrating speed, agility, and pure athletic dominance on the field."}
                </p>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {(proj.tags || ['Championship', 'MVP']).map((tag, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.65rem', fontWeight: 800, color: S.muted, textTransform: 'uppercase',
                      letterSpacing: '0.1em', padding: '0.25rem 0.75rem', border: `1px solid ${S.border}`
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <a href={proj.link || "#"} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.75rem', fontWeight: 800, color: S.red, textTransform: 'uppercase',
                  letterSpacing: '0.15em', textDecoration: 'none'
                }}>
                  View Match Stats
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
