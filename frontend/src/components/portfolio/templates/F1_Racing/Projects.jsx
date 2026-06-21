import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Flag,
  ExternalLink,
  Github,
  GitBranch,
  ChevronRight,
  MoreVertical,
  Code2,
  Cpu,
  Award,
  Clock,
} from "lucide-react";


/** Simple Icons slugs — https://simpleicons.org */
const TECH_ICON_SLUGS = {
  React: "react",
  Tailwind: "tailwindcss",
  Vite: "vite",
  MERN: "nodedotjs",
  Stripe: "stripe",
  Redis: "redis",
  "Socket.io": "socketdotio",
  "Node.js": "nodedotjs",
  MongoDB: "mongodb",
  Python: "python",
  TensorFlow: "tensorflow",
  Plotly: "plotly",
  Java: "openjdk",
  "Spring Boot": "springboot",
  PostgreSQL: "postgresql",
  JavaScript: "javascript",
  Canvas: "html5",
  Algorithms: "leetcode",
};

const TECH_ICON_COLORS = {
  react: "61DAFB",
  tailwindcss: "06B6D4",
  vite: "646CFF",
  nodedotjs: "5FA04E",
  stripe: "635BFF",
  redis: "FF4438",
  socketdotio: "010101",
  mongodb: "47A248",
  python: "3776AB",
  tensorflow: "FF6F00",
  plotly: "3F4F75",
  openjdk: "ED8B00",
  springboot: "6DB33F",
  postgresql: "4169E1",
  javascript: "F7DF1E",
  html5: "E34F26",
  leetcode: "FFA116",
};

function normalizeTechKey(name) {
  return name.trim();
}

function getTechIconSlug(name) {
  const key = normalizeTechKey(name);
  if (TECH_ICON_SLUGS[key]) return TECH_ICON_SLUGS[key];
  const lower = key.toLowerCase();
  const found = Object.entries(TECH_ICON_SLUGS).find(
    ([k]) => k.toLowerCase() === lower
  );
  return found ? found[1] : null;
}

