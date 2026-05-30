import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Mail, Github, Linkedin, Twitter, ExternalLink, Code2,
  Star, Send, ChevronDown, Sun, Cloud, CloudRain, Moon, Sunrise,
  Sunset, Wind, Droplets, Thermometer, Quote, Snowflake, Zap,
  CloudLightning, CloudSnow, CloudDrizzle, Flame, Leaf, CloudFog,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// ─── Mood Definitions ────────────────────────────────────────────────────────

const MOODS = {
  dawn: {
    label: 'Dawn',
    description: 'Soft pink horizon, dew on leaves',
    icon: Sunrise,
    emoji: '🌅',
    bgStyle: {
      background: 'linear-gradient(160deg, #1a0a2e 0%, #6b2d6b 30%, #c96b3a 60%, #f4a460 85%, #fde68a 100%)',
    },
    card: { background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.18)' },
    nav: { background: 'rgba(26,10,46,0.75)', borderBottom: '1px solid rgba(251,146,60,0.18)', backdropFilter: 'blur(14px)' },
    accent: '#fbbf24',
    accentRgb: '251,191,36',
    prose: '#fef3c7',
    muted: 'rgba(254,243,199,0.55)',
    barFrom: '#f97316',
    barTo: '#fbbf24',
    buttonBg: '#f97316',
    buttonText: '#1a0a2e',
    badgeBg: 'rgba(251,146,60,0.18)',
    badgeBorder: 'rgba(251,146,60,0.35)',
    badgeText: '#fbbf24',
    ringColor: 'rgba(251,191,36,0.45)',
    particle: 'dawn',
  },
  morning: {
    label: 'Morning',
    description: 'Fresh breeze, golden hour light',
    icon: Sun,
    emoji: '☀️',
    bgStyle: {
      background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 35%, #f0fdf4 70%, #fefce8 100%)',
    },
    card: { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(186,230,253,0.7)' },
    nav: { background: 'rgba(255,255,255,0.72)', borderBottom: '1px solid rgba(186,230,253,0.5)', backdropFilter: 'blur(14px)' },
    accent: '#0284c7',
    accentRgb: '2,132,199',
    prose: '#0c4a6e',
    muted: 'rgba(12,74,110,0.5)',
    barFrom: '#38bdf8',
    barTo: '#0ea5e9',
    buttonBg: '#0284c7',
    buttonText: '#ffffff',
    badgeBg: 'rgba(186,230,253,0.6)',
    badgeBorder: 'rgba(56,189,248,0.4)',
    badgeText: '#0369a1',
    ringColor: 'rgba(56,189,248,0.45)',
    particle: 'morning',
  },
  afternoon: {
    label: 'Afternoon',
    description: 'Blazing sun, lazy clouds',
    icon: Sun,
    emoji: '🌤',
    bgStyle: {
      background: 'linear-gradient(180deg, #1d4ed8 0%, #3b82f6 30%, #60a5fa 60%, #bfdbfe 100%)',
    },
    card: { background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)' },
    nav: { background: 'rgba(29,78,216,0.75)', borderBottom: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(14px)' },
    accent: '#fde047',
    accentRgb: '253,224,71',
    prose: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    barFrom: '#fde047',
    barTo: '#fb923c',
    buttonBg: '#fde047',
    buttonText: '#1d4ed8',
    badgeBg: 'rgba(253,224,71,0.18)',
    badgeBorder: 'rgba(253,224,71,0.4)',
    badgeText: '#fde047',
    ringColor: 'rgba(253,224,71,0.45)',
    particle: 'afternoon',
  },
  golden_hour: {
    label: 'Golden Hour',
    description: 'Magic light before sunset',
    icon: Sunset,
    emoji: '🌇',
    bgStyle: {
      background: 'linear-gradient(170deg, #7c2d12 0%, #c2410c 20%, #ea580c 40%, #f97316 55%, #fbbf24 72%, #fde68a 100%)',
    },
    card: { background: 'rgba(194,65,12,0.2)', border: '1px solid rgba(251,191,36,0.25)' },
    nav: { background: 'rgba(124,45,18,0.8)', borderBottom: '1px solid rgba(251,191,36,0.2)', backdropFilter: 'blur(14px)' },
    accent: '#fde047',
    accentRgb: '253,224,71',
    prose: '#fff7ed',
    muted: 'rgba(255,247,237,0.55)',
    barFrom: '#fbbf24',
    barTo: '#f97316',
    buttonBg: '#fbbf24',
    buttonText: '#7c2d12',
    badgeBg: 'rgba(251,191,36,0.2)',
    badgeBorder: 'rgba(251,191,36,0.4)',
    badgeText: '#fde047',
    ringColor: 'rgba(251,191,36,0.5)',
    particle: 'golden',
  },
  sunset: {
    label: 'Sunset',
    description: 'Deep violet dusk, long shadows',
    icon: Sunset,
    emoji: '🌆',
    bgStyle: {
      background: 'linear-gradient(165deg, #0f0524 0%, #3b0764 25%, #6d28d9 50%, #c026d3 70%, #f97316 90%, #fde68a 100%)',
    },
    card: { background: 'rgba(109,40,217,0.18)', border: '1px solid rgba(192,38,211,0.25)' },
    nav: { background: 'rgba(15,5,36,0.82)', borderBottom: '1px solid rgba(192,38,211,0.22)', backdropFilter: 'blur(14px)' },
    accent: '#e879f9',
    accentRgb: '232,121,249',
    prose: '#fdf4ff',
    muted: 'rgba(253,244,255,0.5)',
    barFrom: '#e879f9',
    barTo: '#f97316',
    buttonBg: '#c026d3',
    buttonText: '#ffffff',
    badgeBg: 'rgba(192,38,211,0.2)',
    badgeBorder: 'rgba(232,121,249,0.35)',
    badgeText: '#e879f9',
    ringColor: 'rgba(232,121,249,0.45)',
    particle: 'sunset',
  },
  night: {
    label: 'Night',
    description: 'Still darkness, stars overhead',
    icon: Moon,
    emoji: '🌙',
    bgStyle: {
      background: 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #1e1b4b 80%, #0f172a 100%)',
    },
    card: { background: 'rgba(30,27,75,0.35)', border: '1px solid rgba(129,140,248,0.12)' },
    nav: { background: 'rgba(2,6,23,0.88)', borderBottom: '1px solid rgba(129,140,248,0.12)', backdropFilter: 'blur(14px)' },
    accent: '#a5b4fc',
    accentRgb: '165,180,252',
    prose: '#e0e7ff',
    muted: 'rgba(224,231,255,0.45)',
    barFrom: '#818cf8',
    barTo: '#a78bfa',
    buttonBg: '#6366f1',
    buttonText: '#ffffff',
    badgeBg: 'rgba(99,102,241,0.18)',
    badgeBorder: 'rgba(129,140,248,0.3)',
    badgeText: '#a5b4fc',
    ringColor: 'rgba(165,180,252,0.4)',
    particle: 'stars',
  },
  midnight: {
    label: 'Midnight',
    description: 'Deep ocean dark, neon haze',
    icon: Moon,
    emoji: '🌌',
    bgStyle: {
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 30%, #001a33 60%, #003366 80%, #004080 100%)',
    },
    card: { background: 'rgba(0,26,51,0.5)', border: '1px solid rgba(0,191,255,0.15)' },
    nav: { background: 'rgba(0,0,0,0.88)', borderBottom: '1px solid rgba(0,191,255,0.15)', backdropFilter: 'blur(14px)' },
    accent: '#00bfff',
    accentRgb: '0,191,255',
    prose: '#e0f7ff',
    muted: 'rgba(224,247,255,0.4)',
    barFrom: '#00bfff',
    barTo: '#7c3aed',
    buttonBg: '#00bfff',
    buttonText: '#000000',
    badgeBg: 'rgba(0,191,255,0.12)',
    badgeBorder: 'rgba(0,191,255,0.3)',
    badgeText: '#00bfff',
    ringColor: 'rgba(0,191,255,0.4)',
    particle: 'aurora',
  },
  stormy: {
    label: 'Stormy',
    description: 'Thunder rolling, dark skies',
    icon: CloudLightning,
    emoji: '⛈',
    bgStyle: {
      background: 'linear-gradient(180deg, #111827 0%, #1f2937 30%, #374151 55%, #1f2937 80%, #111827 100%)',
    },
    card: { background: 'rgba(55,65,81,0.35)', border: '1px solid rgba(156,163,175,0.15)' },
    nav: { background: 'rgba(17,24,39,0.9)', borderBottom: '1px solid rgba(156,163,175,0.15)', backdropFilter: 'blur(14px)' },
    accent: '#facc15',
    accentRgb: '250,204,21',
    prose: '#f9fafb',
    muted: 'rgba(249,250,251,0.45)',
    barFrom: '#facc15',
    barTo: '#f97316',
    buttonBg: '#facc15',
    buttonText: '#111827',
    badgeBg: 'rgba(250,204,21,0.12)',
    badgeBorder: 'rgba(250,204,21,0.3)',
    badgeText: '#facc15',
    ringColor: 'rgba(250,204,21,0.4)',
    particle: 'storm',
  },
  rainy: {
    label: 'Rainy',
    description: 'Cosy indoor rain on glass',
    icon: CloudRain,
    emoji: '🌧',
    bgStyle: {
      background: 'linear-gradient(180deg, #1e3a5f 0%, #2563a8 30%, #3b82c4 55%, #60a5d4 80%, #93c5e0 100%)',
    },
    card: { background: 'rgba(37,99,168,0.2)', border: '1px solid rgba(147,197,224,0.2)' },
    nav: { background: 'rgba(30,58,95,0.85)', borderBottom: '1px solid rgba(147,197,224,0.18)', backdropFilter: 'blur(14px)' },
    accent: '#93c5fd',
    accentRgb: '147,197,253',
    prose: '#eff6ff',
    muted: 'rgba(239,246,255,0.5)',
    barFrom: '#60a5fa',
    barTo: '#a5f3fc',
    buttonBg: '#3b82f6',
    buttonText: '#ffffff',
    badgeBg: 'rgba(96,165,250,0.18)',
    badgeBorder: 'rgba(147,197,253,0.3)',
    badgeText: '#93c5fd',
    ringColor: 'rgba(147,197,253,0.4)',
    particle: 'rain',
  },
  drizzle: {
    label: 'Drizzle',
    description: 'Light mist, petrichor in the air',
    icon: CloudDrizzle,
    emoji: '🌦',
    bgStyle: {
      background: 'linear-gradient(160deg, #2d4a22 0%, #3d6b2e 30%, #4a7c39 55%, #7aab62 80%, #a8c896 100%)',
    },
    card: { background: 'rgba(61,107,46,0.22)', border: '1px solid rgba(168,200,150,0.25)' },
    nav: { background: 'rgba(45,74,34,0.85)', borderBottom: '1px solid rgba(168,200,150,0.22)', backdropFilter: 'blur(14px)' },
    accent: '#86efac',
    accentRgb: '134,239,172',
    prose: '#f0fdf4',
    muted: 'rgba(240,253,244,0.5)',
    barFrom: '#86efac',
    barTo: '#34d399',
    buttonBg: '#22c55e',
    buttonText: '#052e16',
    badgeBg: 'rgba(134,239,172,0.15)',
    badgeBorder: 'rgba(134,239,172,0.3)',
    badgeText: '#86efac',
    ringColor: 'rgba(134,239,172,0.4)',
    particle: 'drizzle',
  },
  foggy: {
    label: 'Foggy',
    description: 'Mysterious mist, muted silhouettes',
    icon: CloudFog,
    emoji: '🌫',
    bgStyle: {
      background: 'linear-gradient(180deg, #9ca3af 0%, #d1d5db 35%, #e5e7eb 65%, #f9fafb 100%)',
    },
    card: { background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(156,163,175,0.3)' },
    nav: { background: 'rgba(156,163,175,0.65)', borderBottom: '1px solid rgba(156,163,175,0.3)', backdropFilter: 'blur(20px)' },
    accent: '#6b7280',
    accentRgb: '107,114,128',
    prose: '#1f2937',
    muted: 'rgba(31,41,55,0.5)',
    barFrom: '#6b7280',
    barTo: '#9ca3af',
    buttonBg: '#4b5563',
    buttonText: '#f9fafb',
    badgeBg: 'rgba(107,114,128,0.15)',
    badgeBorder: 'rgba(107,114,128,0.3)',
    badgeText: '#4b5563',
    ringColor: 'rgba(107,114,128,0.4)',
    particle: 'fog',
  },
  snowy: {
    label: 'Snowy',
    description: 'Silent snowfall, winter wonder',
    icon: CloudSnow,
    emoji: '❄️',
    bgStyle: {
      background: 'linear-gradient(180deg, #93c5fd 0%, #bfdbfe 30%, #dbeafe 60%, #f0f9ff 85%, #ffffff 100%)',
    },
    card: { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(186,230,253,0.5)' },
    nav: { background: 'rgba(219,234,254,0.75)', borderBottom: '1px solid rgba(186,230,253,0.4)', backdropFilter: 'blur(14px)' },
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    prose: '#1e3a5f',
    muted: 'rgba(30,58,95,0.45)',
    barFrom: '#60a5fa',
    barTo: '#a5f3fc',
    buttonBg: '#3b82f6',
    buttonText: '#ffffff',
    badgeBg: 'rgba(96,165,250,0.15)',
    badgeBorder: 'rgba(96,165,250,0.3)',
    badgeText: '#2563eb',
    ringColor: 'rgba(96,165,250,0.45)',
    particle: 'snow',
  },
  autumn: {
    label: 'Autumn',
    description: 'Falling leaves, warm harvest hues',
    icon: Leaf,
    emoji: '🍂',
    bgStyle: {
      background: 'linear-gradient(160deg, #431407 0%, #7c2d12 25%, #c2410c 50%, #d97706 75%, #fbbf24 100%)',
    },
    card: { background: 'rgba(194,65,12,0.18)', border: '1px solid rgba(251,191,36,0.22)' },
    nav: { background: 'rgba(67,20,7,0.85)', borderBottom: '1px solid rgba(251,191,36,0.2)', backdropFilter: 'blur(14px)' },
    accent: '#fb923c',
    accentRgb: '251,146,60',
    prose: '#fff7ed',
    muted: 'rgba(255,247,237,0.5)',
    barFrom: '#fb923c',
    barTo: '#fbbf24',
    buttonBg: '#ea580c',
    buttonText: '#fff7ed',
    badgeBg: 'rgba(251,146,60,0.18)',
    badgeBorder: 'rgba(251,146,60,0.35)',
    badgeText: '#fb923c',
    ringColor: 'rgba(251,146,60,0.45)',
    particle: 'leaves',
  },
  heatwave: {
    label: 'Heatwave',
    description: 'Scorching desert, mirages shimmer',
    icon: Flame,
    emoji: '🔥',
    bgStyle: {
      background: 'linear-gradient(170deg, #450a0a 0%, #7f1d1d 20%, #b91c1c 40%, #dc2626 58%, #f97316 80%, #fbbf24 100%)',
    },
    card: { background: 'rgba(127,29,29,0.25)', border: '1px solid rgba(251,146,60,0.2)' },
    nav: { background: 'rgba(69,10,10,0.88)', borderBottom: '1px solid rgba(251,146,60,0.18)', backdropFilter: 'blur(14px)' },
    accent: '#fbbf24',
    accentRgb: '251,191,36',
    prose: '#fff1f2',
    muted: 'rgba(255,241,242,0.5)',
    barFrom: '#fbbf24',
    barTo: '#ef4444',
    buttonBg: '#ef4444',
    buttonText: '#ffffff',
    badgeBg: 'rgba(239,68,68,0.18)',
    badgeBorder: 'rgba(251,191,36,0.3)',
    badgeText: '#fbbf24',
    ringColor: 'rgba(251,191,36,0.45)',
    particle: 'heat',
  },
  windy: {
    label: 'Windy',
    description: 'Gusts bending trees, wild sky',
    icon: Wind,
    emoji: '💨',
    bgStyle: {
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #059669 50%, #34d399 75%, #a7f3d0 100%)',
    },
    card: { background: 'rgba(6,95,70,0.22)', border: '1px solid rgba(52,211,153,0.22)' },
    nav: { background: 'rgba(6,78,59,0.85)', borderBottom: '1px solid rgba(52,211,153,0.2)', backdropFilter: 'blur(14px)' },
    accent: '#6ee7b7',
    accentRgb: '110,231,183',
    prose: '#ecfdf5',
    muted: 'rgba(236,253,245,0.5)',
    barFrom: '#6ee7b7',
    barTo: '#34d399',
    buttonBg: '#059669',
    buttonText: '#ffffff',
    badgeBg: 'rgba(110,231,183,0.15)',
    badgeBorder: 'rgba(110,231,183,0.3)',
    badgeText: '#6ee7b7',
    ringColor: 'rgba(110,231,183,0.45)',
    particle: 'wind',
  },
};

// ─── Auto-detect based on hour ────────────────────────────────────────────────

function autoDetectMood(hour) {
  if (hour >= 5  && hour < 7)  return 'dawn';
  if (hour >= 7  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 15) return 'afternoon';
  if (hour >= 15 && hour < 17) return 'golden_hour';
  if (hour >= 17 && hour < 20) return 'sunset';
  if (hour >= 20 && hour < 23) return 'night';
  return 'midnight';
}

// ─── Weather Particle Layers ─────────────────────────────────────────────────

function StarField({ count = 90, color = '#ffffff' }) {
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.2 + 0.4, delay: Math.random() * 5, dur: Math.random() * 3 + 2,
  })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <motion.div key={s.id} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: color }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function AuroraLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <StarField count={70} color="#a5f3fc" />
      {[
        { color: 'rgba(0,255,200,0.12)', top: '15%', width: '80%', left: '10%', delay: 0 },
        { color: 'rgba(120,80,255,0.10)', top: '25%', width: '60%', left: '20%', delay: 1.5 },
        { color: 'rgba(0,191,255,0.09)', top: '35%', width: '70%', left: '5%', delay: 3 },
      ].map((band, i) => (
        <motion.div key={i} className="absolute rounded-full blur-3xl"
          style={{ background: band.color, top: band.top, width: band.width, left: band.left, height: 80 }}
          animate={{ scaleX: [1, 1.15, 0.95, 1], opacity: [0.6, 1, 0.7, 0.6] }}
          transition={{ duration: 6 + i * 2, delay: band.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function RainLayer({ intensity = 60, color = 'rgba(147,197,253,0.55)', speed = 0.7 }) {
  const drops = useMemo(() => Array.from({ length: intensity }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 2,
    dur: Math.random() * speed + speed * 0.6, h: Math.random() * 16 + 8,
  })), [intensity, speed]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map(d => (
        <motion.div key={d.id} className="absolute w-px rounded-full"
          style={{ left: `${d.x}%`, height: d.h, top: -20,
            background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
          animate={{ y: ['0vh', '110vh'] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function DrizzleLayer() {
  return <RainLayer intensity={35} color="rgba(134,239,172,0.45)" speed={1.1} />;
}

function SnowLayer() {
  const flakes = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i, x: Math.random() * 100, size: Math.random() * 6 + 3,
    delay: Math.random() * 4, dur: Math.random() * 5 + 5, drift: Math.random() * 40 - 20,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map(f => (
        <motion.div key={f.id} className="absolute rounded-full bg-white/80"
          style={{ left: `${f.x}%`, width: f.size, height: f.size, top: -20 }}
          animate={{ y: ['0vh', '110vh'], x: [0, f.drift, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function LightningLayer() {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const cycle = () => {
      const wait = Math.random() * 5000 + 2000;
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 120);
        setTimeout(() => { setFlash(true); setTimeout(() => setFlash(false), 80); }, 180);
        cycle();
      }, wait);
    };
    cycle();
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <RainLayer intensity={75} color="rgba(200,210,220,0.5)" speed={0.55} />
      <AnimatePresence>
        {flash && (
          <motion.div key="flash" className="absolute inset-0 bg-white/8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          />
        )}
      </AnimatePresence>
      {/* bolt */}
      <motion.svg className="absolute top-0 right-1/4 pointer-events-none"
        width="60" height="200" viewBox="0 0 60 200"
        animate={{ opacity: flash ? 1 : 0 }} transition={{ duration: 0.05 }}
      >
        <polyline points="35,0 15,90 30,90 10,200" stroke="#fde047" strokeWidth="2.5"
          fill="none" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}

function CloudLayer({ count = 5, opacity = 0.22, fillColor = 'white', yRange = [3, 40] }) {
  const clouds = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, y: yRange[0] + Math.random() * (yRange[1] - yRange[0]),
    scale: Math.random() * 0.7 + 0.55, dur: Math.random() * 35 + 28,
    start: -(Math.random() * 35 + 15),
  })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map(c => (
        <motion.div key={c.id} className="absolute"
          style={{ top: `${c.y}%`, scale: c.scale, opacity }}
          animate={{ x: [`${c.start}vw`, '125vw'] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="180" height="68" viewBox="0 0 180 68" fill={fillColor}>
            <ellipse cx="90" cy="52" rx="80" ry="16" />
            <ellipse cx="60" cy="42" rx="40" ry="26" />
            <ellipse cx="108" cy="38" rx="46" ry="30" />
            <ellipse cx="135" cy="46" rx="32" ry="20" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="absolute w-full blur-2xl rounded-full"
          style={{ height: 80, top: `${15 + i * 18}%`,
            background: 'rgba(255,255,255,0.18)' }}
          animate={{ x: ['-10%', '8%', '-5%'], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  );
}

function SunGlow({ color = 'rgba(253,224,71,0.85)', shadow = 'rgba(253,224,71,0.35)' }) {
  return (
    <div className="absolute top-14 right-16 pointer-events-none">
      <motion.div className="w-32 h-32 rounded-full"
        style={{ background: color, boxShadow: `0 0 70px 35px ${shadow}` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}

function MoonGlow({ color = 'rgba(224,231,255,0.88)', shadow = 'rgba(165,180,252,0.22)' }) {
  return (
    <div className="absolute top-14 right-20 pointer-events-none">
      <motion.div className="w-24 h-24 rounded-full"
        style={{ background: color, boxShadow: `0 0 50px 25px ${shadow}` }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      {/* crescent mask */}
      <div className="absolute top-0 left-4 w-24 h-24 rounded-full"
        style={{ background: 'rgba(15,23,42,0.7)' }} />
    </div>
  );
}

function HeatHaze() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '35%' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute w-full blur-xl"
          style={{ height: 60, bottom: `${i * 28}px`, background: 'rgba(251,146,60,0.07)' }}
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}
    </div>
  );
}

function LeafParticles() {
  const leaves = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 6, dur: Math.random() * 6 + 5,
    rotate: Math.random() * 360, drift: Math.random() * 60 - 30,
    color: ['#ef4444','#f97316','#eab308','#d97706','#dc2626'][Math.floor(Math.random()*5)],
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map(l => (
        <motion.div key={l.id} className="absolute w-3 h-3 rounded-sm"
          style={{ left: `${l.x}%`, top: -20, background: l.color }}
          animate={{ y: ['0vh', '110vh'], x: [0, l.drift, -l.drift / 2, l.drift / 3],
            rotate: [l.rotate, l.rotate + 360] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function WindStreaks() {
  const streaks = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, y: Math.random() * 90, w: Math.random() * 120 + 60,
    delay: Math.random() * 2, dur: Math.random() * 1 + 0.8, opacity: Math.random() * 0.3 + 0.1,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map(s => (
        <motion.div key={s.id} className="absolute h-px rounded-full"
          style={{ top: `${s.y}%`, width: s.w, opacity: s.opacity,
            background: 'linear-gradient(to right, transparent, rgba(110,231,183,0.7), transparent)' }}
          animate={{ x: ['-20vw', '120vw'] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function GoldenDust() {
  const motes = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, delay: Math.random() * 5, dur: Math.random() * 4 + 3,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <SunGlow color="rgba(251,191,36,0.75)" shadow="rgba(249,115,22,0.3)" />
      {motes.map(m => (
        <motion.div key={m.id} className="absolute rounded-full"
          style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.size, height: m.size,
            background: 'rgba(253,224,71,0.7)' }}
          animate={{ opacity: [0, 1, 0], y: [0, -30, -60], x: [0, Math.random()*20-10] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function WeatherParticles({ particle }) {
  switch (particle) {
    case 'dawn':       return <><CloudLayer count={3} opacity={0.12} fillColor="rgba(251,146,60,0.9)" /><SunGlow color="rgba(249,115,22,0.6)" shadow="rgba(251,146,60,0.25)" /></>;
    case 'morning':    return <><SunGlow /><CloudLayer count={4} opacity={0.3} /></>;
    case 'afternoon':  return <><SunGlow /><CloudLayer count={5} opacity={0.35} /></>;
    case 'golden':     return <GoldenDust />;
    case 'sunset':     return <><CloudLayer count={4} opacity={0.18} fillColor="rgba(192,38,211,0.6)" /><StarField count={30} color="#e879f9" /></>;
    case 'stars':      return <><StarField count={90} /><MoonGlow /></>;
    case 'aurora':     return <AuroraLayer />;
    case 'storm':      return <LightningLayer />;
    case 'rain':       return <RainLayer />;
    case 'drizzle':    return <><DrizzleLayer /><CloudLayer count={6} opacity={0.25} fillColor="#6b7280" yRange={[0, 25]} /></>;
    case 'fog':        return <FogLayer />;
    case 'snow':       return <><SnowLayer /><CloudLayer count={5} opacity={0.28} fillColor="rgba(219,234,254,0.9)" /></>;
    case 'leaves':     return <LeafParticles />;
    case 'heat':       return <><SunGlow color="rgba(239,68,68,0.8)" shadow="rgba(239,68,68,0.35)" /><HeatHaze /></>;
    case 'wind':       return <WindStreaks />;
    default:           return null;
  }
}

// ─── Mood Picker ─────────────────────────────────────────────────────────────

function MoodPicker({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const theme = MOODS[current];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
        style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.badgeText }}
      >
        <span>{theme.emoji}</span>
        <span>{theme.label}</span>
        <ChevronDown size={11} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-10 z-[100] rounded-2xl shadow-2xl border overflow-hidden"
            style={{ background: 'rgba(10,10,20,0.96)', borderColor: 'rgba(255,255,255,0.1)', width: 280 }}
          >
            <div className="p-2 grid grid-cols-3 gap-1 max-h-72 overflow-y-auto">
              {Object.entries(MOODS).map(([key, mood]) => (
                <button
                  key={key}
                  onClick={() => { onChange(key); setOpen(false); }}
                  className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-center transition-all hover:scale-105"
                  style={{
                    background: key === current ? mood.badgeBg : 'transparent',
                    border: `1px solid ${key === current ? mood.badgeBorder : 'transparent'}`,
                  }}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: key === current ? mood.badgeText : 'rgba(255,255,255,0.6)' }}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

const NAV_ITEMS = ['about', 'skills', 'projects', 'experience', 'testimonials', 'contact'];

function Navbar({ theme, active, moodKey, onMoodChange }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 px-5 py-2.5 flex items-center justify-between transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}
      style={theme.nav}
    >
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="font-bold tracking-tight text-sm" style={{ color: theme.accent }}>
        {data.personal.name.split(' ')[0]}
        <span style={{ color: theme.muted }}>.dev</span>
      </button>

      <div className="hidden md:flex items-center gap-0.5">
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => scrollTo(item)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              color: active === item ? theme.accent : theme.muted,
              background: active === item ? `rgba(${theme.accentRgb},0.12)` : 'transparent',
            }}>
            {item}
          </button>
        ))}
      </div>

      <MoodPicker current={moodKey} onChange={onMoodChange} />
    </motion.nav>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ id, children }) {
  return (
    <motion.section id={id}
      initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-6 py-20"
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ theme, children }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-12" style={{ color: theme.prose }}>
      {children}<span style={{ color: theme.accent }}>.</span>
    </h2>
  );
}

// ─── Card helper ─────────────────────────────────────────────────────────────

function Card({ theme, children, className = '', hover = false }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-sm ${hover ? 'transition-transform duration-300 hover:scale-[1.02]' : ''} ${className}`}
      style={theme.card}
    >
      {children}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ theme, moodKey }) {
  const mood = MOODS[moodKey];
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden">
      <WeatherParticles particle={theme.particle} />

      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75 }} className="relative z-10 flex flex-col items-center">

        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border mb-8"
          style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.badgeText }}>
          <span>{mood.emoji}</span>
          <span>{mood.label} — {mood.description}</span>
        </motion.div>

        <motion.img src={data.personal.avatar} alt={data.personal.name}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          className="w-28 h-28 rounded-full object-cover mb-6 shadow-2xl"
          style={{ ring: 4, boxShadow: `0 0 0 4px ${theme.ringColor}, 0 20px 60px rgba(0,0,0,0.3)` }}
        />

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
          style={{ color: theme.prose }}>
          {data.personal.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl font-semibold mb-4" style={{ color: theme.accent }}>
          {data.personal.title}
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl text-sm md:text-base leading-relaxed mb-10"
          style={{ color: theme.muted }}>
          {data.personal.bio}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-3 justify-center mb-12">
          <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: theme.buttonBg, color: theme.buttonText }}>
            <Github size={15} /> GitHub
          </a>
          <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border hover:-translate-y-0.5 transition-all"
            style={{ ...theme.card, color: theme.prose }}>
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href={`mailto:${data.personal.email}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border hover:-translate-y-0.5 transition-all"
            style={{ ...theme.card, color: theme.prose }}>
            <Mail size={15} /> Email
          </a>
        </motion.div>

        <div className="grid grid-cols-3 gap-10">
          {[
            { label: 'Years Exp.', value: `${data.stats.yearsExperience}+` },
            { label: 'Projects',   value: `${data.stats.projectsCompleted}+` },
            { label: 'Clients',    value: `${data.stats.happyClients}+` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold" style={{ color: theme.accent }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: theme.muted }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 cursor-pointer" style={{ color: theme.muted }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About({ theme }) {
  return (
    <Section id="about">
      <SectionTitle theme={theme}>About Me</SectionTitle>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <p className="text-base leading-relaxed" style={{ color: theme.prose }}>{data.personal.bio}</p>
          {[{ icon: MapPin, text: data.personal.location }, { icon: Mail, text: data.personal.email }].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: theme.muted }}>
              <Icon size={14} style={{ color: theme.accent }} />{text}
            </div>
          ))}
        </div>
        <Card theme={theme} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Thermometer, label: 'Experience', val: `${data.stats.yearsExperience}+ Years` },
              { icon: Code2, label: 'Projects', val: `${data.stats.projectsCompleted}+ Built` },
              { icon: Wind, label: 'Clients', val: `${data.stats.happyClients}+ Served` },
              { icon: Droplets, label: 'Skills', val: `${data.skills.length} Tools` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="p-4 rounded-xl text-center"
                style={{ background: `rgba(${theme.accentRgb},0.08)` }}>
                <Icon size={20} className="mx-auto mb-2" style={{ color: theme.accent }} />
                <div className="text-xs mb-1" style={{ color: theme.muted }}>{label}</div>
                <div className="text-sm font-bold" style={{ color: theme.prose }}>{val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function Skills({ theme }) {
  const categories = useMemo(() => {
    const map = {};
    data.skills.forEach(s => { if (!map[s.category]) map[s.category] = []; map[s.category].push(s); });
    return map;
  }, []);

  return (
    <Section id="skills">
      <SectionTitle theme={theme}>Skills</SectionTitle>
      <div className="space-y-10">
        {Object.entries(categories).map(([cat, skills]) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: theme.muted }}>{cat}</h3>
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <motion.div key={skill.name}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: theme.prose }}>{skill.name}</span>
                    <span className="text-xs" style={{ color: theme.muted }}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `rgba(${theme.accentRgb},0.12)` }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${theme.barFrom}, ${theme.barTo})` }}
                      initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.07, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects({ theme }) {
  return (
    <Section id="projects">
      <SectionTitle theme={theme}>Projects</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        {data.projects.map((project, i) => (
          <motion.div key={project.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Card theme={theme} hover className="group overflow-hidden h-full flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img src={project.image} alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {project.featured && (
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-semibold"
                    style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.badgeText }}>
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: theme.prose }}>{project.title}</h3>
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: theme.muted }}>{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                      style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.badgeText }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5"
                    style={{ background: theme.buttonBg, color: theme.buttonText }}>
                    <ExternalLink size={12} /> Live
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:-translate-y-0.5"
                    style={{ ...theme.card, color: theme.prose }}>
                    <Github size={12} /> Code
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience({ theme }) {
  return (
    <Section id="experience">
      <SectionTitle theme={theme}>Experience</SectionTitle>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: `rgba(${theme.accentRgb},0.2)` }} />
        <div className="space-y-8 pl-10">
          {data.experience.map((exp, i) => (
            <motion.div key={exp.company}
              initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.14 }} className="relative">
              <div className="absolute -left-[2.3rem] top-2 w-3 h-3 rounded-full border-2"
                style={{ background: theme.accent, borderColor: theme.accent }} />
              <Card theme={theme} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: theme.prose }}>{exp.role}</h3>
                    <p className="text-sm font-semibold" style={{ color: theme.accent }}>{exp.company}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border"
                    style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.badgeText }}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>{exp.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials({ theme }) {
  return (
    <Section id="testimonials">
      <SectionTitle theme={theme}>Testimonials</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        {data.testimonials.map((t, i) => (
          <motion.div key={t.name}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <Card theme={theme} className="p-6 flex flex-col gap-4 h-full">
              <Quote size={20} style={{ color: theme.accent, opacity: 0.6 }} />
              <p className="text-sm leading-relaxed flex-1" style={{ color: theme.muted }}>{t.text}</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${theme.ringColor}` }} />
                <div>
                  <div className="text-sm font-bold" style={{ color: theme.prose }}>{t.name}</div>
                  <div className="text-xs" style={{ color: theme.muted }}>{t.role}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact({ theme }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
    outline: 'none', transition: 'box-shadow 0.2s',
    ...theme.card, color: theme.prose,
  };

  return (
    <Section id="contact">
      <SectionTitle theme={theme}>Get in Touch</SectionTitle>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-base leading-relaxed" style={{ color: theme.muted }}>
            Have a project in mind or just want to say hello? Drop a message and I'll get back to you.
          </p>
          {[
            { icon: Mail,     label: data.personal.email,  href: `mailto:${data.personal.email}` },
            { icon: Github,   label: 'GitHub',              href: data.socials.github },
            { icon: Linkedin, label: 'LinkedIn',            href: data.socials.linkedin },
            { icon: Twitter,  label: 'Twitter',             href: data.socials.twitter },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-medium transition-all hover:-translate-x-1"
              style={{ color: theme.prose }}>
              <span className="p-2 rounded-lg" style={{ background: `rgba(${theme.accentRgb},0.1)` }}>
                <Icon size={16} style={{ color: theme.accent }} />
              </span>
              {label}
            </a>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="thanks"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
              <Card theme={theme} className="flex flex-col items-center justify-center p-12 text-center">
                <Star size={40} className="mb-4" style={{ color: theme.accent }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: theme.prose }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: theme.muted }}>Thanks for reaching out. I'll reply soon.</p>
              </Card>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={e => { e.preventDefault(); if (form.name && form.email && form.message) setSent(true); }}
              className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input type="text" placeholder="Your Name" value={form.name} required
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle} />
              <input type="email" placeholder="Email Address" value={form.email} required
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle} />
              <textarea rows={5} placeholder="Your message…" value={form.message} required
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'none' }} />
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: theme.buttonBg, color: theme.buttonText }}>
                <Send size={14} /> Send Message
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function WeatherMood() {
  const [moodKey, setMoodKey] = useState(() => autoDetectMood(new Date().getHours()));
  const theme = MOODS[moodKey];
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_ITEMS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={moodKey}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-screen font-sans"
        style={theme.bgStyle}
      >
        <Navbar theme={theme} active={activeSection} moodKey={moodKey} onMoodChange={setMoodKey} />
        <Hero theme={theme} moodKey={moodKey} />
        <About theme={theme} />
        <Skills theme={theme} />
        <Projects theme={theme} />
        <Experience theme={theme} />
        <Testimonials theme={theme} />
        <Contact theme={theme} />

        <footer className="text-center py-10 text-xs border-t"
          style={{ color: theme.muted, borderColor: `rgba(${theme.accentRgb},0.12)` }}>
          <p>
            Crafted by{' '}
            <span className="font-semibold" style={{ color: theme.accent }}>{data.personal.name}</span>
            {' '}— mood shifts with the sky.
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
