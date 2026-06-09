import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink, MapPin,
  ChevronDown, ChevronUp, Menu, X, GraduationCap, Award,
} from "lucide-react";
import dummyData from "../../../../data/dummy_data.json";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── Constants ─── */
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const SKILL_CATS = ["Frontend", "Backend", "Tools", "Design", "Database", "DevOps"];

/* ═══════════════════════════════════════════════════════════
   Global Styles — all CSS scoped with `dms-` prefix
   ═══════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─── Root ─── */
.dms-root {
  --bg: #050505;
  --bg-alt: #0b0b0b;
  --surface: #111111;
  --surface-hover: #191919;
  --border: #1e1e1e;
  --text: #ece7e1;
  --text-dim: #706b65;
  --text-faint: #3d3a37;
  --gold: #c9a96e;
  --gold-light: #dfc48f;
  --gold-dim: rgba(201,169,110,0.10);
  --gold-glow: rgba(201,169,110,0.25);
  --serif: 'Playfair Display', Georgia, serif;
  --sans: 'Inter', system-ui, -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --max-w: 1100px;
  --section-py: 120px;
  font-family: var(--sans);
  background-color: var(--bg);
  background-image: radial-gradient(rgba(201, 169, 110, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}
.dms-root *, .dms-root *::before, .dms-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ─── Scrollbar ─── */
.dms-root::-webkit-scrollbar { width: 6px; }
.dms-root::-webkit-scrollbar-track { background: var(--bg); }
.dms-root::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.dms-root::-webkit-scrollbar-thumb:hover { background: var(--gold); }

/* ─── Progress Bar ─── */
.dms-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  z-index: 1000;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px var(--gold-glow);
}

/* ─── Navigation ─── */
.dms-nav {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 48px); max-width: var(--max-w);
  z-index: 900; padding: 0 32px;
  border-radius: 12px; border: 1px solid transparent;
  transition: all 0.3s ease;
}
.dms-nav-scrolled {
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(201, 169, 110, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.dms-nav-inner {
  max-width: var(--max-w); margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  height: 72px;
}
.dms-nav-brand {
  font-family: var(--serif); font-size: 20px; font-weight: 700;
  color: var(--text); letter-spacing: 1px; cursor: pointer;
  background: none; border: none; text-decoration: none;
}
.dms-nav-links {
  display: flex; gap: 32px; list-style: none;
}
.dms-nav-link {
  font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--text-dim); cursor: pointer;
  transition: color 0.3s; background: none; border: none;
  font-family: var(--sans);
}
.dms-nav-link:hover { color: var(--gold); }
.dms-nav-toggle {
  display: none; background: none; border: none;
  color: var(--text); cursor: pointer; padding: 8px;
}

/* ─── Mobile Menu ─── */
.dms-mobile-overlay {
  position: fixed; inset: 0; z-index: 950;
  background: rgba(5,5,5,0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 28px;
}
.dms-mobile-close {
  position: absolute; top: 24px; right: 24px;
  background: none; border: none; color: var(--text); cursor: pointer;
}
.dms-mobile-link {
  font-family: var(--serif); font-size: 28px; font-weight: 600;
  color: var(--text-dim); background: none; border: none;
  cursor: pointer; transition: color 0.3s;
}
.dms-mobile-link:hover { color: var(--gold); }

/* ─── Hero ─── */
.dms-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 120px 24px 80px; position: relative; overflow: hidden;
}
.dms-hero::before {
  content: ''; position: absolute; top: -20%; left: 50%;
  transform: translateX(-50%); width: 700px; height: 700px;
  background: radial-gradient(circle, var(--gold-dim) 0%, transparent 65%);
  pointer-events: none;
}
.dms-hero-pre {
  font-size: 11px; font-weight: 600; letter-spacing: 6px;
  text-transform: uppercase; color: var(--gold); margin-bottom: 32px;
}
.dms-hero-name {
  font-family: var(--serif); font-size: 76px; font-weight: 800;
  color: var(--text); line-height: 1.1; margin-bottom: 28px;
  letter-spacing: -1px;
}
.dms-hero-rule {
  width: 80px; height: 1px; background: var(--gold);
  margin: 0 auto 28px; position: relative;
}
.dms-hero-rule::after {
  content: '◆'; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); color: var(--gold);
  font-size: 8px; background: var(--bg); padding: 0 12px;
}
.dms-hero-title {
  font-size: 18px; font-weight: 400; color: var(--text-dim);
  margin-bottom: 16px;
}
.dms-hero-tagline {
  font-family: var(--serif); font-size: 20px; font-style: italic;
  color: var(--text-dim); max-width: 520px; margin: 0 auto 40px;
  line-height: 1.65;
}
.dms-hero-actions {
  display: flex; gap: 20px; justify-content: center; margin-bottom: 64px;
}
.dms-btn {
  font-family: var(--sans); font-size: 11px; font-weight: 700; letter-spacing: 3px;
  text-transform: uppercase; padding: 16px 36px; border-radius: 4px;
  cursor: pointer; transition: all 0.3s ease;
}
.dms-btn-primary {
  background: var(--gold); color: var(--bg); border: 1px solid var(--gold);
}
.dms-btn-primary:hover {
  background: var(--gold-light); border-color: var(--gold-light);
  transform: translateY(-2px); box-shadow: 0 10px 20px var(--gold-dim);
}
.dms-btn-outline {
  background: rgba(201, 169, 110, 0.05); color: var(--text); border: 1px solid var(--border);
}
.dms-btn-outline:hover {
  border-color: var(--gold); color: var(--gold);
  transform: translateY(-2px); background: rgba(201, 169, 110, 0.1);
}
.dms-hero-stats {
  display: flex; gap: 56px; margin-bottom: 0;
}
.dms-hero-stat { text-align: center; }
.dms-hero-stat-val {
  font-family: var(--serif); font-size: 38px; font-weight: 700;
  color: var(--gold); display: block;
}
.dms-hero-stat-lbl {
  font-size: 10px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: var(--text-dim); margin-top: 4px;
}
.dms-hero-scroll {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--text-faint); font-size: 10px; letter-spacing: 3px;
  text-transform: uppercase; cursor: pointer; background: none; border: none;
}
.dms-hero-scroll svg { animation: dms-bounce 2s ease-in-out infinite; }
@keyframes dms-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* ─── Sections ─── */
.dms-section { padding: var(--section-py) 24px; position: relative; }
.dms-section-alt { background: var(--bg-alt); }
.dms-container { max-width: var(--max-w); margin: 0 auto; }

