import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ArrowRight, MapPin, Briefcase, Calendar } from "lucide-react";

/* Duotone palette: dark indigo + electric orange */
const C = {
  dark:   "#0B0C1E",
  mid:    "#13152E",
  light:  "#1E2248",
  orange: "#FF5F1F",
  orangeL:"#FF8C55",
  white:  "#F0EEF8",
  muted:  "rgba(240,238,248,0.5)",
  border: "rgba(255,95,31,0.2)",
};

function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&display=swap');

      .dt-root { background:${C.dark}; color:${C.white}; font-family:'Syne',sans-serif; overflow-x:hidden; }
      .dt-mono  { font-family:'Syne Mono',monospace; }

      /* Duotone image effect */
      .dt-duotone {
        position:relative; overflow:hidden; display:block;
        background:${C.orange};
      }
      .dt-duotone img {
        display:block; width:100%; height:100%; object-fit:cover;
        filter:grayscale(100%) contrast(1.1);
        mix-blend-mode:multiply;
        transition:transform .5s ease;
      }
      .dt-duotone:hover img { transform:scale(1.04); }
      .dt-duotone::after {
        content:''; position:absolute; inset:0; pointer-events:none;
        background:linear-gradient(180deg,${C.dark}00 0%,${C.dark}CC 100%);
        z-index:1;
      }

      /* Nav */
      .dt-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:64px;
        background:rgba(11,12,30,.9); backdrop-filter:blur(16px);
        border-bottom:1px solid ${C.border};
      }
      .dt-nav-link {
        font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase;
        color:${C.muted}; cursor:pointer; background:none; border:none; padding:8px 0;
        transition:color .2s;
      }
      .dt-nav-link:hover { color:${C.orange}; }
      .dt-nav-desktop { display:none; gap:32px; }
      @media (min-width:768px) {
        .dt-nav-desktop { display:flex; }
        .dt-hamburger { display:none !important; }
      }
      .dt-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .dt-mobile-menu {
        position:fixed; top:64px; left:0; right:0; z-index:49;
        background:rgba(11,12,30,.97); border-bottom:1px solid ${C.border};
        padding:16px 24px;
      }

      /* Section */
      .dt-sec { padding:100px 48px; }
      @media (max-width:768px) { .dt-sec { padding:72px 24px; } }
      .dt-max { max-width:1200px; margin:0 auto; }

      /* Section label */
      .dt-label {
        display:inline-flex; align-items:center; gap:12px;
        font-size:11px; font-weight:700; letter-spacing:4px; text-transform:uppercase;
        color:${C.orange}; margin-bottom:20px;
      }
      .dt-label::before { content:''; width:32px; height:2px; background:${C.orange}; }

      /* Heading */
      .dt-h2 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:48px; }

      /* Cards */
      .dt-card {
        background:${C.mid}; border:1px solid ${C.border};
        border-radius:12px; overflow:hidden;
        transition:border-color .25s, transform .25s, box-shadow .25s;
      }
      .dt-card:hover {
        border-color:${C.orange};
        transform:translateY(-4px);
        box-shadow:0 16px 40px rgba(255,95,31,.12);
      }

      /* Grid layouts */
      .dt-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .dt-about-grid { grid-template-columns:1fr 1.5fr; } }

      .dt-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .dt-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .dt-projects-grid { grid-template-columns:repeat(3,1fr); } }

      .dt-skills-grid { display:grid; grid-template-columns:1fr; gap:16px; }
      @media (min-width:640px) { .dt-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .dt-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .dt-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .dt-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .dt-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .dt-contact-grid { grid-template-columns:1fr 1fr; } }

      .dt-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px 0 0; }

      /* Skill bar */
      .dt-skill-track { background:${C.light}; border-radius:2px; height:3px; }
      .dt-skill-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,${C.orange},${C.orangeL}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Buttons */
      .dt-btn {
        display:inline-flex; align-items:center; gap:10px;
        padding:14px 28px; border-radius:6px;
        font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:all .2s; text-decoration:none; border:none;
      }
      .dt-btn-primary { background:${C.orange}; color:${C.dark}; }
      .dt-btn-primary:hover { background:${C.orangeL}; transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,95,31,.4); }
      .dt-btn-outline { background:transparent; color:${C.white}; border:1px solid rgba(240,238,248,.2); }
      .dt-btn-outline:hover { border-color:${C.orange}; color:${C.orange}; }

      /* Tags */
      .dt-tag {
        display:inline-block; padding:4px 10px; border-radius:4px;
        font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
        background:rgba(255,95,31,.12); color:${C.orangeL}; border:1px solid rgba(255,95,31,.2);
      }

      /* Input */
      .dt-input {
        width:100%; padding:14px 16px; background:${C.mid};
        border:1px solid ${C.border}; border-radius:6px;
        color:${C.white}; font-family:'Syne',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .dt-input:focus { border-color:${C.orange}; }
      .dt-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .dt-timeline { position:relative; padding-left:28px; }
      .dt-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.orange},${C.orange}00); }
      .dt-timeline-dot { position:absolute; left:-5px; top:20px; width:10px; height:10px; border-radius:50%; background:${C.orange}; box-shadow:0 0 12px ${C.orange}; }
      .dt-timeline-item { position:relative; margin-bottom:32px; }
      .dt-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .dt-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:8px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .dt-social:hover { border-color:${C.orange}; color:${C.orange}; background:rgba(255,95,31,.1); }

      /* Divider */
      .dt-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,${C.border} 20%,${C.border} 80%,transparent); }

      /* Project image */
      .dt-proj-img { width:100%; height:220px; }
      @media (max-width:640px) { .dt-proj-img { height:180px; } }

      /* Avatar */
      .dt-avatar-wrap { width:280px; height:280px; border-radius:12px; overflow:hidden; margin:0 auto; }
      @media (max-width:768px) { .dt-avatar-wrap { width:200px; height:200px; } }

      /* Keyframes */
      @keyframes dt-pulse-orange { 0%,100% { box-shadow:0 0 0 0 rgba(255,95,31,.4); } 50% { box-shadow:0 0 0 12px rgba(255,95,31,0); } }
      @keyframes dt-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition-duration:.01ms !important; } }
    `}</style>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const { portfolioData: data } = usePortfolio();

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

function SkillBar({ name, level, category }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="dt-card" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
        <span className="dt-mono" style={{ fontSize: 12, color: C.orange }}>{level}%</span>
      </div>
      <div className="dt-skill-track">
        <div className="dt-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="dt-tag">{category}</span></div>
    </div>
  );
}

export default function DuotoneBold() {
  const { portfolioData: data } = usePortfolio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);

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
    <div className="dt-root">
      <GlobalStyles />

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,95,31,.07) 0%, transparent 70%)`, top: "-20%", right: "-10%" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,95,31,.05) 0%, transparent 70%)`, bottom: "10%", left: "-10%", animation: "dt-float 12s ease-in-out infinite" }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="dt-nav">
        <button type="button" className="dt-nav-link" onClick={() => scrollTo("hero")} style={{ color: C.orange, fontSize: 16, fontWeight: 800, letterSpacing: 4 }}>
          {data.personal.name.split(" ")[0].toUpperCase()}
        </button>
        <div className="dt-nav-desktop">
          {sections.map((s) => (
            <button type="button" key={s} className="dt-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button type="button" className="dt-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 24, height: 2, background: i === 1 ? C.orange : C.white, margin: "4px 0", transition: "all .2s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="dt-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sections.map((s) => (
              <button type="button" key={s} className="dt-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "10px 0" }}>
                <span style={{ color: C.orange, marginRight: 8 }}>→</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative", zIndex: 1, overflow: "hidden" }}>
        {/* Big duotone background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div className="dt-duotone" style={{ width: "100%", height: "100%" }}>
            <img src={data.personal.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.dark} 40%, transparent 100%)` }} />
        </div>

        <motion.div className="dt-max" style={{ y: heroY, position: "relative", zIndex: 2, padding: "0 48px", width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 16 }}>
              <div className="dt-label">Creative Professional</div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontSize: "clamp(2.5rem,8vw,6rem)", fontWeight: 800, lineHeight: 1, marginBottom: 16 }}>
              {data.personal.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: "clamp(1rem,2.5vw,1.3rem)", color: C.orange, fontWeight: 600, marginBottom: 20, letterSpacing: 2 }}>
              {data.personal.title}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 500, marginBottom: 40 }}>
              {data.personal.bio}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
              <button type="button" className="dt-btn dt-btn-primary" onClick={() => scrollTo("projects")}>
                <span>View Work</span><ArrowRight size={14} />
              </button>
              <button type="button" className="dt-btn dt-btn-outline" onClick={() => scrollTo("contact")}>
                <span>Get In Touch</span>
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="dt-stats">
                {[
                  { val: `${data.stats.yearsExperience}+`, label: "Years" },
                  { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                  { val: `${data.stats.happyClients}+`, label: "Clients" },
                ].map(({ val, label }, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "20px 16px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 800, color: C.orange }}>{val}</div>
                    <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <hr className="dt-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="dt-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">About Me</div>
            <h2 className="dt-h2">The Person Behind<br /><span style={{ color: C.orange }}>The Work</span></h2>
          </FadeIn>
          <div className="dt-about-grid">
            <FadeIn>
              <div className="dt-avatar-wrap dt-duotone">
                <img src={data.personal.avatar} alt={data.personal.name} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="dt-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="dt-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="dt-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="dt-social"><Mail     size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(240,238,248,.75)", marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ borderLeft: `3px solid ${C.orange}`, paddingLeft: 20, marginBottom: 28 }}>
                  <p style={{ fontSize: 17, fontWeight: 600, fontStyle: "italic", color: C.white }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                {[
                  { icon: <MapPin size={13} />, text: data.personal.location || "Remote" },
                  { icon: <Briefcase size={13} />, text: data.personal.title },
                  { icon: <Calendar size={13} />, text: `${data.stats.yearsExperience}+ Years Exp` },
                ].map(({ icon, text }, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, background: C.mid, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>
                    <span style={{ color: C.orange }}>{icon}</span>{text}
                  </span>
                ))}
              </div>
              <a href={resumeUrl} className="dt-btn dt-btn-primary"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="dt-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="dt-sec" style={{ background: C.mid, position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">What I Know</div>
            <h2 className="dt-h2">Skills &<br /><span style={{ color: C.orange }}>Expertise</span></h2>
          </FadeIn>
          <div className="dt-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="dt-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="dt-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">Selected Work</div>
            <h2 className="dt-h2">Recent<br /><span style={{ color: C.orange }}>Projects</span></h2>
          </FadeIn>
          <div className="dt-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="dt-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className={`dt-duotone dt-proj-img`}>
                  <img src={proj.image} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px 24px 28px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 16 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="dt-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="dt-btn dt-btn-primary"  style={{ fontSize: 10, padding: "8px 16px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="dt-btn dt-btn-outline" style={{ fontSize: 10, padding: "8px 16px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="dt-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="dt-sec" style={{ background: C.mid, position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">Work History</div>
            <h2 className="dt-h2">Professional<br /><span style={{ color: C.orange }}>Journey</span></h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="dt-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="dt-timeline-item" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="dt-timeline-dot" style={{ animation: "dt-pulse-orange 2s ease-in-out infinite" }} />
                  <div className="dt-card" style={{ padding: "24px 28px" }}>
                    <div className="dt-mono" style={{ fontSize: 11, color: C.orange, letterSpacing: 2, marginBottom: 8 }}>{exp.period}</div>
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

      <hr className="dt-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="dt-sec" style={{ position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">Kind Words</div>
            <h2 className="dt-h2">What People<br /><span style={{ color: C.orange }}>Say</span></h2>
          </FadeIn>
          <div className="dt-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="dt-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 28 }}>
                <div style={{ fontSize: 48, lineHeight: 1, color: C.orange, opacity: 0.2, fontWeight: 800, marginBottom: -8 }}>&#8220;</div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: C.muted, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="dt-duotone" style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0 }}>
                    <img src={t.avatar} alt={t.name} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                    <div className="dt-mono" style={{ fontSize: 11, color: C.orange, letterSpacing: 1 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="dt-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="dt-sec" style={{ background: C.mid, position: "relative", zIndex: 1 }}>
        <div className="dt-max">
          <FadeIn>
            <div className="dt-label">Get In Touch</div>
            <h2 className="dt-h2">Let's Work<br /><span style={{ color: C.orange }}>Together</span></h2>
          </FadeIn>
          <div className="dt-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, marginBottom: 32 }}>
                Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you within 24 hours.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.white, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color={C.dark} />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && (
                  <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.white, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: C.light, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}>
                      <Github size={18} color={C.orange} />
                    </div>
                    GitHub Profile
                  </a>
                )}
                {data.socials.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.white, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: C.light, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}>
                      <Linkedin size={18} color={C.orange} />
                    </div>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="dt-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="dt-input" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="dt-input" placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "16px", borderRadius: 8, background: "rgba(255,95,31,.12)", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <span className="dt-mono" style={{ fontSize: 12, color: C.orange, letterSpacing: 2 }}>✓ MESSAGE SENT</span>
                    </motion.div>
                  ) : (
                    <motion.button key="btn" type="submit" className="dt-btn dt-btn-primary" disabled={contactState === "sending"}
                      style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "Sending..." : "Send Message"}</span>
                      {contactState !== "sending" && <ArrowRight size={14} />}
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 1, padding: "32px 48px", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: C.muted }}>© {new Date().getFullYear()} <span style={{ color: C.orange }}>{data.personal.name}</span></span>
        <div style={{ display: "flex", gap: 16 }}>
          {data.socials.github   && <a href={data.socials.github}   className="dt-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="dt-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="dt-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
