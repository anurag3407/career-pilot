import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, useInView } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  Satellite, Compass, Zap, Database, Globe, Radio, MessageSquare
} from "lucide-react";
import React, { useState, useRef, useContext } from "react";
import { PortfolioContext } from "../../../../context/PortfolioContext";

const C = {
  bg:     "#0A0E27",
  mid:    "#0F1535",
  card:   "#141E3F",
  text:   "#E0F2FE",
  muted:  "rgba(224,242,254,.5)",
  accent: "#00D9FF",
  border: "rgba(0,217,255,.1)",
  dockBg: "rgba(10,15,45,.85)",
};

const DOCK_ICONS = [
  { id: "hero",      label: "Feed",       Icon: Satellite,      color: "#00D9FF" },
  { id: "about",     label: "Technology", Icon: Compass,        color: "#0EA5E9" },
  { id: "projects",  label: "Projects",   Icon: Database,       color: "#06B6D4" },
  { id: "analytics", label: "Analytics",  Icon: Zap,            color: "#00D9FF" },
  { id: "coverage",  label: "Coverage",   Icon: Globe,          color: "#0EA5E9" },
  { id: "status",    label: "Status",     Icon: Radio,          color: "#06B6D4" },
  { id: "contact",   label: "Contact",    Icon: MessageSquare,  color: "#00D9FF" },
];

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

      .sat-root { background:linear-gradient(135deg,${C.bg} 0%,#0D1638 100%); color:${C.text}; font-family:'Inter',sans-serif; overflow-x:hidden; padding-bottom:120px; }

      .sat-sec { padding:80px 48px; position:relative; }
      @media (max-width:768px) { .sat-sec { padding:64px 24px; } }
      .sat-max { max-width:1100px; margin:0 auto; }

      .sat-label { font-size:11px; font-weight:600; letter-spacing:4px; text-transform:uppercase; color:${C.accent}; margin-bottom:12px; text-shadow:0 0 20px rgba(0,217,255,.3); }
      .sat-h2 { font-size:clamp(2rem,5vw,3.5rem); font-weight:800; line-height:1.1; margin-bottom:40px; }

      .sat-card {
        background:linear-gradient(135deg,rgba(20,30,63,.4),rgba(14,165,233,.05));
        border:1px solid ${C.border}; border-radius:12px; overflow:hidden;
        transition:border-color .25s, transform .25s, box-shadow .25s;
        backdrop-filter:blur(10px);
      }
      .sat-card:hover {
        border-color:rgba(0,217,255,.35);
        transform:translateY(-3px);
        box-shadow:0 16px 40px rgba(0,217,255,.15);
      }

      .sat-grid-1 { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
      @media (min-width:768px) { .sat-grid-1 { grid-template-columns:1fr 1.6fr; } }

      .sat-grid-3 { display:grid; grid-template-columns:1fr; gap:20px; }
      @media (min-width:640px)  { .sat-grid-3 { grid-template-columns:repeat(2,1fr); } }
      @media (min-width:1024px) { .sat-grid-3 { grid-template-columns:repeat(3,1fr); } }

      .sat-grid-2 { display:grid; grid-template-columns:1fr; gap:10px; }
      @media (min-width:640px) { .sat-grid-2 { grid-template-columns:repeat(2,1fr); } }

      .sat-stat-bar { background:rgba(0,217,255,.08); border-radius:99px; height:4px; }
      .sat-stat-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,${C.accent},#0EA5E9); transition:width 1.2s cubic-bezier(.4,0,.2,1); }

      .sat-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:12px 24px; border-radius:99px;
        font-size:12px; font-weight:600; letter-spacing:1px;
        cursor:pointer; transition:all .2s; text-decoration:none; border:none; font-family:'Inter',sans-serif;
      }
      .sat-btn-primary { background:linear-gradient(135deg,${C.accent},#0EA5E9); color:#000; font-weight:700; }
      .sat-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,217,255,.4); }
      .sat-btn-ghost { background:transparent; color:${C.text}; border:1px solid ${C.border}; }
      .sat-btn-ghost:hover { border-color:${C.accent}; color:${C.accent}; }

      .sat-tag { display:inline-block; padding:3px 10px; border-radius:99px; font-size:10px; font-weight:600; background:rgba(0,217,255,.1); color:${C.accent}; border:1px solid rgba(0,217,255,.2); }

      .sat-input {
        width:100%; padding:13px 18px; background:rgba(20,30,63,.3);
        border:1px solid ${C.border}; border-radius:10px;
        color:${C.text}; font-family:'Inter',sans-serif; font-size:14px; outline:none;
        transition:border-color .2s; box-sizing:border-box; backdrop-filter:blur(10px);
      }
      .sat-input:focus { border-color:${C.accent}; box-shadow:0 0 16px rgba(0,217,255,.2); }
      .sat-input::placeholder { color:${C.muted}; }

      .sat-divider { border:none; height:1px; background:linear-gradient(90deg,transparent,rgba(0,217,255,.1) 20%,rgba(0,217,255,.1) 80%,transparent); }

      .sat-social {
        display:inline-flex; align-items:center; justify-content:center;
        width:44px; height:44px; border-radius:10px; border:1px solid ${C.border};
        color:${C.muted}; text-decoration:none; transition:all .2s;
      }
      .sat-social:hover { border-color:${C.accent}; color:${C.accent}; background:rgba(0,217,255,.08); }

      .sat-avatar { width:240px; height:240px; border-radius:16px; overflow:hidden; margin:0 auto; padding:2px; background:linear-gradient(135deg,${C.accent},#0EA5E9); }

      .sat-pulse { animation:sat-pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
      @keyframes sat-pulse {
        0%, 100% { box-shadow:0 0 0 0 rgba(0,217,255,.7); }
        50% { box-shadow:0 0 0 10px rgba(0,217,255,0); }
      }

      @media (prefers-reduced-motion:reduce) { * { transition-duration:.01ms !important; animation:none !important; } }
    `}</style>
  );
}

function DockItem({ icon: { id, label, Icon, color }, mouseX, onClick, isActive }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return Math.abs(val - (bounds.left + bounds.width / 2));
  });

  const scaleVal = useTransform(distance, [0, 80, 160], [1.9, 1.4, 1]);
  const yVal     = useTransform(distance, [0, 80, 160], [-28, -14, 0]);

  const scale = useSpring(scaleVal, { stiffness: 400, damping: 25 });
  const y     = useSpring(yVal,     { stiffness: 400, damping: 25 });

  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute", bottom: "calc(100% + 8px)",
              background: "rgba(10,10,25,.95)", color: C.accent,
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              fontWeight: 600, letterSpacing: 1, whiteSpace: "nowrap",
              pointerEvents: "none", border: `1px solid ${C.border}`,
              boxShadow: `0 0 12px rgba(0,217,255,.2)`,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ scale, y }}
        onClick={() => onClick(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: isActive ? `${color}20` : `${color}10`,
          border: `1px solid ${color}${isActive ? "60" : "30"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all .2s",
          boxShadow: isActive ? `0 0 16px ${color}60` : "none",
        }}>
          <Icon size={20} color={isActive ? color : color} opacity={isActive ? 1 : 0.6} />
        </div>
      </motion.button>
    </div>
  );
}

function SatelliteDockBar({ activeSection, onNavigate }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 50,
      }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        style={{
          background: C.dockBg,
          backdropFilter: "blur(20px)",
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "12px 16px",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          boxShadow: `0 24px 64px rgba(0,217,255,.1), 0 0 0 1px ${C.border}`,
        }}
      >
        {DOCK_ICONS.map((item) => (
          <DockItem
            key={item.id}
            icon={item}
            mouseX={mouseX}
            onClick={onNavigate}
            isActive={activeSection === item.id}
          />
        ))}
      </motion.div>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "", style = {} }) {
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

function DataMetric({ label, value, unit }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="sat-card" style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{inView ? value : 0}{unit}</span>
      </div>
      <div className="sat-stat-bar">
        <div className="sat-stat-fill" style={{ width: inView ? `${Math.min(value, 100)}%` : "0%" }} />
      </div>
    </div>
  );
}
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return "#";
  const allowed = ['http:', 'https:', 'mailto:', 'tel:'];
  try {
    const parsed = new URL(url, window.location.origin);
    return allowed.includes(parsed.protocol) ? url : "#";
  } catch {
    return "#";
  }
};

