import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, FolderOpen, Code2, Briefcase, MessageSquare, Mail,
  Github, Linkedin, Twitter, ExternalLink, X, Minus, Maximize2,
  ChevronRight, Terminal, Wifi, Battery, Volume2, Search,
  Star, Clock, Settings, Globe, FileText, Award, MapPin,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── WebOS colour palette ─────────────────────────────── */
const C = {
  desktop:    "#1A1F2E",
  desktopAlt: "#141824",
  taskbar:    "rgba(12,14,22,0.92)",
  window:     "#1E2235",
  titlebar:   "#252A3D",
  sidebar:    "#1A1E2E",
  border:     "rgba(255,255,255,0.08)",
  accent:     "#4F8EF7",
  accentGlow: "rgba(79,142,247,0.25)",
  green:      "#4ADE80",
  orange:     "#FB923C",
  red:        "#F87171",
  yellow:     "#FACC15",
  text:       "#E8EAF6",
  muted:      "rgba(232,234,246,0.5)",
  dim:        "rgba(232,234,246,0.25)",
};

/* ─── WebOS-style wallpaper grid ───────────────────────── */
function Wallpaper() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Gradient base */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 20% 30%, rgba(79,142,247,0.12), transparent), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(124,92,252,0.1), transparent), ${C.desktop}` }} />
      {/* Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
        <defs>
          <pattern id="wgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={C.accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wgrid)" />
      </svg>
    </div>
  );
}

/* ─── Window traffic-light buttons ─────────────────────── */
function TrafficLights({ onClose, onMinimize, onMaximize }) {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
      {[
        { color: C.red,    Icon: X,        action: onClose },
        { color: C.yellow, Icon: Minus,     action: onMinimize },
        { color: C.green,  Icon: Maximize2, action: onMaximize },
      ].map(({ color, Icon, action }) => (
        <button key={color} onClick={action} style={{
          width: 13, height: 13, borderRadius: "50%",
          background: color, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0.9, padding: 0,
        }}>
          <Icon size={7} color="rgba(0,0,0,0.5)" style={{ opacity: 0 }}
            className="traffic-icon" />
        </button>
      ))}
    </div>
  );
}

/* ─── Draggable Window shell ────────────────────────────── */
function Window({ id, title, icon: Icon, children, initialPos, initialSize, zIndex, onFocus, onClose, minimized }) {
  const [pos, setPos] = useState(initialPos);
  const [size] = useState(initialSize);
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (maximized) return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus(id);
    e.preventDefault();
  }, [pos, maximized, id, onFocus]);

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  if (minimized) return null;

  const style = maximized
    ? { position: "absolute", inset: 0, top: 0, left: 0, width: "100%", height: "calc(100% - 40px)", borderRadius: 0 }
    : { position: "absolute", top: pos.y, left: pos.x, width: size.w, height: size.h };

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.88, opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onMouseDown={() => onFocus(id)}
      style={{
        ...style,
        zIndex,
        borderRadius: maximized ? 0 : 12,
        background: C.window,
        border: `1px solid ${C.border}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${C.border}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          height: 38, background: C.titlebar,
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center",
          padding: "0 12px", gap: 10,
          cursor: maximized ? "default" : "grab", userSelect: "none", flexShrink: 0,
        }}
      >
        <TrafficLights
          onClose={() => onClose(id)}
          onMinimize={() => onFocus(id, true)}
          onMaximize={() => setMaximized((m) => !m)}
        />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {Icon && <Icon size={13} color={C.muted} />}
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.02em" }}>{title}</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Dock icon ─────────────────────────────────────────── */
function DockIcon({ label, icon: Icon, color, active, onClick, badge }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}>
      {hover && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)",
          background: "rgba(0,0,0,0.8)", color: C.text,
          fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>{label}</div>
      )}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileHover={{ scale: 1.22, y: -6 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 46, height: 46, borderRadius: 12,
          background: color,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: active ? `0 0 0 2px ${C.accent}, 0 8px 20px rgba(0,0,0,0.4)` : "0 4px 16px rgba(0,0,0,0.35)",
        }}
      >
        <Icon size={22} color="#fff" />
        {badge && (
          <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
        )}
      </motion.button>
      {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent }} />}
    </div>
  );
}

