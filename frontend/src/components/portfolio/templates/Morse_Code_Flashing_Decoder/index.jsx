import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Radio,
  Zap,
  Award,
  GraduationCap,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import dummyData from "../../../../data/dummy_data.json";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── Morse Code Map ─── */
const MORSE = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---",
  "3": "...--", "4": "....-", "5": ".....", "6": "-....",
  "7": "--...", "8": "---..", "9": "----.", " ": "/",
};

function toMorse(text) {
  return text
    .toUpperCase()
    .split("")
    .map((c) => MORSE[c] || "")
    .filter(Boolean)
    .join(" ");
}

const SKILL_CATS = ["Frontend", "Backend", "Tools", "Design", "Database", "DevOps"];

/* ─── Global Styles ─── */
function GlobalStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@300;400;500;600;700&display=swap');

.mcd-root {
  --bg: #0a0e0a;
  --bg-alt: #0d120d;
  --surface: #111811;
  --surface-hover: #161e16;
  --border: #1a2e1a;
  --green: #00ff41;
  --green-dim: rgba(0,255,65,0.12);
  --green-glow: rgba(0,255,65,0.30);
  --green-faint: rgba(0,255,65,0.05);
  --amber: #ffb000;
  --amber-dim: rgba(255,176,0,0.12);
  --text: #c8ffc8;
  --text-dim: #6ba86b;
  --text-faint: #2e4a2e;
  --mono: 'Share Tech Mono', monospace;
  --sans: 'Inter', system-ui, sans-serif;
  --max-w: 1100px;
  font-family: var(--mono);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}
.mcd-root *, .mcd-root *::before, .mcd-root *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}

/* scanlines overlay */
.mcd-root::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 2px,
    rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
  );
}

/* scrollbar */
.mcd-root::-webkit-scrollbar { width: 6px; }
.mcd-root::-webkit-scrollbar-track { background: var(--bg); }
.mcd-root::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.mcd-root::-webkit-scrollbar-thumb:hover { background: var(--green); }

/* ─── Nav ─── */
.mcd-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 900;
  padding: 0 32px; height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);
  transition: all 0.3s;
}
.mcd-nav-scrolled {
  background: rgba(10,14,10,0.9);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--green);
  box-shadow: 0 0 20px var(--green-dim);
}
.mcd-nav-brand {
  font-family: var(--mono); font-size: 14px; font-weight: 400;
  color: var(--green); background: none; border: none; cursor: pointer;
  letter-spacing: 2px;
}
.mcd-nav-brand span { color: var(--amber); }
.mcd-nav-links { display: flex; gap: 28px; list-style: none; }
.mcd-nav-link {
  font-size: 11px; letter-spacing: 3px; color: var(--text-dim);
  background: none; border: none; cursor: pointer;
  transition: color 0.2s; font-family: var(--mono);
}
.mcd-nav-link:hover { color: var(--green); text-shadow: 0 0 8px var(--green-glow); }
.mcd-nav-toggle { display: none; background: none; border: none; color: var(--text); cursor: pointer; padding: 8px; }

