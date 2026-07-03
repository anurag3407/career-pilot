import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Medal, Star, Award, Zap, Shield } from 'lucide-react';

const S = {
  bg: '#070707',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#0f0f0f',
  border: '#1a1a1a',
  gold: '#f59e0b',
  silver: '#94a3b8',
  bronze: '#b45309',
};

const TROPHIES = [
  {
    id: '01', tier: 'Gold', icon: <Trophy size={32} />,
    title: 'World Championship', year: '2024', org: 'World Athletics Federation',
    desc: 'First place in the 100m sprint at the global championships.',
    color: S.gold,
  },
  {
    id: '02', tier: 'Gold', icon: <Trophy size={32} />,
    title: 'Continental Cup', year: '2023', org: 'Pan-American Sports Committee',
    desc: 'Dominant performance in the relay and individual 200m event.',
    color: S.gold,
  },
  {
    id: '03', tier: 'Silver', icon: <Medal size={32} />,
    title: 'World Championship', year: '2022', org: 'World Athletics Federation',
    desc: 'Silver medal — fastest personal best of 9.81s recorded.',
    color: S.silver,
  },
  {
    id: '04', tier: 'Gold', icon: <Award size={32} />,
    title: 'National MVP Award', year: '2022', org: 'National Athletic Board',
    desc: 'Highest-voted athlete of the season by peers and coaches.',
    color: S.gold,
  },
  {
    id: '05', tier: 'Bronze', icon: <Medal size={32} />,
    title: 'Regional Invitational', year: '2021', org: 'Midwest Athletic Circuit',
    desc: 'Podium finish in a high-competition 400m hurdles event.',
    color: S.bronze,
  },
  {
    id: '06', tier: 'Gold', icon: <Star size={32} />,
    title: 'Youth Player of the Year', year: '2018', org: 'National Youth Academy',
    desc: 'Recognized as the top emerging talent across all disciplines.',
    color: S.gold,
  },
];

const HALL_STATS = [
  { value: '28', label: 'Total Titles' },
  { value: '3', label: 'World Golds' },
  { value: '11', label: 'National Titles' },
  { value: '7', label: 'MVP Awards' },
];

function TrophyCard({ trophy, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{
        background: S.card, border: `1px solid ${hovered ? trophy.color + '50' : S.border}`,
        padding: '1.75rem', cursor: 'pointer', transition: 'border-color 0.25s',
        position: 'relative', overflow: 'hidden',
      }}>

      {/* Spotlight glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at top, ${trophy.color}08, transparent 70%)`,
        }} />

      {/* Year tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{
          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em',
          color: trophy.color, textTransform: 'uppercase',
          padding: '0.2rem 0.65rem', border: `1px solid ${trophy.color}35`,
          background: `${trophy.color}0a`,
        }}>
          {trophy.tier}
        </span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: S.muted }}>{trophy.year}</span>
      </div>

      {/* Icon */}
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1, color: hovered ? trophy.color : S.muted }}
        transition={{ duration: 0.25 }}
        style={{ marginBottom: '1rem', color: S.muted }}>
        {trophy.icon}
      </motion.div>

      {/* Content */}
      <h3 style={{
        fontSize: '0.9rem', fontWeight: 900, color: S.white,
        textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem',
      }}>
        {trophy.title}
      </h3>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, color: trophy.color, marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
        {trophy.org}
      </p>
      <p style={{ fontSize: '0.78rem', color: S.muted, lineHeight: 1.65 }}>
        {trophy.desc}
      </p>

      {/* Bottom accent bar */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${trophy.color}, transparent)`,
          transformOrigin: 'left',
        }} />
    </motion.div>
  );
}

export default function TrophyCabinet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const goldCount = TROPHIES.filter(t => t.tier === 'Gold').length;
  const silverCount = TROPHIES.filter(t => t.tier === 'Silver').length;
  const bronzeCount = TROPHIES.filter(t => t.tier === 'Bronze').length;

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.gold }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.gold, textTransform: 'uppercase' }}>
            Trophy Cabinet
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
            textTransform: 'uppercase', color: S.white,
            letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '0.75rem',
          }}>
          Hall of<br /><span style={{ color: S.gold }}>Champions</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '0.9rem', color: S.muted, maxWidth: '480px', marginBottom: '2.5rem', lineHeight: 1.75 }}>
          Every trophy is a story — of sacrifice at dawn, of racing through pain, of refusing to quit when
          the crowd has gone silent.
        </motion.p>

        {/* Medal summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          style={{
            display: 'flex', gap: '1px', marginBottom: '3rem',
            border: `1px solid ${S.border}`, overflow: 'hidden',
          }}>
          {[
            { count: goldCount, tier: 'Gold', color: S.gold },
            { count: silverCount, tier: 'Silver', color: S.silver },
            { count: bronzeCount, tier: 'Bronze', color: S.bronze },
            { count: HALL_STATS[0].value, tier: 'Total Titles', color: S.red },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1, padding: '1.25rem 1rem', background: S.card, textAlign: 'center',
              borderRight: i < 3 ? `1px solid ${S.border}` : 'none',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>
                {m.count}
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '0.3rem' }}>
                {m.tier}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trophy grid */}
        <div style={{ display: 'grid', gap: '1rem' }} className="sm:grid-cols-2 lg:grid-cols-3">
          {TROPHIES.map((trophy, i) => (
            <TrophyCard key={trophy.id} trophy={trophy} index={i} />
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: '3rem', padding: '2rem',
            background: S.card, border: `1px solid ${S.border}`,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
          }}>
          {HALL_STATS.map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '1.25rem 0.75rem',
              borderRight: i < 3 ? `1px solid ${S.border}` : 'none',
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: S.gold, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '0.35rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Closing tagline */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.75 }}
          style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Zap size={14} color={S.gold} fill={S.gold} />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.28em', color: S.muted, textTransform: 'uppercase' }}>
            Legacy in Progress
          </span>
          <Zap size={14} color={S.gold} fill={S.gold} />
        </motion.div>
      </div>
    </section>
  );
}