/* ─── App windows content ───────────────────────────────── */
function AboutApp({ data }) {
  const { personal, socials, stats } = data;
  return (
    <div style={{ padding: 28, height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28 }}>
        <img src={personal.avatar} alt={personal.name} style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", flexShrink: 0, border: `2px solid ${C.border}` }} />
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", color: C.text }}>{personal.name}</h2>
          <p style={{ fontSize: 13, color: C.accent, fontWeight: 600, margin: "0 0 8px" }}>{personal.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
            <MapPin size={12} /> {personal.location}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 24 }}>{personal.bio}</p>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { val: `${stats.yearsExperience}+`, label: "Years" },
          { val: `${stats.projectsCompleted}+`, label: "Projects" },
          { val: `${stats.happyClients}+`, label: "Clients" },
        ].map(({ val, label }) => (
          <div key={label} style={{ background: C.desktopAlt, borderRadius: 10, padding: "14px 12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{val}</div>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      {/* Social links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { Icon: Github, href: socials.github, label: "GitHub" },
          { Icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
          { Icon: Twitter, href: socials.twitter, label: "Twitter" },
          { Icon: Mail, href: socials.email?.includes("@") ? `mailto:${socials.email}` : socials.email, label: "Email" },
        ].filter((l) => l.href).map(({ Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 14px",
            borderRadius: 8, background: C.desktopAlt, border: `1px solid ${C.border}`,
            color: C.muted, fontSize: 12, fontWeight: 600, textDecoration: "none",
            transition: "all .2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
          >
            <Icon size={14} />{label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectsApp({ data }) {
  const [active, setActive] = useState(0);
  const projects = data.projects;
  const p = projects[active] || {};
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: C.sidebar, borderRight: `1px solid ${C.border}`, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "12px 14px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim }}>All Projects</div>
        {projects.map((pr, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: "100%", textAlign: "left", padding: "10px 14px",
            background: active === i ? `${C.accent}18` : "transparent",
            border: "none", borderLeft: active === i ? `2px solid ${C.accent}` : "2px solid transparent",
            cursor: "pointer", color: active === i ? C.accent : C.muted,
            fontSize: 12, fontWeight: active === i ? 700 : 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <FolderOpen size={13} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pr.title}</span>
          </button>
        ))}
      </div>
      {/* Detail */}
      <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
        {p.image && <img src={p.image} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 16, border: `1px solid ${C.border}` }} />}
        <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 6px", color: C.text }}>{p.title}</h3>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>{p.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {p.techStack?.map((t) => (
            <span key={t} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: `${C.accent}18`, color: C.accent, border: `1px solid ${C.accent}30`, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: C.desktopAlt, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, textDecoration: "none" }}><Github size={13} />GitHub</a>}
          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: C.accent, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}><ExternalLink size={13} />Live Demo</a>}
        </div>
      </div>
    </div>
  );
}

