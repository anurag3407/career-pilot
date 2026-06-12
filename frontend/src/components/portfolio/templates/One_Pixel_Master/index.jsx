import { useState, useEffect, useRef } from "react";

const defaultData = {
  name: "Alex Morgan",
  title: "Software Engineer",
  subtitle: "Building clean, purposeful software — one pixel at a time.",
  email: "alex@example.com",
  phone: "+1 (555) 000-0000",
  location: "San Francisco, CA",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  website: "https://example.com",
  bio: "I believe great software is invisible — it just works. I obsess over the details that others overlook: the spacing between elements, the speed of a response, the clarity of an error message. Every pixel has a purpose.",
  skills: [
    { category: "Languages", items: ["TypeScript", "Python", "Rust", "Go"] },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "WebGL"] },
    { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
  ],
  experience: [
    {
      company: "Stripe",
      role: "Senior Software Engineer",
      period: "2022 — Present",
      bullets: [
        "Led migration of payment processing pipeline, reducing latency by 40%",
        "Architected real-time fraud detection system processing 10M+ daily transactions",
        "Mentored 4 junior engineers, conducting weekly technical deep-dives",
      ],
    },
    {
      company: "Figma",
      role: "Software Engineer",
      period: "2020 — 2022",
      bullets: [
        "Built collaborative editing features used by 4M+ designers worldwide",
        "Optimized canvas rendering engine, achieving 60fps on low-end devices",
        "Reduced bundle size by 35% through systematic code splitting",
      ],
    },
  ],
  projects: [
    {
      title: "Kernel",
      description: "A minimal operating system written in Rust. Boots in 120ms, supports 64-bit protected mode, custom memory allocator.",
      tech: ["Rust", "Assembly", "QEMU"],
      url: "https://github.com",
    },
    {
      title: "Pixel DB",
      description: "Embedded key-value store with B-tree indexing. Handles 500K writes/sec on commodity hardware with ACID guarantees.",
      tech: ["Go", "B-tree", "WAL"],
      url: "https://github.com",
    },
    {
      title: "Latency.io",
      description: "Real-time global network latency monitoring tool. Tracks 10,000+ endpoints with 1-second granularity and anomaly detection.",
      tech: ["TypeScript", "WebSockets", "D3.js"],
      url: "https://github.com",
    },
  ],
};

const LINE = () => (
  <div style={{
    width: "100%",
    height: "1px",
    background: "#000",
    margin: "0",
  }} />
);

const DOT = () => (
  <span style={{
    display: "inline-block",
    width: "1px",
    height: "1px",
    background: "#000",
    margin: "0 12px",
    verticalAlign: "middle",
  }} />
);

