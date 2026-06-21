import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  ChevronDown, ZoomIn, X, Maximize2,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── Palette ───────────────────────────────────────────── */
const C = {
  bg:     "#03040A",
  glass:  "rgba(6,8,18,0.78)",
  border: "rgba(255,255,255,0.08)",
  accent: "#7C3FFF",
  cyan:   "#00E5FF",
  text:   "#F0F2FF",
  muted:  "rgba(240,242,255,0.55)",
  dim:    "rgba(240,242,255,0.25)",
};

/* ─── Mandelbrot canvas renderer ───────────────────────── */
function MandelbrotCanvas({ zoom, centerX, centerY, width, height, maxIter = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    const scale = 3.5 / zoom;

    for (let px = 0; px < W; px++) {
      for (let py = 0; py < H; py++) {
        const x0 = centerX + (px / W - 0.5) * scale * (W / H);
        const y0 = centerY + (py / H - 0.5) * scale;

        let x = 0, y = 0, iter = 0;
        while (x * x + y * y <= 4 && iter < maxIter) {
          const xT = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xT;
          iter++;
        }

        const idx = (py * W + px) * 4;
        if (iter === maxIter) {
          data[idx] = 3; data[idx + 1] = 3; data[idx + 2] = 12; data[idx + 3] = 255;
        } else {
          const t = iter / maxIter;
          const smooth = t + 1 - Math.log(Math.log(Math.sqrt(x * x + y * y))) / Math.log(2);
          const s = smooth / maxIter;
          // Purple → cyan → white gradient
          data[idx]     = Math.floor(9   * (1 - s) * s * s * s * 255);          // R
          data[idx + 1] = Math.floor(15  * (1 - s) * (1 - s) * s * s * 255);   // G
          data[idx + 2] = Math.floor(8.5 * (1 - s) * (1 - s) * (1 - s) * s * 255 + s * s * s * 200); // B
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [zoom, centerX, centerY, width, height, maxIter]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* ─── Section overlay panel ─────────────────────────────── */
function Panel({ children, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        background: C.glass,
        backdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: "32px 36px",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section label ──────────────────────────────────────── */
function Label({ children, color = C.cyan }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 22, height: 2, background: color, borderRadius: 2 }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color }}>
        {children}
      </span>
    </div>
  );
}

/* ─── Skill bar ──────────────────────────────────────────── */
function SkillBar({ name, level, delay = 0 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
        <span>{name}</span>
        <span style={{ color: C.cyan }}>{level}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }}
          viewport={{ once: true }}
          style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, ${C.cyan})` }}
        />
      </div>
    </div>
  );
}

/* ─── Zoom level → fractal coordinates map ──────────────── */
// Each "section" of the portfolio lives at a different zoom depth
const SECTIONS = [
  { id: "hero",         zoom: 1,     cx: -0.5,           cy: 0,            label: "Surface" },
  { id: "about",        zoom: 12,    cx: -0.7269,         cy: 0.1889,       label: "Depth 1" },
  { id: "skills",       zoom: 80,    cx: -0.16,           cy: 1.0405,       label: "Depth 2" },
  { id: "projects",     zoom: 500,   cx: -1.25066,        cy: 0.02012,      label: "Depth 3" },
  { id: "experience",   zoom: 3000,  cx: -0.7453,         cy: 0.1127,       label: "Depth 4" },
  { id: "testimonials", zoom: 18000, cx: -1.7687,         cy: 0.00423,      label: "Depth 5" },
  { id: "contact",      zoom: 90000, cx: -0.77568377,     cy: 0.13646737,   label: "Core" },
];

/* ─── Main template ──────────────────────────────────────── */
export default function InfiniteZoomMandelbrotSet() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  const [sectionIdx, setSectionIdx] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 1200, h: 700 });
  const [renderZoom, setRenderZoom] = useState(SECTIONS[0].zoom);
  const [renderCx, setRenderCx] = useState(SECTIONS[0].cx);
  const [renderCy, setRenderCy] = useState(SECTIONS[0].cy);
  const animRef = useRef(null);
  const containerRef = useRef(null);

  const section = SECTIONS[sectionIdx];

  /* Responsive canvas size */
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setCanvasSize({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* Animate zoom transition between sections */
  const animateTo = useCallback((targetZoom, targetCx, targetCy) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startTime = performance.now();
    const duration = 1400;
    const startZoom = renderZoom;
    const startCx = renderCx;
    const startCy = renderCy;

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out quad
      // zoom interpolates in log space
      const logZ = Math.log(startZoom) + (Math.log(targetZoom) - Math.log(startZoom)) * ease;
      setRenderZoom(Math.exp(logZ));
      setRenderCx(startCx + (targetCx - startCx) * ease);
      setRenderCy(startCy + (targetCy - startCy) * ease);
      if (t < 1) animRef.current = requestAnimationFrame(step);
    }
    animRef.current = requestAnimationFrame(step);
  }, [renderZoom, renderCx, renderCy]);

  const goTo = useCallback((idx) => {
    setSectionIdx(idx);
    const s = SECTIONS[idx];
    animateTo(s.zoom, s.cx, s.cy);
  }, [animateTo]);

  const next = () => goTo(Math.min(sectionIdx + 1, SECTIONS.length - 1));
  const prev = () => goTo(Math.max(sectionIdx - 1, 0));

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sectionIdx]);

  const contactLinks = [
    { Icon: Mail, href: socials.email?.includes("@") ? `mailto:${socials.email}` : socials.email, label: "Email" },
    { Icon: Github, href: socials.github, label: "GitHub" },
    { Icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { Icon: Twitter, href: socials.twitter, label: "Twitter" },
  ].filter((l) => l.href);

  const topSkills = skills.slice(0, 10);
  const featuredProjects = projects.slice(0, 6);
  const recentExp = (experience || []).slice(0, 4);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100vh", minHeight: 600,
        position: "relative", overflow: "hidden",
        background: C.bg, color: C.text,
        fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .mbs-root * { box-sizing: border-box; }
        .mbs-scroll::-webkit-scrollbar { width: 4px; }
        .mbs-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        .mbs-tag { font-size:11px; font-weight:600; padding:3px 9px; border-radius:99px; background:rgba(0,229,255,0.1); color:#00E5FF; border:1px solid rgba(0,229,255,0.25); display:inline-block; }
        .mbs-btn { display:inline-flex; align-items:center; gap:7px; padding:11px 22px; border-radius:99px; font-size:12px; font-weight:700; letter-spacing:0.05em; cursor:pointer; border:none; text-decoration:none; transition:opacity .2s, transform .15s; }
        .mbs-btn:hover { opacity:0.85; transform:translateY(-1px); }
      `}</style>

      <div className="mbs-root" style={{ width: "100%", height: "100%", position: "relative" }}>

        {/* ── Fractal background ── */}
        <div style={{ position: "absolute", inset: 0 }}>
          <MandelbrotCanvas
            zoom={renderZoom}
            centerX={renderCx}
            centerY={renderCy}
            width={canvasSize.w || 1200}
            height={canvasSize.h || 700}
          />
          {/* Dark vignette overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(3,4,10,0.65) 100%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Top HUD bar ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 44, display: "flex", alignItems: "center",
          padding: "0 20px", justifyContent: "space-between",
          background: "linear-gradient(to bottom, rgba(3,4,10,0.85), transparent)",
          zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ZoomIn size={15} color={C.cyan} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.cyan, letterSpacing: "0.15em" }}>
              MANDELBROT SET
            </span>
            <span style={{ fontSize: 10, color: C.dim, marginLeft: 8 }}>
              ×{renderZoom < 1000 ? renderZoom.toFixed(0) : renderZoom < 1e6 ? (renderZoom / 1000).toFixed(1) + "K" : (renderZoom / 1e6).toFixed(2) + "M"}
            </span>
          </div>

          {/* Depth progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  width: i === sectionIdx ? 24 : 7,
                  height: 7, borderRadius: 99,
                  background: i === sectionIdx ? C.cyan : i < sectionIdx ? `${C.accent}80` : "rgba(255,255,255,0.15)",
                  border: "none", cursor: "pointer",
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{section.label}</span>
        </div>

        {/* ── Content panels ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "60px 40px 80px",
          zIndex: 20,
        }}>
          <AnimatePresence mode="wait">

            {/* HERO */}
            {sectionIdx === 0 && (
              <Panel key="hero" style={{ maxWidth: 620, width: "100%", textAlign: "center" }}>
                <Label>Zoom to explore</Label>
                <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, letterSpacing: "-1.5px", margin: "0 0 10px", lineHeight: 1.05 }}>
                  {personal.name}
                </h1>
                <p style={{ fontSize: "clamp(0.95rem,2vw,1.25rem)", color: C.cyan, fontWeight: 600, marginBottom: 12 }}>
                  {personal.title}
                </p>
                <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14, marginBottom: 28 }}>
                  {personal.tagline}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 32 }}>
                  {[
                    { val: `${stats.yearsExperience}+`, label: "Years" },
                    { val: `${stats.projectsCompleted}+`, label: "Projects" },
                    { val: `${stats.happyClients}+`, label: "Clients" },
                  ].map(({ val, label }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: C.cyan, lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.25em", marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={next} className="mbs-btn" style={{ background: C.accent, color: "#fff" }}>
                  <ZoomIn size={14} /> Begin Zoom Journey
                </button>
              </Panel>
            )}

            {/* ABOUT */}
            {sectionIdx === 1 && (
              <Panel key="about" style={{ maxWidth: 580, width: "100%" }}>
                <Label>About</Label>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 18 }}>
                  <img
                    src={personal.avatar}
                    alt={personal.name || "Profile Avatar"}
                    style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", flexShrink: 0, border: `2px solid ${C.border}` }}
                  />
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>{personal.name}</h2>
                    <p style={{ fontSize: 13, color: C.cyan, fontWeight: 600, margin: 0 }}>{personal.title}</p>
                    <p style={{ fontSize: 12, color: C.dim, margin: "4px 0 0" }}>{personal.location}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.78, marginBottom: 20 }}>{personal.bio}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {contactLinks.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                    >
                      <Icon size={13} />{label}
                    </a>
                  ))}
                </div>
              </Panel>
            )}

            {/* SKILLS */}
            {sectionIdx === 2 && (
              <Panel key="skills" style={{ maxWidth: 560, width: "100%", maxHeight: "70vh", overflowY: "auto" }} className="mbs-scroll">
                <Label>Skills</Label>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Technical Expertise</h2>
                {topSkills.map((skill, i) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 0.05} />
                ))}
              </Panel>
            )}

            {/* PROJECTS */}
            {sectionIdx === 3 && (
              <Panel key="projects" style={{ maxWidth: 700, width: "100%", maxHeight: "72vh", overflowY: "auto" }} className="mbs-scroll">
                <Label>Projects</Label>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Featured Work</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {featuredProjects.map((p, i) => (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}
                    >
                      {p.image && (
                        <img src={p.image} alt={p.title || "Project Screenshot"} style={{ width: "100%", height: 90, objectFit: "cover" }} />
                      )}
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{p.title}</h3>
                          <div style={{ display: "flex", gap: 6 }}>
                            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.dim }}><Github size={12} /></a>}
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.dim }}><ExternalLink size={12} /></a>}
                          </div>
                        </div>
                        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: "0 0 8px" }}>{p.description?.slice(0, 75)}…</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {p.techStack?.slice(0, 3).map((t) => <span key={t} className="mbs-tag">{t}</span>)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Panel>
            )}

            {/* EXPERIENCE */}
            {sectionIdx === 4 && (
              <Panel key="experience" style={{ maxWidth: 580, width: "100%", maxHeight: "70vh", overflowY: "auto" }} className="mbs-scroll">
                <Label>Experience</Label>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Work History</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {recentExp.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{e.role || e.title}</div>
                          <div style={{ fontSize: 12, color: C.cyan, fontWeight: 600 }}>{e.company}</div>
                        </div>
                        <span style={{ fontSize: 10, color: C.dim, background: "rgba(255,255,255,0.05)", padding: "3px 9px", borderRadius: 6 }}>{e.duration || e.period}</span>
                      </div>
                      {e.description && <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0 }}>{e.description}</p>}
                    </motion.div>
                  ))}
                </div>
              </Panel>
            )}

            {/* TESTIMONIALS */}
            {sectionIdx === 5 && (
              <Panel key="testimonials" style={{ maxWidth: 660, width: "100%", maxHeight: "70vh", overflowY: "auto" }} className="mbs-scroll">
                <Label>Testimonials</Label>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>What People Say</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {(testimonials || []).slice(0, 4).map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                        {t.avatar
                          ? <img src={t.avatar} alt={t.name || "Profile Avatar"} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                          : <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.accent, fontSize: 14 }}>{t.name?.[0]}</div>
                        }
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: C.dim }}>{t.role}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>"{t.text || t.content}"</p>
                    </motion.div>
                  ))}
                </div>
              </Panel>
            )}

            {/* CONTACT */}
            {sectionIdx === 6 && (
              <Panel key="contact" style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
                <Label color={C.accent}>Contact</Label>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Let's Connect</h2>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
                  You've reached the core of the set — and my portfolio. Drop me a message.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {contactLinks.map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="mbs-btn"
                      style={{ background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}`, justifyContent: "center" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.background = `${C.cyan}10`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    >
                      <Icon size={15} /> {label}
                    </a>
                  ))}
                </div>
                <button onClick={() => goTo(0)} className="mbs-btn" style={{ background: "transparent", color: C.dim, border: `1px solid ${C.border}`, fontSize: 11 }}>
                  ↑ Back to Surface
                </button>
              </Panel>
            )}

          </AnimatePresence>
        </div>

        {/* ── Bottom nav ── */}
        <div style={{
          position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 14, zIndex: 40,
        }}>
          <button
            onClick={prev}
            disabled={sectionIdx === 0}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)", border: `1px solid ${C.border}`,
              color: sectionIdx === 0 ? C.dim : C.text,
              cursor: sectionIdx === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronDown size={16} style={{ transform: "rotate(180deg)" }} />
          </button>

          <div style={{
            background: C.glass, backdropFilter: "blur(12px)",
            border: `1px solid ${C.border}`, borderRadius: 99,
            padding: "6px 16px", fontSize: 11, fontWeight: 600, color: C.muted,
          }}>
            {sectionIdx + 1} / {SECTIONS.length} — {section.label}
          </div>

          <button
            onClick={next}
            disabled={sectionIdx === SECTIONS.length - 1}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: sectionIdx === SECTIONS.length - 1 ? "rgba(255,255,255,0.04)" : C.accent,
              border: "none", color: "#fff",
              cursor: sectionIdx === SECTIONS.length - 1 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: sectionIdx < SECTIONS.length - 1 ? `0 0 20px ${C.accent}60` : "none",
            }}
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* ── Keyboard hint ── */}
        {sectionIdx === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              position: "absolute", bottom: 72, left: "50%", transform: "translateX(-50%)",
              fontSize: 10, color: C.dim, letterSpacing: "0.2em", textTransform: "uppercase",
              pointerEvents: "none", zIndex: 30,
            }}
          >
            ↑ ↓ Arrow keys to navigate
          </motion.div>
        )}

      </div>
    </div>
  );
}
