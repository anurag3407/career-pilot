import { useState, useEffect, useRef } from "react";
import { usePortfolio, normalizePortfolioData } from "../../../../context/PortfolioContext.jsx";

const defaultData = {
  name: "Alex Rivera",
  title: "Full Stack Developer",
  subtitle: "Building the future, one line of code at a time.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  location: "San Francisco, CA",
  bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  projects: [
    { title: "NeuralLink", description: "AI analytics platform processing 10M+ events/day.", tech: ["Python", "TensorFlow", "React"] },
    { title: "QuantumDB", description: "Distributed database with sub-millisecond query times.", tech: ["Rust", "Kafka", "PostgreSQL"] },
    { title: "StellarAPI", description: "Open-source REST framework — 5K+ GitHub stars.", tech: ["Node.js", "TypeScript", "Docker"] },
  ],
  experience: [
    { company: "Google", role: "Senior Software Engineer", period: "2022 — Present" },
    { company: "Stripe", role: "Software Engineer", period: "2020 — 2022" },
    { company: "Figma", role: "Frontend Engineer", period: "2018 — 2020" },
  ],
};

const COLORS = ["#FF006E","#FF8500","#FFD60A","#06FFB4","#00D4FF","#7C3AED","#FF006E"];
const SECTIONS = ["home","about","skills","projects","experience","contact"];

const LOGO_W = 200;
const LOGO_H = 90;

