import { useState, useEffect, useRef } from "react";
import { usePortfolio, normalizePortfolioData } from "../../../../context/PortfolioContext.jsx";

const defaultData = {
  name: "Alex Rivera",
  title: "Full Stack Developer & Creative Technologist",
  subtitle: "Building the future, one line of code at a time.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "San Francisco, CA",
  bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "Rust"],
  projects: [
    { title: "NeuralLink", description: "AI analytics platform processing 10M+ events/day.", tech: ["Python", "TensorFlow", "React"] },
    { title: "QuantumDB", description: "Distributed database with sub-millisecond query times.", tech: ["Rust", "Kafka", "PostgreSQL"] },
    { title: "StellarAPI", description: "Open-source REST framework with 5K+ GitHub stars.", tech: ["Node.js", "TypeScript", "Docker"] },
  ],
  experience: [
    { company: "Google", role: "Senior Software Engineer", period: "2022 — Present" },
    { company: "Stripe", role: "Software Engineer", period: "2020 — 2022" },
    { company: "Figma", role: "Frontend Engineer", period: "2018 — 2020" },
  ],
  stats: [{ label: "Years Exp", value: "5+" }, { label: "Projects", value: "48+" }, { label: "Clients", value: "32+" }],
};

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.2 - 0.1,
    opacity: Math.random() * 0.6 + 0.2,
    color: Math.random() > 0.5 ? "#00FFD1" : Math.random() > 0.5 ? "#0EA5E9" : "#7C3AED",
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 2 + 0.5,
  }));
}

const PARTICLES = generateParticles(80);
const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

