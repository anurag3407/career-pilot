import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2, VolumeX, Mic, Pause, Play, SkipForward, SkipBack,
  Github, Linkedin, Twitter, Mail, ExternalLink,
  ChevronRight, Headphones, Radio, Waveform
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── Design tokens ─────────────────────────────────────── */
const C = {
  bg:      "#0D0F14",
  surface: "#13161D",
  card:    "#1A1D27",
  border:  "rgba(255,255,255,0.07)",
  accent:  "#7C5CFC",
  accent2: "#4ECDC4",
  accent3: "#FF6B9D",
  text:    "#EAEAF4",
  muted:   "rgba(234,234,244,0.5)",
  dim:     "rgba(234,234,244,0.25)",
};

/* ─── Waveform bar animation ─────────────────────────────── */
function WaveBar({ delay = 0, color = C.accent, playing = true }) {
  return (
    <motion.div
      style={{
        width: 3,
        borderRadius: 2,
        background: color,
        transformOrigin: "bottom",
      }}
      animate={playing ? { scaleY: [0.2, 1, 0.4, 0.9, 0.3, 1, 0.5] } : { scaleY: 0.2 }}
      transition={playing ? { duration: 1.2, delay, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
    />
  );
}

function WaveGroup({ playing, color = C.accent, bars = 6, height = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <WaveBar key={i} delay={i * 0.12} color={color} playing={playing} />
      ))}
    </div>
  );
}

/* ─── Section label ──────────────────────────────────────── */
function SectionLabel({ children, color = C.accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 24, height: 2, background: color, borderRadius: 2 }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color }}>
        {children}
      </span>
    </div>
  );
}