/* ─── Mobile Menu ─── */
.mcd-mobile-overlay {
  position: fixed; inset: 0; z-index: 950;
  background: rgba(10,14,10,0.97); backdrop-filter: blur(24px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 28px;
}
.mcd-mobile-close {
  position: absolute; top: 20px; right: 24px;
  background: none; border: none; color: var(--text); cursor: pointer;
}
.mcd-mobile-link {
  font-family: var(--mono); font-size: 22px; letter-spacing: 4px;
  color: var(--text-dim); background: none; border: none; cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
}
.mcd-mobile-link:hover { color: var(--green); text-shadow: 0 0 12px var(--green-glow); }

/* ─── Hero ─── */
.mcd-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 100px 24px 60px; position: relative; overflow: hidden;
}
.mcd-hero-bg {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.mcd-dot-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(var(--green-dim) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.5;
}
.mcd-hero-signal {
  font-size: 11px; letter-spacing: 6px; color: var(--green);
  margin-bottom: 28px; opacity: 0.8;
}
.mcd-hero-name {
  font-size: 60px; font-weight: 400; color: var(--green);
  text-shadow: 0 0 20px var(--green-glow), 0 0 60px rgba(0,255,65,0.15);
  line-height: 1.1; margin-bottom: 16px; letter-spacing: 2px;
  font-family: var(--mono);
}
.mcd-hero-morse {
  font-size: 13px; color: var(--text-dim); letter-spacing: 4px;
  margin-bottom: 20px; font-family: var(--mono);
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  max-width: 700px;
}
.mcd-hero-title {
  font-size: 16px; color: var(--amber); letter-spacing: 3px;
  margin-bottom: 12px;
}
.mcd-hero-tagline {
  font-size: 14px; color: var(--text-dim); max-width: 480px;
  margin: 0 auto 40px; font-family: var(--sans); line-height: 1.7;
}
.mcd-hero-actions {
  display: flex; gap: 16px; justify-content: center; margin-bottom: 56px;
}
.mcd-btn {
  font-family: var(--mono); font-size: 11px; letter-spacing: 3px;
  padding: 13px 28px; border-radius: 3px; cursor: pointer; transition: all 0.25s;
}
.mcd-btn-primary {
  background: var(--green-dim); color: var(--green);
  border: 1px solid var(--green);
}
.mcd-btn-primary:hover {
  background: var(--green); color: var(--bg);
  box-shadow: 0 0 20px var(--green-glow);
}
.mcd-btn-outline {
  background: transparent; color: var(--text-dim); border: 1px solid var(--border);
}
.mcd-btn-outline:hover {
  border-color: var(--green); color: var(--green);
  box-shadow: 0 0 12px var(--green-dim);
}
.mcd-hero-stats {
  display: flex; gap: 48px; justify-content: center;
}
.mcd-stat { text-align: center; }
.mcd-stat-val {
  font-size: 36px; color: var(--green); display: block;
  text-shadow: 0 0 12px var(--green-glow);
}
.mcd-stat-lbl {
  font-size: 10px; letter-spacing: 3px; color: var(--text-dim); margin-top: 4px;
}

/* ─── Sections ─── */
.mcd-section { padding: 100px 24px; }
.mcd-section-alt { background: var(--bg-alt); }
.mcd-container { max-width: var(--max-w); margin: 0 auto; }

/* ─── Section Header ─── */
.mcd-section-header { margin-bottom: 56px; }
.mcd-section-prefix {
  font-size: 10px; letter-spacing: 5px; color: var(--green); margin-bottom: 10px;
}
.mcd-section-title {
  font-size: 28px; color: var(--text); letter-spacing: 2px;
}
.mcd-section-morse {
  font-size: 11px; color: var(--text-faint); letter-spacing: 3px; margin-top: 6px;
}
.mcd-section-rule {
  width: 60px; height: 1px; background: var(--green);
  margin-top: 16px; box-shadow: 0 0 8px var(--green-glow);
}

/* ─── Decoder Widget ─── */
.mcd-decoder {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 6px; padding: 24px; margin-bottom: 48px;
  position: relative; overflow: hidden;
}
.mcd-decoder::before {
  content: 'MORSE DECODER ONLINE';
  position: absolute; top: 10px; right: 16px;
  font-size: 9px; letter-spacing: 3px; color: var(--text-faint);
}
.mcd-decoder-label {
  font-size: 10px; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 8px;
}
.mcd-decoder-input {
  width: 100%; background: var(--bg); border: 1px solid var(--border);
  border-radius: 3px; padding: 10px 14px; color: var(--text);
  font-family: var(--mono); font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.mcd-decoder-input:focus { border-color: var(--green); box-shadow: 0 0 8px var(--green-dim); }
.mcd-decoder-output {
  margin-top: 12px; padding: 12px 14px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 3px;
  font-size: 13px; color: var(--amber); letter-spacing: 3px;
  min-height: 42px; word-break: break-all; line-height: 1.5;
}
.mcd-decoder-output-label {
  font-size: 9px; letter-spacing: 3px; color: var(--text-faint); margin-bottom: 4px;
}

/* ─── About ─── */
.mcd-about-grid {
  display: grid; grid-template-columns: 260px 1fr; gap: 56px; align-items: start;
}
.mcd-avatar-wrap {
  position: relative; width: 260px; height: 300px;
}
.mcd-avatar-frame {
  position: absolute; inset: 0;
  border: 1px solid var(--green);
  border-radius: 4px;
  box-shadow: 0 0 24px var(--green-dim);
}
.mcd-avatar-frame::before {
  content: ''; position: absolute; top: 8px; left: 8px;
  right: -8px; bottom: -8px;
  border: 1px solid var(--border); border-radius: 4px; z-index: -1;
}
.mcd-avatar {
  width: 100%; height: 100%; object-fit: cover; border-radius: 4px;
  filter: grayscale(30%) contrast(1.05);
  transition: filter 0.4s;
}
.mcd-avatar:hover { filter: grayscale(0%); }
.mcd-about-name {
  font-size: 20px; color: var(--green); margin-bottom: 16px; letter-spacing: 2px;
}
.mcd-about-bio {
  font-size: 14px; line-height: 1.8; color: var(--text-dim);
  font-family: var(--sans); margin-bottom: 24px;
}
.mcd-about-location {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--text-dim); padding: 8px 14px;
  border: 1px solid var(--border); border-radius: 3px;
}
.mcd-about-location svg { color: var(--green); width: 14px; height: 14px; }

/* ─── Skills ─── */
.mcd-skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
.mcd-skill-group-title {
  font-size: 10px; letter-spacing: 4px; color: var(--amber);
  margin-bottom: 16px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.mcd-skill-bars { display: flex; flex-direction: column; gap: 14px; }
.mcd-skill-bar-hdr { display: flex; justify-content: space-between; margin-bottom: 5px; }
.mcd-skill-bar-name { font-size: 12px; color: var(--text); }
.mcd-skill-bar-pct { font-size: 11px; color: var(--green); }
.mcd-skill-bar-track { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.mcd-skill-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), rgba(0,255,65,0.5));
  border-radius: 2px;
  box-shadow: 0 0 6px var(--green-glow);
}

