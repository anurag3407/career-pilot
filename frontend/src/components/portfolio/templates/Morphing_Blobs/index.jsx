import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  bg:     "#08080F",
  text:   "#F0EEFF",
  muted:  "rgba(240,238,255,.5)",
  border: "rgba(255,255,255,.08)",
  glass:  "rgba(255,255,255,.05)",
  glassH: "rgba(255,255,255,.09)",
  purple: "#9333EA",
  teal:   "#06B6D4",
  pink:   "#EC4899",
  blue:   "#3B82F6",
  accent: "#A855F7",
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

      .mb-root { background:${C.bg}; color:${C.text}; font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden; }

      /* Blob layer */
      .mb-blobs { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
      .mb-blob {
        position:absolute; border-radius:60% 40% 30% 70% / 60% 30% 70% 40%;
        filter:blur(80px); opacity:.18;
      }
      .mb-blob-1 { width:600px; height:600px; background:${C.purple}; top:-10%; left:-5%; animation:mb-morph1 14s ease-in-out infinite, mb-drift1 20s ease-in-out infinite; }
      .mb-blob-2 { width:500px; height:500px; background:${C.teal};   top:30%; right:-5%; animation:mb-morph2 18s ease-in-out infinite, mb-drift2 24s ease-in-out infinite; }
      .mb-blob-3 { width:550px; height:550px; background:${C.pink};   bottom:10%; left:20%; animation:mb-morph3 16s ease-in-out infinite, mb-drift3 22s ease-in-out infinite; }
      .mb-blob-4 { width:400px; height:400px; background:${C.blue};   top:50%; left:50%; animation:mb-morph4 20s ease-in-out infinite, mb-drift4 18s ease-in-out infinite; opacity:.12; }

      /* Glassmorphism base */
      .mb-glass {
        background:${C.glass}; border:1px solid ${C.border};
        backdrop-filter:blur(16px); border-radius:16px;
        transition:background .3s, border-color .3s, transform .3s;
      }
      .mb-glass:hover {
        background:${C.glassH}; border-color:rgba(168,85,247,.3);
        transform:translateY(-3px);
      }

      /* Nav */
      .mb-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:64px;
        background:rgba(8,8,15,.75); backdrop-filter:blur(20px);
        border-bottom:1px solid ${C.border};
      }
      .mb-nav-link {
        font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase;
        color:${C.muted}; cursor:pointer; background:none; border:none; padding:8px 0;
        transition:color .2s;
      }
      .mb-nav-link:hover { color:${C.accent}; }
      .mb-nav-desktop { display:none; gap:28px; }
      @media (min-width:768px) {
        .mb-nav-desktop { display:flex; }
        .mb-hamburger { display:none !important; }
      }
      .mb-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .mb-mobile-menu {
        position:fixed; top:64px; left:0; right:0; z-index:49;
        background:rgba(8,8,15,.97); backdrop-filter:blur(20px);
        padding:16px 24px; border-bottom:1px solid ${C.border};
        display:flex; flex-direction:column; gap:4px;
      }

      /* Sections */
      .mb-sec { padding:96px 48px; position:relative; z-index:1; }
      @media (max-width:768px) { .mb-sec { padding:72px 24px; } }
      .mb-max { max-width:1200px; margin:0 auto; }

      /* Section label */
      .mb-label { font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:${C.accent}; margin-bottom:16px; }

      /* Heading */
      .mb-h2 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:48px; }
      .mb-grad { background:linear-gradient(135deg,${C.purple},${C.teal}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

      /* Grids */
      .mb-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .mb-about-grid { grid-template-columns:1fr 1.6fr; } }

      .mb-proj-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .mb-proj-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .mb-proj-grid { grid-template-columns:repeat(3,1fr); } }

      .mb-skills-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:640px) { .mb-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .mb-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .mb-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .mb-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .mb-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .mb-contact-grid { grid-template-columns:1fr 1fr; } }

      .mb-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px auto 0; }

      /* Skill bar */
      .mb-skill-track { background:rgba(255,255,255,.08); border-radius:99px; height:3px; }
      .mb-skill-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.purple},${C.teal}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .mb-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:13px 26px; border-radius:99px;
        font-size:13px; font-weight:600; letter-spacing:1px;
        cursor:pointer; transition:all .25s; text-decoration:none; border:none;
        font-family:'Plus Jakarta Sans',sans-serif;
      }
      .mb-btn-primary { background:linear-gradient(135deg,${C.purple},${C.teal}); color:#fff; }
      .mb-btn-primary:hover { opacity:.9; transform:translateY(-2px); box-shadow:0 8px 28px rgba(147,51,234,.35); }
      .mb-btn-ghost { background:transparent; color:${C.text}; border:1px solid ${C.border}; }
      .mb-btn-ghost:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(168,85,247,.08); }

      /* Tag */
      .mb-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:600; background:rgba(168,85,247,.12); color:${C.accent}; border:1px solid rgba(168,85,247,.2); }

      /* Input */
      .mb-input {
        width:100%; padding:14px 18px; background:rgba(255,255,255,.05);
        border:1px solid ${C.border}; border-radius:12px;
        color:${C.text}; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; outline:none;
        transition:border-color .25s, background .25s; box-sizing:border-box;
        backdrop-filter:blur(8px);
      }
      .mb-input:focus { border-color:${C.accent}; background:rgba(168,85,247,.06); }
      .mb-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .mb-timeline { position:relative; padding-left:28px; }
      .mb-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.purple},${C.teal},transparent); }
      .mb-timeline-dot { position:absolute; left:-6px; top:20px; width:12px; height:12px; border-radius:50%; background:linear-gradient(135deg,${C.purple},${C.teal}); box-shadow:0 0 12px ${C.purple}60; }
      .mb-timeline-item { position:relative; margin-bottom:32px; }
      .mb-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .mb-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:12px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .25s;
        background:${C.glass}; backdrop-filter:blur(8px);
      }
      .mb-social:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(168,85,247,.1); }

      /* Avatar */
      .mb-avatar { width:260px; height:260px; border-radius:20px; overflow:hidden; margin:0 auto; padding:2px; background:linear-gradient(135deg,${C.purple},${C.teal}); }

      /* Project img */
      .mb-proj-img { width:100%; height:210px; object-fit:cover; display:block; }

      /* Divider */
      .mb-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.06) 20%,rgba(255,255,255,.06) 80%,transparent); }

      /* Keyframes — blob morphing */
      @keyframes mb-morph1 {
        0%,100% { border-radius:60% 40% 30% 70% / 60% 30% 70% 40%; }
        25%  { border-radius:30% 60% 70% 40% / 50% 60% 30% 60%; }
        50%  { border-radius:50% 60% 30% 40% / 40% 40% 60% 50%; }
        75%  { border-radius:40% 60% 50% 50% / 30% 60% 40% 60%; }
      }
      @keyframes mb-morph2 {
        0%,100% { border-radius:40% 60% 50% 50% / 60% 40% 60% 40%; }
        33%  { border-radius:70% 30% 40% 60% / 40% 70% 30% 60%; }
        66%  { border-radius:50% 50% 70% 30% / 60% 40% 70% 30%; }
      }
      @keyframes mb-morph3 {
        0%,100% { border-radius:50% 50% 60% 40% / 50% 60% 40% 50%; }
        40%  { border-radius:30% 70% 40% 60% / 60% 30% 70% 40%; }
        70%  { border-radius:60% 40% 50% 50% / 30% 60% 40% 70%; }
      }
      @keyframes mb-morph4 {
        0%,100% { border-radius:70% 30% 60% 40% / 40% 60% 40% 60%; }
        50%  { border-radius:40% 60% 30% 70% / 60% 40% 70% 30%; }
      }
      @keyframes mb-drift1 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(60px,40px); } }
      @keyframes mb-drift2 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-80px,60px); } }
      @keyframes mb-drift3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(50px,-40px); } }
      @keyframes mb-drift4 { 0%,100% { transform:translate(-50%,-50%); } 50% { transform:translate(-40%,-60%); } }
      @media (prefers-reduced-motion:reduce) {
        .mb-blob { animation:none !important; }
      }
    `}</style>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-glass" style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{level}%</span>
      </div>
      <div className="mb-skill-track">
        <div className="mb-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="mb-tag">{category}</span></div>
    </div>
  );
}

export default function MorphingBlobs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = data.socials?.email || data.personal?.email || "";
  const resumeUrl = data.personal?.resumeUrl || "#contact";
  const sections = ["About", "Skills", "Projects", "Experience", "Testimonials", "Contact"];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setContactState("sending");
    setTimeout(() => setContactState("done"), 1500);
  };

  return (
    <div className="mb-root">
      <GlobalStyles />

      {/* Morphing blob layer */}
      <div className="mb-blobs">
        <div className="mb-blob mb-blob-1" />
        <div className="mb-blob mb-blob-2" />
        <div className="mb-blob mb-blob-3" />
        <div className="mb-blob mb-blob-4" />
      </div>

      {/* ── Navbar ── */}
      <nav className="mb-nav">
        <button className="mb-nav-link" onClick={() => scrollTo("hero")} style={{ color: C.accent, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div className="mb-nav-desktop">
          {sections.map((s) => (
            <button key={s} className="mb-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button className="mb-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 22, height: 2, background: i === 1 ? C.accent : C.text, margin: "4px 0", transition: "all .2s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mb-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s) => (
              <button key={s} className="mb-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "10px 0" }}>
                <span style={{ color: C.accent, marginRight: 8 }}>◉</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative", zIndex: 1 }}>
        <div className="mb-max" style={{ padding: "0 48px", width: "100%", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 20 }}>
            <div className="mb-label">Organic Motion Portfolio</div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 800, lineHeight: 1, marginBottom: 16 }}>
            <span className="mb-grad">{data.personal.name}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.accent, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, maxWidth: 500, margin: "0 auto 40px" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
            <button className="mb-btn mb-btn-primary" onClick={() => scrollTo("projects")}>View Work</button>
            <button className="mb-btn mb-btn-ghost" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <div className="mb-stats">
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div className="mb-grad" style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800 }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", cursor: "pointer", zIndex: 2 }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={20} style={{ color: C.accent, opacity: 0.6 }} />
        </motion.div>
      </section>

      <hr className="mb-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">About</div>
            <h2 className="mb-h2">The Person Behind<br /><span className="mb-grad">The Blobs</span></h2>
          </FadeIn>
          <div className="mb-about-grid">
            <FadeIn>
              <div className="mb-avatar">
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="mb-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="mb-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="mb-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="mb-social"><Mail     size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div className="mb-glass" style={{ padding: "16px 20px", marginBottom: 28, borderLeft: `3px solid ${C.accent}` }}>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: C.accent }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="mb-btn mb-btn-primary"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="mb-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">Skills</div>
            <h2 className="mb-h2">Fluid <span className="mb-grad">Expertise</span></h2>
          </FadeIn>
          <div className="mb-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="mb-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">Projects</div>
            <h2 className="mb-h2">Organic <span className="mb-grad">Creations</span></h2>
          </FadeIn>
          <div className="mb-proj-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="mb-glass" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="mb-proj-img" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.bg}EE 100%)` }} />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="mb-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="mb-btn mb-btn-primary" style={{ fontSize: 10, padding: "8px 14px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="mb-btn mb-btn-ghost"   style={{ fontSize: 10, padding: "8px 14px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="mb-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">Experience</div>
            <h2 className="mb-h2">Flowing <span className="mb-grad">Journey</span></h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="mb-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="mb-timeline-item" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="mb-timeline-dot" />
                  <div className="mb-glass" style={{ padding: "22px 26px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.accent, marginBottom: 8, textTransform: "uppercase" }}>{exp.period}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 10 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                      <span style={{ fontSize: 13, color: C.muted }}>@ {exp.company}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="mb-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">Testimonials</div>
            <h2 className="mb-h2">Kind <span className="mb-grad">Waves</span></h2>
          </FadeIn>
          <div className="mb-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="mb-glass" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 28 }}>
                <div style={{ fontSize: 42, lineHeight: 1, color: C.accent, opacity: 0.15, fontWeight: 800, marginBottom: -8 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: C.muted, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid rgba(168,85,247,.3)` }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="mb-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="mb-sec">
        <div className="mb-max">
          <FadeIn>
            <div className="mb-label">Contact</div>
            <h2 className="mb-h2">Flow Into <span className="mb-grad">My World</span></h2>
          </FadeIn>
          <div className="mb-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: C.muted, marginBottom: 32 }}>
                Like blobs drifting together, let's connect and create something fluid and beautiful.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${C.purple}20,${C.teal}20)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={18} color={C.accent} /></div>
                  {email}</a>}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.glass, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.glass, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="mb-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="mb-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="mb-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-glass" style={{ padding: "16px", textAlign: "center", borderColor: "rgba(168,85,247,.3)" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: 2 }}>◉ Message Sent</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="mb-btn mb-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "Sending…" : "Send Message"}</span>
                    </button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 1, padding: "28px 48px", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: C.muted }}>© {new Date().getFullYear()} <span className="mb-grad">{data.personal.name}</span></span>
        <div style={{ display: "flex", gap: 10 }}>
          {data.socials.github   && <a href={data.socials.github}   className="mb-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="mb-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="mb-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
