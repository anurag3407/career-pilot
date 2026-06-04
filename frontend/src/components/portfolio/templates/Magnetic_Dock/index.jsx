import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, useInView } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  Home, User, Zap, Grid, Briefcase, Star, MessageSquare
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  bg:     "#0D0D14",
  mid:    "#141420",
  card:   "#1A1A28",
  text:   "#E8E8F8",
  muted:  "rgba(232,232,248,.5)",
  accent: "#6366F1",
  border: "rgba(255,255,255,.07)",
  dockBg: "rgba(20,20,35,.85)",
};

/* Dock item colors */
const DOCK_ICONS = [
  { id: "hero",         label: "Home",         Icon: Home,          color: "#6366F1" },
  { id: "about",        label: "About",        Icon: User,          color: "#8B5CF6" },
  { id: "skills",       label: "Skills",       Icon: Zap,           color: "#EC4899" },
  { id: "projects",     label: "Projects",     Icon: Grid,          color: "#06B6D4" },
  { id: "experience",   label: "Experience",   Icon: Briefcase,     color: "#10B981" },
  { id: "testimonials", label: "Testimonials", Icon: Star,          color: "#F59E0B" },
  { id: "contact",      label: "Contact",      Icon: MessageSquare, color: "#F97316" },
];

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

      .md-root { background:${C.bg}; color:${C.text}; font-family:'Inter',sans-serif; overflow-x:hidden; padding-bottom:120px; }

      /* Sections */
      .md-sec { padding:80px 48px; position:relative; }
      @media (max-width:768px) { .md-sec { padding:64px 24px; } }
      .md-max { max-width:1100px; margin:0 auto; }

      /* Section label */
      .md-label { font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:${C.accent}; margin-bottom:12px; }

      /* Section heading */
      .md-h2 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:40px; }

      /* Cards */
      .md-card {
        background:${C.card}; border:1px solid ${C.border};
        border-radius:12px; overflow:hidden;
        transition:border-color .25s, transform .25s, box-shadow .25s;
      }
      .md-card:hover {
        border-color:rgba(99,102,241,.35);
        transform:translateY(-3px);
        box-shadow:0 16px 40px rgba(99,102,241,.1);
      }

      /* Grids */
      .md-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .md-about-grid { grid-template-columns:1fr 1.6fr; } }

      .md-proj-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:640px)  { .md-proj-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .md-proj-grid { grid-template-columns:repeat(3,1fr); } }

      .md-skills-grid { display:grid; grid-template-columns:1fr; gap:10px; }
      @media (min-width:640px) { .md-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .md-testi-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:768px)  { .md-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .md-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .md-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .md-contact-grid { grid-template-columns:1fr 1fr; } }

      .md-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px auto 0; }

      /* Skill bar */
      .md-skill-track { background:rgba(255,255,255,.06); border-radius:99px; height:3px; }
      .md-skill-fill { height:100%; border-radius:99px; background:${C.accent}; transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .md-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:12px 24px; border-radius:99px;
        font-size:12px; font-weight:600; letter-spacing:1px;
        cursor:pointer; transition:all .2s; text-decoration:none; border:none; font-family:'Inter',sans-serif;
      }
      .md-btn-primary { background:${C.accent}; color:#fff; }
      .md-btn-primary:hover { background:#4F46E5; transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,.4); }
      .md-btn-ghost { background:transparent; color:${C.text}; border:1px solid ${C.border}; }
      .md-btn-ghost:hover { border-color:${C.accent}; color:${C.accent}; }

      /* Tag */
      .md-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:600; background:rgba(99,102,241,.1); color:${C.accent}; border:1px solid rgba(99,102,241,.2); }

      /* Input */
      .md-input {
        width:100%; padding:13px 18px; background:${C.card};
        border:1px solid ${C.border}; border-radius:10px;
        color:${C.text}; font-family:'Inter',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .md-input:focus { border-color:${C.accent}; }
      .md-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .md-timeline { position:relative; padding-left:28px; }
      .md-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.accent},transparent); }
      .md-timeline-dot { position:absolute; left:-6px; top:20px; width:12px; height:12px; border-radius:50%; background:${C.accent}; }
      .md-timeline-item { position:relative; margin-bottom:28px; }
      .md-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .md-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:10px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .md-social:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(99,102,241,.08); }

      /* Avatar */
      .md-avatar { width:240px; height:240px; border-radius:16px; overflow:hidden; margin:0 auto; padding:2px; background:${C.accent}; }

      /* Project img */
      .md-proj-img { width:100%; height:200px; object-fit:cover; display:block; }

      /* Divider */
      .md-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.06) 20%,rgba(255,255,255,.06) 80%,transparent); }

      @media (prefers-reduced-motion:reduce) { * { transition-duration:.01ms !important; animation:none !important; } }
    `}</style>
  );
}

/* ── Magnetic Dock Item ── */
function DockItem({ icon: { id, label, Icon, color }, mouseX, onClick, isActive }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return Math.abs(val - (bounds.left + bounds.width / 2));
  });

  const scaleVal = useTransform(distance, [0, 80, 160], [1.9, 1.4, 1]);
  const yVal     = useTransform(distance, [0, 80, 160], [-28, -14, 0]);

  const scale = useSpring(scaleVal, { stiffness: 400, damping: 25 });
  const y     = useSpring(yVal,     { stiffness: 400, damping: 25 });

  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute", bottom: "calc(100% + 8px)",
              background: "rgba(10,10,20,.95)", color: "#fff",
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              fontWeight: 600, letterSpacing: 1, whiteSpace: "nowrap",
              pointerEvents: "none", border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ scale, y }}
        onClick={() => onClick(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        sx={{}}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: isActive ? color : `${color}20`,
          border: `1px solid ${color}${isActive ? "80" : "40"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "background .2s",
          boxShadow: isActive ? `0 0 16px ${color}60` : "none",
        }}>
          <Icon size={20} color={isActive ? "#fff" : color} />
        </div>
      </motion.button>
    </div>
  );
}

