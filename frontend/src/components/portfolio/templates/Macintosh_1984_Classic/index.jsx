import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, Globe, ExternalLink,
  MapPin,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const MAC = {
  desktop:      "#A8A8A8",
  windowBg:     "#FFFFFF",
  titleBar:     "#DFDFDF",
  titleBarActive: "#000000",
  border:       "#000000",
  text:         "#000000",
  textLight:    "#555555",
  selection:    "#000000",
  selectionText:"#FFFFFF",
  scrollbar:    "#C0C0C0",
  menuBar:      "#FFFFFF",
  menuBarBorder:"#000000",
  shadow:       "3px 3px 0px rgba(0,0,0,0.25)",
  windowShadow: "4px 4px 0px rgba(0,0,0,0.3)",
  font:         "'Geneva', 'Monaco', 'Courier New', 'Lucida Console', monospace",
  fontChicago:  "'ChicagoFLF', 'Geneva', 'Monaco', 'Courier New', monospace",
};

const TITLE_STRIPE = `repeating-linear-gradient(
  0deg,
  ${MAC.titleBarActive} 0px,
  ${MAC.titleBarActive} 1px,
  ${MAC.titleBar} 1px,
  ${MAC.titleBar} 3px
)`;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

const anim = (variants) => (prefersReducedMotion ? {} : variants);

