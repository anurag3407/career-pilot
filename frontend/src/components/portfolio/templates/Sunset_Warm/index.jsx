import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown, MapPin, Briefcase, Star } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  night:   "#0A0014",
  dusk:    "#160A28",
  purple:  "#3D1070",
  violet:  "#7C3AED",
  pink:    "#EC4899",
  rose:    "#FF5E8A",
  orange:  "#FF6B35",
  amber:   "#FFB347",
  gold:    "#FFD700",
  text:    "#FFF5EE",
  muted:   "rgba(255,245,238,.55)",
  border:  "rgba(255,107,53,.15)",
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Raleway:wght@300;400;500;600;700&display=swap');

      .sw-root { background:${C.night}; color:${C.text}; font-family:'Raleway',sans-serif; overflow-x:hidden; }
      .sw-serif { font-family:'Playfair Display',serif; }

      /* Nav */
      .sw-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:64px;
        background:linear-gradient(180deg,rgba(10,0,20,.8) 0%,transparent 100%);
        backdrop-filter:blur(8px);
        transition:background .3s;
      }
      .sw-nav-link {
        font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase;
        color:rgba(255,245,238,.6); cursor:pointer; background:none; border:none; padding:8px 0;
        transition:color .2s;
      }
      .sw-nav-link:hover { color:${C.amber}; }
      .sw-nav-desktop { display:none; gap:28px; align-items:center; }
      @media (min-width:768px) {
        .sw-nav-desktop { display:flex; }
        .sw-hamburger { display:none !important; }
      }
      .sw-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .sw-mobile-menu {
        position:fixed; top:64px; left:0; right:0; z-index:49;
        background:rgba(10,0,20,.97); padding:16px 24px;
        border-bottom:1px solid ${C.border};
        display:flex; flex-direction:column; gap:4px;
      }

      /* Sections */
      .sw-sec { padding:96px 48px; position:relative; }
      @media (max-width:768px) { .sw-sec { padding:72px 24px; } }
      .sw-max { max-width:1200px; margin:0 auto; }

      /* Label */
      .sw-label {
        display:inline-flex; align-items:center; gap:10px; margin-bottom:16px;
        font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase;
        background:linear-gradient(90deg,${C.orange},${C.pink}); -webkit-background-clip:text;
        -webkit-text-fill-color:transparent; background-clip:text;
      }

      /* Heading */
      .sw-h2 { font-family:'Playfair Display',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:700; line-height:1.15; margin-bottom:48px; }
      .sw-grad { background:linear-gradient(135deg,${C.orange},${C.pink},${C.violet}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

      /* Cards */
      .sw-card {
        background:rgba(255,255,255,.04); border:1px solid ${C.border};
        border-radius:16px; overflow:hidden;
        transition:border-color .3s, transform .3s, box-shadow .3s;
      }
      .sw-card:hover {
        border-color:rgba(255,107,53,.4);
        transform:translateY(-4px);
        box-shadow:0 20px 48px rgba(255,107,53,.1),0 0 0 1px rgba(255,107,53,.15);
      }

      /* Grid layouts */
      .sw-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .sw-about-grid { grid-template-columns:1fr 1.6fr; } }

      .sw-projects-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:640px)  { .sw-projects-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .sw-projects-grid { grid-template-columns:repeat(3,1fr); } }

      .sw-skills-grid { display:grid; grid-template-columns:1fr; gap:14px; }
      @media (min-width:640px) { .sw-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .sw-testi-grid { display:grid; grid-template-columns:1fr; gap:24px; }
      @media (min-width:768px)  { .sw-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .sw-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .sw-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .sw-contact-grid { grid-template-columns:1fr 1fr; } }

      .sw-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:480px; margin:32px 0 0; }

      /* Skill bar */
      .sw-skill-track { background:rgba(255,255,255,.08); border-radius:99px; height:4px; }
      .sw-skill-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.orange},${C.pink},${C.violet}); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .sw-btn {
        display:inline-flex; align-items:center; gap:10px;
        padding:14px 28px; border-radius:99px;
        font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:all .25s; text-decoration:none; border:none;
      }
      .sw-btn-warm { background:linear-gradient(135deg,${C.orange},${C.rose}); color:#fff; }
      .sw-btn-warm:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,107,53,.45); }
      .sw-btn-outline { background:transparent; color:${C.text}; border:1px solid rgba(255,245,238,.2); }
      .sw-btn-outline:hover { border-color:${C.amber}; color:${C.amber}; }

      /* Tag */
      .sw-tag {
        display:inline-block; padding:4px 12px; border-radius:99px;
        font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase;
        background:rgba(255,107,53,.12); color:${C.amber}; border:1px solid rgba(255,179,71,.2);
      }

      /* Input */
      .sw-input {
        width:100%; padding:14px 18px; background:rgba(255,255,255,.05);
        border:1px solid ${C.border}; border-radius:12px;
        color:${C.text}; font-family:'Raleway',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s, background .2s; box-sizing:border-box;
      }
      .sw-input:focus { border-color:${C.orange}; background:rgba(255,107,53,.06); }
      .sw-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .sw-timeline { position:relative; padding-left:28px; }
      .sw-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,${C.orange},${C.pink},${C.violet},transparent); }
      .sw-timeline-dot { position:absolute; left:-5px; top:22px; width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,${C.orange},${C.pink}); box-shadow:0 0 12px ${C.orange}; }
      .sw-timeline-item { position:relative; margin-bottom:32px; }
      .sw-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .sw-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:12px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .sw-social:hover { border-color:${C.amber}; color:${C.amber}; background:rgba(255,179,71,.1); }

      /* Divider */
      .sw-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(255,107,53,.2) 30%,rgba(236,72,153,.2) 70%,transparent); }

      /* Keyframes */
      @keyframes sw-sun-rise { 0%,100% { transform:translateY(0); opacity:.8; } 50% { transform:translateY(-6px); opacity:1; } }
      @keyframes sw-ray { 0%,100% { opacity:.3; transform:scaleY(1); } 50% { opacity:.6; transform:scaleY(1.1); } }
      @keyframes sw-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      @keyframes sw-horizon { 0% { transform:scaleX(0); } 100% { transform:scaleX(1); } }
      @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition-duration:.01ms !important; } }

      /* Project image */
      .sw-proj-img { width:100%; height:220px; object-fit:cover; display:block; }
      @media (max-width:640px) { .sw-proj-img { height:180px; } }

      /* Avatar */
      .sw-avatar { width:260px; height:260px; border-radius:20px; overflow:hidden; margin:0 auto; }
      @media (max-width:768px) { .sw-avatar { width:200px; height:200px; } }

      /* Golden hour filter on images */
      .sw-golden { filter:sepia(20%) saturate(1.3) hue-rotate(-10deg); transition:filter .5s; }
      .sw-card:hover .sw-golden { filter:sepia(0%) saturate(1.1); }
    `}</style>
  );
}

/* Animated sunset sky SVG */
function SunsetSky() {
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#120028" />
          <stop offset="30%"  stopColor="#4A0080" />
          <stop offset="60%"  stopColor="#C2185B" />
          <stop offset="80%"  stopColor="#FF5E8A" />
          <stop offset="92%"  stopColor="#FF8C35" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="100%" r="50%">
          <stop offset="0%"   stopColor="#FFD700" stopOpacity=".8" />
          <stop offset="40%"  stopColor="#FF8C35" stopOpacity=".4" />
          <stop offset="100%" stopColor="#C2185B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="20%"  stopColor="#FFB347" stopOpacity=".3" />
          <stop offset="50%"  stopColor="#FFD700" stopOpacity=".5" />
          <stop offset="80%"  stopColor="#FFB347" stopOpacity=".3" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="1440" height="600" fill="url(#sky)" />
      {/* Sun glow */}
      <ellipse cx="720" cy="600" rx="440" ry="280" fill="url(#sunGlow)" />
      {/* Sun disc */}
      <circle cx="720" cy="592" r="52" fill="#FFD700" opacity=".9" style={{ animation: "sw-sun-rise 6s ease-in-out infinite" }} />
      <circle cx="720" cy="592" r="44" fill="#FFF3C4" opacity=".8" style={{ animation: "sw-sun-rise 6s ease-in-out infinite" }} />
      {/* Light rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line key={i}
          x1={720 + 60 * Math.cos((deg - 90) * Math.PI / 180)}
          y1={592 + 60 * Math.sin((deg - 90) * Math.PI / 180)}
          x2={720 + (140 + i % 3 * 20) * Math.cos((deg - 90) * Math.PI / 180)}
          y2={592 + (140 + i % 3 * 20) * Math.sin((deg - 90) * Math.PI / 180)}
          stroke="#FFD700" strokeWidth="1.5" opacity=".25"
          style={{ animation: `sw-ray ${2 + i * 0.2}s ease-in-out infinite`, transformOrigin: `720px 592px` }}
        />
      ))}
      {/* Horizon shimmer */}
      <rect x="0" y="572" width="1440" height="2" fill="url(#horizon)" style={{ animation: "sw-horizon 2s ease-out" }} />
      {/* Mountain silhouettes */}
      <polygon points="0,600 0,480 180,380 360,420 500,340 640,390 720,310 800,380 940,330 1080,410 1200,360 1350,400 1440,440 1440,600" fill="rgba(10,0,20,.85)" />
      <polygon points="0,600 0,520 100,480 220,450 360,480 500,440 620,470 720,430 820,460 960,440 1100,470 1220,450 1350,480 1440,460 1440,600" fill="rgba(10,0,20,.95)" />
    </svg>
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

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="sw-card" style={{ padding: "18px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>{level}%</span>
      </div>
      <div className="sw-skill-track">
        <div className="sw-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 8 }}><span className="sw-tag">{category}</span></div>
    </div>
  );
}

export default function SunsetWarm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const sunY = useTransform(scrollY, [0, 600], [0, -60]);

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
    <div className="sw-root">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="sw-nav">
        <button className="sw-nav-link" onClick={() => scrollTo("hero")} style={{ color: C.amber, fontSize: 14, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div className="sw-nav-desktop">
          {sections.map((s) => (
            <button key={s} className="sw-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button className="sw-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 22, height: 2, background: i === 1 ? C.orange : C.text, margin: "4px 0", transition: "all .2s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="sw-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s) => (
              <button key={s} className="sw-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "10px 0" }}>
                <span style={{ color: C.amber, marginRight: 8 }}>◆</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        <motion.div style={{ y: heroParallax, position: "absolute", inset: 0 }}>
          <SunsetSky />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,0,20,.85) 0%, rgba(10,0,20,.3) 50%, transparent 100%)", zIndex: 1 }} />

        <div className="sw-max" style={{ position: "relative", zIndex: 2, padding: "0 48px", width: "100%" }}>
          <div style={{ maxWidth: 700, textAlign: "center", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 20 }}>
              <div className="sw-label">Portfolio {new Date().getFullYear()}</div>
            </motion.div>
            <motion.h1 className="sw-serif sw-grad" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>
              {data.personal.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.amber, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>
              {data.personal.title}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,245,238,.7)", maxWidth: 520, margin: "0 auto 40px" }}>
              {data.personal.bio}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
              <button className="sw-btn sw-btn-warm" onClick={() => scrollTo("projects")}>View Work</button>
              <button className="sw-btn sw-btn-outline" onClick={() => scrollTo("contact")}>Say Hello</button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="sw-stats" style={{ margin: "0 auto" }}>
                {[
                  { val: `${data.stats.yearsExperience}+`, label: "Years" },
                  { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                  { val: `${data.stats.happyClients}+`, label: "Clients" },
                ].map(({ val, label }, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "20px 12px", borderRight: i < 2 ? "1px solid rgba(255,107,53,.15)" : "none" }}>
                    <div className="sw-serif sw-grad" style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700 }}>{val}</div>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", cursor: "pointer", zIndex: 2 }}
          onClick={() => scrollTo("about")}>
          <ChevronDown size={20} style={{ color: C.amber, opacity: 0.7 }} />
        </motion.div>
      </section>

      <hr className="sw-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="sw-sec">
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">About Me</div>
            <h2 className="sw-h2 sw-serif">Golden Hour<br /><span className="sw-grad">Perspective</span></h2>
          </FadeIn>
          <div className="sw-about-grid">
            <FadeIn>
              <div className="sw-avatar" style={{ background: `linear-gradient(135deg,${C.orange},${C.pink})`, padding: 3, borderRadius: 20 }}>
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                {data.socials.github   && <a href={data.socials.github}   className="sw-social" target="_blank" rel="noreferrer"><Github   size={18} /></a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} className="sw-social" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                {data.socials.twitter  && <a href={data.socials.twitter}  className="sw-social" target="_blank" rel="noreferrer"><Twitter  size={18} /></a>}
                {email                 && <a href={`mailto:${email}`}     className="sw-social"><Mail     size={18} /></a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,245,238,.75)", marginBottom: 28 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,107,53,.08)", borderLeft: `3px solid ${C.orange}`, marginBottom: 28 }}>
                  <p className="sw-serif" style={{ fontSize: 17, fontStyle: "italic", color: C.amber }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {[
                  { icon: <MapPin size={13} />, text: data.personal.location || "Remote" },
                  { icon: <Briefcase size={13} />, text: data.personal.title },
                ].map(({ icon, text }, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,.05)", border: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>
                    <span style={{ color: C.orange }}>{icon}</span>{text}
                  </span>
                ))}
              </div>
              <a href={resumeUrl} className="sw-btn sw-btn-warm"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="sw-divider" />

      {/* ── SKILLS ── */}
      <section id="skills" className="sw-sec" style={{ background: "rgba(255,107,53,.04)" }}>
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">Expertise</div>
            <h2 className="sw-h2 sw-serif">Skills & <span className="sw-grad">Craft</span></h2>
          </FadeIn>
          <div className="sw-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sw-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="sw-sec">
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">Portfolio</div>
            <h2 className="sw-h2 sw-serif">Recent <span className="sw-grad">Work</span></h2>
          </FadeIn>
          <div className="sw-projects-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="sw-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="sw-proj-img sw-golden" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 50%,${C.night}CC 100%)` }} />
                  <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {proj.techStack.slice(0, 3).map((t, j) => <span key={j} className="sw-tag" style={{ fontSize: 9 }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ padding: "20px 22px 24px" }}>
                  <h3 className="sw-serif" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 20 }}>{proj.description}</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="sw-btn sw-btn-warm"    style={{ fontSize: 10, padding: "8px 16px" }}><ExternalLink size={11} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="sw-btn sw-btn-outline" style={{ fontSize: 10, padding: "8px 16px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sw-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="sw-sec" style={{ background: "rgba(255,107,53,.04)" }}>
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">Career</div>
            <h2 className="sw-h2 sw-serif">The <span className="sw-grad">Journey</span></h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="sw-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="sw-timeline-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="sw-timeline-dot" />
                  <div className="sw-card" style={{ padding: "22px 26px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: C.amber, marginBottom: 8, textTransform: "uppercase" }}>{exp.period}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 10 }}>
                      <h3 className="sw-serif" style={{ fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
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

      <hr className="sw-divider" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="sw-sec">
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">Kind Words</div>
            <h2 className="sw-h2 sw-serif">What People <span className="sw-grad">Say</span></h2>
          </FadeIn>
          <div className="sw-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="sw-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[0,1,2,3,4].map(j => <Star key={j} size={12} style={{ fill: C.amber, color: C.amber }} />)}
                </div>
                <p className="sw-serif" style={{ fontSize: 15, lineHeight: 1.75, fontStyle: "italic", color: "rgba(255,245,238,.8)", marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.orange}` }} />
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

      <hr className="sw-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="sw-sec" style={{ background: "rgba(255,107,53,.04)" }}>
        <div className="sw-max">
          <FadeIn>
            <div className="sw-label">Connect</div>
            <h2 className="sw-h2 sw-serif">Let's <span className="sw-grad">Create Together</span></h2>
          </FadeIn>
          <div className="sw-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: C.muted, marginBottom: 32 }}>
                Like a golden-hour light, good collaborations are rare and beautiful. Let's catch one together.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: C.text, fontSize: 14, fontWeight: 500 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${C.orange},${C.rose})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={18} color="#fff" />
                    </div>
                    {email}
                  </a>
                )}
                {data.socials.github && (
                  <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: C.text, fontSize: 14, fontWeight: 500 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.08)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Github size={18} color={C.amber} />
                    </div>
                    GitHub
                  </a>
                )}
                {data.socials.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: C.text, fontSize: 14, fontWeight: 500 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.08)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Linkedin size={18} color={C.amber} />
                    </div>
                    LinkedIn
                  </a>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input className="sw-input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="sw-input" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="sw-input" placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "16px", borderRadius: 12, background: "rgba(255,107,53,.1)", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.amber }}>✓ Message Sent — Golden!</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="sw-btn sw-btn-warm" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
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
      <footer style={{ padding: "32px 48px", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span className="sw-serif" style={{ fontSize: 13, color: C.muted }}>
          © {new Date().getFullYear()} <span className="sw-grad">{data.personal.name}</span>
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          {data.socials.github   && <a href={data.socials.github}   className="sw-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="sw-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="sw-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
        </div>
      </footer>
    </div>
  );
}
