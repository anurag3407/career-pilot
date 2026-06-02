import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown } from "lucide-react";
import data from "../../../../data/dummy_data.json";

/* ROYGBIV — one color per section */
const RAINBOW = [
  { id: "hero",         color: "#FF2D2D", bg: "#0F0000", label: "Red",    section: "01" },
  { id: "about",        color: "#FF8C00", bg: "#100800", label: "Orange", section: "02" },
  { id: "skills",       color: "#FFD700", bg: "#0F0F00", label: "Yellow", section: "03" },
  { id: "projects",     color: "#00C97A", bg: "#001008", label: "Green",  section: "04" },
  { id: "experience",   color: "#2196F3", bg: "#000A14", label: "Blue",   section: "05" },
  { id: "testimonials", color: "#4B3FEE", bg: "#03001A", label: "Indigo", section: "06" },
  { id: "contact",      color: "#CC44FF", bg: "#0C0014", label: "Violet", section: "07" },
];

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

      .rg-root { color:#f8f8ff; font-family:'Outfit',sans-serif; overflow-x:hidden; background:#0A0A0A; }

      /* Nav */
      .rg-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; height:60px;
        background:rgba(10,10,10,.92); backdrop-filter:blur(16px);
      }
      .rg-nav-rainbow {
        position:absolute; bottom:0; left:0; right:0; height:3px;
        background:linear-gradient(90deg,#FF2D2D,#FF8C00,#FFD700,#00C97A,#2196F3,#4B3FEE,#CC44FF);
      }
      .rg-nav-inner { display:flex; align-items:center; justify-content:space-between; padding:0 48px; width:100%; }
      .rg-nav-links { display:none; gap:0; align-items:stretch; height:60px; }
      @media (min-width:768px) {
        .rg-nav-links { display:flex; }
        .rg-hamburger { display:none !important; }
      }
      .rg-nav-link {
        display:flex; align-items:center; padding:0 16px;
        font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
        color:rgba(248,248,255,.5); cursor:pointer; background:none; border:none;
        transition:color .2s; position:relative;
      }
      .rg-nav-link::after {
        content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
        transform:scaleX(0); transition:transform .2s; transform-origin:center;
      }
      .rg-nav-link:hover { color:#fff; }
      .rg-nav-link:hover::after { transform:scaleX(1); }
      .rg-hamburger { background:none; border:none; cursor:pointer; padding:4px; margin-right:16px; }
      .rg-mobile-menu {
        position:fixed; top:60px; left:0; right:0; z-index:49;
        background:rgba(10,10,10,.97); padding:12px 24px;
        border-bottom:3px solid transparent;
        border-image:linear-gradient(90deg,#FF2D2D,#FF8C00,#FFD700,#00C97A,#2196F3,#4B3FEE,#CC44FF) 1;
      }

      /* Sections */
      .rg-sec { padding:96px 48px; position:relative; }
      @media (max-width:768px) { .rg-sec { padding:72px 24px; } }
      .rg-max { max-width:1200px; margin:0 auto; }

      /* Cards */
      .rg-card {
        background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
        border-radius:12px; overflow:hidden; transition:transform .3s, box-shadow .3s, border-color .3s;
      }

      /* Grid layouts */
      .rg-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .rg-about-grid { grid-template-columns:1fr 1.5fr; } }

      .rg-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .rg-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .rg-projects-grid { grid-template-columns:repeat(3,1fr); } }

      .rg-skills-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:640px) { .rg-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .rg-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .rg-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .rg-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .rg-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .rg-contact-grid { grid-template-columns:1fr 1fr; } }

      .rg-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px auto 0; }

      /* Input */
      .rg-input {
        width:100%; padding:14px 18px; background:rgba(255,255,255,.05);
        border:1px solid rgba(255,255,255,.1); border-radius:10px;
        color:#f8f8ff; font-family:'Outfit',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .rg-input::placeholder { color:rgba(248,248,255,.35); }

      /* Project image */
      .rg-proj-img { width:100%; height:200px; object-fit:cover; display:block; }

      /* Timeline */
      .rg-timeline-item { position:relative; padding-left:28px; margin-bottom:28px; }
      .rg-timeline-item::before { content:''; position:absolute; left:0; top:0; bottom:-28px; width:1px; }
      .rg-timeline-item:last-child::before { display:none; }
      .rg-timeline-item::after { content:''; position:absolute; left:-5px; top:18px; width:10px; height:10px; border-radius:50%; box-shadow:0 0 10px currentColor; }

      /* Social */
      .rg-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:10px; border:1px solid rgba(255,255,255,.12);
        color:rgba(248,248,255,.55); text-decoration:none; transition:all .2s;
      }

      /* Skill bar */
      .rg-skill-track { background:rgba(255,255,255,.08); border-radius:99px; height:4px; }
      .rg-skill-fill { height:100%; border-radius:99px; transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Keyframes */
      @keyframes rg-rotate { to { transform:rotate(360deg); } }
      @keyframes rg-pulse { 0%,100% { opacity:.6; } 50% { opacity:1; } }
      @keyframes rg-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
      @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition-duration:.01ms !important; } }
    `}</style>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="rg-card" style={{ padding: "16px 20px", borderColor: `${color}25` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{level}%</span>
      </div>
      <div className="rg-skill-track">
        <div className="rg-skill-fill" style={{ width: inView ? `${level}%` : "0%", background: color, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color, background: `${color}15`, border: `1px solid ${color}30`, padding: "2px 10px", borderRadius: 4 }}>{category}</span>
      </div>
    </div>
  );
}

/* Animated spinning rainbow ring */
function RainbowRing({ size = 180, thickness = 4 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `conic-gradient(#FF2D2D,#FF8C00,#FFD700,#00C97A,#2196F3,#4B3FEE,#CC44FF,#FF2D2D)`,
        animation: "rg-rotate 8s linear infinite",
        padding: thickness,
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0F0000" }} />
      </div>
    </div>
  );
}