/* ─── Projects ─── */
.mcd-projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.mcd-project-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 6px; overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.mcd-project-card:hover {
  border-color: var(--green);
  box-shadow: 0 0 20px var(--green-dim);
  transform: translateY(-4px);
}
.mcd-project-img { width: 100%; height: 180px; object-fit: cover; display: block; }
.mcd-project-body { padding: 20px; }
.mcd-project-id {
  font-size: 9px; letter-spacing: 4px; color: var(--text-faint); margin-bottom: 6px;
}
.mcd-project-title { font-size: 16px; color: var(--green); margin-bottom: 8px; }
.mcd-project-desc {
  font-size: 13px; color: var(--text-dim); font-family: var(--sans);
  line-height: 1.65; margin-bottom: 14px;
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}
.mcd-project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.mcd-project-tag {
  font-size: 10px; padding: 3px 8px;
  background: var(--green-faint); color: var(--green);
  border: 1px solid var(--border); border-radius: 2px; letter-spacing: 1px;
}
.mcd-project-links {
  display: flex; gap: 16px; padding-top: 14px; border-top: 1px solid var(--border);
}
.mcd-project-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; letter-spacing: 2px; color: var(--text-dim);
  text-decoration: none; transition: color 0.2s;
}
.mcd-project-link:hover { color: var(--green); }

/* ─── Experience ─── */
.mcd-timeline { position: relative; padding-left: 32px; }
.mcd-timeline::before {
  content: ''; position: absolute; left: 6px; top: 8px; bottom: 8px;
  width: 1px; background: var(--border);
}
.mcd-timeline-item { position: relative; padding-bottom: 44px; }
.mcd-timeline-item:last-child { padding-bottom: 0; }
.mcd-timeline-dot {
  position: absolute; left: -29px; top: 8px;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--bg); border: 2px solid var(--green);
  box-shadow: 0 0 8px var(--green-glow);
}
.mcd-timeline-role { font-size: 18px; color: var(--text); margin-bottom: 6px; }
.mcd-timeline-meta {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
}
.mcd-timeline-company { font-size: 13px; color: var(--green); font-weight: 500; }
.mcd-timeline-sep { width: 4px; height: 4px; border-radius: 50%; background: var(--text-faint); }
.mcd-timeline-period { font-size: 11px; color: var(--text-dim); letter-spacing: 2px; }
.mcd-timeline-desc {
  font-size: 14px; line-height: 1.75; color: var(--text-dim);
  font-family: var(--sans); max-width: 620px;
}