export default function LiveSatelliteImageryFeed() {
  const [activeSection, setActiveSection] = useState("hero");
  const [contactState, setContactState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = data.socials?.email || data.personal?.email || "";
  const resumeUrl = data.personal?.resumeUrl || "#contact";

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };
  const timerRef = useRef(null);
  const handleSubmit = (e) => {
  e.preventDefault();
  setContactState("sending");
  
  timerRef.current = setTimeout(() => {
    setContactState("done");
  }, 1500);
};
  useEffect(() => {
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, []);

  return (
    <div className="sat-root">
      <GlobalStyles />
      <SatelliteDockBar activeSection={activeSection} onNavigate={scrollTo} />

      {/* ── HERO ── */}
      <section id="hero" className="sat-sec" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="sat-max">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ marginBottom: 24 }}>
            <div className="sat-pulse" style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#00D9FF,#0EA5E9)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Satellite size={40} color="#000" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "clamp(2.5rem,9vw,6rem)", fontWeight: 800, lineHeight: 1, marginBottom: 12, letterSpacing: -2, background: "linear-gradient(135deg,#00D9FF,#0EA5E9)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Live Satellite Feed
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", color: C.accent, fontWeight: 500, marginBottom: 20, letterSpacing: 2, textTransform: "uppercase" }}>
            Real-time Earth Observation
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, maxWidth: 520, margin: "0 auto 40px" }}>
            Explore live satellite imagery data, track orbital coverage, and access real-time Earth observation analytics.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 48 }}>
            <button className="sat-btn sat-btn-primary" onClick={() => scrollTo("projects")}>View Data</button>
            <button className="sat-btn sat-btn-ghost" onClick={() => scrollTo("contact")}>Contact</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: 480, margin: "0 auto", gap: 0 }}>
              {[
                { val: "24/7", label: "Monitoring" },
                { val: "99.9%", label: "Uptime" },
                { val: "15TB+", label: "Data" },
              ].map(({ val, label }, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800, color: C.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── ABOUT ── */}
      <section id="about" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Technology</div>
            <h2 className="sat-h2">About Satellite Imagery</h2>
          </FadeIn>
          <div className="sat-grid-1">
            <FadeIn>
              <div className="sat-avatar" style={{ background: "linear-gradient(135deg,#00D9FF,#0EA5E9)" }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,rgba(0,217,255,.2),rgba(14,165,233,.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Satellite size={80} color={C.accent} opacity={0.8} />
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: C.muted, marginBottom: 28 }}>
                Advanced Earth observation through high-resolution satellite imagery. Access real-time data feeds covering critical infrastructure monitoring, environmental tracking, and geospatial analysis.
              </p>
              <div className="sat-card" style={{ padding: "16px 20px", marginBottom: 28, borderLeft: `3px solid ${C.accent}` }}>
                <p style={{ fontSize: 16, fontStyle: "italic", color: C.accent }}>
                  "See the Earth like never before with sub-meter resolution imagery."
                </p>
              </div>
              <button className="sat-btn sat-btn-primary">Learn More</button>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── ANALYTICS ── */}
      <section id="analytics" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Metrics</div>
            <h2 className="sat-h2">System Analytics</h2>
          </FadeIn>
          <div className="sat-grid-2">
            {[
              { label: "Coverage", value: 95, unit: "%" },
              { label: "Resolution", value: 85, unit: "%" },
              { label: "Latency", value: 72, unit: "%" },
              { label: "Availability", value: 99, unit: "%" },
            ].map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <DataMetric {...metric} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Projects</div>
            <h2 className="sat-h2">Featured Imagery</h2>
          </FadeIn>
          <div className="sat-grid-3">
            {(data.projects || []).slice(0, 3).map((proj, i) => (
              <motion.div key={i} className="sat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ position: "relative", overflow: "hidden", height: 200, background: `linear-gradient(135deg,rgba(0,217,255,.1),rgba(14,165,233,.05))` }}>
                  {proj.image && <img src={proj.image} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,transparent 40%,${C.bg}EE 100%)` }} />
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{proj.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, marginBottom: 14 }}>{proj.description}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {proj.liveUrl   && <a href={proj.liveUrl}   target="_blank" rel="noreferrer" className="sat-btn sat-btn-primary" style={{ fontSize: 10, padding: "7px 14px" }}><ExternalLink size={11} /><span>View</span></a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="sat-btn sat-btn-ghost"   style={{ fontSize: 10, padding: "7px 14px" }}><Github       size={11} /><span>Code</span></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── COVERAGE ── */}
      <section id="coverage" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Coverage</div>
            <h2 className="sat-h2">Global Satellite Network</h2>
          </FadeIn>
          <motion.div className="sat-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: "40px 32px", textAlign: "center" }}>
            <Globe size={64} color={C.accent} style={{ margin: "0 auto 20px", opacity: 0.8 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Worldwide Coverage</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, maxWidth: 500, margin: "0 auto" }}>
              Real-time monitoring across all continents with multiple satellite constellations providing redundant coverage for critical mission operations.
            </p>
          </motion.div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── STATUS ── */}
      <section id="status" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Status</div>
            <h2 className="sat-h2">System Status</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 600 }}>
            {[
              { label: "North America", status: "Operational" },
              { label: "Europe", status: "Operational" },
              { label: "Asia-Pacific", status: "Operational" },
              { label: "South America", status: "Operational" },
            ].map((region, i) => (
              <motion.div key={i} className="sat-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 500 }}>{region.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
                  <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{region.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="sat-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="sat-sec">
        <div className="sat-max">
          <FadeIn>
            <div className="sat-label">Contact</div>
            <h2 className="sat-h2">Get In Touch</h2>
          </FadeIn>
          <div className="sat-grid-1">
            <FadeIn>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, marginBottom: 28 }}>
                For data access, API integration, or partnership inquiries, reach out to our team.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {email && <a href={`mailto:${email}`} style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,217,255,.1)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={18} color={C.accent} /></div>
                  {email}</a>}
                {data.socials?.github && <a href={data.socials.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,217,255,.05)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Github size={18} /></div>GitHub</a>}
                {data.socials?.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, color: C.text, textDecoration: "none", fontSize: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,217,255,.05)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Linkedin size={18} /></div>LinkedIn</a>}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="sat-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="sat-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="sat-input" placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                <AnimatePresence mode="wait">
                  {contactState === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: "14px", borderRadius: 10, background: "rgba(0,217,255,.08)", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>✓ Message Sent!</span>
                    </motion.div>
                  ) : (
                    <button type="submit" className="sat-btn sat-btn-primary" disabled={contactState === "sending"} style={{ justifyContent: "center" }}>
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
