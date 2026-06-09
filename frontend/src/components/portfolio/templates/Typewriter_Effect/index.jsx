import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const C = {
  paper:  "#F5F0E8",
  parchment: "#EDE4D0",
  dark:   "#1A1208",
  mid:    "#4A3D28",
  muted:  "#8B7355",
  ribbon: "#8B2500",
  ribbonL:"#B83200",
  ink:    "#2A1F0E",
  border: "#C8B89A",
  white:  "#FEFCF7",
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

      .tw-root {
        background:${C.paper};
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        color:${C.dark};
        font-family:'Courier Prime',monospace;
        overflow-x:hidden;
      }
      .tw-display { font-family:'Special Elite',cursive; }

      /* Cursor blink */
      .tw-cursor {
        display:inline-block; width:2px; height:1.1em;
        background:${C.ribbon}; margin-left:2px; vertical-align:text-bottom;
        animation:tw-blink 1s step-end infinite;
      }
      .tw-cursor-wide {
        display:inline-block; background:transparent;
        border-right:2px solid ${C.ribbon};
        padding-right:2px; margin-right:-2px;
        animation:tw-blink 1s step-end infinite;
      }

      /* Nav */
      .tw-nav {
        position:fixed; top:0; left:0; right:0; z-index:50;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:56px;
        background:${C.parchment};
        border-bottom:2px solid ${C.border};
      }
      .tw-nav-link {
        font-size:11px; font-weight:400; letter-spacing:2px; text-transform:uppercase;
        color:${C.muted}; cursor:pointer; background:none; border:none; padding:6px 0;
        font-family:'Courier Prime',monospace; transition:color .2s;
      }
      .tw-nav-link:hover { color:${C.ribbon}; }
      .tw-nav-desktop { display:none; gap:24px; }
      @media (min-width:768px) {
        .tw-nav-desktop { display:flex; }
        .tw-hamburger { display:none !important; }
      }
      .tw-hamburger { background:none; border:none; cursor:pointer; padding:4px; }
      .tw-mobile-menu {
        position:fixed; top:56px; left:0; right:0; z-index:49;
        background:${C.parchment}; padding:12px 24px; border-bottom:2px solid ${C.border};
        display:flex; flex-direction:column; gap:4px;
      }

      /* Sections */
      .tw-sec { padding:80px 48px; position:relative; }
      @media (max-width:768px) { .tw-sec { padding:64px 24px; } }
      .tw-max { max-width:1100px; margin:0 auto; }
      .tw-alt { background:${C.parchment}; }

      /* Section label */
      .tw-sec-label {
        font-size:10px; letter-spacing:4px; text-transform:uppercase;
        color:${C.ribbon}; margin-bottom:12px; font-family:'Courier Prime',monospace;
        display:flex; align-items:center; gap:8px;
      }
      .tw-sec-label::before { content:''; flex:none; width:24px; height:1px; background:${C.ribbon}; }

      /* Heading */
      .tw-h2 { font-family:'Special Elite',cursive; font-size:clamp(2rem,5vw,3.5rem); font-weight:400; line-height:1.2; margin-bottom:40px; color:${C.ink}; }

      /* Cards */
      .tw-card {
        background:${C.white}; border:1px solid ${C.border};
        border-radius:4px; overflow:hidden;
        box-shadow:2px 2px 0 ${C.border};
        transition:transform .2s, box-shadow .2s;
      }
      .tw-card:hover { transform:translate(-2px,-2px); box-shadow:4px 4px 0 ${C.border}; }

      /* Grids */
      .tw-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:start; }
      @media (min-width:768px) { .tw-about-grid { grid-template-columns:1fr 1.6fr; } }

      .tw-proj-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:640px)  { .tw-proj-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .tw-proj-grid { grid-template-columns:repeat(3,1fr); } }

      .tw-skills-grid { display:grid; grid-template-columns:1fr; gap:10px; }
      @media (min-width:640px) { .tw-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .tw-testi-grid { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:768px)  { .tw-testi-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1100px) { .tw-testi-grid { grid-template-columns:repeat(3,1fr); } }

      .tw-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; }
      @media (min-width:768px) { .tw-contact-grid { grid-template-columns:1fr 1fr; } }

      .tw-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:420px; }

      /* Skill bar — typewriter line fill */
      .tw-skill-track { background:${C.border}; height:3px; border-radius:0; }
      .tw-skill-fill { height:100%; background:${C.ribbon}; transition:width 1.4s steps(30,end); }

      /* Button */
      .tw-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:10px 22px; border-radius:2px;
        font-size:12px; letter-spacing:2px; text-transform:uppercase;
        cursor:pointer; transition:all .15s; text-decoration:none; border:2px solid;
        font-family:'Courier Prime',monospace;
      }
      .tw-btn-primary { border-color:${C.ribbon}; background:${C.ribbon}; color:${C.white}; }
      .tw-btn-primary:hover { background:${C.ribbonL}; border-color:${C.ribbonL}; transform:translate(-1px,-1px); box-shadow:3px 3px 0 ${C.mid}; }
      .tw-btn-outline { border-color:${C.border}; background:transparent; color:${C.mid}; }
      .tw-btn-outline:hover { border-color:${C.ribbon}; color:${C.ribbon}; }

      /* Tag */
      .tw-tag { display:inline-block; padding:2px 8px; border-radius:0; border:1px solid ${C.border}; font-size:10px; color:${C.muted}; font-family:'Courier Prime',monospace; letter-spacing:1px; }

      /* Input */
      .tw-input {
        width:100%; padding:10px 14px; background:${C.white};
        border:1px solid ${C.border}; border-bottom:2px solid ${C.ribbon}; border-radius:0;
        color:${C.dark}; font-family:'Courier Prime',monospace; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .tw-input:focus { border-bottom-color:${C.ink}; }
      .tw-input::placeholder { color:${C.muted}; }

      /* Timeline */
      .tw-timeline { position:relative; padding-left:24px; }
      .tw-timeline::before { content:''; position:absolute; left:0; top:0; bottom:0; width:1px; background:repeating-linear-gradient(180deg,${C.border} 0,${C.border} 6px,transparent 6px,transparent 12px); }
      .tw-timeline-dash { position:absolute; left:-4px; top:20px; width:8px; height:1px; background:${C.ribbon}; }
      .tw-timeline-item { position:relative; margin-bottom:28px; }
      .tw-timeline-item:last-child { margin-bottom:0; }

      /* Social */
      .tw-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:40px; height:40px; border:1px solid ${C.border}; border-radius:2px;
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .tw-social:hover { border-color:${C.ribbon}; color:${C.ribbon}; }

      /* Horizontal rule */
      .tw-hr {
        border:none; height:0; border-top:1px solid ${C.border};
        margin:0; position:relative;
      }
      .tw-hr::before {
        content:attr(data-sym);
        position:absolute; left:50%; transform:translateX(-50%);
        top:-9px; background:${C.paper}; padding:0 12px;
        font-size:12px; color:${C.border}; font-family:'Courier Prime',monospace;
      }

      /* Project image */
      .tw-proj-img { width:100%; height:190px; object-fit:cover; display:block; filter:sepia(20%) saturate(.8); }

      /* Keyframes */
      @keyframes tw-blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      @keyframes tw-paper-load { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      @media (prefers-reduced-motion:reduce) { .tw-cursor,.tw-cursor-wide { animation:none !important; } }
    `}</style>
  );
}

/* Core typewriter hook */
function useTypewriter(text, speed = 35, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed(""); setDone(false); setStarted(false);
    const delayTimer = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(timer); setDone(true); }
      }, speed);
      return () => clearInterval(timer);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, done, started };
}

/* Typewriter that triggers on viewport entry */
function ViewportTypewriter({ text, speed = 28, style = {}, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setDisplayed(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
      {!done && <span className="tw-cursor" />}
    </span>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function SkillBar({ name, level, category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="tw-card" style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13 }}>{name}</span>
        <span style={{ fontSize: 12, color: C.ribbon }}>[{level}%]</span>
      </div>
      <div className="tw-skill-track">
        <div className="tw-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 6 }}><span className="tw-tag">{category}</span></div>
    </div>
  );
}

export default function TypewriterEffect() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = data.socials?.email || data.personal?.email || "";
  const resumeUrl = data.personal?.resumeUrl || "#contact";
  const sections = ["About", "Skills", "Projects", "Experience", "Testimonials", "Contact"];

  // Hero typewriter sequence
  const name = useTypewriter(data.personal.name, 60, 400);
  const title = useTypewriter(data.personal.title, 40, name.done ? 200 : 99999);
  const bio = useTypewriter(data.personal.bio.slice(0, 120) + "...", 20, title.done ? 300 : 99999);

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
    <div className="tw-root">
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav className="tw-nav">
        <button className="tw-nav-link tw-display" onClick={() => scrollTo("hero")} style={{ color: C.ribbon, fontSize: 13, letterSpacing: 3 }}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div className="tw-nav-desktop">
          {sections.map((s) => (
            <button key={s} className="tw-nav-link" onClick={() => scrollTo(s.toLowerCase())}>{s}</button>
          ))}
        </div>
        <button className="tw-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {["---", "---", "---"].map((_, i) => (
            <div key={i} style={{ width: 20, height: 2, background: i === 1 ? C.ribbon : C.mid, margin: "4px 0", transition: "all .2s",
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(3px,5px)" : i === 2 ? "rotate(-45deg) translate(3px,-5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="tw-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {sections.map((s) => (
              <button key={s} className="tw-nav-link" onClick={() => scrollTo(s.toLowerCase())} style={{ textAlign: "left", padding: "8px 0" }}>
                <span style={{ color: C.ribbon, marginRight: 6 }}>{">"}</span>{s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 56, position: "relative" }}>
        {/* Paper lines decoration */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${C.border} 31px, ${C.border} 32px)`, backgroundPosition: "0 56px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 1, background: C.ribbonL, opacity: 0.15, pointerEvents: "none" }} />

        <div className="tw-max" style={{ padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 16, fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase" }}>
            &gt; begin_portfolio.txt
          </div>
          <h1 className="tw-display" style={{ fontSize: "clamp(2.5rem,8vw,5.5rem)", fontWeight: 400, lineHeight: 1, marginBottom: 12, color: C.ink }}>
            {name.displayed}
            {!name.done && <span className="tw-cursor" />}
          </h1>
          <div style={{ fontSize: "clamp(.9rem,2.5vw,1.3rem)", color: C.ribbon, marginBottom: 20, letterSpacing: 2 }}>
            {title.displayed}
            {name.done && !title.done && <span className="tw-cursor" />}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.75, color: C.mid, maxWidth: 520, marginBottom: 36, minHeight: "3.5em" }}>
            {bio.displayed}
            {title.done && !bio.done && <span className="tw-cursor" />}
          </div>
          <AnimatePresence>
            {bio.done && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 48 }}>
                <button className="tw-btn tw-btn-primary" onClick={() => scrollTo("projects")}>&gt; view_work</button>
                <button className="tw-btn tw-btn-outline" onClick={() => scrollTo("contact")}>&gt; contact</button>
              </motion.div>
            )}
          </AnimatePresence>
          {bio.done && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="tw-stats">
                {[
                  { val: `${data.stats.yearsExperience}+`, label: "years" },
                  { val: `${data.stats.projectsCompleted}+`, label: "projects" },
                  { val: `${data.stats.happyClients}+`, label: "clients" },
                ].map(({ val, label }, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <div className="tw-display" style={{ fontSize: "clamp(1.4rem,4vw,2rem)", color: C.ribbon }}>{val}</div>
                    <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <button onClick={() => scrollTo("about")} style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, letterSpacing: 2, fontFamily: "'Courier Prime',monospace" }}>
          <motion.div animate={{ y: [0,5,0] }} transition={{ duration: 2, repeat: Infinity }}>
            &darr; scroll_down
          </motion.div>
        </button>
      </section>

      <hr className="tw-hr" data-sym="* * *" />

      {/* ── ABOUT ── */}
      <section id="about" className="tw-sec tw-alt">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// about</div>
            <h2 className="tw-h2">
              <ViewportTypewriter text="About Me" speed={60} />
            </h2>
          </FadeIn>
          <div className="tw-about-grid">
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: 180, height: 180, borderRadius: 0, objectFit: "cover", border: `2px solid ${C.border}`, filter: "sepia(15%) saturate(.85)", marginBottom: 16 }} />
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {data.socials.github   && <a href={data.socials.github}   className="tw-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
                  {data.socials.linkedin && <a href={data.socials.linkedin} className="tw-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
                  {data.socials.twitter  && <a href={data.socials.twitter}  className="tw-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
                  {email                 && <a href={`mailto:${email}`}     className="tw-social"><Mail     size={16} /></a>}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.mid, marginBottom: 24 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "14px 18px", borderLeft: `3px solid ${C.ribbon}`, background: `rgba(139,37,0,.04)`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, fontStyle: "italic", color: C.ribbon }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="tw-btn tw-btn-primary"><span>&gt; download_cv</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="tw-hr" data-sym="- - -" />

      {/* ── SKILLS ── */}
      <section id="skills" className="tw-sec">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// skills</div>
            <h2 className="tw-h2"><ViewportTypewriter text="Skills & Tools" speed={50} /></h2>
          </FadeIn>
          <div className="tw-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="tw-hr" data-sym="* * *" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="tw-sec tw-alt">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// projects</div>
            <h2 className="tw-h2"><ViewportTypewriter text="Projects" speed={80} /></h2>
          </FadeIn>
          <div className="tw-proj-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="tw-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} className="tw-proj-img" />
                  <div style={{ position: "absolute", top: 8, left: 8, background: C.ribbon, color: C.white, fontSize: 9, padding: "2px 8px", letterSpacing: 1 }}>{i < 9 ? `0${i+1}` : i+1}</div>
                </div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <h3 className="tw-display" style={{ fontSize: 16, marginBottom: 6, color: C.ink }}>{proj.title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: C.mid, marginBottom: 12 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                    {proj.techStack.map((t, j) => <span key={j} className="tw-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="tw-btn tw-btn-primary"  style={{ fontSize: 10, padding: "6px 12px" }}><ExternalLink size={10} /><span>live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="tw-btn tw-btn-outline" style={{ fontSize: 10, padding: "6px 12px" }}><Github       size={10} /><span>code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="tw-hr" data-sym="- - -" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="tw-sec">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// experience</div>
            <h2 className="tw-h2"><ViewportTypewriter text="Work History" speed={55} /></h2>
          </FadeIn>
          <div style={{ maxWidth: 720 }}>
            <div className="tw-timeline">
              {data.experience.map((exp, i) => (
                <motion.div key={i} className="tw-timeline-item" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="tw-timeline-dash" />
                  <div className="tw-card" style={{ padding: "18px 22px" }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: C.ribbon, marginBottom: 6, textTransform: "uppercase" }}>{exp.period}</div>
                    <h3 className="tw-display" style={{ fontSize: 17, marginBottom: 4, color: C.ink }}>{exp.role}</h3>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{exp.company}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, color: C.mid }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="tw-hr" data-sym="* * *" />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="tw-sec tw-alt">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// testimonials</div>
            <h2 className="tw-h2"><ViewportTypewriter text="What They Said" speed={50} /></h2>
          </FadeIn>
          <div className="tw-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="tw-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: "22px 24px" }}>
                <div style={{ fontSize: 32, color: C.ribbon, opacity: 0.15, lineHeight: 1, marginBottom: -4 }}>&#8220;</div>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: C.mid, marginBottom: 18, fontStyle: "italic" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: 0, objectFit: "cover", border: `1px solid ${C.border}`, filter: "sepia(20%)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="tw-hr" data-sym="- - -" />

      {/* ── CONTACT ── */}
      <section id="contact" className="tw-sec">
        <div className="tw-max">
          <FadeIn>
            <div className="tw-sec-label">// contact</div>
            <h2 className="tw-h2"><ViewportTypewriter text="Send a Letter" speed={55} /></h2>
          </FadeIn>
          <div className="tw-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.mid, marginBottom: 24 }}>
                Like a letter typed and sealed, reach out and I'll reply before the ink dries.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 40, height: 40, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}><Mail size={16} color={C.ribbon} /></div>
                  {email}</a>}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 40, height: 40, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}><Github size={16} /></div>GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 40, height: 40, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}><Linkedin size={16} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="tw-input" placeholder="Your Name_" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="tw-input" type="email" placeholder="Your Email_" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="tw-input" placeholder="Your Message_" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "14px", background: `rgba(139,37,0,.06)`, border: `1px solid ${C.ribbon}`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, color: C.ribbon, letterSpacing: 2 }}>✓ MESSAGE_SENT.txt</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="tw-btn tw-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
                      <span>{contactState === "sending" ? "> sending..." : "> send_message"}</span>
                    </button>
                  )}
                </AnimatePresence>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "24px 48px", borderTop: `2px solid ${C.border}`, background: C.parchment, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 11, color: C.muted, letterSpacing: 2 }}>
          © {new Date().getFullYear()} {data.personal.name} — EOF
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {data.socials.github   && <a href={data.socials.github}   className="tw-social" target="_blank" rel="noreferrer"><Github   size={15} /></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="tw-social" target="_blank" rel="noreferrer"><Linkedin size={15} /></a>}
          {data.socials.twitter  && <a href={data.socials.twitter}  className="tw-social" target="_blank" rel="noreferrer"><Twitter  size={15} /></a>}
        </div>
      </footer>
    </div>
  );
}
