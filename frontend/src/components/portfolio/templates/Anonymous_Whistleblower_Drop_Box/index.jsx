import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Shield,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Terminal,
  AlertTriangle,
  ChevronRight,
  Zap,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ─── Palette ─────────────────────────────────────────────
   Aesthetic: leaked classified dossier + secure terminal
   Signature element: animated redaction bars that "unredact"
   on hover, revealing data beneath
──────────────────────────────────────────────────────── */
const C = {
  bg: "#080A08",
  paper: "#0C0F0C",
  border: "#1A2A1A",
  green: "#00FF41",
  greenDim: "#00CC33",
  greenMute: "rgba(0,255,65,0.35)",
  greenGlow: "rgba(0,255,65,0.08)",
  red: "#FF3B3B",
  amber: "#FFB800",
  text: "#C8D8C8",
  muted: "rgba(200,216,200,0.5)",
  dim: "rgba(200,216,200,0.2)",
  black: "#000000",
  redact: "#111811",
};

/* ─── Scanline overlay ─────────────────────────────────── */
function Scanlines() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        backgroundSize: "100% 4px",
      }}
    />
  );
}

/* ─── Typing text effect ────────────────────────────────── */
function TypedText({ text, speed = 28, className, style }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            height: "1em",
            background: C.green,
            verticalAlign: "text-bottom",
            marginLeft: 2,
            animation: "blink 0.9s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

/* ─── Redacted field — reveals on hover ─────────────────── */
function Redacted({ children, label, alwaysVisible = false }) {
  const [revealed, setRevealed] = useState(alwaysVisible);

  return (
    <span
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => !alwaysVisible && setRevealed(false)}
      title={alwaysVisible ? undefined : "Hover to declassify"}
      style={{
        display: "inline-block",
        cursor: alwaysVisible ? "default" : "pointer",
        position: "relative",
      }}
    >
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.span
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: C.green }}
          >
            {children}
          </motion.span>
        ) : (
          <motion.span
            key="redacted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              background: C.redact,
              color: C.redact,
              borderRadius: 2,
              padding: "0 4px",
              userSelect: "none",
              fontSize: "0.9em",
              letterSpacing: "0.08em",
              border: `1px solid #1a2a1a`,
            }}
          >
            {label || "█████████"}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─── Dossier section wrapper ───────────────────────────── */
function DossierSection({
  id,
  label,
  classification = "CONFIDENTIAL",
  children,
  delay = 0,
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{
        borderLeft: `2px solid ${C.border}`,
        paddingLeft: 24,
        marginBottom: 56,
        position: "relative",
      }}
    >
      {/* Corner bracket */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -2,
          width: 12,
          height: 12,
          borderTop: `2px solid ${C.green}`,
          borderLeft: `2px solid ${C.green}`,
        }}
      />

      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: C.green,
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          ── {label}
        </span>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: C.red,
            border: `1px solid ${C.red}`,
            padding: "1px 6px",
            borderRadius: 2,
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          {classification}
        </span>
      </div>

      {children}
    </motion.section>
  );
}

/* ─── Skill entry with fill-bar ─────────────────────────── */
function SkillRow({ name, level, category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr 36px",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: C.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.04 }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.greenDim}, ${C.green})`,
            boxShadow: `0 0 6px ${C.greenMute}`,
          }}
        />
      </div>
      <span style={{ fontSize: 10, color: C.greenDim, textAlign: "right" }}>
        {level}%
      </span>
    </motion.div>
  );
}

