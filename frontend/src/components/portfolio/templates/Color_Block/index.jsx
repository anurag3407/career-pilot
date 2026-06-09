import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown } from "lucide-react";
import data from "../../../../data/dummy_data.json";

/* ── Mondrian palette ──────────────────────────────────────────────────────── */
const M = {
  red:    "#E8231A",
  blue:   "#1B4EAF",
  yellow: "#F5CF0D",
  white:  "#F8F4EC",
  black:  "#111111",
  offW:   "#E8E4DC",
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

      .cb-root { background:${M.white}; color:${M.black}; font-family:'Inter',sans-serif; overflow-x:hidden; }
      .cb-display { font-family:'Bebas Neue',sans-serif; }
      .cb-border { border:3px solid ${M.black}; }
      .cb-border-thick { border:5px solid ${M.black}; }

      /* ── Nav ── */
      .cb-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:stretch; border-bottom:5px solid ${M.black};
        background:${M.white}; height:60px;
      }
      .cb-nav-brand {
        display:flex; align-items:center;
        padding:0 24px;
        border-right:5px solid ${M.black};
        background:${M.yellow};
        font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:3px;
        cursor:pointer; user-select:none;
      }
      .cb-nav-links {
        display:flex; align-items:stretch; flex:1;
      }
      .cb-nav-link {
        display:flex; align-items:center; padding:0 20px;
        border-right:3px solid ${M.black}; background:none; border-top:none; border-bottom:none; border-left:none;
        font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:background .15s;
      }
      .cb-nav-link:hover { background:${M.red}; color:${M.white}; }
      .cb-nav-spacer { flex:1; }
      .cb-hamburger { display:flex; align-items:center; padding:0 20px; cursor:pointer; background:none; border:none; border-left:3px solid ${M.black}; }
      @media (min-width:768px) {
        .cb-hamburger { display:none !important; }
      }
      @media (max-width:767px) {
        .cb-nav-links { display:none; }
      }

      /* Mobile menu */
      .cb-mobile-menu {
        position:fixed; top:60px; left:0; right:0; z-index:49;
        background:${M.white}; border-bottom:5px solid ${M.black};
      }
      .cb-mobile-link {
        display:block; padding:16px 24px; font-size:13px; font-weight:700;
        letter-spacing:2px; text-transform:uppercase; cursor:pointer;
        border-bottom:3px solid ${M.black}; background:none; border-left:none; border-right:none; border-top:none;
        width:100%; text-align:left;
      }
      .cb-mobile-link:hover { background:${M.blue}; color:${M.white}; }

      /* ── Mondrian grid layouts ── */
      .cb-hero-grid {
        display:grid;
        grid-template-columns:1fr;
        grid-template-rows:auto;
        border-bottom:5px solid ${M.black};
      }
      @media (min-width:900px) {
        .cb-hero-grid {
          grid-template-columns:3fr 2fr;
          grid-template-rows:1fr 1fr;
          min-height:calc(100vh - 60px);
        }
      }

      .cb-cell {
        border:3px solid ${M.black};
        padding:40px;
        position:relative;
        overflow:hidden;
      }
      @media (max-width:640px) { .cb-cell { padding:28px 20px; } }

      /* ── Projects grid ── */
      .cb-projects-grid {
        display:grid;
        grid-template-columns:1fr;
        gap:0;
      }
      @media (min-width:640px)  { .cb-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .cb-projects-grid { grid-template-columns:repeat(3,1fr); } }

      /* ── Skills grid ── */
      .cb-skills-grid {
        display:grid;
        grid-template-columns:1fr;
        gap:0;
      }
      @media (min-width:640px)  { .cb-skills-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .cb-skills-grid { grid-template-columns:repeat(3,1fr); } }

      /* ── About grid ── */
      .cb-about-grid {
        display:grid;
        grid-template-columns:1fr;
      }
      @media (min-width:768px) { .cb-about-grid { grid-template-columns:1fr 2fr; } }

      /* ── Experience grid ── */
      .cb-exp-grid {
        display:grid;
        grid-template-columns:1fr;
      }
      @media (min-width:768px) { .cb-exp-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .cb-exp-grid { grid-template-columns:repeat(3,1fr); } }

      /* ── Testimonials grid ── */
      .cb-testi-grid {
        display:grid;
        grid-template-columns:1fr;
      }
      @media (min-width:768px) { .cb-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .cb-testi-grid { grid-template-columns:repeat(3,1fr); } }

      /* ── Contact grid ── */
      .cb-contact-grid {
        display:grid;
        grid-template-columns:1fr;
      }
      @media (min-width:768px) { .cb-contact-grid { grid-template-columns:1fr 1fr; } }

      /* ── Stats ── */
      .cb-stats { display:grid; grid-template-columns:repeat(3,1fr); }

      /* ── Form input ── */
      .cb-input {
        width:100%; padding:14px 16px;
        background:${M.white}; border:3px solid ${M.black};
        font-family:'Inter',sans-serif; font-size:14px; color:${M.black};
        outline:none; transition:border-color .15s, background .15s;
        box-sizing:border-box;
      }
      .cb-input:focus { background:${M.yellow}; }
      .cb-input::placeholder { color:rgba(17,17,17,.4); }

      /* ── Button ── */
      .cb-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:14px 32px; border:3px solid ${M.black};
        font-family:'Inter',sans-serif; font-size:13px; font-weight:800;
        letter-spacing:2px; text-transform:uppercase; cursor:pointer;
        transition:all .15s; text-decoration:none;
        position:relative; overflow:hidden;
      }
      .cb-btn-red   { background:${M.red};    color:${M.white}; }
      .cb-btn-blue  { background:${M.blue};   color:${M.white}; }
      .cb-btn-yellow{ background:${M.yellow}; color:${M.black}; }
      .cb-btn-black { background:${M.black};  color:${M.white}; }
      .cb-btn:hover { transform:translate(-3px,-3px); box-shadow:6px 6px 0 ${M.black}; }

      /* ── Skill bar ── */
      .cb-skill-track { background:${M.offW}; height:6px; border:2px solid ${M.black}; }
      .cb-skill-fill { height:100%; transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* ── Section title ── */
      .cb-sec-label {
        font-family:'Bebas Neue',sans-serif; font-size:11px; letter-spacing:4px;
        text-transform:uppercase;
      }

      /* ── Tag ── */
      .cb-tag {
        display:inline-block; padding:3px 10px;
        border:2px solid ${M.black}; font-size:10px; font-weight:700;
        letter-spacing:1px; text-transform:uppercase;
      }

      /* ── Decorative Mondrian block ── */
      .cb-deco-block {
        position:absolute; border:3px solid ${M.black}; pointer-events:none;
      }

      /* ── Project image ── */
      .cb-proj-img { width:100%; height:200px; object-fit:cover; display:block; }

      /* ── Social link ── */
      .cb-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border:3px solid ${M.black};
        color:${M.black}; text-decoration:none;
        transition:all .15s;
      }
      .cb-social:hover { background:${M.blue}; color:${M.white}; transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${M.black}; }

      /* Keyframes */
      @keyframes cb-slide-in { from { transform:translateX(-100%); } to { transform:translateX(0); } }
      @keyframes cb-drop-in  { from { transform:translateY(-30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
      @media (prefers-reduced-motion:reduce) {
        .cb-btn { transition:none; } .cb-social { transition:none; }
      }
    `}</style>
  );
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ border: `3px solid ${M.black}`, borderRadius: 0, padding: "20px", background: M.white, borderTop: "none", borderLeft: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{name}</span>
        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", color }}>{level}</span>
      </div>
      <div className="cb-skill-track">
        <div className="cb-skill-fill" style={{ width: inView ? `${level}%` : "0%", background: color }} />
      </div>
      <div style={{ marginTop: 6 }}>
        <span className="cb-tag" style={{ background: color, borderColor: M.black, color: color === M.yellow ? M.black : M.white }}>{category}</span>
      </div>
    </div>
  );
}

/* Mondrian decorative grid accent */
function MondrianAccent({ colors }) {
  const blocks = [
    { w: "40%", h: "45%", top: "0%",  left: "0%",  bg: colors[0] },
    { w: "55%", h: "45%", top: "0%",  left: "42%", bg: colors[1] },
    { w: "40%", h: "50%", top: "48%", left: "0%",  bg: colors[2] },
    { w: "28%", h: "50%", top: "48%", left: "42%", bg: colors[3] },
    { w: "24%", h: "50%", top: "48%", left: "73%", bg: colors[4] || M.white },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {blocks.map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.h, top: b.top, left: b.left,
          background: b.bg, border: `3px solid ${M.black}`, boxSizing: "border-box",
        }} />
      ))}
    </div>
  );
}

export default function ColorBlock() {
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

  const skillColors = [M.red, M.blue, M.yellow, M.red, M.blue, M.yellow, M.red, M.blue, M.yellow, M.red];

  return (
    <div className="cb-root">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="cb-nav">
        <button className="cb-nav-brand" onClick={() => scrollTo("hero")}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div className="cb-nav-links">
          {sections.map((s, i) => (
            <button key={s} className="cb-nav-link"
              style={{ background: i === 0 ? M.red : i === 1 ? M.blue : "none", color: (i === 0 || i === 1) ? M.white : M.black }}
              onClick={() => scrollTo(s.toLowerCase())}>
              {s}
            </button>
          ))}
          <div className="cb-nav-spacer" />
        </div>
        <button className="cb-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 3, background: M.black, margin: "3px 0", transition: "all .2s",
            transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,4px)" : i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none") : "none",
            opacity: menuOpen && i === 1 ? 0 : 1,
          }} />)}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="cb-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s, i) => (
              <button key={s} className="cb-mobile-link"
                style={{ background: [M.red, M.blue, M.yellow, M.white, M.red, M.blue][i] || M.white,
                         color: [M.white, M.white, M.black, M.black, M.white, M.white][i] }}
                onClick={() => scrollTo(s.toLowerCase())}>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <div id="hero" className="cb-hero-grid" style={{ paddingTop: 60, borderTop: `5px solid ${M.black}` }}>
        {/* Main block — name */}
        <div className="cb-cell" style={{ background: M.white, gridRow: "1 / 2", gridColumn: "1 / 2", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="cb-sec-label" style={{ marginBottom: 12 }}>Portfolio — {new Date().getFullYear()}</div>
            <h1 className="cb-display" style={{ fontSize: "clamp(3rem,9vw,6rem)", lineHeight: 1, letterSpacing: 2, marginBottom: 16 }}>
              {data.personal.name}
            </h1>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="cb-btn cb-btn-red" onClick={() => scrollTo("projects")}><span>View Work</span></button>
              <a href={resumeUrl} className="cb-btn cb-btn-black"><span>Resume</span></a>
            </div>
          </motion.div>
        </div>

        {/* Right top — color + title */}
        <div className="cb-cell" style={{ background: M.red, gridRow: "1 / 2", gridColumn: "2 / 3", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 200 }}>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,.7)", textTransform: "uppercase", marginBottom: 12 }}>Role</div>
            <h2 className="cb-display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: M.white, lineHeight: 1.1, letterSpacing: 1 }}>
              {data.personal.title}
            </h2>
            <div style={{ marginTop: 16 }}>
              <span className="cb-tag" style={{ background: M.white, color: M.red, borderColor: M.white }}>{data.personal.location || "Remote"}</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom left — stats */}
        <div className="cb-cell cb-stats" style={{ background: M.yellow, gridRow: "2 / 3", gridColumn: "1 / 2", padding: 0 }}>
          {[
            { val: `${data.stats.yearsExperience}+`, label: "Years Exp" },
            { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
            { val: `${data.stats.happyClients}+`, label: "Clients" },
          ].map(({ val, label }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              style={{ padding: "32px 24px", borderRight: i < 2 ? `3px solid ${M.black}` : "none", textAlign: "center" }}>
              <div className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 6, opacity: 0.7 }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Bottom right — blue block */}
        <div className="cb-cell" style={{ background: M.blue, gridRow: "2 / 3", gridColumn: "2 / 3", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}
            style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,.85)" }}>
            {data.personal.bio.slice(0, 160)}{data.personal.bio.length > 160 ? "…" : ""}
          </motion.p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {data.socials.github   && <a href={data.socials.github}   className="cb-social" target="_blank" rel="noreferrer" style={{ background: "transparent", borderColor: M.white, color: M.white }}><Github   size={18} /></a>}
            {data.socials.linkedin && <a href={data.socials.linkedin} className="cb-social" target="_blank" rel="noreferrer" style={{ background: "transparent", borderColor: M.white, color: M.white }}><Linkedin size={18} /></a>}
            {data.socials.twitter  && <a href={data.socials.twitter}  className="cb-social" target="_blank" rel="noreferrer" style={{ background: "transparent", borderColor: M.white, color: M.white }}><Twitter  size={18} /></a>}
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div id="about" style={{ borderBottom: `5px solid ${M.black}` }}>
        <div className="cb-about-grid">
          {/* Left — yellow label block */}
          <FadeIn>
            <div style={{ background: M.yellow, padding: 40, borderRight: `5px solid ${M.black}`, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="cb-sec-label" style={{ marginBottom: 16, opacity: 0.7 }}>Section 02</div>
                <h2 className="cb-display" style={{ fontSize: "clamp(3rem,7vw,5rem)", lineHeight: 1, letterSpacing: 2 }}>ABOUT<br />ME</h2>
              </div>
              <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", maxWidth: 200, height: 200, objectFit: "cover", border: `5px solid ${M.black}`, marginTop: 24 }} />
            </div>
          </FadeIn>
          {/* Right — white content */}
          <FadeIn delay={0.15}>
            <div style={{ padding: 40, background: M.white }}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: M.black, marginBottom: 24 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ borderLeft: `5px solid ${M.red}`, paddingLeft: 20, marginBottom: 24 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, fontStyle: "italic" }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="cb-btn cb-btn-blue"><span>Download CV</span></a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div id="skills" style={{ borderBottom: `5px solid ${M.black}` }}>
        {/* Title bar */}
        <div style={{ background: M.red, borderBottom: `5px solid ${M.black}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-sec-label" style={{ color: "rgba(255,255,255,.7)" }}>Section 03</div>
          <h2 className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: M.white, letterSpacing: 2 }}>SKILLS</h2>
        </div>
        <div className="cb-skills-grid">
          {data.skills.map((skill, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
              <SkillBar {...skill} color={skillColors[i % skillColors.length]} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PROJECTS ── */}
      <div id="projects" style={{ borderBottom: `5px solid ${M.black}` }}>
        <div style={{ background: M.blue, borderBottom: `5px solid ${M.black}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-sec-label" style={{ color: "rgba(255,255,255,.7)" }}>Section 04</div>
          <h2 className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: M.white, letterSpacing: 2 }}>PROJECTS</h2>
        </div>
        <div className="cb-projects-grid">
          {data.projects.map((proj, i) => {
            const accentColors = [M.red, M.blue, M.yellow, M.red, M.blue, M.yellow];
            const accent = accentColors[i % accentColors.length];
            const textOnAccent = accent === M.yellow ? M.black : M.white;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                style={{ border: `3px solid ${M.black}`, borderTop: "none", borderLeft: "none", background: M.white }}>
                <div style={{ position: "relative", overflow: "hidden", borderBottom: `3px solid ${M.black}` }}>
                  <img src={proj.image} alt={proj.title} className="cb-proj-img" />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: accent }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(17,17,17,.65)", marginBottom: 14 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="cb-tag" style={{ background: j % 3 === 0 ? M.yellow : j % 3 === 1 ? M.red : M.blue, color: j % 3 === 0 ? M.black : M.white, borderColor: M.black }}>{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="cb-btn cb-btn-red"   style={{ fontSize: 10, padding: "8px 16px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="cb-btn cb-btn-black" style={{ fontSize: 10, padding: "8px 16px" }}><Github        size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      <div id="experience" style={{ borderBottom: `5px solid ${M.black}` }}>
        <div style={{ background: M.yellow, borderBottom: `5px solid ${M.black}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-sec-label" style={{ opacity: 0.6 }}>Section 05</div>
          <h2 className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: 2 }}>EXPERIENCE</h2>
        </div>
        <div className="cb-exp-grid">
          {data.experience.map((exp, i) => {
            const bg = [M.white, M.red, M.blue, M.white, M.yellow][i % 5];
            const textC = bg === M.white || bg === M.yellow ? M.black : M.white;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: bg, color: textC, padding: 36, border: `3px solid ${M.black}`, borderTop: "none", borderLeft: "none" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: 0.6, marginBottom: 12 }}>{exp.period}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{exp.role}</h3>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, opacity: 0.7 }}>{exp.company}</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8 }}>{exp.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div id="testimonials" style={{ borderBottom: `5px solid ${M.black}` }}>
        <div style={{ background: M.black, borderBottom: `5px solid ${M.black}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-sec-label" style={{ color: "rgba(255,255,255,.5)" }}>Section 06</div>
          <h2 className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: M.white, letterSpacing: 2 }}>TESTIMONIALS</h2>
        </div>
        <div className="cb-testi-grid">
          {data.testimonials.map((t, i) => {
            const bg = [M.white, M.yellow, M.red, M.blue, M.white][i % 5];
            const textC = bg === M.white || bg === M.yellow ? M.black : M.white;
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: bg, color: textC, padding: 36, border: `3px solid ${M.black}`, borderTop: "none", borderLeft: "none" }}>
                <div style={{ fontSize: 64, lineHeight: 1, fontFamily: "'Bebas Neue',sans-serif", opacity: 0.15, marginBottom: -12 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, objectFit: "cover", border: `3px solid ${textC === M.black ? M.black : M.white}` }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>{t.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div id="contact">
        <div style={{ background: M.red, borderBottom: `5px solid ${M.black}`, padding: "20px 40px", display: "flex", alignItems: "center", gap: 24 }}>
          <div className="cb-sec-label" style={{ color: "rgba(255,255,255,.6)" }}>Section 07</div>
          <h2 className="cb-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: M.white, letterSpacing: 2 }}>CONTACT</h2>
        </div>
        <div className="cb-contact-grid">
          {/* Left info */}
          <FadeIn>
            <div style={{ padding: 40, background: M.yellow, borderRight: `5px solid ${M.black}`, minHeight: 300 }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 32, fontWeight: 500 }}>
                Let's build something bold together. Send a message and I'll respond within 24 hours.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: M.black, fontWeight: 700, fontSize: 14 }}>
                    <div style={{ width: 40, height: 40, background: M.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={16} color={M.white} />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && (
                  <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: M.black, fontWeight: 700, fontSize: 14 }}>
                    <div style={{ width: 40, height: 40, background: M.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Github size={16} color={M.white} />
                    </div>
                    GitHub
                  </a>
                )}
                {data.socials.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: M.black, fontWeight: 700, fontSize: 14 }}>
                    <div style={{ width: 40, height: 40, background: M.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Linkedin size={16} color={M.white} />
                    </div>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Right form */}
          <FadeIn delay={0.15}>
            <div style={{ padding: 40, background: M.white }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <input className="cb-input" placeholder="YOUR NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ borderBottom: "none" }} />
                <input className="cb-input" type="email" placeholder="YOUR EMAIL" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ borderBottom: "none" }} />
                <textarea className="cb-input" placeholder="YOUR MESSAGE" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ background: M.yellow, border: `3px solid ${M.black}`, padding: "20px", textAlign: "center", marginTop: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>✓ Message Sent!</span>
                    </motion.div>
                  ) : (
                    <motion.button key="btn" type="submit" className="cb-btn cb-btn-red" disabled={contactState === "sending"}
                      style={{ border: `3px solid ${M.black}`, justifyContent: "center", borderTop: "none", width: "100%", padding: "18px" }}>
                      <span>{contactState === "sending" ? "SENDING..." : "SEND MESSAGE"}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `5px solid ${M.black}`, display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ padding: "20px 32px", background: M.black, color: M.white, flex: 1, display: "flex", alignItems: "center" }}>
          <span className="cb-display" style={{ fontSize: 20, letterSpacing: 3 }}>
            © {new Date().getFullYear()} {data.personal.name.toUpperCase()}
          </span>
        </div>
        <div style={{ padding: "20px 32px", background: M.red, color: M.white, display: "flex", alignItems: "center", borderLeft: `5px solid ${M.black}` }}>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>Color Block Portfolio</span>
        </div>
      </footer>
    </div>
  );
}
