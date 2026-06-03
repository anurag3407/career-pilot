import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Shield, Flame, MapPin, Calendar } from 'lucide-react';

const S = {
  bg: '#0d0d0d',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

const SKILLS = [
  { label: 'Stamina & Endurance', pct: 96 },
  { label: 'Speed & Agility', pct: 92 },
  { label: 'Tactical Awareness', pct: 88 },
  { label: 'Team Leadership', pct: 94 },
  { label: 'Mental Fortitude', pct: 90 },
];

const TIMELINE = [
  { year: '2016', event: 'Joined National Youth Academy', icon: <Shield size={14} /> },
  { year: '2018', event: 'First Senior International Cap', icon: <Flame size={14} /> },
  { year: '2020', event: 'Regional Championship MVP', icon: <Award size={14} /> },
  { year: '2022', event: 'World Championship Silver', icon: <Award size={14} /> },
  { year: '2024', event: 'World #1 Ranking Achieved', icon: <Flame size={14} /> },
];

function SkillBar({ label, pct, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: S.white, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: S.red }}>{pct}%</span>
      </div>
      <div style={{ height: '4px', background: S.border, borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${S.red}, ${S.gold})`, borderRadius: '2px' }} />
      </div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>

      {/* Section label */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            About the Athlete
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <div style={{ display: 'grid', gap: '3rem' }} className="lg:grid-cols-2">

          {/* Left: bio + timeline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}>

            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
              textTransform: 'uppercase', lineHeight: 0.95,
              letterSpacing: '-0.02em', color: S.white, marginBottom: '1.5rem',
            }}>
              Built for<br />
              <span style={{ color: S.red }}>Greatness</span>
            </h2>

            <p style={{ fontSize: '0.92rem', lineHeight: 1.85, color: S.muted, marginBottom: '1rem' }}>
              Marcus Stone is an elite multi-sport athlete whose career spans over 8 years of professional
              competition. Born to compete, raised on discipline — every scar, every sprint, every victory
              has been forged through relentless training and an unbreakable will to win.
            </p>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.85, color: S.muted, marginBottom: '2.5rem' }}>
              Representing his nation on the world stage, Marcus has become a symbol of athletic excellence —
              inspiring the next generation of champions through performance, integrity, and heart.
            </p>

            {/* Meta chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {[
                { icon: <MapPin size={12} />, text: 'Chicago, USA' },
                { icon: <Calendar size={12} />, text: 'Pro since 2016' },
                { icon: <Shield size={12} />, text: 'Team Captain' },
              ].map((chip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.4rem 0.9rem', border: `1px solid ${S.border}`,
                  fontSize: '0.7rem', fontWeight: 600, color: S.muted,
                }}>
                  <span style={{ color: S.red }}>{chip.icon}</span>
                  {chip.text}
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.2em', color: S.muted, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Career Timeline
              </p>
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px' }}>
                    <div style={{
                      width: '28px', height: '28px', background: S.card,
                      border: `1px solid ${S.red}40`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: S.red, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div style={{ width: '1px', height: '20px', background: S.border, marginTop: '4px' }} />
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: S.red, letterSpacing: '0.12em' }}>{item.year}</span>
                    <p style={{ fontSize: '0.8rem', color: S.white, marginTop: '0.15rem', fontWeight: 600 }}>{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: skill bars + quote */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}>

            <div style={{
              padding: '2rem', background: S.card,
              border: `1px solid ${S.border}`, marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.22em', color: S.red, textTransform: 'uppercase', marginBottom: '1.75rem' }}>
                Athletic Performance Index
              </p>
              {SKILLS.map((sk, i) => (
                <SkillBar key={sk.label} label={sk.label} pct={sk.pct} delay={0.3 + i * 0.08} />
              ))}
            </div>

            {/* Pull quote */}
            <motion.blockquote
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              style={{
                padding: '1.75rem 2rem',
                borderLeft: `3px solid ${S.red}`,
                background: S.card, border: `1px solid ${S.border}`,
                borderLeftColor: S.red,
              }}>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontStyle: 'italic',
                color: S.white, lineHeight: 1.65, marginBottom: '1rem',
              }}>
                "Champions aren't made in gyms. Champions are made from something they have deep inside
                them — a desire, a dream, a vision."
              </p>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: S.red, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                — Marcus Stone
              </span>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