function MacWindow({ id, title, children, initialPos, initialSize, zIndex, onFocus, onClose, isActive }) {
  const [pos, setPos] = useState(initialPos);
  const [size] = useState(initialSize);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus(id);
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos, id, onFocus]);

  const onPointerMove = useCallback((e) => {
    if (dragging.current) {
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    }
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-labelledby={`mac-window-title-${id}`}
      initial={anim({ scale: 0.85, opacity: 0 })}
      animate={anim({ scale: 1, opacity: 1 })}
      exit={anim({ scale: 0.85, opacity: 0 })}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onMouseDown={() => onFocus(id)}
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width: size.w,
        maxWidth: "calc(100vw - 20px)",
        zIndex,
        border: `2px solid ${MAC.border}`,
        background: MAC.windowBg,
        boxShadow: MAC.windowShadow,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          height: 22,
          background: isActive ? TITLE_STRIPE : MAC.titleBar,
          borderBottom: `2px solid ${MAC.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          cursor: "grab",
          userSelect: "none",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); onClose(id); }}
          aria-label={`Close ${title}`}
          style={{
            width: 16,
            height: 16,
            border: `2px solid ${MAC.border}`,
            background: MAC.windowBg,
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            color: MAC.border,
          }}
          onFocus={(e) => { e.currentTarget.style.outline = `2px solid ${MAC.border}`; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#C0C0C0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = MAC.windowBg; }}
        >
          ×
        </button>
        <span
          id={`mac-window-title-${id}`}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            fontFamily: MAC.fontChicago,
            fontWeight: 700,
            color: MAC.text,
            background: isActive ? MAC.titleBar : "transparent",
            padding: "0 8px",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          maxHeight: size.h - 22,
          minHeight: 0,
        }}
        className="mac84-scroll"
      >
        {children}
      </div>
    </motion.div>
  );
}

function DesktopIcon({ label, icon, onDoubleClick, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => { if (e.key === "Enter") onDoubleClick(); }}
      aria-label={`Open ${label}`}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "6px 2px",
        width: 92,
        outline: "none",
        pointerEvents: "auto",
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isSelected ? MAC.selection : "transparent",
        padding: 2,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 10,
        fontFamily: MAC.font,
        color: isSelected ? MAC.selectionText : MAC.text,
        background: isSelected ? MAC.selection : "transparent",
        padding: "1px 3px",
        textAlign: "center",
        lineHeight: 1.2,
        maxWidth: 88,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}>
        {label}
      </span>
    </button>
  );
}

function MacFolderIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" aria-hidden="true">
      <path d="M1 5V26H31V5H1Z" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M1 5V2H12L15 5H1Z" stroke={fill} strokeWidth="2" fill="none" />
    </svg>
  );
}

function MacDiskIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="2" stroke={fill} strokeWidth="2" fill="none" />
      <rect x="10" y="2" width="12" height="10" stroke={fill} strokeWidth="1.5" fill="none" />
      <rect x="18" y="5" width="2" height="4" fill={fill} />
    </svg>
  );
}

// Fixed visual icon styling for Testimonials (note icon with visible lined notes)
function MacNoteIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="24" height="28" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M2 8H26" stroke={fill} strokeWidth="1.5" />
      <path d="M6 14H22M6 18H22M6 22H18" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
}

function MacTrashIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="20" height="24" rx="1" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M2 6H26" stroke={fill} strokeWidth="2" />
      <path d="M10 2H18V6H10V2Z" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M10 12V24M14 12V24M18 12V24" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
}

function MacDocIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <path d="M2 2H20L26 8V30H2V2Z" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M20 2V8H26" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M6 14H22M6 18H22M6 22H16" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
}

// System settings screen icon
function MacSystemIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="28" height="20" rx="2" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M10 22H22V26H10V22Z" stroke={fill} strokeWidth="2" fill="none" />
      <circle cx="16" cy="12" r="4" stroke={fill} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function MacPersonIcon({ inverted }) {
  const fill = inverted ? "#FFFFFF" : "#000000";
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <circle cx="14" cy="10" r="6" stroke={fill} strokeWidth="2" fill="none" />
      <path d="M4 28C4 22 8 18 14 18C20 18 24 22 24 28" stroke={fill} strokeWidth="2" fill="none" />
    </svg>
  );
}

function SocialIcon({ type, size = 14 }) {
  const map = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail, website: Globe, portfolio: Globe };
  const Icon = map[type] || Globe;
  return <Icon size={size} color={MAC.text} strokeWidth={2} />;
}

function PersonalContent({ data }) {
  const { personal, socials } = data;
  return (
    <div style={{ padding: 16, fontFamily: MAC.font }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" }}>
        {personal.avatar && (
          <img
            src={personal.avatar}
            alt={personal.name}
            style={{
              width: 72,
              height: 72,
              border: `2px solid ${MAC.border}`,
              objectFit: "cover",
              flexShrink: 0,
              imageRendering: "auto",
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 160 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 2px", color: MAC.text }}>
            {personal.name}
          </h2>
          <p style={{ fontSize: 12, margin: "0 0 4px", color: MAC.text, fontWeight: 600 }}>
            {personal.title}
          </p>
          {personal.location && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MAC.textLight }}>
              <MapPin size={10} color={MAC.textLight} /> {personal.location}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${MAC.border}`, margin: "12px 0" }} />

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 6px" }}>About</h3>
        <p style={{ fontSize: 11, lineHeight: 1.6, margin: 0, color: MAC.text }}>{personal.bio}</p>
      </div>

      {personal.tagline && (
        <div style={{
          border: `1px solid ${MAC.border}`,
          padding: "8px 10px",
          fontSize: 11,
          fontStyle: "italic",
          marginBottom: 16,
          background: "#F5F5F5",
        }}>
          "{personal.tagline}"
        </div>
      )}

      <div style={{ borderTop: `1px solid ${MAC.border}`, paddingTop: 12 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 8px" }}>Contact</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {socials.email && (
            <a href={`mailto:${socials.email}`} style={{ fontSize: 11, color: MAC.text, textDecoration: "underline", display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={11} color={MAC.text} /> {socials.email}
            </a>
          )}
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: MAC.text, textDecoration: "underline", display: "flex", alignItems: "center", gap: 6 }}>
              <Github size={11} color={MAC.text} /> GitHub
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: MAC.text, textDecoration: "underline", display: "flex", alignItems: "center", gap: 6 }}>
              <Linkedin size={11} color={MAC.text} /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsContent({ skills }) {
  const categories = useMemo(() => {
    const cats = {};
    skills.forEach((s) => {
      const cat = s.category || "General";
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(s);
    });
    return cats;
  }, [skills]);

  return (
    <div style={{ fontFamily: MAC.font }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 80px",
        padding: "4px 12px",
        borderBottom: `1px solid ${MAC.border}`,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: MAC.fontChicago,
        background: "#F0F0F0",
      }}>
        <span>Name</span>
        <span style={{ textAlign: "right" }}>Level</span>
      </div>

      {Object.entries(categories).map(([category, catSkills]) => (
        <div key={category}>
          <div style={{
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: MAC.fontChicago,
            background: "#E8E8E8",
            borderBottom: `1px solid ${MAC.border}`,
          }}>
            📁 {category}
          </div>
          {catSkills.map((skill, i) => (
            <div
              key={skill.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px",
                padding: "4px 12px 4px 28px",
                borderBottom: `1px solid #D0D0D0`,
                fontSize: 11,
                background: i % 2 === 0 ? MAC.windowBg : "#F8F8F8",
              }}
            >
              <span>📄 {skill.name}</span>
              <span style={{ textAlign: "right" }}>
                <span style={{
                  display: "inline-block",
                  width: 50,
                  height: 8,
                  border: `1px solid ${MAC.border}`,
                  background: MAC.windowBg,
                  marginRight: 6,
                  verticalAlign: "middle",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <span style={{
                    display: "block",
                    height: "100%",
                    width: `${skill.level}%`,
                    background: MAC.border,
                  }} />
                </span>
                {skill.level}%
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  if (selectedProject !== null) {
    const p = projects[selectedProject];
    return (
      <div style={{ fontFamily: MAC.font }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px",
          borderBottom: `1px solid ${MAC.border}`,
          background: "#F0F0F0",
        }}>
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            aria-label="Back to project list"
            style={{
              border: `1px solid ${MAC.border}`,
              background: MAC.windowBg,
              padding: "2px 10px",
              fontSize: 10,
              fontFamily: MAC.fontChicago,
              cursor: "pointer",
            }}
          >
            ◀ Back
          </button>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: MAC.fontChicago }}>{p.title}</span>
        </div>

        <div style={{ padding: 16 }}>
          {p.image && (
            <div style={{ marginBottom: 14, border: `2px solid ${MAC.border}` }}>
              <img
                src={p.image}
                alt={p.title}
                style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </div>
          )}

          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 8px" }}>{p.title}</h3>
          <p style={{ fontSize: 11, lineHeight: 1.6, margin: "0 0 12px", color: MAC.text }}>{p.description}</p>

          {p.techStack?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: MAC.fontChicago }}>Technologies: </span>
              {p.techStack.map((t) => (
                <span key={t} style={{
                  fontSize: 10,
                  border: `1px solid ${MAC.border}`,
                  padding: "1px 6px",
                  marginRight: 4,
                  marginBottom: 4,
                  display: "inline-block",
                  background: "#F0F0F0",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  fontFamily: MAC.fontChicago,
                  border: `2px solid ${MAC.border}`,
                  padding: "4px 12px",
                  color: MAC.text,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: MAC.windowBg,
                }}
              >
                <ExternalLink size={10} /> Live Demo
              </a>
            )}
            {p.githubUrl && (
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  fontFamily: MAC.fontChicago,
                  border: `2px solid ${MAC.border}`,
                  padding: "4px 12px",
                  color: MAC.text,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: MAC.windowBg,
                }}
              >
                <Github size={10} /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: MAC.font }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr 120px",
        padding: "4px 12px",
        borderBottom: `1px solid ${MAC.border}`,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: MAC.fontChicago,
        background: "#F0F0F0",
      }}>
        <span />
        <span>Name</span>
        <span>Kind</span>
      </div>

      {projects.map((project, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSelectedProject(i)}
          onKeyDown={(e) => { if (e.key === "Enter") setSelectedProject(i); }}
          style={{
            display: "grid",
            gridTemplateColumns: "24px 1fr 120px",
            padding: "4px 12px",
            borderBottom: `1px solid #D0D0D0`,
            fontSize: 11,
            background: i % 2 === 0 ? MAC.windowBg : "#F8F8F8",
            border: "none",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            fontFamily: MAC.font,
            color: MAC.text,
          }}
          aria-label={`Open project ${project.title}`}
        >
          <span style={{ display: "flex", alignItems: "center" }}>📄</span>
          <span style={{ fontWeight: 500 }}>{project.title}</span>
          <span style={{ color: MAC.textLight, fontSize: 10 }}>Project Document</span>
        </button>
      ))}
    </div>
  );
}

function ExperienceContent({ experience }) {
  const [selectedExp, setSelectedExp] = useState(null);

  if (selectedExp !== null) {
    const e = experience[selectedExp];
    return (
      <div style={{ fontFamily: MAC.font }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px",
          borderBottom: `1px solid ${MAC.border}`,
          background: "#F0F0F0",
        }}>
          <button
            type="button"
            onClick={() => setSelectedExp(null)}
            aria-label="Back to experience list"
            style={{
              border: `1px solid ${MAC.border}`,
              background: MAC.windowBg,
              padding: "2px 10px",
              fontSize: 10,
              fontFamily: MAC.fontChicago,
              cursor: "pointer",
            }}
          >
            ◀ Back
          </button>
        </div>

        <div style={{ padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 4px" }}>
            {e.role || e.title}
          </h3>
          <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>{e.company}</p>
          <p style={{ fontSize: 10, color: MAC.textLight, margin: "0 0 12px" }}>
            {e.duration || e.period || `${e.startDate} – ${e.endDate}`}
          </p>
          <div style={{ borderTop: `1px solid ${MAC.border}`, paddingTop: 10 }}>
            <p style={{ fontSize: 11, lineHeight: 1.65, margin: 0 }}>{e.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: MAC.font }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr 100px",
        padding: "4px 12px",
        borderBottom: `1px solid ${MAC.border}`,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: MAC.fontChicago,
        background: "#F0F0F0",
      }}>
        <span />
        <span>Role</span>
        <span>Period</span>
      </div>

      {experience.map((exp, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSelectedExp(i)}
          style={{
            display: "grid",
            gridTemplateColumns: "24px 1fr 100px",
            padding: "5px 12px",
            borderBottom: `1px solid #D0D0D0`,
            fontSize: 11,
            background: i % 2 === 0 ? MAC.windowBg : "#F8F8F8",
            border: "none",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            fontFamily: MAC.font,
            color: MAC.text,
          }}
          aria-label={`View ${exp.role || exp.title} at ${exp.company}`}
        >
          <span style={{ display: "flex", alignItems: "center" }}>📋</span>
          <span>
            <span style={{ fontWeight: 600 }}>{exp.role || exp.title}</span>
            <span style={{ color: MAC.textLight }}> — {exp.company}</span>
          </span>
          <span style={{ color: MAC.textLight, fontSize: 10 }}>{exp.duration || exp.period}</span>
        </button>
      ))}
    </div>
  );
}

