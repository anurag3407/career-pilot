import React, { useEffect, useState } from "react";
import { Github, ExternalLink, Star } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Interactive Math Tutor",
    description:
      "A web app that walks students through algebra step-by-step with real-time feedback, adaptive difficulty, and personalised hints for each learner.",
    subject: "Mathematics",
    chapter: "Chapter 01",
    grade: "A+",
    tags: ["React", "Node.js", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Science Quiz Generator",
    description:
      "AI-powered quiz platform that creates personalised science questions based on each student's learning history and performance trends.",
    subject: "Science",
    chapter: "Chapter 02",
    grade: "A",
    tags: ["Python", "FastAPI", "OpenAI"],
    githubUrl: "#",
    liveUrl: "#",
    featured: false,
  },
  {
    id: 3,
    title: "Digital Flashcard System",
    description:
      "Spaced-repetition flashcard tool for language learners with audio pronunciation support and detailed progress analytics.",
    subject: "Languages",
    chapter: "Chapter 03",
    grade: "A+",
    tags: ["Vue.js", "Firebase", "Web Audio"],
    githubUrl: "#",
    liveUrl: "#",
    featured: false,
  },
  {
    id: 4,
    title: "History Timeline Explorer",
    description:
      "Interactive visual timeline helping students navigate world history events with annotated primary-source documents and zoom controls.",
    subject: "History",
    chapter: "Chapter 04",
    grade: "A",
    tags: ["D3.js", "TypeScript", "Vite"],
    githubUrl: "#",
    liveUrl: "#",
    featured: false,
  },
];

const subjectStyles = {
  Mathematics: { background: "#FFD166", color: "#3D2C00" },
  Science: { background: "#06D6A0", color: "#003D2E" },
  Languages: { background: "#EF476F", color: "#3D0010" },
  History: { background: "#4CC9F0", color: "#002D3D" },
};

