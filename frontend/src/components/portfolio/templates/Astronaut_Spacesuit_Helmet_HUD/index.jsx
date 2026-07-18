import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ─────────────────────────────────────────────
   Tiny framer-motion-style CSS animation helpers
   We use pure CSS keyframes injected once so the
   template has zero extra deps beyond React.
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Inter:wght@300;400;500&display=swap');

  :root {
    --void: #04060A;
    --visor: #00D4FF;
    --amber: #FF8C00;
    --bio: #39FF14;
    --critical: #FF2D2D;
    --frost: rgba(0,212,255,0.08);
    --frost-border: rgba(0,212,255,0.22);
    --scanline: rgba(0,212,255,0.04);
  }

  .hud-root {
    background: var(--void);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #c8e8ff;
    overflow-x: hidden;
    position: relative;
  }

  /* Helmet visor radial vignette */
  .hud-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.92) 100%);
    pointer-events: none;
    z-index: 1000;
  }

  /* Scanlines overlay */
  .hud-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      var(--scanline) 0px,
      var(--scanline) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
    z-index: 999;
    animation: scanPan 12s linear infinite;
  }

  @keyframes scanPan {
    0%   { background-position: 0 0; }
    100% { background-position: 0 60px; }
  }

  /* Helmet frame SVG corners */
  .helmet-frame {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 998;
  }

  /* HUD blink */
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.2; }
  }

  @keyframes breathe {
    0%, 100% { transform: scaleX(1); opacity: 0.9; }
    50% { transform: scaleX(1.04); opacity: 1; }
  }

  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes ping {
    0% { transform: scale(0); opacity: 0.9; }
    100% { transform: scale(2.5); opacity: 0; }
  }

  @keyframes slideIn {
    from { transform: translateX(-24px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }

  @keyframes fadeUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  @keyframes glitch {
    0%, 100% { clip-path: none; transform: none; }
    10% { clip-path: polygon(0 20%, 100% 20%, 100% 30%, 0 30%); transform: translateX(-3px); }
    20% { clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); transform: translateX(3px); }
    30% { clip-path: none; transform: none; }
  }

  @keyframes crosshairPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }

  /* Nav */
  .hud-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    background: linear-gradient(to bottom, rgba(4,6,10,0.95), transparent);
    border-bottom: 1px solid var(--frost-border);
  }

  .hud-nav-logo {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 4px;
    color: var(--visor);
    text-transform: uppercase;
  }

  .hud-nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    margin: 0; padding: 0;
  }

  .hud-nav-links a {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.6);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }

  .hud-nav-links a::before {
    content: '// ';
    color: var(--visor);
    opacity: 0.5;
  }

  .hud-nav-links a:hover { color: var(--visor); }

  .hud-status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--bio);
    animation: blink 1.4s step-end infinite;
    box-shadow: 0 0 8px var(--bio);
    display: inline-block;
    margin-right: 8px;
  }

  .hud-status-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: var(--bio);
    letter-spacing: 2px;
  }

  /* Main content */
  .hud-main {
    padding-top: 72px;
    position: relative;
    z-index: 10;
  }

  /* Section wrapper */
  .hud-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 64px 32px;
  }

  .hud-section-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hud-section-label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--amber);
  }

  .hud-section-label::after {
    content: '';
    display: inline-block;
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--frost-border), transparent);
    margin-left: 12px;
  }

  /* HERO */
  .hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .hero-crosshair {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 320px; height: 320px;
    animation: crosshairPulse 3s ease-in-out infinite;
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    width: 100%;
  }

  .hero-left {}

  .hero-callsign {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 5px;
    color: var(--visor);
    text-transform: uppercase;
    margin-bottom: 16px;
    animation: slideIn 0.6s ease forwards;
  }

  .hero-name {
    font-family: 'Orbitron', monospace;
    font-size: clamp(32px, 5vw, 60px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -1px;
    color: #ffffff;
    margin-bottom: 8px;
    animation: slideIn 0.7s ease forwards;
  }

  .hero-name span {
    color: var(--visor);
    display: inline-block;
    animation: glitch 8s infinite;
  }

  .hero-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 400;
    color: rgba(200,232,255,0.6);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 28px;
    animation: slideIn 0.8s ease forwards;
  }

  .hero-bio {
    font-size: 15px;
    line-height: 1.8;
    color: rgba(200,232,255,0.7);
    max-width: 480px;
    margin-bottom: 32px;
    animation: fadeUp 0.9s ease forwards;
  }

  .hero-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    animation: fadeUp 1s ease forwards;
  }

  .btn-primary {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 14px 28px;
    background: transparent;
    border: 1px solid var(--visor);
    color: var(--visor);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--visor);
    transform: translateX(-100%);
    transition: transform 0.3s;
    z-index: -1;
  }

  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary:hover { color: var(--void); }

  .btn-secondary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 14px 20px;
    background: transparent;
    border: 1px solid var(--frost-border);
    color: rgba(200,232,255,0.6);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    border-color: var(--amber);
    color: var(--amber);
  }

  /* Hero right panel — telemetry */
  .telemetry-panel {
    background: var(--frost);
    border: 1px solid var(--frost-border);
    padding: 28px;
    position: relative;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    animation: fadeUp 0.8s ease forwards;
  }

  .telemetry-panel::before {
    content: 'TELEMETRY FEED';
    position: absolute;
    top: 10px; left: 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--visor);
    opacity: 0.7;
  }

  .telemetry-panel::after {
    content: attr(data-id);
    position: absolute;
    top: 10px; right: 20px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--amber);
    opacity: 0.7;
  }

  .telemetry-items {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .telemetry-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .telemetry-key {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.45);
    width: 100px;
    flex-shrink: 0;
  }

  .telemetry-bar-wrap {
    flex: 1;
    height: 4px;
    background: rgba(200,232,255,0.1);
    position: relative;
    overflow: hidden;
  }

  .telemetry-bar {
    height: 100%;
    background: var(--visor);
    box-shadow: 0 0 8px var(--visor);
    animation: breathe 3s ease-in-out infinite;
    transform-origin: left center;
  }

  .telemetry-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--visor);
    width: 36px;
    text-align: right;
  }

  .telemetry-avatar-wrap {
    position: relative;
    width: 80px; height: 80px;
    margin: 0 auto 24px;
  }

  .telemetry-avatar {
    width: 80px; height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--frost-border);
    filter: grayscale(20%) brightness(0.85);
  }

  .telemetry-avatar-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1px dashed var(--visor);
    opacity: 0.5;
    animation: radarSweep 8s linear infinite;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 18px;
  }

  .stat-cell {
    text-align: center;
    padding: 12px 8px;
    background: rgba(0,212,255,0.04);
    border: 1px solid var(--frost-border);
    position: relative;
  }

  .stat-cell-val {
    font-family: 'Orbitron', monospace;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    display: block;
  }

  .stat-cell-val span {
    font-size: 12px;
    color: var(--visor);
  }

  .stat-cell-key {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.4);
    text-transform: uppercase;
    margin-top: 4px;
    display: block;
  }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 32px;
  }

  .skill-card {
    background: var(--frost);
    border: 1px solid var(--frost-border);
    padding: 18px 20px;
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }

  .skill-card:hover {
    border-color: var(--visor);
    background: rgba(0,212,255,0.06);
  }

  .skill-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--visor);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .skill-card:hover::before { opacity: 1; }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .skill-name {
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    color: #c8e8ff;
    letter-spacing: 1px;
  }

  .skill-pct {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--visor);
  }

  .skill-bar-track {
    height: 3px;
    background: rgba(200,232,255,0.1);
    position: relative;
  }

  .skill-bar-fill {
    height: 100%;
    background: linear-gradient(to right, var(--visor), rgba(0,212,255,0.4));
    box-shadow: 0 0 6px var(--visor);
    transition: width 1s ease;
  }

  .skill-cat {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.3);
    margin-top: 8px;
    text-transform: uppercase;
  }

  /* Category filter pills */
  .cat-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .cat-pill {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 6px 16px;
    border: 1px solid var(--frost-border);
    background: transparent;
    color: rgba(200,232,255,0.5);
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .cat-pill.active, .cat-pill:hover {
    border-color: var(--visor);
    color: var(--visor);
    background: rgba(0,212,255,0.06);
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }

  .project-card {
    background: var(--frost);
    border: 1px solid var(--frost-border);
    position: relative;
    overflow: hidden;
    transition: transform 0.25s, border-color 0.25s;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0,212,255,0.5);
  }

  .project-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
    filter: grayscale(30%) brightness(0.7);
    transition: filter 0.3s;
  }

  .project-card:hover .project-img {
    filter: grayscale(0%) brightness(0.85);
  }

  .project-img-overlay {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 160px;
    background: linear-gradient(to bottom, transparent 40%, rgba(4,6,10,0.95));
  }

  .project-num {
    position: absolute;
    top: 12px; left: 14px;
    font-family: 'Orbitron', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--visor);
    opacity: 0.8;
  }

  .project-body {
    padding: 18px 20px 20px;
  }

  .project-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  .project-desc {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(200,232,255,0.6);
    margin-bottom: 14px;
  }

  .project-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .tech-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 1.5px;
    padding: 3px 10px;
    border: 1px solid rgba(255,140,0,0.35);
    color: var(--amber);
    text-transform: uppercase;
  }

  .project-links {
    display: flex;
    gap: 12px;
  }

  .project-link {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--visor);
    text-decoration: none;
    text-transform: uppercase;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .project-link:hover { border-color: var(--visor); }

  /* EXPERIENCE */
  .exp-timeline {
    position: relative;
    margin-top: 32px;
    padding-left: 32px;
  }

  .exp-timeline::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--visor), transparent);
  }

  .exp-item {
    position: relative;
    padding: 0 0 40px 32px;
    animation: fadeUp 0.6s ease forwards;
  }

  .exp-dot {
    position: absolute;
    left: -6px; top: 4px;
    width: 12px; height: 12px;
    border: 1px solid var(--visor);
    background: var(--void);
    transform: rotate(45deg);
  }

  .exp-dot::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: var(--visor);
  }

  .exp-period {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--amber);
    margin-bottom: 6px;
  }

  .exp-role {
    font-family: 'Orbitron', monospace;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 2px;
  }

  .exp-company {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--visor);
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .exp-desc {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(200,232,255,0.6);
    max-width: 580px;
  }

  /* TESTIMONIALS */
  .testi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 32px;
  }

  .testi-card {
    background: var(--frost);
    border: 1px solid var(--frost-border);
    padding: 24px;
    position: relative;
    transition: border-color 0.2s;
  }

  .testi-card:hover { border-color: rgba(0,212,255,0.4); }

  .testi-quote-mark {
    font-family: 'Orbitron', monospace;
    font-size: 36px;
    color: var(--visor);
    opacity: 0.2;
    line-height: 1;
    margin-bottom: 10px;
  }

  .testi-text {
    font-size: 13px;
    line-height: 1.8;
    color: rgba(200,232,255,0.7);
    margin-bottom: 18px;
    font-style: italic;
  }

  .testi-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .testi-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--frost-border);
    filter: grayscale(30%);
  }

  .testi-name {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
  }

  .testi-role {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 1px;
    color: var(--amber);
    margin-top: 2px;
  }

  /* RADAR widget */
  .radar-section {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .radar-wrap {
    flex-shrink: 0;
    position: relative;
    width: 200px; height: 200px;
  }

  .radar-sweep {
    position: absolute;
    inset: 0;
    animation: radarSweep 4s linear infinite;
    transform-origin: center;
  }

  .radar-ping {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--bio);
    box-shadow: 0 0 8px var(--bio);
  }

  .radar-ping::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--bio);
    animation: ping 2s ease-out infinite;
  }

  /* CONTACT SECTION */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-top: 32px;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .contact-card {
    background: var(--frost);
    border: 1px solid var(--frost-border);
    padding: 24px;
    position: relative;
    transition: background 0.3s, border-color 0.3s;
  }

  .contact-card:hover {
    background: rgba(0,212,255,0.06);
    border-color: var(--visor);
  }

  .contact-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--visor);
  }

  .contact-card-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--amber);
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .contact-card-val {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
  }

  .contact-card-val:hover {
    color: var(--visor);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--frost);
    border: 1px solid var(--frost-border);
    padding: 32px;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  }

  .hud-input, .hud-textarea {
    width: 100%;
    background: rgba(0,212,255,0.03);
    border: 1px solid var(--frost-border);
    padding: 14px 16px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }

  .hud-input:focus, .hud-textarea:focus {
    border-color: var(--visor);
    background: rgba(0,212,255,0.08);
    box-shadow: 0 0 12px rgba(0,212,255,0.15);
  }

  .hud-textarea {
    resize: vertical;
    min-height: 120px;
  }

  /* FOOTER */
  .hud-footer {
    border-top: 1px solid var(--frost-border);
    padding: 40px 32px;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-sig {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: rgba(200,232,255,0.3);
    text-transform: uppercase;
  }

  .social-links {
    display: flex;
    gap: 16px;
  }

  .social-link {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.4);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .social-link::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1px;
    background: currentColor;
    opacity: 0.5;
  }

  .social-link:hover { color: var(--visor); }

  .loc-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(200,232,255,0.35);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Divider */
  .hud-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--frost-border), transparent);
    max-width: 1100px;
    margin: 0 auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-content { grid-template-columns: 1fr; gap: 32px; }
    .radar-section { flex-direction: column; }
    .contact-grid { grid-template-columns: 1fr; }
    .hud-nav-links { display: none; }
  }