/* ─── Chapter Headers ─── */
.dms-chapter { text-align: center; margin-bottom: 72px; }
.dms-chapter-num {
  font-family: var(--serif); font-size: 56px; font-weight: 300;
  color: var(--gold); opacity: 0.35; line-height: 1; margin-bottom: 16px;
}
.dms-chapter-line {
  width: 60px; height: 1px; background: var(--gold);
  margin: 0 auto 16px; opacity: 0.35;
}
.dms-chapter-title {
  font-size: 12px; font-weight: 700; letter-spacing: 6px;
  text-transform: uppercase; color: var(--text-dim); font-family: var(--sans);
}

/* ─── About ─── */
.dms-about-grid {
  display: grid; grid-template-columns: 280px 1fr; gap: 64px;
  align-items: start;
}
.dms-about-avatar {
  width: 280px; height: 340px; object-fit: cover; border-radius: 4px;
  border: 1px solid var(--border); filter: grayscale(20%);
  transition: filter 0.5s;
}
.dms-about-avatar:hover { filter: grayscale(0%); }
.dms-about-content h3 {
  font-family: var(--serif); font-size: 28px; font-weight: 700;
  color: var(--text); margin-bottom: 24px;
}
.dms-about-bio {
  font-size: 16px; line-height: 1.85; color: var(--text-dim); margin-bottom: 28px;
}
.dms-about-location {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text-dim); padding: 8px 16px;
  border: 1px solid var(--border); border-radius: 4px;
}
.dms-about-location svg { color: var(--gold); width: 14px; height: 14px; }

