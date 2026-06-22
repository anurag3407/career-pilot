import { useState, useEffect, useRef } from "react";

const defaultData = {
  name: "Alex Rivera",
  title: "Full Stack Developer & Creative Technologist",
  subtitle: "Building the future, one line of code at a time.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "San Francisco, CA",
  bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications. I love turning complex problems into elegant, user-friendly solutions.",
  skills: [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "AWS", level: 75 },
    { name: "Docker", level: 70 },
    { name: "GraphQL", level: 78 },
    { name: "PostgreSQL", level: 82 },
  ],
  projects: [
    {
      title: "SoundWave AI",
      description: "Real-time audio processing with machine learning. Identifies 500+ instruments with 97% accuracy.",
      tech: ["Python", "TensorFlow", "WebAudio API"],
      color: "#FF006E",
    },
    {
      title: "Pulse Dashboard",
      description: "Live analytics platform processing 10M+ events/day with sub-100ms query response times.",
      tech: ["React", "Kafka", "ClickHouse"],
      color: "#8338EC",
    },
    {
      title: "FreqMapper",
      description: "Open-source frequency visualization library with 2K+ GitHub stars and 50K+ weekly downloads.",
      tech: ["TypeScript", "WebGL", "Canvas API"],
      color: "#3A86FF",
    },
  ],
  experience: [
    { company: "Spotify", role: "Senior Engineer", period: "2022 — Present", color: "#1DB954" },
    { company: "SoundCloud", role: "Full Stack Dev", period: "2020 — 2022", color: "#FF5500" },
    { company: "Dolby Labs", role: "Audio Engineer", period: "2018 — 2020", color: "#FF006E" },
  ],
  stats: [
    { label: "Years Exp", value: "5+" },
    { label: "Projects", value: "48+" },
    { label: "Happy Clients", value: "32+" },
  ],
};

const BAR_COUNT = 32;

