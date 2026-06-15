import React from 'react';
import { C } from './hooks';

// Global styles injected as a <style> tag
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

      /* ── Root & Paper ───────────────────────────────────────── */
      .tks-root {
        background: ${C.paperWhite};
        color: ${C.black};
        font-family: 'Courier Prime', 'Courier New', monospace;
        overflow-x: hidden;
        min-height: 100vh;
        position: relative;
      }
      .tks-display { font-family: 'Special Elite', cursive; }
      .tks-mono    { font-family: 'IBM Plex Mono', monospace; }

      /* Paper texture overlay */
      .tks-paper-texture {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        opacity: 0.6;
      }

      /* Lined paper background */
      .tks-lined {
        background-image:
          repeating-linear-gradient(
            transparent,
            transparent 31px,
            ${C.border}55 31px,
            ${C.border}55 32px
          );
        background-position: 0 0;
      }

      /* Left margin red line */
      .tks-margin-line::before {
        content: '';
        position: absolute;
        left: 72px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: ${C.deepRed}30;
        pointer-events: none;
      }

      /* ── Cursor blink ───────────────────────────────────────── */
      .tks-cursor {
        display: inline-block;
        width: 9px;
        height: 1.05em;
        background: ${C.deepRed};
        margin-left: 1px;
        vertical-align: text-bottom;
        animation: tks-blink 0.9s step-end infinite;
        border-radius: 1px;
      }
      .tks-cursor-thin {
        display: inline-block;
        width: 2px;
        height: 1.05em;
        background: ${C.deepRed};
        margin-left: 1px;
        vertical-align: text-bottom;
        animation: tks-blink 0.9s step-end infinite;
      }

      /* ── Typewriter roller (decorative top bar) ─────────────── */
      .tks-roller {
        background: linear-gradient(180deg, #2a2219 0%, #1a150e 40%, #2a2219 100%);
        height: 28px;
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        padding: 0 20px;
        gap: 6px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .tks-roller-knob {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #5a4530, #2a1e12);
        border: 1px solid #3a2a1a;
        box-shadow: 0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15);
      }
      .tks-roller-bar {
        flex: 1;
        height: 6px;
        background: linear-gradient(90deg, #3a2a1a, #4a3520 50%, #3a2a1a);
        border-radius: 3px;
        border: 1px solid #2a1e12;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
        position: relative;
        overflow: hidden;
      }
      .tks-roller-bar::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: rgba(255,255,255,0.08);
      }
      .tks-paper-feed {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        background: ${C.paperWhite}cc;
        border-radius: 2px;
        animation: tks-feed 8s linear infinite;
        box-shadow: 0 0 4px rgba(248,245,238,0.4);
      }
      .tks-roller-text {
        color: ${C.border}80;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 8px;
        letter-spacing: 4px;
        text-transform: uppercase;
        flex: 0 0 auto;
      }

      /* ── Navigation ─────────────────────────────────────────── */
      .tks-nav {
        position: sticky;
        top: 28px;
        z-index: 90;
        background: ${C.vintageCream}f0;
        border-bottom: 2px solid ${C.border};
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 48px;
        height: 52px;
      }
      .tks-nav-brand {
        font-family: 'Special Elite', cursive;
        font-size: 15px;
        color: ${C.deepRed};
        letter-spacing: 2px;
        cursor: pointer;
        background: none;
        border: none;
      }
      .tks-nav-links { display: flex; gap: 28px; }
      .tks-nav-link {
        font-family: 'Courier Prime', monospace;
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: ${C.inkGray};
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 0;
        transition: color 0.2s;
        position: relative;
      }
      .tks-nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 1px;
        background: ${C.deepRed};
        transform: scaleX(0);
        transition: transform 0.2s;
      }
      .tks-nav-link:hover { color: ${C.deepRed}; }
      .tks-nav-link:hover::after { transform: scaleX(1); }
      @media (max-width: 767px) {
        .tks-nav { padding: 0 20px; }
        .tks-nav-links { display: none; }
      }

      /* ── Manuscript page container ──────────────────────────── */
      .tks-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 64px 96px;
        position: relative;
        background: ${C.paperWhite};
        box-shadow: 0 1px 0 ${C.border};
      }
      @media (max-width: 900px) { .tks-page { padding: 48px 48px; } }
      @media (max-width: 600px) { .tks-page { padding: 32px 24px; } }

      .tks-alt-bg { background: ${C.vintageCream}; }

      /* ── Section label (chapter style) ─────────────────────── */
      .tks-chapter-num {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        letter-spacing: 4px;
        color: ${C.deepRed};
        text-transform: uppercase;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .tks-chapter-num::before {
        content: '';
        display: inline-block;
        width: 32px;
        height: 1px;
        background: ${C.deepRed};
      }

      .tks-section-title {
        font-family: 'Special Elite', cursive;
        font-size: clamp(1.8rem, 4.5vw, 3rem);
        color: ${C.black};
        margin-bottom: 8px;
        line-height: 1.1;
      }
      .tks-section-subtitle {
        font-family: 'Courier Prime', monospace;
        font-size: 13px;
        color: ${C.warmBrown};
        font-style: italic;
        margin-bottom: 48px;
        border-bottom: 1px dashed ${C.border};
        padding-bottom: 20px;
      }

      /* ── Typewriter text decorations ────────────────────────── */
      .tks-underline-red { text-decoration: underline; text-decoration-color: ${C.deepRed}; text-underline-offset: 3px; }
      .tks-strikethrough { text-decoration: line-through; text-decoration-color: ${C.deepRed}; }

      /* ── Ink imperfections / smudges ────────────────────────── */
      .tks-smudge {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(ellipse, ${C.warmBrown}18 0%, transparent 70%);
        pointer-events: none;
      }
      .tks-correction {
        position: relative;
        display: inline;
      }
      .tks-correction::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0; right: 0;
        height: 2px;
        background: ${C.deepRed}70;
        border-radius: 1px;
      }

      /* ── Skill typewriter lines ─────────────────────────────── */
      .tks-skill-line {
        font-family: 'Courier Prime', monospace;
        font-size: 14px;
        color: ${C.black};
        display: flex;
        align-items: baseline;
        gap: 0;
        padding: 10px 0;
        border-bottom: 1px solid ${C.border}60;
        line-height: 1;
      }
      .tks-skill-name { flex: 0 0 auto; min-width: 160px; }
      .tks-skill-dots { flex: 1; color: ${C.border}; letter-spacing: 2px; overflow: hidden; white-space: nowrap; }
      .tks-skill-pct  { flex: 0 0 auto; color: ${C.deepRed}; font-weight: 700; min-width: 50px; text-align: right; }

      /* ── Project chapter card ───────────────────────────────── */
      .tks-project-card {
        background: ${C.paperWhite};
        border: 1px solid ${C.border};
        position: relative;
        overflow: hidden;
        box-shadow: 3px 3px 0 ${C.border}80;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .tks-project-card:hover {
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0 ${C.border};
      }
      .tks-project-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: ${C.deepRed};
      }

      /* Paper clip */
      .tks-paperclip {
        position: absolute;
        top: -8px;
        right: 24px;
        width: 24px;
        height: 48px;
        border: 3px solid #8a8a8a;
        border-radius: 12px 12px 0 0;
        border-bottom: none;
        z-index: 2;
      }
      .tks-paperclip::after {
        content: '';
        position: absolute;
        top: 6px; left: -3px; right: -3px;
        height: 30px;
        border: 3px solid #8a8a8a;
        border-radius: 8px 8px 0 0;
        border-bottom: none;
      }

      /* Bookmark */
      .tks-bookmark {
        position: absolute;
        top: 0;
        right: 16px;
        width: 20px;
        height: 36px;
        background: ${C.deepRed};
        clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        z-index: 2;
      }

      /* ── Experience diary entry ─────────────────────────────── */
      .tks-diary-entry {
        border-left: 3px solid ${C.border};
        padding-left: 24px;
        position: relative;
        margin-bottom: 40px;
      }
      .tks-diary-entry::before {
        content: '●';
        position: absolute;
        left: -8px;
        top: 4px;
        color: ${C.deepRed};
        font-size: 10px;
      }
      .tks-diary-date {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        letter-spacing: 3px;
        color: ${C.deepRed};
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .tks-diary-title {
        font-family: 'Special Elite', cursive;
        font-size: 20px;
        color: ${C.black};
        margin-bottom: 4px;
      }
      .tks-diary-company {
        font-size: 12px;
        color: ${C.warmBrown};
        margin-bottom: 10px;
        font-style: italic;
      }
      .tks-diary-body {
        font-size: 13px;
        line-height: 1.8;
        color: ${C.inkGray};
      }

      /* ── Letter / testimonial card ──────────────────────────── */
      .tks-letter {
        background: ${C.paperWhite};
        border: 1px solid ${C.border};
        padding: 28px 28px 24px;
        position: relative;
        box-shadow: 2px 2px 0 ${C.border}80, 4px 4px 0 ${C.vintageCream};
      }
      .tks-letter-header {
        font-family: 'Courier Prime', monospace;
        font-size: 12px;
        color: ${C.warmBrown};
        margin-bottom: 16px;
        border-bottom: 1px solid ${C.border};
        padding-bottom: 10px;
        font-style: italic;
      }
      .tks-letter-body {
        font-size: 13px;
        line-height: 1.85;
        color: ${C.inkGray};
        font-style: italic;
        margin-bottom: 18px;
      }
      .tks-letter-sig {
        font-family: 'Special Elite', cursive;
        font-size: 15px;
        color: ${C.black};
        display: flex;
        align-items: center;
        gap: 12px;
      }

      /* Folded corner effect */
      .tks-letter::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 0 24px 24px;
        border-color: transparent transparent ${C.vintageCream} transparent;
      }

      /* ── Buttons ────────────────────────────────────────────── */
      .tks-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        font-family: 'Courier Prime', monospace;
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        border: 2px solid;
        text-decoration: none;
        transition: all 0.15s;
        border-radius: 2px;
        position: relative;
        overflow: hidden;
      }
      .tks-btn-primary {
        background: ${C.deepRed};
        border-color: ${C.deepRed};
        color: ${C.paperWhite};
      }
      .tks-btn-primary:hover {
        background: ${C.deepRedLight};
        border-color: ${C.deepRedLight};
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0 ${C.warmBrown};
      }
      .tks-btn-outline {
        background: transparent;
        border-color: ${C.border};
        color: ${C.inkGray};
      }
      .tks-btn-outline:hover {
        border-color: ${C.deepRed};
        color: ${C.deepRed};
        background: ${C.deepRed}0a;
      }

      /* ── Tag / tech chip ────────────────────────────────────── */
      .tks-tag {
        display: inline-block;
        padding: 2px 8px;
        border: 1px solid ${C.border};
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        color: ${C.warmBrown};
        letter-spacing: 1px;
        border-radius: 1px;
      }

      /* ── Input ──────────────────────────────────────────────── */
      .tks-input {
        width: 100%;
        padding: 10px 14px;
        background: ${C.paperWhite};
        border: 1px solid ${C.border};
        border-bottom: 2px solid ${C.deepRed}80;
        font-family: 'Courier Prime', monospace;
        font-size: 14px;
        color: ${C.black};
        outline: none;
        border-radius: 0;
        box-sizing: border-box;
        transition: border-bottom-color 0.2s;
      }
      .tks-input:focus { border-bottom-color: ${C.deepRed}; }
      .tks-input::placeholder { color: ${C.border}; }

      /* ── Decorative horizontal rules ────────────────────────── */
      .tks-rule {
        border: none;
        border-top: 1px solid ${C.border};
        margin: 0;
        position: relative;
      }
      .tks-rule::before {
        content: attr(data-sym);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -9px;
        background: ${C.paperWhite};
        padding: 0 16px;
        font-family: 'Courier Prime', monospace;
        font-size: 11px;
        color: ${C.border};
        letter-spacing: 4px;
      }
      .tks-rule-alt::before { background: ${C.vintageCream}; }

      /* ── Social icon links ──────────────────────────────────── */
      .tks-social {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: 1px solid ${C.border};
        color: ${C.inkGray};
        text-decoration: none;
        transition: all 0.2s;
        border-radius: 2px;
      }
      .tks-social:hover { border-color: ${C.deepRed}; color: ${C.deepRed}; }

      /* ── Margin notes ───────────────────────────────────────── */
      .tks-margin-note {
        font-family: 'Courier Prime', monospace;
        font-size: 10px;
        color: ${C.deepRed}80;
        font-style: italic;
        transform: rotate(-1.5deg);
        display: inline-block;
      }

      /* ── Coffee stain ───────────────────────────────────────── */
      .tks-coffee-stain {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 8px solid ${C.warmBrown}15;
        box-shadow: inset 0 0 0 4px ${C.warmBrown}08;
        pointer-events: none;
      }

      /* ── Tear effect ────────────────────────────────────────── */
      .tks-torn-top {
        position: absolute;
        top: -1px; left: 0; right: 0;
        height: 8px;
        background: ${C.vintageCream};
        clip-path: polygon(
          0% 0%, 4% 100%, 8% 30%, 12% 80%, 16% 10%, 20% 90%, 24% 20%,
          28% 70%, 32% 5%, 36% 85%, 40% 15%, 44% 75%, 48% 5%,
          52% 95%, 56% 25%, 60% 80%, 64% 10%, 68% 90%, 72% 20%,
          76% 70%, 80% 5%, 84% 85%, 88% 20%, 92% 75%, 96% 10%, 100% 60%, 100% 0%
        );
      }

      /* ── Image style ────────────────────────────────────────── */
      .tks-img {
        display: block;
        width: 100%;
        height: 180px;
        object-fit: cover;
        filter: sepia(25%) saturate(0.75) contrast(1.05);
      }

      /* ── Carriage return animation ──────────────────────────── */
      .tks-carriage {
        animation: tks-carriage 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      /* ── Keyframes ──────────────────────────────────────────── */
      @keyframes tks-blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      @keyframes tks-feed {
        from { left: -24px; }
        to   { left: 100%; }
      }
      @keyframes tks-carriage {
        0%   { transform: translateX(0); }
        30%  { transform: translateX(-8px); }
        100% { transform: translateX(0); }
      }
      @keyframes tks-paper-in {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes tks-stamp {
        0%   { opacity: 0; transform: scale(1.4) rotate(-6deg); }
        60%  { opacity: 1; transform: scale(0.95) rotate(-5deg); }
        100% { opacity: 1; transform: scale(1) rotate(-5deg); }
      }

      /* ── Responsive ─────────────────────────────────────────── */
      @media (max-width: 900px) { .tks-margin-line::before { left: 32px; } }
      @media (prefers-reduced-motion: reduce) {
        .tks-cursor, .tks-cursor-thin { animation: none !important; opacity: 1; }
      }
    `}</style>
  );
}
