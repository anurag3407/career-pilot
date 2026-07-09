import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import topImg from "./assets/clapper-top.png";
import {
  Camera,
  Clapperboard,
  Film,
  Video,
  Monitor,
  Aperture,
  UserRound,
  Star,
  Award,
  ChevronRight,
  ChevronLeft,
  Instagram,
  Youtube,
  Github,
  Linkedin,
  Mail,
  Play,
  Menu,
  X as XIcon,
  Scissors,
  BookOpen,
  Users,
  Eye,
  Headphones,
  Palette,
  UserCheck,
  Grid3x3,
  Music,
  LayoutPanelLeft,
  Twitter,
  Crosshair,
  Code,
  Cpu,
  Database,
  Globe,
  Layers,
  Terminal,
  Server,
  Workflow,
  Cloud
} from "lucide-react";

// ─── Design System ────────────────────────────────────────────────────────────
const VOID = "#080706";
const DEEP = "#0B0A08";
const RICH = "#0F0D0A";
const SURFACE = "#141210";
const LIFT = "#1C1916";
const IVORY = "#EDE8DA";
const DIM = "#786C5A";
const GOLD = "#B8923A";
const CRIMSON = "#C8102E";

const BORDER = "rgba(184,146,58,0.13)";
const BORDER_HV = "rgba(184,146,58,0.5)";
const GOLD_GLOW = "rgba(184,146,58,0.2)";

const FD = "'Bebas Neue', sans-serif";
const FU = "'Barlow Condensed', sans-serif";
const FM = "'DM Mono', monospace";
const FB = "'Inter', sans-serif";

// ─── Animation Constants ──────────────────────────────────────────────────────
const TRANSITION_SLOW = { duration: 0.85, ease: [0.22, 1, 0.36, 1] };
const TRANSITION_MEDIUM = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };
const SPRING_DEFAULT = { type: "spring", stiffness: 300, damping: 14 };

// ─── Utility Functions ────────────────────────────────────────────────────────
function getSkillIcon(title = "") {
  const lower = title.toLowerCase();

  if (lower.includes("react") || lower.includes("next") || lower.includes("vue") || lower.includes("angular")) return Globe;
  if (lower.includes("tailwind") || lower.includes("css") || lower.includes("sass") || lower.includes("style")) return Palette;
  if (lower.includes("framer") || lower.includes("motion") || lower.includes("animation")) return Layers;
  if (lower.includes("typescript") || lower.includes("js") || lower.includes("ts") || lower.includes("javascript")) return Terminal;
  if (lower.includes("node") || lower.includes("express") || lower.includes("backend")) return Server;
  if (lower.includes("postgres") || lower.includes("sql") || lower.includes("database") || lower.includes("db") || lower.includes("mongo")) return Database;
  if (lower.includes("aws") || lower.includes("cloud") || lower.includes("gcp") || lower.includes("azure")) return Cloud;
  if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("container")) return Cpu;
  if (lower.includes("graphql") || lower.includes("api") || lower.includes("rest")) return Workflow;
  if (lower.includes("ci/cd") || lower.includes("workflow") || lower.includes("devops") || lower.includes("git")) return Workflow;
  if (lower.includes("figma") || lower.includes("design") || lower.includes("ui") || lower.includes("ux")) return Palette;
  if (lower.includes("python") || lower.includes("java") || lower.includes("c++") || lower.includes("c#")) return Code;

  if (lower.includes("dir")) return Camera;
  if (lower.includes("story") || lower.includes("writ") || lower.includes("script")) return BookOpen;
  if (lower.includes("cine") || lower.includes("camera") || lower.includes("lens") || lower.includes("aperture")) return Aperture;
  if (lower.includes("edit") || lower.includes("cut") || lower.includes("scissors")) return Scissors;
  if (lower.includes("film") || lower.includes("video")) return Film;
  if (lower.includes("actor") || lower.includes("cast") || lower.includes("talent") || lower.includes("user")) return Users;
  if (lower.includes("visual") || lower.includes("comp") || lower.includes("art") || lower.includes("eye")) return Eye;
  if (lower.includes("sound") || lower.includes("audio") || lower.includes("mix") || lower.includes("headphone")) return Headphones;
  if (lower.includes("color") || lower.includes("grade") || lower.includes("paint") || lower.includes("palette")) return Palette;
  if (lower.includes("scene") || lower.includes("art direction")) return LayoutPanelLeft;
  if (lower.includes("produc") || lower.includes("manage") || lower.includes("exec")) return UserCheck;
  if (lower.includes("board") || lower.includes("draw") || lower.includes("sketch")) return Grid3x3;
  if (lower.includes("documentary") || lower.includes("shoot")) return Video;
  if (lower.includes("music") || lower.includes("score") || lower.includes("song")) return Music;
  if (lower.includes("post") || lower.includes("vfx") || lower.includes("cgi") || lower.includes("monitor")) return Monitor;

  return Code;
}

function getTimelineIcon(role, idx) {
  const r = role.toLowerCase();
  if (r.includes("chair") || r.includes("director") || r.includes("lead")) return TLChair;
  if (r.includes("light") || r.includes("edit") || r.includes("post")) return TLLight;
  if (r.includes("reel") || r.includes("film") || r.includes("camera") || r.includes("shoot")) return TLReel;

  const icons = [TLChair, TLLight, TLReel];
  return icons[idx % icons.length];
}

const navItems = ["PROFILE", "SKILLS", "STATS", "PROJECTS", "EXPERIENCE", "TESTIMONIALS", "SOCIALS"];

// ─── SVG Components ──────────────────────────────────────────────────────────
function DirectorGearGraphic() {
  return (
    <svg viewBox="0 0 200 230" className="w-full h-auto opacity-75 mt-4" style={{ filter: "drop-shadow(0 0 8px rgba(184,146,58,0.12))" }}>
      <defs>
        <linearGradient id="light-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDE8DA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#B8923A" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE8DA" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#B8923A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M70 10 L25 150 L115 150 Z" fill="url(#light-cone)" opacity="0.12" />
      <g transform="translate(45, 45)">
        <line x1="0" y1="18" x2="0" y2="150" stroke="#786C5A" strokeWidth="2" />
        <line x1="0" y1="150" x2="-15" y2="175" stroke="#786C5A" strokeWidth="1.5" />
        <line x1="0" y1="150" x2="15" y2="175" stroke="#786C5A" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="22" fill="url(#ring-glow)" />
        <circle cx="0" cy="0" r="14" stroke="#EDE8DA" strokeWidth="3" fill="none" />
        <circle cx="0" cy="0" r="11" stroke="#B8923A" strokeWidth="0.8" fill="none" />
      </g>
      <g transform="translate(125, 110)">
        <line x1="-20" y1="30" x2="20" y2="75" stroke="#EDE8DA" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="30" x2="-20" y2="75" stroke="#EDE8DA" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="-24" y="24" width="48" height="6" rx="1.5" fill="#C8102E" stroke="#141210" strokeWidth="1" />
        <line x1="-24" y1="5" x2="-24" y2="24" stroke="#786C5A" strokeWidth="2" />
        <line x1="24" y1="5" x2="24" y2="24" stroke="#786C5A" strokeWidth="2" />
        <line x1="-27" y1="5" x2="-8" y2="5" stroke="#B8923A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="5" x2="27" y2="5" stroke="#B8923A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-20" y1="-18" x2="-20" y2="24" stroke="#786C5A" strokeWidth="2" />
        <line x1="20" y1="-18" x2="20" y2="24" stroke="#786C5A" strokeWidth="2" />
        <rect x="-22" y="-15" width="44" height="16" rx="1" fill="#C8102E" stroke="#141210" strokeWidth="1" />
        <text x="0" y="-4" fill="#EDE8DA" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.8" fontFamily="sans-serif">
          DIRECTOR
        </text>
        <line x1="-15" y1="55" x2="15" y2="55" stroke="#EDE8DA" strokeWidth="1.5" />
      </g>
      <g transform="translate(55, 140)">
        <line x1="0" y1="15" x2="-18" y2="75" stroke="#786C5A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="15" x2="18" y2="75" stroke="#786C5A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="15" x2="0" y2="75" stroke="#786C5A" strokeWidth="2" strokeLinecap="round" />
        <rect x="-18" y="-10" width="36" height="20" rx="1.5" fill="#141210" stroke="#B8923A" strokeWidth="1.2" />
        <rect x="-14" y="-18" width="18" height="8" rx="0.8" fill="#080706" stroke="#786C5A" strokeWidth="0.8" />
        <path d="M-14 -10 L-18 -7" stroke="#786C5A" strokeWidth="0.8" />
        <circle cx="-8" cy="-16" r="8" fill="#080706" stroke="#EDE8DA" strokeWidth="0.8" />
        <circle cx="8" cy="-16" r="8" fill="#080706" stroke="#EDE8DA" strokeWidth="0.8" />
        <circle cx="-8" cy="-16" r="1.5" fill="#EDE8DA" />
        <circle cx="8" cy="-16" r="1.5" fill="#EDE8DA" />
        <path d="M18 -5 L28 -8 L28 2 L18 -1 Z" fill="#1C1916" stroke="#B8923A" strokeWidth="1" />
        <circle cx="28" cy="-3" r="4" fill="none" stroke="#EDE8DA" strokeWidth="0.8" />
        <circle cx="-11" cy="3" r="1.2" fill="#C8102E" />
      </g>
    </svg>
  );
}