/* ── The Dock ── */
function MagneticDockBar({ activeSection, onNavigate }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 50,
      }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          background: C.dockBg,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 20,
          padding: "12px 16px",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          boxShadow: "0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.05)",
        }}
      >
        {DOCK_ICONS.map((item) => (
          <DockItem
            key={item.id}
            icon={item}
            mouseX={mouseX}
            onClick={onNavigate}
            isActive={activeSection === item.id}
          />
        ))}
      </motion.div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="md-card" style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{level}%</span>
      </div>
      <div className="md-skill-track">
        <div className="md-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 6 }}><span className="md-tag">{category}</span></div>
    </div>
  );
}

export default function MagneticDock() {
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
    <div className="md-root">
      <GlobalStyles />

      {/* Magnetic Dock */}
      <MagneticDockBar activeSection={activeSection} onNavigate={scrollTo} />

      {/* ── HERO ── */}
      <section id="hero" className="md-sec" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="md-max">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ marginBottom: 24 }}>
            <img src={data.personal.avatar} alt={data.personal.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.accent}`, margin: "0 auto 16px", display: "block" }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 800, lineHeight: 1, marginBottom: 12, letterSpacing: -2 }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.accent, fontWeight: 500, marginBottom: 20, letterSpacing: 2, textTransform: "uppercase" }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 480, margin: "0 auto 40px" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
            <button className="md-btn md-btn-primary" onClick={() => scrollTo("projects")}>View Work</button>
            <button className="md-btn md-btn-ghost" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div className="md-stats">
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800, color: C.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 32, fontSize: 11, color: "rgba(232,232,248,.35)", letterSpacing: 2, textTransform: "uppercase" }}>
            ↑ navigate with the dock below ↑
          </motion.div>
        </div>
      </section>

      <hr className="md-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">About</div>
            <h2 className="md-h2">Who I Am</h2>
          </FadeIn>
          <div className="md-about-grid">
            <FadeIn>
              <div className="md-avatar">
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14, display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="md-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="md-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="md-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="md-social"><Mail     size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div className="md-card" style={{ padding: "16px 20px", marginBottom: 28, borderLeft: `3px solid ${C.accent}` }}>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: C.accent }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="md-btn md-btn-primary"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="md-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">Skills</div>
            <h2 className="md-h2">What I Know</h2>
          </FadeIn>
          <div className="md-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="md-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">Projects</div>
            <h2 className="md-h2">My Work</h2>
          </FadeIn>
          <div className="md-proj-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="md-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="md-proj-img" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.bg}EE 100%)` }} />
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 14 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                    {proj.techStack.slice(0, 4).map((t, j) => <span key={j} className="md-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="md-btn md-btn-primary" style={{ fontSize: 10, padding: "7px 14px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="md-btn md-btn-ghost"   style={{ fontSize: 10, padding: "7px 14px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="md-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">Experience</div>
            <h2 className="md-h2">Career Path</h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="md-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="md-timeline-item" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="md-timeline-dot" />
                  <div className="md-card" style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent, marginBottom: 6, textTransform: "uppercase" }}>{exp.period}</div>
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

      <hr className="md-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">Testimonials</div>
            <h2 className="md-h2">What People Say</h2>
          </FadeIn>
          <div className="md-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="md-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: 24 }}>
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

      <hr className="md-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="md-sec">
        <div className="md-max">
          <FadeIn>
            <div className="md-label">Contact</div>
            <h2 className="md-h2">Get In Touch</h2>
          </FadeIn>
          <div className="md-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, marginBottom: 28 }}>
                Open to new opportunities and collaborations. Drop me a message below.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(99,102,241,.1)", border: `1px solid rgba(99,102,241,.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={18} color={C.accent} /></div>
                  {email}</a>}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="md-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="md-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="md-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "14px", borderRadius: 10, background: "rgba(99,102,241,.08)", border: `1px solid rgba(99,102,241,.2)`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>✓ Message Sent!</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="md-btn md-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "Sending…" : "Send Message"}</span>
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