function TechStackIcon({ name }) {
  const [failed, setFailed] = useState(false);
  const slug = getTechIconSlug(name);

  if (!slug || failed) {
    return <Code2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />;
  }

  const color =
    slug === "socketdotio" ? "FFFFFF" : TECH_ICON_COLORS[slug] || "d4d4d8";

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 shrink-0 object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

import ferrariCar from "./assets/2026ferraricarright.avif";
import mercedesCar from "./assets/2026mercedescarright.avif";
import mclarenCar from "./assets/2026mclarencarright.avif";
import redbullCar from "./assets/2026redbullracingcarright.avif";
import racingBullsCar from "./assets/2026racingbullscarright.avif";
import astonCar from "./assets/2026astonmartincarright.avif";

/** High-Tech Motorsport Font Stack */
/** Ultimate Motorsport Font Stack */
const F1_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap";
const f1Display =
  "font-['Exo_2',ui-sans-serif,sans-serif] uppercase tracking-wide";
const f1DisplayItalic =
  "font-['Exo_2',ui-sans-serif,sans-serif] uppercase italic tracking-wider";
const f1Text = "font-['Inter',ui-sans-serif,sans-serif]";
const f1Telemetry =
  "font-['JetBrains_Mono',monospace] tracking-[0.15em] uppercase";

/** Card-only typography — tighter tracking & higher contrast for readability */
const f1CardLabel =
  "font-['JetBrains_Mono',monospace] text-[9px] font-semibold tracking-[0.1em] uppercase text-zinc-400 sm:text-[10px]";
const f1CardMeta =
  "font-['JetBrains_Mono',monospace] text-[9px] font-bold tracking-[0.08em] uppercase sm:text-[10px]";
const f1CardBody =
  "font-['Inter',ui-sans-serif,sans-serif] text-[13px] font-normal leading-relaxed text-zinc-300 antialiased sm:text-sm";
const f1CardStatValue =
  "font-['Kanit',ui-sans-serif,sans-serif] text-lg font-bold italic tracking-tight text-white antialiased sm:text-xl";
const f1CardMetricLabel =
  "font-['JetBrains_Mono',monospace] text-[9px] font-semibold tracking-[0.08em] uppercase text-zinc-400 sm:text-[10px]";

const CARD_MOTION_VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -32px 0px" };
const CARD_MOTION_EASE = [0.22, 1, 0.36, 1];

function useF1Fonts() {
  useEffect(() => {
    const id = "f1-racing-google-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = F1_FONT_URL;
    document.head.appendChild(link);
  }, []);
}

const TEAMS = {
  ferrari: {
    label: "Ferrari",
    car: ferrariCar,
    color: "#FF1801",
    accentSoft: "rgba(255, 24, 1, 0.14)",
    glow: "rgba(255, 24, 1, 0.42)",
    bgVariant: "streaks",
  },
  mercedes: {
    label: "Mercedes",
    car: mercedesCar,
    color: "#00D2BE",
    accentSoft: "rgba(0, 210, 190, 0.12)",
    glow: "rgba(0, 210, 190, 0.38)",
    bgVariant: "waves",
  },
  mclaren: {
    label: "McLaren",
    car: mclarenCar,
    color: "#FF8700",
    accentSoft: "rgba(255, 135, 0, 0.12)",
    glow: "rgba(255, 135, 0, 0.38)",
    bgVariant: "sectors",
  },
  redbull: {
    label: "Red Bull",
    car: redbullCar,
    color: "#3671C6",
    accentSoft: "rgba(54, 113, 198, 0.14)",
    glow: "rgba(54, 113, 198, 0.4)",
    bgVariant: "speedlines",
  },
  racingbulls: {
    label: "Racing Bulls",
    car: racingBullsCar,
    color: "#6692FF",
    accentSoft: "rgba(102, 146, 255, 0.14)",
    glow: "rgba(102, 146, 255, 0.38)",
    bgVariant: "dataflow",
  },
  aston: {
    label: "Aston Martin",
    car: astonCar,
    color: "#006F62",
    accentSoft: "rgba(0, 111, 98, 0.14)",
    glow: "rgba(0, 111, 98, 0.38)",
    bgVariant: "mesh",
  },
};

function getTeamTheme(teamKey) {
  const t = TEAMS[teamKey] || TEAMS.ferrari;
  return {
    accent: t.color,
    accentSoft: t.accentSoft,
    glow: t.glow,
    label: t.label,
    bgVariant: t.bgVariant,
  };
}

/** Category-driven pit-wall themes (accent, glow, buttons) */
const CATEGORY_THEMES = {
  "Web Development": {
    accent: "#E10600",
    accentSoft: "rgba(225, 6, 0, 0.15)",
    glow: "rgba(225, 6, 0, 0.35)",
    label: "Ferrari Red",
  },
  Python: {
    accent: "#00A2ED",
    accentSoft: "rgba(0, 162, 237, 0.14)",
    glow: "rgba(0, 162, 237, 0.4)",
    label: "Mercedes Blue",
  },
  Java: {
    accent: "#229971",
    accentSoft: "rgba(34, 153, 113, 0.15)",
    glow: "rgba(52, 211, 153, 0.38)",
    label: "Aston Green",
  },
  DSA: {
    accent: "#6366F1",
    accentSoft: "rgba(99, 102, 241, 0.15)",
    glow: "rgba(129, 140, 248, 0.38)",
    label: "AlphaTauri Purple",
  },
};

const DEFAULT_THEME = CATEGORY_THEMES["Web Development"];

function getCategoryTheme(category) {
  return CATEGORY_THEMES[category] || DEFAULT_THEME;
}

function projectIndex(id) {
  return parseInt(id, 10) - 1;
}

function splitTitle(title) {
  if (!title) return { line1: "PROJECT", line2: null };
  const upper = String(title).toUpperCase();
  const words = upper.split(/\s+/);
  if (words.length <= 2) return { line1: upper, line2: null };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}

function buildStatusText(status) {
  if (!status) return "BUILD STATUS: COMPLETE";
  const map = {
    Finished: "FINISHED",
    "In Progress": "IN PROGRESS",
    Delayed: "IN REVIEW",
  };
  return `BUILD STATUS: ${map[status] || String(status).toUpperCase()}`;
}

const CATEGORY_LABELS = {
  "Web Development": "FULL STACK",
  Python: "MACHINE LEARNING",
  Java: "DEVOPS",
  DSA: "DATA ENGINEERING",
};

function getArchetype(id) {
  const types = ["performance", "analytics", "devops", "data"];
  return types[(parseInt(id, 10) - 1) % 4];
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category.toUpperCase();
}

function statusDotColor(status) {
  if (status === "Finished") return "#22c55e";
  if (status === "In Progress") return "#E10600";
  return "#a855f7";
}

function F1CarSvg({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="210" cy="108" rx="160" ry="8" fill="rgba(255,255,255,0.15)" />
      <path
        d="M55 78 L75 62 Q95 52 130 50 L175 48 Q210 46 245 48 L290 50 Q330 52 355 62 L375 78 Z"
        fill="#1a1a1a"
        stroke="#444"
        strokeWidth="1"
      />
      <path
        d="M130 50 L175 48 Q210 46 245 48 L290 50 L285 58 L245 56 L175 56 L135 58 Z"
        fill="#dc2626"
      />
      <circle cx="115" cy="78" r="14" fill="#111" stroke="#444" strokeWidth="2" />
      <circle cx="305" cy="78" r="14" fill="#111" stroke="#444" strokeWidth="2" />
    </svg>
  );
}

function AssetImage({ src, alt, style, className, fallback = null }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback;
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className}
      style= {style}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function SpeedLineTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 3px,
          rgba(255,255,255,0.5) 3px,
          rgba(255,255,255,0.5) 4px
        )`,
      }}
    />
  );
}

function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
        maskImage: "linear-gradient(to right, transparent, black 40%, black 70%, transparent)",
      }}
    />
  );
}

function FloodLights() {
  const lights = [
    { left: "4%", angle: 18, width: 280, opacity: 0.22 },
    { left: "18%", angle: 8, width: 320, opacity: 0.18 },
    { left: "72%", angle: -12, width: 360, opacity: 0.28 },
    { left: "88%", angle: -22, width: 260, opacity: 0.2 },
  ];

  return (
    <>
      {lights.map((light, i) => (
        <div
          key={i}
          className="pointer-events-none absolute top-0 hidden sm:block"
          style={{ left: light.left }}
        >
          <div className="relative">
            <div className="h-2 w-6 rounded-sm border border-zinc-500/60 bg-zinc-400/40 shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-yellow-100/80 blur-[2px]" />
          </div>
          <div
            className="absolute top-2 origin-top animate-pulse"
            style={{
              left: "50%",
              width: light.width,
              height: 420,
              marginLeft: -(light.width / 2),
              background: `linear-gradient(to bottom, rgba(255,248,220,${light.opacity}) 0%, rgba(255,240,200,${light.opacity * 0.5}) 25%, transparent 75%)`,
              clipPath: "polygon(48% 0%, 0% 100%, 100% 100%)",
              transform: `rotate(${light.angle}deg)`,
              animationDuration: `${3 + i * 0.7}s`,
            }}
          />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,250,230,0.06) 0%, transparent 100%)",
        }}
      />
    </>
  );
}

const F1_RED = "#E10600";

function CarbonBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.35) 3px,
            rgba(255,255,255,0.35) 4px
          )`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(255,255,255,0.06) 1px,
            rgba(255,255,255,0.06) 2px
          )`,
        }}
      />
    </>
  );
}

function LightTrailsVisual() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible opacity-90"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trailRed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(225,6,0,0)" />
          <stop offset="40%" stopColor="rgba(225,6,0,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
        <filter id="trailGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d="M120 280 C280 200, 400 220, 520 180 S720 120, 780 100"
        fill="none"
        stroke="url(#trailRed)"
        strokeWidth="3"
        filter="url(#trailGlow)"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M100 300 C260 240, 380 250, 500 210 S700 150, 760 130"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}

function GarageStatusStrip() {
  const items = [
    { label: "Garage Status", value: "Operational", live: true },
    { label: "Primary Stack", value: "MERN" },
    { label: "Current Track", value: "CyberSecurity" },
  ];

  return (
    <div className="mt-6 flex flex-col overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950/80 sm:flex-row sm:items-stretch">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-1 items-center gap-2 px-4 py-3 ${i > 0 ? "border-t border-zinc-800/60 sm:border-l sm:border-t-0" : ""}`}
        >
          {item.live && (
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
          )}
          <div className="min-w-0">
            <p className={`${f1Telemetry} text-[8px] text-zinc-600`}>{item.label}</p>
            <p
              className={`${f1Telemetry} text-[10px] ${item.live ? "text-green-400" : "text-zinc-300"}`}
            >
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EngineeringVisualization() {
  return (
    <div className="relative flex min-h-[200px] flex-col items-center justify-center px-2 py-6 md:min-h-[280px] lg:min-h-full">
      <div className="mb-5 grid grid-cols-4 gap-1.5 opacity-40">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-1 w-1 rounded-full bg-zinc-500" />
        ))}
      </div>

      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <text
          x="100"
          y="115"
          textAnchor="middle"
          fill="none"
          stroke="rgba(225,6,0,0.28)"
          strokeWidth="1.5"
          fontSize="120"
          fontFamily="Barlow Condensed, sans-serif"
          fontWeight="900"
        >
          03
        </text>
      </svg>

      
    </div>
  );
}


const PIT_WALL_COLORS = {
  bg: "#050505",
  card: "rgba(255,255,255,0.02)",
  border: "rgba(255,0,0,0.2)",
  red: "#FF1801",
  green: "#00FF84",
  yellow: "#FFD500",
  blue: "#00A3FF",
  secondary: "rgba(255,255,255,0.55)",
};

