import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown, Zap, Code, Terminal, Cpu } from "lucide-react";

/* ── GlobalStyles ─────────────────────────────────────────────────────────── */
function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

      .cg-root { background:#080010; color:#e0e0ff; font-family:'Space Grotesk',sans-serif; overflow-x:hidden; }
      .cg-mono { font-family:'Space Mono',monospace; }

      /* Glitch text */
      .cg-glitch { position:relative; display:inline-block; }
      .cg-glitch::before,.cg-glitch::after {
        content:attr(data-text); position:absolute; top:0; left:0;
        width:100%; height:100%; pointer-events:none;
      }
      .cg-glitch::before { color:#ff0040; animation:cg-glitch-r 3s infinite linear; clip-path:polygon(0 30%,100% 30%,100% 50%,0 50%); }
      .cg-glitch::after  { color:#00ffff; animation:cg-glitch-b 3s infinite linear; clip-path:polygon(0 55%,100% 55%,100% 75%,0 75%); }

      /* RGB image overlay */
      .cg-rgb-img { position:relative; display:inline-block; }
      .cg-rgb-img::before,.cg-rgb-img::after {
        content:''; position:absolute; inset:0; pointer-events:none;
        mix-blend-mode:screen; opacity:0; animation:cg-rgb-pulse 4s infinite;
      }
      .cg-rgb-img::before { background:rgba(255,0,64,.25); transform:translateX(-4px); }
      .cg-rgb-img::after  { background:rgba(0,255,255,.25); transform:translateX(4px);  animation-delay:2s; }

      /* Scan lines */
      .cg-scan::after {
        content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
        background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
      }

      /* Cards */
      .cg-card {
        background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
        border-radius:8px; transition:border-color .25s,box-shadow .25s,transform .25s;
        position:relative; overflow:hidden;
      }
      .cg-card::before {
        content:''; position:absolute; inset:0;
        background:linear-gradient(135deg,rgba(255,0,64,.04),rgba(0,255,255,.04));
        opacity:0; transition:opacity .3s;
      }
      .cg-card:hover::before { opacity:1; }
      .cg-card:hover {
        border-color:rgba(0,255,255,.4);
        box-shadow:0 0 24px rgba(0,255,255,.12),inset 0 0 12px rgba(0,255,255,.03);
        transform:translateY(-3px);
      }

      /* Buttons */
      .cg-btn {
        position:relative; display:inline-flex; align-items:center; gap:8px;
        padding:12px 28px; border:1px solid; border-radius:4px;
        font-family:'Space Mono',monospace; font-size:13px; font-weight:700;
        letter-spacing:2px; text-transform:uppercase; cursor:pointer;
        transition:all .2s; overflow:hidden; text-decoration:none;
      }
      .cg-btn-primary { background:transparent; border-color:#00ffff; color:#00ffff; }
      .cg-btn-primary::before {
        content:''; position:absolute; inset:0; background:#00ffff;
        transform:scaleX(0); transform-origin:left; transition:transform .25s ease; z-index:0;
      }
      .cg-btn-primary:hover::before { transform:scaleX(1); }
      .cg-btn-primary:hover { color:#080010; box-shadow:0 0 20px rgba(0,255,255,.4); }
      .cg-btn-primary span,.cg-btn-primary svg { position:relative; z-index:1; }
      .cg-btn-secondary { background:transparent; border-color:#ff0040; color:#ff0040; }
      .cg-btn-secondary:hover { background:#ff0040; color:#080010; box-shadow:0 0 20px rgba(255,0,64,.4); }

      /* Section title */
      .cg-sec-title {
        position:relative; display:inline-flex; align-items:center; gap:16px; margin-bottom:48px;
      }
      .cg-sec-title::after {
        content:''; flex:1; height:1px;
        background:linear-gradient(90deg,#00ffff,transparent); min-width:80px;
      }

      /* Skill bar */
      .cg-skill-bar-wrap { background:rgba(255,255,255,.06); border-radius:2px; height:4px; overflow:hidden; }
      .cg-skill-bar {
        height:100%; border-radius:2px;
        background:linear-gradient(90deg,#ff0040,#ff00ff,#00ffff);
        transition:width 1.2s cubic-bezier(.4,0,.2,1); position:relative;
      }
      .cg-skill-bar::after {
        content:''; position:absolute; right:0; top:-3px;
        width:10px; height:10px; border-radius:50%;
        background:#00ffff; box-shadow:0 0 8px #00ffff;
      }

      /* Stats */
      .cg-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:0 auto; }
      .cg-stat { text-align:center; padding:24px 16px; border-right:1px solid rgba(255,255,255,.08); }
      .cg-stat:last-child { border-right:none; }

      /* Nav */
      .cg-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        padding:16px 48px; display:flex; align-items:center; justify-content:space-between;
        background:rgba(8,0,16,.85); backdrop-filter:blur(12px);
        border-bottom:1px solid rgba(255,255,255,.06); animation:cg-flicker 8s infinite;
      }
      .cg-nav-link {
        font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px;
        text-transform:uppercase; color:rgba(224,224,255,.5); cursor:pointer;
        transition:color .2s; background:none; border:none; padding:0;
      }
      .cg-nav-link:hover { color:#00ffff; }
      .cg-nav-links-desktop { display:none; }
      @media (min-width:768px) {
        .cg-nav-links-desktop { display:flex; gap:32px; }
        .cg-hamburger { display:none !important; }
        .cg-nav { padding:16px 48px; }
      }

      /* About grid */
      .cg-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .cg-about-grid { grid-template-columns:1fr 1.4fr; } }

      /* Projects grid */
      .cg-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .cg-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .cg-projects-grid { grid-template-columns:repeat(3,1fr); } }

      /* Skills grid */
      .cg-skills-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:640px) { .cg-skills-grid { grid-template-columns:repeat(2,1fr); } }

      /* Testimonials */
      .cg-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .cg-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1200px) { .cg-testi-grid { grid-template-columns:repeat(3,1fr); } }

      /* Contact */
      .cg-contact-row { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .cg-contact-row { grid-template-columns:1fr 1fr; } }

      /* Input */
      .cg-input {
        width:100%; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.1);
        border-radius:4px; padding:14px 16px; color:#e0e0ff;
        font-family:'Space Grotesk',sans-serif; font-size:15px; outline:none;
        transition:border-color .2s,box-shadow .2s; box-sizing:border-box;
      }
      .cg-input:focus { border-color:#00ffff; box-shadow:0 0 0 2px rgba(0,255,255,.1); }
      .cg-input::placeholder { color:rgba(224,224,255,.3); }

      /* Project image */
      .cg-proj-img { width:100%; height:200px; object-fit:cover; display:block; }
      @media (max-width:640px) { .cg-proj-img { height:180px; } }

      /* Avatar */
      .cg-avatar-wrap { width:240px; height:240px; margin:0 auto; position:relative; border-radius:4px; overflow:hidden; }
      @media (min-width:768px) { .cg-avatar-wrap { width:280px; height:280px; } }

      /* Timeline */
      .cg-timeline { position:relative; padding-left:32px; }
      .cg-timeline::before {
        content:''; position:absolute; left:0; top:0; bottom:0; width:1px;
        background:linear-gradient(180deg,#ff0040,#ff00ff,#00ffff,transparent);
      }
      .cg-timeline-dot {
        position:absolute; left:-5px; top:24px;
        width:10px; height:10px; border-radius:50%;
        background:#00ffff; box-shadow:0 0 8px #00ffff;
      }
      .cg-timeline-item { position:relative; margin-bottom:40px; }
      .cg-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .cg-social {
        display:flex; align-items:center; justify-content:center;
        width:44px; height:44px; border:1px solid rgba(255,255,255,.1);
        border-radius:4px; color:rgba(224,224,255,.6);
        transition:all .2s; cursor:pointer; text-decoration:none;
      }
      .cg-social:hover { border-color:#00ffff; color:#00ffff; box-shadow:0 0 12px rgba(0,255,255,.2); }

      /* Bracket corners */
      .cg-bracket { position:relative; padding:16px; }
      .cg-bracket::before { content:''; position:absolute; top:0; left:0; width:20px; height:20px; border-top:2px solid #00ffff; border-left:2px solid #00ffff; }
      .cg-bracket::after  { content:''; position:absolute; bottom:0; right:0; width:20px; height:20px; border-bottom:2px solid #ff0040; border-right:2px solid #ff0040; }

      /* Tags */
      .cg-tag {
        display:inline-block; padding:3px 10px;
        border:1px solid rgba(0,255,255,.2); border-radius:2px;
        font-family:'Space Mono',monospace; font-size:10px;
        color:rgba(0,255,255,.8); background:rgba(0,255,255,.05);
        letter-spacing:1px; text-transform:uppercase;
      }
      .cg-cat {
        display:inline-block; padding:2px 8px;
        border:1px solid rgba(255,0,64,.3); border-radius:2px;
        font-family:'Space Mono',monospace; font-size:9px;
        color:rgba(255,0,64,.8); background:rgba(255,0,64,.06);
        letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;
      }

      /* Misc */
      .cg-hr { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.1) 20%,rgba(255,255,255,.1) 80%,transparent); margin:0; }
      .cg-gradient-text { background:linear-gradient(135deg,#ff0040,#ff00ff,#00ffff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      .cg-sec { padding:80px 24px; }
      @media (min-width:768px)  { .cg-sec { padding:100px 48px; } }
      @media (min-width:1280px) { .cg-sec { padding:120px 80px; } }
      .cg-max { max-width:1200px; margin:0 auto; }

      /* Mobile menu */
      .cg-mobile-menu {
        display:flex; flex-direction:column; gap:8px; padding:16px 24px;
        background:rgba(8,0,16,.97); border-bottom:1px solid rgba(255,255,255,.06);
      }

      /* Keyframes */
      @keyframes cg-glitch-r {
        0%,90%,100% { transform:translateX(0); opacity:0; }
        91% { transform:translateX(-3px); opacity:.7; clip-path:polygon(0 20%,100% 20%,100% 35%,0 35%); }
        93% { transform:translateX(3px);  opacity:.7; clip-path:polygon(0 60%,100% 60%,100% 70%,0 70%); }
        95% { transform:translateX(-2px); opacity:.7; clip-path:polygon(0 45%,100% 45%,100% 55%,0 55%); }
        97% { transform:translateX(0);   opacity:0; }
      }
      @keyframes cg-glitch-b {
        0%,85%,100% { transform:translateX(0); opacity:0; }
        86% { transform:translateX(3px);  opacity:.7; clip-path:polygon(0 10%,100% 10%,100% 25%,0 25%); }
        88% { transform:translateX(-3px); opacity:.7; clip-path:polygon(0 65%,100% 65%,100% 80%,0 80%); }
        90% { transform:translateX(0);   opacity:0; }
      }
      @keyframes cg-rgb-pulse {
        0%,80%,100% { opacity:0; }
        82% { opacity:1; } 85% { opacity:0; } 87% { opacity:.8; } 90% { opacity:0; }
      }
      @keyframes cg-flicker {
        0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:.7; } 94% { opacity:1; } 96% { opacity:.85; } 97% { opacity:1; }
      }
      @keyframes cg-cursor-blink { 0%,50% { opacity:1; } 51%,100% { opacity:0; } }
      @keyframes cg-border-glow {
        0%,100% { box-shadow:0 0 12px rgba(0,255,255,.2); }
        50% { box-shadow:0 0 24px rgba(0,255,255,.4),0 0 48px rgba(0,255,255,.1); }
      }
      @keyframes cg-float {
        0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); }
      }
      @media (prefers-reduced-motion:reduce) {
        .cg-glitch::before,.cg-glitch::after { animation:none !important; opacity:0 !important; }
        .cg-rgb-img::before,.cg-rgb-img::after { animation:none !important; }
      }
    `}</style>
  );
}

function GlitchText({ text, className = "", style = {} }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <span className={`cg-glitch ${className}`} data-text={text} style={style}>
      {text}
    </span>
  );
}

function SkillBar({ name, level, category }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="cg-card" style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span className="cg-mono" style={{ fontSize: 11, color: "#00ffff", letterSpacing: 1 }}>{level}%</span>
      </div>
      <div className="cg-skill-bar-wrap">
        <div className="cg-skill-bar" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 6 }}><span className="cg-cat">{category}</span></div>
    </div>
  );
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ChromaticGlitch() {
  const { portfolioData: data } = usePortfolio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -80]);

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
    <div className="cg-root cg-scan" style={{ position: "relative" }}>
      <GlobalStyles />

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          { w: 600, h: 600, color: "rgba(255,0,64,.06)",    top: "10%",  left: "-10%", dur: 8 },
          { w: 500, h: 500, color: "rgba(0,255,255,.06)",   bottom: "20%", right: "-5%", dur: 10 },
          { w: 400, h: 400, color: "rgba(255,0,255,.05)",   top: "50%",  left: "40%",  dur: 12 },
        ].map((o, i) => (
          <div key={i} style={{
            position: "absolute", width: o.w, height: o.h, borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            top: o.top, left: o.left, bottom: o.bottom, right: o.right,
            animation: `cg-float ${o.dur}s ease-in-out infinite ${i % 2 === 1 ? "reverse" : ""}`,
          }} />
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav className="cg-nav">
        <button className="cg-nav-link" onClick={() => scrollTo("hero")} style={{ fontSize: 15, fontWeight: 700 }}>
          <span className="cg-gradient-text">GLITCH</span>
        </button>
        <div className="cg-nav-links-desktop">
          {sections.map((s) => (
            <button key={s} className="cg-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button
          className="cg-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "#e0e0ff", cursor: "pointer", padding: 4 }}
          aria-label="Menu"
        >
          <div style={{ width: 22, height: 2, background: "#00ffff", marginBottom: 5, transition: "all .2s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "#ff0040", opacity: menuOpen ? 0 : 1, transition: "all .2s" }} />
          <div style={{ width: 22, height: 2, background: "#00ffff", transition: "all .2s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="cg-mobile-menu"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 49 }}>
            {sections.map((s) => (
              <button key={s} className="cg-nav-link" onClick={() => scrollTo(s.toLowerCase())}
                style={{ textAlign: "left", padding: "10px 0", fontSize: 12, color: "#e0e0ff" }}>
                <span style={{ color: "#00ffff", marginRight: 8 }}>//</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="cg-sec cg-scan" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
        <motion.div className="cg-max" style={{ y: heroParallax, width: "100%" }}>
          <div style={{ maxWidth: 800 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 16 }}>
              <span className="cg-mono" style={{ fontSize: 12, letterSpacing: 4, color: "#00ffff", textTransform: "uppercase" }}>
                <span style={{ color: "#ff0040" }}>&gt;</span> Portfolio_v2.0.exe
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: "clamp(2.5rem,8vw,5.5rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: 8 }}>
              <GlitchText text={data.personal.name} />
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ marginBottom: 24 }}>
              <span className="cg-mono cg-gradient-text" style={{ fontSize: "clamp(1rem,3vw,1.5rem)", fontWeight: 400 }}>
                {data.personal.title}
                <span style={{ animation: "cg-cursor-blink 1s infinite", marginLeft: 2, color: "#00ffff" }}>█</span>
              </span>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(224,224,255,.65)", maxWidth: 560, marginBottom: 40 }}>
              {data.personal.bio}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
              <button className="cg-btn cg-btn-primary" onClick={() => scrollTo("projects")}>
                <Zap size={14} /><span>View Work</span>
              </button>
              <button className="cg-btn cg-btn-secondary" onClick={() => scrollTo("contact")}>
                <span>Contact</span>
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <div className="cg-card cg-stats">
                {[
                  { val: `${data.stats.yearsExperience}+`, label: "Years" },
                  { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                  { val: `${data.stats.happyClients}+`, label: "Clients" },
                ].map(({ val, label }) => (
                  <div key={label} className="cg-stat">
                    <div className="cg-gradient-text cg-mono" style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", fontWeight: 700 }}>{val}</div>
                    <div style={{ fontSize: 11, color: "rgba(224,224,255,.45)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", cursor: "pointer" }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={20} style={{ color: "#00ffff", opacity: 0.6 }} />
        </motion.div>
      </section>

      <hr className="cg-hr" />

      {/* ── ABOUT ── */}
      <section id="about" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>02</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="About" /></h2>
            </div>
          </FadeIn>
          <div className="cg-about-grid">
            <FadeIn>
              <div className="cg-avatar-wrap cg-rgb-img" style={{ animation: "cg-border-glow 3s ease-in-out infinite" }}>
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg,rgba(255,0,64,.15) 0%,transparent 50%,rgba(0,255,255,.15) 100%)", mixBlendMode: "screen" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="cg-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="cg-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="cg-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="cg-social"><Mail     size={18} /></a>}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="cg-bracket">
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(224,224,255,.75)", marginBottom: 24 }}>{data.personal.bio}</p>
                {data.personal.tagline && (
                  <div className="cg-card" style={{ padding: "16px 20px", marginBottom: 24, borderLeft: "3px solid #00ffff" }}>
                    <p className="cg-mono" style={{ fontSize: 13, color: "#00ffff", letterSpacing: 1 }}>"{data.personal.tagline}"</p>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {[
                    { icon: <Terminal size={14} />, text: data.personal.location || "Remote" },
                    { icon: <Cpu size={14} />,      text: data.personal.title },
                    { icon: <Code size={14} />,     text: `${data.stats.yearsExperience}+ Years` },
                  ].map(({ icon, text }, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 4, fontSize: 12, color: "rgba(224,224,255,.6)" }}>
                      <span style={{ color: "#ff00ff" }}>{icon}</span>{text}
                    </span>
                  ))}
                </div>
                <a href={resumeUrl} className="cg-btn cg-btn-primary" style={{ fontSize: 11, padding: "10px 22px" }}><span>Download CV</span></a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="cg-hr" />

      {/* ── SKILLS ── */}
      <section id="skills" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>03</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="Skills" /></h2>
            </div>
          </FadeIn>
          <div className="cg-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cg-hr" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>04</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="Projects" /></h2>
            </div>
          </FadeIn>
          <div className="cg-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="cg-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} style={{ overflow: "hidden" }}>
                <div className="cg-rgb-img" style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="cg-proj-img" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(8,0,16,.95) 100%)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,255,.03) 3px,rgba(0,255,255,.03) 4px)", pointerEvents: "none" }} />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}><GlitchText text={proj.title} /></h3>
                  <p style={{ fontSize: 13, color: "rgba(224,224,255,.55)", lineHeight: 1.6, marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="cg-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="cg-btn cg-btn-primary"   style={{ fontSize: 10, padding: "8px 16px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="cg-btn cg-btn-secondary" style={{ fontSize: 10, padding: "8px 16px" }}><Github        size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cg-hr" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>05</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="Experience" /></h2>
            </div>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="cg-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="cg-timeline-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <div className="cg-timeline-dot" />
                  <div className="cg-card" style={{ padding: "24px 28px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 600 }}>{exp.role}</h3>
                      <span className="cg-mono" style={{ fontSize: 11, color: "#00ffff" }}>@ {exp.company}</span>
                    </div>
                    <div className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 1, marginBottom: 12 }}>{exp.period}</div>
                    <p style={{ fontSize: 14, color: "rgba(224,224,255,.6)", lineHeight: 1.7 }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="cg-hr" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>06</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="Testimonials" /></h2>
            </div>
          </FadeIn>
          <div className="cg-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="cg-card cg-bracket" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} style={{ padding: 28 }}>
                <div className="cg-mono" style={{ fontSize: 48, lineHeight: 1, color: "#00ffff", opacity: 0.2, marginBottom: -10 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(224,224,255,.7)", marginBottom: 20 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(0,255,255,.3)", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div className="cg-mono" style={{ fontSize: 10, color: "#ff00ff", letterSpacing: 1 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="cg-hr" />

      {/* ── CONTACT ── */}
      <section id="contact" className="cg-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="cg-max">
          <FadeIn>
            <div className="cg-sec-title">
              <span className="cg-mono" style={{ fontSize: 11, color: "#ff0040", letterSpacing: 3, textTransform: "uppercase" }}>07</span>
              <h2 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}><GlitchText text="Contact" /></h2>
            </div>
          </FadeIn>
          <div className="cg-contact-row">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(224,224,255,.6)", marginBottom: 32 }}>
                Ready to collaborate? Transmit a signal — I'll pick it up on the other side.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="cg-social"><Mail size={16} /></div>
                    <a href={`mailto:${email}`} className="cg-mono" style={{ fontSize: 13, color: "#00ffff", letterSpacing: 1 }}>{email}</a>
                  </div>
                )}
                {data.socials.github && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <a href={data.socials.github} className="cg-social" target="_blank" rel="noreferrer"><Github size={16} /></a>
                    <a href={data.socials.github} target="_blank" rel="noreferrer" className="cg-mono" style={{ fontSize: 13, color: "#00ffff", letterSpacing: 1 }}>GitHub</a>
                  </div>
                )}
                {data.socials.linkedin && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <a href={data.socials.linkedin} className="cg-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>
                    <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="cg-mono" style={{ fontSize: 13, color: "#00ffff", letterSpacing: 1 }}>LinkedIn</a>
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="cg-input" placeholder="NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="cg-input" type="email" placeholder="EMAIL" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="cg-input" placeholder="MESSAGE" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cg-card"
                      style={{ padding: "16px 20px", textAlign: "center", borderColor: "rgba(0,255,255,.4)" }}>
                      <span className="cg-mono" style={{ fontSize: 12, color: "#00ffff", letterSpacing: 2 }}>✓ TRANSMISSION RECEIVED</span>
                    </motion.div>
                  ) : (
                    <motion.button key="btn" type="submit" className="cg-btn cg-btn-primary" disabled={contactState === "sending"}
                      style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "TRANSMITTING..." : "SEND SIGNAL"}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 1, padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,.06)",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16
      }}>
        <span className="cg-mono" style={{ fontSize: 11, color: "rgba(224,224,255,.3)", letterSpacing: 2 }}>
          © {new Date().getFullYear()} <span className="cg-gradient-text">{data.personal.name}</span>
        </span>
        <span className="cg-mono" style={{ fontSize: 10, color: "rgba(224,224,255,.2)", letterSpacing: 1 }}>
          RGB_SPLIT.EXE — RUNNING<span style={{ animation: "cg-cursor-blink 1s infinite", marginLeft: 4, color: "#00ffff" }}>▮</span>
        </span>
      </footer>
    </div>
  );
}