function TestimonialsContent({ testimonials }) {
  return (
    <div style={{ padding: 12, fontFamily: MAC.font }}>
      {testimonials.map((t, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${MAC.border}`,
            padding: 12,
            marginBottom: 10,
            background: i % 2 === 0 ? "#FAFAFA" : MAC.windowBg,
          }}
        >
          <div style={{
            borderBottom: `1px solid ${MAC.border}`,
            paddingBottom: 6,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.name}
                style={{ width: 24, height: 24, border: `1px solid ${MAC.border}`, objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div style={{
                width: 24, height: 24, border: `1px solid ${MAC.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, background: "#E8E8E8",
              }}>
                {t.name?.[0]}
              </div>
            )}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: MAC.fontChicago }}>{t.name}</div>
              <div style={{ fontSize: 9, color: MAC.textLight }}>{t.role}</div>
            </div>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
            "{t.text || t.content}"
          </p>
        </div>
      ))}
    </div>
  );
}

function StatsContent({ stats }) {
  const { yearsExperience, projectsCompleted, happyClients } = stats || {};
  return (
    <div style={{ padding: 16, fontFamily: MAC.font }}>
      <h3 style={{ fontSize: 12, fontWeight: 700, fontFamily: MAC.fontChicago, margin: "0 0 12px" }}>System Information</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          border: `1px solid ${MAC.border}`,
          padding: "10px 12px",
          background: MAC.windowBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 11 }}>Years of Experience</span>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: MAC.fontChicago }}>{yearsExperience ?? 0}</span>
        </div>
        <div style={{
          border: `1px solid ${MAC.border}`,
          padding: "10px 12px",
          background: MAC.windowBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 11 }}>Projects Completed</span>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: MAC.fontChicago }}>{projectsCompleted ?? 0}</span>
        </div>
        <div style={{
          border: `1px solid ${MAC.border}`,
          padding: "10px 12px",
          background: MAC.windowBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 11 }}>Happy Clients</span>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: MAC.fontChicago }}>{happyClients ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, fontWeight: 700, color: MAC.text }}>
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

