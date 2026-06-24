import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, MapPin } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

const TAGS = ['Full Stack', 'Creative Tech', 'Open Source', 'React', 'Node.js', 'TypeScript', 'Design Systems', 'Cloud'];

function Ticker() {
  return (
    <div className="overflow-hidden" style={{ background: F.dark, borderTop: `1px solid ${F.border}` }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap py-3"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        {[...TAGS, ...TAGS].map((t, i) => (
          <span key={i} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            style={{ color: i % 2 === 0 ? F.gold : '#fff' }}>
            {i % 4 === 0 && <span style={{ color: F.gold }}>✦</span>}
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const STATS = [
  { value: `${data.stats.yearsExperience}+`, label: 'Years', labelFull: 'Years Experience' },
  { value: `${data.stats.projectsCompleted}+`, label: 'Projects', labelFull: 'Projects Shipped' },
  { value: `${data.stats.happyClients}+`, label: 'Clients', labelFull: 'Happy Clients' },
];

export default function Hero() {
  return (
    <section style={{ background: F.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top editorial bar ── */}
      <div className="flex items-center justify-between px-5 md:px-16 py-3"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: F.charcoal }}>Portfolio</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <MapPin size={10} style={{ color: F.gold }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: F.muted }}>{data.personal.location}</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>§ 00</span>
      </div>

      {/* ── Main hero split ── */}
      {/* Mobile: portrait first (top), text below. Desktop: text left, portrait right */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:min-h-[600px]">

        {/* Portrait — shown first on mobile via order */}
        <div className="relative overflow-hidden order-first lg:order-last"
          style={{ height: '300px' }}>
          <motion.img
            src={data.personal.avatar}
            alt={data.personal.name}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full h-full object-cover object-top absolute inset-0"
            style={{ filter: 'contrast(1.04) saturate(0.8)' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.5))' }} />

          {/* Gold corner frame — desktop only */}
          <div className="absolute top-5 right-5 w-12 h-12 pointer-events-none hidden lg:block"
            style={{ border: `2px solid ${F.gold}`, borderLeft: 'none', borderBottom: 'none', opacity: 0.7 }} />

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-4 right-4 px-3 py-2"
            style={{ background: F.dark, borderLeft: `3px solid ${F.gold}` }}>
            <p className="text-xs uppercase tracking-wider font-black" style={{ color: F.gold }}>Available for</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#fff' }}>New Projects</p>
          </motion.div>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between px-6 md:px-16 py-10 lg:py-14 order-last lg:order-first"
          style={{ borderBottom: `1px solid ${F.border}` }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-black uppercase tracking-[0.3em] mb-6"
              style={{ color: F.gold }}>
              — Creative Technologist
            </motion.p>

            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: '100%' }} animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-black leading-none"
                style={{ fontSize: 'clamp(2.8rem, 12vw, 5.5rem)', color: F.charcoal, letterSpacing: '-0.03em' }}>
                {data.personal.name.split(' ')[0]}
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ y: '100%' }} animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-black leading-none italic"
                style={{
                  fontSize: 'clamp(2.8rem, 12vw, 5.5rem)',
                  letterSpacing: '-0.03em',
                  background: `linear-gradient(135deg, ${F.gold}, ${F.goldLight})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                {data.personal.name.split(' ')[1]}
              </motion.h1>
            </div>

            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: 2, background: `linear-gradient(90deg, ${F.gold}, transparent)`, transformOrigin: 'left', marginBottom: '1.5rem' }} />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm leading-relaxed"
              style={{ color: F.muted, maxWidth: '420px' }}>
              {data.personal.bio.split('.')[0]}.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 mt-8">
            <span className="text-xs uppercase tracking-widest font-bold" style={{ color: F.muted }}>
              Scroll to explore
            </span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ArrowDown size={12} style={{ color: F.gold }} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3" style={{ borderBottom: `1px solid ${F.border}` }}>
        {STATS.map(({ value, label, labelFull }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex flex-col items-center py-5"
            style={{ borderRight: i < 2 ? `1px solid ${F.border}` : 'none' }}>
            <span className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: i === 0 ? F.gold : F.charcoal }}>
              {value}
            </span>
            {/* Short label on mobile, full on md+ */}
            <span className="text-xs uppercase tracking-widest mt-1 text-center px-1 md:hidden" style={{ color: F.muted }}>{label}</span>
            <span className="text-xs uppercase tracking-widest mt-1 text-center px-1 hidden md:block" style={{ color: F.muted }}>{labelFull}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
