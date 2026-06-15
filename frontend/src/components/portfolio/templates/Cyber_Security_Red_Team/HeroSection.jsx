import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Download,
  ChevronDown,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

// ─── World map / attack surface SVG (Static UI Element) ──────────────────────
const MAP_DOTS = [
  { x: 0.12, y: 0.22 },
  { x: 0.15, y: 0.28 },
  { x: 0.18, y: 0.25, pulse: true },
  { x: 0.2, y: 0.3 },
  { x: 0.22, y: 0.26 },
  { x: 0.47, y: 0.2 },
  { x: 0.5, y: 0.22 },
  { x: 0.48, y: 0.26 },
  { x: 0.52, y: 0.24 },
  { x: 0.8, y: 0.32, pulse: true },
  { x: 0.84, y: 0.3 },
  { x: 0.82, y: 0.36 },
  { x: 0.49, y: 0.24, pulse: true },
  { x: 0.67, y: 0.38, pulse: true },
];

function GridSurface() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 70"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 5}
          x2="100"
          y2={i * 5}
          stroke="#FF2B2B"
          strokeOpacity="0.035"
          strokeWidth="0.25"
        />
      ))}
      {Array.from({ length: 21 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 5}
          y1="0"
          x2={i * 5}
          y2="70"
          stroke="#FF2B2B"
          strokeOpacity="0.035"
          strokeWidth="0.25"
        />
      ))}
      {MAP_DOTS.map((dot, i) => (
        <g key={i}>
          <circle
            cx={dot.x * 100}
            cy={dot.y * 70}
            r={dot.pulse ? 1.1 : 0.7}
            fill="#FF2B2B"
            opacity={dot.pulse ? 0.65 : 0.2}
          />
          {dot.pulse && (
            <circle
              cx={dot.x * 100}
              cy={dot.y * 70}
              r="2.5"
              fill="none"
              stroke="#FF2B2B"
              strokeWidth="0.35"
              opacity="0.25"
            >
              <animate
                attributeName="r"
                values="1.2;4.5;1.2"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.35;0;0.35"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

// ─── Dev Active Console ───────────────────────────────────────────────────────
function DevConsole() {
  const { portfolioData = {} } = usePortfolio();
  const { personal = {}, projects = [], skills = [] } = portfolioData;

  const activeProject = projects[0] || {};
  const [rolePrimary] = (personal.title || "Developer").split(" & ");
  
  const DEV = {
    name: personal.name || "Developer",
    role: rolePrimary || "System Engineer",
    location: personal.location || "Earth",
  };

  const SPRINT = {
    id: activeProject.title ? `PRJ-${activeProject.title.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}` : "PRJ-CORE",
    type: activeProject.category || activeProject.title || "Enterprise Application",
    target: activeProject.description?.slice(0, 35) || "System Initialization & Scaling",
    progress: 85,
  };

  const defaultPhases = ["System Architecture", "Database Schema", "Backend API", "Frontend Interface", "Predictive Model", "Production Deploy"];
  const PHASES = defaultPhases.map((label, idx) => ({
    label,
    status: idx < 3 ? "done" : idx === 3 ? "active" : "pending",
    stack: skills[idx]?.name || undefined,
  }));

  const TERMINAL_FEED = [
    {
      status: "SUCCESS",
      msg: `Commit pushed: Optimized ${skills[0]?.name || 'Core'} render cycle`,
    },
    {
      status: "INFO",
      msg: `Pipeline: ${skills[1]?.name || 'System'} runtime deployed`,
    },
    {
      status: "WARN",
      msg: `Monitoring: High traffic spike on ${activeProject.title?.split(" ")[0] || 'Main'} API`,
    },
    {
      status: "SUCCESS",
      msg: "Lighthouse: Performance score 100/100",
    },
  ];

  // Extract unique categories for the bottom tabs, fallback if not enough distinct categories
  const extractedCategories = Array.from(new Set(skills.map((s) => s.category?.toUpperCase()))).filter(Boolean);
  const bottomTabLabels = extractedCategories.length >= 4 
    ? extractedCategories.slice(0, 4) 
    : ["FRONTEND", "BACKEND", "DATABASE", "CI/CD"];

  const [tick, setTick] = useState(0);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [cursor, setCursor] = useState(true);
  const intelRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCursor((p) => !p), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setProgressVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () =>
        setActiveFeedIndex(
          (p) => (p + 1) % TERMINAL_FEED.length,
        ),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const feed = TERMINAL_FEED[activeFeedIndex] || TERMINAL_FEED[0];
  const feedColor =
    feed.status === "SUCCESS"
      ? "#4ADE80"
      : feed.status === "WARN"
        ? "#FFA500"
        : "#9A9A9A";

  return (
    <div
      className="relative overflow-hidden rounded-xl transition-all duration-500 hover:shadow-[0_20px_80px_rgba(255,43,43,0.12)]"
      style={{
        background: "rgba(6,6,6,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,43,43,0.15)",
        boxShadow:
          "0 0 0 1px rgba(255,43,43,0.06) inset, 0 20px 50px rgba(0,0,0,0.8)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
          mixBlendMode: "multiply",
        }}
      />
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <GridSurface />
      </div>
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, rgba(255,43,43,0.12) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "rgba(8,8,8,0.6)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <div className="w-px h-3 bg-[#333]" />
          <span
            className="text-[#FF2B2B] tracking-[0.15em] font-medium"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
            }}
          >
            DEV://RUNTIME-CONSOLE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"
              style={{
                boxShadow: "0 0 8px rgba(74,222,128,0.9)",
              }}
            />
            <span
              className="text-[#4ADE80] tracking-[0.12em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              ONLINE
            </span>
          </div>
          <span
            className="text-[#888] tracking-[0.08em] tabular-nums"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
            }}
          >
            {timeStr}
          </span>
        </div>
      </div>

      <div
        className="relative z-10 p-6 space-y-5"
        style={{ minHeight: "420px" }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg border backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.03]"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="text-[#555] mb-2 tracking-[0.15em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
              }}
            >
              DEVELOPER
            </div>
            <div
              className="text-[#F5F5F5] mb-1 truncate"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.05em",
              }}
            >
              {DEV.name}
            </div>
            <div
              className="text-[#9A9A9A] truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
              }}
            >
              {DEV.role}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-1 h-1 rounded-full bg-[#4ADE80]" />
              <span
                className="text-[#4ADE80] tracking-[0.1em] truncate"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                }}
              >
                {DEV.location}
              </span>
            </div>
          </div>
          <div
            className="p-4 rounded-lg border backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.03]"
            style={{
              background: "rgba(255,255,255,0.015)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="text-[#555] mb-2 tracking-[0.15em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
              }}
            >
              ACTIVE SPRINT
            </div>
            <div
              className="text-[#FF2B2B] mb-1 truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
              }}
            >
              {SPRINT.id}
            </div>
            <div
              className="text-[#9A9A9A] truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
              }}
            >
              {SPRINT.type}
            </div>
            <div
              className="text-[#666] mt-1.5 truncate"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
              }}
            >
              {SPRINT.target}
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg border backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-[#555] tracking-[0.15em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
              }}
            >
              SPRINT PROGRESS
            </span>
            <span
              className="text-[#FF2B2B] tabular-nums font-bold"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
              }}
            >
              {SPRINT.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-[#111] mb-4 relative overflow-hidden rounded-full">
            <div
              className="h-full absolute left-0 top-0 transition-all duration-[2s] ease-out rounded-full"
              style={{
                width: progressVisible
                  ? `${SPRINT.progress}%`
                  : "0%",
                background:
                  "linear-gradient(90deg, #D60000, #FF2B2B, #FF7777)",
                boxShadow: "0 0 10px rgba(255,43,43,0.5)",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white transition-all duration-[2s] ease-out"
              style={{
                left: progressVisible
                  ? `calc(${SPRINT.progress}% - 4px)`
                  : "0%",
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {PHASES.map((phase) => (
              <div
                key={phase.label}
                className="flex items-center gap-2.5"
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color:
                      phase.status === "done"
                        ? "#4ADE80"
                        : phase.status === "active"
                          ? "#FF2B2B"
                          : "#444",
                  }}
                >
                  {phase.status === "done"
                    ? "✓"
                    : phase.status === "active"
                      ? "▶"
                      : "○"}
                </span>
                <span
                  className="truncate"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem",
                    color:
                      phase.status === "done"
                        ? "#888"
                        : phase.status === "active"
                          ? "#F5F5F5"
                          : "#444",
                  }}
                >
                  {phase.label}
                </span>
                {phase.stack && phase.status !== "pending" && (
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded text-[#444] bg-[#111] truncate max-w-[60px]"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.5rem",
                    }}
                  >
                    {phase.stack}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-4 rounded-lg border backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.01)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[#555] tracking-[0.15em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
              }}
            >
              SYSTEM LOGS
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#FF2B2B] animate-pulse"
                style={{
                  boxShadow: "0 0 6px rgba(255,43,43,0.8)",
                }}
              />
              <span
                className="text-[#FF2B2B] tracking-[0.1em]"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                }}
              >
                LIVE
              </span>
            </div>
          </div>
          <div
            ref={intelRef}
            className="flex items-start gap-3 transition-opacity duration-500"
            style={{ opacity: 1 }}
          >
            <span
              className="flex-shrink-0 px-1.5 py-0.5 rounded-sm"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                color: feedColor,
                background: `${feedColor}15`,
                border: `1px solid ${feedColor}30`,
              }}
            >
              {feed.status}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "#AAA",
                lineHeight: 1.5,
              }}
            >
              {feed.msg}
              <span
                style={{
                  opacity: cursor ? 1 : 0,
                  color: "#FF2B2B",
                  marginLeft: "4px",
                  transition: "opacity 0.1s",
                }}
              >
                █
              </span>
            </span>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 flex items-center justify-between px-6 py-2.5 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "rgba(8,8,8,0.6)",
        }}
      >
        <div className="flex items-center gap-5 overflow-hidden">
          {bottomTabLabels.map((label, idx) => {
            const isDone = idx < 3;
            const isActive = idx === 3;
            return (
              <div
                key={label}
                className="flex items-center gap-1.5"
              >
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{
                    background: isDone
                      ? "#4ADE80"
                      : isActive
                        ? "#FF2B2B"
                        : "#333",
                    boxShadow: isActive
                      ? "0 0 6px rgba(255,43,43,0.8)"
                      : isDone
                        ? "0 0 4px rgba(74,222,128,0.5)"
                        : "none",
                  }}
                />
                <span
                  className="truncate"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.08em",
                    color: isDone
                      ? "#4ADE80"
                      : isActive
                        ? "#FF2B2B"
                        : "#555",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio metrics ─────────────────────────────────────────────────────────
function MetricsRow() {
  const { portfolioData = {} } = usePortfolio();
  const { stats = {}, skills = [] } = portfolioData;

  const PORTFOLIO_METRICS = [
    { key: "EXPERIENCE", value: stats.yearsExperience ? `${stats.yearsExperience} YRS` : "5 YRS", sub: "Development" },
    { key: "PROJECTS", value: stats.projectsCompleted || "48", sub: "Completed" },
    { key: "CLIENTS", value: stats.happyClients || "32", sub: "Happy Clients" },
    { key: "TECH STACK", value: skills.length ? `${skills.length}+` : "15+", sub: "Core Technologies" },
  ];

  return (
    <div
      className="border border-[#1A1A1A] rounded-xl overflow-hidden backdrop-blur-sm"
      style={{ background: "rgba(11,11,11,0.6)" }}
    >
      <div className="grid grid-cols-4 divide-x divide-[#1A1A1A]">
        {PORTFOLIO_METRICS.map((m) => (
          <div
            key={m.key}
            className="flex flex-col items-center justify-center py-5 px-3 relative group transition-colors duration-300 hover:bg-white/[0.02]"
          >
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #FF2B2B, transparent)",
              }}
            />
            <span
              className="leading-none mb-1.5 tabular-nums transition-transform duration-300 group-hover:scale-110"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "1.6rem",
                color: "#FF2B2B",
                letterSpacing: "-0.01em",
              }}
            >
              {m.value}
            </span>
            <span
              className="tracking-[0.15em] text-center truncate w-full"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                color: "#F5F5F5",
              }}
            >
              {m.key}
            </span>
            <span
              className="tracking-[0.05em] text-center mt-0.5 truncate w-full"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.52rem",
                color: "#555",
              }}
            >
              {m.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero section ──────────────────────────────────────────────────────────────
export function HeroSection() {
  const { portfolioData = {} } = usePortfolio();
  const { personal = {}, skills = [] } = portfolioData;

  const devName = personal.name || "Developer";
  
  // Extract secondary title/role for the callsign if available
  const titleParts = (personal.title || "Full Stack Developer & Creative Technologist").split(" & ");
  const callsign = titleParts.length > 1 ? titleParts[1].toUpperCase() : "CREATIVE TECH";
  
  // Use standard availability fallback if not implicitly available in context
  const availability = personal.availability || "AVAILABLE FOR PROJECTS";
  
  const bioText = personal.bio || "Passionate developer crafting beautiful, performant web applications. I love turning complex problems into elegant, user-friendly solutions.";
  
  // Dynamically map top skills for the sub-header
  const topSkillsLine = skills.length > 0 
    ? skills
        .slice(0, 4)
        .map((s) => s.name?.toUpperCase() || "")
        .filter(Boolean)
        .join(" · ") || "FRONTEND · BACKEND · DEVOPS · DESIGN"
    : "FRONTEND · BACKEND · DEVOPS · DESIGN";

  // Helper to dynamically style the tagline, keeping the visual cyber aesthetic 
  const renderTagline = (text) => {
    const fallback = "BUILDING THE FUTURE. ONE LINE AT A TIME.";
    const words = (text || fallback).toUpperCase().split(" ");
    
    // Pick a word to highlight (the 3rd word, or the last word if it's short)
    const targetIdx = words.length >= 3 ? 2 : words.length - 1;
    
    return (
      <>
        {words.map((word, i) => {
          if (i === targetIdx) {
            return (
              <span
                key={i}
                style={{
                  color: "#FF2B2B",
                  textShadow: "0 0 80px rgba(255,43,43,0.35)",
                }}
              >
                {word}{" "}
              </span>
            );
          }
          return <span key={i}>{word} </span>;
        })}
      </>
    );
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "55vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(255,43,43,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-20 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 border border-[#1A1A1A] rounded-full backdrop-blur-sm"
              style={{ background: "rgba(11,11,11,0.6)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
              </span>
              <span
                className="text-[#4ADE80] tracking-[0.22em] uppercase"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                }}
              >
                {availability}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-6 bg-[#FF2B2B] opacity-70" />
              <span
                className="text-[#9A9A9A] tracking-[0.25em] uppercase truncate max-w-md"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                }}
              >
                {devName} · {callsign}
              </span>
            </div>

            <h1
              className="leading-[0.82] mb-4 select-none uppercase flex flex-wrap gap-x-4"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 5.8vw, 5rem)",
                letterSpacing: "-0.01em",
                color: "#F5F5F5",
              }}
            >
              {renderTagline(personal.tagline)}
            </h1>

            <p
              className="mb-8 tracking-[0.2em] uppercase truncate"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#666",
                letterSpacing: "0.25em",
              }}
            >
              {topSkillsLine}
            </p>

            <p
              className="text-[#9A9A9A] mb-10 max-w-[420px] leading-[1.8]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
              }}
            >
              {bioText}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 tracking-[0.18em] rounded-lg transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-95"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  background:
                    "linear-gradient(135deg, #FF2B2B 0%, #D60000 100%)",
                  color: "#F5F5F5",
                  boxShadow:
                    "0 4px 20px rgba(255,43,43,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  VIEW PROJECTS
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </span>
                <div className="absolute inset-0 rounded-lg bg-[#FF5555] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </a>

              <a
                href={personal.resumeUrl || "#"}
                target={personal.resumeUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-3.5 tracking-[0.18em] rounded-lg border border-[#2A2A2A] text-[#9A9A9A] transition-all duration-300 ease-out hover:border-[#FF2B2B]/50 hover:text-[#F5F5F5] hover:bg-[#FF2B2B]/5 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,43,43,0.1)] active:translate-y-0 active:scale-95"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  background: "rgba(11,11,11,0.6)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Download
                  size={14}
                  className="group-hover:-translate-y-0.5 transition-transform duration-300"
                />
                DOWNLOAD CV
              </a>
            </div>

            <MetricsRow />
          </div>

          <div className="relative">
            <DevConsole />
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
        <ChevronDown
          size={16}
          className="text-[#9A9A9A] animate-bounce"
        />
      </div>
    </section>
  );
}