import { useState } from "react";
import { ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    number: "01",
    emoji: "🎨",
    title: "AI Resume Builder",
    subtitle: "Land interviews faster",
    description:
      "Generates ATS-friendly resumes tailored to job descriptions with AI-powered optimization and stunning visual templates.",
    tag: "Featured",
    tech: ["React", "OpenAI", "Node.js"],
    live: "https://example.com",
    github: "https://github.com",
    color: "#f97316",
    lightBg: "rgba(249,115,22,0.08)",
    gradientFrom: "#f97316",
    gradientTo: "#ec4899",
  },
  {
    id: 2,
    number: "02",
    emoji: "🌐",
    title: "Portfolio Generator",
    subtitle: "Live in 3 minutes",
    description:
      "Build and launch beautiful portfolio websites instantly using drag-and-drop sections and premium themes crafted by designers.",
    tag: "New",
    tech: ["Next.js", "Tailwind", "Vercel"],
    live: "https://example.com",
    github: "https://github.com",
    color: "#8b5cf6",
    lightBg: "rgba(139,92,246,0.08)",
    gradientFrom: "#8b5cf6",
    gradientTo: "#06b6d4",
  },
  {
    id: 3,
    number: "03",
    emoji: "🤖",
    title: "Interview Assistant",
    subtitle: "Practice until perfect",
    description:
      "AI mock interviews with real-time feedback on tone, confidence, communication, and technical responses to ace any interview.",
    tag: "AI-Powered",
    tech: ["Python", "FastAPI", "WebRTC"],
    live: "https://example.com",
    github: "https://github.com",
    color: "#06b6d4",
    lightBg: "rgba(6,182,212,0.08)",
    gradientFrom: "#06b6d4",
    gradientTo: "#10b981",
  },
];

/* ── Fluid SVG blob shapes ── */
function Blob({ color, style, opacity = 0.18 }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style, opacity }}
    >
      <path
        fill={color}
        d="M44.7,-62.4C56.2,-53.6,62.4,-37.8,67.3,-21.4C72.2,-5,75.7,12,70.6,26.2C65.5,40.4,51.8,51.8,37,59.7C22.2,67.6,6.3,72,-10.6,71.3C-27.5,70.6,-45.4,64.8,-57.1,53.1C-68.8,41.4,-74.3,23.7,-73.3,6.8C-72.3,-10,-64.8,-26.1,-54.4,-38.4C-44,-50.7,-30.7,-59.2,-16.6,-64.3C-2.5,-69.4,12.4,-71.1,26.5,-68.3C40.6,-65.5,53.9,-58.2,44.7,-62.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/* ── Wavy line decoration ── */
function WavyLines({ color }) {
  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.25 }}
    >
      {[0, 12, 24, 36, 48].map((y, i) => (
        <path
          key={i}
          d={`M0 ${y + 6} Q30 ${y} 60 ${y + 6} Q90 ${y + 12} 120 ${y + 6}`}
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
      ))}
    </svg>
  );
}

