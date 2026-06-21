import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown } from "lucide-react";

const C = {
  bg:     "#060810",
  mid:    "#0D1220",
  deep:   "#101828",
  accent: "#7EB8DA",
  blue:   "#5B9BD5",
  ghost:  "rgba(200,220,240,.45)",
  muted:  "rgba(200,220,240,.35)",
  text:   "#C8DCF0",
  border: "rgba(126,184,218,.12)",
};

function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');

      .sm-root { background:${C.bg}; color:${C.text}; font-family:'Raleway',sans-serif; overflow-x:hidden; }
      .sm-serif { font-family:'Cinzel',serif; }

      /* Smoke particles */
      .sm-smoke-layer {
        position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
      }
      .sm-wisp {
        position:absolute; border-radius:50%;
        background:radial-gradient(circle,rgba(140,180,220,.08) 0%,rgba(100,140,200,.04) 40%,transparent 70%);
        filter:blur(40px);
      }
      .sm-wisp-1 { width:600px; height:400px; animation:sm-drift-1 18s ease-in-out infinite; top:5%; left:-10%; }
      .sm-wisp-2 { width:500px; height:350px; animation:sm-drift-2 22s ease-in-out infinite 3s; top:30%; right:-5%; }
      .sm-wisp-3 { width:700px; height:300px; animation:sm-drift-3 26s ease-in-out infinite 6s; bottom:20%; left:10%; }
      .sm-wisp-4 { width:400px; height:400px; animation:sm-drift-4 20s ease-in-out infinite 9s; top:50%; left:40%; }
      .sm-wisp-5 { width:350px; height:280px; animation:sm-drift-5 24s ease-in-out infinite 2s; bottom:5%; right:20%; }

      /* Nav */
      .sm-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:64px;
        background:rgba(6,8,16,.8); backdrop-filter:blur(20px);
        border-bottom:1px solid ${C.border};
      }
      .sm-nav-link {
        font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase;
        color:${C.muted}; cursor:pointer; background:none; border:none; padding:8px 0;
        transition:color .3s;
      }
      .sm-nav-link:hover { color:${C.accent}; }
      .sm-nav-desktop { display:none; gap:28px; }
      @media (min-width:768px) {
        .sm-nav-desktop { display:flex; }
        .sm-hamburger { display:none !important; }
      }
      .sm-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .sm-mobile-menu {
        position:fixed; top:64px; left:0; right:0; z-index:49;
        background:rgba(6,8,16,.97); padding:16px 24px; border-bottom:1px solid ${C.border};
        display:flex; flex-direction:column; gap:4px;
      }

      /* Sections */
      .sm-sec { padding:96px 48px; position:relative; z-index:1; }
      @media (max-width:768px) { .sm-sec { padding:72px 24px; } }
      .sm-max { max-width:1200px; margin:0 auto; }

      /* Section label */
      .sm-label {
        display:inline-block; font-size:10px; font-weight:600; letter-spacing:4px;
        text-transform:uppercase; color:${C.accent}; margin-bottom:16px;
        opacity:.7;
      }

      /* Heading */
      .sm-h2 { font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:600; line-height:1.2; margin-bottom:48px; }

      /* Cards */
      .sm-card {
        background:rgba(13,18,32,.7); border:1px solid ${C.border};
        border-radius:12px; overflow:hidden; backdrop-filter:blur(8px);
        transition:border-color .4s, transform .4s, box-shadow .4s;
      }
      .sm-card:hover {
        border-color:rgba(126,184,218,.3);
        transform:translateY(-3px);
        box-shadow:0 16px 40px rgba(91,155,213,.1), 0 0 0 1px rgba(126,184,218,.1);
      }

      /* Fog reveal: content emerges from blur */
      .sm-emerge {
        filter:blur(6px); opacity:0; transition:filter .8s ease, opacity .8s ease;
      }
      .sm-emerge.visible { filter:blur(0); opacity:1; }

      /* Grid layouts */
      .sm-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .sm-about-grid { grid-template-columns:1fr 1.6fr; } }

      .sm-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .sm-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .sm-projects-grid { grid-template-columns:repeat(3,1fr); } }

      .sm-skills-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:640px) { .sm-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .sm-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .sm-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .sm-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .sm-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .sm-contact-grid { grid-template-columns:1fr 1fr; } }

      .sm-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px 0 0; }

      /* Skill bar */
      .sm-skill-track { background:rgba(255,255,255,.06); border-radius:99px; height:3px; }
      .sm-skill-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.blue},${C.accent}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .sm-btn {
        display:inline-flex; align-items:center; gap:10px;
        padding:13px 26px; border-radius:8px;
        font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:all .3s; text-decoration:none; border:none;
        font-family:'Raleway',sans-serif;
      }
      .sm-btn-ghost { background:rgba(126,184,218,.1); color:${C.accent}; border:1px solid ${C.border}; }
      .sm-btn-ghost:hover { background:rgba(126,184,218,.2); border-color:rgba(126,184,218,.4); box-shadow:0 0 20px rgba(126,184,218,.1); }
      .sm-btn-solid { background:rgba(91,155,213,.15); color:${C.text}; border:1px solid rgba(91,155,213,.25); }
      .sm-btn-solid:hover { background:rgba(91,155,213,.3); }

      /* Tag */
      .sm-tag { display:inline-block; padding:3px 10px; border-radius:4px; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; background:rgba(126,184,218,.08); color:${C.accent}; border:1px solid rgba(126,184,218,.15); }

      /* Input */
      .sm-input {
        width:100%; padding:14px 18px; background:rgba(13,18,32,.8);
        border:1px solid ${C.border}; border-radius:8px;
        color:${C.text}; font-family:'Raleway',sans-serif; font-size:14px; outline:none;
        transition:border-color .3s, box-shadow .3s; box-sizing:border-box;
        backdrop-filter:blur(4px);
      }
      .sm-input:focus { border-color:${C.accent}; box-shadow:0 0 0 2px rgba(126,184,218,.1); }
      .sm-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .sm-timeline { position:relative; padding-left:28px; }
      .sm-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.accent}60,transparent); }
      .sm-timeline-dot { position:absolute; left:-5px; top:20px; width:10px; height:10px; border-radius:50%; background:${C.accent}; box-shadow:0 0 12px ${C.accent}60; }
      .sm-timeline-item { position:relative; margin-bottom:32px; }
      .sm-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .sm-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:10px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .3s;
      }
      .sm-social:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(126,184,218,.08); box-shadow:0 0 16px rgba(126,184,218,.1); }

      /* Divider */
      .sm-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,${C.border} 20%,${C.border} 80%,transparent); }

      /* Project img */
      .sm-proj-img { width:100%; height:210px; object-fit:cover; display:block; filter:saturate(.7) brightness(.8); transition:filter .4s; }
      .sm-card:hover .sm-proj-img { filter:saturate(.9) brightness(1); }

      /* Avatar */
      .sm-avatar { width:260px; height:260px; border-radius:16px; overflow:hidden; margin:0 auto; filter:saturate(.6); transition:filter .4s; }
      .sm-avatar:hover { filter:saturate(1); }

      /* Keyframes — smoke drifts */
      @keyframes sm-drift-1 {
        0%,100% { transform:translate(0,0) scale(1); opacity:.8; }
        25%  { transform:translate(120px,-40px) scale(1.1); opacity:1; }
        50%  { transform:translate(80px,60px) scale(.95); opacity:.7; }
        75%  { transform:translate(200px,20px) scale(1.05); opacity:.9; }
      }
      @keyframes sm-drift-2 {
        0%,100% { transform:translate(0,0) scale(1); opacity:.7; }
        33%  { transform:translate(-100px,80px) scale(1.1); opacity:.9; }
        66%  { transform:translate(-60px,-50px) scale(.9); opacity:.8; }
      }
      @keyframes sm-drift-3 {
        0%,100% { transform:translate(0,0) scale(1); opacity:.6; }
        40%  { transform:translate(150px,-30px) scale(1.2); opacity:.8; }
        70%  { transform:translate(60px,40px) scale(.95); opacity:.7; }
      }
      @keyframes sm-drift-4 {
        0%,100% { transform:translate(0,0) rotate(0deg); opacity:.5; }
        50%  { transform:translate(-80px,-60px) rotate(20deg); opacity:.7; }
      }
      @keyframes sm-drift-5 {
        0%,100% { transform:translate(0,0) scale(1); opacity:.6; }
        30%  { transform:translate(-120px,40px) scale(1.15); opacity:.8; }
        60%  { transform:translate(-40px,-30px) scale(.9); opacity:.7; }
      }
      @keyframes sm-glow-pulse { 0%,100% { box-shadow:0 0 8px ${C.accent}40; } 50% { box-shadow:0 0 24px ${C.accent}80,0 0 48px ${C.accent}20; } }
      @media (prefers-reduced-motion:reduce) { .sm-wisp,.sm-wisp-1,.sm-wisp-2,.sm-wisp-3,.sm-wisp-4,.sm-wisp-5 { animation:none !important; } }
    `}</style>
  );
}

function FogReveal({ children, delay = 0, className = "", style = {} }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="sm-card" style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>{level}%</span>
      </div>
      <div className="sm-skill-track">
        <div className="sm-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="sm-tag">{category}</span></div>
    </div>
  );
}

export default function SmokeMist() {
  const { portfolioData: data } = usePortfolio();

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
    <div className="sm-root">
      <GlobalStyles />

      {/* Animated smoke wisps */}
      <div className="sm-smoke-layer">
        <div className="sm-wisp sm-wisp-1" />
        <div className="sm-wisp sm-wisp-2" />
        <div className="sm-wisp sm-wisp-3" />
        <div className="sm-wisp sm-wisp-4" />
        <div className="sm-wisp sm-wisp-5" />
      </div>

      {/* ── Navbar ── */}
      <nav className="sm-nav">
        <button className="sm-nav-link sm-serif" onClick={() => scrollTo("hero")} style={{ color: C.accent, fontSize: 13, letterSpacing: 4 }}>
          {data.personal.name.split(" ")[0].toUpperCase()}
        </button>
        <div className="sm-nav-desktop">
          {sections.map((s) => (
            <button key={s} className="sm-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button className="sm-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 22, height: 1.5, background: i === 1 ? C.accent : C.ghost, margin: "5px 0", transition: "all .3s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="sm-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s) => (
              <button key={s} className="sm-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "10px 0" }}>
                <span style={{ color: C.accent, marginRight: 8 }}>~</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative", zIndex: 1 }}>
        <div className="sm-max" style={{ padding: "0 48px", width: "100%" }}>
          <motion.div initial={{ opacity: 0, filter: "blur(16px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.2 }}>
            <div className="sm-label">Emerging from the mist</div>
          </motion.div>
          <motion.h1 className="sm-serif" initial={{ opacity: 0, y: 50, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.2 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 600, lineHeight: 1, marginBottom: 16, letterSpacing: 2,
              textShadow: `0 0 40px ${C.accent}40` }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.accent, fontWeight: 400, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontSize: 15, lineHeight: 1.85, color: C.ghost, maxWidth: 520, marginBottom: 40 }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
            <button className="sm-btn sm-btn-ghost" onClick={() => scrollTo("projects")}>
              <span>Through the Mist</span>
            </button>
            <button className="sm-btn sm-btn-solid" onClick={() => scrollTo("contact")}>
              <span>Connect</span>
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <div className="sm-stats">
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div className="sm-serif" style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 600, color: C.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", cursor: "pointer", zIndex: 2 }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={20} style={{ color: C.accent, opacity: 0.5 }} />
        </motion.div>
      </section>

      <hr className="sm-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="sm-sec">
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">About</div>
            <h2 className="sm-h2">Through The <span style={{ color: C.accent }}>Haze</span></h2>
          </FogReveal>
          <div className="sm-about-grid">
            <FogReveal>
              <div className="sm-avatar" style={{ animation: "sm-glow-pulse 4s ease-in-out infinite" }}>
                <img src={data.personal.avatar} alt={data.personal.name || "Profile Avatar"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="sm-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="sm-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="sm-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="sm-social"><Mail     size={18} /></a>}
              </div>
            </FogReveal>
            <FogReveal delay={0.2}>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: C.ghost, marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "16px 20px", borderRadius: 8, background: "rgba(126,184,218,.06)", borderLeft: `2px solid ${C.accent}`, marginBottom: 28 }}>
                  <p style={{ fontSize: 15, fontStyle: "italic", color: C.accent }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="sm-btn sm-btn-ghost"><span>Download CV</span></a>
            </FogReveal>
          </div>
        </div>
      </section>

      <hr className="sm-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="sm-sec" style={{ background: "rgba(13,18,32,.4)" }}>
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">Skills</div>
            <h2 className="sm-h2">Emerging <span style={{ color: C.accent }}>Abilities</span></h2>
          </FogReveal>
          <div className="sm-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16, filter: "blur(4px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.7 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sm-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="sm-sec">
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">Projects</div>
            <h2 className="sm-h2">Visions from the <span style={{ color: C.accent }}>Fog</span></h2>
          </FogReveal>
          <div className="sm-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="sm-card" initial={{ opacity: 0, y: 28, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title || "Project Screenshot"} className="sm-proj-img" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.bg}DD 100%)` }} />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 className="sm-serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: C.text }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="sm-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="sm-btn sm-btn-ghost"  style={{ fontSize: 10, padding: "8px 14px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="sm-btn sm-btn-solid" style={{ fontSize: 10, padding: "8px 14px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sm-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="sm-sec" style={{ background: "rgba(13,18,32,.4)" }}>
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">Experience</div>
            <h2 className="sm-h2">Paths Through the <span style={{ color: C.accent }}>Mist</span></h2>
          </FogReveal>
          <div style={{ maxWidth: 720 }}>
            <div className="sm-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="sm-timeline-item" initial={{ opacity: 0, x: -20, filter: "blur(5px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.8 }}>
                  <div className="sm-timeline-dot" />
                  <div className="sm-card" style={{ padding: "22px 26px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.accent, marginBottom: 8, textTransform: "uppercase" }}>{exp.period}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 10 }}>
                      <h3 className="sm-serif" style={{ fontSize: 17, fontWeight: 600 }}>{exp.role}</h3>
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

      <hr className="sm-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="sm-sec">
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">Testimonials</div>
            <h2 className="sm-h2">Voices in the <span style={{ color: C.accent }}>Fog</span></h2>
          </FogReveal>
          <div className="sm-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="sm-card" initial={{ opacity: 0, y: 20, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.9 }}
                style={{ padding: 28 }}>
                <div style={{ fontSize: 42, lineHeight: 1, color: C.accent, opacity: 0.15, fontFamily: "'Cinzel',serif", marginBottom: -8 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: C.ghost, marginBottom: 20, fontStyle: "italic" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={t.avatar} alt={t.name || "Profile Avatar"} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.border}`, filter: "saturate(.6)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sm-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="sm-sec" style={{ background: "rgba(13,18,32,.4)" }}>
        <div className="sm-max">
          <FogReveal>
            <div className="sm-label">Contact</div>
            <h2 className="sm-h2">Find Me Through the <span style={{ color: C.accent }}>Mist</span></h2>
          </FogReveal>
          <div className="sm-contact-grid">
            <FogReveal>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: C.ghost, marginBottom: 32 }}>
                Like a voice calling through fog, reach out — I'll find my way to you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(126,184,218,.1)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color={C.accent} />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(126,184,218,.08)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} color={C.accent} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `rgba(126,184,218,.08)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} color={C.accent} /></div>LinkedIn</a>}
              </div>
            </FogReveal>
            <FogReveal delay={0.2}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="sm-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="sm-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="sm-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
                      style={{ padding: "16px", borderRadius: 8, background: "rgba(126,184,218,.08)", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: 2 }}>✓ Message Received</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="sm-btn sm-btn-ghost" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "Sending..." : "Send Message"}</span>
                    </button>
                  )}
                </AnimatePresence>
              </form>
            </FogReveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 1, padding: "28px 48px", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span className="sm-serif" style={{ fontSize: 12, color: C.muted, letterSpacing: 3 }}>
          © {new Date().getFullYear()} {data.personal.name.toUpperCase()}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {data.socials.github   && <a href={data.socials.github}   className="sm-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="sm-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="sm-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