export default function Bouncing_DVD_Logo({ portfolioData }) {
  const ctx = usePortfolio();
  const raw = portfolioData || ctx?.portfolioData || {};
  const normalized = normalizePortfolioData(raw);
  const d = Object.keys(normalized).length > 2 ? normalized : null;

  const name = d?.personal?.name || defaultData.name;
  const title = d?.personal?.title || defaultData.title;
  const bio = d?.personal?.bio || defaultData.bio;
  const email = d?.socials?.email || defaultData.email;
  const github = d?.socials?.github || defaultData.github;
  const linkedin = d?.socials?.linkedin || defaultData.linkedin;
  const location = d?.personal?.location || defaultData.location;
  const rawSkills = d?.skills || defaultData.skills;
  const skills = Array.isArray(rawSkills) ? rawSkills.map(s => typeof s === "string" ? s : s.name) : defaultData.skills;
  const projects = d?.projects || defaultData.projects;
  const experience = d?.experience || defaultData.experience;

  const [active, setActive] = useState("home");
  const [pos, setPos] = useState({ x: 200, y: 150 });
  const [vel, setVel] = useState({ x: 2.8, y: 1.9 });
  const [colorIdx, setColorIdx] = useState(0);
  const [trail, setTrail] = useState([]);
  const [bounceFlash, setBounceFlash] = useState(false);
  const containerRef = useRef(null);
  const posRef = useRef({ x: 200, y: 150 });
  const velRef = useRef({ x: 2.8, y: 1.9 });
  const colorIdxRef = useRef(0);
  const rafRef = useRef(null);

  const color = COLORS[colorIdx];

  useEffect(() => {
    if (active !== "home") return;
    const animate = () => {
      const container = containerRef.current;
      if (!container) { rafRef.current = requestAnimationFrame(animate); return; }
      const W = container.clientWidth;
      const H = container.clientHeight;
      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;
      let hit = false;
      x += vx; y += vy;
      if (x <= 0) { x = 0; vx = Math.abs(vx); hit = true; }
      if (x + LOGO_W >= W) { x = W - LOGO_W; vx = -Math.abs(vx); hit = true; }
      if (y <= 0) { y = 0; vy = Math.abs(vy); hit = true; }
      if (y + LOGO_H >= H) { y = H - LOGO_H; vy = -Math.abs(vy); hit = true; }
      if (hit) {
        colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
        setColorIdx(colorIdxRef.current);
        setBounceFlash(true);
        setTimeout(() => setBounceFlash(false), 150);
      }
      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };
      setPos({ x, y });
      setTrail(prev => [...prev.slice(-12), { x, y, id: Date.now() }]);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <div style={{
      fontFamily: "'Inter','Helvetica Neue',sans-serif",
      background: "#060606",
      minHeight: "100vh",
      color: "#fff",
    }}>
      {/* Screen flash on bounce */}
      {bounceFlash && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: `${color}18`,
          zIndex: 200,
          pointerEvents: "none",
          transition: "background 0.1s",
        }} />
      )}

      {/* Nav */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        background: "rgba(6,6,6,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${color}22`,
        transition: "border-color 0.3s",
      }}>
        <div style={{ fontSize: "15px", fontWeight: "800", color, letterSpacing: "-0.02em", transition: "color 0.3s", textShadow: `0 0 20px ${color}66` }}>
          ◆ {name.split(" ")[0]}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)} style={{
              padding: "8px 18px",
              borderRadius: "100px",
              border: "none",
              background: active === s ? `${color}18` : "transparent",
              color: active === s ? color : "rgba(255,255,255,0.35)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
              outline: active === s ? `1px solid ${color}44` : "none",
              transition: "all 0.3s",
              textShadow: active === s ? `0 0 10px ${color}66` : "none",
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* HOME — bouncing logo */}
      {active === "home" && (
        <div ref={containerRef} style={{
          position: "relative",
          height: "88vh",
          overflow: "hidden",
          background: "#060606",
          cursor: "none",
        }}>
          {/* Grid lines */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />

          {/* Trail */}
          {trail.map((t, i) => (
            <div key={t.id} style={{
              position: "absolute",
              left: t.x + LOGO_W / 2 - 4,
              top: t.y + LOGO_H / 2 - 4,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: color,
              opacity: (i / trail.length) * 0.4,
              transform: "translate(-50%,-50%)",
              filter: `blur(${(trail.length - i) * 1}px)`,
              pointerEvents: "none",
            }} />
          ))}

          {/* The bouncing logo */}
          <div
            onClick={() => setActive("about")}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: LOGO_W,
              height: LOGO_H,
              border: `2px solid ${color}`,
              borderRadius: "12px",
              background: `${color}08`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: `0 0 30px ${color}44, 0 0 60px ${color}22, inset 0 0 30px ${color}06`,
              transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
              userSelect: "none",
            }}
          >
            <div style={{
              fontSize: "18px",
              fontWeight: "900",
              color,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textShadow: `0 0 20px ${color}`,
              transition: "color 0.3s",
            }}>
              {name.split(" ")[0].toUpperCase()}
            </div>
            <div style={{
              fontSize: "8px",
              color,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "4px",
              opacity: 0.7,
              transition: "color 0.3s",
            }}>
              {title.split(" ").slice(0, 2).join(" ")}
            </div>
          </div>

          {/* Corner glow when logo hits */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${pos.x + LOGO_W / 2}px ${pos.y + LOGO_H / 2}px, ${color}08 0%, transparent 40%)`,
            pointerEvents: "none",
            transition: "background 0.1s",
          }} />

          {/* Hint text */}
          <div style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            Click the logo to enter · Watch it change color at every bounce
          </div>

          {/* Color display */}
          <div style={{
            position: "absolute",
            top: "24px",
            right: "32px",
            display: "flex",
            gap: "6px",
          }}>
            {COLORS.slice(0, -1).map((c, i) => (
              <div key={i} style={{
                width: i === colorIdx ? "20px" : "6px",
                height: "6px",
                borderRadius: "100px",
                background: c,
                opacity: i === colorIdx ? 1 : 0.3,
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      {active !== "home" && (
        <div style={{ padding: "80px", maxWidth: "900px", margin: "0 auto" }}>

          {active === "about" && (
            <div>
              <DVDHead t="About" n="01" color={color} />
              <p style={{ fontSize: "20px", lineHeight: "1.9", color: "rgba(255,255,255,0.6)", marginBottom: "48px", maxWidth: "600px" }}>{bio}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: `${color}12`, borderRadius: "16px", overflow: "hidden" }}>
                {[{ label: "Location", value: location }, { label: "Email", value: email }, { label: "GitHub", value: github }, { label: "LinkedIn", value: linkedin }].map((item, i) => (
                  <div key={i} style={{ padding: "28px", background: "#060606" }}>
                    <div style={{ fontSize: "10px", color, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", textShadow: `0 0 8px ${color}66` }}>{item.label}</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "skills" && (
            <div>
              <DVDHead t="Skills" n="02" color={color} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {skills.map((skill, i) => (
                  <div key={i} style={{
                    padding: "10px 22px",
                    borderRadius: "100px",
                    border: `1px solid ${color}30`,
                    background: `${color}08`,
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.color = color; e.currentTarget.style.boxShadow = `0 0 16px ${color}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "projects" && (
            <div>
              <DVDHead t="Projects" n="03" color={color} />
              {projects.map((p, i) => (
                <div key={i} style={{
                  padding: "32px",
                  marginBottom: "2px",
                  borderLeft: `2px solid ${color}44`,
                  background: "rgba(255,255,255,0.01)",
                  transition: "all 0.2s",
                  cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderLeftColor = color; e.currentTarget.style.background = `${color}04`; e.currentTarget.style.transform = "translateX(8px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderLeftColor = `${color}44`; e.currentTarget.style.background = "rgba(255,255,255,0.01)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>{p.title}</div>
                    <span style={{ fontSize: "11px", color, fontWeight: "700" }}>0{i + 1}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "14px" }}>{p.description}</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {(Array.isArray(p.tech) ? p.tech : p.techStack || []).map((t, j) => (
                      <span key={j} style={{ padding: "3px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: `${color}12`, color, border: `1px solid ${color}30` }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === "experience" && (
            <div>
              <DVDHead t="Experience" n="04" color={color} />
              {experience.map((e, i) => (
                <div key={i} style={{ padding: "28px 0", borderBottom: `1px solid rgba(255,255,255,0.04)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "10px", color, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", textShadow: `0 0 8px ${color}66` }}>◆ {e.company}</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>{e.role}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>{e.period}</div>
                </div>
              ))}
            </div>
          )}

          {active === "contact" && (
            <div>
              <DVDHead t="Contact" n="05" color={color} />
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.35)", marginBottom: "48px", lineHeight: "1.7", maxWidth: "440px" }}>
                Open to interesting projects, collaborations, or a good technical conversation.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: `${color}12`, borderRadius: "16px", overflow: "hidden" }}>
                {[{ label: "Email", value: email }, { label: "GitHub", value: github }, { label: "LinkedIn", value: linkedin }, { label: "Location", value: location }].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: "#060606", transition: "background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${color}06`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#060606"; }}
                  >
                    <span style={{ fontSize: "10px", color, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: "700" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DVDHead({ t, n, color }) {
  return (
    <div style={{ marginBottom: "56px" }}>
      <div style={{ fontSize: "10px", color, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", textShadow: `0 0 12px ${color}` }}>◆ {n} — Introduction</div>
      <h2 style={{ fontSize: "56px", fontWeight: "900", letterSpacing: "-0.04em", color: "#fff", margin: 0, textShadow: `0 0 40px ${color}22` }}>{t}</h2>
    </div>
  );
}