export default function One_Pixel_Master({ data: propData }) {
  const data = propData || defaultData;
  const [activeSection, setActiveSection] = useState("about");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navItems = ["about", "skills", "experience", "projects", "contact"];

  const styles = {
    container: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      background: "#fafafa",
      color: "#000",
      minHeight: "100vh",
      fontSize: "13px",
      lineHeight: "1.6",
      letterSpacing: "0.01em",
    },
    header: {
      padding: "60px 80px 40px",
      background: "#fff",
      borderBottom: "1px solid #000",
    },
    name: {
      fontSize: "42px",
      fontWeight: "900",
      letterSpacing: "-0.03em",
      lineHeight: "1",
      marginBottom: "8px",
      color: "#000",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: "0",
      marginBottom: "16px",
      color: "#000",
      fontSize: "12px",
      fontWeight: "500",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    subtitle: {
      fontSize: "15px",
      color: "#444",
      fontWeight: "400",
      maxWidth: "560px",
      lineHeight: "1.5",
    },
    nav: {
      display: "flex",
      borderBottom: "1px solid #000",
      background: "#fff",
      position: "sticky",
      top: "0",
      zIndex: 10,
    },
    navItem: (active) => ({
      padding: "16px 32px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      cursor: "pointer",
      borderRight: "1px solid #000",
      background: active ? "#000" : "#fff",
      color: active ? "#fff" : "#000",
      transition: "background 0.15s, color 0.15s",
      userSelect: "none",
    }),
    main: {
      padding: "60px 80px",
      maxWidth: "900px",
    },
    sectionTitle: {
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#000",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    sectionLine: {
      flex: 1,
      height: "1px",
      background: "#000",
    },
    bio: {
      fontSize: "16px",
      lineHeight: "1.8",
      color: "#222",
      fontWeight: "400",
      maxWidth: "600px",
      marginBottom: "48px",
    },
    contactGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0",
      border: "1px solid #000",
      marginBottom: "48px",
    },
    contactItem: {
      padding: "16px 20px",
      borderBottom: "1px solid #000",
      borderRight: "1px solid #000",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    contactLabel: {
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#888",
    },
    contactValue: {
      fontSize: "13px",
      color: "#000",
      fontWeight: "500",
    },
    skillGroup: {
      marginBottom: "32px",
    },
    skillCategory: {
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#888",
      marginBottom: "12px",
    },
    skillList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0",
    },
    skillItem: {
      padding: "8px 16px",
      border: "1px solid #000",
      fontSize: "12px",
      fontWeight: "500",
      marginRight: "-1px",
      marginBottom: "-1px",
      background: "#fff",
      color: "#000",
      cursor: "default",
      transition: "background 0.1s, color 0.1s",
    },
    expItem: {
      borderLeft: "1px solid #000",
      paddingLeft: "24px",
      marginBottom: "40px",
      position: "relative",
    },
    expDot: {
      position: "absolute",
      left: "-1px",
      top: "6px",
      width: "1px",
      height: "16px",
      background: "#000",
    },
    expCompany: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#000",
      marginBottom: "2px",
    },
    expMeta: {
      fontSize: "11px",
      color: "#888",
      marginBottom: "12px",
      display: "flex",
      gap: "16px",
    },
    expBullet: {
      fontSize: "13px",
      color: "#333",
      marginBottom: "6px",
      paddingLeft: "12px",
      position: "relative",
    },
    projectCard: (hovered) => ({
      border: "1px solid #000",
      padding: "28px",
      marginBottom: "-1px",
      background: hovered ? "#000" : "#fff",
      color: hovered ? "#fff" : "#000",
      transition: "background 0.2s, color 0.2s",
      cursor: "pointer",
    }),
    projectTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "8px",
      letterSpacing: "-0.01em",
    },
    projectDesc: (hovered) => ({
      fontSize: "13px",
      color: hovered ? "#ccc" : "#555",
      lineHeight: "1.6",
      marginBottom: "16px",
      maxWidth: "500px",
    }),
    techList: (hovered) => ({
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    }),
    techTag: (hovered) => ({
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "4px 8px",
      border: `1px solid ${hovered ? "#fff" : "#000"}`,
      color: hovered ? "#fff" : "#000",
    }),
    footer: {
      borderTop: "1px solid #000",
      padding: "24px 80px",
      background: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "10px",
      color: "#888",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
  };

  return (
    <div style={styles.container} ref={containerRef}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.name}>{data.name || defaultData.name}</div>
        <div style={styles.titleRow}>
          <span>{data.title || defaultData.title}</span>
          <DOT />
          <span>{data.location || defaultData.location}</span>
        </div>
        <div style={styles.subtitle}>{data.subtitle || defaultData.subtitle}</div>
      </div>

      <LINE />

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <div
            key={item}
            style={styles.navItem(activeSection === item)}
            onClick={() => setActiveSection(item)}
          >
            {item}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <div style={styles.main}>

        {/* About */}
        {activeSection === "about" && (
          <div>
            <div style={styles.sectionTitle}>
              <span>About</span>
              <div style={styles.sectionLine} />
            </div>
            <p style={styles.bio}>{data.bio || defaultData.bio}</p>

            <div style={styles.sectionTitle}>
              <span>Contact</span>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.contactGrid}>
              {[
                { label: "Email", value: data.email || defaultData.email },
                { label: "Phone", value: data.phone || defaultData.phone },
                { label: "Location", value: data.location || defaultData.location },
                { label: "Website", value: data.website || defaultData.website },
                { label: "GitHub", value: data.github || defaultData.github },
                { label: "LinkedIn", value: data.linkedin || defaultData.linkedin },
              ].map((item, i) => (
                <div key={i} style={styles.contactItem}>
                  <span style={styles.contactLabel}>{item.label}</span>
                  <span style={styles.contactValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <div>
            <div style={styles.sectionTitle}>
              <span>Skills</span>
              <div style={styles.sectionLine} />
            </div>
            {(data.skills || defaultData.skills).map((group, i) => (
              <div key={i} style={styles.skillGroup}>
                <div style={styles.skillCategory}>{group.category}</div>
                <div style={styles.skillList}>
                  {group.items.map((skill, j) => (
                    <div
                      key={j}
                      style={styles.skillItem}
                      onMouseEnter={e => {
                        e.target.style.background = "#000";
                        e.target.style.color = "#fff";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "#fff";
                        e.target.style.color = "#000";
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {activeSection === "experience" && (
          <div>
            <div style={styles.sectionTitle}>
              <span>Experience</span>
              <div style={styles.sectionLine} />
            </div>
            {(data.experience || defaultData.experience).map((exp, i) => (
              <div key={i} style={styles.expItem}>
                <div style={styles.expDot} />
                <div style={styles.expCompany}>{exp.company}</div>
                <div style={styles.expMeta}>
                  <span>{exp.role}</span>
                  <span>{exp.period}</span>
                </div>
                {exp.bullets.map((bullet, j) => (
                  <div key={j} style={styles.expBullet}>
                    — {bullet}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSection === "projects" && (
          <div>
            <div style={styles.sectionTitle}>
              <span>Projects</span>
              <div style={styles.sectionLine} />
            </div>
            {(data.projects || defaultData.projects).map((project, i) => (
              <div
                key={i}
                style={styles.projectCard(hoveredProject === i)}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => project.url && window.open(project.url, "_blank")}
              >
                <div style={styles.projectTitle}>{project.title}</div>
                <div style={styles.projectDesc(hoveredProject === i)}>
                  {project.description}
                </div>
                <div style={styles.techList(hoveredProject === i)}>
                  {project.tech.map((t, j) => (
                    <span key={j} style={styles.techTag(hoveredProject === i)}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        {activeSection === "contact" && (
          <div>
            <div style={styles.sectionTitle}>
              <span>Get in Touch</span>
              <div style={styles.sectionLine} />
            </div>
            <p style={{ ...styles.bio, marginBottom: "40px" }}>
              I'm always open to interesting conversations, collaborations, or just a good technical debate. Reach out through any channel below.
            </p>
            <div style={styles.contactGrid}>
              {[
                { label: "Email", value: data.email || defaultData.email },
                { label: "GitHub", value: data.github || defaultData.github },
                { label: "LinkedIn", value: data.linkedin || defaultData.linkedin },
                { label: "Website", value: data.website || defaultData.website },
              ].map((item, i) => (
                <div key={i} style={styles.contactItem}>
                  <span style={styles.contactLabel}>{item.label}</span>
                  <span style={styles.contactValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <LINE />
      <div style={styles.footer}>
        <span>{data.name || defaultData.name} — Portfolio</span>
        <span>One Pixel Master</span>
        <span>Built with Career Pilot</span>
      </div>

    </div>
  );
}