function useAnimatedBars(active) {
  const [bars, setBars] = useState(() => Array.from({ length: BAR_COUNT }, () => Math.random() * 40 + 10));
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const animate = () => {
      setBars(prev => prev.map((h, i) => {
        const target = Math.random() * 80 + 10;
        return h + (target - h) * 0.15;
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return bars;
}

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

const GRADIENT_COLORS = [
  ["#FF006E", "#8338EC"],
  ["#8338EC", "#3A86FF"],
  ["#3A86FF", "#06FFB4"],
  ["#06FFB4", "#FFD60A"],
  ["#FFD60A", "#FF006E"],
];

export default function Audio_Visualizer_Frequency({ portfolioData }) {
  const data = portfolioData || defaultData;
  const [active, setActive] = useState("home");
  const [playing, setPlaying] = useState(true);
  const [gradientIdx, setGradientIdx] = useState(0);
  const bars = useAnimatedBars(playing);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setGradientIdx(i => (i + 1) % GRADIENT_COLORS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [playing]);

  const [c1, c2] = GRADIENT_COLORS[gradientIdx];

  const name = data.name || defaultData.name;
  const title = data.title || defaultData.title;
  const subtitle = data.subtitle || defaultData.subtitle;
  const bio = data.bio || defaultData.bio;
  const skills = data.skills || defaultData.skills;
  const projects = data.projects || defaultData.projects;
  const experience = data.experience || defaultData.experience;
  const stats = data.stats || defaultData.stats;
  const email = data.email || defaultData.email;
  const github = data.github || defaultData.github;
  const linkedin = data.linkedin || defaultData.linkedin;
  const location = data.location || defaultData.location;

  return (
    <div style={{
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      background: "#050505",
      minHeight: "100vh",
      color: "#fff",
      overflowX: "hidden",
    }}>

      {/* Animated gradient background */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: `radial-gradient(ellipse at 20% 50%, ${c1}22 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 20%, ${c2}22 0%, transparent 50%),
                     radial-gradient(ellipse at 50% 80%, ${c1}11 0%, transparent 50%)`,
        transition: "background 2s ease",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        background: "rgba(5,5,5,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: "800",
          color: c1,
          transition: "color 2s",
          letterSpacing: "-0.02em",   
        }}>
          {name.split(" ")[0]}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setActive(s)}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                border: "none",
                background: active === s
                  ? `linear-gradient(90deg, ${c1}, ${c2})`
                  : "transparent",
                color: active === s ? "#fff" : "#888",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
            >
              {s}
            </button>
          ))}

          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: `1px solid ${c1}`,
              background: "transparent",
              color: c1,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "8px",
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HOME */}
        {active === "home" && (
          <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px" }}>

            {/* Visualizer bars */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "3px",
              height: "120px",
              marginBottom: "48px",
            }}>
              {bars.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: `linear-gradient(to top, ${c1}, ${c2})`,
                    borderRadius: "2px 2px 0 0",
                    transition: "height 0.1s ease, background 2s ease",
                    opacity: 0.7 + (i / BAR_COUNT) * 0.3,
                  }}
                />
              ))}
            </div>

            <div style={{ maxWidth: "700px" }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: c1,
                marginBottom: "16px",
                transition: "color 2s",
              }}>
                ◆ Portfolio — {new Date().getFullYear()}
              </div>

              <h1 style={{
                fontSize: "clamp(48px, 7vw, 80px)",
                fontWeight: "900",
                lineHeight: "1",
                letterSpacing: "-0.03em",
                marginBottom: "16px",
                color: "#fff",
                textShadow: `0 0 60px ${c1}66`,
                transition: "text-shadow 2s",
              }}>
                {name}
              </h1>

              <p style={{
                fontSize: "18px",
                color: "#aaa",
                marginBottom: "8px",
                fontWeight: "500",
              }}>
                {title}
              </p>

              <p style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "40px",
                fontStyle: "italic",
              }}>
                "{subtitle}"
              </p>

              <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
                {stats.map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "32px",
                      fontWeight: "900",
                      color: c1,
                      transition: "color 2s",
                    }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() => setActive("projects")}
                  style={{
                    padding: "14px 32px",
                    borderRadius: "100px",
                    border: "none",
                    background: `linear-gradient(90deg, ${c1}, ${c2})`,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "background 2s, transform 0.2s",
                  }}
                >
                  See My Work ◆
                </button>
                <button
                  onClick={() => setActive("contact")}
                  style={{
                    padding: "14px 32px",
                    borderRadius: "100px",
                    border: `1px solid rgba(255,255,255,0.2)`,
                    background: "transparent",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Resume
                </button>
              </div>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              {[
                { label: "GH", href: github },
                { label: "LI", href: linkedin },
                { label: `@ ${email}`, href: `mailto:${email}` },
              ].map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    textDecoration: "none",
                    fontWeight: "700",
                    letterSpacing: "0.05em",
                    borderBottom: `1px solid #333`,
                    paddingBottom: "2px",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.color = c1; e.target.style.borderColor = c1; }}
                  onMouseLeave={e => { e.target.style.color = "#555"; e.target.style.borderColor = "#333"; }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {active === "about" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <SectionHeading label="About" c1={c1} c2={c2} />
            <p style={{ fontSize: "20px", lineHeight: "1.8", color: "#ccc", marginBottom: "40px" }}>{bio}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { label: "📍 Location", value: location },
                { label: "✉️ Email", value: email },
                { label: "🔗 GitHub", value: github },
                { label: "💼 LinkedIn", value: linkedin },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "16px 24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.03)",
                }}>
                  <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "13px", color: "#ddd", fontWeight: "500" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {active === "skills" && (
          <div style={{ padding: "80px", maxWidth: "800px" }}>
            <SectionHeading label="Skills" c1={c1} c2={c2} />
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {skills.map((skill, i) => {
                const level = skill.level || 75;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#ddd" }}>{skill.name}</span>
                      <span style={{ fontSize: "12px", color: "#555" }}>{level}%</span>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${level}%`,
                        background: `linear-gradient(90deg, ${c1}, ${c2})`,
                        borderRadius: "100px",
                        transition: "background 2s",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {active === "projects" && (
          <div style={{ padding: "80px", maxWidth: "900px" }}>
            <SectionHeading label="Projects" c1={c1} c2={c2} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
              {projects.map((p, i) => {
                const accent = p.color || c1;
                return (
                  <div key={i} style={{
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: `linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
                    borderLeft: `3px solid ${accent}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateX(8px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <div style={{
                      fontSize: "22px",
                      fontWeight: "800",
                      color: "#fff",
                      marginBottom: "8px",
                      letterSpacing: "-0.01em",
                    }}>{p.title}</div>
                    <p style={{ fontSize: "14px", color: "#888", lineHeight: "1.6", marginBottom: "16px" }}>{p.description}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(Array.isArray(p.tech) ? p.tech : [p.tech]).map((t, j) => (
                        <span key={j} style={{
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: `${accent}22`,
                          color: accent,
                          border: `1px solid ${accent}44`,
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
            <SectionHeading label="Experience" c1={c1} c2={c2} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {experience.map((e, i) => {
                const accent = e.color || c1;
                return (
                  <div key={i} style={{
                    padding: "28px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: accent,
                        marginBottom: "6px",
                      }}>{e.company}</div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>{e.role}</div>
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#555",
                      fontWeight: "500",
                      letterSpacing: "0.05em",
                    }}>{e.period}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTACT */}
        {active === "contact" && (
          <div style={{ padding: "80px", maxWidth: "600px" }}>
            <SectionHeading label="Contact" c1={c1} c2={c2} />
            <p style={{ fontSize: "18px", color: "#888", marginBottom: "40px", lineHeight: "1.6" }}>
              Always open to interesting projects, collaborations, or just a good technical conversation.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Email", value: email, href: `mailto:${email}` },
                { label: "GitHub", value: github, href: github },
                { label: "LinkedIn", value: linkedin, href: linkedin },
                { label: "Location", value: location, href: null },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}>
                  <span style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "700" }}>{item.label}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "14px", color: c1, textDecoration: "none", fontWeight: "500", transition: "color 2s" }}>
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ fontSize: "14px", color: "#ddd", fontWeight: "500" }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div style={{ height: "24px" }} />
    </div>
  );
}

function SectionHeading({ label, c1, c2 }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <div style={{
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: c1,
        marginBottom: "8px",
        transition: "color 2s",
      }}>
        ◆ {String(SECTIONS.indexOf(label.toLowerCase()) + 1).padStart(2, "0")} — Introduction
      </div>
      <h2 style={{
        fontSize: "48px",
        fontWeight: "900",
        letterSpacing: "-0.03em",
        margin: "0",
        color: "#fff",
        textShadow: `0 0 40px ${c2}44`,
        transition: "text-shadow 2s",
      }}>{label}</h2>
    </div>
  );
}