function ChalkMarks() {
  const marks = [
    { symbol: "✦", top: "7%", left: "8%", size: "0.95rem", rotate: "-12deg" },
    { symbol: "◦", top: "15%", right: "14%", size: "1.1rem", rotate: "8deg" },
    { symbol: "·", top: "24%", left: "18%", size: "1.4rem", rotate: "0deg" },
    { symbol: "—", top: "32%", right: "9%", size: "1.25rem", rotate: "-6deg" },
    { symbol: "✦", top: "40%", left: "5%", size: "0.78rem", rotate: "7deg" },
    { symbol: "·", top: "46%", right: "18%", size: "1.15rem", rotate: "-4deg" },
    { symbol: "◦", top: "58%", left: "12%", size: "0.9rem", rotate: "0deg" },
    { symbol: "—", top: "63%", right: "7%", size: "1rem", rotate: "3deg" },
    { symbol: "✦", bottom: "26%", left: "10%", size: "0.9rem", rotate: "10deg" },
    { symbol: "◦", bottom: "14%", right: "18%", size: "1rem", rotate: "-8deg" },
    { symbol: "·", bottom: "8%", left: "24%", size: "1.35rem", rotate: "5deg" },
    { symbol: "—", bottom: "20%", right: "30%", size: "1.1rem", rotate: "4deg" },
    { symbol: "✦", bottom: "32%", right: "41%", size: "0.82rem", rotate: "-10deg" },
    { symbol: "·", bottom: "11%", right: "9%", size: "1.12rem", rotate: "6deg" },
  ];

  return (
    <>
      {marks.map((mark, index) => (
        <span
          key={`${mark.symbol}-${index}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            color: "rgba(196, 255, 233, 0.18)",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: mark.size,
            lineHeight: 1,
            transform: `rotate(${mark.rotate})`,
            pointerEvents: "none",
            textShadow: "0 0 12px rgba(103, 232, 249, 0.12)",
            ...mark,
          }}
        >
          {mark.symbol}
        </span>
      ))}
    </>
  );
}

function SectionHeader() {
  return (
    <div className="mb-10 md:mb-14 relative z-10">
      <div
        style={{
          color: "rgba(153, 246, 228, 0.96)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: "1.08rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          marginBottom: "1.1rem",
          textShadow: "0 0 18px rgba(34, 211, 238, 0.2)",
        }}
      >
        ✦ Portfolio ✦
      </div>

      <h2
        id="projects-heading"
        style={{
          color: "#F8FFFC",
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          fontSize: "clamp(3.35rem, 6.8vw, 5rem)",
          lineHeight: 0.94,
          margin: 0,
          textShadow:
            "0 0 1px rgba(248,255,252,0.75), 0 18px 38px rgba(34, 211, 238, 0.18)",
        }}
      >
        My Projects
      </h2>

      <div style={{ marginTop: "0.7rem", marginBottom: "1.15rem" }}>
        <svg
          width="230"
          height="22"
          viewBox="0 0 230 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 12C19 5.9 29 17.6 43 12.2C58 6.1 68 17.5 83 11.9C97 6.3 108 17.8 123 12.1C138 6 149 17.4 164 11.8C180 6.4 191 17.9 226 10.8"
            stroke="url(#projects-underline)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="2 4"
            opacity="0.95"
          />
          <defs>
            <linearGradient id="projects-underline" x1="0" y1="0" x2="230" y2="0">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#ECFEFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p
        style={{
          color: "rgba(236, 255, 250, 0.84)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: "1.18rem",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {projects.length} projects · All grades A or above
      </p>
    </div>
  );
}

function GradeBadge({ grade }) {
  return (
    <span
      aria-label={`Grade: ${grade}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "3.7rem",
        padding: "0.5rem 1.02rem",
        border: "1px solid rgba(191, 250, 236, 0.46)",
        borderRadius: "999px",
        color: "#F0FDFA",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "1.08rem",
        letterSpacing: "0.05em",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(45,212,191,0.12) 55%, rgba(14,165,233,0.16))",
        boxShadow:
          "0 10px 24px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 18px rgba(94, 234, 212, 0.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      {grade}
    </span>
  );
}

function SubjectPill({ subject }) {
  const palette = subjectStyles[subject] || {
    background: "#4B5E52",
    color: "#F5F0E8",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.5rem 1.05rem",
        borderRadius: "999px",
        background: `linear-gradient(135deg, ${palette.background}, rgba(255,255,255,0.78))`,
        color: palette.color,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "0.94rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        border: "1px solid rgba(255,255,255,0.24)",
        boxShadow:
          "0 8px 18px rgba(15, 23, 42, 0.22), inset 0 1px 0 rgba(255,255,255,0.24)",
      }}
    >
      {subject}
    </span>
  );
}

function TechTag({ tag }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.44rem 0.98rem",
        border: "1px solid rgba(226,255,247,0.2)",
        borderRadius: "999px",
        color: "rgba(236, 255, 250, 0.92)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "1rem",
        fontWeight: 500,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(34,211,238,0.08) 58%, rgba(16,185,129,0.07))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
        transition:
          "background 180ms ease, border-color 180ms ease, transform 180ms ease",
      }}
    >
      {tag}
    </span>
  );
}

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const borderColor = isHovered
    ? project.featured
      ? "rgba(207, 250, 254, 0.92)"
      : "rgba(103, 232, 249, 0.72)"
    : project.featured
      ? "rgba(153, 246, 228, 0.56)"
      : "rgba(165, 243, 252, 0.42)";

  const backgroundColor = isHovered
    ? "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(45,212,191,0.12) 42%, rgba(14,165,233,0.11) 100%)"
    : project.featured
      ? "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(16,185,129,0.11) 46%, rgba(8,145,178,0.1) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(20,184,166,0.07) 46%, rgba(14,165,233,0.075) 100%)";

  const cardClassName = [
    "relative overflow-hidden",
    project.id === 1 || project.id === 4 ? "sm:col-span-2" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const linkStyle = (key) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: hoveredLink === key ? "#FFFFFF" : "rgba(236, 255, 250, 0.88)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: "1.05rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 180ms ease, transform 180ms ease, opacity 180ms ease",
    opacity: hoveredLink === key ? 1 : 0.92,
    transform: hoveredLink === key ? "translateY(-1px)" : "translateY(0)",
    textShadow: hoveredLink === key ? "0 0 16px rgba(34, 211, 238, 0.18)" : "none",
  });

  return (
    <article
      className={cardClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredLink(null);
      }}
      style={{
        minHeight: project.id === 1 || project.id === 4 ? "auto" : "100%",
        padding: project.id === 1 ? "2.65rem 2.5rem 2.3rem" : "2.35rem 2.15rem 2.05rem",
        borderRadius: "30px",
        border: `${project.featured ? 1.7 : 1.35}px solid ${borderColor}`,
        background: backgroundColor,
        transform: isHovered ? "translateY(-10px) scale(1.014)" : "translateY(0) scale(1)",
        transition:
          "transform 260ms ease, border-color 220ms ease, background 240ms ease, box-shadow 240ms ease",
        boxShadow: isHovered
          ? "0 28px 58px rgba(7, 17, 31, 0.34), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 42px rgba(34, 211, 238, 0.09), 0 0 26px rgba(34, 211, 238, 0.12)"
          : "0 18px 42px rgba(2, 12, 27, 0.26), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 30px rgba(34, 211, 238, 0.05)",
        backdropFilter: "blur(18px)",
        backgroundImage:
          "radial-gradient(circle at 16% 14%, rgba(255,255,255,0.1), transparent 16%), radial-gradient(circle at 85% 18%, rgba(94,234,212,0.1), transparent 14%), radial-gradient(circle at 88% 82%, rgba(56,189,248,0.1), transparent 18%), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "auto, auto, auto, 26px 26px, 26px 26px",
        backgroundColor: "rgba(7, 17, 31, 0.58)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "16px",
          right: "20px",
          width: project.featured ? "116px" : "88px",
          height: project.featured ? "56px" : "40px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(125, 211, 252, 0.28) 0%, rgba(45, 212, 191, 0.16) 38%, rgba(14, 165, 233, 0.08) 62%, transparent 76%)",
          opacity: 0.78,
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "18px",
          left: "18px",
          width: project.featured ? "108px" : "78px",
          height: project.featured ? "38px" : "28px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(167, 243, 208, 0.2) 0%, rgba(56, 189, 248, 0.1) 42%, rgba(255,255,255,0.03) 65%, transparent 76%)",
          opacity: 0.7,
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          width: project.featured ? "38px" : "30px",
          height: project.featured ? "38px" : "30px",
          borderTop: `1.1px solid ${borderColor}`,
          borderLeft: `1.1px solid ${borderColor}`,
          opacity: 0.98,
          boxShadow: "0 0 10px rgba(191, 250, 236, 0.12)",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "15px",
          bottom: "15px",
          width: project.featured ? "38px" : "30px",
          height: project.featured ? "38px" : "30px",
          borderRight: `1.1px solid ${borderColor}`,
          borderBottom: `1.1px solid ${borderColor}`,
          opacity: 0.98,
          boxShadow: "0 0 10px rgba(125, 211, 252, 0.1)",
        }}
      />

      {project.featured ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.42rem",
            marginBottom: "1.3rem",
            padding: "0.5rem 1.06rem",
            borderRadius: "999px",
            background:
              "linear-gradient(135deg, rgba(21, 128, 61, 0.6), rgba(20, 184, 166, 0.34) 58%, rgba(14, 165, 233, 0.32))",
            color: "#D1FAE5",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "0.96rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
            border: "1px solid rgba(167, 243, 208, 0.28)",
            boxShadow:
              "0 10px 24px rgba(6, 78, 59, 0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <Star size={14} fill="#B6FFCC" strokeWidth={1.8} />
          Featured Lesson
        </div>
      ) : null}

      <div
        className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: project.id === 1 || project.id === 4 ? "52rem" : "100%" }}>
          <div
            style={{
              color: "rgba(153, 246, 228, 0.9)",
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              fontSize: "0.96rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "0.95rem",
            }}
          >
            {project.chapter}
          </div>

          <h3
            style={{
              color: "#F8FFFC",
              fontFamily: "'Caveat', cursive",
              fontSize: project.id === 1 ? "3.05rem" : "2.55rem",
              fontWeight: 700,
              lineHeight: 0.98,
              margin: 0,
              textShadow:
                "0 0 1px rgba(248,255,252,0.45), 0 10px 26px rgba(6, 182, 212, 0.12)",
            }}
          >
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 sm:justify-end" style={{ flexShrink: 0 }}>
          <GradeBadge grade={project.grade} />
          <SubjectPill subject={project.subject} />
        </div>
      </div>

      <p
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "1.15rem",
          marginBottom: "1.45rem",
          color: "rgba(240, 253, 250, 0.88)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: "1.18rem",
          lineHeight: 1.82,
          maxWidth: project.id === 1 || project.id === 4 ? "64rem" : "100%",
        }}
      >
        {project.description}
      </p>

      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "1px",
          marginBottom: "1.25rem",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(167,243,208,0.3) 14%, rgba(125,211,252,0.2) 44%, rgba(45,212,191,0.3) 76%, rgba(255,255,255,0.04) 100%)",
          opacity: 0.95,
          transform: "rotate(-0.25deg)",
        }}
      />

      <div
        className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="flex flex-wrap gap-2.5">
          {project.tags.map((tag) => (
            <TechTag key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href={project.githubUrl}
            aria-label={`View ${project.title} on GitHub`}
            style={linkStyle("github")}
            onMouseEnter={() => setHoveredLink("github")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Github size={16} strokeWidth={1.9} />
            GitHub
          </a>

          <a
            href={project.liveUrl}
            aria-label={`View live demo of ${project.title}`}
            style={linkStyle("live")}
            onMouseEnter={() => setHoveredLink("live")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <ExternalLink size={16} strokeWidth={1.9} />
            Live Demo
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  useEffect(() => {
    const existing = document.getElementById("chalk-fonts");

    if (!existing) {
      const link = document.createElement("link");
      link.id = "chalk-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@400;700&display=swap";
      document.head.appendChild(link);
    }

    return () => {
      const injected = document.getElementById("chalk-fonts");
      if (injected) {
        injected.remove();
      }
    };
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full overflow-hidden px-4 py-14 sm:px-6 md:px-8 md:py-18 lg:px-10 lg:py-24"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #07111F 0%, #0F172A 20%, #102A43 46%, #164E63 76%, #0F766E 100%)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 14% 20%, rgba(20,184,166,0.24), transparent 24%), radial-gradient(circle at 82% 16%, rgba(34,211,238,0.24), transparent 24%), radial-gradient(circle at 72% 72%, rgba(20,184,166,0.18), transparent 24%), radial-gradient(circle at 28% 76%, rgba(34,211,238,0.16), transparent 22%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "auto, auto, auto, auto, 42px 42px, 42px 42px",
          opacity: 0.58,
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-3rem",
          right: "-1rem",
          width: "24rem",
          height: "24rem",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(34,211,238,0.16) 42%, rgba(255,255,255,0.05) 68%, transparent 78%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "12%",
          left: "18%",
          width: "16rem",
          height: "4.5rem",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(236, 255, 250, 0.12) 0%, rgba(125, 211, 252, 0.08) 42%, transparent 74%)",
          opacity: 0.58,
          transform: "rotate(-8deg)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "18%",
          right: "14%",
          width: "13.5rem",
          height: "3.4rem",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(196,255,233,0.12) 0%, rgba(45,212,191,0.08) 42%, transparent 74%)",
          opacity: 0.5,
          transform: "rotate(11deg)",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-4rem",
          left: "-3rem",
          width: "26rem",
          height: "26rem",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(15, 118, 110, 0.22) 0%, rgba(20, 184, 166, 0.16) 40%, rgba(34, 211, 238, 0.08) 68%, transparent 78%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      <ChalkMarks />

      <div className="relative mx-auto max-w-[1520px]">
        <SectionHeader />

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
