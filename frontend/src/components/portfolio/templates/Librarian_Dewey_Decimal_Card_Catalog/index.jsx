
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  parchment:   '#F5EDD8',
  cream:       '#EDE3C4',
  cardBg:      '#FBF7EE',
  mahogany:    '#4A2510',
  walnut:      '#6B3A28',
  brass:       '#B8870B',
  gold:        '#D4A017',
  ink:         '#1C1410',
  inkMid:      '#3D2B1F',
  inkLight:    '#6B5444',
  sage:        '#7A8C6E',
  border:      '#C8A96E',
  borderLight: '#DEC99E',
  accent:      '#8B1A1A',
  accentLight: '#A52929',
  accentGold:  '#C8960C',
  muted:       '#9A8674',
  shadow:      'rgba(74,37,16,0.15)',
  shadowDeep:  'rgba(74,37,16,0.35)',
  dark:        '#0A0603',
};

const DEWEY = {
  hero:       { call: '000', label: 'General Works' },
  about:      { call: '100', label: 'Biography & Personal Records' },
  skills:     { call: '300', label: 'Technical Classification Index' },
  projects:   { call: '500', label: 'Published Works & Studies' },
  experience: { call: '600', label: 'Professional Registry' },
  contact:    { call: '900', label: 'Contact Archives & Reference' },
};

const SKILL_DEWEY = {
  Frontend: { call: '600.1', label: 'Frontend Engineering' },
  Backend:  { call: '600.2', label: 'Backend Development' },
  DevOps:   { call: '600.3', label: 'Systems & Operations' },
  Design:   { call: '700.1', label: 'Applied Arts & Design' },
  Core:     { call: '000.1', label: 'General Computing' },
  Other:    { call: '600.9', label: 'Applied Technology' },
};

const NAV_SECTIONS = [
  { id: 'hero',       call: DEWEY.hero.call,       label: 'General Works'  },
  { id: 'about',      call: DEWEY.about.call,      label: 'Biography'      },
  { id: 'skills',     call: DEWEY.skills.call,     label: 'Index'          },
  { id: 'projects',   call: DEWEY.projects.call,   label: 'Works'          },
  { id: 'experience', call: DEWEY.experience.call, label: 'Registry'       },
  { id: 'contact',    call: DEWEY.contact.call,    label: 'Reference'      },
];

// ══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════════

function useSectionInView(margin = '-80px') {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

function useTypewriter(text = '', speed = 38, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) { setDisplayed(''); setDone(false); return; }
    setDisplayed(''); setDone(false);
    let destroyed = false;
    const t1 = setTimeout(() => {
      let i = 0;
      const t2 = setInterval(() => {
        if (destroyed) { clearInterval(t2); return; }
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(t2); setDone(true); }
      }, speed);
      return () => clearInterval(t2);
    }, startDelay);
    return () => { destroyed = true; clearTimeout(t1); };
  }, [text, speed, startDelay, enabled]);
  return { displayed, done };
}

function useMouseTilt(maxDeg = 8) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: ny * -maxDeg, y: nx * maxDeg });
  }, [maxDeg]);
  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);
  return { ref, tilt, handleMouseMove, handleMouseLeave };
}