/* ─── Track / narration pill ─────────────────────────────── */
function TrackPill({ label, active, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 10,
        border: `1px solid ${active ? C.accent : C.border}`,
        background: active ? `${C.accent}18` : C.surface,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        color: active ? C.accent : C.muted,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, minWidth: 20 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{label}</span>
      {active && <WaveGroup playing bars={4} height={16} />}
    </motion.button>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function TextToSpeechNarratorDrive() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  const sections = ["hero", "about", "skills", "projects", "experience", "testimonials", "contact"];
  const [activeSection, setActiveSection] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const sectionLabels = ["Intro", "About Me", "Skills", "Projects", "Experience", "Testimonials", "Contact"];

  /* Simulate narration progress */
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setActiveSection((s) => {
              if (s < sections.length - 1) return s + 1;
              setPlaying(false);
              return s;
            });
            return 0;
          }
          return p + 0.5;
        });
      }, 80);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, sections.length]);

  const goTo = useCallback((i) => {
    setActiveSection(i);
    setProgress(0);
  }, []);

  const skip = (dir) => {
    const next = Math.max(0, Math.min(sections.length - 1, activeSection + dir));
    goTo(next);
  };

  const togglePlay = () => setPlaying((p) => !p);

  /* Scroll the active section into view */
  const sectionRefs = useRef({});
  useEffect(() => {
    const el = sectionRefs.current[sections[activeSection]];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  /* Contact links */
  const contactLinks = [
    { Icon: Mail, href: socials.email?.includes("@") ? `mailto:${socials.email}` : socials.email, label: "Email" },
    { Icon: Github, href: socials.github, label: "GitHub" },
    { Icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { Icon: Twitter, href: socials.twitter, label: "Twitter" },
  ].filter((l) => l.href);

  const featuredProjects = projects.slice(0, 6);
  const recentExp = experience?.slice(0, 4) || [];
  const topSkills = skills.slice(0, 12);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Inter', 'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;600;700&display=swap');
        .tts-root * { box-sizing: border-box; }
        .tts-root { overflow-x: hidden; }
        .tts-section { padding: 80px 48px; max-width: 1100px; margin: 0 auto; }
        @media (max-width: 768px) { .tts-section { padding: 64px 20px; } }
        .tts-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 640px) { .tts-grid-2 { grid-template-columns: 1fr; } }
        .tts-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width: 900px) { .tts-grid-3 { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .tts-grid-3 { grid-template-columns: 1fr; } }
        .tts-card {
          background: ${C.card}; border: 1px solid ${C.border};
          border-radius: 16px; overflow: hidden;
          transition: border-color .25s, transform .25s, box-shadow .25s;
        }
        .tts-card:hover {
          border-color: ${C.accent}50;
          transform: translateY(-3px);
          box-shadow: 0 12px 40px ${C.accent}12;
        }
        .tts-skill-bar { background: rgba(255,255,255,0.06); border-radius: 99px; height: 4px; overflow: hidden; }
        .tts-skill-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${C.accent}, ${C.accent2}); }
        .tts-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 99px;
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          cursor: pointer; border: none; text-decoration: none;
          transition: opacity .2s, transform .2s;
        }
        .tts-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .tts-tag {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 99px;
          background: ${C.accent}18; color: ${C.accent}; border: 1px solid ${C.accent}30;
        }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}50; border-radius: 3px; }
      `}</style>

      <div className="tts-root">

        {/* ── Sticky Narrator Player ── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: `${C.surface}ee`, backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${C.accent}20`, border: `1px solid ${C.accent}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Headphones size={16} color={C.accent} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>NarrateMe</span>
            </div>

            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {personal.name} — {sectionLabels[activeSection]}
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 5, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`, borderRadius: 99, transition: "width 0.08s linear" }} />
              </div>
            </div>

            {/* Waveform display */}
            {!muted && <WaveGroup playing={playing} bars={5} height={22} />}

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => skip(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
                <SkipBack size={16} />
              </button>
              <button onClick={togglePlay} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: C.accent, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}>
                {playing ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 2 }} />}
              </button>
              <button onClick={() => skip(1)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
                <SkipForward size={16} />
              </button>
              <button onClick={() => setMuted((m) => !m)} style={{ background: "none", border: "none", cursor: "pointer", color: muted ? C.dim : C.muted, padding: 4 }}>
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", gap: 0 }}>

          {/* ── Sidebar track list ── */}
          <aside style={{
            width: 220, flexShrink: 0, padding: "32px 16px",
            borderRight: `1px solid ${C.border}`,
            position: "sticky", top: 57, height: "calc(100vh - 57px)",
            overflowY: "auto", display: "flex", flexDirection: "column", gap: 8,
          }}
            className="tts-sidebar-hidden"
          >
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim, marginBottom: 8 }}>Chapters</p>
            {sectionLabels.map((label, i) => (
              <TrackPill key={i} label={label} active={activeSection === i} onClick={() => goTo(i)} index={i} />
            ))}
          </aside>

          {/* ── Main content ── */}
          <main style={{ flex: 1, minWidth: 0 }}>

            {/* HERO */}
            <section ref={(el) => (sectionRefs.current["hero"] = el)} id="hero">
              <div className="tts-section" style={{ paddingTop: 100, paddingBottom: 80 }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                  <SectionLabel color={C.accent}>Now Playing — Chapter 01</SectionLabel>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 28 }}>
                    <div>
                      <h1 style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1.5px", margin: 0 }}>
                        {personal.name}
                      </h1>
                      <p style={{ fontSize: "clamp(1rem,2.5vw,1.5rem)", color: C.accent, fontWeight: 600, marginTop: 10 }}>
                        {personal.title}
                      </p>
                      <p style={{ color: C.muted, maxWidth: 560, lineHeight: 1.7, marginTop: 14, fontSize: 15 }}>
                        {personal.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
                    {[
                      { val: `${stats.yearsExperience}+`, label: "Years exp." },
                      { val: `${stats.projectsCompleted}+`, label: "Projects" },
                      { val: `${stats.happyClients}+`, label: "Clients" },
                    ].map(({ val, label }) => (
                      <div key={label}>
                        <div style={{ fontSize: 32, fontWeight: 900, color: C.accent, lineHeight: 1 }}>{val}</div>
                        <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 4 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={togglePlay} className="tts-btn" style={{ background: C.accent, color: "#fff" }}>
                      {playing ? <><Pause size={14} /> Pause Narration</> : <><Play size={14} /> Listen to My Story</>}
                    </button>
                    <a href={`mailto:${socials.email}`} className="tts-btn" style={{ background: "transparent", color: C.accent, border: `1px solid ${C.accent}40` }}>
                      <Mail size={14} /> Get in Touch
                    </a>
                  </div>

                  {/* Audio visualizer strip */}
                  <div style={{ marginTop: 40, display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
                    {Array.from({ length: 40 }).map((_, i) => {
                      const h = 10 + Math.sin(i * 0.6) * 20 + Math.random() * 20;
                      return (
                        <motion.div
                          key={i}
                          style={{ flex: 1, borderRadius: 2, background: i % 3 === 0 ? C.accent : i % 3 === 1 ? C.accent2 : C.accent3, opacity: 0.6 }}
                          animate={playing ? { height: [h, h * 0.3, h * 0.8, h * 0.5, h] } : { height: h * 0.2 }}
                          transition={{ duration: 1 + i * 0.02, delay: i * 0.02, repeat: Infinity, ease: "easeInOut" }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ABOUT */}
            <section ref={(el) => (sectionRefs.current["about"] = el)} id="about" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section">
                <SectionLabel color={C.accent2}>Chapter 02 — About</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>
                  The Voice Behind the Work
                </h2>
                <div className="tts-grid-2" style={{ alignItems: "center" }}>
                  <div>
                    <p style={{ color: C.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>{personal.bio}</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      {contactLinks.slice(0, 3).map(({ Icon, href, label }) => (
                        <a key={label} href={href} title={label} target="_blank" rel="noopener noreferrer" style={{
                          width: 40, height: 40, borderRadius: 10, background: C.surface,
                          border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                          color: C.muted, transition: "all .2s",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                        >
                          <Icon size={17} />
                        </a>
                      ))}
                    </div>
                  </div>
                  {/* Narration card */}
                  <div className="tts-card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <Radio size={16} color={C.accent} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.2em" }}>CURRENTLY NARRATING</span>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", marginLeft: "auto" }} />
                    </div>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                      Located in <strong style={{ color: C.text }}>{personal.location}</strong>, specialising in full-stack engineering with a passion for clean design and performant code.
                    </p>
                    <div style={{ marginTop: 20 }}>
                      <WaveGroup playing={playing} color={C.accent2} bars={8} height={36} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SKILLS */}
            <section ref={(el) => (sectionRefs.current["skills"] = el)} id="skills" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section">
                <SectionLabel color={C.accent3}>Chapter 03 — Skills</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>
                  My Tech Stack
                </h2>
                <div className="tts-grid-2" style={{ gap: 12 }}>
                  {topSkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      className="tts-card"
                      style={{ padding: "16px 18px" }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      viewport={{ once: true }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{skill.name}</span>
                        <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>{skill.level}%</span>
                      </div>
                      <div className="tts-skill-bar">
                        <motion.div
                          className="tts-skill-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* PROJECTS */}
            <section ref={(el) => (sectionRefs.current["projects"] = el)} id="projects" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section">
                <SectionLabel color={C.accent}>Chapter 04 — Projects</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>
                  Featured Work
                </h2>
                <div className="tts-grid-3">
                  {featuredProjects.map((project, i) => (
                    <motion.div
                      key={project.title}
                      className="tts-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                    >
                      {project.image && (
                        <div style={{ height: 140, overflow: "hidden" }}>
                          <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </div>
                      )}
                      <div style={{ padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{project.title}</h3>
                          <div style={{ display: "flex", gap: 6 }}>
                            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.muted }}><Github size={14} /></a>}
                            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.muted }}><ExternalLink size={14} /></a>}
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
                          {project.description?.slice(0, 100)}...
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {project.techStack?.slice(0, 3).map((t) => (
                            <span key={t} className="tts-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* EXPERIENCE */}
            <section ref={(el) => (sectionRefs.current["experience"] = el)} id="experience" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section">
                <SectionLabel color={C.accent2}>Chapter 05 — Experience</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>
                  Where I've Worked
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {recentExp.map((exp, i) => (
                    <motion.div
                      key={i}
                      className="tts-card"
                      style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* Timeline dot */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />
                        {i < recentExp.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 32, background: `${C.accent}30`, marginTop: 6 }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{exp.role || exp.title}</h3>
                            <p style={{ fontSize: 13, color: C.accent, fontWeight: 600, margin: "4px 0 0" }}>{exp.company}</p>
                          </div>
                          <span style={{ fontSize: 11, color: C.dim, background: C.surface, padding: "4px 10px", borderRadius: 6, height: "fit-content" }}>
                            {exp.duration || exp.period}
                          </span>
                        </div>
                        {exp.description && (
                          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginTop: 10 }}>{exp.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section ref={(el) => (sectionRefs.current["testimonials"] = el)} id="testimonials" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section">
                <SectionLabel color={C.accent3}>Chapter 06 — Testimonials</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>
                  What Others Say
                </h2>
                <div className="tts-grid-3">
                  {(testimonials || []).slice(0, 3).map((t, i) => (
                    <motion.div
                      key={i}
                      className="tts-card"
                      style={{ padding: 22 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        {t.avatar
                          ? <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                          : <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.accent }}>
                              {t.name?.[0]}
                            </div>
                        }
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: C.dim }}>{t.role}</div>
                        </div>
                        <Mic size={14} color={C.accent3} style={{ marginLeft: "auto" }} />
                      </div>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, fontStyle: "italic" }}>"{t.text || t.content}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section ref={(el) => (sectionRefs.current["contact"] = el)} id="contact" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="tts-section" style={{ paddingBottom: 100 }}>
                <SectionLabel color={C.accent}>Chapter 07 — Contact</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 12 }}>
                  Let's Create Something
                </h2>
                <p style={{ color: C.muted, fontSize: 15, marginBottom: 36, maxWidth: 480 }}>
                  The narration is over — now it's your turn to say hello. Drop a message and let's collaborate.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                  {contactLinks.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="tts-btn"
                      style={{ background: C.card, color: C.text, border: `1px solid ${C.border}` }}>
                      <Icon size={15} /> {label}
                    </a>
                  ))}
                </div>
                {/* Final waveform outro */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48, opacity: 0.5 }}>
                  {Array.from({ length: 32 }).map((_, i) => {
                    const h = 8 + Math.sin(i * 0.8) * 14 + 6;
                    return (
                      <motion.div key={i} style={{ flex: 1, borderRadius: 2, background: C.accent }}
                        animate={playing ? { height: [h, h * 0.3, h * 0.9, h] } : { height: h * 0.2 }}
                        transition={{ duration: 1 + i * 0.03, delay: i * 0.03, repeat: Infinity, ease: "easeInOut" }}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Hide sidebar on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .tts-sidebar-hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
