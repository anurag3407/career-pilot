import { useState, useEffect, useRef } from "react";

const defaultData = {
  name: "Alex Morgan",
  title: "Software Engineer",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  bio: "I build things for the web. Passionate about clean code, great UX, and coffee.",
  skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
  projects: [
    { title: "Project Alpha", description: "A full-stack web application built with React and Node.js.", tech: "React, Node.js, MongoDB" },
    { title: "Project Beta", description: "Machine learning pipeline for real-time data analysis.", tech: "Python, TensorFlow, AWS" },
    { title: "Project Gamma", description: "Open source CLI tool with 2k+ GitHub stars.", tech: "Go, Docker, GitHub Actions" },
  ],
  experience: [
    { company: "Google", role: "Software Engineer", period: "2022 — Present" },
    { company: "Startup XYZ", role: "Full Stack Developer", period: "2020 — 2022" },
  ],
};

const COLORS = [
  "#FF0080", "#00FF80", "#0080FF", "#FF8000",
  "#8000FF", "#FF0000", "#00FFFF", "#FFFF00",
];

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

export default function Bouncing_DVD_Logo({ data: propData }) {
  const data = propData || defaultData;
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velRef = useRef({ x: 2.5, y: 2 });
  const colorIdxRef = useRef(0);

  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [color, setColor] = useState(COLORS[0]);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const LOGO_W = 180;
  const LOGO_H = 80;

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;
      if (!container) return;
      const W = container.clientWidth;
      const H = container.clientHeight;

      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;
      let hit = false;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx = Math.abs(vx); hit = true; }
      if (x + LOGO_W >= W) { x = W - LOGO_W; vx = -Math.abs(vx); hit = true; }
      if (y <= 0) { y = 0; vy = Math.abs(vy); hit = true; }
      if (y + LOGO_H >= H) { y = H - LOGO_H; vy = -Math.abs(vy); hit = true; }

      if (hit) {
        colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length;
        setColor(COLORS[colorIdxRef.current]);
      }

      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };
      setPos({ x, y });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const styles = {
    outer: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      borderBottom: "1px solid #222",
      background: "#0a0a0a",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navBrand: {
      fontSize: "14px",
      fontWeight: "700",
      color: color,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      transition: "color 0.3s",
    },
    navLinks: {
      display: "flex",
      gap: "24px",
    },
    navLink: (active) => ({
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: active ? color : "#888",
      cursor: "pointer",
      transition: "color 0.2s",
      background: "none",
      border: "none",
    }),
    hero: {
      position: "relative",
      height: "80vh",
      overflow: "hidden",
      background: "#000",
      cursor: "default",
    },
    logo: {
      position: "absolute",
      left: pos.x,
      top: pos.y,
      width: LOGO_W,
      height: LOGO_H,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `3px solid ${color}`,
      borderRadius: "8px",
      transition: "border-color 0.1s, color 0.1s",
      userSelect: "none",
      cursor: "pointer",
    },
    logoName: {
      fontSize: "15px",
      fontWeight: "900",
      color: color,
      letterSpacing: "-0.02em",
      lineHeight: "1",
      transition: "color 0.1s",
    },
    logoTitle: {
      fontSize: "9px",
      color: color,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginTop: "4px",
      opacity: 0.8,
      transition: "color 0.1s",
    },
    heroHint: {
      position: "absolute",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "10px",
      color: "#444",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    },
    content: {
      padding: "60px 80px",
      maxWidth: "900px",
      margin: "0 auto",
      width: "100%",
    },
    sectionTitle: {
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: color,
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      transition: "color 0.3s",
    },
    sectionLine: {
      flex: 1,
      height: "1px",
      background: "#222",
    },
    bio: {
      fontSize: "18px",
      lineHeight: "1.8",
      color: "#ccc",
      marginBottom: "40px",
      maxWidth: "600px",
    },
    skillsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
    },
    skillTag: {
      padding: "8px 16px",
      border: `1px solid ${color}`,
      color: color,
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "0.05em",
      borderRadius: "4px",
      transition: "background 0.2s, color 0.2s, border-color 0.3s",
    },
    projectCard: {
      border: "1px solid #222",
      padding: "24px",
      marginBottom: "-1px",
      background: "#111",
      transition: "border-color 0.2s",
    },
    projectTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "8px",
    },
    projectDesc: {
      fontSize: "13px",
      color: "#888",
      marginBottom: "12px",
      lineHeight: "1.6",
    },
    projectTech: {
      fontSize: "11px",
      color: color,
      fontWeight: "600",
      letterSpacing: "0.05em",
      transition: "color 0.3s",
    },
    expItem: {
      padding: "20px 0",
      borderBottom: "1px solid #1a1a1a",
    },
    expCompany: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#fff",
      marginBottom: "4px",
    },
    expRole: {
      fontSize: "13px",
      color: "#888",
    },
    expPeriod: {
      fontSize: "11px",
      color: color,
      marginTop: "4px",
      transition: "color 0.3s",
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    contactItem: {
      padding: "20px",
      border: `1px solid #222`,
      background: "#111",
    },
    contactLabel: {
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#555",
      marginBottom: "4px",
    },
    contactValue: {
      fontSize: "14px",
      color: color,
      fontWeight: "600",
      transition: "color 0.3s",
    },
    footer: {
      padding: "24px 80px",
      borderTop: "1px solid #1a1a1a",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "10px",
      color: "#444",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
  };

  return (
    <div style={styles.outer}>
      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.navBrand}>{data.name || defaultData.name}</span>
        <div style={styles.navLinks}>
          {SECTIONS.map(s => (
            <button key={s} style={styles.navLink(activeSection === s)} onClick={() => setActiveSection(s)}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero — bouncing logo */}
      {activeSection === "home" && (
        <div style={styles.hero} ref={containerRef}>
          <div
            style={styles.logo}
            onClick={() => setActiveSection("about")}
            title="Click to enter"
          >
            <div style={styles.logoName}>{(data.name || defaultData.name).split(" ")[0]}</div>
            <div style={styles.logoTitle}>{data.title || defaultData.title}</div>
          </div>
          <div style={styles.heroHint}>click the logo to enter — or use nav above</div>
        </div>
      )}

      {/* Content sections */}
      {activeSection !== "home" && (
        <div style={styles.content}>

          {activeSection === "about" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>About</span>
                <div style={styles.sectionLine} />
              </div>
              <p style={styles.bio}>{data.bio || defaultData.bio}</p>
            </div>
          )}

          {activeSection === "skills" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Skills</span>
                <div style={styles.sectionLine} />
              </div>
              <div style={styles.skillsGrid}>
                {(data.skills || defaultData.skills).map((skill, i) => (
                  <span key={i} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Projects</span>
                <div style={styles.sectionLine} />
              </div>
              {(data.projects || defaultData.projects).map((p, i) => (
                <div key={i} style={styles.projectCard}>
                  <div style={styles.projectTitle}>{p.title}</div>
                  <div style={styles.projectDesc}>{p.description}</div>
                  <div style={styles.projectTech}>{p.tech}</div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "experience" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Experience</span>
                <div style={styles.sectionLine} />
              </div>
              {(data.experience || defaultData.experience).map((e, i) => (
                <div key={i} style={styles.expItem}>
                  <div style={styles.expCompany}>{e.company}</div>
                  <div style={styles.expRole}>{e.role}</div>
                  <div style={styles.expPeriod}>{e.period}</div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "contact" && (
            <div>
              <div style={styles.sectionTitle}>
                <span>Contact</span>
                <div style={styles.sectionLine} />
              </div>
              <div style={styles.contactGrid}>
                {[
                  { label: "Email", value: data.email || defaultData.email },
                  { label: "GitHub", value: data.github || defaultData.github },
                  { label: "LinkedIn", value: data.linkedin || defaultData.linkedin },
                  { label: "Location", value: data.location || "San Francisco, CA" },
                ].map((item, i) => (
                  <div key={i} style={styles.contactItem}>
                    <div style={styles.contactLabel}>{item.label}</div>
                    <div style={styles.contactValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span>{data.name || defaultData.name}</span>
        <span>Bouncing DVD Logo</span>
        <span>Career Pilot</span>
      </div>
    </div>
  );
}
