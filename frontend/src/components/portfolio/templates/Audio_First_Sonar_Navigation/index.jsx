import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  Volume2, Mic, Radio, Music, Headphones
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  bg:     "#0A0A12",
  mid:    "#12121C",
  card:   "#1A1A28",
  text:   "#F0F0F8",
  muted:  "rgba(240,240,248,.5)",
  accent: "#00E5CC",
  accent2: "#7B61FF",
  border: "rgba(255,255,255,.07)",
};

const SONAR_ITEMS = [
  { id: "hero",         label: "Home",      Icon: Radio,     color: "#00E5CC" },
  { id: "about",        label: "About",     Icon: Mic,       color: "#7B61FF" },
  { id: "skills",       label: "Skills",    Icon: Volume2,   color: "#FF6B6B" },
  { id: "projects",     label: "Projects",  Icon: Music,     color: "#FFB347" },
  { id: "experience",   label: "Experience",Icon: Headphones, color: "#4ECDC4" },
  { id: "testimonials", label: "Reviews",   Icon: Volume2,   color: "#FF6B9D" },
  { id: "contact",      label: "Contact",   Icon: Radio,     color: "#00E5CC" },
];

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

      .asn-root { background:${C.bg}; color:${C.text}; font-family:'Space Grotesk',sans-serif; overflow-x:hidden; padding-bottom:100px; }

      .asn-sec { padding:90px 48px; position:relative; }
      @media (max-width:768px) { .asn-sec { padding:72px 24px; } }
      .asn-max { max-width:1100px; margin:0 auto; }

      .asn-label { font-size:10px; font-weight:700; letter-spacing:5px; text-transform:uppercase; color:${C.accent}; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
      .asn-label::before { content:''; display:inline-block; width:20px; height:1px; background:${C.accent}; }

      .asn-h2 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:44px; letter-spacing:-0.5px; }

      .asn-card {
        background:${C.card}; border:1px solid ${C.border};
        border-radius:16px; overflow:hidden;
        transition:border-color .25s, transform .25s, box-shadow .25s;
      }
      .asn-card:hover {
        border-color:${C.accent}40;
        transform:translateY(-3px);
        box-shadow:0 12px 40px ${C.accent}15;
      }

      .asn-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .asn-about-grid { grid-template-columns:1fr 1.5fr; } }

      .asn-proj-grid { display:grid; grid-template-columns:1fr; gap:22px; }
      @media (min-width:640px)  { .asn-proj-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .asn-proj-grid { grid-template-columns:repeat(3,1fr); } }

      .asn-skills-grid { display:grid; grid-template-columns:1fr; gap:10px; }
      @media (min-width:640px) { .asn-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .asn-testi-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:768px) { .asn-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .asn-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .asn-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .asn-contact-grid { grid-template-columns:1fr 1fr; } }

      .asn-skill-track { background:rgba(255,255,255,.06); border-radius:99px; height:3px; }
      .asn-skill-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.accent},${C.accent2}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      .asn-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:13px 26px; border-radius:99px;
        font-size:12px; font-weight:700; letter-spacing:1px;
        cursor:pointer; transition:all .2s; text-decoration:none; border:none; font-family:'Space Grotesk',sans-serif;
      }
      .asn-btn-primary { background:${C.accent}; color:${C.bg}; }
      .asn-btn-primary:hover { background:#00CFB8; transform:translateY(-2px); box-shadow:0 8px 28px ${C.accent}50; }
      .asn-btn-ghost { background:transparent; color:${C.text}; border:1px solid ${C.border}; }
      .asn-btn-ghost:hover { border-color:${C.accent}; color:${C.accent}; }

      .asn-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:600; background:${C.accent}15; color:${C.accent}; border:1px solid ${C.accent}30; }

      .asn-input {
        width:100%; padding:13px 18px; background:${C.card};
        border:1px solid ${C.border}; border-radius:12px;
        color:${C.text}; font-family:'Space Grotesk',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .asn-input:focus { border-color:${C.accent}; }
      .asn-input::placeholder { color:${C.muted}; }

      .asn-timeline { position:relative; padding-left:32px; }
      .asn-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.accent},transparent); }
      .asn-timeline-dot { position:absolute; left:-7px; top:22px; width:14px; height:14px; border-radius:50%; background:${C.accent}; box-shadow:0 0 12px ${C.accent}80; }
      .asn-timeline-item { position:relative; margin-bottom:28px; }
      .asn-timeline-item:last-child { margin-bottom:0; }

      .asn-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:12px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .asn-social:hover { border-color:${C.accent}; color:${C.accent}; background:${C.accent}10; }

      .asn-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,${C.accent}30 20%,${C.accent}30 80%,transparent); }

      @media (prefers-reduced-motion:reduce) { * { transition-duration:.01ms !important; animation:none !important; } }
    `}</style>
  );
}

function SonarPulsingCircle({ color = C.accent, size = 80, duration = 2 }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `1px solid ${color}`,
          }}
          animate={{ scale: [1, 2], opacity: [0.6, 0] }}
          transition={{ duration, repeat: Infinity, delay: i * (duration / 3), ease: "easeOut" }}
        />
      ))}
      <div style={{
        position: "absolute", inset: "30%", borderRadius: "50%",
        background: color, boxShadow: `0 0 16px ${color}80`,
      }} />
    </div>
  );
}

function AudioBars({ style = {} }) {
  const bars = [0.6, 1, 0.8, 1.2, 0.7, 1.1, 0.5, 0.9, 1.3, 0.6];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48, ...style }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: [`${h * 10}px`, `${h * 44}px`, `${h * 10}px`] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
          style={{ width: 5, borderRadius: 3, background: `linear-gradient(180deg,${C.accent},${C.accent2})`, opacity: 0.8 }}
        />
      ))}
    </div>
  );
}

function SonarNav({ activeSection, onNavigate }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{ position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 50 }}>
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          background: `${C.mid}CC`, backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20, padding: "14px 10px",
          boxShadow: "0 16px 48px rgba(0,0,0,.4)",
        }}
      >
        {SONAR_ITEMS.map(({ id, label, Icon, color }) => {
          const isActive = activeSection === id;
          const isHovered = hoveredId === id;
          return (
            <div key={id} style={{ position: "relative" }}>
              <motion.button
                onClick={() => onNavigate(id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={label}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: isActive ? `${color}25` : isHovered ? `${color}15` : "transparent",
                  border: `1px solid ${isActive ? color + "60" : "transparent"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background .2s, border-color .2s",
                  boxShadow: isActive ? `0 0 12px ${color}40` : "none",
                }}
              >
                <Icon size={18} color={isActive ? color : isHovered ? color : C.muted} />
              </motion.button>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      position: "absolute", right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)",
                      background: `${C.mid}EE`, color: "#fff",
                      padding: "5px 12px", borderRadius: 8, fontSize: 11,
                      fontWeight: 600, whiteSpace: "nowrap",
                      pointerEvents: "none", border: "1px solid rgba(255,255,255,.1)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: 12, textAlign: "center",
          fontSize: 9, fontWeight: 700, letterSpacing: 3, color: SONAR_ITEMS.find(i => i.id === activeSection)?.color || C.accent,
          textTransform: "uppercase", fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {SONAR_ITEMS.find(i => i.id === activeSection)?.label || "Home"}
      </motion.div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="asn-card" style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{level}%</span>
      </div>
      <div className="asn-skill-track">
        <div className="asn-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="asn-tag">{category}</span></div>
    </div>
  );
}