function PitWallModuleCarbon() {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 3px,
          rgba(255,255,255,0.35) 3px,
          rgba(255,255,255,0.35) 4px
        )`,
      }}
    />
  );
}

function PitWallTelemetryModule({ module, index }) {
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 + index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(255,24,1,0.12)]"
      style={{
        backgroundColor: PIT_WALL_COLORS.card,
        borderColor: PIT_WALL_COLORS.border,
      }}
    >
      <PitWallModuleCarbon />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div
        className="pitwall-accent-strip pointer-events-none absolute bottom-0 right-0 top-0 w-[3px] rounded-r-2xl"
        style={{
          backgroundColor: module.accent,
          boxShadow: `0 0 12px ${module.accent}88`,
        }}
      />

      <div className="absolute right-3 top-2.5 hidden text-right sm:block">
        {module.micro.map((line) => (
          <p
            key={line}
            className={`${f1Telemetry} text-[7px] leading-relaxed`}
            style={{ color: PIT_WALL_COLORS.secondary, opacity: 0.4 }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="relative flex flex-col gap-3 p-4 pr-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 group-hover:border-[#FF1801]/40"
            style={{
              borderColor: `${module.accent}33`,
              backgroundColor: `${module.accent}12`,
            }}
          >
            <Icon className="h-4 w-4" style={{ color: module.accent }} strokeWidth={2.25} />
          </div>
          <p className={`${f1Telemetry} text-[9px]`} style={{ color: PIT_WALL_COLORS.secondary }}>
            {module.label}
          </p>
        </div>

        <div>
          <motion.p
            key={module.value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`text-3xl font-black leading-none text-white sm:text-4xl ${f1Display}`}
          >
            {module.value}
          </motion.p>
          <p
            className={`mt-1.5 ${f1Telemetry} text-[8px]`}
            style={{ color: PIT_WALL_COLORS.secondary, opacity: 0.65 }}
          >
            {module.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PitWallFeed({ buildsCount }) {
  const syncTime = useMemo(
    () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    []
  );

  const modules = [
    {
      label: "Projects Completed",
      value: String(buildsCount).padStart(2, "0"),
      sub: "Season Total",
      icon: Flag,
      accent: PIT_WALL_COLORS.red,
      micro: ["CPU 87%", "SYNCED", "ACTIVE"],
    },
    {
      label: "Technologies Used",
      value: "18+",
      sub: "Stacks Active",
      icon: Cpu,
      accent: PIT_WALL_COLORS.yellow,
      micro: ["SECTOR 1", "SECTOR 2", "SECTOR 3"],
    },
    {
      label: "Certifications",
      value: "05",
      sub: "Licensed",
      icon: Award,
      accent: PIT_WALL_COLORS.green,
      micro: ["VERIFIED", "ACTIVE", "CURRENT"],
    },
    {
      label: "Open Source",
      value: "12",
      sub: "Commits Deployed",
      icon: GitBranch,
      accent: PIT_WALL_COLORS.blue,
      micro: ["REPO SYNC", "MAIN", "LIVE"],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border backdrop-blur-xl lg:ml-auto lg:min-h-[480px]"
      style={{
        backgroundColor: PIT_WALL_COLORS.bg,
        borderColor: PIT_WALL_COLORS.border,
        boxShadow: "0 0 48px rgba(255,24,1,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,24,1,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,24,1,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <div
        className="pitwall-scan-line pointer-events-none absolute inset-x-0 top-0 z-10 h-24 opacity-[0.07]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(255,24,1,0.35), transparent)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,24,1,0.05) 0%, transparent 45%, rgba(255,24,1,0.02) 100%)",
        }}
      />

      <div className="relative z-20 flex shrink-0 items-center justify-between border-b px-5 py-4" style={{ borderColor: PIT_WALL_COLORS.border }}>
        <span className={`${f1Telemetry} text-[11px] text-white`}>Pit Wall Feed</span>
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ backgroundColor: PIT_WALL_COLORS.green, boxShadow: `0 0 8px ${PIT_WALL_COLORS.green}` }}
          />
          <span className={`${f1Telemetry} text-[10px]`} style={{ color: PIT_WALL_COLORS.green }}>
            Live
          </span>
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col gap-3 p-4">
        {modules.map((mod, i) => (
          <PitWallTelemetryModule key={mod.label} module={mod} index={i} />
        ))}
      </div>

      <div
        className={`relative z-20 shrink-0 border-t px-5 py-4 ${f1Telemetry}`}
        style={{ borderColor: PIT_WALL_COLORS.border }}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2 text-[9px]" style={{ color: PIT_WALL_COLORS.secondary }}>
            <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: PIT_WALL_COLORS.red }} />
            Last Sync
          </span>
          <div className="text-right">
            <p className="text-[10px] text-white">2m ago</p>
            <p className="mt-0.5 text-[9px]" style={{ color: PIT_WALL_COLORS.secondary, opacity: 0.55 }}>
              {syncTime}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pitwall-scan {
          0% { transform: translateY(-120%); opacity: 0; }
          15% { opacity: 0.12; }
          85% { opacity: 0.12; }
          100% { transform: translateY(520%); opacity: 0; }
        }
        @keyframes pitwall-strip {
          0%, 100% { opacity: 0.55; filter: brightness(0.9); }
          50% { opacity: 1; filter: brightness(1.25); }
        }
        .pitwall-scan-line {
          animation: pitwall-scan 7s ease-in-out infinite;
        }
        .pitwall-accent-strip {
          animation: pitwall-strip 3.5s ease-in-out infinite;
        }
        .group:nth-child(1) .pitwall-accent-strip { animation-delay: 0s; }
        .group:nth-child(2) .pitwall-accent-strip { animation-delay: 0.4s; }
        .group:nth-child(3) .pitwall-accent-strip { animation-delay: 0.8s; }
        .group:nth-child(4) .pitwall-accent-strip { animation-delay: 1.2s; }
      `}</style>
    </motion.div>
  );
}

