import React, { useState, useEffect, useCallback } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MapPin,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  Code2,
  Briefcase,
  Star,
  User,
} from "lucide-react";

/* ─── Captcha tile helpers ─── */
const TILE_CATEGORIES = ["robot", "human"];

/** Generates a grid of 9 tiles, each labeled robot | human randomly */
function generateGrid() {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i,
    isRobot: Math.random() > 0.55,
    selected: false,
  }));
}

/* ═══════════════════════════════════════════════════════════
   Scoped Styles
   ═══════════════════════════════════════════════════════════ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

.cpg-root {
  --bg: #0d0d0d;
  --bg-card: #111111;
  --bg-panel: #161616;
  --border: #252525;
  --border-focus: #4ade80;
  --green: #4ade80;
  --green-dim: rgba(74, 222, 128, 0.12);
  --green-glow: rgba(74, 222, 128, 0.35);
  --red: #f87171;
  --red-dim: rgba(248, 113, 113, 0.12);
  --text: #e8e8e8;
  --text-dim: #888;
  --text-faint: #444;
  --mono: 'JetBrains Mono', monospace;
  --sans: 'Inter', system-ui, sans-serif;
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.cpg-root *, .cpg-root *::before, .cpg-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ─ Gate Screen ─ */
.cpg-gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(ellipse at center, #0a1a0a 0%, #0d0d0d 70%);
}
.cpg-gate-box {
  width: 100%;
  max-width: 480px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 0 60px rgba(74, 222, 128, 0.06);
}
.cpg-gate-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.cpg-gate-brand {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 20px;
}
.cpg-gate-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}
.cpg-gate-sub {
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 24px;
}
.cpg-prompt {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.cpg-prompt span {
  color: var(--text);
  font-weight: 600;
}
.cpg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.cpg-tile {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  background: var(--bg-panel);
  user-select: none;
}
.cpg-tile:hover {
  border-color: var(--green);
  background: var(--green-dim);
}
.cpg-tile.selected {
  border-color: var(--green);
  background: var(--green-dim);
  color: var(--green);
  box-shadow: 0 0 14px var(--green-glow);
}
.cpg-tile-emoji {
  font-size: 28px;
  line-height: 1;
}
.cpg-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}
.cpg-refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-dim);
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  font-family: var(--sans);
}
.cpg-refresh-btn:hover {
  border-color: var(--text-dim);
  color: var(--text);
}
.cpg-verify-btn {
  flex: 1;
  background: var(--green);
  border: none;
  color: #0d0d0d;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  font-family: var(--sans);
  transition: opacity 0.15s;
  letter-spacing: 0.02em;
}
.cpg-verify-btn:hover { opacity: 0.88; }
.cpg-verify-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.cpg-feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}
.cpg-feedback.success {
  background: var(--green-dim);
  border: 1px solid rgba(74,222,128,0.3);
  color: var(--green);
}
.cpg-feedback.error {
  background: var(--red-dim);
  border: 1px solid rgba(248,113,113,0.3);
  color: var(--red);
}
.cpg-footer-note {
  font-size: 11px;
  color: var(--text-faint);
  text-align: center;
  margin-top: 18px;
  font-family: var(--mono);
}

/* ─ Portfolio Screen ─ */
.cpg-portfolio {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* Nav */
.cpg-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 56px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border);
}
.cpg-nav-brand {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--green);
  letter-spacing: 0.1em;
}
.cpg-nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
}
.cpg-nav-links a {
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  transition: color 0.15s;
}
.cpg-nav-links a:hover { color: var(--text); }
.cpg-verified-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--green);
  background: var(--green-dim);
  border: 1px solid rgba(74,222,128,0.25);
  border-radius: 20px;
  padding: 4px 10px;
}

