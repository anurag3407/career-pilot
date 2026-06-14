import { useState, useEffect, useRef } from "react";

const defaultData = {
  name: "Alex Rivera",
  title: "Full Stack Developer & Creative Technologist",
  subtitle: "Building the future, one line of code at a time.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "San Francisco, CA",
  bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications. I love turning complex problems into elegant solutions.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "Rust"],
  projects: [
    { title: "NeuralLink", description: "AI analytics platform processing 10M+ events/day with sub-100ms response.", tech: ["Python", "TensorFlow", "React"] },
    { title: "QuantumDB", description: "Distributed database with sub-millisecond query times at any scale.", tech: ["Rust", "Kafka", "PostgreSQL"] },
    { title: "StellarAPI", description: "Open-source REST framework with 5K+ GitHub stars and 80K weekly downloads.", tech: ["Node.js", "TypeScript", "Docker"] },
  ],
  experience: [
    { company: "Google", role: "Senior Software Engineer", period: "2022 — Present" },
    { company: "Stripe", role: "Software Engineer", period: "2020 — 2022" },
    { company: "Figma", role: "Frontend Engineer", period: "2018 — 2020" },
  ],
  stats: [{ label: "Years Exp", value: "5+" }, { label: "Projects", value: "48+" }, { label: "Clients", value: "32+" }],
};

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

