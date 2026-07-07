import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useSpring, AnimatePresence, } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import dummyData from "../../../../data/dummy_data.json";
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
  Dribbble,
  Crosshair,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSkillIcon(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("dir")) return Camera;
  if (lower.includes("story") || lower.includes("writ") || lower.includes("script")) return BookOpen;
  if (lower.includes("cine") || lower.includes("camera") || lower.includes("lens") || lower.includes("aperture")) return Aperture;
  if (lower.includes("edit") || lower.includes("cut") || lower.includes("scissors")) return Scissors;
  if (lower.includes("film") || lower.includes("video")) return Film;
  if (lower.includes("actor") || lower.includes("cast") || lower.includes("talent") || lower.includes("user")) return Users;
  if (lower.includes("visual") || lower.includes("comp") || lower.includes("art") || lower.includes("eye")) return Eye;
  if (lower.includes("sound") || lower.includes("audio") || lower.includes("mix") || lower.includes("headphone")) return Headphones;
  if (lower.includes("color") || lower.includes("grade") || lower.includes("paint") || lower.includes("palette")) return Palette;
  if (lower.includes("design") || lower.includes("scene") || lower.includes("art direction")) return LayoutPanelLeft;
  if (lower.includes("produc") || lower.includes("manage") || lower.includes("exec")) return UserCheck;
  if (lower.includes("board") || lower.includes("draw") || lower.includes("sketch")) return Grid3x3;
  if (lower.includes("documentary") || lower.includes("shoot")) return Video;
  if (lower.includes("music") || lower.includes("score") || lower.includes("song")) return Music;
  if (lower.includes("post") || lower.includes("vfx") || lower.includes("cgi") || lower.includes("monitor")) return Monitor;
  return CodeIcon;
}

const CodeIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const navItems = [
  "PROFILE",
  "SKILLS",
  "STATS",
  "PROJECTS",
  "EXPERIENCE",
  "TESTIMONIALS",
  "SOCIALS",
];

// ─── Premium Cursor ───────────────────────────────────────────────────────────
function PremiumCursor() {
  const mainRef = useRef(null);
  const frameRef = useRef(null);
  const recRef = useRef(null);

  const mouse = useRef({ x: -200, y: -200 });
  const smooth = useRef({ x: -200, y: -200 });

  const isHover = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const el = e.target;
      // Check if hovering over clickable elements
      isHover.current = !!(el && el.closest("a, button, [role='button']"));
    };

    const tick = () => {
      // 1. Smooth physical follow for the heavy viewfinder frame
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.15;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.15;

      if (frameRef.current) {
        // Frame focuses (scales down) and snaps slightly on hover
        frameRef.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) scale(${isHover.current ? 0.75 : 1
          })`;

        // Color shifts from Gold to Crimson on hover
        frameRef.current.style.color = isHover.current ? CRIMSON : GOLD;
        frameRef.current.style.backgroundColor = isHover.current
          ? `rgba(200,16,46,0.05)`
          : `transparent`;
      }

      if (recRef.current) {
        recRef.current.style.opacity = isHover.current ? "1" : "0";
      }

      // 2. Instant precise follow for the center reticle
      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${isHover.current ? 0.5 : 1
          })`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99999 }}>

      {/* ── Outer Viewfinder Frame (Smooth Tracking) ── */}
      <div
        ref={frameRef}
        className="absolute top-0 left-0 -ml-[45px] -mt-[45px] rounded-full transition-colors duration-300 flex items-center justify-center"
        style={{
          width: 90,
          height: 90,
          willChange: "transform",
          border: `1px solid currentColor`,
          color: GOLD, // Uses current color for borders
        }}
      >
        {/* Cinematic Aspect Ratio Crop Marks (16:9 approx inside the lens) */}
        <div className="absolute top-[20px] left-[12px] w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-current opacity-80" />
        <div className="absolute top-[20px] right-[12px] w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-current opacity-80" />
        <div className="absolute bottom-[20px] left-[12px] w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-current opacity-80" />
        <div className="absolute bottom-[20px] right-[12px] w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-current opacity-80" />

        {/* Outer Lens Tick Marks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2.5 bg-current opacity-70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2.5 bg-current opacity-70" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-[1px] bg-current opacity-70" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-[1px] bg-current opacity-70" />

        {/* Hover REC Indicator inside the lens */}
        <div
          ref={recRef}
          className="absolute top-4 right-5 flex items-center gap-1 transition-opacity duration-300"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
          <span style={{ fontFamily: FM, fontSize: "6px", color: CRIMSON }}>REC</span>
        </div>
      </div>

      {/* ── Center Reticle Crosshair (Instant Tracking) ── */}
      <div
        ref={mainRef}
        className="absolute top-0 left-0 -ml-[12px] -mt-[12px] flex items-center justify-center transition-transform duration-200"
        style={{ width: 24, height: 24, willChange: "transform" }}
      >
        {/* Hairlines */}
        <div className="w-full h-[1px] bg-white opacity-40 absolute mix-blend-difference" />
        <div className="w-[1px] h-full bg-white opacity-40 absolute mix-blend-difference" />
      </div>

    </div>
  );
}

// ─── Global Overlays ──────────────────────────────────────────────────────────
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
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Spotlight({
  cx = "50%",
  cy = "-10%",
  color = `rgba(184,146,58,0.06)`,
  r = "70%",
}) {
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
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)",
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
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
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

function GoldLine({ className = "" }) {
  return (
    <div
      className={className}
      style={{ height: "1px", backgroundColor: GOLD_GLOW }}
    />
  );
}

function FilmStrip() {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around py-3"
      style={{ backgroundColor: `${VOID}dd` }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="mx-1 rounded-sm"
          style={{
            height: "9px",
            backgroundColor: "#101010",
            border: "1px solid #181818",
          }}
        />
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-55px",
  });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Film Strip Scroll Progress ───────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
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