function useActiveSection() {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const ids = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ══════════════════════════════════════════════════════════════════════════════

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

      @keyframes ldd-float-card {
        0%, 100% { transform: translateY(0px) rotate(var(--rot, -4deg)); }
        33%  { transform: translateY(-22px) rotate(calc(var(--rot, -4deg) + 2.5deg)); }
        66%  { transform: translateY(12px)  rotate(calc(var(--rot, -4deg) - 1.5deg)); }
      }
      @keyframes ldd-drift-num {
        0%, 100% { transform: translateX(0) translateY(0); opacity: var(--op, 0.04); }
        25%  { transform: translateX(-18px) translateY(-12px); opacity: calc(var(--op, 0.04) * 1.4); }
        75%  { transform: translateX(18px) translateY(10px);  opacity: calc(var(--op, 0.04) * 0.7); }
      }
      @keyframes ldd-rise-particle {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        15%  { opacity: var(--pop, 0.22); }
        80%  { opacity: calc(var(--pop, 0.22) * 0.5); }
        100% { transform: translateY(-90px) translateX(var(--drift, 8px)); opacity: 0; }
      }
      @keyframes ldd-stamp-pulse {
        0%, 100% { opacity: 0.035; transform: rotate(var(--rot, -12deg)) scale(1); }
        50%       { opacity: 0.055; transform: rotate(var(--rot, -12deg)) scale(1.04); }
      }
      @keyframes ldd-cursor-blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
      @keyframes ldd-seal-rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .ldd-root *, .ldd-root *::before, .ldd-root *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }
      .ldd-root {
        font-family: 'Libre Baskerville', Georgia, 'Times New Roman', serif;
        background-color: #F5EDD8; color: #1C1410;
        min-height: 100vh; position: relative; overflow-x: hidden;
      }
      .ldd-paper-texture {
        position: fixed; inset: 0; pointer-events: none; z-index: 1;
        background-image:
          radial-gradient(ellipse at 15% 85%, rgba(184,135,11,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(74,37,16,0.05) 0%, transparent 55%);
      }

      /* ── Floating Background ── */
      .ldd-fb-root { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
      .ldd-fb-card {
        position: absolute; width: 140px; height: 90px;
        border: 1px solid #C8A96E; border-radius: 2px; opacity: 0.06; background: transparent;
        animation: ldd-float-card var(--dur, 11s) ease-in-out infinite var(--delay, 0s);
      }
      .ldd-fb-card::before {
        content: ''; position: absolute; left: 10px; right: 10px; top: 22px; height: 1px;
        background: #C8A96E; box-shadow: 0 12px 0 #C8A96E, 0 24px 0 #C8A96E, 0 36px 0 #C8A96E;
      }
      .ldd-fb-num {
        position: absolute; font-family: 'Courier Prime', 'Courier New', monospace;
        font-size: 72px; font-weight: 700; color: #B8870B; opacity: var(--op, 0.04);
        letter-spacing: -2px; user-select: none;
        animation: ldd-drift-num var(--dur, 18s) ease-in-out infinite var(--delay, 0s);
      }
      .ldd-fb-dot {
        position: absolute; border-radius: 50%; background: #B8870B; opacity: var(--pop, 0.2);
        animation: ldd-rise-particle var(--dur, 7s) ease-in-out infinite var(--delay, 0s);
      }
      .ldd-fb-stamp {
        position: absolute; width: 100px; height: 100px; border-radius: 50%;
        border: 3px solid #8B1A1A; display: flex; align-items: center; justify-content: center;
        animation: ldd-stamp-pulse var(--dur, 8s) ease-in-out infinite var(--delay, 0s);
      }
      .ldd-fb-stamp-inner {
        font-family: 'Courier Prime', monospace; font-size: 9px; color: #8B1A1A;
        letter-spacing: 2.5px; text-transform: uppercase; text-align: center; line-height: 1.6;
      }

      /* ── Opening Sequence ── */
      .ldd-os-overlay {
        position: fixed; inset: 0; z-index: 9999; background: #0A0603;
        display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;
      }
      .ldd-os-eyebrow {
        font-family: 'Courier Prime', 'Courier New', monospace; font-size: 11px;
        color: #9A8674; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px;
      }
      .ldd-os-cabinet {
        width: min(560px, 90vw);
        background: linear-gradient(180deg, #3A1D0A 0%, #2A1208 100%);
        border: 2px solid #5C2E14; border-radius: 6px 6px 4px 4px; overflow: hidden;
        box-shadow: 0 0 0 1px #6B3A28, 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(184,135,11,0.05);
        position: relative;
      }
      .ldd-os-cabinet-header {
        background: linear-gradient(180deg, #5C2E14 0%, #4A2510 100%);
        padding: 14px 24px; border-bottom: 1px solid #6B3A28;
        display: flex; justify-content: space-between; align-items: center;
      }
      .ldd-os-cabinet-title {
        font-family: 'Courier Prime', monospace; font-size: 11px;
        color: #D4A017; letter-spacing: 3px; text-transform: uppercase;
      }
      .ldd-os-cabinet-num { font-family: 'Courier Prime', monospace; font-size: 10px; color: #9A8674; letter-spacing: 1.5px; }
      .ldd-os-drawer-container { position: relative; height: 240px; overflow: hidden; }
      .ldd-os-interior {
        position: absolute; inset: 0; background: #1A0C05;
        display: flex; align-items: flex-end; justify-content: center; gap: 12px; padding: 20px 24px;
      }
      .ldd-os-drawer-front {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, #5C2E14 0%, #4A2510 40%, #3A1D0A 100%);
        border-top: 1px solid #6B3A28; display: flex; align-items: center; justify-content: center;
        gap: 24px; z-index: 2;
        background-image: repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.01) 4px, rgba(255,255,255,0.01) 8px);
      }
      .ldd-os-label {
        background: #F5EDD8; border: 1px solid #C8A96E; padding: 6px 24px;
        font-family: 'Courier Prime', monospace; font-size: 12px; color: #3D2B1F;
        letter-spacing: 3px; text-align: center; min-width: 200px;
      }
      .ldd-os-handle {
        width: 70px; height: 14px;
        background: linear-gradient(135deg, #D4A017 0%, #8B6000 35%, #D4A017 65%, #C8960C 100%);
        border-radius: 7px; box-shadow: 0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2);
        flex-shrink: 0;
      }
      .ldd-os-card {
        width: 160px; background: #FBF7EE; border: 1px solid #C8A96E; border-radius: 2px;
        padding: 14px 16px; box-shadow: 2px 4px 16px rgba(0,0,0,0.4); position: relative; flex-shrink: 0;
      }
      .ldd-os-card--main { width: 200px; z-index: 2; }
      .ldd-os-card-line { height: 1px; background: #C8A96E; margin: 8px 0; opacity: 0.6; }
      .ldd-os-card-label {
        font-family: 'Courier Prime', monospace; font-size: 8px; color: #B8870B;
        letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;
      }
      .ldd-os-card-name { font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #1C1410; line-height: 1.2; }
      .ldd-os-card-role { font-family: 'Libre Baskerville', serif; font-size: 11px; color: #6B5444; font-style: italic; margin-top: 6px; line-height: 1.4; }
      .ldd-os-skip {
        position: absolute; bottom: 32px; right: 32px;
        font-family: 'Courier Prime', monospace; font-size: 11px; color: #6B5444;
        letter-spacing: 2px; text-transform: uppercase; background: none;
        border: 1px solid #3D2B1F; padding: 8px 16px; cursor: pointer; border-radius: 2px; transition: all 0.2s;
      }
      .ldd-os-skip:hover { color: #D4A017; border-color: #B8870B; background: rgba(184,135,11,0.06); }

      /* ── Library Navigation ── */
      .ldd-lib-nav {
        position: fixed; right: 0; top: 50%; transform: translateY(-50%);
        z-index: 50; display: flex; flex-direction: column; gap: 2px;
      }
      .ldd-lib-tab {
        display: flex; align-items: center; justify-content: flex-end;
        width: 52px; height: 46px; background: rgba(74,37,16,0.88);
        border: 1px solid transparent; border-right: none; border-radius: 4px 0 0 4px;
        cursor: pointer; overflow: hidden;
        transition: width 0.28s cubic-bezier(0.25,0.46,0.45,0.94), background 0.2s, border-color 0.2s;
        backdrop-filter: blur(8px); position: relative; white-space: nowrap;
      }
      .ldd-lib-tab:hover { width: 190px; background: rgba(74,37,16,0.96); border-color: rgba(184,135,11,0.4); }
      .ldd-lib-tab--active { background: rgba(90,45,20,0.95); border-color: #B8870B; border-left: 3px solid #B8870B; border-right: none; }
      .ldd-lib-tab-call {
        font-family: 'Courier Prime', 'Courier New', monospace; font-size: 12px; font-weight: 700;
        color: #B8870B; letter-spacing: 0.5px; padding: 0 14px 0 8px; flex-shrink: 0; min-width: 50px; text-align: right;
      }
      .ldd-lib-tab--active .ldd-lib-tab-call { color: #D4A017; }
      .ldd-lib-tab-label {
        font-family: 'Courier Prime', monospace; font-size: 10px; color: #DEC99E;
        letter-spacing: 1.5px; text-transform: uppercase; padding-right: 16px;
        opacity: 0; transition: opacity 0.15s 0.1s;
      }
      .ldd-lib-tab:hover .ldd-lib-tab-label { opacity: 1; }
      .ldd-lib-fab {
        display: none; position: fixed; bottom: 24px; right: 24px; z-index: 50;
        width: 56px; height: 56px; border-radius: 50%; background: #4A2510; border: 2px solid #B8870B;
        cursor: pointer; align-items: center; justify-content: center; flex-direction: column;
        box-shadow: 0 4px 20px rgba(28,20,16,0.5); transition: transform 0.2s, box-shadow 0.2s;
      }
      .ldd-lib-fab:hover { transform: scale(1.06); box-shadow: 0 6px 28px rgba(28,20,16,0.6); }
      .ldd-lib-fab-call { font-family: 'Courier Prime', monospace; font-size: 13px; font-weight: 700; color: #D4A017; line-height: 1; }
      .ldd-lib-fab-text { font-family: 'Courier Prime', monospace; font-size: 7px; color: #9A8674; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
      .ldd-lib-overlay { position: fixed; inset: 0; background: rgba(10,6,3,0.6); z-index: 48; cursor: pointer; }
      .ldd-lib-panel {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 49;
        background: linear-gradient(180deg, #4A2510 0%, #3A1D0A 100%);
        border-top: 2px solid #B8870B; padding: 20px 24px 32px;
        border-radius: 16px 16px 0 0; box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
      }
      .ldd-lib-panel-item {
        display: flex; align-items: center; gap: 14px; padding: 14px 8px;
        border-bottom: 1px solid rgba(200,169,110,0.15); cursor: pointer; transition: background 0.2s; border-radius: 4px;
      }
      .ldd-lib-panel-item:last-child { border-bottom: none; }
      .ldd-lib-panel-item:hover { background: rgba(184,135,11,0.06); }
      .ldd-lib-panel-call { font-family: 'Courier Prime', monospace; font-size: 14px; font-weight: 700; color: #B8870B; min-width: 40px; }
      .ldd-lib-panel-label { font-family: 'Courier Prime', monospace; font-size: 13px; color: #DEC99E; letter-spacing: 1px; text-transform: uppercase; }
      .ldd-lib-panel-active .ldd-lib-panel-label { color: #D4A017; }
      .ldd-lib-panel-active .ldd-lib-panel-call  { color: #D4A017; }

      /* ── Archival Heading ── */
      .ldd-arch-heading { margin-bottom: 56px; }
      .ldd-arch-call {
        font-family: 'Courier Prime', 'Courier New', monospace; font-size: 64px; font-weight: 700;
        color: #B8870B; line-height: 1; letter-spacing: -2px; opacity: 0.65; display: block; margin-bottom: 8px;
      }
      .ldd-arch-label {
        font-family: 'Courier Prime', monospace; font-size: 11px; color: #9A8674;
        letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px;
        display: flex; align-items: center; gap: 10px;
      }
      .ldd-arch-label::before { content: ''; display: inline-block; width: 20px; height: 1px; background: #C8A96E; }
      .ldd-arch-title {
        font-family: 'Playfair Display', Georgia, serif; font-size: clamp(28px, 4vw, 48px);
        font-weight: 600; color: #1C1410; line-height: 1.1; letter-spacing: -0.5px; min-height: 1.2em;
      }
      .ldd-cursor {
        display: inline-block; width: 2px; height: 0.85em; background: #B8870B;
        margin-left: 2px; vertical-align: text-bottom; animation: ldd-cursor-blink 0.7s steps(1) infinite;
      }
      .ldd-arch-rule {
        height: 1px; background: linear-gradient(90deg, #C8A96E 0%, rgba(200,169,110,0.2) 100%);
        margin-top: 20px; margin-bottom: 14px; width: 0;
      }
      .ldd-arch-subtitle { font-family: 'Courier Prime', monospace; font-size: 11px; color: #9A8674; letter-spacing: 2.5px; text-transform: uppercase; opacity: 0; }

      /* ── Cards ── */
      .ldd-tilt-wrapper { perspective: 900px; transform-style: preserve-3d; }
      .ldd-card {
        background: #FBF7EE; border: 1px solid #C8A96E; border-radius: 2px; position: relative;
        box-shadow: 2px 3px 14px rgba(74,37,16,0.1), 0 1px 3px rgba(74,37,16,0.06);
        transform-style: preserve-3d; transition: box-shadow 0.28s ease;
      }
      .ldd-card:hover { box-shadow: 5px 14px 38px rgba(74,37,16,0.22), 0 2px 8px rgba(74,37,16,0.1); }
      .ldd-card-pad { padding: 24px 28px; }
      .ldd-card-fold {
        position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
        background: linear-gradient(225deg, #EDE3C4 50%, transparent 50%);
        border-top: 1px solid #C8A96E; border-left: 1px solid #C8A96E;
      }

      /* ── Sections ── */
      .ldd-section { padding: 88px 64px; max-width: 1160px; margin: 0 auto; position: relative; z-index: 2; }

      /* ── Text Helpers ── */
      .ldd-meta-label { font-family: 'Courier Prime', 'Courier New', monospace; font-size: 10px; color: #B8870B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
      .ldd-card-title { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: #1C1410; line-height: 1.3; margin-bottom: 10px; }
      .ldd-card-body { font-family: 'Libre Baskerville', Georgia, serif; font-size: 14px; line-height: 1.78; color: #3D2B1F; }

      /* ── Tags ── */
      .ldd-tag {
        display: inline-block; font-family: 'Courier Prime', 'Courier New', monospace; font-size: 10px;
        color: #6B5444; background: #EDE3C4; border: 1px solid #C8A96E; padding: 2px 8px;
        border-radius: 2px; margin: 2px; letter-spacing: 0.5px; transition: all 0.2s;
      }
      .ldd-tag:hover { background: #4A2510; color: #D4A017; border-color: #B8870B; }

      /* ── Skills ── */
      .ldd-skill-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
      .ldd-skill-name { font-family: 'Libre Baskerville', Georgia, serif; font-size: 13px; color: #3D2B1F; min-width: 130px; flex-shrink: 0; }
      .ldd-skill-track { flex: 1; height: 6px; background: #EDE3C4; border-radius: 3px; overflow: hidden; border: 1px solid #DEC99E; }
      .ldd-skill-pct { font-family: 'Courier Prime', monospace; font-size: 10px; color: #9A8674; min-width: 34px; text-align: right; }

      /* ── Timeline ── */
      .ldd-timeline { position: relative; padding-left: 44px; }
      .ldd-timeline-line {
        position: absolute; left: 14px; top: 8px; width: 1px;
        background: linear-gradient(to bottom, #B8870B 0%, #C8A96E 60%, transparent 100%); transform-origin: top;
      }
      .ldd-timeline-item { position: relative; margin-bottom: 44px; }
      .ldd-timeline-item:last-child { margin-bottom: 0; }
      .ldd-timeline-dot {
        position: absolute; left: -36px; top: 8px; width: 12px; height: 12px;
        border-radius: 50%; background: #B8870B; border: 2px solid #F5EDD8; box-shadow: 0 0 0 1px #B8870B;
      }

      /* ── Contact ── */
      .ldd-contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
      .ldd-archive-seal {
        width: 110px; height: 110px; border-radius: 50%; border: 2px dashed #8B1A1A;
        display: flex; align-items: center; justify-content: center; opacity: 0.18;
        animation: ldd-seal-rotate 30s linear infinite; flex-shrink: 0;
      }
      .ldd-archive-seal-inner { font-family: 'Courier Prime', monospace; font-size: 8px; color: #8B1A1A; letter-spacing: 2px; text-transform: uppercase; text-align: center; line-height: 1.9; }

      /* ── Divider ── */
      .ldd-rule { border: none; border-top: 1px solid #C8A96E; margin: 0; position: relative; }
      .ldd-rule[data-sym]::before {
        content: attr(data-sym); position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%); background: #F5EDD8; padding: 0 20px;
        font-family: 'Courier Prime', monospace; font-size: 12px; color: #C8A96E; letter-spacing: 5px; white-space: nowrap;
      }

      /* ── Footer ── */
      .ldd-footer {
        background: #4A2510; border-top: 3px solid #B8870B; padding: 20px 64px;
        display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
        position: relative; z-index: 2;
        background-image: repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.012) 4px, rgba(255,255,255,0.012) 8px);
      }
      .ldd-footer-copy { font-family: 'Courier Prime', 'Courier New', monospace; font-size: 11px; color: #9A8674; letter-spacing: 1px; }
      .ldd-footer-badge { font-family: 'Courier Prime', monospace; font-size: 9px; color: #6B5444; letter-spacing: 1.5px; margin-top: 3px; }
      .ldd-footer-links { display: flex; gap: 6px; }
      .ldd-social { display: flex; align-items: center; color: #9A8674; padding: 6px; border: 1px solid transparent; border-radius: 2px; transition: all 0.2s; text-decoration: none; }
      .ldd-social:hover { color: #D4A017; border-color: #B8870B; background: rgba(184,135,11,0.08); }

      /* ── Responsive ── */
      @media (max-width: 1024px) {
        .ldd-section { padding: 72px 40px; }
        .ldd-footer  { padding: 20px 40px; }
        .ldd-arch-call { font-size: 52px; }
      }
      @media (max-width: 767px) {
        .ldd-lib-nav { display: none !important; }
        .ldd-lib-fab { display: flex !important; }
        .ldd-section { padding: 56px 20px; }
        .ldd-footer  { padding: 16px 20px; flex-direction: column; align-items: flex-start; }
        .ldd-arch-call  { font-size: 38px; }
        .ldd-arch-title { font-size: clamp(22px, 6vw, 32px); }
        .ldd-skill-name { min-width: 100px; font-size: 12px; }
        .ldd-os-skip    { bottom: 16px; right: 16px; }
        .ldd-os-cabinet-title { font-size: 9px; letter-spacing: 2px; }
      }
      @media (max-width: 480px) {
        .ldd-section { padding: 44px 16px; }
        .ldd-footer  { padding: 14px 16px; }
        .ldd-arch-call  { font-size: 30px; }
        .ldd-arch-heading { margin-bottom: 36px; }
      }
    `}</style>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FLOATING BACKGROUND
// ══════════════════════════════════════════════════════════════════════════════

const FLOAT_CARDS = [
  { left: '5%',  top: '15%', rot: '-6deg',  dur: '11s', delay: '0s'   },
  { left: '78%', top: '8%',  rot: '4deg',   dur: '13s', delay: '-4s'  },
  { left: '88%', top: '55%', rot: '-3deg',  dur: '9s',  delay: '-7s'  },
  { left: '3%',  top: '65%', rot: '7deg',   dur: '14s', delay: '-2s'  },
  { left: '55%', top: '80%', rot: '-5deg',  dur: '12s', delay: '-9s'  },
];
const DRIFT_NUMBERS = [
  { text: '000', left: '8%',  top: '20%', op: 0.038, dur: '22s', delay: '0s'   },
  { text: '100', left: '70%', top: '12%', op: 0.034, dur: '19s', delay: '-6s'  },
  { text: '300', left: '82%', top: '48%', op: 0.040, dur: '24s', delay: '-14s' },
  { text: '500', left: '12%', top: '72%', op: 0.036, dur: '21s', delay: '-9s'  },
  { text: '600', left: '48%', top: '85%', op: 0.032, dur: '18s', delay: '-3s'  },
  { text: '900', left: '60%', top: '35%', op: 0.035, dur: '26s', delay: '-17s' },
];
const FB_PARTICLES = [
  { left: '12%', top: '30%', size: 3, pop: 0.22, dur: '7s',  delay: '0s',   drift: '6px'   },
  { left: '25%', top: '65%', size: 2, pop: 0.18, dur: '9s',  delay: '-3s',  drift: '-4px'  },
  { left: '38%', top: '20%', size: 3, pop: 0.24, dur: '6s',  delay: '-5s',  drift: '8px'   },
  { left: '52%', top: '50%', size: 2, pop: 0.16, dur: '11s', delay: '-1s',  drift: '-6px'  },
  { left: '65%', top: '15%', size: 3, pop: 0.20, dur: '8s',  delay: '-7s',  drift: '5px'   },
  { left: '74%', top: '70%', size: 2, pop: 0.22, dur: '10s', delay: '-4s',  drift: '10px'  },
  { left: '85%', top: '40%', size: 3, pop: 0.18, dur: '7s',  delay: '-9s',  drift: '-7px'  },
  { left: '18%', top: '85%', size: 2, pop: 0.20, dur: '12s', delay: '-2s',  drift: '4px'   },
  { left: '44%', top: '75%', size: 3, pop: 0.16, dur: '9s',  delay: '-6s',  drift: '-5px'  },
  { left: '92%', top: '25%', size: 2, pop: 0.24, dur: '8s',  delay: '-11s', drift: '7px'   },
];
const FB_STAMPS = [
  { left: '6%',  top: '42%', rot: '-15deg', dur: '10s', delay: '0s'  },
  { left: '80%', top: '75%', rot: '8deg',   dur: '13s', delay: '-5s' },
];

function FloatingBackground() {
  return (
    <div className="ldd-fb-root" aria-hidden="true">
      {FLOAT_CARDS.map((c, i) => (
        <div key={`fc${i}`} className="ldd-fb-card" style={{ left: c.left, top: c.top, '--rot': c.rot, animationDuration: c.dur, animationDelay: c.delay }} />
      ))}
      {DRIFT_NUMBERS.map((n, i) => (
        <div key={`fn${i}`} className="ldd-fb-num" style={{ left: n.left, top: n.top, '--op': n.op, animationDuration: n.dur, animationDelay: n.delay }}>{n.text}</div>
      ))}
      {FB_PARTICLES.map((p, i) => (
        <div key={`fp${i}`} className="ldd-fb-dot" style={{ left: p.left, top: p.top, width: p.size, height: p.size, '--pop': p.pop, '--drift': p.drift, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
      {FB_STAMPS.map((s, i) => (
        <div key={`fs${i}`} className="ldd-fb-stamp" style={{ left: s.left, top: s.top, '--rot': s.rot, transform: `rotate(${s.rot})`, animationDuration: s.dur, animationDelay: s.delay }}>
          <div className="ldd-fb-stamp-inner">VERIFIED<br />ARCHIVE<br />RECORD</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OPENING SEQUENCE
// ══════════════════════════════════════════════════════════════════════════════

const OS_PHASES = { INIT: 0, OPEN: 1, CARDS: 2, ZOOM: 3, EXIT: 4 };

function OpeningSequence({ name, title, onComplete }) {
  const [phase, setPhase] = useState(OS_PHASES.INIT);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timers = [
      setTimeout(() => setPhase(OS_PHASES.OPEN),  420),
      setTimeout(() => setPhase(OS_PHASES.CARDS), 1400),
      setTimeout(() => setPhase(OS_PHASES.ZOOM),  2300),
      setTimeout(() => setPhase(OS_PHASES.EXIT),  3200),
    ];
    return () => { timers.forEach(clearTimeout); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (phase === OS_PHASES.EXIT) {
      const t = setTimeout(() => { document.body.style.overflow = ''; onComplete(); }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const skip = useCallback(() => { document.body.style.overflow = ''; onComplete(); }, [onComplete]);
  const exiting = phase === OS_PHASES.EXIT;

  return (
    <motion.div
      className="ldd-os-overlay"
      initial={{ opacity: 0 }}
      animate={exiting ? { opacity: 0, filter: 'blur(14px)' } : { opacity: 1, filter: 'blur(0px)' }}
      transition={exiting ? { duration: 0.75, ease: 'easeInOut' } : { duration: 0.5 }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60vw', height: '40vh', background: 'radial-gradient(ellipse, rgba(184,135,11,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <motion.div className="ldd-os-eyebrow" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
        Dewey Decimal Classification System
      </motion.div>
      <motion.div className="ldd-os-cabinet" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className="ldd-os-cabinet-header">
          <span className="ldd-os-cabinet-title">Professional Archive</span>
          <span className="ldd-os-cabinet-num">Entry No. 000.01</span>
        </div>
        <div className="ldd-os-drawer-container">
          <div className="ldd-os-interior">
            <AnimatePresence>
              {phase >= OS_PHASES.CARDS && phase < OS_PHASES.ZOOM && (
                <motion.div className="ldd-os-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -160, rotate: -12 }} transition={{ duration: 0.5 }} style={{ transform: 'rotate(-3deg)' }}>
                  <div className="ldd-os-card-label">Classification</div>
                  <div className="ldd-os-card-line" />
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.muted, letterSpacing: 1, lineHeight: 1.6 }}>000.01<br />General Works<br />Open Stacks</div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {phase >= OS_PHASES.CARDS && (
                <motion.div
                  className="ldd-os-card ldd-os-card--main"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={phase >= OS_PHASES.ZOOM ? { opacity: 1, y: 0, scale: 1.18, boxShadow: '0 20px 60px rgba(0,0,0,0.7)' } : { opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: phase >= OS_PHASES.ZOOM ? 0.6 : 0.55, delay: phase >= OS_PHASES.ZOOM ? 0 : 0.1, ease: phase >= OS_PHASES.ZOOM ? [0.34, 1.12, 0.64, 1] : [0.25, 0.46, 0.45, 0.94] }}
                  style={{ zIndex: 3 }}
                >
                  <div className="ldd-os-card-label">Primary Record</div>
                  <div className="ldd-os-card-line" />
                  <div className="ldd-os-card-name">{name}</div>
                  <div className="ldd-os-card-role">{title}</div>
                  <div className="ldd-os-card-line" />
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: C.brass, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>◈ Archive Access Granted</div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {phase >= OS_PHASES.CARDS && phase < OS_PHASES.ZOOM && (
                <motion.div className="ldd-os-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 160, rotate: 12 }} transition={{ delay: 0.15, duration: 0.5 }} style={{ transform: 'rotate(3deg)' }}>
                  <div className="ldd-os-card-label">Subject Index</div>
                  <div className="ldd-os-card-line" />
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.muted, letterSpacing: 1, lineHeight: 1.6 }}>Skills: 300<br />Works: 500<br />History: 600</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div className="ldd-os-drawer-front" animate={phase >= OS_PHASES.OPEN ? { y: '115%' } : { y: 0 }} transition={{ delay: 0.1, duration: 1.0, type: 'spring', stiffness: 110, damping: 20 }}>
            <div className="ldd-os-label">{name.toUpperCase()}</div>
            <div className="ldd-os-handle" />
          </motion.div>
        </div>
        <div style={{ height: 8, background: 'linear-gradient(180deg, #2A1208 0%, #1A0C05 100%)', borderTop: '1px solid #3A1D0A' }} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} style={{ marginTop: 32, fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: 'uppercase' }}>
        {phase < OS_PHASES.CARDS ? 'Opening archive…' : phase < OS_PHASES.ZOOM ? 'Locating records…' : 'Access granted…'}
      </motion.div>
      <motion.button className="ldd-os-skip" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} whileHover={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }} onClick={skip}>
        Skip Intro
      </motion.button>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LIBRARY NAVIGATION
// ══════════════════════════════════════════════════════════════════════════════

function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

function LibraryNav() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const current = NAV_SECTIONS.find(s => s.id === active) ?? NAV_SECTIONS[0];

  return (
    <>
      {/* Desktop right-side tabs */}
      <nav className="ldd-lib-nav" aria-label="Catalog navigation">
        {NAV_SECTIONS.map((s) => (
          <button key={s.id} className={`ldd-lib-tab${active === s.id ? ' ldd-lib-tab--active' : ''}`} onClick={() => scrollTo(s.id)} aria-label={`${s.call} — ${s.label}`}>
            <span className="ldd-lib-tab-label">{s.label}</span>
            <span className="ldd-lib-tab-call">{s.call}</span>
          </button>
        ))}
      </nav>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && <motion.div className="ldd-lib-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={() => setOpen(false)} />}
      </AnimatePresence>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div className="ldd-lib-panel" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 340, damping: 32 }} role="menu">
            <div style={{ width: 40, height: 4, background: 'rgba(200,169,110,0.4)', borderRadius: 2, margin: '0 auto 18px' }} />
            {NAV_SECTIONS.map((s) => (
              <div key={s.id} className={`ldd-lib-panel-item${active === s.id ? ' ldd-lib-panel-active' : ''}`} onClick={() => { scrollTo(s.id); setOpen(false); }} role="menuitem">
                <span className="ldd-lib-panel-call">{s.call}</span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(200,169,110,0.4)' }}>—</span>
                <span className="ldd-lib-panel-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <motion.button className="ldd-lib-fab" onClick={() => setOpen(v => !v)} aria-label="Open catalog navigation" whileTap={{ scale: 0.94 }}>
        <span className="ldd-lib-fab-call">{current.call}</span>
        <span className="ldd-lib-fab-text">INDEX</span>
      </motion.button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ARCHIVAL HEADING
// ══════════════════════════════════════════════════════════════════════════════

function ArchivalHeading({ call, label, title, subtitle, inView }) {
  const { displayed, done } = useTypewriter(title, 32, 360, inView);
  return (
    <div className="ldd-arch-heading">
      <motion.span className="ldd-arch-call" initial={{ scale: 2.4, opacity: 0, filter: 'blur(8px)' }} animate={inView ? { scale: 1, opacity: 0.65, filter: 'blur(0px)' } : {}} transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.05 }}>
        {call}
      </motion.span>
      <motion.div className="ldd-arch-label" initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.22, duration: 0.45 }}>
        {label}
      </motion.div>
      <div className="ldd-arch-title" aria-label={title}>
        {displayed}
        {inView && !done && <span className="ldd-cursor" aria-hidden="true" />}
      </div>
      <motion.div className="ldd-arch-rule" initial={{ width: 0 }} animate={inView ? { width: '100%' } : {}} transition={{ delay: 0.55, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} />
      {subtitle && (
        <motion.div className="ldd-arch-subtitle" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8, duration: 0.4 }}>
          {subtitle}
        </motion.div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED: TILT CARD WRAPPER
// ══════════════════════════════════════════════════════════════════════════════

function TiltCard({ children, className, style }) {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useMouseTilt(6);
  return (
    <div className="ldd-tilt-wrapper">
      <motion.div ref={ref} className={className} style={style} animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {children}
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO
// ══════════════════════════════════════════════════════════════════════════════

const HERO_CARD_VARIANTS = {
  hidden: (i) => ({ opacity: 0, y: 55 + i * 8, rotateX: -14 }),
  visible: (i) => ({ opacity: 1, y: 0, rotateX: 0, transition: { delay: 0.7 + i * 0.2, duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const HERO_PARTICLES = [
  { x:  7, y: 22, d: 0,   sz: 3, t: 5.2 }, { x: 16, y: 58, d: 1.1, sz: 2, t: 6.5 },
  { x: 32, y: 14, d: 0.7, sz: 3, t: 4.8 }, { x: 48, y: 44, d: 2.0, sz: 2, t: 7.1 },
  { x: 61, y: 18, d: 0.4, sz: 3, t: 5.6 }, { x: 75, y: 66, d: 1.7, sz: 2, t: 6.0 },
  { x: 86, y: 32, d: 2.9, sz: 3, t: 4.6 }, { x: 42, y: 78, d: 1.8, sz: 2, t: 7.3 },
  { x: 93, y: 50, d: 0.6, sz: 3, t: 5.9 }, { x: 22, y: 88, d: 3.2, sz: 2, t: 6.8 },
  { x: 57, y: 92, d: 1.4, sz: 3, t: 5.1 }, { x: 70, y: 10, d: 2.5, sz: 2, t: 7.5 },
];

function HeroBtn({ children, onClick, primary, as: Tag = 'button', ...rest }) {
  const [hov, setHov] = useState(false);
  return (
    <Tag style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', cursor: 'pointer', borderRadius: 2, textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s', border: `1px solid ${primary ? C.brass : C.border}`, background: primary ? (hov ? C.walnut : C.mahogany) : (hov ? 'rgba(74,37,16,0.05)' : 'transparent'), color: primary ? (hov ? C.gold : '#F5EDD8') : (hov ? C.accent : C.inkMid), borderColor: hov ? C.brass : (primary ? C.brass : C.border) }} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} {...rest}>
      {children}
    </Tag>
  );
}

function Hero({ data, onScrollTo }) {
  const { personal, stats, socials } = data;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [idleFloat, setIdleFloat] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setDrawerOpen(true), 260);
    const t2 = setTimeout(() => setIdleFloat(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const { displayed: nameTyped, done: nameDone } = useTypewriter(personal.name, 42, 1050, drawerOpen);

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(40px,8vh,100px) clamp(20px,5vw,80px)', position: 'relative', overflow: 'hidden', background: `linear-gradient(155deg, ${C.parchment} 0%, ${C.cream} 55%, #E8D9BE 100%)` }}>
      {HERO_PARTICLES.map((p, i) => (
        <motion.div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.sz, height: p.sz, borderRadius: '50%', background: C.brass, opacity: 0, pointerEvents: 'none' }} animate={{ y: [0,-18,6,-10,0], opacity: [0,0.32,0.2,0.38,0] }} transition={{ duration: p.t, repeat: Infinity, ease: 'easeInOut', delay: p.d }} />
      ))}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', opacity: 0.045, pointerEvents: 'none', background: `repeating-linear-gradient(90deg,${C.mahogany} 0px,${C.mahogany} 18px,${C.walnut} 18px,${C.walnut} 36px,${C.mahogany} 36px,${C.mahogany} 50px,#3A1D0A 50px,#3A1D0A 64px,${C.walnut} 64px,${C.walnut} 76px)` }} />
      <div style={{ maxWidth: 940, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.inkLight, letterSpacing: 3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Dewey Decimal Archive System</div>
          <div style={{ flex: 1, height: 1, background: C.border, minWidth: 20 }} />
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.brass, letterSpacing: 2, whiteSpace: 'nowrap' }}>{DEWEY.hero.call} — {DEWEY.hero.label}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }} style={{ background: `linear-gradient(180deg,#5C2E14 0%,${C.mahogany} 40%,#3A1D0A 100%)`, borderRadius: '4px 4px 0 0', padding: '14px 28px 0', border: `2px solid ${C.walnut}`, borderBottom: 'none', position: 'relative', overflow: 'hidden' }}>
          {[12,28,44,60,76].map(l => <div key={l} style={{ position: 'absolute', top: 0, bottom: 0, left: `${l}%`, width: 1, background: 'rgba(255,255,255,0.015)' }} />)}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ background: C.parchment, border: `1px solid ${C.border}`, padding: '5px 20px', fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.inkMid, letterSpacing: 3, minWidth: 220, textAlign: 'center' }}>{personal.name.toUpperCase()}</div>
            <motion.div animate={drawerOpen ? { y: [0,4,0] } : {}} transition={{ delay: 0.45, duration: 0.3 }} style={{ width: 64, height: 13, background: `linear-gradient(135deg,#D4A017 0%,#8B6000 35%,#D4A017 60%,#C8960C 100%)`, borderRadius: 7, boxShadow: '0 3px 8px rgba(0,0,0,0.45)', flexShrink: 0 }} />
          </div>
          <div style={{ height: 18 }} />
        </motion.div>
        <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: drawerOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }} transition={{ delay: 0.4, duration: 0.75, ease: [0.25,0.46,0.45,0.94] }} style={{ background: `linear-gradient(to bottom,${C.walnut} 0%,${C.walnut}BB 100%)`, border: `2px solid ${C.walnut}`, borderTop: `1px solid rgba(200,169,110,0.4)`, padding: '28px 24px' }}>
          <motion.div animate={idleFloat ? { y: [0,-5,0] } : {}} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <motion.div custom={0} initial="hidden" animate="visible" variants={HERO_CARD_VARIANTS} className="ldd-card" style={{ borderLeft: `5px solid ${C.accent}` }}>
              <div className="ldd-card-fold" /><div className="ldd-card-pad">
                <div className="ldd-meta-label">Catalog Entry No. 000.01 — Primary Subject Record</div>
                <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(28px,5.5vw,68px)', fontWeight: 700, color: C.ink, lineHeight: 1.05, letterSpacing: '-1px', minHeight: '1.1em' }}>
                  {nameTyped}{drawerOpen && !nameDone && <span className="ldd-cursor" aria-hidden="true" />}
                </h1>
                <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: C.muted, letterSpacing: 2, marginTop: 10, textTransform: 'uppercase' }}>Subject: Professional Portfolio Archive</div>
              </div>
            </motion.div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={HERO_CARD_VARIANTS} className="ldd-card" style={{ borderLeft: `5px solid ${C.brass}` }}>
              <div className="ldd-card-fold" /><div className="ldd-card-pad">
                <div className="ldd-meta-label">Classification: Professional Title</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 'clamp(15px,2.4vw,22px)', fontStyle: 'italic', color: C.inkMid, lineHeight: 1.4 }}>{personal.title}</div>
              </div>
            </motion.div>
            <motion.div custom={2} initial="hidden" animate="visible" variants={HERO_CARD_VARIANTS} className="ldd-card" style={{ borderLeft: `5px solid ${C.sage}` }}>
              <div className="ldd-card-fold" /><div className="ldd-card-pad" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: '1 1 280px' }}>
                  <div className="ldd-meta-label">Abstract</div>
                  <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 15, color: C.inkMid, fontStyle: 'italic', lineHeight: 1.6 }}>"{personal.tagline}"</div>
                  {personal.location && <div style={{ marginTop: 12, fontFamily: "'Courier Prime',monospace", fontSize: 11, color: C.inkLight, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: C.brass }}>◈</span>{personal.location}</div>}
                </div>
                <div style={{ display: 'flex', gap: 28, flexShrink: 0 }}>
                  {[{ v: stats?.yearsExperience??5, l:'Years'},{v:stats?.projectsCompleted??48,l:'Works'},{v:stats?.happyClients??32,l:'Clients'}].map(({ v, l }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{v}</div>
                      <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {personal.avatar && (
              <motion.div custom={3} initial="hidden" animate="visible" variants={HERO_CARD_VARIANTS} className="ldd-card" style={{ borderLeft: `5px solid ${C.accentGold}` }}>
                <div className="ldd-card-fold" /><div className="ldd-card-pad" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <motion.div initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }} style={{ perspective: '500px', flexShrink: 0 }}>
                    <img src={personal.avatar} alt={personal.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2, filter: 'sepia(28%) contrast(1.08)', border: `1px solid ${C.border}`, boxShadow: `2px 3px 10px ${C.shadow}` }} />
                  </motion.div>
                  <div>
                    <div className="ldd-meta-label">Archive Photograph</div>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 13, color: C.inkMid, fontStyle: 'italic' }}>Identified specimen — {personal.name}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }} style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <HeroBtn onClick={() => onScrollTo('about')} primary>Browse Catalog</HeroBtn>
          {socials?.github   && <HeroBtn as="a" href={socials.github}   target="_blank" rel="noreferrer">View Archive</HeroBtn>}
          {socials?.linkedin && <HeroBtn as="a" href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn Record</HeroBtn>}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ABOUT
// ══════════════════════════════════════════════════════════════════════════════

function About({ data }) {
  const { personal, stats } = data;
  const { ref, inView } = useSectionInView();
  return (
    <section id="about" className="ldd-section" ref={ref}>
      <ArchivalHeading call={DEWEY.about.call} label={DEWEY.about.label} title="Personal Records" subtitle="Subject Biography & Archival Metadata" inView={inView} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(180px,260px)', gap: 24 }}>
        <motion.div initial={{ opacity: 0, x: -80, rotateY: -15 }} animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}} transition={{ delay: 0.2, duration: 0.7, ease: [0.25,0.46,0.45,0.94] }} style={{ perspective: '800px' }}>
          <TiltCard className="ldd-card" style={{ borderLeft: `5px solid ${C.accent}`, height: '100%' }}>
            <div className="ldd-card-fold" /><div className="ldd-card-pad">
              <div className="ldd-meta-label">Catalog Entry 100.1 — Subject Biography</div>
              <div className="ldd-card-title">{personal.name}</div>
              <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, paddingBottom: 16, borderBottom: `1px dashed ${C.borderLight}` }}>{personal.title}</div>
              <div style={{ marginBottom: 12 }}><div className="ldd-meta-label">Abstract</div><p className="ldd-card-body">{personal.bio}</p></div>
              {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.borderLight}`, fontFamily: "'Courier Prime',monospace", fontSize: 12, color: C.inkLight }}><span style={{ color: C.brass, fontSize: 14 }}>◈</span>{personal.location}</div>}
            </div>
          </TiltCard>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.32, duration: 0.65, ease: [0.25,0.46,0.45,0.94] }}>
            <TiltCard className="ldd-card" style={{ borderLeft: `5px solid ${C.brass}` }}>
              <div className="ldd-card-fold" /><div className="ldd-card-pad">
                <div className="ldd-meta-label">Archive Statistics</div>
                {[{l:'Years of Practice',v:stats?.yearsExperience??5},{l:'Works Published',v:stats?.projectsCompleted??48},{l:'Collaborators',v:stats?.happyClients??32}].map(({ l, v }, idx) => (
                  <motion.div key={l} initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.45 + idx * 0.1, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px dashed ${C.borderLight}` }}>
                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 12, color: C.inkLight, lineHeight: 1.3 }}>{l}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: C.accent, lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>{v}</div>
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -8 }} animate={inView ? { opacity: 0.82, scale: 1, rotate: -5 } : {}} transition={{ delay: 0.55, duration: 0.55, ease: [0.34,1.56,0.64,1] }} style={{ padding: '18px 16px', border: `2px solid ${C.accent}`, borderRadius: 3, textAlign: 'center', background: C.cardBg, transform: 'rotate(-5deg)' }}>
            <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 10, color: C.accent, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 2.0 }}>◈ VERIFIED RECORD ◈<br />{new Date().getFullYear()}<br />OPEN STACKS</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SKILLS
// ══════════════════════════════════════════════════════════════════════════════

function SkillBar({ skill, index, inView }) {
  return (
    <div className="ldd-skill-row">
      <div className="ldd-skill-name">{skill.name}</div>
      <div className="ldd-skill-track">
        <motion.div style={{ height: '100%', background: `linear-gradient(90deg,${C.brass} 0%,${C.gold} 100%)`, borderRadius: 3 }} initial={{ width: 0 }} animate={inView ? { width: `${skill.level??75}%` } : { width: 0 }} transition={{ duration: 0.92, delay: 0.1 + index * 0.05, ease: 'easeOut' }} />
      </div>
      <div className="ldd-skill-pct">{skill.level??75}%</div>
    </div>
  );
}

function SkillCategory({ category, skills, deweyEntry, groupIndex, inView }) {
  const { ref: catRef, inView: catInView } = useSectionInView('-40px');
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useMouseTilt(5);
  return (
    <motion.div ref={catRef} initial={{ opacity: 0, y: -38, rotateX: -18 }} animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ delay: 0.08 * groupIndex, duration: 0.65, type: 'spring', stiffness: 200, damping: 22 }} style={{ perspective: '800px' }}>
      <div className="ldd-tilt-wrapper">
        <motion.div ref={ref} className="ldd-card" style={{ borderTop: `3px solid ${C.brass}` }} animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="ldd-card-pad">
            <motion.div initial={{ opacity: 0, rotateX: -45 }} animate={inView ? { opacity: 1, rotateX: 0 } : {}} transition={{ delay: 0.1 + 0.08 * groupIndex, duration: 0.5 }} style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.borderLight}` }}>
              <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 22, fontWeight: 700, color: C.brass, opacity: 0.72, lineHeight: 1, letterSpacing: '-0.5px' }}>{deweyEntry?.call??'600.9'}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 600, color: C.ink }}>{category}</div>
                <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>{deweyEntry?.label??'Applied Technology'}</div>
              </div>
            </motion.div>
            {skills.map((skill, i) => <SkillBar key={skill.name} skill={skill} index={i} inView={catInView} />)}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Skills({ skills }) {
  const { ref, inView } = useSectionInView();
  const grouped = skills.reduce((acc, skill) => { const cat = skill.category||'Other'; if (!acc[cat]) acc[cat]=[]; acc[cat].push(skill); return acc; }, {});
  const categories = Object.entries(grouped);
  return (
    <section id="skills" className="ldd-section" ref={ref}>
      <ArchivalHeading call={DEWEY.skills.call} label={DEWEY.skills.label} title="Technical Index" subtitle="Classified by Dewey Decimal Schema" inView={inView} />
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.12, duration: 0.5 }} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
        {categories.map(([cat]) => { const d = SKILL_DEWEY[cat]??SKILL_DEWEY.Other; return <div key={cat} style={{ fontFamily: "'Courier Prime',monospace", fontSize: 10, color: C.inkLight, background: C.cream, border: `1px solid ${C.border}`, padding: '4px 12px', borderRadius: 2, letterSpacing: 1, display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ color: C.brass, fontWeight: 700 }}>{d.call}</span><span style={{ opacity: 0.5 }}>—</span><span>{cat}</span></div>; })}
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
        {categories.map(([cat, catSkills], idx) => <SkillCategory key={cat} category={cat} skills={catSkills} deweyEntry={SKILL_DEWEY[cat]} groupIndex={idx} inView={inView} />)}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════════════════════

function ProjectCard({ project, index, inView }) {
  const [hov, setHov] = useState(false);
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useMouseTilt(7);
  const refNum = String(index + 1).padStart(3, '0');
  const techStack = project.techStack??project.technologies??project.tech??[];
  return (
    <motion.div initial={{ opacity: 0, y: 60, scaleY: 0.88 }} animate={inView ? { opacity: 1, y: 0, scaleY: 1 } : {}} transition={{ delay: 0.08 + index * 0.1, duration: 0.65, type: 'spring', stiffness: 180, damping: 22 }} style={{ perspective: '800px' }}>
      <div className="ldd-tilt-wrapper">
        <motion.div ref={ref} className="ldd-card" style={{ borderTop: `3px solid ${hov ? C.accent : C.border}`, display: 'flex', flexDirection: 'column', transition: 'border-color 0.25s', cursor: 'default' }} animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} onMouseMove={handleMouseMove} onMouseLeave={() => { handleMouseLeave(); setHov(false); }} onMouseEnter={() => setHov(true)}>
          <div className="ldd-card-fold" />
          {project.image && (
            <div style={{ height: 160, overflow: 'hidden', borderBottom: `1px solid ${C.borderLight}`, position: 'relative' }}>
              <motion.img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: `sepia(20%) contrast(1.05)` }} animate={{ scale: hov ? 1.06 : 1 }} transition={{ duration: 0.4 }} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.22 }} style={{ position: 'absolute', inset: 0, background: 'rgba(74,37,16,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 13, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', border: `1px solid ${C.gold}`, padding: '8px 20px', borderRadius: 2 }}>Open Archive</div>
              </motion.div>
              <div style={{ position: 'absolute', top: 10, left: 12, background: C.mahogany, color: C.gold, fontFamily: "'Courier Prime',monospace", fontSize: 10, letterSpacing: 2, padding: '3px 10px', borderRadius: 2, border: `1px solid ${C.brass}` }}>REF. 500.{refNum}</div>
            </div>
          )}
          <div className="ldd-card-pad" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!project.image && <div className="ldd-meta-label">REF. 500.{refNum} — Archived Publication</div>}
            <div className="ldd-card-title" style={{ marginTop: project.image ? 8 : 4 }}>{project.title}</div>
            <div style={{ height: 1, background: C.borderLight, marginBottom: 12 }} />
            <div style={{ marginBottom: 4 }}><div className="ldd-meta-label">Abstract</div><p className="ldd-card-body" style={{ fontSize: 13 }}>{project.description}</p></div>
            {techStack.length > 0 && <div style={{ marginTop: 14 }}><div className="ldd-meta-label">Keywords</div><div style={{ marginTop: 4 }}>{techStack.map(t => <span key={t} className="ldd-tag">{t}</span>)}</div></div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${C.borderLight}` }}>
              {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent, textDecoration: 'none', borderBottom: `1px solid ${C.accent}`, paddingBottom: 1 }} onMouseEnter={e=>e.currentTarget.style.color=C.accentLight} onMouseLeave={e=>e.currentTarget.style.color=C.accent}>View Archive →</a>}
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: C.inkLight, textDecoration: 'none', borderBottom: `1px solid ${C.border}`, paddingBottom: 1 }} onMouseEnter={e=>e.currentTarget.style.color=C.brass} onMouseLeave={e=>e.currentTarget.style.color=C.inkLight}>Source Code →</a>}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Projects({ projects }) {
  const { ref, inView } = useSectionInView();
  return (
    <section id="projects" className="ldd-section" ref={ref}>
      <ArchivalHeading call={DEWEY.projects.call} label={DEWEY.projects.label} title="Published Works" subtitle="Archived publications and research studies" inView={inView} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
        {projects.map((project, i) => <ProjectCard key={project.title??i} project={project} index={i} inView={inView} />)}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE
// ══════════════════════════════════════════════════════════════════════════════

function ExperienceEntry({ entry, index }) {
  const { ref, inView } = useSectionInView('-40px');
  const { ref: tiltRef, tilt, handleMouseMove, handleMouseLeave } = useMouseTilt(4);
  const entryNum = String(index + 1).padStart(2, '0');
  return (
    <motion.div ref={ref} className="ldd-timeline-item" initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.04 * index, duration: 0.62, ease: [0.25,0.46,0.45,0.94] }}>
      <motion.div className="ldd-timeline-dot" initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 0.06 + 0.04 * index, type: 'spring', stiffness: 340, damping: 22 }} />
      <div className="ldd-tilt-wrapper">
        <motion.div ref={tiltRef} className="ldd-card" style={{ borderLeft: `5px solid ${C.brass}` }} animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="ldd-card-fold" /><div className="ldd-card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div className="ldd-meta-label">Entry 600.{entryNum} — Professional Record</div>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 0.15 + 0.04 * index, type: 'spring', stiffness: 300, damping: 22 }} style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: C.brass, letterSpacing: 1, background: C.cream, border: `1px solid ${C.border}`, padding: '2px 10px', borderRadius: 2, whiteSpace: 'nowrap' }}>{entry.period}</motion.div>
            </div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 600, color: C.ink, lineHeight: 1.2, marginBottom: 6 }}>{entry.role}</div>
            <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 13, color: C.accent, letterSpacing: 0.5, marginBottom: 16, paddingBottom: 14, borderBottom: `1px dashed ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: C.brass }}>◈</span>{entry.company}</div>
            <p className="ldd-card-body">{entry.description}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Experience({ experience }) {
  const { ref, inView } = useSectionInView();
  return (
    <section id="experience" className="ldd-section" ref={ref}>
      <ArchivalHeading call={DEWEY.experience.call} label={DEWEY.experience.label} title="Professional Registry" subtitle="Chronological archive of professional history" inView={inView} />
      <div className="ldd-timeline">
        <motion.div className="ldd-timeline-line" initial={{ height: 0 }} animate={inView ? { height: '100%' } : { height: 0 }} transition={{ delay: 0.15, duration: 1.0, ease: 'easeOut' }} />
        {experience.map((entry, i) => <ExperienceEntry key={entry.company??i} entry={entry} index={i} />)}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CONTACT
// ══════════════════════════════════════════════════════════════════════════════

function ContactCard({ icon: Icon, label, value, href, index, inView }) {
  const [hov, setHov] = useState(false);
  const Inner = (
    <motion.div initial={{ opacity: 0, x: -60 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.1 + index * 0.1, duration: 0.6, ease: [0.25,0.46,0.45,0.94] }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <motion.div className="ldd-card" style={{ borderTop: `3px solid ${hov ? C.brass : C.border}`, transition: 'border-color 0.25s', textDecoration: 'none', display: 'block' }} animate={{ y: hov ? -8 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
        <div className="ldd-card-fold" /><div className="ldd-card-pad">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hov ? C.mahogany : C.cream, border: `1px solid ${hov ? C.brass : C.border}`, borderRadius: 2, color: hov ? C.gold : C.brass, transition: 'all 0.25s' }}><Icon size={16} /></div>
            <div className="ldd-meta-label" style={{ marginBottom: 0 }}>{label}</div>
          </div>
          <div style={{ fontFamily: "'Libre Baskerville',Georgia,serif", fontSize: 14, color: hov ? C.accent : C.inkMid, lineHeight: 1.4, wordBreak: 'break-word', transition: 'color 0.25s' }}>{value}</div>
          {href && <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 10, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: C.brass }}>→</span>Visit record</div>}
        </div>
      </motion.div>
    </motion.div>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{Inner}</a>;
  return Inner;
}

function Contact({ data }) {
  const { personal, socials } = data;
  const { ref, inView } = useSectionInView();
  const closingText = '◈  End of Catalog  ◈  All Records Classified  ◈  ' + new Date().getFullYear();
  const { displayed: closingTyped } = useTypewriter(closingText, 28, 400, inView);
  const contacts = [
    socials?.email     && { icon: Mail,     label: 'Email Address',   value: socials.email,    href: `mailto:${socials.email}` },
    socials?.github    && { icon: Github,   label: 'GitHub Archive',  value: 'github.com',     href: socials.github  },
    socials?.linkedin  && { icon: Linkedin, label: 'LinkedIn Record', value: 'linkedin.com',   href: socials.linkedin },
    socials?.twitter   && { icon: Twitter,  label: 'Twitter / X',     value: '@profile',       href: socials.twitter },
    personal?.location && { icon: MapPin,   label: 'Location',        value: personal.location, href: null },
  ].filter(Boolean);
  return (
    <section id="contact" className="ldd-section" ref={ref}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ background: `linear-gradient(180deg,#5C2E14 0%,${C.mahogany} 100%)`, border: `2px solid ${C.walnut}`, borderRadius: '4px 4px 0 0', borderBottom: 'none', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(255,255,255,0.012) 4px,rgba(255,255,255,0.012) 8px)` }}>
        <div style={{ background: C.parchment, border: `1px solid ${C.border}`, padding: '5px 24px', fontFamily: "'Courier Prime',monospace", fontSize: 11, color: C.inkMid, letterSpacing: 3, textTransform: 'uppercase' }}>Contact Archives</div>
        <div style={{ width: 64, height: 13, background: `linear-gradient(135deg,#D4A017 0%,#8B6000 35%,#D4A017 60%,#C8960C 100%)`, borderRadius: 7, boxShadow: '0 3px 8px rgba(0,0,0,0.45)' }} />
      </motion.div>
      <motion.div initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}} transition={{ delay: 0.18, duration: 0.8, ease: [0.25,0.46,0.45,0.94] }} style={{ border: `2px solid ${C.walnut}`, borderTop: 'none', background: `linear-gradient(to bottom,rgba(107,58,40,0.08),transparent)`, padding: '32px 24px 40px' }}>
        <ArchivalHeading call={DEWEY.contact.call} label={DEWEY.contact.label} title="Contact & Reference" subtitle="Reference cards for direct communication" inView={inView} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
          <div className="ldd-contact-grid" style={{ flex: 1 }}>
            {contacts.map((c, i) => <ContactCard key={c.label} {...c} index={i} inView={inView} />)}
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 200, damping: 18 }} style={{ flexShrink: 0, alignSelf: 'center' }}>
            <div className="ldd-archive-seal"><div className="ldd-archive-seal-inner">DEWEY<br />DECIMAL<br />ARCHIVE<br />SYSTEM<br />◈</div></div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 0.55 } : {}} transition={{ delay: 0.9, duration: 0.5 }} style={{ marginTop: 52, textAlign: 'center', fontFamily: "'Courier Prime',monospace", fontSize: 12, color: C.inkLight, letterSpacing: 2, textTransform: 'uppercase', minHeight: '1.5em' }}>
          {closingTyped}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER & DIVIDER