const DESKTOP_APPS = [
  { id: "personal",      title: "Personal",      iconComponent: "person",  pos: { x: 60, y: 50 },   size: { w: 380, h: 440 } },
  { id: "skills",        title: "Skills",        iconComponent: "folder",  pos: { x: 120, y: 80 },  size: { w: 400, h: 380 } },
  { id: "projects",      title: "Projects",      iconComponent: "folder",  pos: { x: 180, y: 50 },  size: { w: 480, h: 420 } },
  { id: "experience",    title: "Experience",     iconComponent: "doc",     pos: { x: 80, y: 100 },  size: { w: 460, h: 380 } },
  { id: "testimonials",  title: "Testimonials",   iconComponent: "note",    pos: { x: 140, y: 70 },  size: { w: 440, h: 400 } },
  { id: "stats",         title: "Stats",          iconComponent: "doc",     pos: { x: 200, y: 120 }, size: { w: 340, h: 280 } },
];

const SYSTEM_ICONS = [
  { id: "macintosh_hd",  label: "Macintosh HD",    iconComponent: "disk" },
  { id: "system_folder", label: "System Folder",    iconComponent: "system" },
  { id: "trash",         label: "Trash",             iconComponent: "trash" },
];

function getIconForType(type, inverted = false) {
  switch (type) {
    case "folder":  return <MacFolderIcon inverted={inverted} />;
    case "disk":    return <MacDiskIcon inverted={inverted} />;
    case "trash":   return <MacTrashIcon inverted={inverted} />;
    case "doc":     return <MacDocIcon inverted={inverted} />;
    case "system":  return <MacSystemIcon inverted={inverted} />;
    case "note":    return <MacNoteIcon inverted={inverted} />;
    case "person":  return <MacPersonIcon inverted={inverted} />;
    default:        return <MacFolderIcon inverted={inverted} />;
  }
}