const TLChair = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M5 20L19 9 M19 20L5 9" />
    <path d="M7 9V4h10v5 M5 13h14" />
  </svg>
);

const TLLight = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M10 12L8 22 M14 12l2 10 M6 22h12" />
  </svg>
);

const TLReel = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

// ─── Reusable Components ──────────────────────────────────────────────────────
function TicketCard({ children, h, setH, className = "", style = {}, notchColor = RICH, level }) {
  const activeSegments = level ? Math.round((level / 100) * 12) : 9;

  return (
    <motion.div
      onHoverStart={() => setH?.(true)}
      onHoverEnd={() => setH?.(false)}
      animate={h ? { y: -5 } : { y: 0 }}
      className={`relative p-4 cursor-default select-none ${className}`}
      style={{
        backgroundColor: h ? LIFT : SURFACE,
        border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
        boxShadow: h ? `0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(184,146,58,0.25)` : "none",
        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        borderRadius: "4px",
        ...style,
      }}
    >
      <CC color={h ? `${GOLD}cc` : GOLD_GLOW} size={8} />

      <div
        className="absolute -left-[6px] bottom-[30px] w-3 h-3 rounded-full z-15"
        style={{
          backgroundColor: notchColor,
          border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
          borderLeftColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          transition: "border-color 0.3s",
        }}
      />
      <div
        className="absolute -right-[6px] bottom-[30px] w-3 h-3 rounded-full z-10"
        style={{
          backgroundColor: notchColor,
          border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
          borderRightColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          transition: "border-color 0.3s",
        }}
      />

      <div
        className="absolute left-[6px] right-[6px] bottom-[35px] h-px pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(90deg, ${h ? "rgba(184,146,58,0.4)" : "rgba(184,146,58,0.15)"} 50%, transparent 50%)`,
          backgroundSize: "6px 1px",
          backgroundRepeat: "repeat-x",
        }}
      />

      <div className="absolute bottom-2.5 left-4 right-4 flex gap-[2px]">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[2px] flex-1 rounded-sm transition-colors duration-300"
            style={{
              backgroundColor: idx < activeSegments
                ? (h ? CRIMSON : `${CRIMSON}66`)
                : (h ? `${GOLD}44` : `${GOLD}15`),
            }}
          />
        ))}
      </div>

      {children}
    </motion.div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-55px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GoldLine({ className = "" }) {
  return <div className={className} style={{ height: "1px", backgroundColor: GOLD_GLOW }} />;
}

function FilmStrip() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around py-3" style={{ backgroundColor: `${VOID}dd` }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="mx-1 rounded-sm"
          style={{ height: "9px", backgroundColor: "#101010", border: "1px solid #181818" }}
        />
      ))}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left z-[9999]"
      style={{
        scaleX,
        height: "2px",
        backgroundColor: CRIMSON,
        boxShadow: `0 0 10px ${CRIMSON}aa, 0 0 4px ${CRIMSON}`,
      }}
    />
  );
}

function MouseSpotlight() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9990]"
      style={{
        width: "440px",
        height: "440px",
        borderRadius: "50%",
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, rgba(184,146,58,0.055) 0%, transparent 70%)`,
        transition: "left 0.08s linear, top 0.08s linear",
      }}
    />
  );
}

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9998,
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}

function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9997,
        background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  );
}

function Spotlight({ cx = "50%", cy = "-10%", color = `rgba(184,146,58,0.06)`, r = "70%" }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 0,
        background: `radial-gradient(ellipse ${r} ${r} at ${cx} ${cy}, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)",
      }}
    />
  );
}

function CC({ color = GOLD_GLOW, size = 13 }) {
  return (
    <>
      {[
        ["top-2 left-2", "borderTop", "borderLeft"],
        ["top-2 right-2", "borderTop", "borderRight"],
        ["bottom-2 left-2", "borderBottom", "borderLeft"],
        ["bottom-2 right-2", "borderBottom", "borderRight"],
      ].map(([pos, b1, b2], i) => (
        <div
          key={i}
          className={`absolute ${pos} pointer-events-none`}
          style={{
            width: size,
            height: size,
            [b1]: `1px solid ${color}`,
            [b2]: `1px solid ${color}`,
          }}
        />
      ))}
    </>
  );
}

function Rec({ bright = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: CRIMSON }}
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        style={{
          fontFamily: FM,
          fontSize: "8px",
          letterSpacing: "0.2em",
          color: bright ? `${IVORY}44` : `${CRIMSON}bb`,
        }}
      >
        REC
      </span>
    </div>
  );
}

function AnimCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTs = null;
    const duration = 1400;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num]);

  return (
    <span ref={ref}>
      {display}
      {value.includes("+") ? "+" : suffix}
    </span>
  );
}