export default function AudioFirstSonarNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = data.socials?.email || data.personal?.email || "";
  const resumeUrl = data.personal?.resumeUrl || "#contact";

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContactState("sending");
    setTimeout(() => setContactState("done"), 1500);
  };

  return (
    <div className="asn-root">
      <GlobalStyles />
      <SonarNav activeSection={activeSection} onNavigate={scrollTo} />

      <section id="hero" className="asn-sec" style={{ minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[280, 200, 140].map((size, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                border: `1px solid ${C.accent}15`, borderRadius: "50%", width: size, height: size,
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="asn-max" style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, justifyContent: "center" }}>
            <SonarPulsingCircle size={70} color={C.accent} duration={2.5} />
            <AudioBars />
            <SonarPulsingCircle size={50} color={C.accent2} duration={2} />
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={data.personal.avatar} alt={data.personal.name} style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.accent}`, margin: "0 auto", display: "block", boxShadow: `0 0 24px ${C.accent}40` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.8rem,10vw,7rem)", fontWeight: 800, lineHeight: 1, marginBottom: 16, letterSpacing: -3, textAlign: "center" }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ fontSize: "clamp(.85rem,2vw,1.1rem)", color: C.accent, fontWeight: 600, marginBottom: 24, letterSpacing: 3, textTransform: "uppercase", textAlign: "center" }}>
            {data.personal.title}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38 }} style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <AudioBars style={{ height: 40 }} />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: 16, lineHeight: 1.8, color: C.muted, maxWidth: 500, margin: "0 auto 44px", textAlign: "center" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 52 }}>
            <button className="asn-btn asn-btn-primary" onClick={() => scrollTo("projects")}><Music size={14} />View Work</button>
            <button className="asn-btn asn-btn-ghost" onClick={() => scrollTo("contact")}><Radio size={14} />Get In Touch</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: 460, margin: "0 auto",
              border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden",
              background: C.mid,
            }}>
            {[
              { val: `${data.stats.yearsExperience}+`, label: "Years" },
              { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
              { val: `${data.stats.happyClients}+`, label: "Clients" },
            ].map(({ val, label }, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 12px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800, color: C.accent }}>{val}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="about" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">About</div>
            <h2 className="asn-h2">The Signal Behind The Noise</h2>
          </FadeIn>
          <div className="asn-about-grid">
            <FadeIn>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                <div style={{ position: "relative" }}>
                  <SonarPulsingCircle size={180} color={C.accent} duration={3} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                    <img src={data.personal.avatar} alt={data.personal.name} style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.accent}` }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {data.socials.github   && <a href={data.socials.github}   className="asn-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                  {data.socials.linkedin && <a href={data.socials.linkedin} className="asn-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                  {data.socials.twitter  && <a href={data.socials.twitter}  className="asn-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                  {email                 && <a href={`mailto:${email}`}     className="asn-social"><Mail     size={18} /></a>}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div className="asn-card" style={{ padding: "18px 24px", marginBottom: 28, borderLeft: `3px solid ${C.accent}` }}>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: C.accent }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="asn-btn asn-btn-primary"><Mic size={14} /><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="skills" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">Skills</div>
            <h2 className="asn-h2">Frequency Range</h2>
          </FadeIn>
          <div className="asn-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="projects" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">Projects</div>
            <h2 className="asn-h2">Sound Portfolio</h2>
          </FadeIn>
          <div className="asn-proj-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="asn-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.bg}EE 100%)` }} />
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <AudioBars style={{ height: 28 }} />
                  </div>
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 14 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                    {proj.techStack.slice(0, 4).map((t, j) => <span key={j} className="asn-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="asn-btn asn-btn-primary" style={{ fontSize: 10, padding: "8px 14px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="asn-btn asn-btn-ghost" style={{ fontSize: 10, padding: "8px 14px" }}><Github size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="experience" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">Experience</div>
            <h2 className="asn-h2">Track Record</h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="asn-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="asn-timeline-item" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="asn-timeline-dot" />
                  <div className="asn-card" style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.accent, marginBottom: 6, textTransform: "uppercase" }}>{exp.period}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700 }}>{exp.role}</h3>
                      <span style={{ fontSize: 13, color: C.muted }}>@ {exp.company}</span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: C.muted }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="testimonials" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">Testimonials</div>
            <h2 className="asn-h2">Amplified Voices</h2>
          </FadeIn>
          <div className="asn-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="asn-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <AudioBars style={{ height: 24 }} />
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: C.muted, marginBottom: 18 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.border}` }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="asn-divider" />

      <section id="contact" className="asn-sec">
        <div className="asn-max">
          <FadeIn>
            <div className="asn-label">Contact</div>
            <h2 className="asn-h2">Tune In</h2>
          </FadeIn>
          <div className="asn-contact-grid">
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                <SonarPulsingCircle size={80} color={C.accent} duration={2} />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted }}>
                  Ready to collaborate on the next big thing? Drop a message — I typically respond within 24 hours.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.accent}15`, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={18} color={C.accent} /></div>
                  {email}</a>}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="asn-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="asn-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="asn-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "14px", borderRadius: 12, background: `${C.accent}12`, border: `1px solid ${C.accent}30`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Signal Received — I'll be in touch!</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="asn-btn asn-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
                      <Radio size={14} /><span>{contactState === "sending" ? "Transmitting…" : "Send Message"}</span>
                    </button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}