/* ─── Certifications & Education ─── */
.mcd-cards-grid { display: grid; gap: 14px; }
.mcd-card {
  display: flex; align-items: start; gap: 16px; padding: 20px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 6px;
  transition: border-color 0.3s;
}
.mcd-card:hover { border-color: var(--green); }
.mcd-card-icon {
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  background: var(--green-faint); border-radius: 6px; color: var(--green); flex-shrink: 0;
}
.mcd-card-title { font-size: 15px; color: var(--text); margin-bottom: 4px; }
.mcd-card-sub { font-size: 12px; color: var(--green); }
.mcd-card-meta { font-size: 11px; color: var(--text-dim); margin-top: 2px; letter-spacing: 1px; }

/* ─── Testimonials ─── */
.mcd-test-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.mcd-test-card {
  padding: 28px; background: var(--surface);
  border: 1px solid var(--border); border-radius: 6px; position: relative;
}
.mcd-test-quote {
  font-size: 48px; color: var(--green); opacity: 0.15;
  position: absolute; top: 10px; left: 18px; line-height: 1;
}
.mcd-test-text {
  font-size: 14px; line-height: 1.75; color: var(--text-dim);
  font-family: var(--sans); font-style: italic; margin-bottom: 20px;
  position: relative; z-index: 1;
}
.mcd-test-author { display: flex; align-items: center; gap: 12px; }
.mcd-test-avatar {
  width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
  border: 1px solid var(--border);
}
.mcd-test-name { font-size: 13px; color: var(--text); }
.mcd-test-role { font-size: 11px; color: var(--text-dim); margin-top: 2px; }

/* ─── Contact ─── */
.mcd-contact-inner { text-align: center; max-width: 560px; margin: 0 auto; }
.mcd-contact-subtitle {
  font-size: 14px; color: var(--text-dim); font-family: var(--sans);
  margin-bottom: 40px; line-height: 1.7;
}
.mcd-contact-details {
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; margin-bottom: 40px;
}
.mcd-contact-item {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: var(--text-dim);
}
.mcd-contact-item svg { color: var(--green); width: 16px; height: 16px; }
.mcd-contact-item a { color: var(--text); text-decoration: none; transition: color 0.2s; }
.mcd-contact-item a:hover { color: var(--green); }
.mcd-socials { display: flex; justify-content: center; gap: 16px; }
.mcd-social-link {
  width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border); border-radius: 50%; color: var(--text-dim);
  text-decoration: none; transition: all 0.3s;
}
.mcd-social-link:hover {
  border-color: var(--green); color: var(--green);
  box-shadow: 0 0 12px var(--green-dim);
}

/* ─── Footer ─── */
.mcd-footer {
  padding: 40px 24px; text-align: center; border-top: 1px solid var(--border);
}
.mcd-footer-text {
  font-size: 11px; color: var(--text-faint); letter-spacing: 3px;
}

/* ─── Flash Indicator ─── */
.mcd-flash-indicator {
  position: fixed; top: 70px; right: 24px; z-index: 800;
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 12px var(--green-glow);
  transition: opacity 0.05s;
}