/* Hero */
.cpg-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: start;
  margin-bottom: 64px;
}
.cpg-hero-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--green);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.cpg-hero-name {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.cpg-hero-title {
  font-size: 18px;
  color: var(--text-dim);
  margin-bottom: 16px;
  font-weight: 400;
}
.cpg-hero-bio {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.75;
  max-width: 520px;
  margin-bottom: 24px;
}
.cpg-hero-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
.cpg-hero-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-dim);
}
.cpg-hero-socials {
  display: flex;
  gap: 10px;
}
.cpg-social-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.15s;
  font-family: var(--sans);
}
.cpg-social-btn:hover {
  border-color: var(--green);
  color: var(--green);
  background: var(--green-dim);
}
.cpg-avatar-wrap {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--green-dim), #1a2e1a);
  border: 2px solid rgba(74,222,128,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  flex-shrink: 0;
}

/* Stats */
.cpg-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 56px;
}
.cpg-stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}
.cpg-stat-value {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--green);
  line-height: 1;
  margin-bottom: 6px;
}
.cpg-stat-label {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Section */
.cpg-section {
  margin-bottom: 56px;
}
.cpg-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.cpg-section-title {
  font-size: 18px;
  font-weight: 700;
}
.cpg-section-icon {
  color: var(--green);
}

/* Skills */
.cpg-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.cpg-skill-item {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}
.cpg-skill-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 8px;
}
.cpg-skill-name { font-weight: 500; }
.cpg-skill-level {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--green);
}
.cpg-skill-bar {
  height: 4px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
}
.cpg-skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green) 0%, #86efac 100%);
  border-radius: 99px;
  transition: width 0.6s ease;
}

/* Projects */
.cpg-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.cpg-project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: default;
}
.cpg-project-card:hover {
  border-color: rgba(74,222,128,0.4);
  box-shadow: 0 4px 24px rgba(74,222,128,0.07);
}
.cpg-project-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
}
.cpg-project-desc {
  font-size: 13px;
  color: var(--text-dim);
  line-height: 1.6;
  margin-bottom: 14px;
}
.cpg-project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cpg-tag {
  font-family: var(--mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--green-dim);
  color: var(--green);
  border: 1px solid rgba(74,222,128,0.2);
}

/* Experience */
.cpg-exp-list { display: flex; flex-direction: column; gap: 16px; }
.cpg-exp-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--green);
  border-radius: 0 12px 12px 0;
  padding: 18px 20px;
}
.cpg-exp-role {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}
.cpg-exp-meta {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 10px;
  font-family: var(--mono);
}
.cpg-exp-desc {
  font-size: 13px;
  color: var(--text-dim);
  line-height: 1.65;
}

/* Testimonials */
.cpg-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}
.cpg-testimonial-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.cpg-testimonial-quote {
  font-size: 13px;
  color: var(--text-dim);
  line-height: 1.7;
  font-style: italic;
  margin-bottom: 14px;
}
.cpg-testimonial-author {
  font-size: 12px;
  font-weight: 600;
}
.cpg-testimonial-role {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 2px;
}

/* Footer */
.cpg-footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
}