function PremiumCursor() {
  const mainRef = useRef(null);
  const frameRef = useRef(null);
  const recRef = useRef(null);

  const mouse = useRef({ x: -200, y: -200 });
  const smooth = useRef({ x: -200, y: -200 });

  const isHover = useRef(false);
  const raf = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const el = e.target;
      isHover.current = !!(el && el.closest("a, button, [role='button'], .cursor-pointer, input, select, textarea"));
    };

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.15;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.15;

      if (frameRef.current) {
        frameRef.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) scale(${isHover.current ? 0.75 : 1})`;
        frameRef.current.style.color = isHover.current ? CRIMSON : GOLD;
        frameRef.current.style.backgroundColor = isHover.current ? `rgba(200,16,46,0.05)` : `transparent`;
      }

      if (recRef.current) {
        recRef.current.style.opacity = isHover.current ? "1" : "0";
      }

      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${isHover.current ? 0.5 : 1})`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99999 }}>
      <style>{`
        *, *::before, *::after {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={frameRef}
        className="absolute top-0 left-0 -ml-[45px] -mt-[45px] rounded-full transition-colors duration-300 flex items-center justify-center"
        style={{ width: 90, height: 90, willChange: "transform", border: `1px solid currentColor`, color: GOLD }}
      >
        <div className="absolute top-[20px] left-[12px] w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-current opacity-80" />
        <div className="absolute top-[20px] right-[12px] w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-current opacity-80" />
        <div className="absolute bottom-[20px] left-[12px] w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-current opacity-80" />
        <div className="absolute bottom-[20px] right-[12px] w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-current opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2.5 bg-current opacity-70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2.5 bg-current opacity-70" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-[1px] bg-current opacity-70" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-[1px] bg-current opacity-70" />
        <div ref={recRef} className="absolute top-4 right-5 flex items-center gap-1 transition-opacity duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
          <span style={{ fontFamily: FM, fontSize: "6px", color: CRIMSON }}>REC</span>
        </div>
      </div>
      <div
        ref={mainRef}
        className="absolute top-0 left-0 -ml-[12px] -mt-[12px] flex items-center justify-center transition-transform duration-200"
        style={{ width: 24, height: 24, willChange: "transform" }}
      >
        <div className="w-full h-[1px] bg-white opacity-40 absolute mix-blend-difference" />
        <div className="w-[1px] h-full bg-white opacity-40 absolute mix-blend-difference" />
      </div>
    </div>
  );
}

function PlayOverlay({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)", backdropFilter: "blur(2px)" }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            className="w-14 h-14 rounded-full flex items-center justify-center border border-[#B8923A] shadow-[0_0_20px_rgba(184,146,58,0.35)]"
            style={{ backgroundColor: "rgba(15,13,10,0.85)" }}
          >
            <Play size={20} fill="#B8923A" color="#B8923A" className="ml-1" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({ p, index }) {
  const [h, setH] = useState(false);
  const title = p.title || "";
  const description = p.description || p.synopsis || "";
  const techStack = p.techStack || p.technologies || [];
  const genre = p.genre || (techStack.length ? techStack.slice(0, 2).join(" / ") : "Production");
  const year = p.year || "2025";
  const runtime = p.runtime || "Interactive";
  const rating = p.rating || "8.5";
  const liveUrl = p.liveUrl || "#";
  const githubUrl = p.githubUrl || p.repoUrl || "#";
  const image = p.image || "";

  const getGenreColor = (g) => {
    const l = g.toLowerCase();
    if (l.includes("drama") || l.includes("react")) return "#4a6fa5";
    if (l.includes("thrill") || l.includes("node")) return "#8b4a6b";
    if (l.includes("doc") || l.includes("pyth")) return "#5a7a4a";
    return "#6a5a4a";
  };

  return (
    <motion.div
      onHoverStart={() => setH(true)}
      onHoverEnd={() => setH(false)}
      className="relative flex-shrink-0 cursor-default select-none overflow-hidden w-[calc((100%-40px)/1.4)] md:w-[calc((100%-60px)/3.2)] xl:w-[calc((100%-100px)/5.2)]"
      style={{
        height: "350px",
        backgroundColor: SURFACE,
        border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
        boxShadow: h ? "0 12px 32px rgba(0,0,0,0.6), 0 0 15px rgba(184,146,58,0.22)" : "none",
        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        borderRadius: "4px",
        scrollSnapAlign: "center",
      }}
    >
      <CC color={h ? `${GOLD}cc` : GOLD_GLOW} size={8} />
      <div
        className="absolute -left-[6px] bottom-[90px] w-3 h-3 rounded-full z-20"
        style={{
          backgroundColor: VOID,
          border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
          borderLeftColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          transition: "border-color 0.3s",
        }}
      />
      <div
        className="absolute -right-[6px] bottom-[90px] w-3 h-3 rounded-full z-20"
        style={{
          backgroundColor: VOID,
          border: `1px solid ${h ? "rgba(184,146,58,0.6)" : "rgba(184,146,58,0.13)"}`,
          borderRightColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          transition: "border-color 0.3s",
        }}
      />
      <div
        className="absolute left-[6px] right-[6px] bottom-[95px] h-px pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(90deg, ${h ? "rgba(184,146,58,0.4)" : "rgba(184,146,58,0.15)"} 50%, transparent 50%)`,
          backgroundSize: "6px 1px",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div className="absolute top-0 left-0 right-0 bottom-[100px] overflow-hidden bg-[#0A0907]">
        <motion.div
          animate={h ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400"})`,
            opacity: h ? 0.45 : 0.7,
            transition: "opacity 0.3s",
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)" }} />
        <div className="absolute top-3 left-3 px-2 py-0.5" style={{ backgroundColor: getGenreColor(genre), border: `1px solid ${GOLD}33` }}>
          <span style={{ fontFamily: FU, fontSize: "7px", letterSpacing: "0.1em", color: IVORY }}>
            {genre.toUpperCase()}
          </span>
        </div>
        <PlayOverlay visible={h} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[96px] p-3 flex flex-col justify-between bg-[#141210]">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Star size={8} color={GOLD} fill={GOLD} />
            <span style={{ fontFamily: FM, fontSize: "8px", color: GOLD }}>{rating}</span>
            <span style={{ fontFamily: FM, fontSize: "7px", color: `${IVORY}44` }}>
              · {runtime} · {year}
            </span>
          </div>
          <h3 className="truncate font-semibold transition-colors duration-300" style={{ fontFamily: FD, fontSize: "16px", letterSpacing: "0.04em", color: h ? GOLD : IVORY }}>
            {title.toUpperCase()}
          </h3>
        </div>
        <div className="flex gap-2">
          {liveUrl && liveUrl !== "#" && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-crimson hover:bg-red-800 text-[8px] font-bold tracking-widest text-white transition-colors" style={{ fontFamily: FU }}>
              <Play size={8} fill="white" /> WATCH LIVE
            </a>
          )}
          {githubUrl && githubUrl !== "#" && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 hover:bg-zinc-800 text-[8px] font-bold tracking-widest text-white border border-[#ffffff15] transition-colors" style={{ fontFamily: FU, backgroundColor: "rgba(255,255,255,0.02)" }}>
              Watch BTS
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FilmstripPerforations() {
  return (
    <div className="w-full flex justify-between px-1 h-3 opacity-25">
      {Array.from({ length: 45 }).map((_, i) => (
        <div key={i} className="w-2.5 h-2 bg-[#0B0A08] border border-[#ffffff0e] rounded-sm flex-shrink-0" />
      ))}
    </div>
  );
}

function TimelineItem({ item, index, total }) {
  const ref = useRef(null);
  const isActive = useInView(ref, { margin: "-30% 0px -40% 0px" });

  const roleText = item.role || item.title || "DIRECTOR";
  const companyText = item.company || item.organization || "PRODUCTION";
  const periodText = item.period || item.duration || item.year || "";
  const descText = item.description || item.desc || "";

  const IconComponent = getTimelineIcon(roleText, index);

  return (
    <motion.div ref={ref} className="relative grid grid-cols-[80px_30px_1fr_30px] md:grid-cols-[100px_40px_1fr_40px] gap-2 md:gap-4 items-center group cursor-default py-6">
      <div className="text-right transition-colors duration-300" style={{ fontFamily: FM, fontSize: "9px", color: isActive ? GOLD : DIM, letterSpacing: "0.1em", lineHeight: 1.4 }}>
        {periodText ? periodText.replace("–", "-") : ""}
      </div>
      <div className="relative flex justify-center z-20">
        <motion.div
          animate={{ scale: isActive ? 1.25 : 1, borderColor: isActive ? CRIMSON : "rgba(120, 108, 90, 0.4)" }}
          transition={{ duration: 0.3 }}
          className="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-[#0F0D0A]"
          style={{ border: "2px solid" }}
        >
          <motion.div animate={{ backgroundColor: isActive ? CRIMSON : "rgba(200, 16, 46, 0.4)", scale: isActive ? 1.2 : 1 }} className="w-[6px] h-[6px] rounded-full" />
        </motion.div>
        {isActive && <div className="absolute inset-0 rounded-full bg-crimson/20 blur-[6px] animate-pulse pointer-events-none" />}
      </div>
      <motion.div
        animate={{
          x: isActive ? 5 : 0,
          borderColor: isActive ? "rgba(184,146,58,0.5)" : "rgba(184,146,58,0.1)",
          backgroundColor: isActive ? LIFT : SURFACE,
          boxShadow: isActive ? "0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(184,146,58,0.15)" : "none",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative flex flex-col p-5 md:p-6 rounded-[4px] border transition-colors duration-300"
        style={{ borderStyle: "solid" }}
      >
        {isActive && <CC color={GOLD} size={6} />}
        <div className="flex justify-between items-start mb-1">
          <h3 className="transition-colors duration-300" style={{ fontFamily: FD, fontSize: "clamp(18px, 2.5vw, 24px)", color: isActive ? GOLD : IVORY, letterSpacing: "0.05em", lineHeight: 1.1 }}>
            {roleText.toUpperCase()}
          </h3>
          {isActive && (
            <div className="px-1.5 py-0.5 border border-crimson rounded-sm bg-crimson/10 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
              <span className="text-[6px] font-mono text-crimson uppercase tracking-widest font-bold">ACTIVE</span>
            </div>
          )}
        </div>
        <p style={{ fontFamily: FU, fontSize: "10px", letterSpacing: "0.15em", color: isActive ? IVORY : CRIMSON, marginBottom: "8px", fontWeight: 600 }}>
          {companyText.toUpperCase()}
        </p>
        <p className="text-xs transition-colors duration-300" style={{ fontFamily: FB, color: isActive ? `${IVORY}cc` : `${IVORY}66`, lineHeight: 1.6, maxWidth: "95%" }}>
          {descText}
        </p>
      </motion.div>
      <div className="flex justify-end transition-all duration-300" style={{ color: isActive ? GOLD : DIM, opacity: isActive ? 0.35 : 0.08, transform: isActive ? "scale(1.1) translateX(2px)" : "scale(1)" }}>
        <IconComponent size={20} />
      </div>
    </motion.div>
  );
}

// ─── Section Components ──────────────────────────────────────────────────────
function Navbar() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const name = personal.name || "Ashwin R.";
  const title = personal.title || "Film Director";

  const [active, setActive] = useState("PROFILE");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(id);
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 10);
      const y = window.scrollY + 120;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].toLowerCase());
        if (el && el.offsetTop <= y) {
          setActive(navItems[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? `${VOID}f2` : VOID,
        borderBottom: `1px solid ${BORDER}`,
        backdropFilter: "blur(18px)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: FD, fontSize: "15px", color: IVORY }}>
              {name[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <span style={{ fontFamily: FU, fontSize: "10px", color: DIM, letterSpacing: "0.22em" }}>
            {title.toUpperCase()}
          </span>
          <div className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: CRIMSON }} />
        </div>
        <div className="hidden md:flex items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="relative px-3 py-1.5"
              style={{
                fontFamily: FU,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: active === item ? IVORY : DIM,
                transition: "color 0.2s",
              }}
            >
              {item}
              {active === item && (
                <motion.div layoutId="nav-line" className="absolute bottom-0 left-3 right-3" style={{ height: "1px", backgroundColor: CRIMSON }} />
              )}
            </button>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: DIM }}>
          {mobileOpen ? <XIcon size={16} /> : <Menu size={16} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: VOID, borderTop: `1px solid ${BORDER}` }}
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="block w-full text-left px-8 py-3"
                style={{
                  fontFamily: FU,
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: active === item ? IVORY : DIM,
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};

  const name = personal.name || "Ashwin R.";
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "Ashwin";
  const lastName = nameParts.slice(1).join(" ") || "R.";

  const designation = personal.tagline || "Film Director";
  const bio = personal.bio || "Crafting cinematic experiences that stay long after the credits roll. Stories. Emotion. Vision.";
  const avatar = personal.avatar || "";

  const roll = personal.roll || "A001";
  const scene = personal.scene || "24";
  const take = personal.take || "7";
  const cta = personal.cta || "Watch Showreel";

  return (
    <section id="profile" className="relative overflow-hidden" style={{ backgroundColor: DEEP }}>
      <Spotlight cx="75%" cy="15%" color="rgba(184,146,58,0.07)" r="60%" />
      <Spotlight cx="15%" cy="85%" color={`${CRIMSON}07`} r="40%" />
      <Scanlines />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal delay={0}>
            <div className="flex items-center gap-5 mb-8">
              {[
                ["ROLL", roll],
                ["SCENE", scene],
                ["TAKE", take],
              ].map(([l, v], i) => (
                <div key={l} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-5" style={{ backgroundColor: BORDER }} />}
                  <div>
                    <div style={{ fontFamily: FM, fontSize: "9px", color: `${GOLD}77`, letterSpacing: "0.18em" }}>{l}</div>
                    <div style={{ fontFamily: FM, fontSize: "13px", color: `${IVORY}99`, fontWeight: 500 }}>{v}</div>
                  </div>
                </div>
              ))}
              <div className="w-px h-5" style={{ backgroundColor: BORDER }} />
              <Rec />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontFamily: FU, fontSize: "13px", letterSpacing: "0.3em", color: GOLD, marginBottom: "5px" }}>HI, I'M</p>
            <h1 style={{ fontFamily: FD, fontSize: "clamp(56px,9vw,100px)", lineHeight: 0.9, letterSpacing: "0.02em", color: IVORY, marginBottom: "7px" }}>
              {firstName} <span style={{ color: CRIMSON }}>{lastName}</span>
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-7" style={{ backgroundColor: GOLD_GLOW }} />
              <p style={{ fontFamily: FU, fontSize: "14px", letterSpacing: "0.3em", color: DIM, fontWeight: 500 }}>{designation.toUpperCase()}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative p-5 mb-8" style={{ border: `1px solid ${BORDER}`, backgroundColor: `${SURFACE}66` }}>
              <CC color={GOLD_GLOW} size={10} />
              <p style={{ fontFamily: FB, fontSize: "15px", lineHeight: 1.8, color: DIM, fontStyle: "italic" }}>{bio}</p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ backgroundColor: "#a50d24" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-7 py-3.5"
                style={{ backgroundColor: CRIMSON, color: IVORY, fontFamily: FU, fontSize: "12px", letterSpacing: "0.26em", fontWeight: 700, border: "none" }}
              >
                <Play size={11} fill={IVORY} /> {cta.toUpperCase()}
              </motion.button>
              <span style={{ fontFamily: FM, fontSize: "10px", color: `${GOLD}55`, letterSpacing: "0.15em" }}>VISION · FRAME · STORY</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] max-w-sm mx-auto overflow-hidden shadow-2xl" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
            <CC color={`${GOLD}2a`} size={15} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 55% 22%, rgba(184,146,58,0.09) 0%, transparent 55%)` }} />
            {["left-0", "right-0"].map((s, i) => (
              <div key={i} className={`absolute ${s} top-0 bottom-0 w-7 flex flex-col justify-around py-2`} style={{ backgroundColor: VOID }}>
                {Array.from({ length: 16 }).map((_, j) => (
                  <div key={j} className="mx-1 rounded-sm" style={{ height: "9px", backgroundColor: "#11", border: "1px solid #191918" }} />
                ))}
              </div>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10">
              <div className="relative">
                <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle,${SURFACE} 0%,${VOID} 80%)`, border: `1px solid ${BORDER}` }}>
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ border: `1px solid ${BORDER}` }}>
                      <UserRound size={52} color={`${IVORY}18`} strokeWidth={0.8} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: CRIMSON, border: `2px solid ${SURFACE}` }}>
                  <Camera size={14} color={IVORY} />
                </div>
              </div>
              <div className="flex items-center gap-5 opacity-20">
                {[Film, Clapperboard, Aperture].map((Icon, i) => (
                  <Icon key={i} size={18} color={IVORY} strokeWidth={1.5} />
                ))}
              </div>
              <div className="px-4 py-1.5" style={{ border: `1px solid ${CRIMSON}2a`, backgroundColor: `${CRIMSON}08` }}>
                <span style={{ fontFamily: FD, fontSize: "13px", letterSpacing: "0.42em", color: `${IVORY}44` }}>DIRECTOR</span>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)" }} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1" style={{ backgroundColor: VOID }}>
              <span style={{ fontFamily: FM, fontSize: "9px", color: `${IVORY}2a`, letterSpacing: "0.18em" }}>
                SCENE {scene} · TAKE {take}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center justify-between">
          <div className="flex gap-6">
            {["FOCUS: MANUAL", "ISO: 800", "f/2.8", "24fps"].map((l) => (
              <span key={l} style={{ fontFamily: FM, fontSize: "12px", color: `${IVORY}22`, letterSpacing: "0.12em" }}>{l}</span>
            ))}
          </div>
          <Rec />
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const { portfolioData } = usePortfolio();
  const skills = portfolioData?.skills || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden" style={{ backgroundColor: RICH }}>
      <Spotlight cx="12%" cy="50%" color="rgba(184,146,58,0.05)" r="50%" />
      <Scanlines />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[520px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-shrink-0 flex flex-col overflow-hidden"
          style={{ width: "clamp(210px,26%,280px)", borderRight: `1px solid ${BORDER}` }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: VOID }} />
          <FilmStrip />
          <Scanlines />
          <div className="relative z-10 pl-10 pr-5 pt-10 pb-8 flex flex-col h-full">
            <div className="w-12 h-12 flex items-center justify-center mb-5 relative" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <CC color={`${GOLD}33`} size={8} />
              <Clapperboard size={22} color={GOLD} strokeWidth={1.5} />
            </div>
            {[
              ["ROLL", "A001"],
              ["TAKE", "07"],
              ["SCENE", "02"],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center gap-3 mb-1">
                <span style={{ fontFamily: FM, fontSize: "10px", color: `${IVORY}22`, letterSpacing: "0.15em", minWidth: "28px" }}>{l}</span>
                <span style={{ fontFamily: FM, fontSize: "14px", color: `${IVORY}44` }}>{v}</span>
              </div>
            ))}
            <Rec bright />
            <GoldLine className="my-5" />

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: FD, fontSize: "58px", lineHeight: 0.92, color: IVORY, letterSpacing: "0.04em", marginBottom: "12px" }}
            >
              SKILLS
            </motion.h2>
            <DirectorGearGraphic />
            <div className="flex-1" />
            <GoldLine className="mb-3" />
            <div className="flex gap-3">
              {["MANUAL", "ISO 800", "f/2.8"].map((l) => (
                <span key={l} style={{ fontFamily: FM, fontSize: "10px", color: `${IVORY}18`, letterSpacing: "0.1em" }}>{l}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex-1 p-8 lg:p-10">
          <Reveal delay={0.3}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
              <span style={{ fontFamily: FM, fontSize: "10px", letterSpacing: "0.32em", color: GOLD }}>
                {skills.length} AREAS OF EXPERTISE
              </span>
              <div className="h-px w-8" style={{ backgroundColor: BORDER }} />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {skills.map((s, i) => (
              <SkillCard key={s.name || s.title || i} skill={s} index={i} />
            ))}
          </div>
          <Reveal delay={1.0}>
            <div className="mt-8 pt-5 flex items-center gap-4" style={{ borderTop: `1px solid ${BORDER}` }}>
              <Film size={10} color={GOLD} />
              <span style={{ fontFamily: FM, fontSize: "10px", color: `${IVORY}22`, letterSpacing: "0.15em" }}>SCENE 02 · TAKE 07 · ROLL A001</span>
              <div className="flex-1 h-px" style={{ backgroundColor: BORDER }} />
              <span style={{ fontFamily: FM, fontSize: "7px", color: `${IVORY}22`, letterSpacing: "0.15em" }}>{skills.length} AREAS OF EXPERTISE</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  const [h, setH] = useState(false);
  const title = skill.name || skill.title || "";
  const category = skill.category || "Skill";

  let numericLevel = 80;
  if (typeof skill.level === 'number') {
    numericLevel = skill.level;
  } else if (typeof skill.level === 'string') {
    const parsed = parseInt(skill.level.replace(/\D/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) {
      numericLevel = parsed;
    } else {
      const l = skill.level.toLowerCase();
      if (l.includes('expert')) numericLevel = 95;
      else if (l.includes('advanced')) numericLevel = 85;
      else if (l.includes('intermediate')) numericLevel = 65;
      else if (l.includes('beginner')) numericLevel = 45;
    }
  }

  const Icon = getSkillIcon(title);
  const delay = (index % 5) * 0.07 + Math.floor(index / 5) * 0.12;

  return (
    <Reveal delay={delay}>
      <TicketCard h={h} setH={setH} className="flex flex-col items-center h-full min-h-[150px] justify-between" notchColor={RICH} level={numericLevel}>
        <div className="flex flex-col items-center w-full">
          <motion.div
            animate={h ? { scale: 1.22, rotate: 15 } : { scale: 1, rotate: 0 }}
            transition={SPRING_DEFAULT}
            className="w-12 h-12 flex items-center justify-center mb-1.5 rounded-full"
            style={{ backgroundColor: h ? `${CRIMSON}18` : `${GOLD}07`, transition: "background-color 0.3s" }}
          >
            <Icon size={24} color={h ? CRIMSON : DIM} strokeWidth={1.5} style={{ transition: "color 0.3s" }} />
          </motion.div>
          <motion.div
            animate={h ? { width: "34px" } : { width: "16px" }}
            transition={{ duration: 0.28 }}
            style={{ height: "2px", backgroundColor: GOLD, opacity: 0.5, borderRadius: "1px", marginBottom: "8px" }}
          />
          <p className="text-center truncate w-full px-2" style={{ fontFamily: FU, fontSize: "13px", letterSpacing: "0.12em", fontWeight: 700, color: h ? IVORY : `${IVORY}bb`, transition: "color 0.3s" }}>
            {title.toUpperCase()}
          </p>
        </div>
        <div className="w-full flex flex-col items-center mt-2 mb-6">
          <SegBar level={numericLevel} delay={delay + 0.2} />
          <p className="text-center mt-2" style={{ fontFamily: FM, fontSize: "10px", color: h ? GOLD : `${GOLD}aa`, letterSpacing: "0.12em", transition: "color 0.3s", textTransform: "uppercase" }}>
            {category}
          </p>
        </div>
      </TicketCard>
    </Reveal>
  );
}

function SegBar({ level, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const filled = Math.round((level / 100) * 10);
  return (
    <div ref={ref} className="flex gap-[3px] mt-1.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.26, delay: delay + i * 0.04, ease: "easeOut" }}
          style={{ width: "15px", height: "3px", borderRadius: "1px", transformOrigin: "left center", backgroundColor: i < filled ? CRIMSON : `${GOLD}18` }}
        />
      ))}
    </div>
  );
}

function Stats() {
  const { portfolioData } = usePortfolio();
  const stats = portfolioData?.stats || {};

  const statItems = Object.entries(stats).map(([key, val]) => {
    let label = "";
    let desc = "";
    let iconType = "film";

    if (key === "yearsExperience") {
      label = "Years Experience";
      desc = "Directing and engineering visual experiences for years.";
      iconType = "award";
    } else if (key === "projectsCompleted" || key === "projectsCount") {
      label = "Projects Directed";
      desc = "From short films to websites, bringing stories to life.";
      iconType = "film";
    } else if (key === "happyClients") {
      label = "Happy Clients";
      desc = "Trusted by brands and creators to deliver exceptional results.";
      iconType = "users";
    } else {
      label = key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, (c) => c.toUpperCase());
      desc = `Total logged count for ${label.toLowerCase()}.`;
      iconType = "star";
    }

    return {
      key,
      value: typeof val === "number" ? `${val}+` : val,
      label,
      desc,
      iconType,
    };
  });

  const ref = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <section
      id="stats"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden py-24"
      style={{
        backgroundColor: RICH,
        color: IVORY,
        backgroundImage: `linear-gradient(rgba(184, 146, 58, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 146, 58, 0.015) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    >
      <Scanlines />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(184,146,58,0.035) 0%, transparent 70%)`,
          transition: "background 0.08s ease-out",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-8 mb-12 relative z-10">
        <Reveal delay={0}>
          <div className="flex flex-col md:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.4)]" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex gap-6 px-8 py-4 w-full md:w-auto relative" style={{ backgroundColor: SURFACE, borderRight: `1px solid ${BORDER}` }}>
              <div className="flex flex-col items-center">
                <span className="text-[#786C5A] font-mono text-[8px] tracking-widest mb-1">SCENE</span>
                <span className="font-mono text-sm text-[#EDE8DA]">02</span>
              </div>
              <div className="w-px bg-red-800/40 my-1" />
              <div className="flex flex-col items-center">
                <span className="text-[#786C5A] font-mono text-[8px] tracking-widest mb-1">TAKE</span>
                <span className="font-mono text-sm text-[#EDE8DA]">07</span>
              </div>
              <div className="w-px bg-red-800/40 my-1" />
              <div className="flex flex-col items-center">
                <span className="text-[#786C5A] font-mono text-[8px] tracking-widest mb-1">ROLL</span>
                <span className="font-mono text-sm text-[#EDE8DA]">A001</span>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between px-6 lg:px-10 py-4 relative" style={{ backgroundColor: VOID }}>
              <div className="relative z-10 flex gap-4 lg:gap-8 font-mono text-[14px] tracking-widest text-[#786C5A]">
                <span>FOCUS : MANUAL</span>
                <span>ISO : 800</span>
                <span>f/2.8</span>
              </div>
              <Crosshair size={16} color={CRIMSON} className="relative z-10 opacity-70" />
              <CC color={GOLD_GLOW} size={8} />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 relative z-10" style={{ zIndex: 10 }}>
        <div className="xl:col-span-5 relative flex flex-col pt-4 overflow-hidden xl:overflow-visible z-10" style={{ zIndex: 10 }}>
          <div className="absolute right-0 top-16 text-[260px] font-bold select-none leading-none pointer-events-none" style={{ fontFamily: FD, color: "rgba(184,146,58,0.012)", transform: "translateX(20%)", zIndex: 0 }}>
            2
          </div>

          <div className="relative" style={{ zIndex: 10 }}>
            <Reveal delay={0.2}>
              <h4 style={{ fontFamily: FU, color: CRIMSON }} className="tracking-[0.2em] text-[11px] font-bold mb-2 uppercase">BY THE NUMBERS</h4>
              <h2 style={{ fontFamily: FD, color: IVORY }} className="text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.8] mb-6 tracking-wide">STATS</h2>
              <div className="flex gap-4">
                <div className="w-px h-10" style={{ backgroundColor: CRIMSON, opacity: 0.5 }} />
                <p style={{ fontFamily: FM, color: DIM }} className="text-[11px] tracking-widest uppercase leading-[1.8]">
                  Capturing milestones.
                  <br />
                  Creating legacies.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="mt-16 xl:mt-auto relative w-full h-56 flex items-end opacity-90 z-10">
            <svg className="absolute bottom-12 right-16 w-24 h-24 drop-shadow-xl" viewBox="0 0 64 64" style={{ zIndex: 5 }}>
              <circle cx="32" cy="32" r="30" fill={SURFACE} stroke={GOLD} strokeWidth="1.5" />
              <circle cx="32" cy="32" r="5" fill={CRIMSON} />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle key={deg} cx={32 + 18 * Math.cos((deg * Math.PI) / 180)} cy={32 + 18 * Math.sin((deg * Math.PI) / 180)} r="7" fill={VOID} stroke={`${GOLD}33`} strokeWidth="0.8" />
              ))}
            </svg>

            <svg className="absolute bottom-4 right-0 w-32 h-32 drop-shadow-2xl" viewBox="0 0 64 64" style={{ zIndex: 5 }}>
              <circle cx="32" cy="32" r="30" fill={LIFT} stroke={IVORY} strokeWidth="1.5" />
              <circle cx="32" cy="32" r="5" fill={GOLD} />
              {[36, 108, 180, 252, 324].map((deg) => (
                <circle key={deg} cx={32 + 18 * Math.cos((deg * Math.PI) / 180)} cy={32 + 18 * Math.sin((deg * Math.PI) / 180)} r="7" fill={VOID} stroke={`${IVORY}33`} strokeWidth="0.8" />
              ))}
            </svg>

            <div className="absolute bottom-0 left-0 w-56 h-40 rounded-[4px] shadow-2xl transform -rotate-3 flex flex-col overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, zIndex: 15 }}>
              <div className="w-full h-8 flex-shrink-0" style={{ background: "repeating-linear-gradient(45deg, #ede8da, #ede8da 12px, #0B0A08 12px, #0B0A08 24px)" }} />
              <div className="w-full h-8 flex-shrink-0" style={{ background: "repeating-linear-gradient(-45deg, #ede8da, #ede8da 12px, #0B0A08 12px, #0B0A08 24px)", marginTop: "2px" }} />
              <div className="flex-1 p-3 text-[#ede8da] flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[7px] mb-1 opacity-60 uppercase tracking-widest text-[#786C5A]">Production</p>
                  <div className="flex border border-rgba(184,146,58,0.2)">
                    <div className="flex-1 border-r border-rgba(184,146,58,0.2) p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70 text-[#786C5A]">SCENE</p>
                      <p className="font-bebas text-lg text-[#ede8da]">02</p>
                    </div>
                    <div className="flex-1 border-r border-rgba(184,146,58,0.2) p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70 text-[#786C5A]">TAKE</p>
                      <p className="font-bebas text-lg text-[#ede8da]">07</p>
                    </div>
                    <div className="flex-1 p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70 text-[#786C5A]">ROLL</p>
                      <p className="font-bebas text-lg text-[#ede8da]">A001</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end pb-1">
                  <p className="font-mono text-[7px] opacity-60 uppercase tracking-widest text-[#786C5A]">Director</p>
                  <p className="text-xl text-[#B8923A]" style={{ fontFamily: "'Brush Script MT', cursive", transform: "rotate(-4deg)" }}>
                    {portfolioData?.personal?.name || "Ashwin R."}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
          {statItems.map((item, i) => {
            let Icon = Star;
            if (item.iconType === "award") Icon = Award;
            if (item.iconType === "film") Icon = Film;
            if (item.iconType === "users") Icon = Users;

            return (
              <Reveal key={item.label} delay={0.4 + i * 0.1}>
                <TicketCard h={hoveredCard === i} setH={(val) => setHoveredCard(val ? i : null)} className="flex flex-col items-center text-center p-8 lg:p-6 xl:p-8 h-full" notchColor={RICH} level={78}>
                  <motion.div
                    animate={hoveredCard === i ? { scale: 1.2, rotate: 12 } : { scale: 1, rotate: 0 }}
                    transition={SPRING_DEFAULT}
                    className="relative mb-6 mt-4 w-14 h-14 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: hoveredCard === i ? `${CRIMSON}18` : `${GOLD}07`, transition: "background-color 0.3s" }}
                  >
                    <Icon size={24} color={hoveredCard === i ? CRIMSON : DIM} strokeWidth={1.5} />
                  </motion.div>
                  <div className="flex items-center gap-2 mb-6 opacity-60">
                    <span className="text-[10px] tracking-widest" style={{ fontFamily: FM, color: DIM }}>-</span>
                    <Star size={10} color={CRIMSON} fill={CRIMSON} />
                    <span className="text-[10px] tracking-widest" style={{ fontFamily: FM, color: DIM }}>-</span>
                  </div>
                  <div style={{ fontFamily: FD, fontSize: "64px", lineHeight: 1, color: IVORY, marginBottom: "6px" }}>
                    <AnimCounter value={item.value} />
                  </div>
                  <p style={{ fontFamily: FU, fontSize: "11px", letterSpacing: "0.2em", color: GOLD, fontWeight: 700, marginBottom: "16px" }} className="uppercase">
                    {item.label}
                  </p>
                  <p className="text-xs" style={{ fontFamily: FB, lineHeight: 1.6, color: DIM, marginBottom: "16px" }}>
                    {item.desc}
                  </p>
                </TicketCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollTo({
          left: container.scrollLeft + e.deltaY * 2.2,
          behavior: "auto",
        });
      }
    };

    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      container.style.cursor = "grabbing";
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const onMouseUp = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="projects" className="relative overflow-hidden py-24" style={{ backgroundColor: VOID }}>
      <Spotlight cx="50%" cy="0%" color={`${CRIMSON}06`} r="60%" />
      <Scanlines />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="mb-14 text-center relative">
          <div className="absolute top-0 right-0 opacity-80">
            <div className="flex items-center gap-1.5 border border-[#C8102E] px-2 py-0.5 rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
              <span style={{ fontFamily: FM, fontSize: "8px", color: CRIMSON, letterSpacing: "0.15em" }}>REC</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}55)`, maxWidth: "72px" }} />
            <span style={{ fontFamily: FM, fontSize: "7px", letterSpacing: "0.42em", color: GOLD }}>FILMOGRAPHY</span>
            <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${GOLD}55)` }} />
          </div>
          <h2 style={{ fontFamily: FD, fontSize: "clamp(44px,5.5vw,76px)", lineHeight: 0.92, letterSpacing: "0.03em", color: IVORY }}>PROJECTS</h2>
          <p style={{ fontFamily: FU, fontSize: "9px", letterSpacing: "0.32em", color: DIM }}>A SELECTION OF WORKS</p>
          <div className="mt-4 h-px w-14 mx-auto" style={{ backgroundColor: `${GOLD}44` }} />
        </div>

        <div className="relative border-y border-[#ffffff0a] py-4 bg-[#0F0D0A]">
          <FilmstripPerforations />
          <div className="relative my-4 px-4">
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 pt-1 cursor-grab"
              style={{ scrollSnapType: "x proximity", scrollbarWidth: "none" }}
            >
              {projects.map((p, idx) => (
                <ProjectCard key={p.title || idx} p={p} index={idx} />
              ))}
            </div>

            {[
              { d: "left", cls: "left-2 -translate-x-5" },
              { d: "right", cls: "right-2 translate-x-5" },
            ].map(({ d }) => (
              <button
                key={d}
                onClick={() => scroll(d)}
                className="absolute w-9 h-9 rounded-full flex items-center justify-center z-30 transition-all duration-300 hover:scale-110 shadow-lg top-1/2 -translate-y-1/2"
                style={{
                  backgroundColor: "rgba(11,10,8,0.9)",
                  border: `1px solid ${BORDER}`,
                  left: d === "left" ? "-18px" : "auto",
                  right: d === "right" ? "-18px" : "auto",
                }}
              >
                {d === "left" ? <ChevronLeft size={14} color={IVORY} /> : <ChevronRight size={14} color={IVORY} />}
              </button>
            ))}
          </div>
          <FilmstripPerforations />
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const { portfolioData } = usePortfolio();
  const experience = portfolioData?.experience || [];

  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: RICH, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
    >
      <Spotlight cx="20%" cy="50%" color={`${CRIMSON}0A`} r="60%" />
      <Scanlines />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-8 min-h-[600px] items-center lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[45%] flex flex-col items-center lg:items-start pt-10 sticky top-24"
        >
          <div className="relative w-full max-w-[400px] aspect-square mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.1)_0%,transparent_60%)] blur-2xl" />
            <ExperienceGraphic inView={inView} />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Crosshair size={14} color={CRIMSON} />
            <span style={{ fontFamily: FM, fontSize: "9px", letterSpacing: "0.2em", color: DIM }}>PRODUCTION LOG //</span>
          </div>
          <h2 style={{ fontFamily: FD, fontSize: "clamp(56px, 6vw, 84px)", color: IVORY, lineHeight: 0.9, letterSpacing: "0.02em" }}>EXPERIENCE</h2>
          <p style={{ fontFamily: FU, fontSize: "12px", letterSpacing: "0.3em", color: CRIMSON, marginTop: "8px" }}>A JOURNEY THROUGH PROJECTS</p>
        </motion.div>

        <div className="w-full lg:w-[55%] relative pt-8 pb-12 lg:pl-10">
          <div className="absolute left-[88px] md:left-[108px] top-6 bottom-6 w-[2px] pointer-events-none" style={{ backgroundColor: "rgba(184, 146, 58, 0.08)" }} />
          <motion.div className="absolute left-[88px] md:left-[108px] top-6 bottom-6 w-[2px] origin-top pointer-events-none" style={{ backgroundColor: CRIMSON, scaleY }} />
          <div className="flex flex-col gap-8">
            {experience.map((item, i) => (
              <TimelineItem key={`exp-item-${i}`} item={item} index={i} total={experience.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceGraphic({ inView }) {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const name = personal.name || "Ashwin R.";

  return (
    <svg viewBox="0 0 420 300" className="w-full drop-shadow-2xl" style={{ maxHeight: "260px" }}>
      <defs>
        <radialGradient id="exp-smoke">
          <stop offset="0%" stopColor="#C8102E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0B0A08" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chair-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A241D" />
          <stop offset="100%" stopColor="#120F0C" />
        </linearGradient>
        <linearGradient id="canvas-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1815" />
          <stop offset="100%" stopColor="#0B0A08" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="170" rx="190" ry="130" fill="url(#exp-smoke)" />

      <g transform="translate(0, 15)">
        <line x1="120" y1="30" x2="120" y2="150" stroke="url(#chair-wood)" strokeWidth="12" strokeLinecap="round" />
        <line x1="300" y1="30" x2="300" y2="150" stroke="url(#chair-wood)" strokeWidth="12" strokeLinecap="round" />
        <rect x="95" y="115" width="50" height="10" rx="4" fill="#B8923A" />
        <rect x="275" y="115" width="50" height="10" rx="4" fill="#B8923A" />
        <line x1="120" y1="150" x2="300" y2="260" stroke="#120F0C" strokeWidth="14" strokeLinecap="round" />
        <line x1="300" y1="150" x2="120" y2="260" stroke="url(#chair-wood)" strokeWidth="14" strokeLinecap="round" />
        <circle cx="210" cy="205" r="5" fill="#B8923A" />
        <circle cx="210" cy="205" r="2" fill="#0B0A08" />
        <line x1="100" y1="260" x2="320" y2="260" stroke="#120F0C" strokeWidth="8" strokeLinecap="round" />
        <path d="M 120 150 Q 210 175 300 150 L 300 158 Q 210 183 120 158 Z" fill="url(#canvas-dark)" stroke="#1C1916" strokeWidth="1" />
        <motion.g
          initial={{ opacity: 0, y: -25 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -25 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          <rect x="120" y="40" width="180" height="60" fill="url(#canvas-dark)" />
          <rect x="120" y="40" width="180" height="60" fill="none" stroke="#C8102E" strokeWidth="2" opacity="0.85" />
          <line x1="126" y1="45" x2="126" y2="95" stroke="#333" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="294" y1="45" x2="294" y2="95" stroke="#333" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="210" y="76" fill="#EDE8DA" fontSize="26" fontFamily="'Bebas Neue', sans-serif" textAnchor="middle" letterSpacing="5">DIRECTOR</text>
        </motion.g>
        <motion.text
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          x="210"
          y="130"
          fill="#B8923A"
          fontSize="38"
          fontFamily="'Brush Script MT', cursive"
          textAnchor="middle"
          transform="rotate(-5, 210, 130)"
          style={{ filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.9))" }}
        >
          {name}
        </motion.text>
      </g>
    </svg>
  );
}

function Testimonials() {
  const { portfolioData } = usePortfolio();
  const rawTestimonials = portfolioData?.testimonials || [];

  const testimonials = rawTestimonials.map((t) => ({
    quote: t.text || t.content || "",
    name: t.name || t.author || "Crew Member",
    role: t.role || "Collaborator",
    avatar: t.avatar || "",
    initials: (t.name || t.author || "CM").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
  }));

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const authorName = portfolioData?.personal?.name || "Ashwin R.";

  return (
    <section id="testimonials" ref={ref} className="relative overflow-hidden py-24" style={{ backgroundColor: DEEP }}>
      <Spotlight cx="50%" cy="50%" color="rgba(184,146,58,0.03)" r="75%" />
      <Scanlines />
      <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Camera size={400} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col xl:flex-row gap-12 xl:gap-16 items-center xl:items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={TRANSITION_SLOW}
          className="flex-shrink-0 flex flex-col items-center xl:items-start text-center xl:text-left mt-8"
          style={{ width: "clamp(240px, 25%, 320px)" }}
        >
          <div className="flex items-end">
            <span style={{ fontFamily: FD, fontSize: "60px", color: CRIMSON, lineHeight: 0.8 }}>99</span>
            <span style={{ fontFamily: FD, fontSize: "24px", color: CRIMSON, lineHeight: 0.8, marginLeft: "2px" }}>,</span>
          </div>
          <h2 style={{ fontFamily: FD, fontSize: "clamp(46px, 5vw, 56px)", lineHeight: 1, color: IVORY, letterSpacing: "0.02em", marginTop: "12px" }}>TESTIMONIALS</h2>
          <p style={{ fontFamily: FU, fontSize: "11px", letterSpacing: "0.28em", color: CRIMSON, marginTop: "8px", fontWeight: 600 }}>WORDS FROM THE CREW</p>

          <div className="flex items-center justify-center xl:justify-start gap-[3px] my-10 opacity-30" style={{ backgroundColor: "#000", padding: "4px" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: "12px", height: "10px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "1px" }} />
            ))}
          </div>

          <p style={{ fontFamily: FU, fontSize: "13px", letterSpacing: "0.2em", color: DIM, marginBottom: "20px" }}>
            EVERY COLLABORATION
            <br />
            TELLS A STORY
          </p>

          <div style={{ fontFamily: "'Brush Script MT', 'Caveat', 'Dancing Script', cursive", fontSize: "40px", color: IVORY, opacity: 0.8, transform: "rotate(-2deg)" }}>
            {authorName}
          </div>
        </motion.div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-[1.25rem] p-6 lg:p-8 flex items-center gap-5 cursor-default group"
                style={{
                  backgroundColor: "#110f0d",
                  backgroundImage: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                whileHover={{ y: -5, borderColor: "rgba(200,16,46,0.3)" }}
              >
                <div
                  className="absolute inset-0 rounded-[1.25rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, rgba(200,16,46,0.05) 0%, transparent 70%)` }}
                />
                <div className="flex-shrink-0 self-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1f1d1b 0%, #11100f 100%)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent)` }} />
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontFamily: FD, fontSize: "26px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{t.initials}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "40px", color: CRIMSON, lineHeight: 0.4, marginBottom: "16px", transform: "translateY(10px)" }}>“</div>
                  <p className="line-clamp-4 text-[12px]" style={{ fontFamily: FB, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                    {t.quote}
                  </p>
                  <div>
                    <div style={{ fontFamily: FB, fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", color: IVORY, textTransform: "uppercase", marginBottom: "4px" }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: FU, fontSize: "10px", letterSpacing: "0.15em", color: CRIMSON }}>{t.role.toUpperCase()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {testimonials.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="flex justify-center items-center gap-3 mt-12"
            >
              {testimonials.map((_, dotIdx) => (
                <div key={dotIdx} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotIdx === 0 ? CRIMSON : "rgba(255,255,255,0.3)" }} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Socials() {
  const { portfolioData } = usePortfolio();
  const socialsData = portfolioData?.socials || {};

  const socialItems = [];
  if (socialsData.github) socialItems.push({ name: "GITHUB", url: socialsData.github, icon: Github });
  if (socialsData.linkedin) socialItems.push({ name: "LINKEDIN", url: socialsData.linkedin, icon: Linkedin });
  if (socialsData.twitter) socialItems.push({ name: "TWITTER", url: socialsData.twitter, icon: Twitter });
  if (socialsData.email) socialItems.push({ name: "EMAIL", url: `mailto:${socialsData.email}`, icon: Mail });
  if (socialsData.instagram) socialItems.push({ name: "INSTAGRAM", url: socialsData.instagram, icon: Instagram });
  if (socialsData.youtube) socialItems.push({ name: "YOUTUBE", url: socialsData.youtube, icon: Youtube });

  const socials = socialItems.length ? socialItems : [
    { name: "INSTAGRAM", url: "#", icon: Instagram },
    { name: "YOUTUBE", url: "#", icon: Youtube },
    { name: "LINKEDIN", url: "#", icon: Linkedin },
    { name: "GITHUB", url: "#", icon: Github },
  ];

  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="socials" ref={ref} className="relative overflow-hidden pt-20 pb-28" style={{ backgroundColor: DEEP }}>
      <Spotlight cx="50%" cy="0%" color="rgba(184,146,58,0.04)" r="65%" />
      <Scanlines />
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <Reveal delay={0}>
          <div className="flex flex-col items-center mb-12">
            <Clapperboard size={32} color={IVORY} strokeWidth={1.5} className="mb-4" />
            <div className="relative px-4 py-1.5 mb-2">
              <CC color={CRIMSON} size={6} />
              <span style={{ fontFamily: FM, fontSize: "9px", letterSpacing: "0.22em", color: CRIMSON, fontWeight: 700 }}>LET'S CONNECT</span>
            </div>
            <h2 style={{ fontFamily: FD, fontSize: "clamp(56px, 8vw, 84px)", lineHeight: 0.9, letterSpacing: "0.03em", color: IVORY }}>SOCIALS</h2>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-4 w-full">
          {socials.map((s, i) => (
            <Reveal key={s.name} delay={0.15 + i * 0.08} className="w-full max-w-[130px]">
              <motion.a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="relative flex flex-col items-center justify-between w-full aspect-square p-3 group"
                style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
                whileHover={{ y: -6, borderColor: BORDER_HV, boxShadow: `0 12px 24px rgba(0,0,0,0.5)` }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                  <svg className="absolute inset-0 w-full h-full text-[#040302] opacity-90 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 100">
                    <filter id={`roughpaper-${i}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <circle cx="50" cy="50" r="40" fill="currentColor" filter={`url(#roughpaper-${i})`} />
                  </svg>
                  <s.icon size={22} color={IVORY} className="relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-center gap-1.5 mb-2">
                  <span style={{ fontFamily: FD, fontSize: "12px", letterSpacing: "0.08em", color: IVORY }}>{s.name}</span>
                  <div className="w-5 h-[2px] rounded-full transition-colors duration-300 group-hover:bg-crimson" style={{ backgroundColor: `${CRIMSON}88` }} />
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Barcode() {
  const bars = Array.from({ length: 42 }, (_, i) => ({
    w: [2, 1, 3, 1, 2, 4, 1, 3][i % 8],
    h: 100,
  }));
  return (
    <div className="flex items-end gap-[2px]" style={{ height: "46px" }}>
      {bars.map((b, i) => (
        <div key={i} style={{ width: `${b.w}px`, height: `${b.h}%`, backgroundColor: IVORY, opacity: 0.7 }} />
      ))}
    </div>
  );
}

function HorizontalFilmStrip() {
  return (
    <div
      className="w-full h-8 flex items-center gap-2 overflow-hidden px-4"
      style={{ backgroundColor: "#050403", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-5 h-4 rounded-[2px]" style={{ border: "1px solid #222", backgroundColor: "#111" }} />
      ))}
    </div>
  );
}

function Footer() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const name = personal.name || "Ashwin R.";
  const title = personal.title || "Film Director";
  const bio = personal.bio || "Crafting cinematic experiences that stay long after the credits roll.";

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer ref={ref} className="relative overflow-hidden flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      <HorizontalFilmStrip />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-16 flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 xl:gap-8 min-h-[300px]">
        <div
          className="absolute left-0 top-0 bottom-0 w-[400px] pointer-events-none opacity-40 mix-blend-screen hidden lg:block"
          style={{ background: "radial-gradient(circle at 10% 50%, rgba(200, 200, 200, 0.1) 0%, rgba(184, 146, 58, 0.02) 40%, transparent 70%)" }}
        >
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[rgba(255,255,255,0.05)] shadow-[0_0_100px_rgba(255,255,255,0.1)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left z-10 xl:ml-32"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
              <span style={{ fontFamily: FD, fontSize: "14px", color: IVORY }}>
                {name[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <span style={{ fontFamily: FU, fontSize: "11px", letterSpacing: "0.22em", color: DIM }}>
              {title.toUpperCase()}
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CRIMSON }} />
          </div>
          <h2 style={{ fontFamily: FD, fontSize: "clamp(42px, 5vw, 68px)", lineHeight: 0.9, letterSpacing: "0.02em", color: IVORY }}>
            EVERY FRAME
            <br />
            <span style={{ color: CRIMSON }}>TELLS A STORY.</span>
          </h2>
          <p style={{ fontFamily: FU, fontSize: "10px", letterSpacing: "0.25em", color: DIM, marginTop: "16px" }}>
            LET'S CREATE SOMETHING <span style={{ color: CRIMSON }}>ICONIC</span>
          </p>
        </motion.div>

        <div className="hidden xl:block w-px h-32 self-center opacity-20" style={{ backgroundColor: IVORY }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left z-10"
        >
          <div style={{ fontFamily: "'Brush Script MT', 'Caveat', 'Dancing Script', cursive", fontSize: "52px", color: IVORY, opacity: 0.85, transform: "rotate(-3deg)", marginBottom: "8px" }}>
            {name}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-px" style={{ backgroundColor: CRIMSON }} />
            <span style={{ fontFamily: FM, fontSize: "8px", letterSpacing: "0.15em", color: CRIMSON }}>FILM DIRECTOR</span>
          </div>
          <p style={{ fontFamily: FB, fontSize: "13px", lineHeight: 1.8, color: DIM, maxWidth: "300px" }}>{bio}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-shrink-0 flex flex-col items-center xl:items-end z-10 self-center xl:self-end"
        >
          <Barcode />
          <div className="flex items-center gap-4 mt-5">
            <span style={{ fontFamily: FM, fontSize: "9px", letterSpacing: "0.15em", color: DIM }}>SCENE {personal.scene || "24"}</span>
            <span style={{ fontFamily: FM, fontSize: "9px", letterSpacing: "0.15em", color: DIM }}>TAKE {personal.take || "7"}</span>
            <Rec bright />
          </div>
        </motion.div>
      </div>

      <HorizontalFilmStrip />

      <div className="relative z-10" style={{ backgroundColor: "#060504" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <span style={{ fontFamily: FM, fontSize: "12px", color: DIM, letterSpacing: "0.15em", textAlign: "center" }}>
            © {new Date().getFullYear()} <span style={{ color: CRIMSON }}>{name.toUpperCase()}</span> ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Film Director Clapper Board Main Template Component ──────────────────────
export default function Film_Director_Clapperboard() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: FB,
        backgroundColor: DEEP,
        color: IVORY,
      }}
    >
      {createPortal(<PremiumCursor />, document.body)}
      <MouseSpotlight />
      <ScrollProgress />
      <FilmGrain />
      <Vignette />

      <div
        className="w-full relative overflow-hidden flex items-end"
        style={{
          height: "clamp(64px, 8vw, 130px)",
          backgroundColor: VOID,
          zIndex: 60
        }}
      >
        <img
          src={topImg}
          alt="Clapperboard"
          className="w-full h-full block absolute inset-0"
          style={{
            objectFit: "inherit",
            objectPosition: "center",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(90deg, ${VOID}ee 0%, transparent 15%, transparent 85%, ${VOID}ee 100%),
              linear-gradient(180deg, transparent 60%, ${VOID} 100%)
            `,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            height: "2px",
            backgroundColor: CRIMSON,
            opacity: 0.8,
            boxShadow: `0 -2px 10px ${CRIMSON}44`
          }}
        />
      </div>

      <Navbar />
      <Hero />
      <Skills />
      <Stats />
      <Projects />
      <Experience />
      <Testimonials />
      <Socials />
      <Footer />
    </div>
  );
}
