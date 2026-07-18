import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  User,
  Code2,
  MessageSquare,
  Globe
} from "lucide-react";
import "./styles.css";

// ─── Sub-Component: Magnetic Button Physics ──────────────────────────────────
function Magnetic({ children }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Pull element towards cursor slightly (22% strength)
    const pullStrength = 0.22;
    setPosition({ x: distanceX * pullStrength, y: distanceY * pullStrength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// ─── Sub-Component: Split Text Staggered Letter Animation ────────────────────
function SplitText({ text, className = "", delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const letters = Array.from(text);
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay
      }
    }
  };
  
  const letterVariants = {
    hidden: { y: "115%" },
    visible: { 
      y: "0%",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.span 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {letters.map((char, index) => (
        <span 
          key={index} 
          className="mono-char-overflow inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          <motion.span 
            variants={letterVariants} 
            className="inline-block"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ─── Sub-Component: Split Words Paragraph Animation ──────────────────────────
function SplitWords({ text, className = "", delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const words = text.split(" ");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };
  
  const wordVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: { 
      y: "0%", 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.span 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, index) => (
        <span key={index} className="mono-char-overflow inline-block">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ─── Sub-Component: Dynamic Number Counter ───────────────────────────────────
function Counter({ value, duration = 1.8, delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    if (start === end) return;

    let timer;
    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    setTimeout(() => {
      const startTime = Date.now();
      timer = setInterval(() => {
        const timePassed = Date.now() - startTime;
        const progress = Math.min(timePassed / totalMiliseconds, 1);
        const easedProgress = progress * (2 - progress); // ease out quadratic
        const currentCount = Math.floor(easedProgress * end);
        
        setCount(currentCount);
        
        if (progress === 1) {
          clearInterval(timer);
          setCount(end);
        }
      }, stepTime);
    }, delay * 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInView, value, duration, delay]);

  return <span ref={ref}>{count}</span>;
}

// ─── Animation Presets ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ─── Safe Data Fallbacks ──────────────────────────────────────────────────────
const personal = data.personal || {
  name: "Alex Rivera",
  title: "Full Stack Developer",
  bio: "Passionate developer crafting beautiful applications.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  location: "San Francisco, CA",
  tagline: "Building the future, one line of code at a time.",
  availability: "Open to work"
};

const socials = data.socials || {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  email: "alex.rivera@email.com"
};

const stats = data.stats || {
  yearsExperience: 5,
  projectsCompleted: 48,
  happyClients: 32
};

const skills = data.skills || [];
const projects = data.projects || [];
const experience = data.experience || [];
const testimonials = data.testimonials || [];

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function MonoElegant() {
  const { portfolioData: data } = usePortfolio();

  const [isNoir, setIsNoir] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom Cursor Tracker State
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  
  // Raw cursor position (instant, for dot)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Lagged ring position (spring lag for trail effect)
  const ringSpring = { damping: 28, stiffness: 200, mass: 0.5 };
  const cursorRingX = useSpring(cursorX, ringSpring);
  const cursorRingY = useSpring(cursorY, ringSpring);

  // Scroll progress bar tracking
  const scrollProgress = useMotionValue(0);
  const smoothScroll = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

  // Initialize and check device requirements for custom cursor follower
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const checkCursorNeed = () => {
      setShowCustomCursor(!isTouchDevice && window.innerWidth >= 1024);
    };
    checkCursorNeed();
    window.addEventListener("resize", checkCursorNeed);
    return () => window.removeEventListener("resize", checkCursorNeed);
  }, []);

  // Sync cursor coordinates on mousemove
  useEffect(() => {
    if (!showCustomCursor) return;
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [showCustomCursor]);

  // Monitor hovered items to expand custom cursor ring
  useEffect(() => {
    if (!showCustomCursor) return;
    const handleMouseOver = (e) => {
      const link = e.target.closest("a");
      const btn = e.target.closest("button");
      const card = e.target.closest(".mono-card");
      const isInteractive = e.target.closest("a, button, input, textarea, select, [role='button'], .mono-card");
      setCursorHovered(!!isInteractive);
      if (link) setCursorLabel("Visit");
      else if (btn) setCursorLabel("Click");
      else if (card) setCursorLabel("View");
      else setCursorLabel("");
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [showCustomCursor]);

  // Scroll progress tracker
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      scrollProgress.set(progress);
    };
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, [scrollProgress]);

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const sections = ["hero", "about", "skills", "projects", "experience", "testimonials", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`mono-elegant-wrapper w-full min-h-screen relative overflow-hidden select-none ${
      !isNoir ? "theme-blanc" : ""
    } ${showCustomCursor ? "has-custom-cursor" : ""}`}>
      
      {/* ─── Redesigned Cursor: Crosshair Dot + Soft Glow Ring ─── */}
      {showCustomCursor && (
        <>
          {/* Tiny sharp crosshair dot — instant position */}
          <motion.div
            className="pointer-events-none fixed z-[9999]"
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
          >
            {/* Center dot */}
            <div
              style={{
                width: cursorHovered ? "5px" : "4px",
                height: cursorHovered ? "5px" : "4px",
                borderRadius: "50%",
                backgroundColor: "var(--mono-accent)",
                transition: "width 0.2s ease, height 0.2s ease",
              }}
            />
          </motion.div>

          {/* Lagged outer glow ring */}
          <motion.div
            className="pointer-events-none fixed z-[9998]"
            style={{
              x: cursorRingX,
              y: cursorRingY,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              animate={{
                width: cursorHovered ? 56 : 36,
                height: cursorHovered ? 56 : 36,
                opacity: cursorHovered ? 1 : 0.55,
                borderColor: `rgba(var(--mono-accent-rgb), ${cursorHovered ? 0.8 : 0.35})`,
                backgroundColor: `rgba(var(--mono-accent-rgb), ${cursorHovered ? 0.05 : 0})`,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{
                borderRadius: "50%",
                border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Crosshair lines inside ring */}
              {!cursorHovered && (
                <>
                  <div style={{ position: "absolute", top: "50%", left: 4, right: 4, height: "1px", backgroundColor: `rgba(var(--mono-accent-rgb), 0.25)`, transform: "translateY(-50%)" }} />
                  <div style={{ position: "absolute", left: "50%", top: 4, bottom: 4, width: "1px", backgroundColor: `rgba(var(--mono-accent-rgb), 0.25)`, transform: "translateX(-50%)" }} />
                </>
              )}
              {/* Label text on hover */}
              {cursorHovered && cursorLabel && (
                <span style={{ fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: `rgba(var(--mono-accent-rgb), 0.85)`, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, lineHeight: 1, userSelect: "none" }}>
                  {cursorLabel}
                </span>
              )}
            </motion.div>
          </motion.div>
        </>
      )}

      {/* ─── Scroll Progress Bar (Top Edge) ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] z-[999] origin-left"
        style={{
          scaleX: smoothScroll,
          backgroundColor: "var(--mono-accent)",
          opacity: 0.7,
        }}
      />

      {/* ─── Elegant Grid Background ─── */}
      <div className="absolute inset-0 mono-grid-bg opacity-[0.03] dark:opacity-[0.02] pointer-events-none" />

      {/* ─── Navigation Header ─── */}
      <header className="sticky top-0 z-50 w-full border-b mono-border bg-opacity-70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Initials */}
          <button type="button" 
            onClick={() => handleScrollTo("hero")}
            className="text-lg font-bold tracking-[0.25em] uppercase mono-font-sans flex items-center gap-2"
          >
            <span>{personal.name.split(" ").map(n => n[0]).join("")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: "about", label: "About" },
              { id: "skills", label: "Skills" },
              { id: "projects", label: "Projects" },
              { id: "experience", label: "Experience" },
              { id: "testimonials", label: "Quotes" },
              { id: "contact", label: "Contact" }
            ].map((item) => (
              <Magnetic key={item.id}>
                <button type="button"
                  onClick={() => handleScrollTo(item.id)}
                  className={`mono-nav-link text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-current px-1 py-1 ${
                    activeSection === item.id ? "text-neutral-900 dark:text-neutral-100 font-semibold" : ""
                  }`}
                >
                  {item.label}
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* Theme Toggler + Menu Toggle */}
          <div className="flex items-center gap-4">
            <Magnetic>
              <button type="button"
                onClick={() => setIsNoir(!isNoir)}
                className="px-3.5 py-1 text-[10px] tracking-widest uppercase border mono-border rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Toggle monochrome theme"
              >
                {isNoir ? "Blanc ☼" : "Noir ☾"}
              </button>
            </Magnetic>

            {/* Mobile Menu Toggle */}
            <button type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 md:hidden hover:opacity-75 transition-opacity"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 bg-neutral-950 text-white dark:bg-neutral-950 p-6 border-b mono-border md:hidden"
            style={{ backgroundColor: "var(--mono-bg)", color: "var(--mono-text)" }}
          >
            <div className="flex flex-col gap-4">
              {[
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "experience", label: "Experience" },
                { id: "testimonials", label: "Quotes" },
                { id: "contact", label: "Contact" }
              ].map((item) => (
                <button type="button"
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className="text-left text-sm uppercase tracking-widest py-2 border-b mono-border last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Section ─── */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-6 py-12 overflow-hidden border-b mono-border">
        {/* Animated Architectural Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10">
          <svg width="600" height="600" viewBox="0 0 100 100" fill="none" className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] mono-rotate-slow">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.08" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.06" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.06" strokeDasharray="1 3" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
          </svg>
        </div>

        <motion.div 
          className="max-w-5xl w-full mx-auto text-center z-10 flex flex-col items-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Availability Tag */}
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4.5 py-1 border mono-border-strong rounded-full mb-8 text-[9px] uppercase tracking-[0.25em] font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
            <span>{personal.availability ?? "Available for Creative Commissions"}</span>
          </motion.div>

          {/* Name Header - Premium Sliced Stagger Reveal */}
          <h1 className="leading-none mb-6">
            <SplitText 
              text={personal.name.split(" ")[0]} 
              className="block font-light text-[8vw] md:text-[5.5rem] tracking-[0.28em] uppercase text-neutral-400 dark:text-neutral-500 font-sans" 
            />
            <SplitText 
              text={personal.name.split(" ").slice(1).join(" ")} 
              className="block font-bold text-[11vw] md:text-[7.5rem] tracking-tight uppercase mono-font-serif -mt-2 md:-mt-5" 
              delay={0.15}
            />
          </h1>

          {/* Title */}
          <motion.p 
            variants={fadeUp}
            className="text-xs md:text-sm uppercase tracking-[0.35em] font-sans font-light text-neutral-500 dark:text-neutral-400 mb-8 max-w-xl"
          >
            {personal.title}
          </motion.p>

          {/* Tagline Narrative Split Reveal */}
          <div className="mb-12 max-w-3xl leading-relaxed">
            <SplitWords
              text={personal.tagline}
              className="mono-font-serif italic text-lg sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 font-light justify-center text-center px-4"
              delay={0.3}
            />
          </div>

          {/* Calls to Action */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Magnetic>
              <button type="button" 
                onClick={() => handleScrollTo("contact")}
                className="mono-btn-primary px-9 py-4 text-xs uppercase tracking-widest flex items-center gap-2 border mono-border"
              >
                <span>Initiate Project</span>
                <ArrowRight size={14} />
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" 
                onClick={() => handleScrollTo("projects")}
                className="mono-btn-secondary px-9 py-4 text-xs uppercase tracking-widest"
              >
                View Exhibition
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with moving line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">Scroll</span>
          <div className="w-[1px] h-12 bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-neutral-950 dark:bg-white w-full h-1/2"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <User size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="About" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">01 / PROFILE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Stylized B&W Avatar & Location */}
            <motion.div 
              className="lg:col-span-4 flex flex-col gap-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="mono-image-container border mono-border p-2">
                <img 
                  src={personal.avatar} 
                  alt={personal.name} 
                  className="mono-image-gray w-full aspect-square object-cover"
                />
              </div>
              <div className="flex items-center gap-3 p-4 border mono-border text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <MapPin size={14} className="text-neutral-900 dark:text-white" />
                <span>Stationed in {personal.location}</span>
              </div>
            </motion.div>

            {/* Right Column: Bio & Stats */}
            <div className="lg:col-span-8 space-y-10">
              <div className="space-y-6">
                <h3 className="text-lg uppercase tracking-widest font-bold">The Narrative</h3>
                <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light text-base md:text-lg">
                  <SplitWords text={personal.bio} delay={0.1} />
                </div>
              </div>

              {/* Stats Panel - Spec sheet style with counting numbers */}
              <div className="pt-8 border-t mono-border">
                <h3 className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-8">Performance Indices</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
                  {[
                    { val: stats.yearsExperience, label: "Years Experience", prefix: "0" },
                    { val: stats.projectsCompleted, label: "Exhibitions/Projects", prefix: "" },
                    { val: stats.happyClients, label: "Creative Alliances", prefix: "" }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-baseline gap-4 sm:flex-col sm:gap-2 border-l sm:border-l-0 sm:border-t mono-border pl-6 sm:pl-0 sm:pt-4">
                      <span className="mono-font-serif text-4xl md:text-5xl font-light">
                        {stat.prefix}<Counter value={stat.val} delay={i * 0.1} />
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-sans block">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Skills Section ─── */}
      <section id="skills" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <Code2 size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="Proficiencies" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">02 / CAPABILITIES</span>
          </div>

          {/* Grouped Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from(new Set(skills.map(s => s.category))).map((category) => (
              <div key={category} className="mono-card p-6 flex flex-col justify-between">
                {/* Visual outline borders drawing on hover */}
                <div className="mono-hover-border mono-hover-border-top" />
                <div className="mono-hover-border mono-hover-border-right" />
                <div className="mono-hover-border mono-hover-border-bottom" />
                <div className="mono-hover-border mono-hover-border-left" />

                <div>
                  <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 border-b mono-border pb-3 mb-6 font-bold">
                    // {category}
                  </h3>
                  <div className="space-y-6">
                    {skills
                      .filter(s => s.category === category)
                      .map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-baseline text-xs uppercase tracking-widest">
                            <span className="font-medium">{skill.name}</span>
                            <span className="font-mono text-neutral-400 dark:text-neutral-500">
                              <Counter value={skill.level} duration={1.5} />%
                            </span>
                          </div>
                          {/* Progress bar line reveal */}
                          <div className="h-[3px] w-full border mono-border relative overflow-hidden bg-transparent">
                            <motion.div 
                              className="absolute top-0 bottom-0 left-0 bg-neutral-900 dark:bg-white"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Projects Section ─── */}
      <section id="projects" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <Globe size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="Exhibition" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">03 / PROJECTS</span>
          </div>

          <ProjectsGrid projects={projects} />
        </div>
      </section>

      {/* ─── Experience Section ─── */}
      <section id="experience" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <Briefcase size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="Chronology" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">04 / HISTORY</span>
          </div>

          {/* Timeline Structure */}
          <div className="relative ml-4 md:ml-32 space-y-12">
            
            {/* Staggered Height Timeline Line Drawing */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[3px] md:left-[131px] top-4 bottom-4 w-[1px] bg-neutral-200 dark:bg-neutral-800"
            />

            {experience.map((exp, index) => (
              <motion.div 
                key={index} 
                className="relative pl-8 md:pl-12 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                {/* Timeline node scale trigger */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 + index * 0.05 }}
                  className="absolute -left-[1px] md:-left-[125px] top-2.5 w-[9px] h-[9px] rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-neutral-900 dark:group-hover:bg-white border border-neutral-900 dark:border-white transition-colors duration-300" 
                />

                {/* Period for desktop */}
                <div className="hidden md:block absolute right-full top-1 mr-12 text-right">
                  <span className="font-mono text-xs text-neutral-400 tracking-wider whitespace-nowrap block">
                    {exp.period}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mt-1">
                    {exp.company}
                  </span>
                </div>

                <div className="mono-card p-6">
                  {/* Drawing borders hover */}
                  <div className="mono-hover-border mono-hover-border-top" />
                  <div className="mono-hover-border mono-hover-border-right" />
                  <div className="mono-hover-border mono-hover-border-bottom" />
                  <div className="mono-hover-border mono-hover-border-left" />

                  {/* Period for mobile */}
                  <div className="md:hidden flex justify-between items-center gap-4 border-b mono-border pb-2 mb-4 text-xs font-mono text-neutral-400">
                    <span>{exp.company}</span>
                    <span>{exp.period}</span>
                  </div>

                  <h3 className="text-lg font-bold tracking-wide uppercase mb-1">{exp.role}</h3>
                  <p className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 hidden md:block">
                    {exp.company}
                  </p>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-light">
                    {exp.description}
                  </p>

                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t mono-border">
                      {exp.techStack.map((tech) => (
                        <span key={tech} className="text-[9px] font-mono tracking-wider uppercase border mono-border px-2 py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section id="testimonials" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <MessageSquare size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="Alliances" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">05 / TESTIMONIALS</span>
          </div>

          {testimonials.length > 0 ? (
            <TestimonialsCarousel testimonials={testimonials} />
          ) : (
            <p className="text-center text-neutral-400 font-light">No testimonials available.</p>
          )}
        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section id="contact" className="py-24 px-6 border-b mono-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center gap-4 mb-16">
            <div className="p-2 border mono-border rounded-full text-neutral-400">
              <Mail size={16} />
            </div>
            <h2 className="mono-font-serif text-3xl md:text-4xl italic font-light tracking-wide">
              <SplitText text="Contact" />
            </h2>
            <div className="flex-1 h-[1px] bg-neutral-200 dark:bg-neutral-800" />
            <span className="font-mono text-xs text-neutral-400">06 / INQUIRY</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-widest">Collaborate</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-light text-sm">
                  Let's craft architectural digital products with pure intent. Reach out via email or through the creative alliance network.
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t mono-border">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 mb-1">Direct Communication</h4>
                  <a href={`mailto:${socials.email}`} className="text-sm border-b mono-border-strong hover:border-neutral-900 dark:hover:border-white transition-all pb-1 font-mono">
                    {socials.email}
                  </a>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 mb-2">Syndicated Networks</h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { icon: <Github size={16} />, href: socials.github, label: "GitHub" },
                      { icon: <Linkedin size={16} />, href: socials.linkedin, label: "LinkedIn" },
                      { icon: <Twitter size={16} />, href: socials.twitter, label: "Twitter" },
                    ].map((item, idx) => (
                      <Magnetic key={idx}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={item.label}
                          className="p-2.5 border mono-border rounded-full text-neutral-400 hover:text-current hover:border-current transition-colors flex items-center justify-center"
                        >
                          {item.icon}
                        </a>
                      </Magnetic>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="lg:col-span-7 mono-card p-8">
              {/* Drawing borders hover */}
              <div className="mono-hover-border mono-hover-border-top" />
              <div className="mono-hover-border mono-hover-border-right" />
              <div className="mono-hover-border mono-hover-border-bottom" />
              <div className="mono-hover-border mono-hover-border-left" />

              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="mono-name" className="text-[10px] uppercase tracking-widest text-neutral-400">Your Identity</label>
                    <input
                      id="mono-name"
                      type="text"
                      placeholder="Alex Mercer"
                      required
                      className="mono-input w-full py-2 placeholder-neutral-300 dark:placeholder-neutral-800 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="mono-email" className="text-[10px] uppercase tracking-widest text-neutral-400">Electronic Address</label>
                    <input
                      id="mono-email"
                      type="email"
                      placeholder="alex@example.com"
                      required
                      className="mono-input w-full py-2 placeholder-neutral-300 dark:placeholder-neutral-800 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="mono-subject" className="text-[10px] uppercase tracking-widest text-neutral-400">Inquiry Objective</label>
                  <input
                    id="mono-subject"
                    type="text"
                    placeholder="Project proposal"
                    required
                    className="mono-input w-full py-2 placeholder-neutral-300 dark:placeholder-neutral-800 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="mono-message" className="text-[10px] uppercase tracking-widest text-neutral-400">The Directive</label>
                  <textarea
                    id="mono-message"
                    rows={4}
                    placeholder="Describe your design objectives..."
                    required
                    className="mono-input w-full py-2 placeholder-neutral-300 dark:placeholder-neutral-800 text-sm resize-none"
                  />
                </div>

                <Magnetic>
                  <button
                    type="submit"
                    className="mono-btn-primary w-full py-4 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border mono-border"
                  >
                    <span>Transmit Inquiry</span>
                    <ArrowRight size={14} />
                  </button>
                </Magnetic>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-6 bg-neutral-950 text-neutral-500 border-t mono-border text-center" style={{ backgroundColor: "var(--mono-bg)", color: "var(--mono-text-muted)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] uppercase tracking-widest font-mono">
            © {new Date().getFullYear()} {personal.name}. Form follows function.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest">
            <Magnetic>
              <button type="button" onClick={() => handleScrollTo("hero")} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Back to Top</button>
            </Magnetic>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-Component: Projects Showcase ───
function ProjectsGrid({ projects }) {
  const { portfolioData: data } = usePortfolio();

  const [activeFilter, setActiveFilter] = useState("All");

  // Unique list of tags
  const allTech = ["All", ...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 8);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.techStack && p.techStack.includes(activeFilter));

  return (
    <div className="space-y-12">
      {/* Taxonomy Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b mono-border pb-6">
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mr-4">// Taxonomy:</span>
        {allTech.map((tech) => (
          <Magnetic key={tech}>
            <button type="button"
              onClick={() => setActiveFilter(tech)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
                activeFilter === tech
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                  : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-current"
              }`}
            >
              {tech}
            </button>
          </Magnetic>
        ))}
      </div>

      {/* Stagger Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mono-card overflow-hidden flex flex-col justify-between"
            >
              {/* Corner drawing borders */}
              <div className="mono-hover-border mono-hover-border-top" />
              <div className="mono-hover-border mono-hover-border-right" />
              <div className="mono-hover-border mono-hover-border-bottom" />
              <div className="mono-hover-border mono-hover-border-left" />

              <div>
                <div className="mono-image-container aspect-video border-b mono-border">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="mono-image-gray w-full h-full object-cover"
                  />
                  {project.liveUrl && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="bg-neutral-950 text-white border border-neutral-800 text-[8px] uppercase tracking-[0.25em] px-2.5 py-1">
                        Active Showcase
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-wide uppercase">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack || []).map(tech => (
                        <span key={tech} className="text-[9px] font-mono tracking-wider uppercase text-neutral-400">
                          #{tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-4 text-xs font-mono border-t border-transparent">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-neutral-950 dark:text-white font-medium"
                  >
                    <span>EXHIBIT</span>
                    <ExternalLink size={11} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-neutral-400"
                  >
                    <span>SOURCE</span>
                    <Github size={11} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Sub-Component: Testimonials Slider ───
function TestimonialsCarousel({ testimonials }) {
  const { portfolioData: data } = usePortfolio();

  const [activeIndex, setActiveIndex] = useState(0);
  const current = testimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-4xl mx-auto border mono-border p-8 md:p-12 relative flex flex-col justify-between min-h-[350px]">
      
      {/* Slide Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Quote Mark Decoration */}
          <span className="mono-font-serif text-[7.5rem] leading-none text-neutral-200 dark:text-neutral-800 absolute top-4 left-6 pointer-events-none select-none">
            “
          </span>

          <p className="mono-font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-300 font-light relative z-10 pt-8 pl-4">
            {current.text}
          </p>

          <div className="flex items-center gap-4 border-t mono-border pt-6 pl-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-800">
              <img 
                src={current.avatar} 
                alt={current.name} 
                className="mono-image-gray w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold">{current.name}</h4>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-sans mt-0.5">
                {current.role}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-8 md:mt-4">
        <Magnetic>
          <button type="button"
            onClick={handlePrev}
            className="p-2.5 border mono-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center"
            aria-label="Previous quote"
          >
            <ChevronLeft size={16} />
          </button>
        </Magnetic>
        <Magnetic>
          <button type="button"
            onClick={handleNext}
            className="p-2.5 border mono-border hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center"
            aria-label="Next quote"
          >
            <ChevronRight size={16} />
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