/* ─── Skills ─── */
.dms-skills-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px;
}
.dms-skill-group-title {
  font-size: 11px; font-weight: 700; letter-spacing: 4px;
  text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
  padding-bottom: 8px; border-bottom: 1px solid var(--border);
}
.dms-skill-bars { display: flex; flex-direction: column; gap: 16px; }
.dms-skill-bar-hdr {
  display: flex; justify-content: space-between; margin-bottom: 6px;
}
.dms-skill-bar-name { font-size: 13px; font-weight: 500; color: var(--text); }
.dms-skill-bar-pct {
  font-size: 12px; font-weight: 600; color: var(--gold);
  font-family: var(--mono);
}
.dms-skill-bar-track {
  height: 3px; background: var(--border); border-radius: 2px; overflow: hidden;
}
.dms-skill-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 2px;
}

/* ─── Timeline (Experience) ─── */
.dms-timeline { position: relative; padding-left: 36px; }
.dms-timeline::before {
  content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px;
  width: 1px; background: var(--border);
}
.dms-timeline-item { position: relative; padding-bottom: 48px; }
.dms-timeline-item:last-child { padding-bottom: 0; }
.dms-timeline-dot {
  position: absolute; left: -33px; top: 8px; width: 11px; height: 11px;
  border-radius: 50%; background: var(--bg); border: 2px solid var(--gold);
}
.dms-timeline-role {
  font-family: var(--serif); font-size: 22px; font-weight: 700;
  color: var(--text); margin-bottom: 6px;
}
.dms-timeline-meta {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 14px; flex-wrap: wrap;
}
.dms-timeline-company { font-size: 14px; font-weight: 600; color: var(--gold); }
.dms-timeline-sep {
  width: 4px; height: 4px; border-radius: 50%; background: var(--text-faint);
}
.dms-timeline-period {
  font-size: 12px; color: var(--text-dim); font-family: var(--mono);
}
.dms-timeline-desc {
  font-size: 15px; line-height: 1.75; color: var(--text-dim); max-width: 620px;
}

/* ─── Education ─── */
.dms-edu-grid { display: grid; gap: 20px; }
.dms-edu-card {
  display: flex; align-items: start; gap: 20px; padding: 24px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
  transition: border-color 0.3s;
}
.dms-edu-card:hover { border-color: var(--gold); }
.dms-edu-icon {
  width: 46px; height: 46px; display: flex; align-items: center;
  justify-content: center; background: var(--gold-dim); border-radius: 10px;
  flex-shrink: 0; color: var(--gold);
}
.dms-edu-degree {
  font-family: var(--serif); font-size: 18px; font-weight: 700;
  color: var(--text); margin-bottom: 4px;
}
.dms-edu-school { font-size: 14px; color: var(--gold); font-weight: 600; }
.dms-edu-period {
  font-size: 12px; color: var(--text-dim); font-family: var(--mono);
  margin-top: 4px;
}

/* ─── Projects ─── */
.dms-projects-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px;
}
.dms-project-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.dms-project-card:hover {
  border-color: var(--gold); transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
}
.dms-project-img-wrap { position: relative; height: 200px; overflow: hidden; }
.dms-project-img {
  width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s;
}
.dms-project-card:hover .dms-project-img { transform: scale(1.06); }
.dms-project-body { padding: 24px; }
.dms-project-title {
  font-family: var(--serif); font-size: 20px; font-weight: 700;
  color: var(--text); margin-bottom: 10px;
}
.dms-project-desc {
  font-size: 14px; line-height: 1.65; color: var(--text-dim);
  margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}
.dms-project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
.dms-project-tag {
  font-size: 11px; font-weight: 500; padding: 4px 10px;
  background: var(--gold-dim); color: var(--gold); border-radius: 3px;
  font-family: var(--mono);
}
.dms-project-links {
  display: flex; gap: 20px; padding-top: 16px;
  border-top: 1px solid var(--border);
}
.dms-project-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: var(--text-dim);
  text-decoration: none; transition: color 0.3s;
}
.dms-project-link:hover { color: var(--gold); }

