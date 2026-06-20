import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const C = {
  bg:     "#FAFAFA",
  bgAlt:  "#F4F4F5",
  dark:   "#18181B",
  mid:    "#52525B",
  muted:  "#A1A1AA",
  accent: "#2563EB",
  border: "#E4E4E7",
  white:  "#FFFFFF",
};

const SECTIONS = [
  { id: "hero",         label: "Hello" },
  { id: "about",        label: "About" },
  { id: "skills",       label: "Skills" },
  { id: "projects",     label: "Projects" },
  { id: "experience",   label: "Experience" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact",      label: "Contact" },
];

function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

      .ops-root { background:${C.bg}; color:${C.dark}; font-family:'Inter',sans-serif; overflow-x:hidden; }
      html { scroll-behavior:smooth; }

      /* Full-viewport sections */
      .ops-sec {
        min-height:100vh; display:flex; align-items:center; justify-content:center;
        padding:80px 48px; position:relative; box-sizing:border-box;
      }
      @media (max-width:768px) { .ops-sec { padding:72px 24px; } }
      .ops-alt { background:${C.bgAlt}; }
      .ops-max { max-width:1100px; width:100%; margin:0 auto; }

      /* Side dot nav */
      .ops-dot-nav {
        position:fixed; right:24px; top:50%; transform:translateY(-50%);
        z-index:50; display:flex; flex-direction:column; gap:12px; align-items:center;
      }
      @media (max-width:768px) { .ops-dot-nav { right:12px; gap:8px; } }

      .ops-dot {
        width:8px; height:8px; border-radius:50%; cursor:pointer;
        background:${C.muted}; transition:all .3s; position:relative; border:none; padding:0;
      }
      .ops-dot.active {
        background:${C.accent}; width:10px; height:10px;
        box-shadow:0 0 0 3px rgba(37,99,235,.2);
      }
      .ops-dot-tooltip {
        position:absolute; right:20px; top:50%; transform:translateY(-50%);
        background:${C.dark}; color:#fff; padding:4px 10px; border-radius:6px;
        font-size:11px; font-weight:500; letter-spacing:1px; white-space:nowrap;
        opacity:0; pointer-events:none; transition:opacity .2s;
      }
      .ops-dot:hover .ops-dot-tooltip { opacity:1; }
      .ops-dot:hover { background:${C.accent}; transform:scale(1.3); }

      /* Nav */
      .ops-nav {
        position:fixed; top:0; left:0; right:0; z-index:49;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 48px; height:60px;
        background:rgba(250,250,250,.9); backdrop-filter:blur(12px);
        border-bottom:1px solid ${C.border};
      }
      @media (max-width:768px) { .ops-nav { padding:0 20px; } }

      /* Grids */
      .ops-about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; width:100%; }
      @media (min-width:768px) { .ops-about-grid { grid-template-columns:auto 1fr; gap:64px; } }

      .ops-skills-grid { display:grid; grid-template-columns:1fr; gap:10px; width:100%; }
      @media (min-width:640px) { .ops-skills-grid { grid-template-columns:repeat(2,1fr); } }

      .ops-proj-grid { display:grid; grid-template-columns:1fr; gap:20px; width:100%; }
      @media (min-width:640px) { .ops-proj-grid { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .ops-proj-grid { grid-template-columns:repeat(3,1fr); } }

      .ops-testi-grid { display:grid; grid-template-columns:1fr; gap:20px; width:100%; }
      @media (min-width:768px) { .ops-testi-grid { grid-template-columns:repeat(2,1fr); } }

      .ops-contact-grid { display:grid; grid-template-columns:1fr; gap:48px; width:100%; }
      @media (min-width:768px) { .ops-contact-grid { grid-template-columns:1fr 1fr; } }

      .ops-stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:400px; }

      /* Card */
      .ops-card {
        background:${C.white}; border:1px solid ${C.border}; border-radius:12px;
        overflow:hidden; transition:transform .25s, box-shadow .25s;
      }
      .ops-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.08); }

      /* Skill bar */
      .ops-skill-track { background:${C.border}; border-radius:99px; height:3px; }
      .ops-skill-fill { height:100%; border-radius:99px; background:${C.accent}; transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      /* Button */
      .ops-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:12px 24px; border-radius:8px;
        font-size:13px; font-weight:600; letter-spacing:.5px;
        cursor:pointer; transition:all .2s; text-decoration:none; border:none; font-family:'Inter',sans-serif;
      }
      .ops-btn-primary { background:${C.accent}; color:#fff; }
      .ops-btn-primary:hover { background:#1D4ED8; transform:translateY(-1px); box-shadow:0 4px 16px rgba(37,99,235,.3); }
      .ops-btn-outline { background:transparent; color:${C.dark}; border:1px solid ${C.border}; }
      .ops-btn-outline:hover { border-color:${C.accent}; color:${C.accent}; }

      /* Tag */
      .ops-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:600; background:rgba(37,99,235,.08); color:${C.accent}; border:1px solid rgba(37,99,235,.15); }

      /* Input */
      .ops-input {
        width:100%; padding:12px 16px; background:${C.white};
        border:1px solid ${C.border}; border-radius:8px;
        color:${C.dark}; font-family:'Inter',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box;
      }
      .ops-input:focus { border-color:${C.accent}; box-shadow:0 0 0 3px rgba(37,99,235,.08); }
      .ops-input::placeholder { color:${C.muted}; }

      /* Section heading */
      .ops-sec-label { font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:${C.accent}; margin-bottom:12px; }
      .ops-sec-title { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:48px; }

      /* Timeline */
      .ops-exp-grid { display:grid; grid-template-columns:1fr; gap:16px; width:100%; }
      @media (min-width:640px) { .ops-exp-grid { grid-template-columns:repeat(2,1fr); } }

      /* Social */
      .ops-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:40px; height:40px; border-radius:8px; border:1px solid ${C.border};
        color:${C.mid}; text-decoration:none; transition:all .2s;
      }
      .ops-social:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(37,99,235,.06); }

      /* Project image */
      .ops-proj-img { width:100%; height:180px; object-fit:cover; display:block; }

      /* Keyframes */
      @media (prefers-reduced-motion:reduce) { * { animation:none !important; transition-duration:.01ms !important; } }
    `}</style>
  );
}

function useActiveSection() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const { portfolioData: data } = usePortfolio();

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
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="ops-card" style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{level}%</span>
      </div>
      <div className="ops-skill-track">
        <div className="ops-skill-fill" style={{ width: inView ? `${level}%` : "0%" }} />
      </div>
      <div style={{ marginTop: 6 }}><span className="ops-tag">{category}</span></div>
    </div>
  );
}

export default function OnePageScroll() {
  const { portfolioData: data } = usePortfolio();

  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = data.socials?.email || data.personal?.email || "";
  const resumeUrl = data.personal?.resumeUrl || "#contact";

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
    <div className="ops-root">
      <GlobalStyles />

      {/* Side dot navigation */}
      <div className="ops-dot-nav">
        {SECTIONS.map(({ id, label }) => (
          <button key={id} className={`ops-dot ${active === id ? "active" : ""}`} onClick={() => scrollTo(id)} title={label} aria-label={label}>
            <span className="ops-dot-tooltip">{label}</span>
          </button>
        ))}
      </div>

      {/* Top nav */}
      <nav className="ops-nav">
        <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: C.dark, fontFamily: "'Inter',sans-serif" }}>
          {data.personal.name.split(" ")[0]}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="ops-btn ops-btn-outline" onClick={() => scrollTo("contact")} style={{ fontSize: 12, padding: "8px 16px" }}>Say Hi</button>
          <a href={resumeUrl} className="ops-btn ops-btn-primary" style={{ fontSize: 12, padding: "8px 16px" }}>Resume</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="ops-sec">
        <div className="ops-max" style={{ textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Available for work</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 800, lineHeight: 1, marginBottom: 12, letterSpacing: -2, marginTop: 16 }}>
            {data.personal.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.mid, marginBottom: 20, fontWeight: 400 }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            style={{ fontSize: 16, lineHeight: 1.75, color: C.mid, maxWidth: 480, margin: "0 auto 36px" }}>
            {data.personal.bio}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            <button className="ops-btn ops-btn-primary" onClick={() => scrollTo("projects")}>View Projects</button>
            <button className="ops-btn ops-btn-outline" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
            <div className="ops-stats" style={{ margin: "0 auto" }}>
              {[
                { val: `${data.stats.yearsExperience}+`, label: "Years" },
                { val: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { val: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800, color: C.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <button onClick={() => scrollTo("about")} style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer" }}>
          <motion.div animate={{ y: [0,6,0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ChevronDown size={20} style={{ color: C.muted }} />
          </motion.div>
        </button>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="ops-sec ops-alt">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">About Me</div>
            <h2 className="ops-sec-title">Who I Am</h2>
          </FadeIn>
          <div className="ops-about-grid">
            <FadeIn>
              <div style={{ textAlign: "center" }}>
                <img src={data.personal.avatar} alt={data.personal.name} style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.accent}`, marginBottom: 16 }} />
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  {data.socials.github   && <a href={data.socials.github}   className="ops-social" target="_blank" rel="noreferrer"><Github   size={16} /></a>}
                  {data.socials.linkedin && <a href={data.socials.linkedin} className="ops-social" target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
                  {data.socials.twitter  && <a href={data.socials.twitter}  className="ops-social" target="_blank" rel="noreferrer"><Twitter  size={16} /></a>}
                  {email                 && <a href={`mailto:${email}`}     className="ops-social"><Mail     size={16} /></a>}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: C.mid, marginBottom: 24 }}>{data.personal.bio}</p>
              {data.personal.tagline && (
                <div style={{ padding: "14px 18px", borderRadius: 8, background: `rgba(37,99,235,.06)`, borderLeft: `3px solid ${C.accent}`, marginBottom: 24 }}>
                  <p style={{ fontSize: 15, fontStyle: "italic", color: C.accent }}>"{data.personal.tagline}"</p>
                </div>
              )}
              <a href={resumeUrl} className="ops-btn ops-btn-primary"><span>Download CV</span></a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="ops-sec">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">Skills</div>
            <h2 className="ops-sec-title">What I Do</h2>
          </FadeIn>
          <div className="ops-skills-grid">
            {data.skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <SkillBar {...skill} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="ops-sec ops-alt">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">Work</div>
            <h2 className="ops-sec-title">Projects</h2>
          </FadeIn>
          <div className="ops-proj-grid">
            {data.projects.map((proj, i) => (
              <motion.div key={i} className="ops-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <img src={proj.image} alt={proj.title} className="ops-proj-img" />
                <div style={{ padding: "16px 18px 20px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{proj.title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: C.mid, marginBottom: 12 }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                    {proj.techStack.slice(0, 4).map((t, j) => <span key={j} className="ops-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="ops-btn ops-btn-primary"  style={{ fontSize: 10, padding: "6px 12px" }}><ExternalLink size={10} /><span>Live</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="ops-btn ops-btn-outline" style={{ fontSize: 10, padding: "6px 12px" }}><Github       size={10} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="ops-sec">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">Career</div>
            <h2 className="ops-sec-title">Experience</h2>
          </FadeIn>
          <div className="ops-exp-grid">
            {data.experience.map((exp, i) => (
              <motion.div key={i} className="ops-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: C.accent, marginBottom: 6, textTransform: "uppercase" }}>{exp.period}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{exp.role}</h3>
                <div style={{ fontSize: 13, color: C.mid, fontWeight: 500, marginBottom: 12 }}>{exp.company}</div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.mid }}>{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="ops-sec ops-alt">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">Reviews</div>
            <h2 className="ops-sec-title">What People Say</h2>
          </FadeIn>
          <div className="ops-testi-grid">
            {data.testimonials.map((t, i) => (
              <motion.div key={i} className="ops-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: "24px" }}>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: C.mid, marginBottom: 20 }}>"{t.text}"</p>
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

      {/* ── CONTACT ── */}
      <section id="contact" className="ops-sec">
        <div className="ops-max">
          <FadeIn>
            <div className="ops-sec-label">Let's Talk</div>
            <h2 className="ops-sec-title">Get In Touch</h2>
          </FadeIn>
          <div className="ops-contact-grid">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.mid, marginBottom: 28 }}>
                I'm open to new projects and collaborations. Send me a message and I'll get back to you shortly.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `rgba(37,99,235,.08)`, border: `1px solid rgba(37,99,235,.15)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={16} color={C.accent} /></div>
                  {email}</a>}
                {data.socials.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={16} /></div>
                  GitHub</a>}
                {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.dark, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bgAlt, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={16} /></div>
                  LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="ops-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="ops-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="ops-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "14px", borderRadius: 8, background: "rgba(37,99,235,.06)", border: `1px solid rgba(37,99,235,.15)`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>✓ Message Sent!</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="ops-btn ops-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
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