export default function RainbowGradient() {
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

  const getRainbow = (id) => RAINBOW.find(r => r.id === id) || RAINBOW[0];

  return (
    <div className="rg-root">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="rg-nav">
        <div className="rg-nav-rainbow" />
        <div className="rg-nav-inner">
          <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}
            onClick={() => scrollTo("hero")}>
            <span style={{ background: "linear-gradient(90deg,#FF2D2D,#FF8C00,#FFD700,#00C97A,#2196F3,#4B3FEE,#CC44FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {data.personal.name.split(" ")[0]}
            </span>
          </button>
          <div className="rg-nav-links">
            {sections.map((s, i) => {
              const r = getRainbow(s.toLowerCase());
              return (
                <button key={s} className="rg-nav-link" onClick={() => scrollTo(s.toLowerCase())}
                  style={{ "--c": r?.color || "#fff" }}>
                  <style>{`.rg-nav-link:nth-child(${i+1}):hover::after { background:${r?.color || "#fff"}; }`}</style>
                  {s}
                </button>
              );
            })}
          </div>
          <button className="rg-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 22, height: 2, margin: "4px 0", transition: "all .2s",
                background: `linear-gradient(90deg,${RAINBOW[i*2]?.color},${RAINBOW[i*2+1]?.color || RAINBOW[6].color})`,
                transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
                opacity: menuOpen && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="rg-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sections.map((s, i) => {
              const r = getRainbow(s.toLowerCase());
              return (
                <button key={s} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "10px 0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: r?.color || "#fff", fontFamily: "'Outfit',sans-serif" }}
                  onClick={() => scrollTo(s.toLowerCase())}>
                  <span style={{ opacity: 0.5, marginRight: 8 }}>{r?.section}</span>{s}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO (Red) ── */}
      <section id="hero" style={{ minHeight: "100vh", background: RAINBOW[0].bg, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60, position: "relative", overflow: "hidden" }}>
        {/* Radial bg glow */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 60%, rgba(255,45,45,.12) 0%, transparent 65%)` }} />
        <div className="rg-max" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
            <RainbowRing size={120} thickness={5} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 900, lineHeight: 1, marginBottom: 16,
              background: "linear-gradient(135deg,#FF2D2D,#FF8C00,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.25rem)", color: RAINBOW[0].color, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(248,248,255,.65)", maxWidth: 500, margin: "0 auto 40px" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
            <button onClick={() => scrollTo("projects")} style={{ padding: "14px 28px", borderRadius: 99, background: `linear-gradient(135deg,${RAINBOW[0].color},${RAINBOW[1].color})`, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all .2s" }}>
              View Work
            </button>
            <button onClick={() => scrollTo("contact")} style={{ padding: "14px 28px", borderRadius: 99, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.2)", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
              Say Hello
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="rg-stats">
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 8px", borderRight: i < 2 ? "1px solid rgba(255,255,255,.08)" : "none" }}>
                  <div style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800, color: RAINBOW[i].color }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(248,248,255,.45)", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", cursor: "pointer" }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={20} style={{ color: RAINBOW[0].color, opacity: 0.7 }} />
        </motion.div>
      </section>

      {/* ── ABOUT (Orange) ── */}
      <section id="about" className="rg-sec" style={{ background: RAINBOW[1].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 50%, rgba(255,140,0,.08) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[1].color }}>02 / About</span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48, background: `linear-gradient(135deg,${RAINBOW[1].color},${RAINBOW[2].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Who I Am
            </h2>
          </FadeIn>
          <div className="rg-about-grid">
            <FadeIn>
              <div style={{ width: 240, height: 240, margin: "0 auto", borderRadius: 16, overflow: "hidden", padding: 3, background: `linear-gradient(135deg,${RAINBOW[1].color},${RAINBOW[2].color})` }}>
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14, display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="rg-social" target="_blank" rel="noreferrer" style={{ borderColor: `${RAINBOW[1].color}30`, color: RAINBOW[1].color }}><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="rg-social" target="_blank" rel="noreferrer" style={{ borderColor: `${RAINBOW[1].color}30`, color: RAINBOW[1].color }}><Linkedin size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="rg-social" style={{ borderColor: `${RAINBOW[1].color}30`, color: RAINBOW[1].color }}><Mail     size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(248,248,255,.75)", marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "16px 20px", borderRadius: 10, background: `${RAINBOW[1].color}12`, borderLeft: `3px solid ${RAINBOW[1].color}`, marginBottom: 28 }}>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: RAINBOW[1].color }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 99, background: `linear-gradient(135deg,${RAINBOW[1].color},${RAINBOW[2].color})`, color: "#000", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
                Download CV
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SKILLS (Yellow) ── */}
      <section id="skills" className="rg-sec" style={{ background: RAINBOW[2].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 50%, rgba(255,215,0,.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[2].color, marginBottom: 16 }}>03 / Skills</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48,
              background: `linear-gradient(135deg,${RAINBOW[2].color},${RAINBOW[3].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              What I Know
            </h2>
          </FadeIn>
          <div className="rg-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <SkillBar {...skill} color={RAINBOW[i % RAINBOW.length].color} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS (Green) ── */}
      <section id="projects" className="rg-sec" style={{ background: RAINBOW[3].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 60% 40%, rgba(0,201,122,.06) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[3].color, marginBottom: 16 }}>04 / Projects</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48,
              background: `linear-gradient(135deg,${RAINBOW[3].color},${RAINBOW[4].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              My Work
            </h2>
          </FadeIn>
          <div className="rg-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="rg-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ borderColor: `${RAINBOW[3].color}25` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${RAINBOW[i % RAINBOW.length].color}60`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${RAINBOW[i%RAINBOW.length].color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${RAINBOW[3].color}25`; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="rg-proj-img" />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${RAINBOW[i%RAINBOW.length].color},${RAINBOW[(i+1)%RAINBOW.length].color})` }} />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: RAINBOW[i % RAINBOW.length].color }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(248,248,255,.6)", marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                    {proj.techStack.map((t, j) => (
                      <span key={j} style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: `${RAINBOW[j%RAINBOW.length].color}14`, color: RAINBOW[j%RAINBOW.length].color, border: `1px solid ${RAINBOW[j%RAINBOW.length].color}30` }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: RAINBOW[3].color, color: "#000", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}><ExternalLink size={11} /> Live</a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid rgba(255,255,255,.15)`, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}><Github size={11} /> Code</a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE (Blue) ── */}
      <section id="experience" className="rg-sec" style={{ background: RAINBOW[4].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 60%, rgba(33,150,243,.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[4].color, marginBottom: 16 }}>05 / Experience</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48,
              background: `linear-gradient(135deg,${RAINBOW[4].color},${RAINBOW[5].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              The Journey
            </h2>
          </FadeIn>
          <div style={{ maxWidth: 720, borderLeft: `1px solid ${RAINBOW[4].color}30`, paddingLeft: 28 }}>
            {data.experience.map((exp, i) => (
              <motion.div key={i} className="rg-timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ color: RAINBOW[4].color, borderLeftColor: `${RAINBOW[4].color}30` }}>
                <div style={{ position: "absolute", left: -5, top: 20, width: 10, height: 10, borderRadius: "50%", background: RAINBOW[4].color, boxShadow: `0 0 10px ${RAINBOW[4].color}` }} />
                <div className="rg-card" style={{ padding: "22px 26px", borderColor: `${RAINBOW[4].color}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: RAINBOW[4].color, marginBottom: 8, textTransform: "uppercase" }}>{exp.period}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                    <span style={{ fontSize: 13, color: "rgba(248,248,255,.55)" }}>@ {exp.company}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(248,248,255,.6)" }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Indigo) ── */}
      <section id="testimonials" className="rg-sec" style={{ background: RAINBOW[5].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 30%, rgba(75,63,238,.08) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[5].color, marginBottom: 16 }}>06 / Testimonials</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48,
              background: `linear-gradient(135deg,${RAINBOW[5].color},${RAINBOW[6].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Kind Words
            </h2>
          </FadeIn>
          <div className="rg-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="rg-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 28, borderColor: `${RAINBOW[(5+i)%RAINBOW.length].color}25` }}>
                <div style={{ fontSize: 48, lineHeight: 1, color: RAINBOW[5].color, opacity: 0.2, fontWeight: 800, marginBottom: -8 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(248,248,255,.7)", marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${RAINBOW[5].color}` }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: RAINBOW[5].color }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT (Violet) ── */}
      <section id="contact" className="rg-sec" style={{ background: RAINBOW[6].bg }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, rgba(204,68,255,.07) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="rg-max">
          <FadeIn>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: RAINBOW[6].color, marginBottom: 16 }}>07 / Contact</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 48,
              background: `linear-gradient(135deg,${RAINBOW[6].color},${RAINBOW[0].color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Let's Connect
            </h2>
          </FadeIn>
          <div className="rg-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(248,248,255,.65)", marginBottom: 32 }}>
                Ready to create something that spans the whole spectrum? Let's talk.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${RAINBOW[6].color},${RAINBOW[0].color})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="rg-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                  style={{ borderColor: "rgba(255,255,255,.08)" }}
                  onFocus={e => e.target.style.borderColor = RAINBOW[6].color}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
                <input className="rg-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                  style={{ borderColor: "rgba(255,255,255,.08)" }}
                  onFocus={e => e.target.style.borderColor = RAINBOW[6].color}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
                <textarea className="rg-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                  style={{ resize: "vertical", borderColor: "rgba(255,255,255,.08)" }}
                  onFocus={e => e.target.style.borderColor = RAINBOW[6].color}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "16px", borderRadius: 10, background: `${RAINBOW[6].color}14`, border: `1px solid ${RAINBOW[6].color}30`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: RAINBOW[6].color, letterSpacing: 2 }}>✓ MESSAGE SENT</span>
                    </motion.div>
                  ) : (
                    <button type="submit" disabled={contactState === "sending"}
                      style={{ padding: "14px", borderRadius: 10, background: `linear-gradient(135deg,${RAINBOW[6].color},${RAINBOW[0].color})`, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer" }}>
                      {contactState === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "28px 48px", background: "#0A0A0A", borderTop: "3px solid transparent", borderImage: "linear-gradient(90deg,#FF2D2D,#FF8C00,#FFD700,#00C97A,#2196F3,#4B3FEE,#CC44FF) 1", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "rgba(248,248,255,.45)", fontFamily: "'Outfit',sans-serif" }}>© {new Date().getFullYear()} {data.personal.name}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {data.socials.github   && <a href={data.socials.github}   className="rg-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="rg-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="rg-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