/* ─── Certifications ─── */
.dms-certs-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
}
.dms-cert-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; transition: border-color 0.3s;
}
.dms-cert-card:hover { border-color: var(--gold); }
.dms-cert-icon { color: var(--gold); flex-shrink: 0; }
.dms-cert-name { font-size: 14px; font-weight: 600; color: var(--text); }
.dms-cert-issuer { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

/* ─── Testimonials ─── */
.dms-test-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px;
}
.dms-test-card {
  padding: 32px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; position: relative;
}
.dms-test-qmark {
  font-family: var(--serif); font-size: 72px; color: var(--gold);
  opacity: 0.15; line-height: 1; position: absolute; top: 12px; left: 24px;
}
.dms-test-text {
  font-size: 15px; line-height: 1.75; color: var(--text-dim);
  font-style: italic; margin-bottom: 24px; position: relative; z-index: 1;
}
.dms-test-author { display: flex; align-items: center; gap: 12px; }
.dms-test-avatar {
  width: 42px; height: 42px; border-radius: 50%; object-fit: cover;
  border: 1px solid var(--border);
}
.dms-test-name { font-size: 14px; font-weight: 600; color: var(--text); }
.dms-test-role { font-size: 12px; color: var(--text-dim); }

/* ─── Contact ─── */
.dms-contact-inner {
  text-align: center; max-width: 600px; margin: 0 auto;
}
.dms-contact-text {
  font-family: var(--serif); font-size: 24px; color: var(--text-dim);
  margin-bottom: 48px; font-style: italic; line-height: 1.6;
}
.dms-contact-details {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; margin-bottom: 48px;
}
.dms-contact-item {
  display: flex; align-items: center; gap: 12px;
  font-size: 15px; color: var(--text-dim);
}
.dms-contact-item svg { color: var(--gold); width: 18px; height: 18px; }
.dms-contact-item a {
  color: var(--text); text-decoration: none; transition: color 0.3s;
}
.dms-contact-item a:hover { color: var(--gold); }
.dms-socials { display: flex; justify-content: center; gap: 20px; }
.dms-social-link {
  width: 46px; height: 46px; display: flex; align-items: center;
  justify-content: center; border: 1px solid var(--border); border-radius: 50%;
  color: var(--text-dim); transition: all 0.3s; text-decoration: none;
}
.dms-social-link:hover {
  border-color: var(--gold); color: var(--gold); background: var(--gold-dim);
}

/* ─── Footer ─── */
.dms-footer {
  padding: 52px 24px; text-align: center; border-top: 1px solid var(--border);
}
.dms-footer-line {
  width: 40px; height: 1px; background: var(--gold);
  margin: 0 auto 24px; opacity: 0.3;
}
.dms-footer-text {
  font-size: 12px; color: var(--text-faint); letter-spacing: 2px;
  text-transform: uppercase;
}
.dms-footer-copy {
  font-size: 11px; color: var(--text-faint); margin-top: 8px;
}

/* ─── Back-to-top ─── */
.dms-back-top {
  position: fixed; bottom: 32px; right: 32px; width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 50%; color: var(--gold); cursor: pointer; z-index: 800;
  transition: border-color 0.3s, background 0.3s;
}
.dms-back-top:hover { border-color: var(--gold); background: var(--gold-dim); }

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .dms-root { --section-py: 80px; }
  .dms-nav-links { display: none; }
  .dms-nav-toggle { display: block; }
  .dms-hero-name { font-size: 44px; }
  .dms-hero-stats { gap: 28px; flex-wrap: wrap; justify-content: center; }
  .dms-hero-stat-val { font-size: 28px; }
  .dms-about-grid { grid-template-columns: 1fr; gap: 32px; }
  .dms-about-avatar { width: 100%; max-width: 280px; height: 320px; margin: 0 auto; display: block; }
  .dms-skills-grid { grid-template-columns: 1fr; gap: 36px; }
  .dms-projects-grid { grid-template-columns: 1fr; }
  .dms-test-grid { grid-template-columns: 1fr; }
  .dms-certs-grid { grid-template-columns: 1fr; }
  .dms-chapter-num { font-size: 42px; }
}