function SkillsApp({ data }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];
  const [cat, setCat] = useState(categories[0]);
  const filtered = data.skills.filter((s) => s.category === cat);
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 160, background: C.sidebar, borderRight: `1px solid ${C.border}`, padding: "12px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim }}>Category</div>
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            width: "100%", textAlign: "left", padding: "9px 14px",
            background: cat === c ? `${C.accent}18` : "transparent",
            border: "none", borderLeft: cat === c ? `2px solid ${C.accent}` : "2px solid transparent",
            cursor: "pointer", color: cat === c ? C.accent : C.muted,
            fontSize: 12, fontWeight: cat === c ? 700 : 500,
          }}>{c}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: 22, overflowY: "auto" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>{cat}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((skill) => (
            <div key={skill.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                <span>{skill.name}</span>
                <span style={{ color: C.accent }}>{skill.level}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, #7C5CFC)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceApp({ data }) {
  const exp = data.experience || [];
  return (
    <div style={{ padding: 22, overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {exp.map((e, i) => (
          <div key={i} style={{ background: C.desktopAlt, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{e.role || e.title}</div>
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{e.company}</div>
              </div>
              <div style={{ fontSize: 11, color: C.dim, background: `${C.accent}12`, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap" }}>{e.duration || e.period}</div>
            </div>
            {e.description && <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0 }}>{e.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsApp({ data }) {
  const items = (data.testimonials || []).slice(0, 6);
  return (
    <div style={{ padding: 22, overflowY: "auto", height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {items.map((t, i) => (
          <div key={i} style={{ background: C.desktopAlt, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              {t.avatar
                ? <img src={t.avatar} alt={t.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                : <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.accent }}>{t.name?.[0]}</div>
              }
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: C.dim }}>{t.role}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>"{t.text || t.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactApp({ data }) {
  const { personal, socials } = data;
  const links = [
    { Icon: Mail, href: socials.email?.includes("@") ? `mailto:${socials.email}` : socials.email, label: "Email", sub: socials.email },
    { Icon: Github, href: socials.github, label: "GitHub", sub: "github.com" },
    { Icon: Linkedin, href: socials.linkedin, label: "LinkedIn", sub: "linkedin.com" },
    { Icon: Globe, href: socials.twitter, label: "Twitter", sub: "twitter.com" },
  ].filter((l) => l.href);
  return (
    <div style={{ padding: 28, overflowY: "auto", height: "100%" }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Get In Touch</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>
        Interested in working together? Reach out via any of the channels below.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map(({ Icon, href, label, sub }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
            borderRadius: 12, background: C.desktopAlt, border: `1px solid ${C.border}`,
            textDecoration: "none", transition: "all .2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = `${C.accent}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.desktopAlt; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={17} color={C.accent} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{label}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{sub}</div>
            </div>
            <ChevronRight size={14} color={C.dim} style={{ marginLeft: "auto" }} />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── App registry ──────────────────────────────────────── */
const APPS = [
  { id: "about",        title: "About Me",      icon: User,         color: "#4F8EF7", dockColor: "#1E4A8A", initialPos: { x: 60, y: 40 },  initialSize: { w: 480, h: 420 } },
  { id: "projects",     title: "Projects",      icon: FolderOpen,   color: "#FB923C", dockColor: "#7A3A0A", initialPos: { x: 160, y: 80 },  initialSize: { w: 600, h: 440 } },
  { id: "skills",       title: "Skills",        icon: Code2,        color: "#4ADE80", dockColor: "#0A5E25", initialPos: { x: 220, y: 60 },  initialSize: { w: 500, h: 400 } },
  { id: "experience",   title: "Experience",    icon: Briefcase,    color: "#A78BFA", dockColor: "#3B1F72", initialPos: { x: 100, y: 100 }, initialSize: { w: 480, h: 420 } },
  { id: "testimonials", title: "Testimonials",  icon: MessageSquare,color: "#F472B6", dockColor: "#6B1A3A", initialPos: { x: 180, y: 70 },  initialSize: { w: 560, h: 420 } },
  { id: "contact",      title: "Contact",       icon: Mail,         color: "#34D399", dockColor: "#0A4F3A", initialPos: { x: 240, y: 90 },  initialSize: { w: 400, h: 380 } },
];

function AppContent({ appId, data }) {
  switch (appId) {
    case "about":        return <AboutApp data={data} />;
    case "projects":     return <ProjectsApp data={data} />;
    case "skills":       return <SkillsApp data={data} />;
    case "experience":   return <ExperienceApp data={data} />;
    case "testimonials": return <TestimonialsApp data={data} />;
    case "contact":      return <ContactApp data={data} />;
    default:             return null;
  }
}

/* ─── Clock ─────────────────────────────────────────────── */
function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      <span style={{ marginLeft: 8, color: C.dim }}>
        {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </span>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export default function FakeWebOSOperatingSystem() {
  const { portfolioData } = usePortfolio();
  const { personal } = portfolioData;

  const [openWindows, setOpenWindows] = useState(["about"]);
  const [minimized, setMinimized] = useState([]);
  const [zOrder, setZOrder] = useState(["about"]);

  const openApp = useCallback((id) => {
    setMinimized((m) => m.filter((x) => x !== id));
    setOpenWindows((w) => w.includes(id) ? w : [...w, id]);
    setZOrder((z) => [...z.filter((x) => x !== id), id]);
  }, []);

  const focusWindow = useCallback((id, doMinimize = false) => {
    if (doMinimize) {
      setMinimized((m) => m.includes(id) ? m : [...m, id]);
    } else {
      setZOrder((z) => [...z.filter((x) => x !== id), id]);
    }
  }, []);

  const closeWindow = useCallback((id) => {
    setOpenWindows((w) => w.filter((x) => x !== id));
    setMinimized((m) => m.filter((x) => x !== id));
    setZOrder((z) => z.filter((x) => x !== id));
  }, []);

  const isOpen = (id) => openWindows.includes(id) && !minimized.includes(id);

  return (
    <div style={{ width: "100%", height: "100vh", minHeight: 600, position: "relative", overflow: "hidden", fontFamily: "'Inter', 'SF Pro Display', sans-serif", color: C.text, userSelect: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .wos-root * { box-sizing: border-box; }
        .wos-scroll::-webkit-scrollbar { width: 5px; }
        .wos-scroll::-webkit-scrollbar-track { background: transparent; }
        .wos-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <div className="wos-root" style={{ width: "100%", height: "100%", position: "relative" }}>
        <Wallpaper />

        {/* ── Top menu bar ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 28,
          background: C.taskbar, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center",
          padding: "0 14px", zIndex: 1000, gap: 20,
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: C.accent }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>WebOS</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{personal.name}'s Portfolio</span>
          {/* Right */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <Wifi size={12} color={C.muted} />
            <Battery size={12} color={C.muted} />
            <Volume2 size={12} color={C.muted} />
            <ClockWidget />
          </div>
        </div>

        {/* ── Desktop area ── */}
        <div style={{ position: "absolute", top: 28, left: 0, right: 0, bottom: 52 }}>

          {/* Desktop icons */}
          <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            {APPS.slice(0, 3).map((app) => (
              <motion.button
                key={app.id}
                onDoubleClick={() => openApp(app.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 68 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 13, background: app.dockColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
                  <app.icon size={24} color={app.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.text, textShadow: "0 1px 4px rgba(0,0,0,0.8)", textAlign: "center" }}>{app.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Windows */}
          <AnimatePresence>
            {openWindows.map((id) => {
              const app = APPS.find((a) => a.id === id);
              if (!app) return null;
              return (
                <Window
                  key={id}
                  id={id}
                  title={app.title}
                  icon={app.icon}
                  initialPos={app.initialPos}
                  initialSize={app.initialSize}
                  zIndex={100 + zOrder.indexOf(id)}
                  onFocus={focusWindow}
                  onClose={closeWindow}
                  minimized={minimized.includes(id)}
                >
                  <div className="wos-scroll" style={{ height: "100%", overflow: "auto" }}>
                    <AppContent appId={id} data={portfolioData} />
                  </div>
                </Window>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Dock ── */}
        <div style={{
          position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`,
          borderRadius: 20, padding: "8px 16px",
          display: "flex", alignItems: "flex-end", gap: 10,
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {APPS.map((app) => (
            <DockIcon
              key={app.id}
              label={app.title}
              icon={app.icon}
              color={app.dockColor}
              active={isOpen(app.id)}
              onClick={() => isOpen(app.id) ? focusWindow(app.id, true) : openApp(app.id)}
              badge={!openWindows.includes(app.id)}
            />
          ))}
          {/* Divider + settings */}
          <div style={{ width: 1, height: 38, background: C.border, margin: "0 4px" }} />
          <DockIcon label="Settings" icon={Settings} color="#2A2F42" active={false} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
