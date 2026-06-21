import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Github,
  Layers,
  ArrowUpRight,
  Orbit,
  Rocket,
  Sun,
  Moon,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ─── Mobile state hook ─────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

/* ─── Theme token maps ────────────────────────────────────────────────────── */
const DARK_THEME = {
  bg:           '#080810',
  cardBg:       'linear-gradient(145deg, rgba(14,14,26,0.95) 0%, rgba(8,8,16,0.98) 100%)',
  cardBorder:   'rgba(240,234,216,0.08)',
  text:         '#f0ead8',
  textMuted:    'rgba(240,234,216,0.45)',
  textDim:      'rgba(240,234,216,0.22)',
  divider:      'rgba(240,234,216,0.06)',
  ruleGrad:     'linear-gradient(90deg, transparent, #f0ead8, transparent)',
  dropCap:      '#f0ead8',
  badgeBg:      'rgba(8,8,16,0.75)',
  badgeBorder:  'rgba(240,234,216,0.12)',
  imgOverlay:   'linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.92) 100%)',
  shadowCard:   '0 8px 30px rgba(0,0,0,0.5)',
  shadowHover:  (accent) => `0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px ${accent}44, 0 0 40px ${accent}20`,
  githubColor:  '#f0ead8',
  footerRule:   '#f0ead8',
  toggleBg:     'rgba(240,234,216,0.08)',
  toggleBorder: 'rgba(240,234,216,0.18)',
  toggleIcon:   '#f0ead8',
};

const LIGHT_THEME = {
  bg:           '#f5f0e8',
  cardBg:       'linear-gradient(145deg, #ffffff 0%, #faf7f2 100%)',
  cardBorder:   'rgba(26,26,26,0.10)',
  text:         '#1a1a1a',
  textMuted:    'rgba(26,26,26,0.55)',
  textDim:      'rgba(26,26,26,0.28)',
  divider:      'rgba(26,26,26,0.08)',
  ruleGrad:     'linear-gradient(90deg, transparent, #1a1a1a, transparent)',
  dropCap:      '#1a1a1a',
  badgeBg:      'rgba(245,240,232,0.85)',
  badgeBorder:  'rgba(26,26,26,0.15)',
  imgOverlay:   'linear-gradient(to bottom, transparent 40%, rgba(245,240,232,0.88) 100%)',
  shadowCard:   '0 4px 18px rgba(0,0,0,0.08)',
  shadowHover:  (accent) => `0 20px 50px rgba(0,0,0,0.14), 0 0 0 1px ${accent}44`,
  githubColor:  '#6b6760',
  footerRule:   '#1a1a1a',
  toggleBg:     'rgba(26,26,26,0.07)',
  toggleBorder: 'rgba(26,26,26,0.14)',
  toggleIcon:   '#1a1a1a',
};