`;

/* ── Radar SVG widget ── */
function RadarWidget({ skills }) {
  const featured = skills.slice(0, 5);
  return (
    <div className="radar-wrap">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Rings */}
        {[70, 55, 40, 25].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
        ))}
        {/* Crosshairs */}
        <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
        <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
        {/* Sweep */}
        <g className="radar-sweep">
          <defs>
            <radialGradient id="sweepGrad" cx="0" cy="50%" r="100%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M100,100 L170,100 A70,70 0 0,0 100,30 Z" fill="url(#sweepGrad)" />
          <line x1="100" y1="100" x2="170" y2="100" stroke="#00D4FF" strokeWidth="1.5" opacity="0.7" />
        </g>
        {/* Skill dots */}
        {featured.map((s, i) => {
          const angle = (i / featured.length) * Math.PI * 2 - Math.PI / 2;
          const r = (s.level / 100) * 65;
          const x = 100 + Math.cos(angle) * r;
          const y = 100 + Math.sin(angle) * r;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#39FF14" opacity="0.9" />
              <circle cx={x} cy={y} r="4" fill="none" stroke="#39FF14" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
        {/* Center */}
        <circle cx="100" cy="100" r="3" fill="#00D4FF" />
      </svg>
    </div>
  );
}

/* ── Helmet frame corners ── */
function HelmetFrame() {
  return (
    <svg className="helmet-frame" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      {/* Corner brackets */}
      {/* TL */}
      <path d="M 40 80 L 40 40 L 80 40" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
      {/* TR */}
      <path d="M 1360 40 L 1400 40 L 1400 80" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
      {/* BL */}
      <path d="M 40 820 L 40 860 L 80 860" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
      {/* BR */}
      <path d="M 1360 860 L 1400 860 L 1400 820" fill="none" stroke="#00D4FF" strokeWidth="1.5" opacity="0.6" />
      {/* Top center label bracket */}
      <path d="M 660 0 L 660 18 M 780 0 L 780 18" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <text x="720" y="14" textAnchor="middle" fontFamily="Share Tech Mono,monospace" fontSize="8" fill="rgba(0,212,255,0.5)" letterSpacing="3">HUD.SYS.v4.2</text>
      {/* Bottom status bar */}
      <line x1="120" y1="876" x2="600" y2="876" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
      <line x1="840" y1="876" x2="1320" y2="876" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
      <text x="720" y="880" textAnchor="middle" fontFamily="Share Tech Mono,monospace" fontSize="8" fill="rgba(255,140,0,0.4)" letterSpacing="2">LIFE SUPPORT NOMINAL</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AstronautSpacesuitHelmetHUD() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  const [activeCat, setActiveCat] = useState('All');
  const [time, setTime] = useState('');

  // Live clock for telemetry panel
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}:${String(now.getUTCSeconds()).padStart(2,'0')} UTC`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filteredSkills = activeCat === 'All' ? skills : skills.filter(s => s.category === activeCat);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="hud-root">
        <HelmetFrame />

        {/* NAV */}
        <nav className="hud-nav">
          <div className="hud-nav-logo">
            {personal.name?.split(' ')[0] ?? 'PILOT'}
            <span style={{ color: 'rgba(200,232,255,0.3)', marginLeft: 8 }}>◈ HUD</span>
          </div>
          <ul className="hud-nav-links">
            {['systems','missions','trajectory','crew', 'contact'].map((sec, i) => {
              const labels = ['SKILLS','PROJECTS','EXPERIENCE','TESTIMONIALS', 'COMM LINK'];
              return (
                <li key={i}>
                  <a href="#" onClick={e => { e.preventDefault(); scrollTo(sec); }}>{labels[i]}</a>
                </li>
              );
            })}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="hud-status-dot" />
            <span className="hud-status-text">ONLINE</span>
          </div>
        </nav>

        <main className="hud-main">
          {/* ── HERO ── */}
          <section className="hero">
            {/* Crosshair SVG */}
            <svg className="hero-crosshair" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="160" cy="160" r="150" stroke="rgba(0,212,255,0.06)" strokeWidth="1" />
              <circle cx="160" cy="160" r="100" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              <circle cx="160" cy="160" r="50" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
              <line x1="160" y1="10" x2="160" y2="60" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              <line x1="160" y1="260" x2="160" y2="310" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              <line x1="10" y1="160" x2="60" y2="160" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              <line x1="260" y1="160" x2="310" y2="160" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              <rect x="155" y="155" width="10" height="10" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" transform="rotate(45 160 160)" />
            </svg>

            <div className="hero-content">
              <div className="hero-left">
                <p className="hero-callsign">⬡ CALLSIGN-{String(personal.name ?? '').toUpperCase().replace(/\s/g,'.')}</p>
                <h1 className="hero-name">
                  {personal.name?.split(' ')[0] ?? 'ALEX'}{' '}
                  <span>{personal.name?.split(' ').slice(1).join(' ') ?? 'RIVERA'}</span>
                </h1>
                <p className="hero-title">{personal.title ?? 'Full Stack Developer'}</p>
                <p className="hero-bio">{personal.bio}</p>
                <div className="hero-actions">
                  <button type="button" className="btn-primary" onClick={() => scrollTo('missions')}>VIEW MISSIONS</button>
                  <button type="button" className="btn-secondary" onClick={() => scrollTo('trajectory')}>TRAJECTORY LOG</button>
                </div>
              </div>

              {/* Telemetry */}
              <div className="telemetry-panel" data-id={`ID-${String(Math.random()).slice(2,8)}`}>
                <div className="telemetry-avatar-wrap">
                  <img
                    className="telemetry-avatar"
                    src={personal.avatar ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}
                    alt={personal.name}
                    onError={e => { e.target.style.display='none'; }}
                  />
                  <div className="telemetry-avatar-ring" />
                </div>

                <div style={{ textAlign:'center', marginBottom: 16 }}>
                  <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:10, letterSpacing:2, color:'rgba(200,232,255,0.4)', marginBottom:4 }}>
                    🕐 {time}
                  </p>
                  <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:10, letterSpacing:2, color:'var(--bio)' }}>
                    ◉ SYSTEMS NOMINAL
                  </p>
                </div>

                <div className="telemetry-items">
                  {skills.slice(0,5).map((s,i) => (
                    <div className="telemetry-row" key={i}>
                      <span className="telemetry-key">{s.name.substring(0,10)}</span>
                      <div className="telemetry-bar-wrap">
                        <div className="telemetry-bar" style={{ width: `${s.level}%`, animationDelay: `${i*0.4}s` }} />
                      </div>
                      <span className="telemetry-val">{s.level}%</span>
                    </div>
                  ))}
                </div>

                <div className="stat-grid">
                  <div className="stat-cell">
                    <span className="stat-cell-val">{stats.yearsExperience}<span>yr</span></span>
                    <span className="stat-cell-key">Experience</span>
                  </div>
                  <div className="stat-cell">
                    <span className="stat-cell-val">{stats.projectsCompleted}<span>+</span></span>
                    <span className="stat-cell-key">Missions</span>
                  </div>
                  <div className="stat-cell">
                    <span className="stat-cell-val">{stats.happyClients}<span>+</span></span>
                    <span className="stat-cell-key">Crew</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="hud-divider" />

          {/* ── SKILLS ── */}
          <section id="systems" className="hud-section">
            <p className="hud-section-label">SYSTEMS DIAGNOSTICS</p>
            <h2 style={{ fontFamily:'Orbitron,monospace', fontSize: 28, fontWeight:700, color:'#fff', marginBottom:24, letterSpacing:1 }}>
              Core Competencies
            </h2>

            <div className="radar-section">
              <RadarWidget skills={skills} />
              <div style={{ flex: 1 }}>
                <div className="cat-filters">
                  {categories.map(c => (
                    <button type="button" key={c} className={`cat-pill ${activeCat===c?'active':''}`} onClick={() => setActiveCat(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="skills-grid">
                  {filteredSkills.map((s, i) => (
                    <div className="skill-card" key={i} style={{ animationDelay: `${i*0.05}s` }}>
                      <div className="skill-header">
                        <span className="skill-name">{s.name}</span>
                        <span className="skill-pct">{s.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
                      </div>
                      <p className="skill-cat">{s.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="hud-divider" />

          {/* ── PROJECTS ── */}
          <section id="missions" className="hud-section">
            <p className="hud-section-label">MISSION LOGS</p>
            <h2 style={{ fontFamily:'Orbitron,monospace', fontSize:28, fontWeight:700, color:'#fff', marginBottom:8, letterSpacing:1 }}>
              Completed Missions
            </h2>
            <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'rgba(200,232,255,0.4)', letterSpacing:2, marginBottom:0 }}>
              {projects.length} CLASSIFIED OPERATIONS ON RECORD
            </p>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <div className="project-card" key={i}>
                  <img className="project-img" src={p.image} alt={p.title} onError={e => { e.target.style.display='none'; }} />
                  <div className="project-img-overlay" />
                  <span className="project-num">OBJ-{String(i+1).padStart(3,'0')}</span>
                  <div className="project-body">
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc">{p.description}</p>
                    <div className="project-stack">
                      {(p.techStack ?? []).map((t, j) => (
                        <span className="tech-tag" key={j}>{t}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {p.liveUrl && <a className="project-link" href={p.liveUrl} target="_blank" rel="noreferrer">LAUNCH ↗</a>}
                      {p.githubUrl && <a className="project-link" href={p.githubUrl} target="_blank" rel="noreferrer">SOURCE ↗</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="hud-divider" />

          {/* ── EXPERIENCE ── */}
          <section id="trajectory" className="hud-section">
            <p className="hud-section-label">TRAJECTORY LOG</p>
            <h2 style={{ fontFamily:'Orbitron,monospace', fontSize:28, fontWeight:700, color:'#fff', marginBottom:8, letterSpacing:1 }}>
              Flight History
            </h2>
            <div className="exp-timeline">
              {experience.map((e, i) => (
                <div className="exp-item" key={i} style={{ animationDelay: `${i*0.1}s` }}>
                  <div className="exp-dot" />
                  <p className="exp-period">{e.period}</p>
                  <h3 className="exp-role">{e.role}</h3>
                  <p className="exp-company">⊹ {e.company}</p>
                  <p className="exp-desc">{e.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="hud-divider" />

          {/* ── TESTIMONIALS ── */}
          <section id="crew" className="hud-section">
            <p className="hud-section-label">CREW COMMUNICATIONS</p>
            <h2 style={{ fontFamily:'Orbitron,monospace', fontSize:28, fontWeight:700, color:'#fff', marginBottom:24, letterSpacing:1 }}>
              Mission Debrief
            </h2>
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div className="testi-card" key={i}>
                  <div className="testi-quote-mark">"</div>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">
                    <img className="testi-avatar" src={t.avatar} alt={t.name} onError={e => { e.target.style.display='none'; }} />
                    <div>
                      <p className="testi-name">{t.name}</p>
                      <p className="testi-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="hud-divider" />

          {/* ── CONTACT ── */}
          <section id="contact" className="hud-section">
            <p className="hud-section-label">COMMUNICATIONS LINK</p>
            <h2 style={{ fontFamily:'Orbitron,monospace', fontSize:28, fontWeight:700, color:'#fff', marginBottom:8, letterSpacing:1 }}>
              Establish Contact
            </h2>
            <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:11, color:'rgba(200,232,255,0.4)', letterSpacing:2, marginBottom:24 }}>
              OPENING SECURE CHANNEL TO PILOT...
            </p>
            
            <div className="contact-grid">
              {/* Left Side: Telemetry Data */}
              <div className="contact-info">
                {socials.email && (
                  <div className="contact-card">
                    <p className="contact-card-title">SECURE EMAIL ROUTE</p>
                    <a href={`mailto:${socials.email}`} className="contact-card-val">{socials.email}</a>
                  </div>
                )}
                {personal.location && (
                  <div className="contact-card">
                    <p className="contact-card-title">CURRENT COORDINATES</p>
                    <span className="contact-card-val">{personal.location}</span>
                  </div>
                )}
                <div className="contact-card">
                  <p className="contact-card-title">SOCIAL UPLINKS</p>
                  <div className="social-links" style={{ marginTop: 8 }}>
                    {socials.github && <a className="social-link" href={socials.github} target="_blank" rel="noreferrer">GitHub</a>}
                    {socials.linkedin && <a className="social-link" href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    {socials.twitter && <a className="social-link" href={socials.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                  </div>
                </div>
              </div>

              {/* Right Side: Interface Form */}
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:10, letterSpacing:2, color:'var(--visor)', marginBottom: 8 }}>
                  [ TRANSMIT MESSAGE ]
                </p>
                <input 
                  type="text" 
                  className="hud-input" 
                  placeholder="IDENTIFICATION (NAME)" 
                  required 
                />
                <input 
                  type="email" 
                  className="hud-input" 
                  placeholder="RETURN FREQUENCY (EMAIL)" 
                  required 
                />
                <textarea 
                  className="hud-textarea" 
                  placeholder="ENCRYPTED PAYLOAD (MESSAGE)" 
                  required 
                />
                <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                  INITIATE TRANSMISSION
                </button>
              </form>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <div className="hud-divider" />
          <footer className="hud-footer">
            <div>
              <p className="footer-sig">{personal.name} ◈ {new Date().getFullYear()}</p>
              {personal.location && (
                <p className="loc-tag" style={{ marginTop: 6 }}>
                  <span style={{ color:'var(--visor)' }}>⊹</span>
                  {personal.location}
                </p>
              )}
            </div>
            <p style={{ fontFamily:'Share Tech Mono,monospace', fontSize:9, letterSpacing:3, color:'rgba(200,232,255,0.2)', textTransform:'uppercase' }}>
              ALL SYSTEMS GO
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}