// ─── Mouse Spotlight ──────────────────────────────────────────────────────────
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

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { portfolioData } = usePortfolio();
  const personal = { ...dummyData.personal, ...portfolioData?.personal };
  if (!personal.avatar) {
    personal.avatar = dummyData.personal.avatar;
  }
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
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              backgroundColor: SURFACE,
              border: `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                fontFamily: FD,
                fontSize: "15px",
                color: IVORY,
              }}
            >
              {(personal.name || "A")[0].toUpperCase()}
            </span>
          </div>
          <span
            style={{
              fontFamily: FU,
              fontSize: "10px",
              color: DIM,
              letterSpacing: "0.22em",
            }}
          >
            {(personal.title || "FILM DIRECTOR").toUpperCase()}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full ml-0.5"
            style={{ backgroundColor: CRIMSON }}
          />
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
                <motion.div
                  layoutId="nav-line"
                  className="absolute bottom-0 left-3 right-3"
                  style={{
                    height: "1px",
                    backgroundColor: CRIMSON,
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: DIM }}
        >
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
            style={{
              backgroundColor: VOID,
              borderTop: `1px solid ${BORDER}`,
            }}
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

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { portfolioData } = usePortfolio();
  const personal = { ...dummyData.personal, ...portfolioData?.personal };
  if (!personal.avatar) {
    personal.avatar = dummyData.personal.avatar;
  }

  const nameParts = (personal.name || "").split(" ");
  const firstName = nameParts[0] || "Ashwin";
  const lastName = nameParts.slice(1).join(" ") || "R.";

  const designation = personal.title || "Film Director";
  const bio = personal.bio || "Crafting cinematic experiences that stay long after the credits roll. Stories. Emotion. Vision.";

  const roll = personal.roll || "A001";
  const scene = personal.scene || "24";
  const take = personal.take || "7";
  const cta = personal.cta || "Watch Showreel";

  return (
    <section
      id="profile"
      className="relative overflow-hidden"
      style={{ backgroundColor: DEEP }}
    >
      <Spotlight
        cx="75%"
        cy="15%"
        color="rgba(184,146,58,0.07)"
        r="60%"
      />
      <Spotlight
        cx="15%"
        cy="85%"
        color={`${CRIMSON}07`}
        r="40%"
      />
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
                  {i > 0 && (
                    <div
                      className="w-px h-5"
                      style={{ backgroundColor: BORDER }}
                    />
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: FM,
                        fontSize: "9px",
                        color: `${GOLD}77`,
                        letterSpacing: "0.18em",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontFamily: FM,
                        fontSize: "13px",
                        color: `${IVORY}99`,
                        fontWeight: 500,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="w-px h-5"
                style={{ backgroundColor: BORDER }}
              />
              <Rec />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p
              style={{
                fontFamily: FU,
                fontSize: "13px",
                letterSpacing: "0.3em",
                color: GOLD,
                marginBottom: "5px",
              }}
            >
              HI, I'M
            </p>
            <h1
              style={{
                fontFamily: FD,
                fontSize: "clamp(56px,9vw,100px)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                color: IVORY,
                marginBottom: "7px",
              }}
            >
              {firstName}{" "}
              <span style={{ color: CRIMSON }}>
                {lastName}
              </span>
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-px w-7"
                style={{ backgroundColor: GOLD_GLOW }}
              />
              <p
                style={{
                  fontFamily: FU,
                  fontSize: "14px",
                  letterSpacing: "0.3em",
                  color: DIM,
                  fontWeight: 500,
                }}
              >
                {designation.toUpperCase()}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div
              className="relative p-5 mb-8"
              style={{
                border: `1px solid ${BORDER}`,
                backgroundColor: `${SURFACE}66`,
              }}
            >
              <CC color={GOLD_GLOW} size={10} />
              <p
                style={{
                  fontFamily: FB,
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: DIM,
                  fontStyle: "italic",
                }}
              >
                {bio}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ backgroundColor: "#a50d24" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-7 py-3.5"
                style={{
                  backgroundColor: CRIMSON,
                  color: IVORY,
                  fontFamily: FU,
                  fontSize: "12px",
                  letterSpacing: "0.26em",
                  fontWeight: 700,
                  border: "none",
                }}
              >
                <Play size={11} fill={IVORY} /> {cta.toUpperCase()}
              </motion.button>
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "10px",
                  color: `${GOLD}55`,
                  letterSpacing: "0.15em",
                }}
              >
                VISION · FRAME · STORY
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right — person image or placeholder */}
        <Reveal delay={0.15}>
          <div
            className="relative aspect-[4/5] max-w-sm mx-auto overflow-hidden shadow-2xl"
            style={{
              border: `1px solid ${BORDER}`,
              backgroundColor: SURFACE,
            }}
          >
            <CC color={`${GOLD}2a`} size={15} />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 55% 22%, rgba(184,146,58,0.09) 0%, transparent 55%)`,
              }}
            />
            {["left-0", "right-0"].map((s, i) => (
              <div
                key={i}
                className={`absolute ${s} top-0 bottom-0 w-7 flex flex-col justify-around py-2`}
                style={{ backgroundColor: VOID }}
              >
                {Array.from({ length: 16 }).map((_, j) => (
                  <div
                    key={j}
                    className="mx-1 rounded-sm"
                    style={{
                      height: "9px",
                      backgroundColor: "#111",
                      border: "1px solid #191918",
                    }}
                  />
                ))}
              </div>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10">
              <div className="relative">
                <div
                  className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle,${SURFACE} 0%,${VOID} 80%)`,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {personal.avatar ? (
                    <img
                      src={personal.avatar}
                      alt={personal.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center"
                      style={{ border: `1px solid ${BORDER}` }}
                    >
                      <UserRound
                        size={52}
                        color={`${IVORY}18`}
                        strokeWidth={0.8}
                      />
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    backgroundColor: CRIMSON,
                    border: `2px solid ${SURFACE}`,
                  }}
                >
                  <Camera size={14} color={IVORY} />
                </div>
              </div>
              <div className="flex items-center gap-5 opacity-20">
                {[Film, Clapperboard, Aperture].map((Icon, i) => (
                  <Icon key={i} size={18} color={IVORY} strokeWidth={1.5} />
                ))}
              </div>
              <div
                className="px-4 py-1.5"
                style={{
                  border: `1px solid ${CRIMSON}2a`,
                  backgroundColor: `${CRIMSON}08`,
                }}
              >
                <span
                  style={{
                    fontFamily: FD,
                    fontSize: "13px",
                    letterSpacing: "0.42em",
                    color: `${IVORY}44`,
                  }}
                >
                  DIRECTOR
                </span>
              </div>

            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)",
              }}
            />
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1"
              style={{ backgroundColor: VOID }}
            >
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "9px",
                  color: `${IVORY}2a`,
                  letterSpacing: "0.18em",
                }}
              >
                SCENE {scene} · TAKE {take}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        className="relative z-10"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center justify-between">
          <div className="flex gap-6">
            {["FOCUS: MANUAL", "ISO: 800", "f/2.8", "24fps"].map((l) => (
              <span
                key={l}
                style={{
                  fontFamily: FM,
                  fontSize: "9px",
                  color: `${IVORY}22`,
                  letterSpacing: "0.12em",
                }}
              >
                {l}
              </span>
            ))}
          </div>
          <Rec />
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SegBar({ level, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-40px",
  });
  const filled = Math.round((level / 100) * 10);
  return (
    <div ref={ref} className="flex gap-[3px] mt-1.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.26,
            delay: delay + i * 0.04,
            ease: "easeOut",
          }}
          style={{
            width: "15px",
            height: "3px",
            borderRadius: "1px",
            transformOrigin: "left center",
            backgroundColor: i < filled ? CRIMSON : `${GOLD}18`,
          }}
        />
      ))}
    </div>
  );
}

function SkillCard({ skill, index }) {
  const [h, setH] = useState(false);
  const title = skill.name || skill.title || "";
  const level = skill.level || 70;
  const Icon = getSkillIcon(title);
  const delay = (index % 5) * 0.07 + Math.floor(index / 5) * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.52,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setH(true)}
      onHoverEnd={() => setH(false)}
      animate={h ? { y: -5 } : { y: 0 }}
      className="relative p-4 overflow-hidden cursor-default"
      style={{
        backgroundColor: h ? LIFT : SURFACE,
        border: `1px solid ${h ? BORDER_HV : BORDER}`,
        boxShadow: h
          ? `0 16px 38px rgba(0,0,0,0.44), 0 0 0 1px ${GOLD_GLOW}`
          : "none",
        transition:
          "background-color 0.3s, border-color 0.3s, box-shadow 0.3s duration 0.25s",
      }}
    >
      <CC color={h ? `${GOLD}55` : GOLD_GLOW} size={10} />
      <div className="flex flex-col items-center">
        <motion.div
          animate={h ? { scale: 1.08, rotate: -3 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.28 }}
          className="w-12 h-12 flex items-center justify-center mb-1.5"
          style={{
            backgroundColor: h ? `${CRIMSON}14` : `${GOLD}07`,
            transition: "background-color 0.3s",
          }}
        >
          <Icon
            size={21}
            color={h ? CRIMSON : DIM}
            strokeWidth={1.5}
            style={{ transition: "color 0.3s" }}
          />
        </motion.div>
        <motion.div
          animate={h ? { width: "34px" } : { width: "16px" }}
          transition={{ duration: 0.28 }}
          style={{
            height: "1px",
            backgroundColor: GOLD,
            opacity: 0.45,
            borderRadius: "1px",
          }}
        />
      </div>
      <p
        className="mt-2 text-center text-[10px] truncate w-full"
        style={{
          fontFamily: FU,
          letterSpacing: "0.16em",
          fontWeight: 600,
          color: h ? IVORY : `${IVORY}77`,
        }}
      >
        {title.toUpperCase()}
      </p>
      <div className="flex justify-center">
        <SegBar level={level} delay={delay + 0.2} />
      </div>
      <p
        className="text-center mt-1"
        style={{
          fontFamily: FM,
          fontSize: "7px",
          color: h ? GOLD : `${GOLD}44`,
          letterSpacing: "0.1em",
          transition: "color 0.3s",
        }}
      >
        {level}%
      </p>
    </motion.div>
  );
}

function Skills() {
  const { portfolioData } = usePortfolio();
  const rawSkills = portfolioData?.skills?.length > 0 ? portfolioData.skills : dummyData.skills;
  const skills = rawSkills.slice(0, 15);
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: RICH }}
    >
      <Spotlight
        cx="12%"
        cy="50%"
        color="rgba(184,146,58,0.05)"
        r="50%"
      />
      <Scanlines />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[520px]">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex-shrink-0 flex flex-col overflow-hidden"
          style={{
            width: "clamp(210px,26%,280px)",
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: VOID }}
          />
          <FilmStrip />
          <Scanlines />
          <div className="relative z-10 pl-10 pr-5 pt-10 pb-8 flex flex-col h-full">
            <div
              className="w-12 h-12 flex items-center justify-center mb-5 relative"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
              }}
            >
              <CC color={`${GOLD}33`} size={8} />
              <Clapperboard size={22} color={GOLD} strokeWidth={1.5} />
            </div>
            {[
              ["ROLL", "A001"],
              ["TAKE", "07"],
              ["SCENE", "02"],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center gap-3 mb-1">
                <span
                  style={{
                    fontFamily: FM,
                    fontSize: "6px",
                    color: `${IVORY}22`,
                    letterSpacing: "0.15em",
                    minWidth: "28px",
                  }}
                >
                  {l}
                </span>
                <span
                  style={{
                    fontFamily: FM,
                    fontSize: "8px",
                    color: `${IVORY}44`,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            <Rec bright />
            <GoldLine className="my-5" />
            <span
              style={{
                fontFamily: FM,
                fontSize: "6px",
                letterSpacing: "0.38em",
                color: GOLD,
                marginBottom: "10px",
              }}
            >
              // SKILLS
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.45,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: FD,
                fontSize: "58px",
                lineHeight: 0.92,
                color: IVORY,
                letterSpacing: "0.04em",
                marginBottom: "12px",
              }}
            >
              SKILLS
            </motion.h2>
            {[
              "Crafting stories.",
              "Capturing emotions.",
              "Creating impact.",
            ].map((l, i) => (
              <p
                key={i}
                style={{
                  fontFamily: FB,
                  fontSize: "10px",
                  fontStyle: "italic",
                  color: DIM,
                  lineHeight: 1.65,
                }}
              >
                {l}
              </p>
            ))}
            <div className="flex-1" />
            <GoldLine className="mb-3" />
            <div className="flex gap-3">
              {["MANUAL", "ISO 800", "f/2.8"].map((l) => (
                <span
                  key={l}
                  style={{
                    fontFamily: FM,
                    fontSize: "6px",
                    color: `${IVORY}18`,
                    letterSpacing: "0.1em",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex-1 p-8 lg:p-10">
          <Reveal delay={0.3}>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: BORDER }}
              />
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "7px",
                  letterSpacing: "0.32em",
                  color: GOLD,
                }}
              >
                {skills.length} AREAS OF EXPERTISE
              </span>
              <div
                className="h-px w-8"
                style={{ backgroundColor: BORDER }}
              />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {skills.map((s, i) => (
              <SkillCard key={s.name || s.title || i} skill={s} index={i} />
            ))}
          </div>
          <Reveal delay={1.0}>
            <div
              className="mt-8 pt-5 flex items-center gap-4"
              style={{ borderTop: `1px solid ${BORDER}` }}
            >
              <Film size={10} color={GOLD} />
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "7px",
                  color: `${IVORY}22`,
                  letterSpacing: "0.15em",
                }}
              >
                SCENE 02 · TAKE 07 · ROLL A001
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: BORDER }}
              />
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "7px",
                  color: `${IVORY}22`,
                  letterSpacing: "0.15em",
                }}
              >
                {skills.length} AREAS OF EXPERTISE
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px",
  });
  const num = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = (ts, startTs) => {
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * num));
      if (progress < 1)
        requestAnimationFrame((ts2) => step(ts2, startTs));
    };
    requestAnimationFrame((ts) => step(ts, ts));
  }, [inView, num]);

  return (
    <span ref={ref}>
      {display}
      {value.includes("+") ? "+" : suffix}
    </span>
  );
}

// ─── Stats (Updated matching Vintage Paper Cinematic Theme) ───────────────────
function Stats() {
  const { portfolioData } = usePortfolio();
  const stats = { ...dummyData.stats, ...portfolioData?.stats };
  const projectsCount = portfolioData?.projects?.length || dummyData.projects?.length || 25;

  const yearsExperience = stats.yearsExperience || 8;
  const projectsCompleted = stats.projectsCompleted || projectsCount;
  const happyClients = stats.happyClients || 42;

  const statItems = [
    {
      value: `${yearsExperience}+`,
      label: "Years Experience",
      desc: "Crafting stories and directing visual magic for years.",
    },
    {
      value: `${projectsCompleted}+`,
      label: "Projects Directed",
      desc: "From short films to websites, bringing stories to life.",
    },
    {
      value: "12+",
      label: "Awards Received",
      desc: "Recognized by industry peers and film festivals worldwide.",
    },
    {
      value: `${happyClients}+`,
      label: "Happy Clients",
      desc: "Trusted by brands and creators to deliver exceptional results.",
    },
  ];

  const ref = useRef(null);

  // Light Paper Theme Constants specifically for Stats
  const PAPER_BG = "#EFEBE1";
  const CARD_BG = "#F6F3EC";
  const DARK = "#1A1A1A";
  const RED = "#C8102E";
  const GRAY = "#786C5A";

  // Custom SVG Icons matching the reference precisely
  const StatIcons = [
    // 0: Film Reel
    (props) => (
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        {...props}
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="#2a2a2a"
          stroke="#111"
          strokeWidth="2"
        />
        <circle cx="32" cy="32" r="4" fill={CARD_BG} />
        <circle cx="32" cy="14" r="8" fill={CARD_BG} />
        <circle cx="16" cy="42" r="8" fill={CARD_BG} />
        <circle cx="48" cy="42" r="8" fill={CARD_BG} />
        <path
          d="M 5 60 L 60 60"
          stroke="#111"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
    // 1: Director's Chair with Star
    (props) => (
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        {...props}
      >
        <line
          x1="16"
          y1="36"
          x2="16"
          y2="60"
          stroke="#2a2a2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="48"
          y1="36"
          x2="48"
          y2="60"
          stroke="#2a2a2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="40"
          x2="48"
          y2="60"
          stroke="#2a2a2a"
          strokeWidth="3"
        />
        <line
          x1="48"
          y1="40"
          x2="16"
          y2="60"
          stroke="#2a2a2a"
          strokeWidth="3"
        />
        <rect
          x="12"
          y="32"
          width="40"
          height="4"
          fill="#2a2a2a"
          rx="2"
        />
        <line
          x1="16"
          y1="32"
          x2="16"
          y2="10"
          stroke="#2a2a2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="48"
          y1="32"
          x2="48"
          y2="10"
          stroke="#2a2a2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect
          x="16"
          y="14"
          width="32"
          height="12"
          fill="#2a2a2a"
        />
        <polygon
          points="32,16 34,20 38,20 35,22 36,26 32,24 28,26 29,22 26,20 30,20"
          fill={RED}
        />
      </svg>
    ),
    // 2: Oscar Statue
    (props) => (
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        {...props}
      >
        <rect
          x="22"
          y="52"
          width="20"
          height="8"
          fill="#2a2a2a"
        />
        <rect
          x="26"
          y="48"
          width="12"
          height="4"
          fill="#2a2a2a"
        />
        <line
          x1="32"
          y1="48"
          x2="32"
          y2="24"
          stroke="#2a2a2a"
          strokeWidth="6"
        />
        <circle cx="32" cy="18" r="6" fill="#2a2a2a" />
        <path d="M 26 28 L 38 28 L 32 36 Z" fill="#2a2a2a" />
      </svg>
    ),
    // 3: Clients/Users with Star
    (props) => (
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        {...props}
      >
        <circle cx="20" cy="24" r="6" fill="#444" />
        <path d="M 10 44 C 10 36 30 36 30 44" fill="#444" />
        <circle cx="44" cy="24" r="6" fill="#444" />
        <path d="M 34 44 C 34 36 54 36 54 44" fill="#444" />
        <circle cx="32" cy="28" r="8" fill="#2a2a2a" />
        <path d="M 18 52 C 18 40 46 40 46 52" fill="#2a2a2a" />
        <polygon
          points="32,42 34,46 38,46 35,48 36,52 32,50 28,52 29,48 26,46 30,46"
          fill={RED}
        />
      </svg>
    ),
  ];

  function RedCropMarks() {
    return (
      <>
        <div className="absolute top-3 left-3 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-[#C8102E]" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-[#C8102E]" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-[#C8102E]" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-[#C8102E]" />
      </>
    );
  }

  return (
    <section
      id="stats"
      ref={ref}
      className="relative overflow-hidden py-16"
      style={{ backgroundColor: PAPER_BG, color: DARK }}
    >
      {/* Top Details Bar */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 mb-12 relative z-20">
        <Reveal delay={0}>
          <div className="flex flex-col md:flex-row shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            {/* Dark left box */}
            <div className="bg-[#181818] text-white flex gap-6 px-8 py-4 w-full md:w-auto relative">
              <div className="flex flex-col items-center">
                <span className="text-[#888] font-mono text-[8px] tracking-widest mb-1">
                  SCENE
                </span>
                <span className="font-mono text-sm">02</span>
              </div>
              <div className="w-px bg-red-800/50 my-1" />
              <div className="flex flex-col items-center">
                <span className="text-[#888] font-mono text-[8px] tracking-widest mb-1">
                  TAKE
                </span>
                <span className="font-mono text-sm">07</span>
              </div>
              <div className="w-px bg-red-800/50 my-1" />
              <div className="flex flex-col items-center">
                <span className="text-[#888] font-mono text-[8px] tracking-widest mb-1">
                  ROLL
                </span>
                <span className="font-mono text-sm">A001</span>
              </div>
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Light right box */}
            <div className="flex-1 border border-[#d5d0C4] flex items-center justify-between px-6 lg:px-10 py-4 relative bg-opacity-40 bg-white">
              <div
                className="absolute inset-0 opacity-50"
                style={{ backgroundColor: PAPER_BG }}
              />
              <div className="relative z-10 flex gap-4 lg:gap-8 font-mono text-[10px] tracking-widest text-[#786C5A]">
                <span>FOCUS : MANUAL</span>
                <span>ISO : 800</span>
                <span>f/2.8</span>
              </div>
              <Crosshair
                size={16}
                color={RED}
                className="relative z-10 opacity-70"
              />
              {/* Corner brackets */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#b5b0a4]" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#b5b0a4]" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#b5b0a4]" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#b5b0a4]" />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        {/* Left Side: Typography and Composition */}
        <div className="xl:col-span-4 relative flex flex-col pt-4 overflow-hidden xl:overflow-visible">
          {/* Watermark */}
          <div
            className="absolute right-0 top-16 text-[260px] font-bold select-none leading-none pointer-events-none z-0"
            style={{
              fontFamily: FD,
              color: "rgba(0,0,0,0.03)",
              transform: "translateX(20%)",
            }}
          >
            2
          </div>

          <Reveal delay={0.2} className="relative z-10">
            <h4
              style={{ fontFamily: FU, color: RED }}
              className="tracking-[0.2em] text-[10px] font-bold mb-2 uppercase"
            >
              BY THE NUMBERS
            </h4>
            <h2
              style={{ fontFamily: FD, color: DARK }}
              className="text-[120px] lg:text-[140px] leading-[0.8] mb-6 tracking-wide"
            >
              STATS
            </h2>
            <div className="flex gap-4">
              <div
                className="w-px h-10"
                style={{ backgroundColor: RED, opacity: 0.5 }}
              />
              <p
                style={{ fontFamily: FM, color: GRAY }}
                className="text-[10px] tracking-widest uppercase leading-[1.8]"
              >
                Capturing milestones.
                <br />
                Creating legacies.
              </p>
            </div>
          </Reveal>

          {/* Decorative Clapper and Reels Graphic */}
          <Reveal
            delay={0.4}
            className="mt-16 xl:mt-auto relative w-full h-56 flex items-end opacity-90 z-10"
          >
            {/* Back Reel */}
            <svg
              className="absolute bottom-12 right-16 w-24 h-24 drop-shadow-xl"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="#2a2a2a"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle cx="32" cy="32" r="5" fill={PAPER_BG} />
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle
                  key={deg}
                  cx={32 + 18 * Math.cos((deg * Math.PI) / 180)}
                  cy={32 + 18 * Math.sin((deg * Math.PI) / 180)}
                  r="7"
                  fill={PAPER_BG}
                />
              ))}
            </svg>
            {/* Front Reel */}
            <svg
              className="absolute bottom-4 right-0 w-32 h-32 drop-shadow-2xl"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="#1f1f1f"
                stroke="#000"
                strokeWidth="2"
              />
              <circle cx="32" cy="32" r="5" fill={PAPER_BG} />
              {[36, 108, 180, 252, 324].map((deg) => (
                <circle
                  key={deg}
                  cx={32 + 18 * Math.cos((deg * Math.PI) / 180)}
                  cy={32 + 18 * Math.sin((deg * Math.PI) / 180)}
                  r="7"
                  fill={PAPER_BG}
                />
              ))}
            </svg>
            {/* Clapperboard Base */}
            <div className="absolute bottom-0 left-0 w-56 h-40 bg-[#181818] rounded-[4px] shadow-2xl transform -rotate-3 border border-[#333] flex flex-col overflow-hidden z-20">
              <div
                className="w-full h-8 flex-shrink-0"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #eee, #eee 12px, #111 12px, #111 24px)",
                }}
              />
              <div
                className="w-full h-8 flex-shrink-0"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, #eee, #eee 12px, #111 12px, #111 24px)",
                  marginTop: "2px",
                }}
              />
              <div className="flex-1 p-3 text-[#eee] flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[7px] mb-1 opacity-60 uppercase tracking-widest">
                    Production
                  </p>
                  <div className="flex border border-[#555]">
                    <div className="flex-1 border-r border-[#555] p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70">SCENE</p>
                      <p className="font-bebas text-lg">02</p>
                    </div>
                    <div className="flex-1 border-r border-[#555] p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70">TAKE</p>
                      <p className="font-bebas text-lg">07</p>
                    </div>
                    <div className="flex-1 p-1 pb-0 text-center">
                      <p className="text-[6px] opacity-70">ROLL</p>
                      <p className="font-bebas text-lg">A001</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end pb-1">
                  <p className="font-mono text-[7px] opacity-60 uppercase tracking-widest">
                    Director
                  </p>
                  <p
                    className="text-xl text-white"
                    style={{
                      fontFamily: "'Brush Script MT', cursive",
                      transform: "rotate(-4deg)",
                    }}
                  >
                    {portfolioData?.personal?.name || "Ashwin R."}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Side: Stats Cards Row */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
          {statItems.map((item, i) => {
            const SvgIcon = StatIcons[i];

            return (
              <Reveal key={item.label} delay={0.4 + i * 0.1}>
                <motion.div
                  whileHover={{
                    y: -6,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center text-center p-8 lg:p-6 xl:p-8 border shadow-lg h-full"
                  style={{
                    backgroundColor: CARD_BG,
                    borderColor: "#E5DFD1",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                  }}
                >
                  <RedCropMarks />

                  {/* Faint Spotlight glow on top edge of card */}
                  <div
                    className="absolute top-0 left-0 right-0 h-32 opacity-40 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at top, #ffffff 0%, transparent 70%)",
                    }}
                  />

                  {/* Icon Area */}
                  <div className="relative mb-6 mt-4 w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white rounded-full blur-md opacity-60" />
                    <div className="relative z-10 drop-shadow-md">
                      <SvgIcon />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 mb-6 opacity-60">
                    <span
                      className="text-[10px] tracking-widest"
                      style={{ fontFamily: FM, color: GRAY }}
                    >
                      -
                    </span>
                    <Star size={10} color={RED} fill={RED} />
                    <span
                      className="text-[10px] tracking-widest"
                      style={{ fontFamily: FM, color: GRAY }}
                    >
                      -
                    </span>
                  </div>

                  {/* Number */}
                  <div
                    style={{
                      fontFamily: FD,
                      fontSize: "64px",
                      lineHeight: 1,
                      color: DARK,
                      marginBottom: "6px",
                    }}
                  >
                    <AnimCounter value={item.value} />
                  </div>

                  {/* Label */}
                  <p
                    style={{
                      fontFamily: FU,
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      color: RED,
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                    className="uppercase"
                  >
                    {item.label}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: FB,
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: GRAY,
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Poster({ p }) {
  const [h, setH] = useState(false);
  const title = p.title || "";
  const description = p.description || p.synopsis || "";
  const techStack = p.techStack || p.technologies || [];
  const genre = p.genre || (techStack.length ? techStack.slice(0, 2).join(" / ") : "Web Project");
  const year = p.year || "2024";
  const runtime = p.runtime || "Interactive";
  const rating = p.rating || "8.5";
  const award = p.award || null;
  const liveUrl = p.liveUrl || "#";
  const githubUrl = p.githubUrl || p.repoUrl || "#";
  const image = p.image || "";

  const bgColor = p.bgColor || "#0d0d0d";
  const accentColor = p.accentColor || "#1a1a2e";

  const gc = (g) => {
    const l = g.toLowerCase();
    if (l.includes("drama") || l.includes("react")) return "#4a6fa5";
    if (l.includes("thrill") || l.includes("node")) return "#8b4a6b";
    if (l.includes("doc") || l.includes("pyth")) return "#5a7a4a";
    if (l.includes("noir") || l.includes("css")) return "#444";
    return "#6a5a4a";
  };

  return (
    <motion.div
      className="relative flex-shrink-0 overflow-hidden cursor-default group"
      style={{
        width: "200px",
        height: "300px",
        backgroundColor: bgColor,
        border: `1px solid ${BORDER}`,
      }}
      onHoverStart={() => setH(true)}
      onHoverEnd={() => setH(false)}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute top-0 left-0 right-0 flex justify-around py-1 z-20"
        style={{ backgroundColor: "#00000055" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-sm"
            style={{
              backgroundColor: "#00000077",
              border: "1px solid #ffffff0e",
            }}
          />
        ))}
      </div>

      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 z-0"
          style={{
            backgroundImage: `url(${image})`,
            opacity: 0.4,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(180deg,${bgColor} 0%,${accentColor} 45%,${bgColor} 100%)`,
          }}
        />
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%,${CRIMSON}10 0%,transparent 65%)`,
        }}
      />
      <div className="absolute top-10 left-0 right-0 flex flex-col items-center pt-4 z-10">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{
            background: `radial-gradient(circle,${accentColor}77 0%,transparent 70%)`,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Film size={25} color="rgba(255,255,255,0.4)" strokeWidth={1} />
        </div>
        <div
          className="px-2 py-0.5 max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ backgroundColor: gc(genre) }}
        >
          <span
            style={{
              fontFamily: FU,
              fontSize: "8px",
              letterSpacing: "0.14em",
              color: "#fff",
            }}
          >
            {genre.toUpperCase()}
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 p-3 z-10"
        style={{
          background:
            "linear-gradient(0deg,rgba(0,0,0,0.92) 0%,transparent 100%)",
          paddingTop: "32px",
        }}
      >
        {award && (
          <div className="flex items-center gap-1 mb-1">
            <Award size={8} color={GOLD} />
            <span
              style={{
                fontFamily: FM,
                fontSize: "7px",
                color: GOLD,
                letterSpacing: "0.1em",
              }}
            >
              {award.toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 mb-1">
          <Star size={8} color={GOLD} fill={GOLD} />
          <span
            style={{
              fontFamily: FM,
              fontSize: "8px",
              color: GOLD,
            }}
          >
            {rating}
          </span>
          <span
            style={{
              fontFamily: FM,
              fontSize: "7px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            · {runtime} · {year}
          </span>
        </div>
        <h3
          className="truncate"
          style={{
            fontFamily: FD,
            fontSize: "18px",
            letterSpacing: "0.04em",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h3>
      </div>
      <AnimatePresence>
        {h && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-30"
            style={{ backgroundColor: "rgba(8,7,6,0.95)" }}
          >
            <p
              className="line-clamp-6 text-[10px]"
              style={{
                fontFamily: FB,
                lineHeight: 1.75,
                color: `${IVORY}77`,
                marginBottom: "14px",
              }}
            >
              {description}
            </p>
            <div className="flex flex-col gap-1.5 w-full">
              {liveUrl && liveUrl !== "#" && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-crimson font-bold text-[8px] tracking-widest text-white hover:bg-red-800 transition-colors"
                  style={{ fontFamily: FU }}
                >
                  <Play size={8} fill="white" /> LIVE DEMO
                </a>
              )}
              {githubUrl && githubUrl !== "#" && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 font-bold text-[8px] tracking-widest text-white hover:bg-zinc-700 transition-colors"
                  style={{ fontFamily: FU }}
                >
                  CODE BASE
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-around py-0.5 z-20"
        style={{ backgroundColor: "#00000055" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-sm"
            style={{
              backgroundColor: "#00000077",
              border: "1px solid #ffffff0e",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects?.length > 0 ? portfolioData.projects : dummyData.projects;
  const scrollRef = useRef(null);

  const scroll = (d) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: d === "right" ? 220 : -220,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden py-20"
      style={{ backgroundColor: VOID }}
    >
      <Spotlight
        cx="50%"
        cy="0%"
        color={`${CRIMSON}06`}
        r="60%"
      />
      <Scanlines />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${GOLD}55)`,
                maxWidth: "72px",
              }}
            />
            <span
              style={{
                fontFamily: FM,
                fontSize: "7px",
                letterSpacing: "0.42em",
                color: GOLD,
              }}
            >
              FILMOGRAPHY
            </span>
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(to left, transparent, ${GOLD}55)`,
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: FD,
              fontSize: "clamp(44px,5.5vw,76px)",
              lineHeight: 0.92,
              letterSpacing: "0.03em",
              color: IVORY,
            }}
          >
            PROJECTS
          </h2>
          <p
            className="mt-3"
            style={{
              fontFamily: FU,
              fontSize: "9px",
              letterSpacing: "0.32em",
              color: DIM,
            }}
          >
            A SELECTION OF WORKS
          </p>
          <div
            className="mt-4 h-px w-14 mx-auto"
            style={{ backgroundColor: `${GOLD}44` }}
          />
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
            }}
          >
            {projects.map((p, idx) => (
              <div key={p.title || idx} style={{ scrollSnapAlign: "start" }}>
                <Poster p={p} />
              </div>
            ))}
          </div>
          {[
            { d: "left", cls: "left-0 -translate-x-5" },
            { d: "right", cls: "right-0 translate-x-5" },
          ].map(({ d, cls }) => (
            <button
              key={d}
              onClick={() => scroll(d)}
              className={`absolute ${cls} top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center`}
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
              }}
            >
              {d === "left" ? (
                <ChevronLeft size={14} color={IVORY} />
              ) : (
                <ChevronRight size={14} color={IVORY} />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? "16px" : "5px",
                height: "3px",
                borderRadius: "2px",
                backgroundColor: i === 0 ? CRIMSON : BORDER,
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
const TLChair = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path d="M5 20L19 9 M19 20L5 9" />
    <path d="M7 9V4h10v5 M5 13h14" />
  </svg>
);

const TLLight = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M10 12L8 22 M14 12l2 10 M6 22h12" />
  </svg>
);

const TLReel = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

function ExperienceGraphic() {
  const { portfolioData } = usePortfolio();
  const personal = { ...dummyData.personal, ...portfolioData?.personal };
  if (!personal.avatar) {
    personal.avatar = dummyData.personal.avatar;
  }
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
      <defs>
        <radialGradient id="smoke-grad">
          <stop offset="0%" stopColor="#C8102E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B0A08" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Backlight/Smoke Background */}
      <circle cx="200" cy="200" r="160" fill="url(#smoke-grad)" opacity="0.5" />

      {/* Director's Chair (Background) */}
      <g stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round">
        <line x1="120" y1="360" x2="280" y2="200" opacity="0.6" />
        <line x1="280" y1="360" x2="120" y2="200" opacity="0.6" />
        <path d="M 100 200 Q 200 220 300 200" fill="none" stroke="#050505" strokeWidth="16" />
        <line x1="120" y1="200" x2="120" y2="80" stroke="#111" strokeWidth="10" />
        <line x1="280" y1="200" x2="280" y2="80" stroke="#111" strokeWidth="10" />
        <rect x="110" y="90" width="180" height="60" fill="#080808" stroke="#1a1a1a" strokeWidth="2" />
        <text
          x="200"
          y="132"
          fill="#333"
          fontSize="36"
          fontFamily="'Bebas Neue', sans-serif"
          textAnchor="middle"
          letterSpacing="4"
        >
          DIRECTOR
        </text>
      </g>

      {/* Film Reel */}
      <g transform="translate(260, 280) scale(0.9)">
        <circle cx="0" cy="0" r="80" fill="#0a0a0a" stroke="#222" strokeWidth="6" />
        <circle cx="0" cy="0" r="12" fill="#222" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle
            key={angle}
            cx={45 * Math.cos((angle * Math.PI) / 180)}
            cy={45 * Math.sin((angle * Math.PI) / 180)}
            r="18"
            fill="#0F0D0A"
          />
        ))}
      </g>

      {/* Clapperboard */}
      <g transform="translate(40, 170) rotate(-8)">
        <rect x="0" y="30" width="240" height="150" fill="#0c0c0c" stroke="#2a2a2a" strokeWidth="3" rx="4" />
        <g transform="translate(0, 5)">
          <rect x="0" y="0" width="240" height="25" fill="#0c0c0c" stroke="#2a2a2a" strokeWidth="2" rx="3" />
          <polygon points="19,0 41,0 26,25 4,25" fill="#eee" />
          <polygon points="64,0 86,0 71,25 49,25" fill="#eee" />
          <polygon points="109,0 131,0 116,25 94,25" fill="#eee" />
          <polygon points="154,0 176,0 161,25 139,25" fill="#eee" />
          <polygon points="199,0 221,0 206,25 184,25" fill="#eee" />
        </g>
        <g transform="translate(0, 5) rotate(-22, 10, 0)">
          <rect x="0" y="-25" width="240" height="25" fill="#0c0c0c" stroke="#2a2a2a" strokeWidth="2" rx="3" />
          <polygon points="19,-25 41,-25 26,0 4,0" fill="#eee" />
          <polygon points="64,-25 86,-25 71,0 49,0" fill="#eee" />
          <polygon points="109,-25 131,-25 116,0 94,0" fill="#eee" />
          <polygon points="154,-25 176,-25 161,0 139,0" fill="#eee" />
          <polygon points="199,-25 221,-25 206,0 184,0" fill="#eee" />
        </g>
        <text x="15" y="65" fill="#888" fontSize="12" fontFamily="'DM Mono', monospace" letterSpacing="2">
          PRODUCTION
        </text>
        <line x1="15" y1="75" x2="225" y2="75" stroke="#2a2a2a" strokeWidth="1.5" />
        <text x="15" y="95" fill="#666" fontSize="10" fontFamily="'DM Mono', monospace">
          SCENE
        </text>
        <text x="15" y="125" fill="#fff" fontSize="36" fontFamily="'Bebas Neue', sans-serif">
          24
        </text>
        <line x1="85" y1="75" x2="85" y2="135" stroke="#2a2a2a" strokeWidth="1.5" />
        <text x="95" y="95" fill="#666" fontSize="10" fontFamily="'DM Mono', monospace">
          TAKE
        </text>
        <text x="95" y="125" fill="#fff" fontSize="36" fontFamily="'Bebas Neue', sans-serif">
          07
        </text>
        <line x1="155" y1="75" x2="155" y2="135" stroke="#2a2a2a" strokeWidth="1.5" />
        <text x="165" y="95" fill="#666" fontSize="10" fontFamily="'DM Mono', monospace">
          ROLL
        </text>
        <text x="165" y="125" fill="#fff" fontSize="36" fontFamily="'Bebas Neue', sans-serif">
          A001
        </text>
        <line x1="15" y1="135" x2="225" y2="135" stroke="#2a2a2a" strokeWidth="1.5" />
        <text x="15" y="155" fill="#666" fontSize="10" fontFamily="'DM Mono', monospace">
          DIRECTOR
        </text>
        <text
          x="110"
          y="170"
          fill="#fff"
          fontSize="42"
          fontFamily="'Brush Script MT', cursive"
          opacity="0.95"
          transform="rotate(-4, 110, 170)"
        >
          {personal.name || "Ashwin R."}
        </text>
      </g>
    </svg>
  );
}

function Experience() {
  const { portfolioData } = usePortfolio();
  const rawExperience = portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;

  const experience = rawExperience.map((item) => ({
    year: item.period || `${item.startDate || ""} – ${item.endDate || ""}` || "2021 – PRESENT",
    role: item.role || "Developer",
    company: item.company || "Web Development",
    desc: item.description || "",
  })).slice(0, 4);

  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <section
      id="experience"
      ref={ref}
      className="relative overflow-hidden py-24"
      style={{
        backgroundColor: RICH,
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <Spotlight
        cx="20%"
        cy="50%"
        color={`${CRIMSON}0A`}
        r="60%"
      />
      <Scanlines />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-8 min-h-[600px] items-center lg:items-start">
        {/* LEFT SIDE: Graphic & Title */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full lg:w-[45%] flex flex-col items-center lg:items-start pt-10"
        >
          <div className="relative w-full max-w-[400px] aspect-square mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.1)_0%,transparent_60%)] blur-2xl" />
            <ExperienceGraphic />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Crosshair size={14} color={CRIMSON} />
            <span
              style={{
                fontFamily: FM,
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: DIM,
              }}
            >
              PRODUCTION LOG //
            </span>
          </div>
          <h2
            style={{
              fontFamily: FD,
              fontSize: "clamp(56px, 6vw, 84px)",
              color: IVORY,
              lineHeight: 0.9,
              letterSpacing: "0.02em",
            }}
          >
            EXPERIENCE
          </h2>
          <p
            style={{
              fontFamily: FU,
              fontSize: "12px",
              letterSpacing: "0.3em",
              color: CRIMSON,
              marginTop: "8px",
            }}
          >
            A JOURNEY THROUGH PROJECTS
          </p>
        </motion.div>

        {/* RIGHT SIDE: Timeline */}
        <div className="w-full lg:w-[55%] relative pt-8 pb-12 lg:pl-10">
          <motion.div
            className="absolute left-[88px] md:left-[108px] top-4 bottom-4 w-[2px] origin-top"
            style={{ backgroundColor: `${CRIMSON}33` }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          <div className="flex flex-col gap-10">
            {experience.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.4 + i * 0.15,
                  ease: "easeOut",
                }}
                className="relative grid grid-cols-[80px_30px_1fr_30px] md:grid-cols-[100px_40px_1fr_40px] gap-2 md:gap-4 items-center group cursor-default"
              >
                {/* 1. Date Segment */}
                <div
                  className="text-right"
                  style={{
                    fontFamily: FM,
                    fontSize: "9px",
                    color: DIM,
                    letterSpacing: "0.1em",
                    lineHeight: 1.4,
                  }}
                >
                  {item.year.replace("–", "-")}
                </div>

                {/* 2. Target Node Segment */}
                <div className="relative flex justify-center">
                  <div
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-125"
                    style={{
                      backgroundColor: RICH,
                      border: `2px solid ${DIM}66`,
                    }}
                  >
                    <div
                      className="w-[6px] h-[6px] rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: i === 0 ? CRIMSON : `${CRIMSON}88`,
                      }}
                    />
                  </div>
                </div>

                {/* 3. Text Content Segment */}
                <div className="flex flex-col pb-6 border-b border-[rgba(184,146,58,0.06)] group-hover:border-[rgba(200,16,46,0.3)] transition-colors duration-300 pt-5">
                  <h3
                    style={{
                      fontFamily: FD,
                      fontSize: "clamp(20px, 3vw, 26px)",
                      color: IVORY,
                      letterSpacing: "0.05em",
                      lineHeight: 1.1,
                    }}
                  >
                    {item.role.toUpperCase()}
                  </h3>
                  <p
                    style={{
                      fontFamily: FU,
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      color: CRIMSON,
                      marginTop: "4px",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    {item.company.toUpperCase()}
                  </p>
                  <p
                    style={{
                      fontFamily: FB,
                      fontSize: "12px",
                      color: `${IVORY}88`,
                      lineHeight: 1.6,
                      maxWidth: "95%",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* 4. Background Outline Icon Segment */}
                <div
                  className="flex justify-end opacity-10 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ color: DIM }}
                >
                  {i === 0 && <TLChair />}
                  {i === 1 && <TLChair />}
                  {i === 2 && <TLLight />}
                  {i === 3 && <TLReel />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const { portfolioData } = usePortfolio();
  const rawTestimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;

  const testimonials = rawTestimonials.map((t) => ({
    quote: t.text || t.content || "",
    name: t.name || t.author || "Crew Member",
    role: t.role || "Collaborator",
    avatar: t.avatar || "",
    initials: (t.name || t.author || "CM").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
  })).slice(0, 3);

  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: DEEP }}
    >
      <Spotlight
        cx="50%"
        cy="50%"
        color="rgba(184,146,58,0.03)"
        r="75%"
      />
      <Scanlines />

      <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Camera size={400} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col xl:flex-row gap-12 xl:gap-16 items-center xl:items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex-shrink-0 flex flex-col items-center xl:items-start text-center xl:text-left mt-8"
          style={{ width: "clamp(240px, 25%, 320px)" }}
        >
          <div className="flex items-end">
            <span
              style={{
                fontFamily: FD,
                fontSize: "60px",
                color: CRIMSON,
                lineHeight: 0.8,
              }}
            >
              99
            </span>
            <span
              style={{
                fontFamily: FD,
                fontSize: "24px",
                color: CRIMSON,
                lineHeight: 0.8,
                marginLeft: "2px",
              }}
            >
              ,
            </span>
          </div>
          <h2
            style={{
              fontFamily: FD,
              fontSize: "clamp(46px, 5vw, 56px)",
              lineHeight: 1,
              color: IVORY,
              letterSpacing: "0.02em",
              marginTop: "12px",
            }}
          >
            TESTIMONIALS
          </h2>
          <p
            style={{
              fontFamily: FU,
              fontSize: "11px",
              letterSpacing: "0.28em",
              color: CRIMSON,
              marginTop: "8px",
              fontWeight: 600,
            }}
          >
            WORDS FROM THE CREW
          </p>

          <div
            className="flex items-center justify-center xl:justify-start gap-[3px] my-10 opacity-30"
            style={{ backgroundColor: "#000", padding: "4px" }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: "10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>

          <p
            style={{
              fontFamily: FU,
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: DIM,
              marginBottom: "20px",
            }}
          >
            EVERY COLLABORATION
            <br />
            TELLS A STORY
          </p>

          <div
            style={{
              fontFamily:
                "'Brush Script MT', 'Caveat', 'Dancing Script', cursive",
              fontSize: "40px",
              color: IVORY,
              opacity: 0.8,
              transform: "rotate(-2deg)",
            }}
          >
            {portfolioData?.personal?.name || "Ashwin R."}
          </div>
        </motion.div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-[1.25rem] p-6 lg:p-8 flex items-center gap-5 cursor-default group"
                style={{
                  backgroundColor: "#110f0d",
                  backgroundImage:
                    "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(200,16,46,0.3)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-[1.25rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, rgba(200,16,46,0.05) 0%, transparent 70%)`,
                  }}
                />

                <div className="flex-shrink-0 self-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #1f1d1b 0%, #11100f 100%)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent)`,
                      }}
                    />
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <span
                        style={{
                          fontFamily: FD,
                          fontSize: "26px",
                          color: "rgba(255,255,255,0.4)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {t.initials}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "40px",
                      color: CRIMSON,
                      lineHeight: 0.4,
                      marginBottom: "16px",
                      transform: "translateY(10px)",
                    }}
                  >
                    “
                  </div>
                  <p
                    className="line-clamp-4 text-[12px]"
                    style={{
                      fontFamily: FB,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "20px",
                    }}
                  >
                    {t.quote}
                  </p>
                  <div>
                    <div
                      style={{
                        fontFamily: FB,
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: IVORY,
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: FU,
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        color: CRIMSON,
                      }}
                    >
                      {t.role.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center gap-3 mt-12"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CRIMSON }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Socials ──────────────────────────────────────────────────────────────────
function Socials() {
  const { portfolioData } = usePortfolio();
  const userSocials = { ...dummyData.socials, ...portfolioData?.socials };

  const socialItems = [];
  if (userSocials.github) socialItems.push({ name: "GITHUB", url: userSocials.github, icon: Github });
  if (userSocials.linkedin) socialItems.push({ name: "LINKEDIN", url: userSocials.linkedin, icon: Linkedin });
  if (userSocials.twitter) socialItems.push({ name: "TWITTER", url: userSocials.twitter, icon: Twitter });
  if (userSocials.email) socialItems.push({ name: "EMAIL", url: `mailto:${userSocials.email}`, icon: Mail });
  if (userSocials.instagram) socialItems.push({ name: "INSTAGRAM", url: userSocials.instagram, icon: Instagram });
  if (userSocials.youtube) socialItems.push({ name: "YOUTUBE", url: userSocials.youtube, icon: Youtube });

  const socials = socialItems.length ? socialItems : [
    { name: "INSTAGRAM", url: "#", icon: Instagram },
    { name: "YOUTUBE", url: "#", icon: Youtube },
    { name: "LINKEDIN", url: "#", icon: Linkedin },
    { name: "GITHUB", url: "#", icon: Github },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  return (
    <section
      id="socials"
      ref={ref}
      className="relative overflow-hidden pt-20 pb-28"
      style={{ backgroundColor: DEEP }}
    >
      <Spotlight
        cx="50%"
        cy="0%"
        color="rgba(184,146,58,0.04)"
        r="65%"
      />
      <Scanlines />
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <Reveal delay={0}>
          <div className="flex flex-col items-center mb-12">
            <Clapperboard size={32} color={IVORY} strokeWidth={1.5} className="mb-4" />
            <div className="relative px-4 py-1.5 mb-2">
              <CC color={CRIMSON} size={6} />
              <span
                style={{
                  fontFamily: FM,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  color: CRIMSON,
                  fontWeight: 700,
                }}
              >
                LET'S CONNECT
              </span>
            </div>
            <h2
              style={{
                fontFamily: FD,
                fontSize: "clamp(56px, 8vw, 84px)",
                lineHeight: 0.9,
                letterSpacing: "0.03em",
                color: IVORY,
              }}
            >
              SOCIALS
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 justify-items-center w-full">
          {socials.map((s, i) => (
            <Reveal
              key={s.name}
              delay={0.15 + i * 0.08}
              className="w-full max-w-[130px]"
            >
              <motion.a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="relative flex flex-col items-center justify-between w-full aspect-square p-3 group"
                style={{
                  backgroundColor: SURFACE,
                  border: `1px solid ${BORDER}`,
                }}
                whileHover={{
                  y: -6,
                  borderColor: BORDER_HV,
                  boxShadow: `0 12px 24px rgba(0,0,0,0.5)`,
                }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                  <svg
                    className="absolute inset-0 w-full h-full text-[#040302] opacity-90 transition-transform duration-300 group-hover:scale-105"
                    viewBox="0 0 100 100"
                  >
                    <filter id={`roughpaper-${i}`}>
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="8"
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="currentColor"
                      filter={`url(#roughpaper-${i})`}
                    />
                  </svg>
                  <s.icon
                    size={22}
                    color={IVORY}
                    className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5 mb-2">
                  <span
                    style={{
                      fontFamily: FD,
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      color: IVORY,
                    }}
                  >
                    {s.name}
                  </span>
                  <div
                    className="w-5 h-[2px] rounded-full transition-colors duration-300 group-hover:bg-crimson"
                    style={{ backgroundColor: `${CRIMSON}88` }}
                  />
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Barcode() {
  const bars = Array.from({ length: 42 }, (_, i) => ({
    w: [2, 1, 3, 1, 2, 4, 1, 3][i % 8],
    h: 100,
  }));
  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: "46px" }}
    >
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            width: `${b.w}px`,
            height: `${b.h}%`,
            backgroundColor: IVORY,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function HorizontalFilmStrip() {
  return (
    <div
      className="w-full h-8 flex items-center gap-2 overflow-hidden px-4"
      style={{
        backgroundColor: "#050403",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
      }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-5 h-4 rounded-[2px]"
          style={{
            border: "1px solid #222",
            backgroundColor: "#111",
          }}
        />
      ))}
    </div>
  );
}

function Footer() {
  const { portfolioData } = usePortfolio();
  const personal = { ...dummyData.personal, ...portfolioData?.personal };
  if (!personal.avatar) {
    personal.avatar = dummyData.personal.avatar;
  }
  const bio = personal.bio || "Crafting cinematic experiences that stay long after the credits roll.";
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden flex flex-col"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <HorizontalFilmStrip />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-16 flex flex-col xl:flex-row items-center xl:items-start justify-between gap-12 xl:gap-8 min-h-[300px]">
        <div
          className="absolute left-0 top-0 bottom-0 w-[400px] pointer-events-none opacity-40 mix-blend-screen hidden lg:block"
          style={{
            background:
              "radial-gradient(circle at 10% 50%, rgba(200, 200, 200, 0.1) 0%, rgba(184, 146, 58, 0.02) 40%, transparent 70%)",
          }}
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
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  fontFamily: FD,
                  fontSize: "14px",
                  color: IVORY,
                }}
              >
                {(personal.name || "A")[0].toUpperCase()}
              </span>
            </div>
            <span
              style={{
                fontFamily: FU,
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: DIM,
              }}
            >
              {(personal.title || "FILM DIRECTOR").toUpperCase()}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: CRIMSON }}
            />
          </div>
          <h2
            style={{
              fontFamily: FD,
              fontSize: "clamp(42px, 5vw, 68px)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: IVORY,
            }}
          >
            EVERY FRAME
            <br />
            <span style={{ color: CRIMSON }}>
              TELLS A STORY.
            </span>
          </h2>
          <p
            style={{
              fontFamily: FU,
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: DIM,
              marginTop: "16px",
            }}
          >
            LET'S CREATE SOMETHING <span style={{ color: CRIMSON }}>ICONIC</span>
          </p>
        </motion.div>

        <div
          className="hidden xl:block w-px h-32 self-center opacity-20"
          style={{ backgroundColor: IVORY }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left z-10"
        >
          <div
            style={{
              fontFamily:
                "'Brush Script MT', 'Caveat', 'Dancing Script', cursive",
              fontSize: "52px",
              color: IVORY,
              opacity: 0.85,
              transform: "rotate(-3deg)",
              marginBottom: "8px",
            }}
          >
            {personal.name || "Ashwin R."}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-3 h-px"
              style={{ backgroundColor: CRIMSON }}
            />
            <span
              style={{
                fontFamily: FM,
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: CRIMSON,
              }}
            >
              FILM DIRECTOR
            </span>
          </div>
          <p
            style={{
              fontFamily: FB,
              fontSize: "13px",
              lineHeight: 1.8,
              color: DIM,
              maxWidth: "300px",
            }}
          >
            {bio}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-shrink-0 flex flex-col items-center xl:items-end z-10 self-center xl:self-end"
        >
          <Barcode />
          <div className="flex items-center gap-4 mt-5">
            <span
              style={{
                fontFamily: FM,
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: DIM,
              }}
            >
              SCENE {personal.scene || "24"}
            </span>
            <span
              style={{
                fontFamily: FM,
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: DIM,
              }}
            >
              TAKE {personal.take || "7"}
            </span>
            <Rec bright />
          </div>
        </motion.div>
      </div>

      <HorizontalFilmStrip />

      <div
        className="relative z-10"
        style={{ backgroundColor: "#060504" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            {navItems.map((item, idx) => (
              <React.Fragment key={item}>
                <button
                  onClick={() => scrollTo(item)}
                  style={{
                    fontFamily: FD,
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: DIM,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = IVORY)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = DIM)}
                >
                  {item}
                </button>
                {idx < navItems.length - 1 && (
                  <div
                    className="w-[3px] h-[3px] rounded-full"
                    style={{ backgroundColor: CRIMSON }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <span
            style={{
              fontFamily: FM,
              fontSize: "8px",
              color: DIM,
              letterSpacing: "0.15em",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <span style={{ color: CRIMSON }}>
              {(personal.name || "ASHWIN R.").toUpperCase()}
            </span>{" "}
            ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Film Director Clapper Board Main Template Component ──────────────────────
export default function Film_Director_Clapper_Board() {
  const { portfolioData } = usePortfolio();
  const personal = { ...dummyData.personal, ...portfolioData?.personal };
  if (!personal.avatar) {
    personal.avatar = dummyData.personal.avatar;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        fontFamily: FB,
        backgroundColor: DEEP,
        color: IVORY,
      }}
    >
      <PremiumCursor />
      <MouseSpotlight />
      <ScrollProgress />
      <FilmGrain />
      <Vignette />

      {/* Top Board Clapper Stick Design */}
      <div
        className="w-full relative overflow-hidden bg-black"
        style={{ lineHeight: 0, zIndex: 60 }}
      >
        <img
          src={topImg}
          alt="Clapperboard"
          className="w-full"
          style={{
            maxHeight: "110px",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${VOID}ee 0%, transparent 12%, transparent 88%, ${VOID}ee 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "2px",
            backgroundColor: CRIMSON,
            opacity: 0.7,
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