export default function One_Pixel_Master({ portfolioData }) {
  const ctx = usePortfolio();
  const raw = portfolioData || ctx?.portfolioData || {};
  const normalized = normalizePortfolioData(raw);
  const d = Object.keys(normalized).length > 2 ? normalized : null;

  const name = d?.personal?.name || defaultData.name;
  const title = d?.personal?.title || defaultData.title;
  const subtitle = d?.personal?.tagline || defaultData.subtitle;
  const bio = d?.personal?.bio || defaultData.bio;
  const email = d?.socials?.email || defaultData.email;
  const github = d?.socials?.github || defaultData.github;
  const linkedin = d?.socials?.linkedin || defaultData.linkedin;
  const location = d?.personal?.location || defaultData.location;
  const rawSkills = d?.skills || defaultData.skills;
  const skills = Array.isArray(rawSkills) ? rawSkills.map(s => typeof s === "string" ? s : s.name) : defaultData.skills;
  const projects = d?.projects || defaultData.projects;
  const experience = d?.experience || defaultData.experience;
  const stats = d?.stats ? Object.entries(d.stats).slice(0, 3).map(([k, v]) => ({ label: k, value: v })) : defaultData.stats;

  const [active, setActive] = useState("home");
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState(PARTICLES);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = (t) => {
      const s = t / 1000;
      setTime(s);
      setParticles(prev => prev.map(p => {
        let nx = p.x + p.speedX;
        let ny = p.y + p.speedY;
        if (nx < 0) nx = 100;
        if (nx > 100) nx = 0;
        if (ny < 0) ny = 100;
        if (ny > 100) ny = 0;
        return { ...p, x: nx, y: ny };
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const ACCENT = "#00FFD1";
  const ACCENT2 = "#0EA5E9";
  const BG = "#020B18";

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        background: BG,
        minHeight: "100vh",
        color: "#fff",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Ocean depth gradient */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: `
          radial-gradient(ellipse at ${mouse.x}% ${mouse.y}%, rgba(0,255,209,0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.06) 0%, transparent 40%),
          linear-gradient(180deg, #020B18 0%, #041525 50%, #020B18 100%)
        `,
        transition: "background 0.5s ease",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Animated bioluminescent particles */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        {particles.map(p => {
          const pulse = 0.5 + 0.5 * Math.sin(time * p.pulseSpeed + p.pulse);
          return (
            <div key={p.id} style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size + pulse * 2}px`,
              height: `${p.size + pulse * 2}px`,
              borderRadius: "50%",
              background: p.color,
              opacity: p.opacity * (0.4 + pulse * 0.6),
              boxShadow: `0 0 ${6 + pulse * 8}px ${p.color}`,
              transform: "translate(-50%,-50%)",
              transition: "width 0.1s, height 0.1s",
            }} />
          );
        })}

        {/* Caustic light rays */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: "absolute",
            top: 0,
            left: `${15 + i * 20 + Math.sin(time * 0.3 + i) * 5}%`,
            width: "2px",
            height: "100%",
            background: `linear-gradient(180deg, transparent, rgba(0,255,209,${0.03 + 0.02 * Math.sin(time * 0.5 + i)}), transparent)`,
            transform: `skewX(${Math.sin(time * 0.2 + i) * 3}deg)`,
          }} />
        ))}
      </div>

      {/* Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        background: "rgba(2,11,24,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,255,209,0.08)",
      }}>
        <div style={{
          fontSize: "16px",
          fontWeight: "800",
          color: ACCENT,
          letterSpacing: "-0.01em",
          textShadow: `0 0 20px ${ACCENT}66`,
        }}>
          ◈ {name.split(" ")[0]}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)} style={{
              padding: "8px 18px",
              borderRadius: "100px",
              border: "none",
              background: active === s ? `rgba(0,255,209,0.1)` : "transparent",
              color: active === s ? ACCENT : "rgba(255,255,255,0.35)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: "0.05em",
              outline: active === s ? `1px solid rgba(0,255,209,0.3)` : "none",
              transition: "all 0.2s",
              textShadow: active === s ? `0 0 12px ${ACCENT}88` : "none",
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* HOME */}
        {active === "home" && (
          <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px" }}>

            <div style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textShadow: `0 0 16px ${ACCENT}`,
            }}>
              <div style={{ width: "40px", height: "1px", background: `linear-gradient(90deg, transparent, ${ACCENT})` }} />
              Deep Ocean Portfolio — {new Date().getFullYear()}
            </div>

            <h1 style={{
              fontSize: "clamp(60px, 10vw, 120px)",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              lineHeight: "0.92",
              margin: "0 0 32px",
              color: "#fff",
              textShadow: `0 0 80px rgba(0,255,209,0.2), 0 0 160px rgba(14,165,233,0.1)`,
            }}>
              {name.split(" ").map((word, i) => (
                <span key={i} style={{ display: "block", color: i === 0 ? "#fff" : "rgba(255,255,255,0.35)" }}>
                  {word}
                </span>
              ))}
            </h1>

            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginBottom: "8px", letterSpacing: "0.02em" }}>
              {title}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", fontStyle: "italic", marginBottom: "56px" }}>
              "{subtitle}"
            </p>

            <div style={{ display: "flex", gap: "48px", marginBottom: "56px" }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "44px", fontWeight: "900", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, textShadow: `0 0 30px ${ACCENT}44` }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button onClick={() => setActive("projects")} style={{
                padding: "16px 40px",
                borderRadius: "100px",
                border: `1px solid ${ACCENT}44`,
                background: `rgba(0,255,209,0.08)`,
                color: ACCENT,
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "0.05em",
                boxShadow: `0 0 24px rgba(0,255,209,0.15), inset 0 0 24px rgba(0,255,209,0.05)`,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.boxShadow = `0 0 40px rgba(0,255,209,0.4), inset 0 0 40px rgba(0,255,209,0.1)`; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.boxShadow = `0 0 24px rgba(0,255,209,0.15), inset 0 0 24px rgba(0,255,209,0.05)`; e.target.style.transform = "translateY(0)"; }}
              >
                View My Work ◈
              </button>
              <button onClick={() => setActive("contact")} style={{
                padding: "16px 40px",
                borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}>
                Get In Touch
              </button>
            </div>

            {/* Depth indicator */}
            <div style={{
              position: "absolute",
              right: "48px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{ fontSize: "9px", color: "rgba(0,255,209,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl" }}>DEPTH</div>
              <div style={{ width: "1px", height: "120px", background: `linear-gradient(180deg, ${ACCENT}44, transparent)` }} />
              <div style={{ fontSize: "9px", color: "rgba(0,255,209,0.4)", letterSpacing: "0.1em" }}>∞</div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <OceanHead n="01" t="About" accent={ACCENT} time={time} />
            <p style={{ fontSize: "20px", lineHeight: "1.9", color: "rgba(255,255,255,0.6)", marginBottom: "48px", maxWidth: "600px" }}>{bio}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: `rgba(0,255,209,0.06)`, borderRadius: "16px", overflow: "hidden" }}>
              {[
                { label: "Location", value: location },
                { label: "Email", value: email },
                { label: "GitHub", value: github },
                { label: "LinkedIn", value: linkedin },
              ].map((item, i) => (
                <div key={i} style={{ padding: "28px", background: "rgba(2,11,24,0.98)" }}>
                  <div style={{ fontSize: "10px", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", textShadow: `0 0 8px ${ACCENT}44` }}>{item.label}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {active === "skills" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <OceanHead n="02" t="Skills" accent={ACCENT} time={time} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {skills.map((skill, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "100px",
                    border: `1px solid`,
                    borderColor: hoveredSkill === i ? ACCENT : "rgba(0,255,209,0.12)",
                    background: hoveredSkill === i ? "rgba(0,255,209,0.08)" : "rgba(0,255,209,0.03)",
                    color: hoveredSkill === i ? ACCENT : "rgba(255,255,255,0.4)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "default",
                    transition: "all 0.2s",
                    boxShadow: hoveredSkill === i ? `0 0 20px rgba(0,255,209,0.2)` : "none",
                    textShadow: hoveredSkill === i ? `0 0 12px ${ACCENT}66` : "none",
                  }}>
                  {hoveredSkill === i ? "◈ " : ""}{skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {active === "projects" && (
          <div style={{ padding: "80px", maxWidth: "900px" }}>
            <OceanHead n="03" t="Projects" accent={ACCENT} time={time} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {projects.map((p, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    padding: "36px",
                    background: hoveredProject === i ? "rgba(0,255,209,0.04)" : "rgba(255,255,255,0.01)",
                    borderLeft: hoveredProject === i ? `2px solid ${ACCENT}` : "2px solid transparent",
                    transition: "all 0.25s",
                    cursor: "default",
                    boxShadow: hoveredProject === i ? `inset 0 0 60px rgba(0,255,209,0.03)` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: hoveredProject === i ? "#fff" : "rgba(255,255,255,0.6)", letterSpacing: "-0.02em", transition: "color 0.2s", textShadow: hoveredProject === i ? `0 0 30px rgba(0,255,209,0.2)` : "none" }}>
                      {p.title}
                    </div>
                    <span style={{ fontSize: "11px", color: ACCENT, fontWeight: "700", textShadow: `0 0 8px ${ACCENT}44` }}>0{i + 1}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: "1.7", marginBottom: "16px" }}>{p.description}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(Array.isArray(p.tech) ? p.tech : p.techStack || []).map((t, j) => (
                      <span key={j} style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: `rgba(0,255,209,0.06)`,
                        color: ACCENT,
                        border: `1px solid rgba(0,255,209,0.15)`,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {active === "experience" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <OceanHead n="04" t="Experience" accent={ACCENT} time={time} />
            {experience.map((e, i) => (
              <div key={i} style={{
                padding: "32px 0",
                borderBottom: "1px solid rgba(0,255,209,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "10px", color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", textShadow: `0 0 8px ${ACCENT}44` }}>
                    ◈ {e.company}
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "-0.02em" }}>{e.role}</div>
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontWeight: "500" }}>{e.period}</div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACT */}
        {active === "contact" && (
          <div style={{ padding: "80px", maxWidth: "600px" }}>
            <OceanHead n="05" t="Contact" accent={ACCENT} time={time} />
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.35)", marginBottom: "48px", lineHeight: "1.7", maxWidth: "440px" }}>
              Open to interesting projects, collaborations, or a good technical conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: `rgba(0,255,209,0.06)`, borderRadius: "16px", overflow: "hidden" }}>
              {[
                { label: "Email", value: email },
                { label: "GitHub", value: github },
                { label: "LinkedIn", value: linkedin },
                { label: "Location", value: location },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "22px 28px",
                  background: "rgba(2,11,24,0.98)",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `rgba(0,255,209,0.04)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(2,11,24,0.98)"; }}
                >
                  <span style={{ fontSize: "10px", color: ACCENT, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: "700", textShadow: `0 0 8px ${ACCENT}44` }}>{item.label}</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function OceanHead({ n, t, accent, time }) {
  return (
    <div style={{ marginBottom: "56px" }}>
      <div style={{ fontSize: "10px", color: accent, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px", textShadow: `0 0 12px ${accent}` }}>
        <div style={{ width: `${24 + Math.sin(time * 1.5) * 8}px`, height: "1px", background: `linear-gradient(90deg, transparent, ${accent})`, transition: "width 0.1s" }} />
        {n} — Introduction
      </div>
      <h2 style={{ fontSize: "56px", fontWeight: "900", letterSpacing: "-0.04em", color: "#fff", margin: 0, textShadow: `0 0 60px rgba(0,255,209,0.15)` }}>{t}</h2>
    </div>
  );
}