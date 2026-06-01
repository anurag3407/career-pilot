import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Send,
  Briefcase,
  Code2,
  Layers,
  Cpu,
  Star,
  Quote,
  Zap,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

/* -----------------------------------------
   ANIMATED SVG WAVE DIVIDER
----------------------------------------- */
const WaveDivider = ({ fromColor, toColor, flip = false, animated = false }) => {
  const pathRef = useRef(null);
  const tRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!animated || !pathRef.current) return;
    const tick = (ts) => {
      tRef.current = ts / 1000;
      const t = tRef.current;
      pathRef.current.setAttribute(
        "d",
        `M0,${32 + 14 * Math.sin(t * 0.6)} ` +
          `C200,${10 + 18 * Math.sin(t * 0.5 + 1)} ` +
          `400,${54 + 14 * Math.sin(t * 0.7)} ` +
          `600,${32 + 16 * Math.sin(t * 0.55 + 2)} ` +
          `C800,${10 + 18 * Math.sin(t * 0.45)} ` +
          `1000,${54 + 14 * Math.sin(t * 0.65 + 1)} ` +
          `1200,${32 + 12 * Math.sin(t * 0.5 + 0.5)} ` +
          `C1300,${18 + 16 * Math.sin(t * 0.6)} ` +
          `1380,${46 + 12 * Math.sin(t * 0.5)} ` +
          `1440,${32 + 10 * Math.sin(t * 0.55)} ` +
          `L1440,80 L0,80 Z`
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animated]);

  return (
    <div
      style={{
        lineHeight: 0,
        transform: flip ? "scaleY(-1)" : "none",
        marginBottom: flip ? "-1px" : 0,
        marginTop: flip ? 0 : "-1px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "70px", display: "block" }}
      >
        <defs>
          <linearGradient id={`wg-${fromColor}-${toColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill={toColor}
          d="M0,32 C200,10 400,54 600,32 C800,10 1000,54 1200,32 C1300,18 1380,46 1440,32 L1440,80 L0,80 Z"
        />
      </svg>
    </div>

  );
};

/* -----------------------------------------
   ANIMATED WAVE BACKGROUND (hero bottom)
----------------------------------------- */
const WaveBackground = () => {
  const refs = [useRef(null), useRef(null), useRef(null)];
  const rafRef = useRef(null);

  useEffect(() => {
    const waves = [
      { amp: 22, freq: 0.5, phase: 0, speed: 0.5, alpha: "0.07" },
      { amp: 18, freq: 0.4, phase: 1.2, speed: 0.4, alpha: "0.09" },
      { amp: 14, freq: 0.35, phase: 2.5, speed: 0.3, alpha: "0.11" },
    ];
    const tick = (ts) => {
      const t = ts / 1000;
      refs.forEach((ref, i) => {
        if (!ref.current) return;
        const { amp, freq, phase, speed } = waves[i];
        const pts = Array.from({ length: 9 }, (_, k) => {
          const x = k * 180;
          const y = 60 + amp * Math.sin(t * speed + k * freq + phase);
          return k === 0 ? `M0,${y}` : `C${x - 90},${y + amp} ${x - 90},${y - amp} ${x},${y}`;
        }).join(" ");
        ref.current.setAttribute("d", pts + " L1440,100 L0,100 Z");
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        {refs.map((ref, i) => (
          <path
            key={i}
            ref={ref}
            fill={`rgba(0,${150 + i * 25},${230 + i * 10},${0.07 + i * 0.02})`}
          />
        ))}
      </svg>
    </div>
  );
};

/* -----------------------------------------
   DISTORTION FILTER (SVG feTurbulence)
----------------------------------------- */
const DistortionFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="wave-distort">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.015 0.025"
          numOctaves="3"
          seed="2"
          result="turbulence"
        >
          <animate
            attributeName="baseFrequency"
            dur="8s"
            values="0.015 0.025;0.02 0.03;0.015 0.025"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale="1"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="wave-distort-strong">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02 0.04"
          numOctaves="2"
          seed="5"
          result="turbulence"
        >
          <animate
            attributeName="baseFrequency"
            dur="6s"
            values="0.02 0.04;0.03 0.05;0.02 0.04"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

/* -----------------------------------------
   FLOATING PARTICLES
----------------------------------------- */
const Particles = ({ count = 20 }) => {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 14 + 8,
      delay: Math.random() * 6,
      drift: Math.random() * 40 - 20,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(0,200,255,0.55)",
            boxShadow: "0 0 6px rgba(0,200,255,0.8)",
          }}
          animate={{
            y: [-20, 20, -20],
            x: [0, p.drift, 0],
            opacity: [0.15, 0.75, 0.15],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* -----------------------------------------
   SCROLL-TRIGGERED FADE IN
----------------------------------------- */
const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: {
      opacity: 1, y: 0, x: 0,
      transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* -----------------------------------------
   ANIMATED SKILL BAR
----------------------------------------- */
const SkillBar = ({ skill, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-blue-100">{skill.name}</span>
        <span className="text-xs font-bold text-cyan-400">{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: "linear-gradient(90deg, #0070f3, #00c8ff)",
            boxShadow: "0 0 10px rgba(0,200,255,0.55)",
          }}
        >
          {/* ripple tip */}
          <motion.div
            animate={{ opacity: [1, 0], scale: [1, 2.5] }}
            transition={{ duration: 1, delay: delay + 1.2, ease: "easeOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ background: "rgba(0,200,255,0.7)" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

/* -----------------------------------------
   LIQUID RIPPLE CARD (hover)
----------------------------------------- */
const RippleCard = ({ children, className = "", style = {} }) => {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 800);
  };
  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {children}
      {ripples.map((rp) => (
        <motion.div
          key={rp.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: rp.x,
            top: rp.y,
            x: "-50%",
            y: "-50%",
            background: "rgba(0,200,255,0.18)",
            border: "1px solid rgba(0,200,255,0.35)",
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/* -----------------------------------------
   SECTION HEADING
----------------------------------------- */
const SectionHead = ({ tag, title, accent, subtitle }) => (
  <FadeIn>
    <div className="text-center mb-14">
      <p className="text-xs tracking-[4px] font-semibold uppercase mb-3" style={{ color: "#00c8ff" }}>
        — {tag} —
      </p>
      <h2 className="font-black tracking-tight mb-3" style={{ fontSize: "clamp(30px,4.5vw,50px)", lineHeight: 1.1, letterSpacing: "-1.5px" }}>
        {title} <span style={{ color: "#00c8ff" }}>{accent}</span>
      </h2>
      {subtitle && (
        <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(180,210,255,0.6)", lineHeight: 1.8 }}>{subtitle}</p>
      )}
    </div>
  </FadeIn>
);

/* -----------------------------------------
   PROJECT CARD
----------------------------------------- */
const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={index * 0.08}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(8,18,42,0.85)",
          border: "1px solid rgba(0,200,255,0.14)",
          backdropFilter: "blur(14px)",
          boxShadow: hovered
            ? "0 24px 64px rgba(0,100,255,0.28), 0 0 0 1px rgba(0,200,255,0.28)"
            : "0 4px 28px rgba(0,0,0,0.45)",
          transition: "box-shadow 0.35s ease",
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.09 : 1 }}
            transition={{ duration: 0.55 }}
            style={{ filter: hovered ? "url(#wave-distort)" : "none", transition: "filter 0.4s" }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{ background: hovered ? "rgba(0,18,55,0.55)" : "rgba(0,8,24,0.25)" }}
            transition={{ duration: 0.35 }}
          />
          {/* Hover CTA */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute inset-0 flex items-center justify-center gap-3"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold no-underline px-4 py-2.5 rounded-full"
                  style={{ background: "#00c8ff", color: "#000", boxShadow: "0 0 22px rgba(0,200,255,0.65)" }}
                >
                  <ExternalLink size={12} /> Live
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold no-underline px-4 py-2.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)" }}
                >
                  <Github size={12} /> Code
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-2 text-white">{project.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(190,215,255,0.7)" }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  color: "#00c8ff",
                  background: "rgba(0,200,255,0.09)",
                  border: "1px solid rgba(0,200,255,0.22)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
};

/* -----------------------------------------
   TESTIMONIAL CARD
----------------------------------------- */
const TestimonialCard = ({ t, index }) => (
  <FadeIn delay={index * 0.1}>
    <RippleCard
      className="rounded-2xl p-7 h-full"
      style={{
        background: "rgba(7,14,36,0.9)",
        border: "1px solid rgba(0,200,255,0.11)",
        backdropFilter: "blur(14px)",
        cursor: "default",
      }}
    >
      <div className="absolute top-5 right-6 opacity-10">
        <Quote size={46} color="#00c8ff" />
      </div>
      {/* Wave accent bar */}
      <svg viewBox="0 0 80 8" className="mb-5" style={{ width: 80, height: 8 }}>
        <path d="M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4 C70,0 75,6 80,4" fill="none" stroke="url(#tbGrad)" strokeWidth="2">
          <animate attributeName="d" dur="3s" repeatCount="indefinite"
            values="M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4 C70,0 75,6 80,4;M0,4 C10,8 20,0 30,4 C40,8 50,0 60,4 C70,8 75,2 80,4;M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4 C70,0 75,6 80,4" />
        </path>
        <defs>
          <linearGradient id="tbGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0070f3" />
            <stop offset="100%" stopColor="#00c8ff" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-sm italic leading-relaxed mb-6" style={{ color: "rgba(200,220,255,0.82)" }}>
        "{t.text}"
      </p>
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={t.avatar}
            alt={t.name}
            className="w-11 h-11 rounded-full object-cover"
            style={{ border: "2px solid rgba(0,200,255,0.38)" }}
          />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{t.name}</div>
          <div className="text-xs font-medium" style={{ color: "#00c8ff" }}>{t.role}</div>
        </div>
      </div>
    </RippleCard>
  </FadeIn>
);

/* -----------------------------------------
   CATEGORY ICON MAP
----------------------------------------- */
const CatIcon = ({ cat }) => {
  const map = { Frontend: <Layers size={13} />, Backend: <Cpu size={13} />, DevOps: <Zap size={13} />, Design: <Star size={13} /> };
  return map[cat] || <Code2 size={13} />;
};

/* -----------------------------------------------------------
   MAIN EXPORT
----------------------------------------------------------- */
export default function WaveDistortionPortfolio({ preview = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSkillCat, setActiveSkillCat] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // Mouse-driven distortion on hero image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 24);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 24);
  };

  const skillCats = ["All", ...new Set(data.skills.map((s) => s.category))];
  const filteredSkills =
    activeSkillCat === "All" ? data.skills : data.skills.filter((s) => s.category === activeSkillCat);

  const navLinks = ["About", "Skills", "Projects", "Experience", "Testimonials", "Contact"];
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  
  const BG = "#060b18";
  const BG2 = "#070d1f";
  const CYAN = "#00c8ff";

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: BG,
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <DistortionFilter />


     
      {!preview && (
        <motion.div
          style={{
         
            position: "fixed", top: 0, left: 0, height: "3px", zIndex: 1000,
             background: `linear-gradient(90deg, #0070f3, ${CYAN})`,
             boxShadow: `0 0 12px rgba(0,200,255,0.8)`,
             scaleX: scrollYProgress, transformOrigin: "0%",
       }}
  />
)}

      {/* ---------- NAV ---------- */}
      {!preview && (
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 32px", height: "62px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          background: scrolled ? "rgba(6,11,24,0.88)" : "transparent",
          borderBottom: scrolled ? `1px solid rgba(0,200,255,0.12)` : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-black text-xl"
          style={{ letterSpacing: "-0.5px" }}
        >
          {data.personal.name.split(" ")[0]}
          <span style={{ color: CYAN }}>.</span>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:flex gap-1">
          {navLinks.map((link, i) => (
            <motion.button
              key={link}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => {
                 if (!preview) scrollTo(link);
               }}
              className="text-xs font-medium px-3.5 py-2 rounded-lg border-none cursor-pointer transition-all"
              style={{ background: "none", color: "rgba(200,220,255,0.72)", fontFamily: "inherit" }}
              whileHover={{ color: CYAN, background: "rgba(0,200,255,0.08)" }}
            >
              {link}
            </motion.button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 cursor-pointer"
          style={{ background: "none", border: "none", color: "#fff" }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              style={{
                position: "absolute", top: "62px", left: 0, right: 0,
                background: "rgba(6,11,24,0.97)", backdropFilter: "blur(20px)",
                borderBottom: `1px solid rgba(0,200,255,0.14)`,
                padding: "14px 24px 22px",
              }}
            >
              {navLinks.map((link) => (
                <button
                   key={link}
                   onClick={() => {
                     if (!preview) scrollTo(link);
                    }}
                  className="block w-full text-left cursor-pointer py-3.5 text-base"
                  style={{
                    background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    color: "rgba(200,220,255,0.85)", fontFamily: "inherit",
                  }}
                >
                  {link}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      )}

      {/* ---------- HERO ---------- */}
      <section
        id="hero"
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh", background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,55,130,0.45) 0%, rgba(0,18,55,0.65) 45%, ${BG} 100%)` }}
        onMouseMove={handleMouseMove}
      >
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,200,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.04) 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <Particles count={22} />
        <WaveBackground />

        {/* Content */}
        <motion.div
          style={{ y: heroY, position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px", maxWidth: "920px" }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 180 }}
            className="inline-block mb-8"
          >
            <motion.div
              style={{ rotateX: useTransform(smoothY, [-12, 12], [8, -8]), rotateY: useTransform(smoothX, [-12, 12], [-8, 8]) }}
              className="relative inline-block"
            >
              <div
                className="w-28 h-28 rounded-full p-1 relative"
                style={{
                  border: `2px solid rgba(0,200,255,0.5)`,
                  background: "linear-gradient(135deg,rgba(0,112,243,0.3),rgba(0,200,255,0.3))",
                  boxShadow: "0 0 48px rgba(0,200,255,0.32), 0 0 90px rgba(0,100,255,0.16)",
                }}
              >
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-full h-full rounded-full object-cover"
                  style={{ filter: "url(#wave-distort)" }}
                />
              </div>
              {/* Orbiting ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-full"
                style={{ inset: "-10px", border: "1.5px dashed rgba(0,200,255,0.28)" }}
              />
              {/* Second ring (reverse) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-full"
                style={{ inset: "-20px", border: "1px dashed rgba(0,150,255,0.15)" }}
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-semibold uppercase tracking-[4px] mb-4"
            style={{ color: CYAN }}
          >
            -- Available for hire --
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8 }}
            className="font-black leading-none mb-5"
            style={{ fontSize: "clamp(44px,7.5vw,94px)", letterSpacing: "-3px" }}
          >
            <span style={{ color: "#fff" }}>{data.personal.name.split(" ")[0]} </span>
            <motion.span
              style={{
                background: `linear-gradient(135deg, #0070f3, ${CYAN}, #0070f3)`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {data.personal.name.split(" ").slice(1).join(" ")}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-3"
            style={{ fontSize: "clamp(15px,2.2vw,20px)", color: "rgba(180,210,255,0.8)" }}
          >
            {data.personal.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center gap-1.5 text-sm mb-10"
            style={{ color: "rgba(140,180,220,0.62)" }}
          >
            <MapPin size={13} color={CYAN} /> {data.personal.location}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 }}
            className="flex justify-center flex-wrap mb-12"
            style={{ gap: "clamp(28px,5vw,72px)" }}
          >
            {[
              { val: `${data.stats.yearsExperience}+`, label: "Years Experience" },
              { val: `${data.stats.projectsCompleted}+`, label: "Projects Completed" },
              { val: `${data.stats.happyClients}+`, label: "Happy Clients" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="font-black" style={{ fontSize: "clamp(28px,4vw,42px)", color: CYAN, letterSpacing: "-1px" }}>
                  {val}
                </div>
                <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(180,210,255,0.5)" }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82 }}
            className="flex gap-4 justify-center flex-wrap mb-10"
          >
            <motion.button
              onClick={() => { if (!preview) scrollTo("Projects"); }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(0,200,255,0.52)" }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-full text-sm font-bold cursor-pointer border-none"
              style={{ background: `linear-gradient(135deg,#0070f3,${CYAN})`, color: "#fff", fontFamily: "inherit" }}
            >
              View Projects
            </motion.button>
            <motion.button
              onClick={() => { if (!preview) scrollTo("Contact"); }}
              whileHover={{ scale: 1.05, background: "rgba(0,200,255,0.14)" }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 rounded-full text-sm font-bold cursor-pointer"
              style={{
                background: "rgba(0,200,255,0.07)",
                color: CYAN,
                border: `1px solid rgba(0,200,255,0.36)`,
                backdropFilter: "blur(8px)",
                fontFamily: "inherit",
              }}
            >
              Get in Touch
            </motion.button>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-3 justify-center"
          >
            {[
             { Icon: Github, href: data.socials.github },
             {Icon: Linkedin, href: data.socials.linkedin },
             { Icon: Twitter, href: data.socials.twitter },
             { Icon: Mail, href: `mailto:${data.socials.email}` },
            ].map(({ Icon, href }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: CYAN, borderColor: CYAN }}
                className="w-10 h-10 rounded-full flex items-center justify-center no-underline"
                style={{
                  color: "rgba(180,210,255,0.48)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          onClick={() => { if (!preview) scrollTo("About"); }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10"
          style={{ color: "rgba(0,200,255,0.45)" }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" style={{ background: BG, position: "relative", paddingTop: 0 }}>
        <WaveDivider fromColor={BG} toColor={BG} animated flip />
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionHead tag="About Me" title="The Story" accent="Behind the Code" />
          <div className="grid gap-16 items-center" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
            <FadeIn direction="right">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg,rgba(0,112,243,0.22),rgba(0,200,255,0.1))",
                    filter: "blur(22px)",
                    transform: "scale(0.95)",
                  }}
                />
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(0,200,255,0.22)", boxShadow: "0 28px 80px rgba(0,0,0,0.55)" }}
                >
                  <img
                    src={data.personal.avatar}
                    alt={data.personal.name}
                    className="w-full object-cover block"
                    style={{ aspectRatio: "1", filter: "url(#wave-distort)" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    style={{ background: "linear-gradient(0deg,rgba(6,11,24,0.96),transparent)" }}
                  >
                    <div className="font-bold text-white text-base">{data.personal.name}</div>
                    <div className="text-xs mt-1" style={{ color: CYAN }}>{data.personal.title}</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <div>
                <p className="text-sm leading-loose mb-6" style={{ color: "rgba(200,220,255,0.8)" }}>
                  {data.personal.bio}
                </p>
                <blockquote
                  className="pl-5 mb-8 text-sm italic"
                  style={{
                    borderLeft: `3px solid ${CYAN}`,
                    color: "rgba(180,220,255,0.58)",
                  }}
                >
                  "{data.personal.tagline}"
                </blockquote>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { icon: <MapPin size={13} />, text: data.personal.location },
                    { icon: <Mail size={13} />, text: data.socials.email },
                    { icon: <Briefcase size={13} />, text: "Open to opportunities" },
                  ].map(({ icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
                      style={{
                        background: "rgba(0,200,255,0.07)",
                        border: "1px solid rgba(0,200,255,0.16)",
                        color: "rgba(200,220,255,0.8)",
                      }}
                    >
                      <span style={{ color: CYAN }}>{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---------- SKILLS ---------- */}
      <section id="skills" style={{ background: BG2, position: "relative" }}>
        <WaveDivider fromColor={BG} toColor={BG2} animated />
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionHead tag="Expertise" title="Skills &" accent="Technologies" />

          {/* Category filter */}
          <div className="flex gap-2.5 justify-center flex-wrap mb-10">
            {skillCats.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveSkillCat(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all"
                style={{
                  border: "1px solid",
                  borderColor: activeSkillCat === cat ? CYAN : "rgba(0,200,255,0.22)",
                  background: activeSkillCat === cat ? "rgba(0,200,255,0.16)" : "transparent",
                  color: activeSkillCat === cat ? CYAN : "rgba(180,210,255,0.62)",
                  fontFamily: "inherit",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))" }}>
            <AnimatePresence mode="wait">
              {filteredSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-5 py-4 rounded-xl"
                  style={{ background: "rgba(8,16,40,0.72)", border: "1px solid rgba(0,200,255,0.1)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ color: CYAN }}><CatIcon cat={skill.category} /></span>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(0,200,255,0.7)" }}>
                      {skill.category}
                    </span>
                  </div>
                  <SkillBar skill={skill} delay={i * 0.05} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <WaveDivider fromColor={BG2} toColor={BG2} flip animated />
      </section>

      {/* ---------- PROJECTS ---------- */}
      <section id="projects" style={{ background: BG, paddingTop: 0 }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <SectionHead tag="Portfolio" title="Featured" accent="Projects" />
          <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
            {data.projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EXPERIENCE ---------- */}
      <section id="experience" style={{ background: BG2 }}>
        <WaveDivider fromColor={BG} toColor={BG2} animated />
        <div className="max-w-3xl mx-auto px-6 py-20">
          <SectionHead tag="Career" title="Work" accent="Experience" />
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: "clamp(22px,4vw,30px)",
                width: "1px",
                background: `linear-gradient(180deg,transparent,rgba(0,200,255,0.42) 12%,rgba(0,200,255,0.42) 88%,transparent)`,
              }}
            />
            {data.experience.map((exp, i) => (
              <FadeIn key={exp.company} delay={i * 0.1} direction="right">
                <div className="flex gap-7 mb-12 relative" style={{ gap: "clamp(20px,5vw,48px)" }}>
                  {/* Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 220 }}
                    className="rounded-full flex items-center justify-center font-black flex-shrink-0"
                    style={{
                      width: "clamp(44px,6vw,58px)",
                      height: "clamp(44px,6vw,58px)",
                      background: `linear-gradient(135deg,#0070f3,${CYAN})`,
                      fontSize: "clamp(11px,1.3vw,13px)",
                      color: "#000",
                      boxShadow: "0 0 26px rgba(0,200,255,0.42)",
                      border: "2px solid rgba(0,200,255,0.28)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.div>

                  {/* Card */}
                  <RippleCard
                    className="flex-1 p-6 rounded-2xl"
                    style={{
                      background: "rgba(8,16,40,0.82)",
                      border: "1px solid rgba(0,200,255,0.12)",
                      backdropFilter: "blur(12px)",
                      cursor: "default",
                    }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white mb-0.5">{exp.role}</h3>
                        <span className="text-sm font-semibold" style={{ color: CYAN }}>{exp.company}</span>
                      </div>
                      <span
                        className="text-xs px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          color: "rgba(0,200,255,0.75)",
                          background: "rgba(0,200,255,0.08)",
                          border: "1px solid rgba(0,200,255,0.2)",
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(180,210,255,0.7)" }}>
                      {exp.description}
                    </p>
                  </RippleCard>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <WaveDivider fromColor={BG2} toColor={BG2} flip animated />
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section id="testimonials" style={{ background: BG, paddingTop: 0 }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <SectionHead tag="Kind Words" title="What People" accent="Say" />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
            {data.testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" style={{ background: BG2, position: "relative", overflow: "hidden" }}>
        <WaveDivider fromColor={BG} toColor={BG2} animated />
        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,112,243,0.14),transparent 70%)", top: "-60px", left: "5%" }} />
        <div className="absolute pointer-events-none" style={{ width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,200,255,0.1),transparent 70%)", bottom: "10%", right: "3%" }} />

        <div className="max-w-2xl mx-auto px-6 py-20 pb-8 relative z-10">
          <SectionHead
            tag="Let's Talk"
            title="Start a"
            accent="Conversation"
            subtitle="Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together."
          />

          <FadeIn delay={0.15}>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(7,14,38,0.88)",
                border: "1px solid rgba(0,200,255,0.16)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                    { ph: "Your Name", type: "text" },
                    { ph: "Your Email", type: "email" },
                  ].map(({ ph, type }) => (
                  <input
                    key={ph}
                    type={type}
                    aria-label={ph}
                    placeholder={ph}
                    className="rounded-xl px-4 py-3.5 text-sm text-white outline-none col-span-1"
                    style={{
                      background: "rgba(0,200,255,0.05)",
                      border: "1px solid rgba(0,200,255,0.16)",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.16)")}
                  />
                ))}
              </div>
              <input
                aria-label="Subject" placeholder="Subject"
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none mb-4 block"
                style={{ background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.16)", fontFamily: "inherit" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.16)")}
              />
              <textarea
                aria-label="Your message" placeholder="Your message…"
                rows={5}
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none mb-5 block resize-y"
                style={{ background: "rgba(0,200,255,0.05)", border: "1px solid rgba(0,200,255,0.16)", fontFamily: "inherit" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,200,255,0.16)")}
              />
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 44px rgba(0,200,255,0.42)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl text-base font-bold cursor-pointer flex items-center justify-center gap-2.5 border-none"
                style={{ background: `linear-gradient(135deg,#0070f3,${CYAN})`, color: "#fff", fontFamily: "inherit" }}
              >
                <Send size={17} /> Send Message
              </motion.button>
            </div>
          </FadeIn>

          {/* Social row */}
          <FadeIn delay={0.3}>
            <div className="flex justify-center gap-4 mt-12 flex-wrap">
              {[
                { Icon: Github, label: "GitHub", href: data.socials.github },
                { Icon: Linkedin, label: "LinkedIn", href: data.socials.linkedin },
                { Icon: Twitter, label: "Twitter", href: data.socials.twitter },
                { Icon: Mail, label: data.socials.email, href: `mailto:${data.socials.email}` },
              ].map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, color: CYAN }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium no-underline"
                  style={{
                    color: "rgba(180,210,255,0.52)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    transition: "color 0.2s",
                  }}
                >
                  <Icon size={15} /> {label}
                </motion.a>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Footer */}
        <div
          className="text-center py-5 px-8 relative overflow-hidden"
          style={{ borderTop: "1px solid rgba(0,200,255,0.08)" }}
        >
          {/* Animated wave footer accent */}
          <svg
            viewBox="0 0 1440 20"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 w-full opacity-25"
            style={{ height: "20px" }}
          >
            <path d="M0,10 C240,0 480,20 720,10 C960,0 1200,20 1440,10 L1440,0 L0,0 Z" fill={CYAN} />
          </svg>
          <p className="text-xs" style={{ color: "rgba(140,180,220,0.4)" }}>
            © {new Date().getFullYear()} {data.personal.name} · Built with React &amp; Framer Motion · Wave Distortion Theme
          </p>
        </div>
      </section>

      {/* Global styles */}
      <style>{`
        @media(max-width:640px){
          .grid-cols-2{grid-template-columns:1fr!important}
        }
        input::placeholder,textarea::placeholder{color:rgba(140,180,220,0.38)}
        *{-webkit-font-smoothing:antialiased}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#060b18}
        ::-webkit-scrollbar-thumb{background:rgba(0,200,255,0.32);border-radius:3px}
      `}</style>
    </div>
  );
}