/* ─── Keyframe CSS injected once ─────────────────────────────────────────── */
const KEYFRAME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes drift-0 {
    0%,100% { transform: translateY(0px) rotate(-2.5deg) scale(1); }
    33%      { transform: translateY(-10px) rotate(-1.2deg) scale(1.005); }
    66%      { transform: translateY(6px) rotate(-3.4deg) scale(0.997); }
  }
  @keyframes drift-1 {
    0%,100% { transform: translateY(0px) rotate(3deg) scale(1); }
    40%      { transform: translateY(9px) rotate(1.8deg) scale(1.008); }
    70%      { transform: translateY(-7px) rotate(4.1deg) scale(0.995); }
  }
  @keyframes drift-2 {
    0%,100% { transform: translateY(0px) rotate(-1.5deg) scale(1); }
    25%      { transform: translateY(-8px) rotate(-3deg) scale(1.006); }
    75%      { transform: translateY(5px) rotate(0.5deg) scale(0.998); }
  }
  @keyframes drift-3 {
    0%,100% { transform: translateY(0px) rotate(2.2deg) scale(1); }
    50%      { transform: translateY(-12px) rotate(0.8deg) scale(1.01); }
    80%      { transform: translateY(4px) rotate(3.5deg) scale(0.996); }
  }
  @keyframes drift-4 {
    0%,100% { transform: translateY(0px) rotate(-3deg) scale(1); }
    35%      { transform: translateY(8px) rotate(-1deg) scale(1.007); }
    65%      { transform: translateY(-9px) rotate(-4deg) scale(0.994); }
  }
  @keyframes drift-5 {
    0%,100% { transform: translateY(0px) rotate(1.5deg) scale(1); }
    45%      { transform: translateY(-6px) rotate(3deg) scale(1.005); }
    75%      { transform: translateY(7px) rotate(0.2deg) scale(0.998); }
  }
  @keyframes rule-drift {
    0%,100% { transform: translateX(0px) rotate(0deg); opacity: 0.12; }
    50%      { transform: translateX(40px) rotate(0.3deg); opacity: 0.07; }
  }
  @keyframes bottom-badge-drift {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    60%      { transform: translateY(-18px) rotate(1deg); }
  }
  @keyframes star-twinkle {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 0.15; }
  }
  @keyframes card-enter {
    from { opacity: 0; transform: translateY(80px) rotate(8deg) scale(0.88); }
    to   { opacity: 1; }
  }
  @keyframes masthead-slide {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ag-tag {
    letter-spacing: 0.06em;
    font-size: 0.6rem;
    text-transform: uppercase;
    font-weight: 600;
  }
`;

/* ─── Static star positions (stable across renders) ──────────────────────── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: (i * 137.508) % 100,
  y: (i * 97.321) % 100,
  r: 0.5 + (i % 3) * 0.5,
  delay: (i * 0.17) % 4,
  dur: 2 + (i % 5) * 0.6,
}));

/* ─── Per-card editorial config ──────────────────────────────────────────── */
const CARD_CONFIG = [
  { issue: 'No. 01', category: 'COVER STORY', accent: '#DC2626', accentLight: 'rgba(220,38,38,0.12)',   drift: 'drift-0', dur: '7.2s', delay: '0s'   },
  { issue: 'No. 02', category: 'FEATURE',     accent: '#B45309', accentLight: 'rgba(180,83,9,0.12)',    drift: 'drift-1', dur: '8.8s', delay: '1.1s' },
  { issue: 'No. 03', category: 'DISPATCH',    accent: '#166534', accentLight: 'rgba(22,101,52,0.12)',   drift: 'drift-2', dur: '6.5s', delay: '0.4s' },
  { issue: 'No. 04', category: 'EDITORIAL',   accent: '#6B21A8', accentLight: 'rgba(107,33,168,0.12)', drift: 'drift-3', dur: '9.3s', delay: '1.8s' },
  { issue: 'No. 05', category: 'SPOTLIGHT',   accent: '#0C4A6E', accentLight: 'rgba(12,74,110,0.12)',   drift: 'drift-4', dur: '7.9s', delay: '0.7s' },
  { issue: 'No. 06', category: 'LONG READ',   accent: '#9D174D', accentLight: 'rgba(157,23,77,0.12)',   drift: 'drift-5', dur: '8.1s', delay: '2.2s' },
  { issue: 'No. 07', category: 'OPEN SOURCE', accent: '#0E7490', accentLight: 'rgba(14,116,144,0.12)', drift: 'drift-0', dur: '8.4s', delay: '0.9s' },
  { issue: 'No. 08', category: 'ANALYTICS',   accent: '#A16207', accentLight: 'rgba(161,98,7,0.12)',    drift: 'drift-1', dur: '7.6s', delay: '1.5s' },
  { issue: 'No. 09', category: 'DESIGN SYS',  accent: '#4338CA', accentLight: 'rgba(67,56,202,0.12)',   drift: 'drift-2', dur: '9.1s', delay: '3.0s' },
  { issue: 'No. 10', category: 'DEV TOOLS',   accent: '#065F46', accentLight: 'rgba(6,95,70,0.12)',      drift: 'drift-3', dur: '6.8s', delay: '0.2s' },
];

const RULES = [
  { top: '14%', width: '38%', left: '5%',  rotate: '-1.2deg', delay: '0s',   dur: '9s'  },
  { top: '38%', width: '22%', left: '71%', rotate: '2.1deg',  delay: '3.5s', dur: '11s' },
  { top: '60%', width: '30%', left: '12%', rotate: '-0.6deg', delay: '1.8s', dur: '8s'  },
  { top: '82%', width: '18%', left: '62%', rotate: '1.5deg',  delay: '4.2s', dur: '12s' },
];

const DROP_CAPS = [
  { char: 'P', top: '8%',  left: '3%',  size: '22rem', opacity: 0.04,  delay: '0s',   dur: '14s' },
  { char: 'R', top: '40%', left: '72%', size: '18rem', opacity: 0.035, delay: '5s',   dur: '18s' },
  { char: 'J', top: '68%', left: '1%',  size: '16rem', opacity: 0.03,  delay: '2.5s', dur: '12s' },
];

/* ─── React SVG placeholders (no encoding issues, no external deps) ─────── */
function SvgPlaceholder({ index, accent, isHovered }) {
  const a = accent;
  const configs = [
    <svg key={0} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#1c1c2e" />
      <rect x="160" y="60" width="300" height="330" fill="#1a1a2e" rx="2" />
      <rect x="200" y="100" width="140" height="200" fill={a} opacity=".18" rx="1" />
      <circle cx="580" cy="140" r="80" fill={a} opacity=".08" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 01</text>
    </svg>,
    <svg key={1} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#161628" />
      <rect x="0" y="120" width="800" height="2" fill={a} opacity=".15" />
      <rect x="0" y="240" width="800" height="1" fill={a} opacity=".1" />
      <rect x="300" y="0" width="2" height="450" fill={a} opacity=".12" />
      <rect x="100" y="80" width="200" height="260" fill="#1e1e30" rx="1" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 02</text>
    </svg>,
    <svg key={2} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#0e1a0e" />
      <ellipse cx="400" cy="225" rx="250" ry="150" fill={a} opacity=".07" />
      <rect x="50" y="50" width="700" height="350" fill="none" stroke={a} strokeWidth="1" opacity=".12" rx="2" />
      <rect x="150" y="130" width="180" height="180" fill={a} opacity=".1" rx="1" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 03</text>
    </svg>,
    <svg key={3} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#1a0f2e" />
      <polygon points="400,30 750,420 50,420" fill={a} opacity=".08" />
      <rect x="320" y="100" width="3" height="250" fill={a} opacity=".3" />
      <rect x="250" y="200" width="150" height="2" fill={a} opacity=".25" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 04</text>
    </svg>,
    <svg key={4} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#141828" />
      <rect x="0" y="0" width="400" height="450" fill={a} opacity=".05" />
      <rect x="400" y="0" width="400" height="450" fill={a} opacity=".03" />
      <circle cx="200" cy="225" r="120" fill="none" stroke={a} strokeWidth="1" opacity=".2" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 05</text>
    </svg>,
    <svg key={5} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#1e0f1e" />
      <line x1="0" y1="0" x2="800" y2="450" stroke={a} strokeWidth="1" opacity=".15" />
      <line x1="800" y1="0" x2="0" y2="450" stroke={a} strokeWidth="1" opacity=".1" />
      <rect x="300" y="150" width="200" height="150" fill={a} opacity=".1" rx="1" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 06</text>
    </svg>,
    <svg key={6} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#0f1a20" />
      <rect x="60"  y="60"  width="100" height="330" fill={a} opacity=".12" />
      <rect x="180" y="120" width="100" height="270" fill={a} opacity=".08" />
      <rect x="300" y="80"  width="100" height="310" fill={a} opacity=".1"  />
      <rect x="420" y="150" width="100" height="240" fill={a} opacity=".07" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 07</text>
    </svg>,
    <svg key={7} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#201c10" />
      <circle cx="200" cy="100" r="60"  fill={a} opacity=".12" />
      <circle cx="500" cy="280" r="100" fill={a} opacity=".08" />
      <circle cx="700" cy="80"  r="40"  fill={a} opacity=".1"  />
      <circle cx="350" cy="360" r="55"  fill={a} opacity=".06" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 08</text>
    </svg>,
    <svg key={8} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#181830" />
      <rect x="100" y="100" width="600" height="250" fill="none" stroke={a} strokeWidth="1" opacity=".18" rx="3" />
      <rect x="150" y="150" width="500" height="150" fill="none" stroke={a} strokeWidth="1" opacity=".12" rx="2" />
      <rect x="200" y="190" width="200" height="70"  fill={a} opacity=".1"  rx="1" />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 09</text>
    </svg>,
    <svg key={9} viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="450" fill="#101e18" />
      <rect x="0"   y="150" width="800" height="3" fill={a} opacity=".2"  />
      <rect x="0"   y="300" width="800" height="1" fill={a} opacity=".12" />
      <rect x="200" y="0"   width="2"   height="450" fill={a} opacity=".15" />
      <rect x="600" y="0"   width="1"   height="450" fill={a} opacity=".1"  />
      <text x="400" y="430" fontFamily="Georgia,serif" fontStyle="italic" fontSize="11" fill="#fff" opacity=".2" textAnchor="middle">No. 10</text>
    </svg>,
  ];
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform 0.55s cubic-bezier(0.22,0.61,0.36,1)',
    }}>
      {configs[index % configs.length]}
    </div>
  );
}

/* ─── Isolated Layer Image Fallback Handler ──────────────────────────────── */
function ImgWithFallback({ src, alt, isHovered }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt || "Image"}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.55s cubic-bezier(0.22,0.61,0.36,1)',
        filter: 'brightness(0.75) contrast(1.05)',
      }}
    />
  );
}

function ProjectImage({ src, alt, index, accent, isHovered }) {
  const isValidSrc = Boolean(src) && typeof src === 'string' && src.trim().length > 0 && src.trim() !== '#';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Base Layer: Structural Theme-Compliant SVGs */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <SvgPlaceholder index={index} accent={accent} isHovered={isHovered} />
      </div>

      {/* Surface Layer: Remote Fetch */}
      {isValidSrc && (
        <ImgWithFallback
          key={src} // Dynamic key safely forces a clean state reset when src shifts
          src={src}
          alt={alt}
          isHovered={isHovered}
        />
      )}
    </div>
  );
}

/* ─── Fallback extra projects (no external image URLs) ───────────────────── */
const EXTRA = [
  {
    title: 'DevFlow CLI',
    description: 'A developer-first CLI toolkit that streamlines project scaffolding, git workflows, and deployment pipelines into one fast interface.',
    techStack: ['Node.js', 'Shell', 'Rust'],
    liveUrl: '#', githubUrl: '#',
    image: null,
  },
  {
    title: 'Prism Analytics',
    description: 'Real-time product analytics with funnel visualisation, cohort analysis, and AI-driven anomaly detection for growth teams.',
    techStack: ['React', 'ClickHouse', 'Python'],
    liveUrl: '#', githubUrl: '#',
    image: null,
  },
  {
    title: 'Tokens DS',
    description: 'A fully-featured design system and token management platform — sync design tokens between Figma, code, and CI in one command.',
    techStack: ['TypeScript', 'Figma API', 'Storybook'],
    liveUrl: '#', githubUrl: '#',
    image: null,
  },
  {
    title: 'Beacon Ops',
    description: 'Lightweight infrastructure observability for indie devs — uptime monitoring, log tailing, and alerting with zero-config setup.',
    techStack: ['Go', 'Prometheus', 'React'],
    liveUrl: '#', githubUrl: '#',
    image: null,
  },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Projects() {
  const [hoveredId, setHoveredId] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [mounted, setMounted] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const tag = document.createElement('style');
      tag.textContent = KEYFRAME_CSS;
      document.head.appendChild(tag);
      styleRef.current = tag;
    }
    const t = setTimeout(() => setMounted(true), 60);
    return () => {
      clearTimeout(t);
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  const projects = [...data.projects, ...EXTRA].slice(0, 10);

  return (
    <section
      style={{
        background: T.bg,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
        perspective: '1200px',
        transition: 'background 0.45s ease',
      }}
    >
      {/* ── Theme Toggle ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsDark(!isDark)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'fixed', top: '1.25rem', right: '1.5rem', zIndex: 100,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.45rem 0.9rem',
          background: T.toggleBg,
          border: `1px solid ${T.toggleBorder}`,
          borderRadius: '999px', cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.35s ease, border-color 0.35s ease',
          boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        {isDark
          ? <Sun size={13} color={T.toggleIcon} strokeWidth={2.2} />
          : <Moon size={13} color={T.toggleIcon} strokeWidth={2.2} />}
        <span style={{
          fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          fontWeight: 700, color: T.toggleIcon, fontFamily: "'DM Sans', sans-serif",
          transition: 'color 0.35s ease',
        }}>
          {isDark ? 'Light' : 'Dark'}
        </span>
      </button>

      {/* ── Star-field ───────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
        {STARS.map((s) => (
          <span key={s.id} style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: s.r * 2, height: s.r * 2, borderRadius: '50%',
            background: isDark ? '#fff' : '#1a1a1a',
            opacity: isDark ? 0.55 : 0.12,
            animation: `star-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            transition: 'opacity 0.45s ease',
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(240,234,216,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ── Floating rules ───────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} aria-hidden="true">
        {RULES.map((r, i) => (
          <div key={i} style={{
            position: 'absolute', top: r.top, left: r.left, width: r.width, height: 1,
            background: T.ruleGrad,
            transform: `rotate(${r.rotate})`,
            animation: `rule-drift ${r.dur} ${r.delay} ease-in-out infinite`,
            opacity: 0.1,
          }} />
        ))}
      </div>

      {/* ── Drop-cap letters ─────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }} aria-hidden="true">
        {DROP_CAPS.map((d, i) => (
          <span key={i} style={{
            position: 'absolute', top: d.top, left: d.left, fontSize: d.size,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic', fontWeight: 900,
            color: T.dropCap, opacity: d.opacity, lineHeight: 1, userSelect: 'none',
            animation: `bottom-badge-drift ${d.dur} ${d.delay} ease-in-out infinite`,
          }}>
            {d.char}
          </span>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>

        {/* Masthead */}
        <header style={{ textAlign: 'center', marginBottom: '4rem', animation: mounted ? 'masthead-slide 0.9s ease both' : 'none' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: T.text, opacity: 0.5, fontSize: '0.65rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1.2rem',
          }}>
            <Orbit size={11} /><span>Zero-G Portfolio</span><Orbit size={11} />
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 900, fontStyle: 'italic',
            color: T.text, lineHeight: 0.92, letterSpacing: '-0.02em',
            margin: '0 0 1.2rem', transition: 'color 0.45s ease',
          }}>
            Selected<br />
            <span style={{ color: '#DC2626', fontStyle: 'normal' }}>Works</span>
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, maxWidth: '200px', height: '1px', background: `linear-gradient(90deg, transparent, ${T.text})`, opacity: 0.25 }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.text, opacity: 0.4, fontWeight: 600 }}>Vol. 2026</span>
            <div style={{ flex: 1, maxWidth: '200px', height: '1px', background: `linear-gradient(90deg, ${T.text}, transparent)`, opacity: 0.25 }} />
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", color: T.text, opacity: 0.45,
            fontSize: '0.85rem', letterSpacing: '0.04em', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65,
            transition: 'color 0.45s ease',
          }}>
            Ten craft experiments, drifting in orbit. Each card a printed page — weightless, editorial, alive.
          </p>
        </header>

        {/* Card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          gap: '2rem', alignItems: 'start',
        }}>
          {projects.map((project, i) => {
            const cfg = CARD_CONFIG[i % CARD_CONFIG.length];
            return (
              <ProjectCard
                key={project.title}
                project={project}
                cfg={cfg}
                index={i}
                isHovered={hoveredId === i}
                mounted={mounted}
                animDelay={0.08 + i * 0.11}
                T={T}
                isDark={isDark}
                onMouseEnter={() => setHoveredId(i)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: T.footerRule, opacity: 0.2 }} />
          <Rocket size={14} color={T.footerRule} style={{ opacity: 0.2 }} />
          <div style={{ flex: 1, height: '1px', background: T.footerRule, opacity: 0.2 }} />
        </div>
        <p style={{
          textAlign: 'center', marginTop: '1rem', fontSize: '0.6rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: T.text, opacity: 0.22, fontWeight: 600, transition: 'color 0.45s ease',
        }}>
          Anti-Gravity Edition · {data.personal.name} · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────────── */
function ProjectCard({ project, cfg, index, isHovered, mounted, animDelay, T, isDark, onMouseEnter, onMouseLeave }) {
  const isMobile = useIsMobile();

  const cardStyle = {
    background: T.cardBg,
    border: `1px solid ${T.cardBorder}`,
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    animation: mounted
      ? `card-enter 0.7s ${animDelay}s cubic-bezier(0.22,0.61,0.36,1) both, ${cfg.drift} ${cfg.dur} ${cfg.delay} ease-in-out infinite`
      : 'none',
    animationPlayState: isHovered ? 'running, paused' : 'running, running',
    transform: isHovered ? 'translateY(-6px) rotate(0deg) scale(1.03)' : undefined,
    boxShadow: isHovered ? T.shadowHover(cfg.accent) : T.shadowCard,
    transition: isHovered
      ? 'transform 0.38s cubic-bezier(0.22,0.61,0.36,1), box-shadow 0.38s cubic-bezier(0.22,0.61,0.36,1), background 0.45s ease, border-color 0.45s ease'
      : 'box-shadow 0.4s ease, background 0.45s ease, border-color 0.45s ease',
    ...(isMobile && {
      animation: mounted ? `card-enter 0.7s ${animDelay}s cubic-bezier(0.22,0.61,0.36,1) both` : 'none',
      transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'none',
    }),
  };

  const hasRealImg = Boolean(project.image) && typeof project.image === 'string' && project.image.trim() !== '' && project.image.trim() !== '#';

  return (
    <article style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} aria-label={`Project: ${project.title}`}>
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: cfg.accent, opacity: isHovered ? 1 : 0.5, transition: 'opacity 0.3s ease',
      }} />

      {/* Accent wash */}
      <div style={{
        position: 'absolute', inset: 0, background: cfg.accentLight,
        opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none',
      }} />

      {/* Image Wrap */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <ProjectImage
          src={project.image}
          alt={project.title}
          index={index}
          accent={cfg.accent}
          isHovered={isHovered}
        />
        {hasRealImg && (
          <div style={{
            position: 'absolute', inset: 0, background: T.imgOverlay, transition: 'background 0.45s ease',
          }} />
        )}

        {/* Issue badge */}
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          background: T.badgeBg, backdropFilter: 'blur(6px)',
          border: `1px solid ${T.badgeBorder}`, borderRadius: '2px', padding: '0.2rem 0.55rem',
        }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: cfg.accent, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {cfg.issue}
          </span>
        </div>

        {/* Category badge */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: cfg.accent, borderRadius: '2px', padding: '0.18rem 0.5rem' }}>
          <span className="ag-tag" style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>{cfg.category}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.4rem 1.5rem 1.6rem' }}>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700,
          fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)', color: T.text, lineHeight: 1.18,
          letterSpacing: '-0.01em', marginBottom: '0.65rem',
          transform: isHovered ? 'none' : 'rotate(-0.3deg)',
          transition: 'color 0.45s ease, transform 0.35s ease',
        }}>
          {project.title}
        </h3>

        <div style={{
          width: isHovered ? '80px' : '32px', height: '1.5px', background: cfg.accent,
          marginBottom: '0.85rem', transition: 'width 0.4s cubic-bezier(0.22,0.61,0.36,1)',
        }} />

        <p style={{
          fontFamily: "'DM Sans', sans-serif", color: T.text, opacity: 0.55,
          fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '1.1rem',
          transition: 'color 0.45s ease',
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.4rem' }}>
          {project.techStack.map((tech) => (
            <span key={tech} className="ag-tag" style={{
              padding: '0.22rem 0.6rem',
              border: `1px solid ${cfg.accent}55`,
              borderRadius: '2px', color: cfg.accent,
              background: `${cfg.accent}0d`, fontFamily: "'DM Sans', sans-serif",
            }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ height: '1px', background: T.divider, marginBottom: '1.1rem', transition: 'background 0.45s ease' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                color: cfg.accent, fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <ExternalLink size={12} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                color: T.githubColor, opacity: 0.55, fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif", transition: 'color 0.45s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.55')}
            >
              <Github size={12} /> Code
            </a>
          </div>

          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            border: `1px solid ${cfg.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: cfg.accent,
            transform: isHovered ? 'rotate(45deg) scale(1.15)' : 'rotate(0deg)',
            transition: 'transform 0.35s cubic-bezier(0.22,0.61,0.36,1)',
            background: isHovered ? `${cfg.accent}18` : 'transparent',
          }}>
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>

      {/* Bottom decorative issue mark */}
      <div style={{ position: 'absolute', bottom: '0.6rem', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.2 }} aria-hidden="true">
        <Layers size={9} color={T.text} />
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: T.text, fontWeight: 600, textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.45s ease' }}>
          {cfg.issue}
        </span>
      </div>
    </article>
  );
}