/* ─── Back to Top ─── */
.mcd-back-top {
  position: fixed; bottom: 28px; right: 28px; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 50%; color: var(--green); cursor: pointer; z-index: 800;
  transition: all 0.3s;
}
.mcd-back-top:hover {
  border-color: var(--green); box-shadow: 0 0 12px var(--green-dim);
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .mcd-nav-links { display: none; }
  .mcd-nav-toggle { display: block; }
  .mcd-hero-name { font-size: 36px; }
  .mcd-hero-stats { gap: 24px; flex-wrap: wrap; justify-content: center; }
  .mcd-about-grid { grid-template-columns: 1fr; gap: 32px; }
  .mcd-avatar-wrap { width: 100%; max-width: 240px; height: 280px; margin: 0 auto; }
  .mcd-skills-grid { grid-template-columns: 1fr; }
  .mcd-projects-grid { grid-template-columns: 1fr; }
  .mcd-test-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .mcd-hero { padding: 90px 16px 50px; }
  .mcd-hero-name { font-size: 28px; }
  .mcd-hero-stats { flex-direction: column; gap: 16px; }
  .mcd-section { padding: 72px 16px; }
}
    `}</style>
  );
}

/* ─── Animated Skill Bar ─── */
function SkillBar({ name, level, delay = 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div className="mcd-skill-bar-hdr">
        <span className="mcd-skill-bar-name">{name}</span>
        <span className="mcd-skill-bar-pct">{level}%</span>
      </div>
      <div className="mcd-skill-bar-track">
        <motion.div
          className="mcd-skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── Reveal Wrapper ─── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ prefix, title }) {
  return (
    <div className="mcd-section-header">
      <div className="mcd-section-prefix">&gt; {prefix}</div>
      <h2 className="mcd-section-title">{title}</h2>
      <div className="mcd-section-morse">{toMorse(title.substring(0, 20))}</div>
      <div className="mcd-section-rule" />
    </div>
  );
}

/* ─── Live Morse Decoder Widget ─── */
function DecoderWidget() {
  const [input, setInput] = useState(".... . .-.. .-.. ---");
  const decoded = input
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => {
          const entry = Object.entries(MORSE).find(([, v]) => v === code);
          return entry ? entry[0] : "";
        })
        .join("")
    )
    .join(" ")
    .trim();

  return (
    <div className="mcd-decoder">
      <div className="mcd-decoder-label">&gt; ENTER MORSE CODE (dots, dashes, spaces)</div>
      <input
        className="mcd-decoder-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. .... . .-.. .-.. ---"
        spellCheck={false}
      />
      <div className="mcd-decoder-output-label">&gt; DECODED OUTPUT</div>
      <div className="mcd-decoder-output">{decoded || "—"}</div>
    </div>
  );
}

/* ─── Morse Flash Indicator ─── */
function FlashIndicator({ name }) {
  const [visible, setVisible] = useState(true);
  const morseStr = toMorse(name.toUpperCase());
  const seqRef = useRef([]);
  const timerRef = useRef(null);

  const buildSeq = useCallback((morse) => {
    const DOT = 120, DASH = 360, GAP = 120, LETTER_GAP = 360, WORD_GAP = 840;
    const seq = [];
    morse.split("").forEach((ch) => {
      if (ch === ".") seq.push({ on: true, ms: DOT }, { on: false, ms: GAP });
      else if (ch === "-") seq.push({ on: true, ms: DASH }, { on: false, ms: GAP });
      else if (ch === " ") seq.push({ on: false, ms: LETTER_GAP });
      else if (ch === "/") seq.push({ on: false, ms: WORD_GAP });
    });
    seq.push({ on: false, ms: 1200 }); // pause before repeat
    return seq;
  }, []);

  useEffect(() => {
    seqRef.current = buildSeq(morseStr);
    let idx = 0;
    function step() {
      const item = seqRef.current[idx];
      setVisible(item.on);
      idx = (idx + 1) % seqRef.current.length;
      timerRef.current = setTimeout(step, item.ms);
    }
    step();
    return () => clearTimeout(timerRef.current);
  }, [morseStr, buildSeq]);

  return (
    <div
      className="mcd-flash-indicator"
      style={{ opacity: visible ? 1 : 0.07 }}
      title="Flashing your name in Morse Code"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Template
   ═══════════════════════════════════════════════════════════ */
export default function MorseCodeFlashingDecoder() {
  const { portfolioData } = usePortfolio();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ─── Data merge: portfolioData → dummyData fallback ─── */
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
    ...(portfolioData?.about?.avatar && { avatar: portfolioData.about.avatar }),
    ...(portfolioData?.about?.location && { location: portfolioData.about.location }),
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
        level: 75 + ((i * 13) % 20),
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
    portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;

  const testimonials =
    portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;

  const education = portfolioData?.education || [];
  const certifications = portfolioData?.certifications || [];

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  /* ─── Scroll ─── */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: "about", label: "ABOUT" },
    { id: "skills", label: "SKILLS" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "projects", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <div className="mcd-root">
      <GlobalStyles />

      {/* ── Morse Flash Indicator ── */}
      <FlashIndicator name={personal.name} />

      {/* ── Navigation ── */}
      <nav className={`mcd-nav${scrollY > 60 ? " mcd-nav-scrolled" : ""}`}>
        <button className="mcd-nav-brand" onClick={() => scrollTo("hero")}>
          &gt; <span>{personal.name?.split(" ")[0] || "MORSE"}</span>.exe
        </button>
        <ul className="mcd-nav-links">
          {navLinks.map((l) => (
            <li key={l.id}>
              <button className="mcd-nav-link" onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <button className="mcd-nav-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mcd-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="mcd-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">
              <X size={26} />
            </button>
            {navLinks.map((l, i) => (
              <motion.button
                key={l.id}
                className="mcd-mobile-link"
                onClick={() => scrollTo(l.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          HERO
         ══════════════════════════════════════════════ */}
      <section className="mcd-hero" id="hero">
        <div className="mcd-hero-bg">
          <div className="mcd-dot-grid" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <p className="mcd-hero-signal">
            <Radio size={12} style={{ display: "inline", marginRight: 8 }} />
            TRANSMISSION INCOMING · SIGNAL LOCKED
          </p>
          <h1 className="mcd-hero-name">{personal.name}</h1>
          <p className="mcd-hero-morse">
            {toMorse((personal.name || "").substring(0, 18))}
          </p>
          <p className="mcd-hero-title">{personal.title}</p>
          {personal.tagline && (
            <p className="mcd-hero-tagline">{personal.tagline}</p>
          )}
          <div className="mcd-hero-actions">
            <button className="mcd-btn mcd-btn-primary" onClick={() => scrollTo("projects")}>
              VIEW PROJECTS
            </button>
            <button className="mcd-btn mcd-btn-outline" onClick={() => scrollTo("contact")}>
              CONTACT
            </button>
          </div>
          <div className="mcd-hero-stats">
            <div className="mcd-stat">
              <span className="mcd-stat-val">{stats.yearsExperience}</span>
              <span className="mcd-stat-lbl">YEARS EXP</span>
            </div>
            <div className="mcd-stat">
              <span className="mcd-stat-val">{stats.projectsCompleted}</span>
              <span className="mcd-stat-lbl">PROJECTS</span>
            </div>
            <div className="mcd-stat">
              <span className="mcd-stat-val">{stats.happyClients}</span>
              <span className="mcd-stat-lbl">CLIENTS</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          DECODER WIDGET
         ══════════════════════════════════════════════ */}
      <section className="mcd-section mcd-section-alt" id="decoder">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="INTERACTIVE.TOOL" title="LIVE DECODER" />
          </Reveal>
          <Reveal delay={0.1}>
            <DecoderWidget />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT
         ══════════════════════════════════════════════ */}
      <section className="mcd-section" id="about">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="SYSTEM.INFO" title="ABOUT" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mcd-about-grid">
              <div className="mcd-avatar-wrap">
                <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="mcd-avatar" />
                <div className="mcd-avatar-frame" />
              </div>
              <div>
                <p className="mcd-about-name">&gt; {personal.name}</p>
                <p className="mcd-about-bio">{personal.bio}</p>
                {personal.location && (
                  <div className="mcd-about-location">
                    <MapPin /> {personal.location}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SKILLS
         ══════════════════════════════════════════════ */}
      <section className="mcd-section mcd-section-alt" id="skills">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="SKILL.MATRIX" title="SKILLS" />
          </Reveal>
          <div className="mcd-skills-grid">
            {Object.entries(groupedSkills).map(([cat, catSkills], gi) => (
              <Reveal key={cat} delay={gi * 0.1}>
                <div>
                  <div className="mcd-skill-group-title">&gt; {cat}</div>
                  <div className="mcd-skill-bars">
                    {catSkills.map((s, si) => (
                      <SkillBar key={s.name} name={s.name} level={s.level} delay={si * 0.05} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EXPERIENCE
         ══════════════════════════════════════════════ */}
      <section className="mcd-section" id="experience">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="CAREER.LOG" title="EXPERIENCE" />
          </Reveal>
          <div className="mcd-timeline">
            {experience.map((exp, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="mcd-timeline-item">
                  <div className="mcd-timeline-dot" />
                  <h3 className="mcd-timeline-role">{exp.role}</h3>
                  <div className="mcd-timeline-meta">
                    <span className="mcd-timeline-company">{exp.company}</span>
                    <span className="mcd-timeline-sep" />
                    <span className="mcd-timeline-period">{exp.period}</span>
                  </div>
                  <p className="mcd-timeline-desc">{exp.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EDUCATION (conditional)
         ══════════════════════════════════════════════ */}
      {education.length > 0 && (
        <section className="mcd-section mcd-section-alt" id="education">
          <div className="mcd-container">
            <Reveal>
              <SectionHeader prefix="ACADEMIC.RECORD" title="EDUCATION" />
            </Reveal>
            <div className="mcd-cards-grid">
              {education.map((edu, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="mcd-card">
                    <div className="mcd-card-icon">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="mcd-card-title">{edu.degree || edu.title}</div>
                      <div className="mcd-card-sub">{edu.school || edu.institution}</div>
                      {edu.period && <div className="mcd-card-meta">{edu.period}</div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          PROJECTS
         ══════════════════════════════════════════════ */}
      <section className={`mcd-section${education.length > 0 ? "" : " mcd-section-alt"}`} id="projects">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="PROJECT.FILES" title="PROJECTS" />
          </Reveal>
          <div className="mcd-projects-grid">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="mcd-project-card">
                  {p.image && (
                    <img src={p.image} alt={p.title || "Project Screenshot"} className="mcd-project-img" />
                  )}
                  <div className="mcd-project-body">
                    <div className="mcd-project-id">FILE_{String(i + 1).padStart(3, "0")}</div>
                    <h3 className="mcd-project-title">{p.title}</h3>
                    <p className="mcd-project-desc">{p.description}</p>
                    {p.techStack?.length > 0 && (
                      <div className="mcd-project-tags">
                        {p.techStack.map((t, ti) => (
                          <span key={ti} className="mcd-project-tag">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="mcd-project-links">
                      {p.liveUrl && p.liveUrl !== "#" && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="mcd-project-link">
                          <ExternalLink size={12} /> LIVE
                        </a>
                      )}
                      {p.githubUrl && p.githubUrl !== "#" && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="mcd-project-link">
                          <Github size={12} /> SOURCE
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

      {/* ══════════════════════════════════════════════
          CERTIFICATIONS (conditional)
         ══════════════════════════════════════════════ */}
      {certifications.length > 0 && (
        <section className="mcd-section" id="certifications">
          <div className="mcd-container">
            <Reveal>
              <SectionHeader prefix="CREDENTIALS.DB" title="CERTIFICATIONS" />
            </Reveal>
            <div className="mcd-cards-grid">
              {certifications.map((cert, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="mcd-card">
                    <div className="mcd-card-icon">
                      <Award size={18} />
                    </div>
                    <div>
                      <div className="mcd-card-title">{cert.name || cert.title}</div>
                      {(cert.issuer || cert.organization) && (
                        <div className="mcd-card-sub">{cert.issuer || cert.organization}</div>
                      )}
                      {cert.year && <div className="mcd-card-meta">{cert.year}</div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
         ══════════════════════════════════════════════ */}
      <section className="mcd-section mcd-section-alt" id="testimonials">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="SIGNAL.RECEIVED" title="TESTIMONIALS" />
          </Reveal>
          <div className="mcd-test-grid">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.09}>
                <div className="mcd-test-card">
                  <div className="mcd-test-quote">&ldquo;</div>
                  <p className="mcd-test-text">{t.text}</p>
                  <div className="mcd-test-author">
                    {t.avatar && (
                      <img src={t.avatar} alt={t.name || "Profile Avatar"} className="mcd-test-avatar" />
                    )}
                    <div>
                      <div className="mcd-test-name">{t.name}</div>
                      <div className="mcd-test-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT
         ══════════════════════════════════════════════ */}
      <section className="mcd-section" id="contact">
        <div className="mcd-container">
          <Reveal>
            <SectionHeader prefix="OPEN.CHANNEL" title="CONTACT" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mcd-contact-inner">
              <p className="mcd-contact-subtitle">
                Signal received. Ready to establish a connection — let&apos;s build something remarkable together.
              </p>
              <div className="mcd-contact-details">
                {socials.email && (
                  <div className="mcd-contact-item">
                    <Mail />
                    <a href={`mailto:${socials.email}`}>{socials.email}</a>
                  </div>
                )}
                {personal.location && (
                  <div className="mcd-contact-item">
                    <MapPin />
                    <span>{personal.location}</span>
                  </div>
                )}
              </div>
              <div className="mcd-socials">
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="mcd-social-link" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="mcd-social-link" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="mcd-social-link" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                )}
                {socials.email && (
                  <a href={`mailto:${socials.email}`} className="mcd-social-link" aria-label="Email">
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mcd-footer">
        <p className="mcd-footer-text">
          &gt; TRANSMISSION COMPLETE · {personal.name} · &copy; {new Date().getFullYear()}
        </p>
      </footer>

      {/* ── Back to Top ── */}
      <AnimatePresence>
        {scrollY > 400 && (
          <motion.button
            key="back-top"
            className="mcd-back-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            aria-label="Back to top"
          >
            <ChevronUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