function WindowContent({ appId, data }) {
  switch (appId) {
    case "personal":     return <PersonalContent data={data} />;
    case "skills":       return <SkillsContent skills={data.skills} />;
    case "projects":     return <ProjectsContent projects={data.projects} />;
    case "experience":   return <ExperienceContent experience={data.experience} />;
    case "testimonials": return <TestimonialsContent testimonials={data.testimonials} />;
    case "stats":        return <StatsContent stats={data.stats} />;
    default:             return null;
  }
}

function SocialBar({ socials }) {
  const links = useMemo(() => [
    { type: "github",   href: socials.github,   label: "GitHub" },
    { type: "linkedin", href: socials.linkedin,  label: "LinkedIn" },
    { type: "twitter",  href: socials.twitter,   label: "Twitter" },
    { type: "email",    href: socials.email?.includes("@") ? `mailto:${socials.email}` : socials.email, label: "Email" },
    { type: "website",  href: socials.website || socials.portfolio, label: "Website" },
  ].filter((l) => l.href), [socials]);

  if (links.length === 0) return null;

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 28,
      background: MAC.windowBg,
      borderTop: `2px solid ${MAC.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      zIndex: 1000,
      fontFamily: MAC.font,
    }}>
      {links.map(({ type, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: MAC.text,
            textDecoration: "none",
            padding: "2px 6px",
            border: `1px solid transparent`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = MAC.border; e.currentTarget.style.background = "#E0E0E0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
          onFocus={(e) => { e.currentTarget.style.outline = `2px solid ${MAC.border}`; }}
          onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
        >
          <SocialIcon type={type} size={12} />
          <span className="mac84-social-label">{label}</span>
        </a>
      ))}
    </div>
  );
}

export default function Template() {
  const { portfolioData } = usePortfolio();
  const { personal = {}, socials = {} } = portfolioData || {};

  const [openWindows, setOpenWindows] = useState([]);
  const [zOrder, setZOrder] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openApp = useCallback((id) => {
    setOpenWindows((w) => w.includes(id) ? w : [...w, id]);
    setZOrder((z) => [...z.filter((x) => x !== id), id]);
  }, []);

  const focusWindow = useCallback((id) => {
    setZOrder((z) => [...z.filter((x) => x !== id), id]);
  }, []);

  const closeWindow = useCallback((id) => {
    setOpenWindows((w) => w.filter((x) => x !== id));
    setZOrder((z) => z.filter((x) => x !== id));
  }, []);

  if (isMobile) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: MAC.desktop, fontFamily: MAC.font }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
          .mac84-scroll::-webkit-scrollbar { width: 14px; }
          .mac84-scroll::-webkit-scrollbar-track { background: ${MAC.windowBg}; border-left: 1px solid ${MAC.border}; }
          .mac84-scroll::-webkit-scrollbar-thumb { background: ${MAC.scrollbar}; border: 1px solid ${MAC.border}; }
        `}</style>

        <div style={{
          height: 24,
          background: MAC.menuBar,
          borderBottom: `2px solid ${MAC.menuBarBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14 }}>🍎</span>
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: MAC.fontChicago }}>Finder</span>
          </div>
          <ClockWidget />
        </div>

        <div style={{ padding: 8 }}>
          {DESKTOP_APPS.map((app) => {
            const isOpen = openWindows.includes(app.id);
            return (
              <div key={app.id} style={{ marginBottom: 4 }}>
                <button
                  type="button"
                  onClick={() => isOpen ? closeWindow(app.id) : openApp(app.id)}
                  aria-expanded={isOpen}
                  aria-controls={`mac-mobile-${app.id}`}
                  style={{
                    width: "100%",
                    height: 22,
                    background: isOpen ? TITLE_STRIPE : MAC.titleBar,
                    border: `2px solid ${MAC.border}`,
                    borderBottom: isOpen ? "none" : `2px solid ${MAC.border}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 8px",
                    cursor: "pointer",
                    fontFamily: MAC.fontChicago,
                    fontSize: 11,
                    fontWeight: 700,
                    color: MAC.text,
                    position: "relative",
                  }}
                >
                  <span style={{
                    width: 12, height: 12,
                    border: `2px solid ${MAC.border}`,
                    background: MAC.windowBg,
                    marginRight: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                  }}>
                    {isOpen ? "−" : "+"}
                  </span>
                  <span style={{
                    background: isOpen ? MAC.titleBar : "transparent",
                    padding: "0 6px",
                  }}>{app.title}</span>
                </button>

                {isOpen && (
                  <div
                    id={`mac-mobile-${app.id}`}
                    style={{
                      border: `2px solid ${MAC.border}`,
                      borderTop: `1px solid ${MAC.border}`,
                      background: MAC.windowBg,
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                    className="mac84-scroll"
                  >
                    <WindowContent appId={app.id} data={portfolioData} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <SocialBar socials={socials} />
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      minHeight: 600,
      position: "relative",
      overflow: "hidden",
      background: MAC.desktop,
      fontFamily: MAC.font,
      color: MAC.text,
      userSelect: "none",
      cursor: "default",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .mac84-scroll::-webkit-scrollbar { width: 14px; }
        .mac84-scroll::-webkit-scrollbar-track { background: ${MAC.windowBg}; border-left: 1px solid ${MAC.border}; }
        .mac84-scroll::-webkit-scrollbar-thumb { background: ${MAC.scrollbar}; border: 1px solid ${MAC.border}; }
        @media (max-width: 1024px) {
          .mac84-social-label { display: none; }
        }
      `}</style>

      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 24,
        background: MAC.menuBar,
        borderBottom: `2px solid ${MAC.menuBarBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        zIndex: 2000,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 14, cursor: "pointer" }} role="img" aria-label="Apple menu">🍎</span>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: MAC.fontChicago, cursor: "default" }}>Finder</span>
          <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, cursor: "default" }}>File</span>
          <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, cursor: "default" }}>Edit</span>
          <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, cursor: "default" }}>View</span>
          <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, cursor: "default" }}>Special</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontFamily: MAC.fontChicago, fontWeight: 600 }}>{personal.name}</span>
          <ClockWidget />
        </div>
      </div>

      <div style={{
        position: "absolute",
        top: 26,
        left: 0,
        right: 0,
        bottom: 28,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          bottom: 8,
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap-reverse",
          alignContent: "flex-start",
          justifyContent: "flex-start",
          gap: 4,
          zIndex: 1,
          pointerEvents: "none",
        }}>
          {SYSTEM_ICONS.map((si) => (
            <DesktopIcon
              key={si.id}
              label={si.label}
              icon={getIconForType(si.iconComponent, selectedIcon === si.id)}
              isSelected={selectedIcon === si.id}
              onSelect={() => setSelectedIcon(si.id)}
              onDoubleClick={() => {}}
            />
          ))}

          <div style={{ height: 8 }} />

          {DESKTOP_APPS.map((app) => (
            <DesktopIcon
              key={app.id}
              label={app.title}
              icon={getIconForType(app.iconComponent, selectedIcon === app.id)}
              isSelected={selectedIcon === app.id}
              onSelect={() => setSelectedIcon(app.id)}
              onDoubleClick={() => openApp(app.id)}
            />
          ))}
        </div>

        <div
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
          onClick={() => setSelectedIcon(null)}
          aria-hidden="true"
        />

        <AnimatePresence>
          {openWindows.map((id) => {
            const app = DESKTOP_APPS.find((a) => a.id === id);
            if (!app) return null;
            return (
              <MacWindow
                key={id}
                id={id}
                title={app.title}
                initialPos={app.pos}
                initialSize={app.size}
                zIndex={100 + zOrder.indexOf(id)}
                onFocus={focusWindow}
                onClose={closeWindow}
                isActive={zOrder[zOrder.length - 1] === id}
              >
                <WindowContent appId={id} data={portfolioData} />
              </MacWindow>
            );
          })}
        </AnimatePresence>
      </div>

      <SocialBar socials={socials} />
    </div>
  );
}