function TelemetryControlBar({ categories, activeCategory, onCategoryChange }) {
  if (!categories || !onCategoryChange) return null;

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-950/90">
      <div className="relative flex flex-wrap sm:flex-nowrap">
        {categories.map((category, index) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(category)}
              className={`relative min-h-[48px] min-w-0 flex-1 px-3 py-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E10600] focus-visible:ring-inset sm:min-h-[52px] sm:px-5 ${f1Telemetry} text-[9px] sm:text-[10px] ${
                index > 0 ? "border-l border-zinc-800/60" : ""
              } ${
                isActive
                  ? "text-white"
                  : "bg-transparent text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-300"
              }`}
              style={isActive ? { backgroundColor: F1_RED } : undefined}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeroSection({
  filteredCount,
  categories,
  activeCategory,
  onCategoryChange,
}) {
  const scrollToProjects = () => {
    document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl border border-zinc-800/50 bg-[#050505] shadow-[0_0_60px_rgba(0,0,0,0.5)] md:mb-12">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(165deg, #030303 0%, #0a0a0a 45%, #050505 100%)",
          }}
        />
        <CarbonBackground />
        <LightTrailsVisual />
        <FloodLights />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 65% 55%, rgba(225,6,0,0.06) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute left-0 top-0 h-24 w-24 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(225,6,0,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-32 w-32 opacity-25"
          style={{
            background:
              "radial-gradient(circle at 100% 100%, rgba(225,6,0,0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col lg:col-span-5"
          >
            <p className={`mb-2 text-[10px] font-semibold text-[#E10600] ${f1Telemetry}`}>
            FULL STACK • AI • CYBERSECURITY
            </p>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 w-4 bg-[#E10600]"
                    style={{ transform: `skewX(-18deg) translateX(${i * 1}px)` }}
                  />
                ))}
              </div>
              <span className={`text-sm font-bold text-[#E10600] ${f1Telemetry}`}>DEVOPS</span>
              <Flag className="h-4 w-4 text-[#E10600]" strokeWidth={2.5} />
            </div>

            <h2
              className={`text-4xl font-black text-white sm:text-5xl xl:text-[3.25rem] ${f1DisplayItalic}`}
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
            >
              Development Garage
            </h2>

            <div
              className="mt-4 h-px w-full max-w-[220px]"
              style={{
                background: `linear-gradient(90deg, ${F1_RED} 0%, transparent 100%)`,
              }}
            />

            <p className={`mt-5 max-w-[480px] text-sm leading-relaxed text-zinc-400 sm:text-base ${f1Text}`}>
            Building full-stack applications, AI-powered solutions, cybersecurity projects, and performance-focused software engineered with precision, scalability, and reliability.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={scrollToProjects}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 ${f1Display}`}
                style={{ backgroundColor: F1_RED }}
              >
                Explore Projects
                <ChevronRight className="h-4 w-4" />
              </button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700/80 bg-zinc-950/60 px-5 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-zinc-600 hover:text-white ${f1Display}`}
              >
                <Github className="h-4 w-4" />
                View GitHub
              </a>
            </div>

            <GarageStatusStrip />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="hidden lg:col-span-3 lg:block"
          >
            <EngineeringVisualization />
          </motion.div>

          <div className="lg:col-span-4">
            <PitWallFeed buildsCount={filteredCount} />
          </div>

          <div className="lg:hidden">
            <EngineeringVisualization />
          </div>
        </div>

        <TelemetryControlBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>
    </div>
  );
}

const fallbackProjects = [
{
id: "01",
    title: "Personal Portfolio",
    description:
      "High-performance portfolio with lighthouse-optimized assets, smooth animations, and a modular theme system.",
    category: "Web Development",
status: "Finished",
    progress: 100,
    lapTime: "1:24.531",
    tech: ["React", "Tailwind", "Vite"],
    team: "ferrari",
    featured: true,
    demoUrl: "#",
    repoUrl: "#",
},
{
id: "02",
title: "E-Commerce Platform",
    description:
      "Full-stack storefront with cart, checkout, admin dashboard, and real-time inventory management.",
    category: "Web Development",
status: "Finished",
    progress: 100,
    lapTime: "1:31.204",
    tech: ["MERN", "Stripe", "Redis"],
    team: "mercedes",
    featured: false,
    demoUrl: "#",
    repoUrl: "#",
},
{
id: "03",
title: "Chat Application",
    description:
      "Real-time messaging app with rooms, typing indicators, read receipts, and end-to-end encryption.",
    category: "Web Development",
    status: "In Progress",
    progress: 85,
    lapTime: "1:27.890",
    tech: ["Socket.io", "Node.js", "MongoDB"],
    team: "mclaren",
    featured: true,
    demoUrl: "#",
    repoUrl: "#",
},
{
id: "04",
title: "ML Dashboard",
    description:
      "Interactive machine learning dashboard with model training pipelines, metrics visualization, and export tools.",
    category: "Python",
status: "Finished",
    progress: 100,
    lapTime: "1:29.112",
    tech: ["Python", "TensorFlow", "Plotly"],
    team: "redbull",
    featured: false,
    demoUrl: "#",
    repoUrl: "#",
},
{
id: "05",
title: "Task Manager",
    description:
      "Productivity suite with kanban boards, sprint planning, deadline tracking, and team collaboration features.",
    category: "Java",
    status: "In Progress",
    progress: 72,
    lapTime: "1:33.445",
    tech: ["Java", "Spring Boot", "PostgreSQL"],
    team: "racingbulls",
    featured: false,
    demoUrl: "#",
    repoUrl: "#",
},
{
id: "06",
title: "Data Visualizer",
    description:
      "Algorithm visualization tool for sorting, searching, and graph traversals with step-by-step playback.",
    category: "DSA",
    status: "Delayed",
    progress: 45,
    lapTime: "1:38.901",
    tech: ["JavaScript", "Canvas", "Algorithms"],
    team: "aston",
    featured: false,
    demoUrl: "#",
    repoUrl: "#",
  },
];

const categories = [
  "All",
  ...Array.from(new Set(fallbackProjects.map((p) => p.category))),
];

/* ─── Dashboard card system (reference-accurate) ─── */

function CardLayerCarbon() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.35) 4px, rgba(255,255,255,0.35) 5px)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
    </>
  );
}

function CardLayerTelemetryGrid({ accent }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `
          linear-gradient(${accent}22 1px, transparent 1px),
          linear-gradient(90deg, ${accent}22 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    />
  );
}

function CardLayerLightTrails({ accent, variant, uid = "0" }) {
  if (variant === "performance") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`perfTrail-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path d="M40 300 Q200 220 380 260 T580 220" fill="none" stroke={`url(#perfTrail-${uid})`} strokeWidth="3" opacity="0.7" />
        <path d="M20 330 Q180 280 360 310 T560 280" fill="none" stroke={accent} strokeWidth="1" opacity="0.25" />
      </svg>
    );
  }
  if (variant === "analytics") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" viewBox="0 0 600 400" aria-hidden="true">
        {[80, 160, 240, 320, 400, 480].map((x) => (
          <line key={x} x1={x} y1="60" x2={x} y2="340" stroke={accent} strokeWidth="0.5" opacity="0.15" />
        ))}
        <motion.path
          d="M60 280 L120 250 L180 260 L240 220 L300 230 L360 190 L420 200 L480 170 L540 180"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.35"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
      </svg>
    );
  }
  if (variant === "devops") {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 340 Q150 300 300 320 T600 290" fill="none" stroke={accent} strokeWidth="2" opacity="0.35" />
        <path d="M0 360 Q200 310 400 330 T600 310" fill="none" stroke={accent} strokeWidth="1" opacity="0.2" />
      </svg>
    );
  }
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 600 400" aria-hidden="true">
      {[
        [120, 150], [280, 120], [400, 170], [180, 230], [350, 210],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill={accent} opacity="0.5" />
          {i > 0 && (
            <line x1={cx - 80} y1={cy + 30} x2={cx} y2={cy} stroke={accent} strokeWidth="1" opacity="0.25" />
          )}
        </g>
      ))}
    </svg>
  );
}

