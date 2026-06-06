import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown, Star } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  night:  "#03040A",
  deep:   "#080C18",
  navy:   "#0F172A",
  dusk:   "#B5451B",
  orange: "#EA7A30",
  amber:  "#F59E0B",
  purple: "#7C3AED",
  violet: "#A855F7",
  text:   "#E2D9F3",
  muted:  "rgba(226,217,243,.5)",
  border: "rgba(168,85,247,.15)",
  star:   "#FFF5C4",
};

/* Generate deterministic star field */
function generateStars(count) {
  const stars = [];
  let seed = 42;
  const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.5 + rand() * 1.5,
      opacity: 0.4 + rand() * 0.6,
      delay: rand() * 4,
      dur: 2 + rand() * 3,
    });
  }
  return stars;
}

const STARS = generateStars(80);

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

      .th-root { background:${C.night}; color:${C.text}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
      .th-serif { font-family:'Cormorant Garamond',serif; }

      /* Nav */
      .th-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:64px;
        background:linear-gradient(180deg,rgba(3,4,10,.75) 0%,transparent 100%);
        backdrop-filter:blur(12px);
      }
      .th-nav-link {
        font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase;
        color:${C.muted}; cursor:pointer; background:none; border:none; padding:8px 0;
        transition:color .25s;
      }
      .th-nav-link:hover { color:${C.amber}; }
      .th-nav-desktop { display:none; gap:28px; }
      @media (min-width:768px) {
        .th-nav-desktop { display:flex; }
        .th-hamburger { display:none !important; }
      }
      .th-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .th-mobile-menu {
        position:fixed; top:64px; left:0; right:0; z-index:49;
        background:rgba(3,4,10,.97); padding:16px 24px; border-bottom:1px solid ${C.border};
        display:flex; flex-direction:column; gap:4px;
      }

      /* Sections */
      .th-sec { padding:96px 48px; position:relative; z-index:1; }
      @media (max-width:768px) { .th-sec { padding:72px 24px; } }
      .th-max { max-width:1200px; margin:0 auto; }

      /* Label */
      .th-label {
        display:inline-block; font-size:10px; font-weight:500; letter-spacing:4px;
        text-transform:uppercase; color:${C.amber}; margin-bottom:16px; opacity:.8;
      }

      /* Heading */
      .th-h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,6vw,4rem); font-weight:600; line-height:1.15; margin-bottom:48px; }
      .th-grad { background:linear-gradient(135deg,${C.orange},${C.violet}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

      /* Cards */
      .th-card {
        background:rgba(15,23,42,.6); border:1px solid ${C.border};
        border-radius:12px; overflow:hidden; backdrop-filter:blur(6px);
        transition:border-color .3s, transform .3s, box-shadow .3s;
      }
      .th-card:hover {
        border-color:rgba(168,85,247,.35);
        transform:translateY(-3px);
        box-shadow:0 16px 40px rgba(124,58,237,.1);
      }

      /* Grid layouts */
      .th-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .th-about-grid { grid-template-columns:1fr 1.6fr; } }

      .th-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .th-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .th-projects-grid { grid-template-columns:repeat(3,1fr); } }

      .th-skills-grid { display:grid; grid-template-columns:1fr; gap:12px; }
      @media (min-width:640px) { .th-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .th-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .th-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .th-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .th-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .th-contact-grid { grid-template-columns:1fr 1fr; } }

      .th-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px auto 0; }

      /* Skill bar */
      .th-skill-track { background:rgba(255,255,255,.06); border-radius:99px; height:3px; }
      .th-skill-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.orange},${C.violet}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .th-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:13px 26px; border-radius:99px;
        font-size:12px; font-weight:500; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:all .25s; text-decoration:none; border:none;
        font-family:'DM Sans',sans-serif;
      }
      .th-btn-primary { background:linear-gradient(135deg,${C.orange},${C.purple}); color:#fff; }
      .th-btn-primary:hover { opacity:.9; transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,.3); }
      .th-btn-ghost { background:transparent; color:${C.text}; border:1px solid rgba(255,255,255,.15); }
      .th-btn-ghost:hover { border-color:${C.violet}; color:${C.violet}; }

      /* Tag */
      .th-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:500; letter-spacing:1px; text-transform:uppercase; background:rgba(168,85,247,.1); color:${C.violet}; border:1px solid rgba(168,85,247,.2); }

      /* Input */
      .th-input {
        width:100%; padding:14px 18px; background:rgba(15,23,42,.6);
        border:1px solid ${C.border}; border-radius:10px;
        color:${C.text}; font-family:'DM Sans',sans-serif; font-size:14px; outline:none;
        transition:border-color .25s; box-sizing:border-box; backdrop-filter:blur(4px);
      }
      .th-input:focus { border-color:${C.violet}; }
      .th-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .th-timeline { position:relative; padding-left:28px; }
      .th-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.orange},${C.violet},transparent); }
      .th-timeline-dot { position:absolute; left:-5px; top:20px; width:10px; height:10px; border-radius:50%; background:${C.violet}; box-shadow:0 0 12px ${C.violet}80; }
      .th-timeline-item { position:relative; margin-bottom:32px; }
      .th-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .th-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:10px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .25s;
      }
      .th-social:hover { border-color:${C.violet}; color:${C.violet}; background:rgba(168,85,247,.08); }

      /* Divider */
      .th-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(168,85,247,.15) 20%,rgba(168,85,247,.15) 80%,transparent); }

      /* Avatar */
      .th-avatar { width:260px; height:260px; border-radius:16px; overflow:hidden; margin:0 auto; padding:2px; background:linear-gradient(135deg,${C.orange},${C.violet}); }

      /* Project image */
      .th-proj-img { width:100%; height:210px; object-fit:cover; display:block; }

      /* Keyframes */
      @keyframes th-twinkle { 0%,100% { opacity:var(--op,.6); transform:scale(1); } 50% { opacity:1; transform:scale(1.4); } }
      @keyframes th-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition-duration:.01ms !important; } }
    `}</style>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="th-card" style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 400 }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.amber }}>{level}%</span>
      </div>
      <div className="th-skill-track">
        <div className="th-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="th-tag">{category}</span></div>
    </div>
  );
}

export default function TwilightHorizon() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { scrollY } = useScroll();
  const skyParallax = useTransform(scrollY, [0, 800], [0, -120]);
  const starOpacity = useTransform(scrollY, [0, 400], [0.4, 1]);

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
    <div className="th-root">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="th-nav">
        <button className="th-nav-link th-serif" onClick={() => scrollTo("hero")} style={{ color: C.amber, fontSize: 14, letterSpacing: 3, fontStyle: "italic" }}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div className="th-nav-desktop">
          {sections.map((s) => (
            <button key={s} className="th-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button className="th-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 22, height: 1.5, background: i === 1 ? C.amber : C.text, margin: "5px 0", transition: "all .25s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="th-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s) => (
              <button key={s} className="th-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "10px 0" }}>
                <span style={{ color: C.amber, marginRight: 8 }}>✦</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative", overflow: "hidden" }}>
        {/* Twilight sky gradient */}
        <motion.div style={{ y: skyParallax, position: "absolute", inset: "-20%", zIndex: 0 }}>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="twilight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#03040A" />
                <stop offset="20%"  stopColor="#0F0520" />
                <stop offset="45%"  stopColor="#3B1060" />
                <stop offset="65%"  stopColor="#7B1C3D" />
                <stop offset="80%"  stopColor="#B5451B" />
                <stop offset="92%"  stopColor="#E06B2A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <radialGradient id="horizonGlow" cx="50%" cy="100%" r="50%">
                <stop offset="0%"   stopColor="#F59E0B" stopOpacity=".3" />
                <stop offset="100%" stopColor="#B5451B" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1440" height="900" fill="url(#twilight)" />
            <ellipse cx="720" cy="900" rx="600" ry="300" fill="url(#horizonGlow)" />
            {/* Horizon line */}
            <line x1="0" y1="820" x2="1440" y2="820" stroke="#F59E0B" strokeWidth="1" opacity=".15" />
          </svg>
        </motion.div>

        {/* Star field */}
        <motion.div style={{ opacity: starOpacity, position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.star}
                style={{ "--op": s.opacity, opacity: s.opacity, animation: `th-twinkle ${s.dur}s ease-in-out infinite ${s.delay}s` }} />
            ))}
          </svg>
        </motion.div>

        <div className="th-max" style={{ position: "relative", zIndex: 2, padding: "0 48px", width: "100%", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 20 }}>
            <div className="th-label">At the edge of day and night</div>
          </motion.div>
          <motion.h1 className="th-serif" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 300, lineHeight: 1.05, marginBottom: 16, letterSpacing: 4,
              background: "linear-gradient(135deg,#F59E0B,#A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.amber, fontWeight: 300, letterSpacing: 5, textTransform: "uppercase", marginBottom: 20 }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.45 }}
            style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(226,217,243,.65)", maxWidth: 500, margin: "0 auto 40px" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
            <button className="th-btn th-btn-primary" onClick={() => scrollTo("projects")}>Explore Work</button>
            <button className="th-btn th-btn-ghost" onClick={() => scrollTo("contact")}>Connect</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            <div className="th-stats">
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "20px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div className="th-serif th-grad" style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 400 }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2.2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", cursor: "pointer", zIndex: 2 }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={18} style={{ color: C.amber, opacity: 0.6 }} />
        </motion.div>
      </section>

      <hr className="th-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="th-sec">
        <div className="th-max">
          <FadeIn>
            <div className="th-label">About</div>
            <h2 className="th-h2">Between <span className="th-grad">Worlds</span></h2>
          </FadeIn>
          <div className="th-about-grid">
            <FadeIn>
              <div className="th-avatar">
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14, display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="th-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="th-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="th-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="th-social"><Mail size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "rgba(226,217,243,.75)", marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(168,85,247,.06)", borderLeft: `2px solid ${C.violet}`, marginBottom: 28 }}>
                  <p className="th-serif" style={{ fontSize: 17, fontStyle: "italic", color: C.violet }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="th-btn th-btn-primary"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="th-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="th-sec" style={{ background: "rgba(15,23,42,.3)" }}>
        <div className="th-max">
          <FadeIn>
            <div className="th-label">Skills</div>
            <h2 className="th-h2">Stars in My <span className="th-grad">Sky</span></h2>
          </FadeIn>
          <div className="th-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="th-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="th-sec">
        <div className="th-max">
          <FadeIn>
            <div className="th-label">Projects</div>
            <h2 className="th-h2">Constellations of <span className="th-grad">Work</span></h2>
          </FadeIn>
          <div className="th-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="th-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="th-proj-img" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.night}EE 100%)` }} />
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 className="th-serif" style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="th-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="th-btn th-btn-primary" style={{ fontSize: 10, padding: "8px 14px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="th-btn th-btn-ghost"   style={{ fontSize: 10, padding: "8px 14px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="th-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="th-sec" style={{ background: "rgba(15,23,42,.3)" }}>
        <div className="th-max">
          <FadeIn>
            <div className="th-label">Experience</div>
            <h2 className="th-h2">The Path Behind <span className="th-grad">Me</span></h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="th-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="th-timeline-item" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="th-timeline-dot" />
                  <div className="th-card" style={{ padding: "22px 26px" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: C.amber, marginBottom: 8, textTransform: "uppercase" }}>{exp.period}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 10 }}>
                      <h3 className="th-serif" style={{ fontSize: 19, fontWeight: 600 }}>{exp.role}</h3>
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

      <hr className="th-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="th-sec">
        <div className="th-max">
          <FadeIn>
            <div className="th-label">Testimonials</div>
            <h2 className="th-h2">Light from Other <span className="th-grad">Stars</span></h2>
          </FadeIn>
          <div className="th-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="th-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[0,1,2,3,4].map(j => <Star key={j} size={11} style={{ fill: C.amber, color: C.amber }} />)}
                </div>
                <p className="th-serif" style={{ fontSize: 15, lineHeight: 1.75, fontStyle: "italic", color: "rgba(226,217,243,.75)", marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.border}` }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="th-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="th-sec" style={{ background: "rgba(15,23,42,.3)" }}>
        <div className="th-max">
          <FadeIn>
            <div className="th-label">Contact</div>
            <h2 className="th-h2">Meet Me at the <span className="th-grad">Horizon</span></h2>
          </FadeIn>
          <div className="th-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: C.muted, marginBottom: 32 }}>
                At the threshold between day and night, reach out — I'll be there.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg,${C.orange}25,${C.violet}25)`, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color={C.violet} />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} color={C.amber} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} color={C.amber} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="th-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="th-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="th-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "16px", borderRadius: 10, background: "rgba(168,85,247,.08)", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.violet, letterSpacing: 2 }}>✦ Message Sent</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="th-btn th-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
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
        <span className="th-serif" style={{ fontSize: 13, color: C.muted, letterSpacing: 3, fontStyle: "italic" }}>
          © {new Date().getFullYear()} {data.personal.name}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {data.socials.github   && <a href={data.socials.github}   className="th-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="th-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="th-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