export default function Projects() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #fdf0ff 40%, #f0fdff 70%, #fff5f0 100%)",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "5rem",
      }}
    >
      {/* ── Global ambient blobs ── */}
      <Blob
        color="#c084fc"
        opacity={0.22}
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "420px",
          pointerEvents: "none",
        }}
      />
      <Blob
        color="#67e8f9"
        opacity={0.18}
        style={{
          position: "absolute",
          top: "30%",
          right: "-100px",
          width: "380px",
          pointerEvents: "none",
        }}
      />
      <Blob
        color="#f9a8d4"
        opacity={0.2}
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "30%",
          width: "320px",
          pointerEvents: "none",
        }}
      />

      {/* ── Scattered geometric accents ── */}
      <svg
        style={{ position: "absolute", top: "18%", left: "8%", opacity: 0.18, pointerEvents: "none" }}
        width="40" height="40" viewBox="0 0 40 40"
      >
        <circle cx="20" cy="20" r="18" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
      </svg>
      <svg
        style={{ position: "absolute", top: "60%", right: "6%", opacity: 0.15, pointerEvents: "none" }}
        width="30" height="30" viewBox="0 0 30 30"
      >
        <polygon points="15,2 28,28 2,28" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
      </svg>
      <div style={{ position: "absolute", top: "45%", left: "4%", width: "6px", height: "6px", borderRadius: "50%", background: "#f97316", opacity: 0.5 }} />
      <div style={{ position: "absolute", top: "25%", right: "12%", width: "4px", height: "4px", borderRadius: "50%", background: "#8b5cf6", opacity: 0.6 }} />

      <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>

        {/* ── Header ── */}
        <div
          style={{
            paddingTop: "4rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "999px",
              padding: "5px 14px",
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(6px)",
              marginBottom: "1.5rem",
            }}
          >
            <Sparkles size={13} style={{ color: "#f97316" }} />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6b7280",
                fontFamily: "'Helvetica Neue', sans-serif",
              }}
            >
              Abstract Art Showcase
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#1a1a2e",
              margin: "0 0 1rem",
              fontFamily: "'Georgia', serif",
            }}
          >
            Featured{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Projects
            </span>
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "1.1rem",
              maxWidth: "520px",
              lineHeight: 1.7,
              fontFamily: "'Helvetica Neue', sans-serif",
              fontWeight: 300,
            }}
          >
            Carefully crafted digital experiences inspired by modern abstract
            aesthetics — fluid, expressive, and alive.
          </p>
        </div>

        {/* ── Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: "2rem",
            paddingTop: "3rem",
          }}
        >
          {projects.map((p) => {
            const isHovered = hovered === p.id;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  borderRadius: "28px",
                  border: isHovered
                    ? `1.5px solid ${p.color}55`
                    : "1.5px solid rgba(255,255,255,0.8)",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(16px)",
                  boxShadow: isHovered
                    ? `0 24px 60px ${p.color}25, 0 4px 20px rgba(0,0,0,0.06)`
                    : "0 4px 24px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Hover glow overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${p.gradientFrom}08, ${p.gradientTo}08)`,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.4s",
                    pointerEvents: "none",
                    borderRadius: "28px",
                  }}
                />

                {/* ── Visual area ── */}
                <div
                  style={{
                    position: "relative",
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: p.lightBg,
                  }}
                >
                  {/* Blobs inside card */}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <Blob color={p.gradientFrom} opacity={0.28} style={{ width: "260px", position: "absolute" }} />
                    <Blob color={p.gradientTo} opacity={0.18} style={{ width: "200px", position: "absolute", left: "30%", top: "10%" }} />
                  </div>

                  {/* Huge faded number */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      right: "12px",
                      fontSize: "7rem",
                      fontWeight: 900,
                      opacity: 0.07,
                      color: p.color,
                      fontFamily: "'Georgia', serif",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {p.number}
                  </span>

                  {/* Wavy lines */}
                  <div style={{ position: "absolute", bottom: "8px", left: "12px" }}>
                    <WavyLines color={p.color} />
                  </div>

                  {/* Tag badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      color: "white",
                      background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
                      fontFamily: "'Helvetica Neue', sans-serif",
                    }}
                  >
                    {p.tag}
                  </div>

                  {/* Product icon */}
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      background: `linear-gradient(135deg, ${p.gradientFrom}22, ${p.gradientTo}22)`,
                      border: `1px solid ${p.color}30`,
                      boxShadow: `0 8px 32px ${p.color}20`,
                      position: "relative",
                      zIndex: 1,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {p.emoji}
                  </div>
                </div>

                {/* ── Content ── */}
                <div style={{ padding: "1.2rem 1.4rem", flex: 1, display: "flex", flexDirection: "column" }}>

                  {/* Subtitle */}
                  <p
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: p.color,
                      marginBottom: "4px",
                      fontFamily: "'Helvetica Neue', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {p.subtitle}
                  </p>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#1a1a2e",
                      marginBottom: "0.6rem",
                      lineHeight: 1.2,
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      lineHeight: 1.6,
                      marginBottom: "0.9rem",
                      fontFamily: "'Helvetica Neue', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {p.description}
                  </p>

                  {/* Tech stack */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.2rem" }}>
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: "999px",
                          border: `1px solid ${p.color}30`,
                          color: p.color,
                          background: `${p.color}0c`,
                          fontFamily: "'Helvetica Neue', sans-serif",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* ── CTA Buttons ── */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(139,92,246,0.1)",
                      paddingTop: "1rem",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    {/* Live Demo */}
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px 0",
                        borderRadius: "14px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                        color: "white",
                        fontFamily: "'Helvetica Neue', sans-serif",
                        letterSpacing: "0.04em",
                        background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
                        boxShadow: `0 6px 20px ${p.color}35`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <ExternalLink size={13} />
                      Live Demo
                    </a>

                    {/* View Project / GitHub */}
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px 0",
                        borderRadius: "14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                        border: `1px solid ${p.color}30`,
                        color: p.color,
                        background: "transparent",
                        fontFamily: "'Helvetica Neue', sans-serif",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Source
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(139,92,246,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>
            Showing {projects.length} featured projects
          </p>

          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1a1a2e",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            View All Projects
            <ArrowUpRight size={15} />
          </a>
        </div>

      </div>
    </section>
  );
}