@media (max-width: 600px) {
  .cpg-hero { grid-template-columns: 1fr; }
  .cpg-avatar-wrap { display: none; }
  .cpg-nav-links { display: none; }
}
`;

/* ═══════════════════════════════════════════════════════════
   CAPTCHA GATE
   ═══════════════════════════════════════════════════════════ */
const TILES = [
  { emoji: "🤖", label: "robot" },
  { emoji: "🧑‍💻", label: "human" },
  { emoji: "⚙️", label: "robot" },
  { emoji: "👾", label: "robot" },
  { emoji: "👩‍🎨", label: "human" },
  { emoji: "🦾", label: "robot" },
  { emoji: "🧑‍🚀", label: "human" },
  { emoji: "🔩", label: "robot" },
  { emoji: "🧑‍🔬", label: "human" },
];

function shuffleTiles() {
  return [...TILES]
    .sort(() => Math.random() - 0.5)
    .map((t, i) => ({ ...t, id: i, selected: false }));
}

function CaptchaGate({ onVerified }) {
  const [tiles, setTiles] = useState(shuffleTiles);
  const [feedback, setFeedback] = useState(null); // null | "success" | "error"
  const [attempts, setAttempts] = useState(0);

  const toggle = (id) => {
    if (feedback === "success") return;
    setTiles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
    setFeedback(null);
  };

  const refresh = () => {
    setTiles(shuffleTiles());
    setFeedback(null);
  };

  const verify = () => {
    const selectedRobot = tiles.filter((t) => t.selected && t.label === "robot").length;
    const missedRobot = tiles.filter((t) => !t.selected && t.label === "robot").length;
    const wrongSelected = tiles.filter((t) => t.selected && t.label === "human").length;

    if (wrongSelected === 0 && missedRobot === 0 && selectedRobot > 0) {
      setFeedback("success");
      setTimeout(onVerified, 900);
    } else {
      setAttempts((a) => a + 1);
      setFeedback("error");
      setTimeout(() => {
        setTiles(shuffleTiles());
        setFeedback(null);
      }, 1200);
    }
  };

  return (
    <div className="cpg-gate">
      <div className="cpg-gate-box">
        <p className="cpg-gate-brand">// security checkpoint</p>
        <div className="cpg-gate-header">
          <Shield size={20} color="#4ade80" />
          <h1 className="cpg-gate-title">Human Verification Required</h1>
        </div>
        <p className="cpg-gate-sub">
          Select all tiles that show a <span style={{ color: "#4ade80", fontWeight: 600 }}>robot</span> to unlock the portfolio.
        </p>

        <p className="cpg-prompt">
          Select all squares with <span>🤖 robots</span>
        </p>

        <div className="cpg-grid">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={`cpg-tile${tile.selected ? " selected" : ""}`}
              onClick={() => toggle(tile.id)}
              role="checkbox"
              aria-checked={tile.selected}
              aria-label={`Tile ${tile.id + 1}`}
            >
              <span className="cpg-tile-emoji">{tile.emoji}</span>
              <span>{tile.selected ? "✓ selected" : "click to select"}</span>
            </div>
          ))}
        </div>

        <div className="cpg-actions">
          <button className="cpg-refresh-btn" onClick={refresh} title="Get new challenge">
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            className="cpg-verify-btn"
            onClick={verify}
            disabled={feedback === "success"}
          >
            {feedback === "success" ? "Verified ✓" : "Verify & Enter"}
          </button>
        </div>

        {feedback && (
          <div className={`cpg-feedback ${feedback}`}>
            {feedback === "success" ? (
              <>
                <CheckCircle size={15} /> Human confirmed. Loading portfolio…
              </>
            ) : (
              <>
                <AlertCircle size={15} />
                {attempts <= 1
                  ? "Incorrect. Select only the robots."
                  : "Still wrong! Make sure to select ALL robots."}
              </>
            )}
          </div>
        )}

        <p className="cpg-footer-note">
          Protected by CAPTCHA v2.1 · 0 data collected
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO
   ═══════════════════════════════════════════════════════════ */
function Portfolio({ data }) {
  const { personal, socials, stats, skills, projects, experience, testimonials } = data;

  const statItems = [
    { value: stats?.projectsCompleted ?? "50+", label: "Projects" },
    { value: stats?.yearsExperience ?? "5+", label: "Years Exp." },
    { value: stats?.clientsSatisfied ?? "30+", label: "Clients" },
    { value: stats?.contributions ?? "200+", label: "Contributions" },
  ];

  return (
    <div className="cpg-portfolio">
      {/* Nav */}
      <nav className="cpg-nav">
        <span className="cpg-nav-brand">// {personal.name?.split(" ")[0].toLowerCase()}.dev</span>
        <ul className="cpg-nav-links">
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="cpg-verified-badge">
          <CheckCircle size={10} /> verified human
        </div>
      </nav>

      {/* Hero */}
      <section className="cpg-hero">
        <div>
          <p className="cpg-hero-eyebrow">👋 hello, world</p>
          <h1 className="cpg-hero-name">{personal.name}</h1>
          <p className="cpg-hero-title">{personal.title}</p>
          <p className="cpg-hero-bio">{personal.bio}</p>
          <div className="cpg-hero-meta">
            {personal.location && (
              <span className="cpg-hero-meta-item">
                <MapPin size={13} color="#4ade80" /> {personal.location}
              </span>
            )}
            {personal.availability && (
              <span className="cpg-hero-meta-item" style={{ color: "#4ade80" }}>
                ● {personal.availability}
              </span>
            )}
          </div>
          <div className="cpg-hero-socials">
            {socials?.github && (
              <a className="cpg-social-btn" href={socials.github} target="_blank" rel="noreferrer">
                <Github size={13} /> GitHub
              </a>
            )}
            {socials?.linkedin && (
              <a className="cpg-social-btn" href={socials.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={13} /> LinkedIn
              </a>
            )}
            {socials?.email && (
              <a className="cpg-social-btn" href={`mailto:${socials.email}`}>
                <Mail size={13} /> Email
              </a>
            )}
          </div>
        </div>
        <div className="cpg-avatar-wrap">
          {personal.avatar ? (
            <img
              src={personal.avatar}
              alt={personal.name || "Profile Avatar"}
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <span>🧑‍💻</span>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="cpg-stats">
        {statItems.map((s, i) => (
          <div key={i} className="cpg-stat-card">
            <div className="cpg-stat-value">{s.value}</div>
            <div className="cpg-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <section className="cpg-section" id="skills">
        <div className="cpg-section-header">
          <Code2 size={18} className="cpg-section-icon" />
          <h2 className="cpg-section-title">Skills</h2>
        </div>
        <div className="cpg-skills-grid">
          {skills.map((skill, i) => (
            <div key={i} className="cpg-skill-item">
              <div className="cpg-skill-row">
                <span className="cpg-skill-name">{skill.name}</span>
                <span className="cpg-skill-level">{skill.level}%</span>
              </div>
              <div className="cpg-skill-bar">
                <div className="cpg-skill-fill" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="cpg-section" id="projects">
        <div className="cpg-section-header">
          <Briefcase size={18} className="cpg-section-icon" />
          <h2 className="cpg-section-title">Projects</h2>
        </div>
        <div className="cpg-projects-grid">
          {projects.map((project, i) => (
            <div key={i} className="cpg-project-card">
              <h3 className="cpg-project-title">{project.title}</h3>
              <p className="cpg-project-desc">{project.description}</p>
              {Array.isArray(project.techStack) && (
                <div className="cpg-project-tags">
                  {project.techStack.slice(0, 4).map((tech, j) => (
                    <span key={j} className="cpg-tag">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="cpg-section" id="experience">
        <div className="cpg-section-header">
          <User size={18} className="cpg-section-icon" />
          <h2 className="cpg-section-title">Experience</h2>
        </div>
        <div className="cpg-exp-list">
          {experience.map((exp, i) => (
            <div key={i} className="cpg-exp-item">
              <p className="cpg-exp-role">{exp.role}</p>
              <p className="cpg-exp-meta">
                {exp.company} · {exp.period}
              </p>
              <p className="cpg-exp-desc">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials?.length > 0 && (
        <section className="cpg-section">
          <div className="cpg-section-header">
            <Star size={18} className="cpg-section-icon" />
            <h2 className="cpg-section-title">Testimonials</h2>
          </div>
          <div className="cpg-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="cpg-testimonial-card">
                <p className="cpg-testimonial-quote">"{t.text}"</p>
                <p className="cpg-testimonial-author">{t.name}</p>
                <p className="cpg-testimonial-role">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="cpg-footer" id="contact">
        <p>
          Built with ♥ by {personal.name} ·{" "}
          {socials?.email && (
            <a href={`mailto:${socials.email}`} style={{ color: "#4ade80", textDecoration: "none" }}>
              {socials.email}
            </a>
          )}
        </p>
        <p style={{ marginTop: 6, color: "#333" }}>
          // access_granted: true · verification_method: captcha_v2
        </p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
  ROOT EXPORT
   ═══════════════════════════════════════════════════════════ */
export default function CaptchaSolverPortfolioGate() {
  const { portfolioData } = usePortfolio();
  const [verified, setVerified] = useState(false);

  return (
    <div className="cpg-root">
      <style>{styles}</style>
      {verified ? (
        <Portfolio data={portfolioData} />
      ) : (
        <CaptchaGate onVerified={() => setVerified(true)} />
      )}
    </div>
  );
}
