import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const F = {
  bg:       '#faf9f7',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  border:   '#e0dbd4',
};

const LOOKS = [
  {
    num: '01', title: 'Velvet Elegance',
    desc: 'Luxury crafted with sharp silhouettes inspired by runway fashion.',
    bg: 'linear-gradient(160deg, #2d2016 0%, #4a3020 50%, #1a1008 100%)',
    accent: '#c9a84c',
  },
  {
    num: '02', title: 'Golden Hues',
    desc: 'Minimal aesthetics with elegant textures and warm metal tones.',
    bg: 'linear-gradient(160deg, #3d2e0a 0%, #6b4f12 50%, #1f1700 100%)',
    accent: '#e8c96e',
  },
  {
    num: '03', title: 'Sparkle Shine',
    desc: 'Runway designed with sparkle magic and crystalline details.',
    bg: 'linear-gradient(160deg, #1a1a2e 0%, #2d2d4a 50%, #0d0d18 100%)',
    accent: '#9b8ec4',
  },
  {
    num: '04', title: 'Traditional Times',
    desc: 'Timeless fashion with a hint of modern luxury redefined.',
    bg: 'linear-gradient(160deg, #1c2a1c 0%, #2e4a2e 50%, #0d1a0d 100%)',
    accent: '#7ab87a',
  },
  {
    num: '05', title: 'Denim Days',
    desc: 'Comfort meets craft — classic denim elevated to haute couture.',
    bg: 'linear-gradient(160deg, #0f1f2e 0%, #1a3348 50%, #080f18 100%)',
    accent: '#5b9bd6',
  },
  {
    num: '06', title: 'Runway Fashion',
    desc: 'Inspired by high-end runway looks from Paris to Milan.',
    bg: 'linear-gradient(160deg, #2a1a1a 0%, #4a2020 50%, #180a0a 100%)',
    accent: '#e07070',
  },
];

function LookCard({ look, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="overflow-hidden cursor-pointer"
      style={{ border: `1px solid rgba(255,255,255,0.08)`, borderRadius: '2px' }}>

      {/* Gradient swatch */}
      <div className="relative overflow-hidden" style={{ height: '180px', background: look.bg }}>
        {/* Animated shimmer on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? '100%' : '-20%' }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)' }} />

        {/* Number tag */}
        <div className="absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-2.5 py-1"
          style={{ background: 'rgba(0,0,0,0.6)', color: look.accent, border: `1px solid ${look.accent}40` }}>
          {look.num}
        </div>

        {/* Gold rule accent */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: look.accent, transformOrigin: 'left' }} />
      </div>

      {/* Content */}
      <div className="p-5" style={{ background: '#1a1510' }}>
        <h3 className="text-base font-black tracking-tight mb-2 font-serif"
          style={{ color: '#f5efe8' }}>
          {look.title}
        </h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(245,239,232,0.5)' }}>
          {look.desc}
        </p>
        <motion.span
          animate={{ color: hovered ? look.accent : 'rgba(245,239,232,0.35)' }}
          transition={{ duration: 0.2 }}
          className="text-xs font-bold uppercase tracking-widest">
          Explore →
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function RunwayLookbook() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section ref={sectionRef} style={{ background: '#120e0a', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Lookbook
          </span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>§ 02</span>
      </div>

      {/* ── Hero headline ── */}
      <div className="px-5 md:px-16 py-10 md:py-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-xs font-black uppercase tracking-[0.3em] mb-6"
          style={{ color: F.gold }}>
          — The Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', color: '#f5efe8', fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
          The Silk Route
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-sm leading-relaxed max-w-lg"
          style={{ color: 'rgba(245,239,232,0.5)' }}>
          This collection embraces high-end fashion — from velvet couture to crystalline sparkle. A blend of
          traditional culture with futuristic trends, not just fashion but a remark of ancient heritage making
          its way into the future.
        </motion.p>
      </div>

      {/* ── Grid ── */}
      <div className="px-5 md:px-16 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {LOOKS.map((look, i) => (
            <LookCard key={look.num} look={look} index={i} />
          ))}
        </div>
      </div>

      {/* ── Pull quote ── */}
      <div className="px-5 md:px-16 py-12 md:py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center">
          <p className="font-serif italic leading-relaxed mb-4"
            style={{ fontSize: 'clamp(1.1rem, 4vw, 2rem)', color: 'rgba(245,239,232,0.75)' }}>
            "Fashion is not just about aesthetics —<br className="hidden md:block" /> it's about experience."
          </p>
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: F.gold }}>
            ✦ High Fashion
          </span>
        </motion.blockquote>
      </div>
    </section>
  );
}
