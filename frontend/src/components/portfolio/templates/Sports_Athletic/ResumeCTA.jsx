import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, Briefcase, Calendar, MapPin, ArrowRight, Zap } from 'lucide-react';

const S = {
  bg: '#080808',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#0f0f0f',
  border: '#1a1a1a',
  gold: '#f59e0b',
};

const EXPERIENCE = [
  {
    role: 'Professional Sprinter',
    org: 'National Athletics Team',
    period: '2020 — Present',
    location: 'Chicago, USA',
    highlights: [
      'Represented nation in 3 consecutive World Championships',
      'Achieved personal best 9.81s in the 100m sprint',
      'Led relay team to continental record in 4×100m',
    ],
    current: true,
  },
  {
    role: 'Team Captain',
    org: 'Regional Athletics Club',
    period: '2018 — 2020',
    location: 'Chicago, USA',
    highlights: [
      'Led club to back-to-back regional championship titles',
      'Mentored 12 junior athletes in sprint technique',
      'Organized cross-training camps with 40+ participants',
    ],
    current: false,
  },
  {
    role: 'Youth Academy Athlete',
    org: 'National Youth Academy',
    period: '2016 — 2018',
    location: 'Springfield, USA',
    highlights: [
      'Awarded Youth Player of the Year (2018)',
      'Broke national junior 100m record with 10.12s',
      'Selected for elite development squad after first season',
    ],
    current: false,
  },
];

const CERTIFICATIONS = [
  { label: 'USATF Level II Coaching License', year: '2023' },
  { label: 'Sports Nutrition Specialist Cert.', year: '2022' },
  { label: 'First Aid & Sports Medicine', year: '2021' },
  { label: 'Mental Performance Coaching', year: '2023' },
];

function ExperienceRow({ exp, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.1 }}
      style={{
        padding: '1.75rem', background: S.card,
        border: `1px solid ${exp.current ? S.red + '30' : S.border}`,
        marginBottom: '1rem', position: 'relative', overflow: 'hidden',
      }}>
      {exp.current && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
          background: `linear-gradient(180deg, ${S.red}, transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {exp.role}
            </h3>
            {exp.current && (
              <span style={{
                fontSize: '0.55rem', fontWeight: 800, color: S.red, padding: '0.15rem 0.5rem',
                border: `1px solid ${S.red}40`, textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                Current
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Briefcase size={12} color={S.red} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: S.red }}>{exp.org}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
            <Calendar size={11} color={S.muted} />
            <span style={{ fontSize: '0.7rem', color: S.muted }}>{exp.period}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
            <MapPin size={11} color={S.muted} />
            <span style={{ fontSize: '0.7rem', color: S.muted }}>{exp.location}</span>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {exp.highlights.map((h, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <ArrowRight size={12} color={S.red} style={{ marginTop: '3px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: S.muted, lineHeight: 1.6 }}>{h}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ResumeCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>

        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Career Profile
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <div className="grid lg:grid-cols-3" style={{ gap: '3rem' }}>

          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
                textTransform: 'uppercase', color: S.white,
                letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '2.5rem',
              }}>
              Athletic<br /><span style={{ color: S.red }}>Experience</span>
            </motion.h2>

            {EXPERIENCE.map((exp, i) => (
              <ExperienceRow key={i} exp={exp} index={i} inView={inView} />
            ))}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              style={{ padding: '2rem', background: S.card, border: `1px solid ${S.border}`, marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.22em', color: S.gold, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                Certifications
              </p>
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '0.75rem 0',
                    borderBottom: i < CERTIFICATIONS.length - 1 ? `1px solid ${S.border}` : 'none',
                    gap: '0.5rem',
                  }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Zap size={12} color={S.red} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.76rem', color: S.muted, lineHeight: 1.5 }}>{cert.label}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: S.red, flexShrink: 0 }}>{cert.year}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Fix: render as <a> so Download PDF is functional */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65 }}
              style={{ padding: '2rem', background: S.red, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07,
                background: 'repeating-linear-gradient(105deg, transparent, transparent 20px, rgba(255,255,255,0.5) 21px, transparent 22px)',
              }} />
              <Zap size={24} color="white" fill="white" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Full Athletic Resume
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Download the complete career profile, competition history, and performance metrics.
              </p>
              <motion.a
                href="/resume-placeholder.pdf"
                download
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                  justifyContent: 'center', padding: '0.85rem',
                  background: 'rgba(0,0,0,0.25)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none',
                  fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                <Download size={15} />
                Download PDF
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