@media (max-width: 480px) {
  .dms-root { --section-py: 64px; }
  .dms-hero { padding: 100px 20px 60px; }
  .dms-hero-name { font-size: 34px; }
  .dms-hero-pre { font-size: 9px; letter-spacing: 4px; }
  .dms-hero-tagline { font-size: 16px; }
  .dms-hero-stats { flex-direction: column; gap: 16px; }
  .dms-about-content h3 { font-size: 22px; }
  .dms-timeline-role { font-size: 18px; }
  .dms-project-body { padding: 18px; }
  .dms-test-card { padding: 22px; }
  .dms-contact-text { font-size: 20px; }
  .dms-chapter { margin-bottom: 48px; }
}
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

/** Scroll-triggered reveal wrapper */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Chapter heading (roman numeral + rule + title) */
function Chapter({ number, title }) {
  return (
    <div className="dms-chapter">
      <div className="dms-chapter-num">{number}</div>
      <div className="dms-chapter-line" />
      <h2 className="dms-chapter-title">{title}</h2>
    </div>
  );
}

/** Animated skill bar */
function SkillBar({ name, level, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      <div className="dms-skill-bar-hdr">
        <span className="dms-skill-bar-name">{name}</span>
        <span className="dms-skill-bar-pct">{level}%</span>
      </div>
      <div className="dms-skill-bar-track">
        <motion.div
          className="dms-skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Template Component
   ═══════════════════════════════════════════════════════════ */
export default function DigitalManifestoScroll() {
  const { portfolioData } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  /* ─── Data Merging (Pattern B: portfolioData + dummyData fallback) ─── */

  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials };
  if (portfolioData?.contact) {
    if (portfolioData.contact.email) socials.email = portfolioData.contact.email;
    if (portfolioData.contact.github) socials.github = portfolioData.contact.github;
    if (portfolioData.contact.linkedin) socials.linkedin = portfolioData.contact.linkedin;
    if (portfolioData.contact.twitter) socials.twitter = portfolioData.contact.twitter;
  }
  if (portfolioData?.socials) Object.assign(socials, portfolioData.socials);

  const stats = portfolioData?.stats || dummyData.stats;

  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === "string") {
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: 75 + ((i * 13) % 20), // Deterministic pseudo-random 75-95%
        category: SKILL_CATS[i % SKILL_CATS.length],
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  let projects = dummyData.projects;
  if (portfolioData?.projects?.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || "Project",
      description: p.description || "",
      techStack: p.technologies || p.techStack || [],
      image: p.image || dummyData.projects[i % dummyData.projects.length]?.image,
      liveUrl: p.liveUrl || p.link || "#",
      githubUrl: p.githubUrl || "#",
    }));
  }

  const experience =
    portfolioData?.experience?.length > 0
      ? portfolioData.experience
      : dummyData.experience;

  const testimonials =
    portfolioData?.testimonials?.length > 0
      ? portfolioData.testimonials
      : dummyData.testimonials;

  // Conditional sections (only render when real user data provides them)
  const education = portfolioData?.education || [];
  const certifications = portfolioData?.certifications || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  /* ─── Section ordering & alternating backgrounds ─── */
  const sectionOrder = [
    "about", "skills", "experience",
    ...(education.length > 0 ? ["education"] : []),
    "projects",
    ...(certifications.length > 0 ? ["certifications"] : []),
    "testimonials", "contact",
  ];
  const isAlt = (id) => sectionOrder.indexOf(id) % 2 === 1;

  /* ─── Chapter numbering (dynamic based on present sections) ─── */
  const chapterDefs = [
    { id: "about", title: "THE IDENTITY" },
    { id: "skills", title: "THE ARSENAL" },
    { id: "experience", title: "THE JOURNEY" },
    ...(education.length > 0 ? [{ id: "education", title: "THE FOUNDATION" }] : []),
    { id: "projects", title: "THE WORKS" },
    ...(certifications.length > 0 ? [{ id: "certifications", title: "THE CREDENTIALS" }] : []),
    { id: "testimonials", title: "THE VOICES" },
    { id: "contact", title: "THE SIGNAL" },
  ];
  const ch = {};
  chapterDefs.forEach((c, i) => { ch[c.id] = { num: ROMAN[i], title: c.title }; });

  /* ─── Scroll tracking ─── */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollProgress =
    typeof document !== "undefined" && document.documentElement.scrollHeight > window.innerHeight
      ? Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
      : 0;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  /* ═══════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="dms-root">
      <GlobalStyles />

      {/* ── Scroll Progress ── */}
      <div className="dms-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ── Navigation ── */}
      <nav className={`dms-nav${scrollY > 80 ? " dms-nav-scrolled" : ""}`}>
        <div className="dms-nav-inner">
          <button className="dms-nav-brand" onClick={() => scrollTo("hero")}>
            {personal.name?.split(" ")[0] || "Manifesto"}
          </button>
          <ul className="dms-nav-links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button className="dms-nav-link" onClick={() => scrollTo(l.id)}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="dms-nav-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="dms-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button className="dms-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={28} />
            </button>
            {navLinks.map((l, i) => (
              <motion.button
                key={l.id}
                className="dms-mobile-link"
                onClick={() => scrollTo(l.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          HERO
         ══════════════════════════════════════════════════════ */}
      <section className="dms-hero" id="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <p className="dms-hero-pre">A DIGITAL MANIFESTO BY</p>
          <h1 className="dms-hero-name">{personal.name}</h1>
          <div className="dms-hero-rule" />
          <p className="dms-hero-title">{personal.title}</p>
          {personal.tagline && (
            <p className="dms-hero-tagline">&ldquo;{personal.tagline}&rdquo;</p>
          )}
          
          <div className="dms-hero-actions">
            <button className="dms-btn dms-btn-primary" onClick={() => scrollTo("projects")}>View Portfolio</button>
            <button className="dms-btn dms-btn-outline" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </div>

          <div className="dms-hero-stats">
            <div className="dms-hero-stat">
              <span className="dms-hero-stat-val">{stats.yearsExperience}</span>
              <span className="dms-hero-stat-lbl">Years</span>
            </div>
            <div className="dms-hero-stat">
              <span className="dms-hero-stat-val">{stats.projectsCompleted}</span>
              <span className="dms-hero-stat-lbl">Projects</span>
            </div>
            <div className="dms-hero-stat">
              <span className="dms-hero-stat-val">{stats.happyClients}</span>
              <span className="dms-hero-stat-lbl">Clients</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CHAPTER I — ABOUT
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("about") ? " dms-section-alt" : ""}`} id="about">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.about.num} title={ch.about.title} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="dms-about-grid">
              <img src={personal.avatar} alt={personal.name} className="dms-about-avatar" />
              <div className="dms-about-content">
                <h3>Hello, I&rsquo;m {personal.name?.split(" ")[0]}</h3>
                <p className="dms-about-bio">{personal.bio}</p>
                {personal.location && (
                  <div className="dms-about-location">
                    <MapPin /> {personal.location}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CHAPTER II — SKILLS
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("skills") ? " dms-section-alt" : ""}`} id="skills">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.skills.num} title={ch.skills.title} />
          </Reveal>
          <div className="dms-skills-grid">
            {Object.entries(groupedSkills).map(([category, catSkills], gi) => (
              <Reveal key={category} delay={gi * 0.1}>
                <div>
                  <div className="dms-skill-group-title">{category}</div>
                  <div className="dms-skill-bars">
                    {catSkills.map((skill, si) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={si * 0.06} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CHAPTER III — EXPERIENCE
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("experience") ? " dms-section-alt" : ""}`} id="experience">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.experience.num} title={ch.experience.title} />
          </Reveal>
          <div className="dms-timeline">
            {experience.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="dms-timeline-item">
                  <div className="dms-timeline-dot" />
                  <h3 className="dms-timeline-role">{exp.role}</h3>
                  <div className="dms-timeline-meta">
                    <span className="dms-timeline-company">{exp.company}</span>
                    <span className="dms-timeline-sep" />
                    <span className="dms-timeline-period">{exp.period}</span>
                  </div>
                  <p className="dms-timeline-desc">{exp.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EDUCATION (Conditional — only if portfolioData provides it)
         ══════════════════════════════════════════════════════ */}
      {education.length > 0 && (
        <section className={`dms-section${isAlt("education") ? " dms-section-alt" : ""}`} id="education">
          <div className="dms-container">
            <Reveal>
              <Chapter number={ch.education.num} title={ch.education.title} />
            </Reveal>
            <div className="dms-edu-grid">
              {education.map((edu, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="dms-edu-card">
                    <div className="dms-edu-icon"><GraduationCap size={22} /></div>
                    <div>
                      <div className="dms-edu-degree">{edu.degree || edu.title}</div>
                      <div className="dms-edu-school">{edu.school || edu.institution}</div>
                      {edu.period && <div className="dms-edu-period">{edu.period}</div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          CHAPTER IV — PROJECTS
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("projects") ? " dms-section-alt" : ""}`} id="projects">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.projects.num} title={ch.projects.title} />
          </Reveal>
          <div className="dms-projects-grid">
            {projects.map((project, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="dms-project-card">
                  {project.image && (
                    <div className="dms-project-img-wrap">
                      <img src={project.image} alt={project.title} className="dms-project-img" />
                    </div>
                  )}
                  <div className="dms-project-body">
                    <h3 className="dms-project-title">{project.title}</h3>
                    <p className="dms-project-desc">{project.description}</p>
                    {project.techStack?.length > 0 && (
                      <div className="dms-project-tags">
                        {project.techStack.map((tech, ti) => (
                          <span key={ti} className="dms-project-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="dms-project-links">
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="dms-project-link">
                          <ExternalLink size={14} /> Live Demo
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== "#" && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="dms-project-link">
                          <Github size={14} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CERTIFICATIONS (Conditional)
         ══════════════════════════════════════════════════════ */}
      {certifications.length > 0 && (
        <section className={`dms-section${isAlt("certifications") ? " dms-section-alt" : ""}`} id="certifications">
          <div className="dms-container">
            <Reveal>
              <Chapter number={ch.certifications.num} title={ch.certifications.title} />
            </Reveal>
            <div className="dms-certs-grid">
              {certifications.map((cert, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="dms-cert-card">
                    <Award size={20} className="dms-cert-icon" />
                    <div>
                      <div className="dms-cert-name">{cert.name || cert.title}</div>
                      {(cert.issuer || cert.organization || cert.year) && (
                        <div className="dms-cert-issuer">
                          {[cert.issuer || cert.organization, cert.year].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          CHAPTER V — TESTIMONIALS
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("testimonials") ? " dms-section-alt" : ""}`} id="testimonials">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.testimonials.num} title={ch.testimonials.title} />
          </Reveal>
          <div className="dms-test-grid">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="dms-test-card">
                  <span className="dms-test-qmark">&ldquo;</span>
                  <p className="dms-test-text">{t.text}</p>
                  <div className="dms-test-author">
                    {t.avatar && <img src={t.avatar} alt={t.name} className="dms-test-avatar" />}
                    <div>
                      <div className="dms-test-name">{t.name}</div>
                      <div className="dms-test-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CHAPTER VI — CONTACT
         ══════════════════════════════════════════════════════ */}
      <section className={`dms-section${isAlt("contact") ? " dms-section-alt" : ""}`} id="contact">
        <div className="dms-container">
          <Reveal>
            <Chapter number={ch.contact.num} title={ch.contact.title} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="dms-contact-inner">
              <p className="dms-contact-text">
                Every great collaboration begins with a simple hello.
              </p>
              <div className="dms-contact-details">
                {socials.email && (
                  <div className="dms-contact-item">
                    <Mail />
                    <a href={`mailto:${socials.email}`}>{socials.email}</a>
                  </div>
                )}
                {personal.location && (
                  <div className="dms-contact-item">
                    <MapPin />
                    <span>{personal.location}</span>
                  </div>
                )}
              </div>
              <div className="dms-socials">
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="dms-social-link" aria-label="GitHub">
                    <Github size={20} />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="dms-social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="dms-social-link" aria-label="Twitter">
                    <Twitter size={20} />
                  </a>
                )}
                {socials.email && (
                  <a href={`mailto:${socials.email}`} className="dms-social-link" aria-label="Email">
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="dms-footer">
        <div className="dms-footer-line" />
        <p className="dms-footer-text">This manifesto was crafted by {personal.name}</p>
        <p className="dms-footer-copy">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>

      {/* ── Back to Top ── */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            key="back-top"
            className="dms-back-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            aria-label="Back to top"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