function Blob({ cx, cy, r, color, speed, offset }) {
  const [pos, setPos] = useState({ x: cx, y: cy });
  const timeRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = (t) => {
      timeRef.current = t / 1000;
      const s = timeRef.current * speed + offset;
      setPos({
        x: cx + Math.sin(s * 0.7) * 15 + Math.cos(s * 0.3) * 10,
        y: cy + Math.cos(s * 0.5) * 12 + Math.sin(s * 0.8) * 8,
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cx, cy, speed, offset]);

  return (
    <div style={{
      position: "absolute",
      left: `${pos.x}%`,
      top: `${pos.y}%`,
      width: `${r * 2}px`,
      height: `${r * 2}px`,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: color,
      filter: "blur(60px)",
      opacity: 0.5,
      transition: "left 0.1s ease, top 0.1s ease",
      pointerEvents: "none",
    }} />
  );
}

const BLOBS = [
  { cx: 20, cy: 30, r: 200, color: "#7C3AED", speed: 0.4, offset: 0 },
  { cx: 75, cy: 20, r: 180, color: "#2563EB", speed: 0.3, offset: 2 },
  { cx: 50, cy: 70, r: 220, color: "#EC4899", speed: 0.5, offset: 4 },
  { cx: 85, cy: 60, r: 160, color: "#0EA5E9", speed: 0.35, offset: 1 },
  { cx: 15, cy: 75, r: 170, color: "#8B5CF6", speed: 0.45, offset: 3 },
];

const CARD_COLORS = ["#7C3AED", "#2563EB", "#EC4899"];

export default function One_Pixel_Master({ portfolioData }) {
  const data = portfolioData || defaultData;
  const [active, setActive] = useState("home");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const name = data.name || defaultData.name;
  const title = data.title || defaultData.title;
  const subtitle = data.subtitle || defaultData.subtitle;
  const bio = data.bio || defaultData.bio;
  const skills = Array.isArray(data.skills)
    ? data.skills.map(s => typeof s === "string" ? s : s.name)
    : defaultData.skills;
  const projects = data.projects || defaultData.projects;
  const experience = data.experience || defaultData.experience;
  const stats = data.stats || defaultData.stats;
  const email = data.email || defaultData.email;
  const github = data.github || defaultData.github;
  const linkedin = data.linkedin || defaultData.linkedin;
  const location = data.location || defaultData.location;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        background: "#030712",
        minHeight: "100vh",
        color: "#fff",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Animated blobs background */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        {BLOBS.map((b, i) => <Blob key={i} {...b} />)}
        {/* Glass overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(80px)",
          background: "rgba(3,7,18,0.6)",
        }} />
        {/* Mouse light */}
        <div style={{
          position: "absolute",
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          width: "600px",
          height: "600px",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "left 0.3s ease, top 0.3s ease",
        }} />
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
        background: "rgba(3,7,18,0.7)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          fontSize: "15px",
          fontWeight: "800",
          color: "#fff",
          letterSpacing: "-0.02em",
        }}>
          <span style={{ color: "#7C3AED" }}>✦</span> {name.split(" ")[0]}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)} style={{
              padding: "8px 18px",
              borderRadius: "100px",
              border: "none",
              background: active === s ? "rgba(124,58,237,0.2)" : "transparent",
              color: active === s ? "#A78BFA" : "rgba(255,255,255,0.4)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
              outline: active === s ? "1px solid rgba(124,58,237,0.4)" : "none",
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HOME */}
        {active === "home" && (
          <div style={{
            minHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#7C3AED",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{ width: "32px", height: "1px", background: "#7C3AED" }} />
              Portfolio — {new Date().getFullYear()}
            </div>

            <h1 style={{
              fontSize: "clamp(56px, 9vw, 112px)",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
              margin: "0 0 24px",
              color: "#fff",
              textShadow: "0 0 120px rgba(124,58,237,0.4)",
            }}>
              {name.split(" ").map((word, i) => (
                <span key={i} style={{
                  display: "block",
                  color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)",
                }}>
                  {word}
                </span>
              ))}
            </h1>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}>
              <div style={{ width: "48px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", fontWeight: "400", margin: 0 }}>{title}</p>
            </div>

            <p style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.25)",
              fontStyle: "italic",
              marginBottom: "56px",
              marginLeft: "64px",
            }}>"{subtitle}"</p>

            <div style={{ display: "flex", gap: "40px", marginBottom: "56px" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "40px", fontWeight: "900", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setActive("projects")} style={{
                padding: "16px 36px",
                borderRadius: "100px",
                border: "none",
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 0 40px rgba(124,58,237,0.4)",
                letterSpacing: "0.02em",
                transition: "box-shadow 0.3s, transform 0.2s",
              }}
                onMouseEnter={e => { e.target.style.boxShadow = "0 0 60px rgba(124,58,237,0.7)"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.boxShadow = "0 0 40px rgba(124,58,237,0.4)"; e.target.style.transform = "translateY(0)"; }}
              >
                View My Work ✦
              </button>
              <button onClick={() => setActive("contact")} style={{
                padding: "16px 36px",
                borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                letterSpacing: "0.02em",
              }}>
                Get In Touch
              </button>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <SHead n="01" t="About" />
            <p style={{ fontSize: "20px", lineHeight: "1.9", color: "rgba(255,255,255,0.65)", marginBottom: "48px", maxWidth: "600px" }}>{bio}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
              {[
                { icon: "📍", label: "Location", value: location },
                { icon: "✉️", label: "Email", value: email },
                { icon: "🐙", label: "GitHub", value: github },
                { icon: "💼", label: "LinkedIn", value: linkedin },
              ].map((item, i) => (
                <div key={i} style={{ padding: "28px", background: "rgba(3,7,18,0.95)" }}>
                  <div style={{ fontSize: "10px", color: "#7C3AED", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>{item.icon} {item.label}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: "400" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {active === "skills" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <SHead n="02" t="Skills" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {skills.map((skill, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "100px",
                    border: "1px solid",
                    borderColor: hoveredSkill === i ? "#7C3AED" : "rgba(255,255,255,0.08)",
                    background: hoveredSkill === i ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                    color: hoveredSkill === i ? "#A78BFA" : "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "default",
                    transition: "all 0.2s",
                    backdropFilter: "blur(8px)",
                  }}>
                  {hoveredSkill === i ? "✦ " : ""}{skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {active === "projects" && (
          <div style={{ padding: "80px", maxWidth: "900px" }}>
            <SHead n="03" t="Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderRadius: "16px", overflow: "hidden" }}>
              {projects.map((p, i) => {
                const hovered = hoveredProject === i;
                const accent = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <div key={i}
                    onMouseEnter={() => setHoveredProject(i)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={{
                      padding: "36px 40px",
                      background: hovered ? `rgba(${accent === "#7C3AED" ? "124,58,237" : accent === "#2563EB" ? "37,99,235" : "236,72,153"},0.1)` : "rgba(255,255,255,0.02)",
                      borderLeft: hovered ? `3px solid ${accent}` : "3px solid transparent",
                      transition: "all 0.25s",
                      cursor: "default",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: hovered ? "#fff" : "rgba(255,255,255,0.7)", letterSpacing: "-0.02em", transition: "color 0.2s" }}>{p.title}</div>
                      <span style={{ fontSize: "11px", color: accent, fontWeight: "700" }}>0{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7", marginBottom: "16px" }}>{p.description}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {(Array.isArray(p.tech) ? p.tech : [p.tech]).map((t, j) => (
                        <span key={j} style={{
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: `${accent}18`,
                          color: accent,
                          border: `1px solid ${accent}30`,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {active === "experience" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <SHead n="04" t="Experience" />
            {experience.map((e, i) => (
              <div key={i} style={{
                padding: "32px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>✦ {e.company}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", letterSpacing: "-0.02em" }}>{e.role}</div>
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontWeight: "500" }}>{e.period}</div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACT */}
        {active === "contact" && (
          <div style={{ padding: "80px", maxWidth: "600px" }}>
            <SHead n="05" t="Contact" />
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginBottom: "48px", lineHeight: "1.7", maxWidth: "440px" }}>
              Open to interesting projects, collaborations, or a good technical conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderRadius: "16px", overflow: "hidden" }}>
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
                  background: "rgba(255,255,255,0.02)",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <span style={{ fontSize: "10px", color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "700" }}>{item.label}</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SHead({ n, t }) {
  return (
    <div style={{ marginBottom: "56px" }}>
      <div style={{ fontSize: "10px", color: "#7C3AED", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>
        ✦ {n} — Introduction
      </div>
      <h2 style={{ fontSize: "56px", fontWeight: "900", letterSpacing: "-0.04em", color: "#fff", margin: 0, textShadow: "0 0 60px rgba(124,58,237,0.3)" }}>{t}</h2>
    </div>
  );
}