/* ─── Project card ──────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? C.green : C.border}`,
        borderRadius: 0,
        overflow: "hidden",
        background: hover ? C.greenGlow : "transparent",
        transition: "border-color 0.2s, background 0.2s",
        cursor: "default",
      }}
    >
      {project.image && (
        <div style={{ position: "relative", height: 110, overflow: "hidden" }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(80%) brightness(0.5)",
              transition: "filter 0.3s",
              ...(hover && { filter: "grayscale(40%) brightness(0.65)" }),
            }}
          />
          {/* Classification stamp on image */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: C.red,
              border: `1px solid ${C.red}`,
              padding: "2px 6px",
              fontFamily: "'Courier New', Courier, monospace",
              background: "rgba(0,0,0,0.7)",
              transform: "rotate(2deg)",
            }}
          >
            CLASSIFIED
          </div>
        </div>
      )}
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.text,
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {project.title}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.dim }}
              >
                <Github size={12} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.dim }}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        <p
          style={{
            fontSize: 11,
            color: C.muted,
            lineHeight: 1.65,
            margin: "0 0 10px",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          {project.description?.slice(0, 90)}…
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {project.techStack?.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 7px",
                border: `1px solid ${C.greenDim}`,
                color: C.greenDim,
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: "0.1em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Experience entry ───────────────────────────────────── */
function ExpEntry({ entry, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: 18,
        marginBottom: 18,
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.text,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {entry.role || entry.title}
          </div>
          <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>
            {entry.company}
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            color: C.dim,
            border: `1px solid ${C.border}`,
            padding: "2px 8px",
            alignSelf: "flex-start",
            letterSpacing: "0.1em",
          }}
        >
          {entry.duration || entry.period}
        </span>
      </div>
      {entry.description && (
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, margin: 0 }}>
          {entry.description}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Testimonial card ───────────────────────────────────── */
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        border: `1px solid ${C.border}`,
        padding: "16px 18px",
        background: C.greenGlow,
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        {t.avatar ? (
          <img
            src={t.avatar}
            alt={t.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              filter: "grayscale(60%)",
              border: `1px solid ${C.border}`,
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: C.green,
            }}
          >
            {t.name?.[0]}
          </div>
        )}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>
            {t.name}
          </div>
          <div style={{ fontSize: 10, color: C.dim }}>{t.role}</div>
        </div>
      </div>
      <p
        style={{
          fontSize: 11,
          color: C.muted,
          lineHeight: 1.7,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        "{t.text || t.content}"
      </p>
    </motion.div>
  );
}

/* ─── Main template ──────────────────────────────────────── */
export default function Anonymous_Whistleblower_Drop_Box() {
  const { portfolioData } = usePortfolio();
  const {
    personal,
    socials,
    stats,
    skills,
    projects,
    experience,
    testimonials,
  } = portfolioData;

  const [accessGranted, setAccessGranted] = useState(false);
  const [bootLines, setBootLines] = useState([]);

  const BOOT_SEQUENCE = [
    "> INITIALIZING SECURE CHANNEL...",
    "> VERIFYING IDENTITY... [ANONYMOUS]",
    "> STRIPPING METADATA...",
    "> ESTABLISHING ENCRYPTED TUNNEL...",
    "> LOADING DOSSIER...",
    `> SUBJECT: ${personal.name?.toUpperCase()}`,
    "> ACCESS GRANTED. PROCEED WITH CAUTION.",
  ];

  /* Boot sequence on mount */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
      i++;
      if (i >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setTimeout(() => setAccessGranted(true), 800);
      }
    }, 360);
    return () => clearInterval(interval);
  }, []);

  const contactLinks = [
    {
      Icon: Mail,
      href: socials.email?.includes("@")
        ? `mailto:${socials.email}`
        : socials.email,
      label: "SECURE_MAIL",
    },
    { Icon: Github, href: socials.github, label: "GITHUB" },
    { Icon: Linkedin, href: socials.linkedin, label: "LINKEDIN" },
    { Icon: Twitter, href: socials.twitter, label: "TWITTER" },
  ].filter((l) => l.href);

  /* ── Boot screen ── */
  if (!accessGranted) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: C.black,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Courier New', Courier, monospace",
          color: C.green,
          padding: 40,
        }}
      >
        <Scanlines />
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <Shield size={20} color={C.green} />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              ANONYMOUS DROP BOX — v2.4.1
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: 12,
                  color: line?.includes("GRANTED")
                    ? C.green
                    : line?.includes("SUBJECT")
                      ? C.amber
                      : C.greenDim,
                  fontWeight: line?.includes("GRANTED") ? 700 : 400,
                  letterSpacing: "0.05em",
                }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main dossier view ── */
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "'Courier New', Courier, monospace",
        position: "relative",
      }}
    >
      <Scanlines />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(0,255,65,0.2); }
          50% { box-shadow: 0 0 20px rgba(0,255,65,0.45); }
        }
        .awdb-scroll::-webkit-scrollbar { width: 4px; }
        .awdb-scroll::-webkit-scrollbar-thumb { background: #1a2a1a; }
        .awdb-link { text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #1A2A1A; color: rgba(200,216,200,0.5); font-size: 10px; font-weight: 700; letter-spacing: 0.25em; font-family: 'Courier New', monospace; transition: border-color 0.2s, color 0.2s, background 0.2s; }
        .awdb-link:hover { border-color: #00FF41; color: #00FF41; background: rgba(0,255,65,0.06); }
      `}</style>

      {/* ── Sticky top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: C.black,
          borderBottom: `1px solid ${C.border}`,
          padding: "10px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Lock size={13} color={C.green} />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.4em",
              color: C.green,
              fontWeight: 700,
            }}
          >
            ANON//DROP-BOX
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["about", "skills", "projects", "experience", "contact"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              style={{
                fontSize: 9,
                letterSpacing: "0.25em",
                color: C.dim,
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.green)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
            >
              {s}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.green,
              animation: "blink 1.8s ease-in-out infinite",
            }}
          />
          <span
            style={{ fontSize: 9, color: C.greenDim, letterSpacing: "0.2em" }}
          >
            ENCRYPTED
          </span>
        </div>
      </div>

      <div
        style={{ maxWidth: 860, margin: "0 auto", padding: "60px 40px 80px" }}
      >
        {/* ── Header / Hero ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: 48,
            marginBottom: 56,
          }}
        >
          {/* Dossier file header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 36,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: C.dim,
                  letterSpacing: "0.4em",
                  marginBottom: 6,
                }}
              >
                FILE REF: AWB-
                {Math.floor(Date.now() / 10000)
                  .toString(16)
                  .toUpperCase()}{" "}
                // TOP SECRET
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: C.red,
                  letterSpacing: "0.35em",
                  border: `1px solid ${C.red}`,
                  display: "inline-block",
                  padding: "3px 10px",
                  marginBottom: 18,
                }}
              >
                ⚠ CLASSIFIED — AUTHORIZED ACCESS ONLY ⚠
              </div>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.6rem)",
                  fontWeight: 700,
                  margin: "0 0 8px",
                  letterSpacing: "0.04em",
                  color: C.text,
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                <TypedText text={personal.name} speed={60} />
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: C.green,
                  margin: "0 0 12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {personal.title}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: C.muted,
                  maxWidth: 480,
                  lineHeight: 1.75,
                  margin: "0 0 28px",
                }}
              >
                {personal.tagline}
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[
                  { label: "YEARS_ACTIVE", val: `${stats.yearsExperience}+` },
                  { label: "OPS_COMPLETE", val: `${stats.projectsCompleted}+` },
                  { label: "CLIENTS_SERVED", val: `${stats.happyClients}+` },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: C.green,
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: 8,
                        color: C.dim,
                        letterSpacing: "0.3em",
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar with redaction treatment */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  border: `2px solid ${C.border}`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={personal.avatar}
                  alt="subject"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(70%) contrast(1.1)",
                  }}
                />
                {/* Redaction bar over eyes */}
                <div
                  style={{
                    position: "absolute",
                    top: "32%",
                    left: 0,
                    right: 0,
                    height: 18,
                    background: C.black,
                    opacity: 0.85,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: C.dim,
                  letterSpacing: "0.2em",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                SUBJECT_PHOTO
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── About ── */}
        <div id="about">
          <DossierSection
            label="SUBJECT PROFILE"
            classification="CONFIDENTIAL"
            delay={0.05}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 32,
                alignItems: "start",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.85,
                    marginBottom: 20,
                    margin: "0 0 20px",
                  }}
                >
                  {personal.bio}
                </p>
                <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.9 }}>
                  <div>
                    LOCATION:{" "}
                    <Redacted label="██████████████">
                      {personal.location}
                    </Redacted>
                  </div>
                  <div>
                    CONTACT:{" "}
                    <Redacted label="████████████████">
                      {socials.email}
                    </Redacted>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      color: C.dim,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                    }}
                  >
                    ↑ HOVER FIELDS TO DECLASSIFY
                  </div>
                </div>
              </div>
            </div>
          </DossierSection>
        </div>

        {/* ── Skills ── */}
        <div id="skills">
          <DossierSection
            label="CAPABILITIES ASSESSMENT"
            classification="SECRET"
            delay={0.1}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 40px",
              }}
            >
              {skills.slice(0, 14).map((skill, i) => (
                <SkillRow
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  category={skill.category}
                  index={i}
                />
              ))}
            </div>
          </DossierSection>
        </div>

        {/* ── Projects ── */}
        <div id="projects">
          <DossierSection
            label="DOCUMENTED OPERATIONS"
            classification="TOP SECRET"
            delay={0.15}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {projects.slice(0, 6).map((project, i) => (
                <ProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
          </DossierSection>
        </div>

        {/* ── Experience ── */}
        <div id="experience">
          <DossierSection
            label="EMPLOYMENT HISTORY"
            classification="CONFIDENTIAL"
            delay={0.2}
          >
            {(experience || []).slice(0, 4).map((entry, i) => (
              <ExpEntry key={i} entry={entry} index={i} />
            ))}
          </DossierSection>
        </div>

        {/* ── Testimonials ── */}
        <DossierSection
          label="WITNESS STATEMENTS"
          classification="SEALED"
          delay={0.25}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {(testimonials || []).slice(0, 4).map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </DossierSection>

        {/* ── Contact ── */}
        <div id="contact">
          <DossierSection
            label="ESTABLISH CONTACT"
            classification="EYES ONLY"
            delay={0.3}
          >
            <p
              style={{
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: 24,
                maxWidth: 480,
              }}
            >
              All transmissions are encrypted end-to-end. Your identity remains
              anonymous. Leave a message through any of the secure channels
              below.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {contactLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="awdb-link"
                >
                  <Icon size={12} />
                  {label}
                </a>
              ))}
            </div>
          </DossierSection>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 9, color: C.dim, letterSpacing: "0.25em" }}>
            ANON//DROP-BOX — THIS CONNECTION WILL SELF-TERMINATE
          </span>
          <span style={{ fontSize: 9, color: C.dim, letterSpacing: "0.15em" }}>
            ⚠ DESTROY AFTER READING ⚠
          </span>
        </div>
      </div>
    </div>
  );
}
