import React, { useState, useEffect, useMemo } from "react";
import {
  Github, Linkedin, Twitter, Mail, Globe, ExternalLink,
  MapPin, Briefcase, Code, Star, Users, Eye, Heart,
  MessageSquare, UserPlus, Bookmark,
  Award, GraduationCap,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

/* ═══════════════════════════════════════════════════════════════
   MYSPACE 2005 PORTFOLIO TEMPLATE — AUTHENTIC MICRO-INTERACTIONS
   ───────────────────────────────────────────────────────────────
   Full viewport-width edge-to-edge layout, persistent 3-column
   desktop grid (~23% Left, ~52% Center, ~25% Right). Period-accurate
   2005 micro-interactions: profile image hover, Windows XP pressed
   buttons, classic link hovers, single-active project accordion
   (▶ / ▼), sequential comment reveal, animated skill bars (0 -> N%),
   gentle page fade-in, and native cursor behavior.
   ═══════════════════════════════════════════════════════════════ */

const MS = {
  navBg: "#003399",
  navBgDark: "#001a66",
  navText: "#ffffff",
  navLink: "#99ccff",
  pageBg: "#c0d4e8",
  contentBg: "#ffffff",
  sectionHeader: "#003366",
  sectionHeaderTx: "#ffffff",
  border: "#b0b0b0",
  borderLight: "#cccccc",
  text: "#000000",
  textMuted: "#444444",
  link: "#003399",
  linkHover: "#0000aa",
  profileBg: "#dde9f4",
  tableBg: "#c8dced",
  tableAlt: "#e8eff6",
  contactBg: "#eef3f9",
  orange: "#ff6600",
  font: "Verdana, Arial, Helvetica, sans-serif",
};

const THEME_CSS = `
  .ms05 *, .ms05 *::before, .ms05 *::after { box-sizing: border-box; }

  /* Requirement 9: Page Load Fade In (0.97 -> 1, 180ms) */
  @keyframes ms05fadeIn {
    from { opacity: 0.97; }
    to { opacity: 1; }
  }

  .ms05 {
    font-family: ${MS.font};
    font-size: 12px;
    line-height: 1.5;
    color: ${MS.text};
    background: ${MS.pageBg};
    min-height: 100vh;
    margin: 0;
    padding: 0;
    width: 100%;
    -webkit-font-smoothing: auto;
    animation: ms05fadeIn 180ms ease-out forwards;
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22"><path fill="%23FFFFFF" stroke="%23000000" stroke-width="1" d="M0 0 L0 18 L4.5 14 L8 21 L11 19.5 L7.5 13 L14 13 Z"/></svg>'), default;
  }

  /* Requirement 7 & 10: Classic Hyperlink Hover & Pointer Cursor */
  .ms05 a, .ms05-link-action {
    color: ${MS.link};
    text-decoration: underline;
    cursor: pointer;
    transition: color 120ms ease;
  }
  .ms05 a:hover, .ms05-link-action:hover {
    color: ${MS.linkHover} !important;
    text-decoration: underline !important;
  }

  /* Native I-beam cursor for selectable text */
  .ms05 p, .ms05 td, .ms05 th {
    cursor: text;
  }
  .ms05 img { max-width: 100%; height: auto; }

  /* Blink for online status dot */
  @keyframes ms05blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .ms05-blink { animation: ms05blink 1.8s ease-in-out infinite; }

  /* Requirement 1: Profile Avatar Hover (border darkens + subtle brightness increase, NO scale/lift) */
  .ms05-avatar-box {
    border: 1px solid ${MS.border};
    padding: 3px;
    background: #ffffff;
    transition: border-color 150ms ease, filter 150ms ease;
    cursor: pointer;
  }
  .ms05-avatar-box:hover {
    border-color: ${MS.sectionHeader} !important;
    filter: brightness(1.05);
  }

  /* Requirement 2: Classic Windows XP / HTML Button Interaction */
  .ms05-btn {
    background: ${MS.contactBg};
    border: 1px solid ${MS.border};
    padding: 4px 7px;
    font-size: 11px;
    font-family: ${MS.font};
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${MS.link};
    flex: 1 1 47%;
    min-width: 0;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    transition: background 120ms ease, border-color 120ms ease, transform 60ms ease, box-shadow 60ms ease;
  }
  .ms05-btn:hover {
    background: #e4edf6 !important;
    border-color: #777777 !important;
    color: ${MS.link} !important;
  }
  .ms05-btn:active {
    transform: translateY(1px);
    border-color: #555555 !important;
    box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Requirement 3: Navigation Link Hover (underline + lighter text, 120ms) */
  .ms05-nav-link {
    color: ${MS.navLink};
    font-size: 12px;
    font-family: ${MS.font};
    text-decoration: none;
    cursor: pointer;
    transition: color 120ms ease;
  }
  .ms05-nav-link:hover {
    color: #ffffff !important;
    text-decoration: underline !important;
  }

  /* Requirement 5: Sequential Comment Appearance on Load */
  @keyframes ms05commentReveal {
    from { opacity: 0.35; transform: translateY(1px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .ms05-comment {
    animation: ms05commentReveal 160ms ease-out forwards;
    transition: background 120ms ease;
  }
  .ms05-comment:hover {
    background: #f0f5fa !important;
  }

  /* Requirement 6: Friend Card Hover */
  .ms05-friend-card {
    text-align: center;
    cursor: pointer;
    transition: filter 150ms ease;
  }
  .ms05-friend-card:hover img,
  .ms05-friend-card:hover .ms05-friend-fallback {
    border-color: ${MS.sectionHeader} !important;
    filter: brightness(1.06);
  }
  .ms05-friend-card:hover .ms05-friend-name {
    color: ${MS.linkHover} !important;
    text-decoration: underline !important;
  }

  /* Social link row states */
  .ms05-social {
    color: ${MS.link};
    text-decoration: underline;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }
  .ms05-social:hover {
    background: #f5f9ff !important;
    color: ${MS.linkHover} !important;
    text-decoration: underline !important;
  }
  .ms05-social:active {
    background: #e6f0fa !important;
    border-color: #999999 !important;
    color: ${MS.linkHover} !important;
  }

  /* Hover effect for project items */
  .ms05-project-item {
    transition: background 120ms ease;
  }
  .ms05-project-item:hover {
    background: #f4f8fc !important;
  }

  /* Requirement 8: Skill bar fill animation */
  .ms05-skill-bar-fill {
    transition: width 500ms linear;
  }

  /* 3-Column Desktop Proportions with Dominant Center Column */
  .ms05-layout {
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: flex-start;
  }
  .ms05-col-left {
    flex: 0 0 23%;
    min-width: 210px;
  }
  .ms05-col-center {
    flex: 1 1 52%;
    min-width: 0;
  }
  .ms05-col-right {
    flex: 0 0 25%;
    min-width: 230px;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .ms05 { animation: none !important; }
    .ms05-comment { animation: none !important; }
    .ms05-skill-bar-fill { transition: none !important; }
    .ms05-btn:active { transform: none !important; }
  }

  /* Responsive Stacking below 1024px */
  @media (max-width: 1023px) {
    .ms05-layout {
      flex-direction: column !important;
    }
    .ms05-col-left,
    .ms05-col-center,
    .ms05-col-right {
      width: 100% !important;
      flex: 1 1 100% !important;
      min-width: 100% !important;
    }
  }
`;

/* ─── Section Header ─── */
function Header({ children, icon, style = {} }) {
  return (
    <div
      style={{
        background: MS.sectionHeader,
        color: MS.sectionHeaderTx,
        padding: "5px 10px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: MS.font,
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
      role="heading"
      aria-level={2}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}

/* ─── Box: a bordered white panel with consistent breathing room ─── */
function Box({ children, nopad, style = {} }) {
  return (
    <div
      style={{
        background: MS.contentBg,
        border: `1px solid ${MS.border}`,
        marginBottom: 9,
        overflow: "hidden",
        ...style,
      }}
    >
      {nopad ? children : <div style={{ padding: "8px 11px" }}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL-WIDTH NAV BAR
   ═══════════════════════════════════════════════════════════════ */
function NavBar({ name }) {
  const navItems = ["Home", "Browse", "Search", "Invite", "Mail", "Blogs", "Favorites", "Forum", "Groups", "Music", "Video"];
  return (
    <nav style={{ width: "100%" }} aria-label="MySpace navigation">
      {/* ── Tier 1: Compact Utility Bar ── */}
      <div style={{ background: MS.navBg, borderBottom: `1px solid ${MS.navBgDark}`, padding: "3px 10px" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          {/* Logo & Tagline — Prominent 26px Visual Anchor */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 3, userSelect: "none" }}>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 26, letterSpacing: "-0.5px", fontFamily: "Impact, Arial Black, sans-serif" }}>My</span>
            <span style={{ color: "#ffffff", fontWeight: 400, fontSize: 26, fontFamily: "Impact, Arial Black, sans-serif" }}>Space</span>
            <span style={{ color: "#ffcc00", fontSize: 9.5, fontWeight: 700, marginLeft: 4, verticalAlign: "super", fontFamily: MS.font }}>a place for devs</span>
          </div>

          {/* Search Box & Classic 3D HTML Go Button */}
          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <label htmlFor="ms05-header-search" style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, fontFamily: MS.font }}>Search:</label>
            <input
              id="ms05-header-search"
              type="text"
              placeholder="Search MySpace..."
              style={{
                width: 200,
                height: 20,
                background: "#ffffff",
                border: "1px solid #777777",
                borderRadius: 0,
                padding: "1px 5px",
                fontSize: 11,
                fontFamily: MS.font,
                color: "#000000",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="ms05-btn"
              style={{
                height: 20,
                padding: "0 8px",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 0,
                borderTop: "1px solid #ffffff",
                borderLeft: "1px solid #ffffff",
                borderRight: "1px solid #777777",
                borderBottom: "1px solid #777777",
                background: "#d4d0c8",
                color: "#000000",
                cursor: "pointer",
                flex: "none",
              }}
            >
              Go
            </button>
          </form>

          {/* Top Right Utility Account Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: MS.font }}>
            <span className="ms05-nav-link" style={{ fontSize: 11 }}>My Account</span>
            <span style={{ color: "#5588cc", opacity: 0.7, fontSize: 10 }}>|</span>
            <span className="ms05-nav-link" style={{ fontSize: 11 }}>Sign Out</span>
          </div>
        </div>
      </div>

      {/* ── Tier 2: Refined Navigation Bar with Softened Separators ── */}
      <div style={{ background: "#001a66", borderBottom: `2px solid #001133`, padding: "2px 10px" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
          {navItems.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span style={{ color: "#4a7bb0", opacity: 0.65, fontSize: 10, margin: "0 2px" }}>|</span>}
              <span className="ms05-nav-link" style={{ padding: "1px 4px", fontSize: 11 }}>
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEFT SIDEBAR MODULES
   ═══════════════════════════════════════════════════════════════ */
function ProfileCard({ personal, socials }) {
  return (
    <Box nopad>
      <Header>{personal.name || "User"}</Header>
      <div style={{ padding: "8px 10px" }}>
        {/* Requirement 1: Profile Avatar Hover */}
        {personal.avatar && (
          <div className="ms05-avatar-box" style={{ marginBottom: 7 }}>
            <img src={personal.avatar} alt={`${personal.name}'s profile`} style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
        )}

        {/* Online status indicator */}
        <div style={{ fontSize: 12, color: MS.textMuted, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <span className="ms05-blink" style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: "#00cc00", border: "1px solid #009900" }} aria-hidden="true" />
          <b style={{ color: "#009900" }}>Online Now!</b>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 14, fontWeight: 700, color: MS.text, marginBottom: 3 }}>
          &quot;{personal.title || "Developer"}&quot;
        </div>
        {personal.tagline && (
          <div style={{ fontSize: 11, color: MS.orange, fontStyle: "italic", marginBottom: 7 }}>
            ♪ Mood: {personal.tagline}
          </div>
        )}

        {/* Details Table */}
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }} aria-label="Profile details">
          <tbody>
            {[
              personal.location && { label: "Location", value: <><MapPin size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />{personal.location}</> },
              socials.email && { label: "Email", value: <a href={`mailto:${socials.email}`}>{socials.email}</a> },
              { label: "Member Since", value: "2005" },
              { label: "Profile Views", value: "14,923" },
              { label: "Last Login", value: "Today" },
            ].filter(Boolean).map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px dotted ${MS.borderLight}` }}>
                <td style={{ padding: "4px 4px 4px 0", fontWeight: 700, color: MS.textMuted, whiteSpace: "nowrap", verticalAlign: "top", width: 90 }}>{row.label}:</td>
                <td style={{ padding: "4px 4px" }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

/* Requirement 2: Classic Windows XP / HTML Button Interaction */
function ContactBox({ name }) {
  const buttons = [
    { icon: <Mail size={11} />, label: "Send Message" },
    { icon: <UserPlus size={11} />, label: "Add to Friends" },
    { icon: <MessageSquare size={11} />, label: "Instant Message" },
    { icon: <Bookmark size={11} />, label: "Add Favorites" },
    { icon: <Heart size={11} />, label: "Add to Group" },
    { icon: <Star size={11} />, label: "Block User" },
  ];

  return (
    <Box nopad>
      <Header icon={<Users size={12} color="#fff" />}>Contacting {(name || "User").split(" ")[0]}</Header>
      <div style={{ padding: 6, display: "flex", flexWrap: "wrap", gap: 3 }}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className="ms05-btn"
            aria-label={btn.label}
          >
            {btn.icon}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </Box>
  );
}

function UrlRow({ name }) {
  return (
    <Box nopad>
      <div style={{ padding: "5px 8px", fontSize: 11, color: MS.textMuted, background: MS.profileBg, display: "flex", alignItems: "center", gap: 4 }}>
        <b>URL:</b>
        <span style={{ fontFamily: "Courier New, monospace", fontSize: 11, color: MS.link, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          myspace.com/{(name || "user").toLowerCase().replace(/\s+/g, "")}
        </span>
      </div>
    </Box>
  );
}

/* Requirement 6: Friend Card Hover */
function TopFriends({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <Box nopad>
      <Header icon={<Users size={12} color="#fff" />}>{`${(testimonials || []).length} Top Friends`}</Header>
      <div style={{ padding: 7, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
        {testimonials.slice(0, 8).map((t, i) => (
          <div key={i} className="ms05-friend-card">
            {t.avatar ? (
              <img src={t.avatar} alt={t.name || t.author || "Friend"} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", border: `1px solid ${MS.border}`, display: "block", transition: "border-color 150ms ease, filter 150ms ease" }} loading="lazy" />
            ) : (
              <div className="ms05-friend-fallback" style={{ width: "100%", aspectRatio: "1", background: MS.tableBg, border: `1px solid ${MS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: MS.sectionHeader, transition: "border-color 150ms ease, filter 150ms ease" }} aria-hidden="true">
                {(t.name || t.author || "?")[0]}
              </div>
            )}
            <div className="ms05-friend-name" style={{ fontSize: 10, color: MS.link, fontFamily: MS.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
              {t.name || t.author}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

/* Requirement 8: Skill Bar Fill Animation (0% to value on initial mount) */
function Skills({ skills }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    if (!skills || skills.length === 0) return {};
    const cats = {};
    skills.forEach((s) => {
      const cat = s.category || "General";
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(s);
    });
    return cats;
  }, [skills]);

  if (!skills || skills.length === 0) return null;

  return (
    <Box nopad>
      <Header icon={<Code size={12} color="#fff" />}>My Skills</Header>
      <div>
        {Object.entries(categories).map(([cat, catSkills]) => (
          <div key={cat}>
            <div style={{ background: MS.tableBg, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: MS.sectionHeader, borderBottom: `1px solid ${MS.border}`, borderTop: `1px solid ${MS.border}` }}>
              ▸ {cat}
            </div>
            {catSkills.map((skill, i) => (
              <div key={skill.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 10px 4px 16px", borderBottom: `1px solid ${MS.borderLight}`, background: i % 2 === 0 ? "#ffffff" : MS.tableAlt, fontSize: 11 }}>
                <span>{skill.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Thin sharp rectangular progress bar */}
                  <div style={{ width: 65, height: 8, background: "#e0e0e0", border: `1px solid ${MS.border}`, overflow: "hidden", borderRadius: 0 }} role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency`}>
                    <div className="ms05-skill-bar-fill" style={{ width: animated ? `${skill.level}%` : "0%", height: "100%", background: MS.navBg }} />
                  </div>
                  <span style={{ fontSize: 10, color: MS.textMuted, width: 26, textAlign: "right" }}>{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CENTER COLUMN MODULES — PRIMARY VISUAL FOCUS (About, Projects, Experience)
   ═══════════════════════════════════════════════════════════════ */
function AboutMe({ personal }) {
  if (!personal.bio) return null;
  return (
    <Box nopad>
      <Header icon={<Eye size={12} color="#fff" />}>About Me</Header>
      <div style={{ padding: "10px 14px", fontSize: 12, lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}>{personal.bio}</p>
      </div>
    </Box>
  );
}

/* Requirement 4: Authentic Project Accordion (▶ Collapsed / ▼ Expanded) */
function Projects({ projects }) {
  const [expanded, setExpanded] = useState(null);

  if (!projects || projects.length === 0) return null;

  return (
    <Box nopad>
      <Header icon={<Briefcase size={12} color="#fff" />}>My Projects</Header>
      <div>
        {projects.map((p, i) => {
          const isExpanded = expanded === i;
          return (
            <div
              key={i}
              className="ms05-project-item"
              style={{
                borderBottom: `1px solid ${MS.border}`,
                background: i % 2 === 0 ? "#ffffff" : MS.tableAlt,
                padding: "14px 16px",
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Scaled Dominant Preview Image */}
                {p.image && (
                  <img src={p.image} alt={p.title} style={{ width: 170, height: 115, objectFit: "cover", border: `1px solid ${MS.border}`, flexShrink: 0, display: "block" }} loading="lazy" />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Accordion Toggle Title */}
                  <div style={{ fontSize: 15, fontWeight: 700, color: MS.link, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : i)}
                      style={{ background: "none", border: "none", padding: 0, fontSize: 15, fontWeight: 700, color: MS.link, cursor: "pointer", textDecoration: "underline", textAlign: "left" }}
                      aria-expanded={isExpanded}
                    >
                      <span style={{ display: "inline-block", width: 14, textDecoration: "none" }}>{isExpanded ? "▼" : "▶"}</span>
                      {p.title}
                    </button>
                  </div>
                  <p style={{ fontSize: 11, color: MS.textMuted, margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: isExpanded ? "none" : 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </p>
                  {/* Tech Tags */}
                  {p.techStack?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: MS.textMuted }}>Tech: </span>
                      {p.techStack.map((t) => (
                        <span key={t} style={{ fontSize: 10, background: MS.tableBg, border: `1px solid ${MS.borderLight}`, padding: "2px 7px", marginRight: 5, display: "inline-block", marginBottom: 3 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Requirement 7: Action Links */}
                  <div style={{ display: "flex", gap: 16, fontSize: 11, paddingTop: 4 }}>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Github size={12} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <Box nopad>
      <Header icon={<Briefcase size={12} color="#fff" />}>Experience</Header>
      <div>
        {experience.map((exp, i) => (
          <div key={i} style={{ padding: "8px 10px", borderBottom: `1px solid ${MS.borderLight}`, background: i % 2 === 0 ? "#ffffff" : MS.tableAlt }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: MS.text }}>{exp.role || exp.title}</span>
              <span style={{ fontSize: 10, color: MS.textMuted, whiteSpace: "nowrap" }}>
                {exp.duration || exp.period || `${exp.startDate || ""} – ${exp.endDate || ""}`}
              </span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: MS.link, marginBottom: 3 }}>{exp.company}</div>
            <p style={{ fontSize: 11, margin: 0, lineHeight: 1.45, color: MS.textMuted }}>{exp.description}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RIGHT SIDEBAR MODULES (Stats, Socials, Education/Certifications, Comments)
   ═══════════════════════════════════════════════════════════════ */
function Stats({ stats, skills, projects, experience }) {
  const rows = useMemo(() => {
    const r = [];
    if (stats?.yearsExperience != null) r.push({ icon: <Star size={11} color={MS.orange} />, label: "Years Experience", value: stats.yearsExperience });
    if (stats?.projectsCompleted != null) r.push({ icon: <Briefcase size={11} color={MS.sectionHeader} />, label: "Projects Completed", value: stats.projectsCompleted });
    else if (projects?.length) r.push({ icon: <Briefcase size={11} color={MS.sectionHeader} />, label: "Total Projects", value: projects.length });
    if (stats?.happyClients != null) r.push({ icon: <Heart size={11} color="#cc0000" />, label: "Happy Clients", value: stats.happyClients });
    if (skills?.length) r.push({ icon: <Code size={11} color={MS.sectionHeader} />, label: "Skills Count", value: skills.length });
    if (experience?.length) r.push({ icon: <Users size={11} color={MS.sectionHeader} />, label: "Roles Held", value: experience.length });
    return r;
  }, [stats, skills, projects, experience]);

  if (rows.length === 0) return null;

  return (
    <Box nopad>
      <Header icon={<Eye size={12} color="#fff" />}>Profile Stats</Header>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: MS.font }} aria-label="Profile Statistics">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} style={{ background: i % 2 === 0 ? "#ffffff" : MS.tableAlt }}>
              <td style={{ padding: "6px 8px", borderBottom: `1px solid ${MS.borderLight}`, display: "flex", alignItems: "center", gap: 5, color: MS.textMuted }}>
                {row.icon} {row.label}
              </td>
              <td style={{ padding: "6px 8px", fontWeight: 700, color: MS.sectionHeader, textAlign: "right", borderBottom: `1px solid ${MS.borderLight}`, fontSize: 13 }}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

function Socials({ socials }) {
  const links = useMemo(() => {
    const r = [];
    if (socials.github) r.push({ icon: <Github size={13} />, label: "GitHub", href: socials.github });
    if (socials.linkedin) r.push({ icon: <Linkedin size={13} />, label: "LinkedIn", href: socials.linkedin });
    if (socials.twitter) r.push({ icon: <Twitter size={13} />, label: "Twitter / X", href: socials.twitter });
    if (socials.email) r.push({ icon: <Mail size={13} />, label: "Email", href: socials.email.includes("@") ? `mailto:${socials.email}` : socials.email });
    if (socials.website || socials.portfolio) r.push({ icon: <Globe size={13} />, label: "Website", href: socials.website || socials.portfolio });
    return r;
  }, [socials]);

  if (links.length === 0) return null;

  return (
    <Box nopad>
      <Header icon={<Globe size={12} color="#fff" />}>My Social Links</Header>
      <div>
        {links.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ms05-social"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 8px",
              borderBottom: `1px solid ${MS.borderLight}`,
              textDecoration: "none",
              fontSize: 11,
              color: MS.link,
              background: i % 2 === 0 ? "#ffffff" : MS.tableAlt,
            }}
          >
            {link.icon}
            {link.label}
            <ExternalLink size={9} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </a>
        ))}
      </div>
    </Box>
  );
}

function DynamicEducation({ education }) {
  if (!Array.isArray(education) || education.length === 0) return null;
  return (
    <Box nopad>
      <Header icon={<GraduationCap size={12} color="#fff" />}>Education</Header>
      <div>
        {education.map((edu, i) => (
          <div key={i} style={{ padding: "6px 8px", borderBottom: `1px solid ${MS.borderLight}`, background: i % 2 === 0 ? "#ffffff" : MS.tableAlt }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MS.text }}>{edu.degree || edu.institution}</div>
            {edu.degree && edu.institution && <div style={{ fontSize: 10, color: MS.link }}>{edu.institution}</div>}
            {edu.year && <div style={{ fontSize: 10, color: MS.textMuted }}>{edu.year}</div>}
          </div>
        ))}
      </div>
    </Box>
  );
}

function DynamicCertifications({ certifications }) {
  if (!Array.isArray(certifications) || certifications.length === 0) return null;
  return (
    <Box nopad>
      <Header icon={<Award size={12} color="#fff" />}>Certifications</Header>
      <div>
        {certifications.map((cert, i) => (
          <div key={i} style={{ padding: "6px 8px", borderBottom: `1px solid ${MS.borderLight}`, background: i % 2 === 0 ? "#ffffff" : MS.tableAlt }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MS.text }}>{cert.name}</div>
            {cert.issuer && <div style={{ fontSize: 10, color: MS.link }}>{cert.issuer}</div>}
            {cert.year && <div style={{ fontSize: 10, color: MS.textMuted }}>{cert.year}</div>}
          </div>
        ))}
      </div>
    </Box>
  );
}

/* Requirement 5: Sequential Comment Appearance (50-80ms delay) */
function Comments({ testimonials, name }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <Box nopad>
      <Header icon={<MessageSquare size={12} color="#fff" />}>
        {`${name || "User"}'s Comments`}
      </Header>
      <div style={{ padding: "6px 10px", fontSize: 11, color: MS.textMuted, borderBottom: `1px solid ${MS.borderLight}`, background: MS.contactBg }}>
        Displaying <b>{testimonials.length}</b> of {testimonials.length} comments
      </div>
      <div>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="ms05-comment"
            style={{
              display: "flex",
              gap: 12,
              padding: "11px 12px",
              borderBottom: `1px solid ${MS.borderLight}`,
              background: i % 2 === 0 ? "#ffffff" : MS.tableAlt,
              alignItems: "flex-start",
              animationDelay: `${i * 60}ms`,
            }}
          >
            {/* Avatar — Enriched 58px size */}
            <div style={{ flexShrink: 0, width: 58, textAlign: "center" }}>
              {t.avatar ? (
                <img src={t.avatar} alt={t.name || t.author || "Commenter"} style={{ width: 58, height: 58, objectFit: "cover", border: `1px solid ${MS.border}`, display: "block" }} loading="lazy" />
              ) : (
                <div style={{ width: 58, height: 58, background: MS.tableBg, border: `1px solid ${MS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: MS.sectionHeader }} aria-hidden="true">
                  {(t.name || t.author || "?")[0]}
                </div>
              )}
              <div style={{ fontSize: 10, color: MS.link, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.name || t.author}
              </div>
            </div>

            {/* Comment body */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: MS.link }}>{t.name || t.author}</span>
                {t.role && <span style={{ fontSize: 10, color: MS.textMuted }}> — {t.role}</span>}
              </div>
              <p style={{ fontSize: 11, margin: "0 0 6px", lineHeight: 1.55, color: MS.text }}>
                &ldquo;{t.text || t.content}&rdquo;
              </p>
              <div style={{ fontSize: 10, color: MS.textMuted, marginTop: 6 }}>
                {i === 0 ? "2 hours ago" : i === 1 ? "yesterday" : `${i + 1} days ago`}
                {" · "}
                <span className="ms05-link-action">Reply</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL-WIDTH FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ width: "100%", margin: "14px 0 0", padding: "12px 16px 18px", textAlign: "center", fontSize: 11, color: MS.textMuted, fontFamily: MS.font, borderTop: `1px solid ${MS.border}`, background: MS.pageBg }}>
      ©2005 MySpaceDev Inc. All Rights Reserved.{" "}
      <span className="ms05-link-action">Privacy Policy</span> |{" "}
      <span className="ms05-link-action">Terms of Service</span> |{" "}
      <span className="ms05-link-action">Safety Tips</span> |{" "}
      <span className="ms05-link-action">Contact MySpace</span> |{" "}
      <span className="ms05-link-action">Promote!</span> |{" "}
      <span className="ms05-link-action">Advertise</span>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN TEMPLATE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Template() {
  const { portfolioData } = usePortfolio();
  const {
    personal = {},
    socials = {},
    stats = {},
    skills = [],
    projects = [],
    experience = [],
    testimonials = [],
    education = [],
    certifications = [],
  } = portfolioData || {};

  return (
    <div className="ms05">
      <style>{THEME_CSS}</style>

      {/* Full-width edge-to-edge NavBar */}
      <NavBar name={personal.name} />

      {/* Full-width Profile Sub-header Banner with Breadcrumb & View My Links */}
      <div style={{ background: MS.profileBg, borderBottom: `1px solid ${MS.border}`, padding: "5px 14px", width: "100%" }}>
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          {/* Refined Breadcrumb */}
          <div style={{ fontSize: 10.5, fontFamily: MS.font, color: MS.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <span className="ms05-link-action" style={{ fontSize: 10.5 }}>MySpace.com</span>
            <span>&gt;</span>
            <span style={{ color: MS.sectionHeader, fontWeight: 700, fontSize: 10.5 }}>{personal.name || "User"}</span>
            {personal.title && <span style={{ color: MS.textMuted, fontSize: 10.5 }}>({personal.title})</span>}
          </div>
          {/* Refined View My Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontFamily: MS.font }}>
            <span style={{ fontWeight: 700, color: MS.textMuted }}>View My:</span>
            {["Photos", "Videos", "Blogs", "Friends", "Favorites"].map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <span style={{ color: MS.borderLight, opacity: 0.8, fontSize: 9.5 }}>|</span>}
                <span className="ms05-link-action" style={{ fontSize: 10.5 }}>{item}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERSISTENT 3-COLUMN DESKTOP LAYOUT (Full-width edge-to-edge canvas) ── */}
      <div style={{ width: "100%", padding: "8px 10px 0" }}>
        <div className="ms05-layout">

          {/* ── LEFT SIDEBAR (~23%) ── */}
          <div className="ms05-col-left">
            <ProfileCard personal={personal} socials={socials} />
            <ContactBox name={personal.name} />
            <UrlRow name={personal.name} />
            <TopFriends testimonials={testimonials} />
            <Skills skills={skills} />
          </div>

          {/* ── MAIN CENTER COLUMN (~52%) — LOGICAL FLOW: About → Projects → Experience ── */}
          <div className="ms05-col-center">
            <AboutMe personal={personal} />
            <Projects projects={projects} />
            <Experience experience={experience} />
          </div>

          {/* ── RIGHT SIDEBAR (~25%) ── */}
          <div className="ms05-col-right">
            <Stats stats={stats} skills={skills} projects={projects} experience={experience} />
            <Socials socials={socials} />
            <DynamicEducation education={education} />
            <DynamicCertifications certifications={certifications} />
            <Comments testimonials={testimonials} name={personal.name} />
          </div>

        </div>
      </div>

      {/* Full-width Footer */}
      <Footer />
    </div>
  );
}