// ══════════════════════════════════════════════════════════════════════════════

function CatalogDivider({ sym = '◈ ◈ ◈' }) {
  return <hr className="ldd-rule" data-sym={sym} aria-hidden="true" />;
}

function Footer({ data }) {
  return (
    <footer className="ldd-footer">
      <div>
        <div className="ldd-footer-copy">© {new Date().getFullYear()} &nbsp;{data.personal.name} &nbsp;—&nbsp; All Records Classified</div>
        <div className="ldd-footer-badge">Librarian_Dewey_Decimal_Card_Catalog template · Open Stacks Edition</div>
      </div>
      <div className="ldd-footer-links">
        {data.socials?.github   && <a href={data.socials.github}   className="ldd-social" target="_blank" rel="noreferrer" aria-label="GitHub"><Github   size={15} /></a>}
        {data.socials?.linkedin && <a href={data.socials.linkedin} className="ldd-social" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>}
        {data.socials?.twitter  && <a href={data.socials.twitter}  className="ldd-social" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter  size={15} /></a>}
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function LibrarianDeweyDecimalCardCatalog() {
  const { portfolioData: data } = usePortfolio();
  const [openingDone, setOpeningDone] = useState(() => {
    try { return !!sessionStorage.getItem('ldd-intro-seen'); } catch { return false; }
  });
  const handleOpeningComplete = useCallback(() => {
    try { sessionStorage.setItem('ldd-intro-seen', '1'); } catch { /* noop */ }
    setOpeningDone(true);
  }, []);

  if (!data) return null;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="ldd-root">
      <title>{data.personal.name} — Dewey Decimal Archive Portfolio</title>
      <meta name="description" content={`Portfolio of ${data.personal.name} — ${data.personal.title}`} />
      <GlobalStyles />
      <FloatingBackground />
      <div className="ldd-paper-texture" aria-hidden="true" />
      <AnimatePresence>
        {!openingDone && <OpeningSequence key="opening" name={data.personal.name} title={data.personal.title} onComplete={handleOpeningComplete} />}
      </AnimatePresence>
      <LibraryNav />
      <main id="main-content">
        <div id="hero"><Hero data={data} onScrollTo={scrollTo} /></div>
        <CatalogDivider sym="— ◈ —" />
        <About data={data} />
        <CatalogDivider sym="· · ·" />
        <Skills skills={data.skills} />
        <CatalogDivider sym="— ◈ —" />
        <Projects projects={data.projects} />
        <CatalogDivider sym="· · ·" />
        <Experience experience={data.experience} />
        <CatalogDivider sym="— ◈ —" />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}
