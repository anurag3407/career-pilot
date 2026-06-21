import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Target, Trophy } from 'lucide-react';

const S = {
  bg: '#0a0a0a',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#141414',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

const STATS = [
  { value: '8+', label: 'Years Active' },
  { value: '42', label: 'Tournaments' },
  { value: '28', label: 'Titles Won' },
  { value: '1st', label: 'World Rank' },
];

const SPORTS = ['Football', 'Basketball', 'Athletics', 'Swimming'];

export default function Hero() {
  const [sportIdx, setSportIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSportIdx(i => (i + 1) % SPORTS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ background: S.bg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Diagonal speed lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${i * 14}%`, width: '2px',
            background: 'linear-gradient(180deg, transparent, #e11d48, transparent)',
            transform: 'skewX(-20deg)',
          }} />
        ))}
      </div>

      {/* Red glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ paddingTop: '5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <Zap size={14} color={S.red} fill={S.red} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: S.red }}>
            Elite Athlete Portfolio
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.red}40, transparent)` }} />
        </motion.div>

        {/* Fix #1: removed inline gridTemplateColumns so lg:grid-cols-2 takes effect */}
        <div className="grid lg:grid-cols-2" style={{ gap: '3rem' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: S.muted, textTransform: 'uppercase', marginBottom: '1rem' }}>
                Championship Athlete
              </p>

              <h1 style={{
                fontSize: 'clamp(3rem, 10vw, 6.5rem)', fontWeight: 900,
                lineHeight: 0.9, letterSpacing: '-0.03em', color: S.white,
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                MARCUS
              </h1>
              <h1 style={{
                fontSize: 'clamp(3rem, 10vw, 6.5rem)', fontWeight: 900,
                lineHeight: 0.9, letterSpacing: '-0.03em',
                background: `linear-gradient(135deg, ${S.red}, ${S.gold})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase', marginBottom: '1.5rem',
              }}>
                STONE
              </h1>

              {/* Fix #2: AnimatePresence wraps rotating sport label so exit animation runs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ width: '3px', height: '28px', background: S.red, borderRadius: '2px' }} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={sportIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 800,
                      letterSpacing: '0.08em', color: S.muted, textTransform: 'uppercase',
                    }}>
                    {SPORTS[sportIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: S.muted, maxWidth: '440px', marginBottom: '2.5rem' }}>
                Pushing human limits through discipline, speed, and precision. Representing excellence on
                every field, every court, every track — from local arenas to world championships.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.85rem 2rem', background: S.red, color: S.white,
                    border: 'none', cursor: 'pointer', fontWeight: 800,
                    fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  }}>
                  View Achievements
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.85rem 2rem', background: 'transparent', color: S.white,
                    border: `1px solid ${S.border}`, cursor: 'pointer', fontWeight: 800,
                    fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  }}>
                  Contact Agent
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right: jersey number + icon grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              fontSize: 'clamp(8rem, 22vw, 18rem)', fontWeight: 900, lineHeight: 1,
              color: 'rgba(225,29,72,0.06)', userSelect: 'none', letterSpacing: '-0.05em',
              position: 'absolute',
            }}>
              23
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {[
                { icon: <Trophy size={28} color={S.gold} />, label: 'Champion', sub: '3× World Title' },
                { icon: <Target size={28} color={S.red} />, label: 'Precision', sub: '98% Accuracy' },
                { icon: <Zap size={28} color={S.red} />, label: 'Speed', sub: '9.4s / 100m' },
                { icon: <Trophy size={28} color={S.gold} />, label: 'MVP Awards', sub: '7 Seasons' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  whileHover={{ y: -4, borderColor: S.red }}
                  style={{
                    padding: '1.25rem', background: S.card,
                    border: `1px solid ${S.border}`, transition: 'border-color 0.2s',
                  }}>
                  {item.icon}
                  <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', fontWeight: 800, color: S.white, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: S.muted, marginTop: '0.2rem' }}>{item.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Fix #3: stats bar responsive — 2 cols on mobile, 4 on md+ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ marginTop: '4rem', marginBottom: '2rem', borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}` }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '1.5rem 1rem', textAlign: 'center',
              borderRight: (i === 1 || i === 3) ? 'none' : `1px solid ${S.border}`,
              borderBottom: i < 2 ? `1px solid ${S.border}` : 'none',
            }} className="md:[border-right:1px_solid_#1e1e1e] md:[border-bottom:none]">
              <div style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900,
                color: S.red, letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.4rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
          <ChevronDown size={20} color={S.muted} />
        </motion.div>
      </div>
    </section>
  );
}