function SmallMetricRing({ value, subLabel, accent, displayValue }) {
  const size = 38;
  const r = 15;
  const circ = 2 * Math.PI * r;
  const numVal = typeof value === "number" ? value : parseFloat(String(value).replace(/[^\d.]/g, ""));
  const offset = circ - (Math.min(100, numVal) / 100) * circ;
  const centerText = displayValue ?? `${value}%`;

  return (
    <div className="flex flex-col items-end">
      <div className="relative transition-all duration-300 group-hover:drop-shadow-[0_0_5px_var(--ring-glow)]" style={{ "--ring-glow": accent, width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            className="transition-all duration-300 group-hover:stroke-[2px]"
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={CARD_MOTION_VIEWPORT}
            transition={{ duration: 0.85, ease: CARD_MOTION_EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[9px] font-black leading-none text-white antialiased ${f1Display}`}>{centerText}</span>
        </div>
      </div>
      {subLabel && <span className={`mt-0 text-right ${f1CardMetricLabel} text-[7px]`}>{subLabel}</span>}
    </div>
  );
}

function getGarageStats(project) {
  const arch = getArchetype(project.id);
  
  if (arch === "analytics") {
    return [
      { label: "MODEL ACCURACY", value: "98.5%", sub: "PRECISION" },
      { label: "TRAIN EPOCHS", value: "250", sub: "TEST LAPS" },
      { label: "INFERENCE", value: "12ms", sub: "RESPONSE" },
    ];
  }
  if (arch === "devops") {
    return [
      { label: "SYS UPTIME", value: "99.9%", sub: "ENGINE HEALTH" },
      { label: "BUILD TIME", value: "1:42", sub: "ASSEMBLY" },
      { label: "PAYLOAD", value: "124MB", sub: "FOOTPRINT" },
    ];
  }
  if (arch === "data") {
    return [
      { label: "THROUGHPUT", value: "1.2K", sub: "FLOW RATE" },
      { label: "QUERY TIME", value: "45ms", sub: "LATENCY" },
      { label: "DATA VOL", value: "3.2TB", sub: "FUEL LOAD" },
    ];
  }
  // Default (Performance/Web Development)
  return [
    { label: "LIGHTHOUSE", value: "100", sub: "AERO EFFICIENCY" },
    { label: "BUNDLE SIZE", value: "84KB", sub: "CHASSIS WEIGHT" },
    { label: "LOAD TIME", value: "0.8s", sub: "PIT STOP" },
  ];
}

function GarageTopMetric({ project, theme }) {
  const arch = getArchetype(project.id);

  let displayValue = project.progress;
  let subLabel = "COMPLETE";

  if (arch === "analytics") {
    displayValue =
      project.status === "Finished"
        ? 98.7
        : Math.min(99, 88 + project.progress * 0.1);

    subLabel = "ACCURACY";
  } else if (arch === "devops") {
    displayValue =
      project.status === "Finished"
        ? 96
        : Math.max(72, project.progress);

    subLabel = "SUCCESS";
  } else if (arch === "data") {
    const tb = (2 + projectIndex(project.id) * 0.35).toFixed(1);

    return (
      <div className="relative flex items-center justify-center">
        <div className="relative h-23 w-23">
          {/* Background Telemetry Rings */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {/* Outer dashed data ring - animating slowly */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={`${theme.accent}55`}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            />
            
            {/* Inner solid track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={`${theme.accent}15`}
              strokeWidth="4"
            />

            {/* Glowing Data 'sector' highlights */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={theme.accent}
              strokeWidth="4"
              strokeDasharray="45 200"
              strokeLinecap="round"
              transform="rotate(-45 50 50)"
              style={{ filter: `drop-shadow(0 0 6px ${theme.accent})` }}
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={theme.accent}
              strokeWidth="4"
              strokeDasharray="15 250"
              strokeLinecap="round"
              transform="rotate(140 50 50)"
              style={{ filter: `drop-shadow(0 0 6px ${theme.accent})` }}
            />
          </svg>

          {/* Center glassmorphic telemetry disc */}
          <div
            className="absolute inset-[12px] flex flex-col items-center justify-center rounded-full border backdrop-blur-md"
            style={{
              borderColor: `${theme.accent}33`,
              background: "rgba(5,5,5,0.94)",
              boxShadow: `
                inset 0 0 12px rgba(255,255,255,0.04),
                0 0 16px ${theme.accent}22
              `,
            }}
          >
            <span className={`${f1Telemetry} text-[7px] text-zinc-500 mb-0.5`}>
              DATA
            </span>
            
            <div className="flex items-baseline gap-0.5">
              <span
                className={`text-[22px] font-black leading-none text-white ${f1Display}`}
                style={{
                  transform: "skewX(-8deg)",
                  letterSpacing: "-0.04em",
                }}
              >
                {tb}
              </span>
              <span
                className={`${f1Telemetry} text-[8px] font-bold`}
                style={{ color: theme.accent }}
              >
                TB
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 42;

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative h-23 w-23">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* telemetry ticks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="2"
              x2="50"
              y2="11"
              stroke={`${theme.accent}55`}
              strokeWidth="1.5"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}

          {/* background ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={`${theme.accent}22`}
            strokeWidth="3"
          />

          {/* progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={theme.accent}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{
              strokeDashoffset:
                circumference * (1 - displayValue / 100),
            }}
            viewport={CARD_MOTION_VIEWPORT}
            transition={{
              duration: 1,
              ease: CARD_MOTION_EASE,
            }}
            style={{
              filter: `drop-shadow(0 0 8px ${theme.accent})`,
            }}
          />
        </svg>

        {/* center telemetry disc */}
        <div
          className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full border backdrop-blur-md"
          style={{
            borderColor: `${theme.accent}33`,
            background: "rgba(5,5,5,0.94)",
            boxShadow: `
              inset 0 0 12px rgba(255,255,255,0.04),
              0 0 16px ${theme.accent}22
            `,
          }}
        >
          <span
  className={`text-[20px] font-black leading-none text-white ${f1Display}`}
  style={{
    transform: "skewX(-8deg)",
    letterSpacing: "-0.04em",
  }}
>
            {Math.round(displayValue)}%
          </span>

          <span
  className={`${f1Telemetry} mt-1 text-[7px] font-semibold tracking-[0.15em]`}
  style={{
    color: theme.accent,
  }}
>
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
function GarageTelemetry({ project, theme }) {
  const arch = getArchetype(project.id);
  if (arch === "analytics") return <PipelineHealthBar theme={theme} />;
  if (arch === "devops") return <SystemHealthBar theme={theme} />;
  if (arch === "data") return <DataFlowGraph theme={theme} />;
  return <TimelineProgressBar project={project} theme={theme} />;
}

function CardMetaBadges({ project, theme }) {
  const catLabel = getCategoryLabel(project.category);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {project.featured && (
        <motion.span
          className="rounded-lg border px-2 py-0.5 text-[9px] font-bold tracking-wide"
          style={{ borderColor: theme.accent, color: theme.accent, backgroundColor: `${theme.accent}18` }}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={CARD_MOTION_VIEWPORT}
          transition={{ duration: 0.3 }}
        >
          Priority Build
        </motion.span>
      )}
      <span
        className="rounded-lg border px-2 py-0.5 text-[8px] font-semibold tracking-wider"
        style={{ borderColor: `${theme.accent}44`, color: theme.accent }}
      >
        P{project.id} • {catLabel}
      </span>
    </div>
  );
}

function CardTitleBlock({ project, theme }) {
  const titleLines = splitTitle(project.title);
  
  return (
    <div className="mb-5 flex flex-col uppercase font-['Orbitron',sans-serif]">
      {/* Line 1: Increased size, subtle metallic grey */}
      <span 
        className="text-[20px] font-black italic text-zinc-400 sm:text-[24px]"
        style={{
          transform: "scaleX(1.25)",
          transformOrigin: "left center",
          letterSpacing: "0.15em",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)" // Small shadow to lift it off the grid
        }}
      >
        {titleLines.line1}
      </span>
      
      {/* Line 2: Massive scale, 3D extruded drop shadow + Team Glow */}
      {titleLines.line2 && (
        <span
          className="mt-[-4px] text-[42px] font-black italic leading-[0.85] text-white antialiased transition-transform duration-500 group-hover:translate-x-1 sm:text-[50px] lg:text-[58px]"
          style={{
            transform: "scaleX(1.25)",
            transformOrigin: "left center",
            letterSpacing: "0.02em",
            // The F1 Effect: A hard bevel, a dark drop shadow, and a massive team-colored glow
            textShadow: `
              -1px -1px 0px rgba(255,255,255,0.15),
              2px 2px 0px rgba(0,0,0,0.9),
              4px 4px 10px rgba(0,0,0,0.8),
              0 0 45px ${theme?.glow || 'rgba(255,255,255,0.4)'}
            `,
          }}
        >
          {titleLines.line2}
        </span>
      )}
    </div>
  );
}

function CardTechPills({ project, theme }) {
  return (
    <motion.div 
      className="mt-3 flex max-w-full flex-wrap gap-2 sm:gap-2.5"
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={CARD_MOTION_VIEWPORT}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      {project.tech.map((tag) => (
        <motion.span
          key={tag}
          className="inline-flex cursor-default items-center gap-1.5 rounded-xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-zinc-300 antialiased backdrop-blur-md transition-colors duration-300 sm:px-3 sm:py-2 sm:text-[11px]"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={CARD_MOTION_VIEWPORT}
          transition={{ duration: 0.25 }}
          whileHover={{ 
            y: -2,
            color: "#ffffff",
            borderColor: `${theme?.accent || '#ffffff'}88`,
            backgroundColor: `${theme?.accent || '#ffffff'}15`,
            boxShadow: `0 4px 12px ${theme?.glow || 'rgba(255,255,255,0.1)'}`
          }}
        >
          <TechStackIcon name={tag} />
          {tag}
        </motion.span>
      ))}
    </motion.div>
  );
}

function CardStatsRow({ stats = [], theme }) {
  if (!stats.length) return null;

  return (
    <div className="relative z-20 grid grid-cols-3 gap-2.5 sm:gap-3">
      {stats.map((s, i) => (
        <motion.div 
          key={s.label} 
          className="group relative flex flex-col justify-between overflow-hidden rounded border border-zinc-800/80 bg-[#020202] px-2 py-2 sm:px-2.5"
          style={{
            boxShadow: "inset 0 4px 16px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.05)"
          }}
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={CARD_MOTION_VIEWPORT}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {/* Active Accent Top Line */}
          <div 
            className="absolute inset-x-0 top-0 h-[2px] w-full opacity-40 transition-opacity duration-300 group-hover:opacity-100" 
            style={{ background: `linear-gradient(90deg, transparent, ${theme?.accent || '#fff'}, transparent)` }} 
          />
          
          {/* Label & Active Dot */}
          <div className="flex items-center justify-between">
            <p className={`${f1Telemetry} text-[6px] tracking-[0.15em] text-zinc-500 sm:text-[7px]`}>{s.label}</p>
            <div 
              className="h-1 w-1 rounded-full opacity-30 transition-opacity duration-300 group-hover:animate-pulse group-hover:opacity-100" 
              style={{ backgroundColor: theme?.accent || '#fff', boxShadow: `0 0 6px ${theme?.accent || '#fff'}` }} 
            />
          </div>
          
          {/* Main Value */}
          <p 
            className={`mt-1 text-xl font-black leading-none tracking-tight text-white antialiased sm:text-2xl ${f1Display}`}
            style={{ textShadow: `0 0 16px ${theme?.accent || '#fff'}22` }}
          >
            {s.value}
          </p>

          {/* Sub-label & Sparkline */}
          <div className="mt-1.5 flex items-center justify-between opacity-70">
            <span className={`${f1Telemetry} text-[5px] tracking-widest text-zinc-400 sm:text-[6px]`}>{s.sub}</span>
            <svg className="h-1.5 w-6 opacity-40 transition-opacity group-hover:opacity-80" viewBox="0 0 24 6" preserveAspectRatio="none">
              <path d="M0 3 L4 3 L6 1 L8 5 L10 3 L24 3" fill="none" stroke={theme?.accent || '#fff'} strokeWidth="0.75" />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GarageBuildStatus({ project }) {
  const dot = statusDotColor(project.status);
  const label = buildStatusText(project.status).replace("BUILD STATUS: ", "");
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/40 px-2 py-1 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse" style={{ backgroundColor: dot, boxShadow: `0 0 6px ${dot}` }} />
      <span className={`${f1Telemetry} text-[8px] text-zinc-300`}>{label}</span>
    </div>
  );
}

function GarageCarVisual({ teamData, theme }) {
  return (
   <div className="pointer-events-none absolute bottom-[60px] left-[2%] z-[15] w-[96%] max-w-none sm:bottom-[70px]">
      {/* 1. Drive-in Entrance Animation */}
      <motion.div
        initial={{ x: 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={CARD_MOTION_VIEWPORT}
        transition={{ type: "spring", stiffness: 40, damping: 12, delay: 0.15 }}
        className="relative"
        style={{ transform: "rotate(-1.5deg)" }}
      >
        {/* 2. Engine Idle / Hover Lift Container */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.03]"
        >
          {/* 3. Continuous Moving Speed Lines */}
          <div className="absolute inset-0 z-[1] overflow-hidden opacity-40 transition-opacity duration-300 group-hover:opacity-100" style={{ transform: "rotate(3deg)" }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute h-[2px] rounded-full"
                style={{
                  top: `${30 + i * 15}%`,
                  width: `${25 + i * 15}%`,
                  background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                  filter: `blur(${1 + i * 0.5}px)`,
                }}
                animate={{ left: ["120%", "-80%"] }}
                transition={{
                  duration: 0.8 + i * 0.3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Exhaust Underglow */}
          <div
            className="absolute -left-[5%] bottom-[12%] h-16 w-[40%] rounded-full opacity-60 blur-2xl transition-all duration-300 group-hover:w-[50%] group-hover:opacity-90"
            style={{ backgroundColor: theme.accent }}
          />

          {/* Volumetric Overhead Light Bloom */}
          <div
            className="absolute -top-[10%] right-[10%] h-40 w-[60%] rounded-[100%] blur-[45px] opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.25]"
            style={{ backgroundColor: theme.accent }}
          />

          {/* Ground Laser Track Line */}
          <motion.div
            className="absolute bottom-[4%] left-[2%] right-[2%] h-[2px] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent 5%, ${theme.accent}dd 30%, ${theme.accent}ff 50%, ${theme.accent}cc 70%, transparent 95%)`,
              boxShadow: `0 0 15px ${theme.glow}, 0 0 30px ${theme.accentSoft}`,
            }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Deep Core Drop Shadow */}
          <div
            className="absolute bottom-[-6%] left-[2%] right-[2%] h-20 rounded-[100%] blur-[20px] opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
          />

          {/* Main Car Asset */}
          <AssetImage
            src={teamData.car}
            alt={`${teamData.label} F1 car`}
            className="relative z-20 h-auto w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
            style={{
              transform: "scaleX(-1)", /* Flips the car to face left */
              filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.9))",
            }}
            fallback={
              <F1CarSvg className="relative z-20 h-auto w-full object-contain object-bottom opacity-95" />
            }
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function InlineTelemetryRow({ project, theme }) {
  const idx = projectIndex(project.id);
  const version = `V${(1 + idx * 0.4).toFixed(1)}`;
  const teamNum = String(project.tech.length).padStart(2, "0");
  const statusText = project.status === "Finished" ? "DEPLOYED" : project.status === "In Progress" ? "BUILDING" : "QUEUED";

  const items = [
    { label: "TEAM", value: teamNum },
    { label: "VERSION", value: version },
    { label: "STATUS", value: statusText },
  ];

  return (
    <div className="relative z-30 flex items-center gap-4 sm:gap-6 opacity-75">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col">
          <span className={`${f1Telemetry} text-[7px] text-zinc-500 sm:text-[8px]`}>{item.label}</span>
          <span className={`${f1Telemetry} text-[10px] text-zinc-300 sm:text-[11px]`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function CardActionButtons({ project, theme, onLinkClick }) {
  return (
    <div className="relative z-30 flex gap-3">
      <a
        href={project.demoUrl}
        onClick={onLinkClick}
        className={`inline-flex basis-[42%] items-center justify-center gap-2 rounded-2xl px-3.5 py-2 text-[11px] font-bold text-white antialiased shadow-lg transition-all duration-300 hover:brightness-125 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${f1Display}`}
        style={{
          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
          boxShadow: `0 4px 16px ${theme.glow}, 0 0 20px ${theme.accentSoft}88, inset 0 1px 0 rgba(255,255,255,0.25)`,
        }}
      >
        <span>Live Demo</span>
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <a
        href={project.repoUrl}
        onClick={onLinkClick}
        className={`inline-flex basis-[58%] items-center justify-center gap-2 rounded-2xl border px-3.5 py-2 text-[11px] font-bold text-zinc-200 antialiased backdrop-blur-md transition-all duration-300 hover:text-white hover:shadow-[0_0_16px_rgba(255,255,255,0.08)] hover:-translate-y-0.5 active:scale-95 ${f1Display}`}
        style={{
          borderColor: `${theme.accent}44`,
          backgroundColor: `${theme.accent}08`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 ${theme.accent}22`,
        }}
      >
        <Github className="h-3.5 w-3.5" />
        <span>Source Code</span>
      </a>
    </div>
  );
}

function TimelineProgressBar({ project, theme }) {
  const segments = 12;
  const filled = Math.round((project.progress / 100) * segments);
  return (
    <motion.div 
      className="mt-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={CARD_MOTION_VIEWPORT}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className={`${f1Telemetry} text-[6px] text-zinc-500`}>TIMELINE PROGRESS</p>
        <span className={`text-xs font-bold text-white antialiased ${f1Display}`}>{project.progress}%</span>
      </div>
      <div className="flex gap-0.75">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 origin-bottom rounded-[1px]"
            style={{
              backgroundColor: i < filled ? theme.accent : "rgba(255,255,255,0.08)",
              boxShadow: i < filled ? `0 0 6px ${theme.glow}` : "none",
            }}
            initial={{ opacity: 0, scaleY: 0.3 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={CARD_MOTION_VIEWPORT}
            transition={{ delay: i * 0.02, duration: 0.3, ease: CARD_MOTION_EASE }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function PipelineHealthBar({ theme }) {
  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className={`${f1Telemetry} text-[7px] text-zinc-500`}>PIPELINE HEALTH</p>
        <span className={`text-lg font-black leading-none text-white antialiased sm:text-xl ${f1Display}`}>100%</span>
    </div>
      <svg className="h-6 w-full sm:h-8" viewBox="0 0 300 52" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M0 26 L28 26 L38 10 L48 42 L58 26 L85 26 L98 14 L108 38 L118 26 L145 26 L158 6 L168 46 L178 26 L205 26 L218 16 L228 36 L238 26 L300 26"
          fill="none"
          stroke={theme.accent}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0.35 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={CARD_MOTION_VIEWPORT}
          transition={{ duration: 0.85, ease: CARD_MOTION_EASE }}
        />
      </svg>
  </div>
  );
}

function SystemHealthBar({ theme }) {
  const segments = [
    { w: 38, c: theme.accent },
    { w: 28, c: "#34d399" },
    { w: 18, c: "#fbbf24" },
    { w: 16, c: "rgba(255,255,255,0.1)" },
  ];
  return (
    <div className="mt-2">
      <p className={`mb-1 ${f1Telemetry} text-[7px] text-zinc-500`}>SYSTEM HEALTH</p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-sm">
        {segments.map((s, i) => (
          <motion.div
            key={i}
            className="h-full"
            style={{ backgroundColor: s.c }}
            initial={{ width: 0, opacity: 0.5 }}
            whileInView={{ width: `${s.w}%`, opacity: 1 }}
            viewport={CARD_MOTION_VIEWPORT}
            transition={{ delay: i * 0.06, duration: 0.4, ease: CARD_MOTION_EASE }}
          />
        ))}
  </div>
</div>
);
}

function DataFlowGraph({ theme }) {
  return (
    <div className="mt-2">
      <p className={`mb-1 ${f1Telemetry} text-[7px] text-zinc-500`}>DATA FLOW</p>
      <svg className="h-6 w-full sm:h-8" viewBox="0 0 320 56" aria-hidden="true">
        <motion.path
          d="M0 28 Q40 8 80 28 T160 28 T240 28 T320 28"
          fill="none"
          stroke={theme.accent}
          strokeWidth="2.5"
          opacity="0.55"
          initial={{ pathLength: 0, opacity: 0.25 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={CARD_MOTION_VIEWPORT}
          transition={{ duration: 0.8, ease: CARD_MOTION_EASE }}
        />
        {[40, 120, 200, 280].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={28}
            r="3.5"
            fill={theme.accent}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 0.85, scale: 1 }}
            viewport={CARD_MOTION_VIEWPORT}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: CARD_MOTION_EASE }}
          />
        ))}
      </svg>
    </div>
  );
}

function AnalyticsLineChart({ theme }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-[38%] z-[12] hidden h-12 w-full opacity-20 md:block"
      viewBox="0 0 280 72"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M0 48 L35 42 L70 52 L105 32 L140 46 L175 28 L210 40 L245 22 L280 36"
        fill="none"
        stroke={theme.accent}
        strokeWidth="1.75"
        initial={{ pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 0.45 }}
        viewport={CARD_MOTION_VIEWPORT}
        transition={{ duration: 0.75, ease: CARD_MOTION_EASE }}
      />
    </svg>
  );
}

function TeamGarageCard({ project }) {
  const teamData = TEAMS[project.team] || TEAMS.ferrari;
  const theme = getTeamTheme(project.team);
  const archetype = getArchetype(project.id);
  const stats = getGarageStats(project);

  return (
    <motion.article
  className="group relative h-full w-full overflow-hidden rounded-2xl bg-[#050505]"
  style={{
    minHeight: "620px",
    border: `1px solid ${theme.accent}33`,
    boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 12px 36px rgba(0,0,0,0.65), 0 0 48px ${theme.accentSoft}`,
  }}
  initial={false}
  whileHover={{ y: -3, scale: 1.002 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
      {/* Layer 1 — Base atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#060606] to-black" />

      {/* Layer 1 — Team colour atmosphere radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.22]"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 75% 85%, ${theme.accent} 0%, transparent 60%)`,
        }}
      />
      {/* Top-left team colour accent wash */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-48 w-48 opacity-[0.07]"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${theme.accent} 0%, transparent 70%)`,
        }}
      />
      {/* Volumetric light — overhead pit garage beam */}
      <div
        className="pointer-events-none absolute right-[15%] top-0 h-[60%] w-[40%] opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]"
        style={{
          background: `linear-gradient(180deg, ${theme.accent}44, transparent)`,
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Layer 2 — Telemetry texture */}
      <CardLayerCarbon />
      <CardLayerTelemetryGrid accent={theme.accent} />
      <CardLayerLightTrails accent={theme.accent} variant={archetype} uid={project.id} />
      {archetype === "analytics" && (
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-30">
          <AnalyticsLineChart theme={theme} />
        </div>
      )}

      {/* Layer 1 — Bottom-right car zone atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-100 opacity-75"
        style={{
          background: `radial-gradient(ellipse 85% 60% at 82% 92%, ${theme.accentSoft} 0%, transparent 55%)`,
        }}
      />
      {/* Hover light bloom */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 100px ${theme.accentSoft}` }}
      />
      {/* Scanning line animation */}
      <div
        className="garage-scan pointer-events-none absolute inset-x-0 top-0 z-[2] h-20 opacity-[0.06]"
        style={{
          background: `linear-gradient(180deg, transparent, ${theme.accent}55, transparent)`,
        }}
      />

      {/* Layer 3 — Content + Car */}
      <div className="relative z-10 flex h-full min-h-[620px] flex-col p-3 sm:p-4 lg:p-5">
        {/* TOP — tags, build status, small ring, menu */}
        <div className="flex shrink-0 items-start justify-between gap-2 mb-1.5">
          <CardMetaBadges project={project} theme={theme} />
          <div className="flex shrink-0 items-start gap-3">
            <GarageTopMetric project={project} theme={theme} />
            <button
              type="button"
              className="rounded-lg p-0.5 text-zinc-600 transition hover:bg-white/5 hover:text-zinc-300"
              aria-label="Project options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MAIN — layered content + car hero */}
        <div className="relative flex flex-1 flex-col pb-[220px]">
          <div className="relative z-20 max-w-[52%]">
            <CardTitleBlock project={project} theme={theme} />
<CardTechPills project={project} theme={theme} />
<p className={`mt-3 line-clamp-2 ${f1CardBody}`}>{project.description}</p>
          </div>

          {/* Telemetry data — directly on card surface, no bordered container */}
          <div
  className="relative z-50 mt-auto pt-4"
  style={{
    borderTop: `1px solid ${theme.accent}22`,
  }}
>
  <CardStatsRow stats={stats} theme={theme} />

  <div className="mt-4">
    <GarageTelemetry
      project={project}
      theme={theme}
    />
  </div>
</div>

          {/* Car — the HERO, dominant visual centerpiece */}
          <GarageCarVisual teamData={teamData} theme={theme} />
        </div>

        {/* BOTTOM — action buttons */}
        <div className="relative z-50 mt-5 shrink-0">
          <CardActionButtons
            project={project}
            theme={theme}
            onLinkClick={(e) => e.preventDefault()}
          />
        </div>
      </div>

      <style>{`
        @keyframes garage-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.1; }
          80% { opacity: 0.1; }
          100% { transform: translateY(450%); opacity: 0; }
        }
        .garage-scan { animation: garage-scan 6s ease-in-out infinite; }
      `}</style>
    </motion.article>
  );
}

function ProjectCard({ project }) {
  return <TeamGarageCard project={project} />;
}

export default function Projects({ data }) {
  useF1Fonts();

  const projects = useMemo(() => {
    if (data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
      return data.projects.map((p, i) => {
        const teams = ["ferrari", "mercedes", "redbull", "mclaren", "aston", "racingbulls"];
          const rawTech = p.technologies || p.techStack || p.keywords || p.tech || ["React"];
          let parsedTech = [];
          if (typeof rawTech === 'string') parsedTech = rawTech.split(',').map(t => t.trim());
          else if (Array.isArray(rawTech)) parsedTech = rawTech.map(t => typeof t === 'string' ? t : t.name || t.keyword || "Tech");
          else parsedTech = ["React"];

          let prog = p.progress;
          if (typeof prog === 'string') {
             prog = parseInt(prog.replace(/[^0-9]/g, ''), 10);
          }
          if (typeof prog !== 'number' || isNaN(prog)) {
             prog = Math.floor(Math.random() * 15) + 85;
          }

          return {
            id: i + 1,
            title: p.title || p.name || `Project ${i + 1}`,
            category: p.category || "Fullstack",
            description: p.description || "A high performance project.",
            tech: parsedTech,
            team: teams[i % teams.length],
            progress: prog,
            status: p.status || "Complete",
            metrics: [
               { label: "Optimization", value: "Max" },
               { label: "Status", value: "Deployed" }
            ],
          demoUrl: p.liveUrl || p.demoUrl || p.link || "#",
          repoUrl: p.githubUrl || p.repoUrl || p.sourceUrl || "#",
        };
      });
    }
    return fallbackProjects;
  }, [data]);

const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory, projects]
  );

  return (
    <section
   id="projects"
      className={`relative overflow-hidden bg-black py-16 text-white sm:py-20 md:py-24 ${f1Text}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239,68,68,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <HeroSection
          filteredCount={filteredProjects.length}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div id="projects-grid" className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
      ))}
    </div>

        {filteredProjects.length === 0 && (
          <p className="py-16 text-center text-zinc-500">
            No projects in this category yet.
          </p>
        )}
  </div>
</section>
);
}
