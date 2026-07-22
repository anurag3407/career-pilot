import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import {
  Mic, MapPin, Mail, Linkedin, Github, Twitter, ExternalLink,
  Smile, Ticket, SmilePlus, Menu, X, Volume2
} from "lucide-react";

// ── Global CSS Injection for the Comedy Theme ──
const GLOBAL_THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Oswald:wght@500;700&family=Courier+Prime&family=Outfit:wght@300;400;600;700&display=swap');

  .font-handwritten { font-family: 'Caveat', cursive; }
  .font-heading { font-family: 'Oswald', sans-serif; }
  .font-typewriter { font-family: 'Courier Prime', monospace; }
  .font-body { font-family: 'Outfit', sans-serif; }

  /* Custom Neon Glows */
  .neon-text-red {
    color: #ff3b30;
    text-shadow: 
      0 0 4px rgba(255, 59, 48, 0.4), 
      0 0 10px rgba(255, 59, 48, 0.7), 
      0 0 18px rgba(255, 59, 48, 0.9);
  }
  .neon-text-orange {
    color: #ff9500;
    text-shadow: 
      0 0 4px rgba(255, 149, 0, 0.4), 
      0 0 10px rgba(255, 149, 0, 0.7), 
      0 0 18px rgba(255, 149, 0, 0.9);
  }
  .neon-text-yellow {
    color: #ffcc00;
    text-shadow: 
      0 0 4px rgba(255, 204, 0, 0.4), 
      0 0 8px rgba(255, 204, 0, 0.7), 
      0 0 15px rgba(255, 204, 0, 0.9);
  }

  .neon-border-red {
    border-color: #ff3b30;
    box-shadow: 
      0 0 6px rgba(255, 59, 48, 0.3), 
      0 0 12px rgba(255, 59, 48, 0.5), 
      inset 0 0 6px rgba(255, 59, 48, 0.3);
  }
  .neon-border-orange {
    border-color: #ff9500;
    box-shadow: 
      0 0 6px rgba(255, 149, 0, 0.3), 
      0 0 12px rgba(255, 149, 0, 0.5), 
      inset 0 0 6px rgba(255, 149, 0, 0.3);
  }
  .neon-border-yellow {
    border-color: #ffcc00;
    box-shadow: 
      0 0 6px rgba(255, 204, 0, 0.3), 
      0 0 12px rgba(255, 204, 0, 0.5), 
      inset 0 0 6px rgba(255, 204, 0, 0.3);
  }

  /* Repeatable Brick Wall CSS */
  .comedy-wall {
    background-color: #0c0806;
    background-image:
      repeating-linear-gradient(
        180deg,
        transparent 0px, transparent 28px,
        rgba(0, 0, 0, 0.9) 28px, rgba(0, 0, 0, 0.9) 32px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 58px,
        rgba(0, 0, 0, 0.8) 58px, rgba(0, 0, 0, 0.8) 62px
      );
    background-size: 124px 64px;
    position: relative;
  }

  .comedy-wall::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent 0px, transparent 58px,
        rgba(0, 0, 0, 0.8) 58px, rgba(0, 0, 0, 0.8) 62px
      );
    background-size: 124px 64px;
    background-position: 62px 32px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.95;
  }

  /* Neon Flicker Keyframes */
  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 1;
      filter: drop-shadow(0 0 2px currentColor) drop-shadow(0 0 8px currentColor);
    }
    20%, 24%, 55% {
      opacity: 0.35;
      filter: none;
    }
  }

  .animate-neon-flicker {
    animation: neonFlicker 4s infinite alternate;
  }

  /* Marquee lights glowing */
  @keyframes marqueeGlow {
    0%, 100% {
      opacity: 0.35;
      box-shadow: 0 0 2px #ffcc00;
      background-color: #d97706;
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 10px #ffcc00, 0 0 15px #f59e0b;
      background-color: #fbbf24;
    }
  }

  .marquee-bulb-odd {
    animation: marqueeGlow 1.2s infinite;
  }
  .marquee-bulb-even {
    animation: marqueeGlow 1.2s infinite 0.6s;
  }
`;

// ── Left Curtain SVG Overlay ──
function LeftCurtain() {
  return (
    <svg 
      className="fixed top-0 left-0 h-full w-[8vw] min-w-[50px] max-w-[140px] z-40 pointer-events-none drop-shadow-[8px_0_15px_rgba(0,0,0,0.7)]" 
      viewBox="0 0 100 1000" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curtain-grad-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e0000" />
          <stop offset="20%" stopColor="#4a0000" />
          <stop offset="45%" stopColor="#7a0000" />
          <stop offset="70%" stopColor="#300000" />
          <stop offset="85%" stopColor="#a30000" />
          <stop offset="100%" stopColor="#150000" />
        </linearGradient>
      </defs>
      {/* Curtain drapes folds */}
      <path d="M 0 0 C 30 0, 35 150, 30 300 C 25 450, 40 600, 35 750 C 30 900, 35 1000, 25 1000 L 0 1000 Z" fill="url(#curtain-grad-left)" />
      <path d="M 0 0 C 55 0, 60 200, 50 400 C 40 600, 65 800, 55 1000 L 0 1000 Z" fill="url(#curtain-grad-left)" opacity="0.85" />
      <path d="M 0 0 C 75 0, 80 250, 70 500 C 60 750, 85 900, 75 1000 L 0 1000 Z" fill="url(#curtain-grad-left)" opacity="0.6" />
      {/* Top corner valance overlay */}
      <path d="M 0 0 Q 50 15, 100 0 L 100 30 Q 50 60, 0 40 Z" fill="url(#curtain-grad-left)" />
    </svg>
  );
}

// ── Right Curtain SVG Overlay ──
function RightCurtain() {
  return (
    <svg 
      className="fixed top-0 right-0 h-full w-[8vw] min-w-[50px] max-w-[140px] z-40 pointer-events-none drop-shadow-[-8px_0_15px_rgba(0,0,0,0.7)]" 
      viewBox="0 0 100 1000" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curtain-grad-right" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#1e0000" />
          <stop offset="20%" stopColor="#4a0000" />
          <stop offset="45%" stopColor="#7a0000" />
          <stop offset="70%" stopColor="#300000" />
          <stop offset="85%" stopColor="#a30000" />
          <stop offset="100%" stopColor="#150000" />
        </linearGradient>
      </defs>
      {/* Curtain drapes folds */}
      <path d="M 100 0 C 70 0, 65 150, 70 300 C 75 450, 60 600, 65 750 C 70 900, 65 1000, 75 1000 L 100 1000 Z" fill="url(#curtain-grad-right)" />
      <path d="M 100 0 C 45 0, 40 200, 50 400 C 60 600, 35 800, 45 1000 L 100 1000 Z" fill="url(#curtain-grad-right)" opacity="0.85" />
      <path d="M 100 0 C 25 0, 20 250, 30 500 C 40 750, 15 900, 25 1000 L 100 1000 Z" fill="url(#curtain-grad-right)" opacity="0.6" />
      {/* Top corner valance overlay */}
      <path d="M 100 0 Q 50 15, 0 0 L 0 30 Q 50 60, 100 40 Z" fill="url(#curtain-grad-right)" />
    </svg>
  );
}

// ── Retro Stage Microphone SVG Illustration ──
function VintageMicrophone({ className = "" }) {
  return (
    <svg 
      className={`${className} text-zinc-300`} 
      viewBox="0 0 100 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chrome-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="25%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#f3f4f6" />
          <stop offset="75%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="inner-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
      </defs>

      {/* Main outer metal grill shell */}
      <rect x="25" y="10" width="50" height="85" rx="25" fill="url(#chrome-grad)" stroke="#111" strokeWidth="2.5" />
      
      {/* Inner acoustic wind foam (Dark contrast backer) */}
      <rect x="30" y="16" width="40" height="73" rx="20" fill="url(#inner-shadow)" />

      {/* Vertical inner grill bars */}
      <rect x="47.5" y="11" width="5" height="83" fill="#ffffff" opacity="0.9" />
      <rect x="38" y="15" width="4" height="75" fill="#d1d5db" opacity="0.8" />
      <rect x="58" y="15" width="4" height="75" fill="#9ca3af" opacity="0.8" />
      <rect x="32" y="22" width="3" height="61" fill="#9ca3af" opacity="0.6" />
      <rect x="65" y="22" width="3" height="61" fill="#4b5563" opacity="0.6" />

      {/* Horizontal horizontal divider bands */}
      <rect x="25" y="26" width="50" height="3" fill="#1f2937" />
      <rect x="25" y="40" width="50" height="3" fill="#1f2937" />
      <rect x="25" y="54" width="50" height="3" fill="#1f2937" />
      <rect x="25" y="68" width="50" height="3" fill="#1f2937" />
      <rect x="25" y="82" width="50" height="3" fill="#1f2937" />

      {/* Outer chrome decorative trim horizontal band */}
      <rect x="24" y="50" width="52" height="6" fill="url(#chrome-grad)" stroke="#111" strokeWidth="1.5" rx="2" />

      {/* Mechanical joint mounting base */}
      <path d="M 38 95 L 62 95 L 56 125 L 44 125 Z" fill="url(#chrome-grad)" stroke="#111" strokeWidth="2" />
      <circle cx="50" cy="110" r="5.5" fill="#1f2937" stroke="#111" strokeWidth="1.5" />
      <path d="M 47 110 L 53 110" stroke="#f3f4f6" strokeWidth="1.5" />

      {/* Mic stand chrome pole extending to the floor */}
      <rect x="47" y="125" width="6" height="175" fill="url(#chrome-grad)" stroke="#111" strokeWidth="1" />
    </svg>
  );
}

// ── About Me Card Marquee light bulb framing ──
function MarqueeFrame({ children }) {
  return (
    <div className="relative p-6 border-4 border-amber-600/30 rounded-2xl bg-zinc-900/90 shadow-[0_0_40px_rgba(0,0,0,0.85)] border-double">
      {/* Lightbulbs along borders */}
      {/* Top Border bulbs */}
      <div className="absolute top-1 left-0 right-0 flex justify-around px-5">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`bulb-t-${i}`} 
            className={`w-2.5 h-2.5 rounded-full border border-amber-700/60 ${i % 2 === 0 ? 'marquee-bulb-odd' : 'marquee-bulb-even'}`} 
          />
        ))}
      </div>
      {/* Bottom Border bulbs */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-around px-5">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`bulb-b-${i}`} 
            className={`w-2.5 h-2.5 rounded-full border border-amber-700/60 ${i % 2 === 0 ? 'marquee-bulb-even' : 'marquee-bulb-odd'}`} 
          />
        ))}
      </div>
      {/* Left Border bulbs */}
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-5">
        {[...Array(6)].map((_, i) => (
          <div 
            key={`bulb-l-${i}`} 
            className={`w-2.5 h-2.5 rounded-full border border-amber-700/60 ${i % 2 === 0 ? 'marquee-bulb-odd' : 'marquee-bulb-even'}`} 
          />
        ))}
      </div>
      {/* Right Border bulbs */}
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-5">
        {[...Array(6)].map((_, i) => (
          <div 
            key={`bulb-r-${i}`} 
            className={`w-2.5 h-2.5 rounded-full border border-amber-700/60 ${i % 2 === 0 ? 'marquee-bulb-even' : 'marquee-bulb-odd'}`} 
          />
        ))}
      </div>

      <div className="py-2">
        {children}
      </div>
    </div>
  );
}

// ── Main Portfolio Component ──
export default function StandUpComedyBrickWallMic() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData;

  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic tracking of scroll sections for navigation active states
  const sections = ["home", "about", "skills", "projects", "experience", "testimonials", "contact"];
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Safe external URL handler
  const handleLinkClick = (url) => {
    if (!url || url === "#") return;
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Safe fallback statistics resolving
  const personalName = data.personal?.name || "Alex Rivera";
  const personalTitle = data.personal?.title || "Full Stack Developer";
  const personalBio = data.personal?.bio || "I build fast, scalable and impactful web applications that solve real problems.";
  const personalTagline = data.personal?.tagline || "I TURN IDEAS INTO STANDOUT EXPERIENCES";
  const personalLocation = data.personal?.location || "Bengaluru, India";
  const personalAvatar = data.personal?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";

  const statYears = data.stats?.yearsExperience || "5+";
  const statProjects = data.stats?.projectsCompleted || "120+";
  const statSatisfaction = (data.stats?.happyClients !== undefined && data.stats?.happyClients !== null) ? `${data.stats.happyClients}%` : "98%";
  const statRate = data.stats?.hourlyRate || "$50/hr";

  const skills = data.skills || [];
  const projects = data.projects || [];
  const experiences = data.experience || [];
  const testimonials = data.testimonials || [];

  return (
    <div className="comedy-wall text-zinc-100 min-h-screen relative font-body">
      {/* CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_THEME_CSS }} />

      {/* Frame overlays: Red side curtains */}
      <LeftCurtain />
      <RightCurtain />

      {/* Vignette Shadowing to dim page edges and corners */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(0,0,0,0.85)_95%)] pointer-events-none z-10" />

      {/* Stage spotlight glow positioned over hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[700px] h-[550px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.35)_0%,rgba(239,68,68,0.12)_45%,transparent_75%)] pointer-events-none z-0" />

      {/* Content wrapper with side padding matching curtains boundary */}
      <div className="relative z-20 px-[9vw] md:px-[10vw]">

        {/* ── STICKY NAVIGATION HEADER ── */}
        <header className="sticky top-0 z-50 py-4 backdrop-blur-md bg-[#0c0806]/85 border-b border-orange-950/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* HAHA logo */}
            <div 
              onClick={() => handleNavClick("home")}
              className="cursor-pointer border-2 border-red-500 rounded-lg px-2.5 py-1 text-center font-heading font-black text-lg select-none leading-none tracking-tight animate-neon-flicker flex flex-col justify-center text-red-500 hover:scale-105 transition-transform"
              style={{ boxShadow: "0 0 12px rgba(239,68,68,0.6)" }}
            >
              <span>HAHA.</span>
              <span className="text-[10px] tracking-widest border-t border-red-500 mt-0.5 pt-0.5 font-sans font-bold text-red-400">- I CODE -</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 bg-black/40 px-6 py-2.5 rounded-full border border-orange-950/30">
              {sections.map((sect) => (
                <button type="button"
                  key={sect}
                  onClick={() => handleNavClick(sect)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeSection === sect 
                      ? "text-red-500 font-bold scale-105 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" 
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {sect}
                </button>
              ))}
            </nav>

            {/* Right Booking CTA */}
            <div className="flex items-center gap-3">
              <button type="button" 
                onClick={() => handleNavClick("contact")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-red-500 border border-red-500/80 rounded-md px-4 py-2 hover:bg-red-500 hover:text-white transition-all select-none uppercase hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]"
              >
                Book Me ↗
              </button>

              {/* Hamburger Mobile Menu toggle */}
              <button type="button" 
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-zinc-950/95 border-t border-orange-950/40 overflow-hidden mt-3 rounded-lg"
              >
                <div className="py-4 px-6 flex flex-col gap-4 font-heading">
                  {sections.map((sect) => (
                    <button type="button"
                      key={sect}
                      onClick={() => handleNavClick(sect)}
                      className={`text-left text-lg tracking-widest uppercase transition-colors ${
                        activeSection === sect ? "text-red-500 font-bold" : "text-zinc-400"
                      }`}
                    >
                      {sect}
                    </button>
                  ))}
                  <button type="button" 
                    onClick={() => handleNavClick("contact")}
                    className="w-full text-center py-2.5 mt-2 bg-red-500 text-white font-bold rounded-lg uppercase text-sm tracking-wider"
                  >
                    Book Me ↗
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── HERO SECTION ── */}
        <section id="home" className="min-h-[85vh] flex flex-col justify-center pt-8 pb-12 relative">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-handwritten text-2xl text-amber-500 tracking-wide mb-2"
              >
                Hey there! I'm
              </motion.span>

              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-4 text-zinc-100"
              >
                {(() => {
                  const parts = personalTagline.split(/(standout)/i);
                  return parts.map((part, i) => 
                    /standout/i.test(part) ? (
                      <span key={i} className="neon-text-red block sm:inline">{part}</span>
                    ) : (
                      part
                    )
                  );
                })()}
              </motion.h1>

              {/* Developer Title Tag/Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-6 bg-amber-500 text-black px-4 py-1.5 font-heading text-lg font-black tracking-wider uppercase inline-block rounded-sm transform -rotate-1 select-none shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
              >
                {personalTitle}
              </motion.div>

              {/* Cursive Bio Introduction */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg"
              >
                {personalBio}
              </motion.p>

              {/* Hero Call to Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                {/* View My Set button */}
                <button type="button" 
                  onClick={() => handleNavClick("projects")}
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-red-500 border border-red-500 rounded-lg px-6 py-3 select-none uppercase hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.35)] hover:shadow-[0_0_20px_rgba(239,68,68,0.75)] hover:scale-[1.02]"
                >
                  <Mic size={16} />
                  View My Set
                </button>
                {/* Get In Touch button */}
                <button type="button" 
                  onClick={() => handleNavClick("contact")}
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-zinc-300 border border-zinc-700 rounded-lg px-6 py-3 hover:border-amber-500 hover:text-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all select-none uppercase hover:scale-[1.02]"
                >
                  <Smile size={16} />
                  Get In Touch
                </button>
              </motion.div>
            </div>

            {/* Hero Right Microphone and Neon signs Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] md:min-h-[480px]">
              
              {/* Neon Red Speech Bubble Sign */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                className="absolute top-8 left-0 md:left-4 z-20 bg-black/60 border-2 border-red-500 rounded-2xl px-4 py-2 text-center text-red-500 text-[11px] font-heading font-black tracking-wider uppercase animate-neon-flicker pointer-events-none select-none shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              >
                <span>Code.</span><br />
                <span>Commit.</span><br />
                <span>Conquer.</span>
                <div className="absolute bottom-[-10px] right-[25px] w-0 h-0 border-t-[10px] border-t-red-500 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent" />
              </motion.div>

              {/* Neon Orange Smiley face icon */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                className="absolute bottom-12 right-6 md:right-16 z-20 text-amber-500 animate-neon-flicker flex items-center justify-center p-2 rounded-full border-2 border-amber-500 bg-black/65 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
              >
                <SmilePlus size={28} />
              </motion.div>

              {/* Shadow Layer of the Microphone on the brick wall */}
              <motion.div 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 0.7, x: -40 }}
                transition={{ duration: 0.8 }}
                className="absolute w-[240px] h-[400px] pointer-events-none z-0 transform translate-y-8 select-none filter blur-[12px] brightness-0 scale-95"
              >
                <VintageMicrophone className="text-black" />
              </motion.div>

              {/* Realistic Spotlight Illuminated Background circle behind microphone */}
              <div className="absolute w-[280px] h-[280px] rounded-full bg-amber-500/10 border border-amber-500/5 filter blur-2xl z-0" />

              {/* Foreground Vintage Microphone */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-[240px] h-[400px] z-10 select-none cursor-pointer group"
              >
                <VintageMicrophone className="group-hover:scale-105 transition-transform duration-300" />
              </motion.div>
            </div>

          </div>
        </section>

        {/* ── STATISTICS SECTION ── */}
        <section className="py-6 border-t border-b border-orange-950/20 bg-black/35 rounded-xl max-w-7xl mx-auto my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 items-center">
            
            {/* Stat item 1 */}
            <div className="flex items-center gap-3 justify-center">
              <div className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                <Smile size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-heading font-black text-white">{statYears}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Years Experience</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.5)]" />

            {/* Stat item 2 */}
            <div className="flex items-center gap-3 justify-center">
              <div className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                <Ticket size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-heading font-black text-white">{statProjects}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Projects Completed</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.5)]" />

            {/* Stat item 3 */}
            <div className="flex items-center gap-3 justify-center">
              <div className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                <SmilePlus size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-heading font-black text-white">{statSatisfaction}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Audience Happy</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.5)]" />

            {/* Stat item 4 */}
            <div className="flex items-center gap-3 justify-center">
              <div className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                <Mic size={24} />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl font-heading font-black text-white">{statRate}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Starting Rate</div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3-COLUMN ABOUT / SKILLS / PROJECTS BOARD ── */}
        <section className="py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            
            {/* Column 1: About Me (Marquee Light Frame) */}
            <div id="about" className="flex flex-col gap-6">
              <MarqueeFrame>
                <div className="text-center mb-4">
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5">
                    ★ ABOUT ME ★
                  </h2>
                </div>
                {/* Typewriter bios text container */}
                <div className="font-typewriter text-xs md:text-sm text-zinc-300 leading-relaxed p-4 bg-black/50 border border-zinc-800 rounded-lg max-h-[220px] overflow-y-auto min-h-[160px]">
                  {personalBio}
                </div>
              </MarqueeFrame>

              {/* Tilted Polaroid photo container and masking tape */}
              <div className="relative self-center mt-6 w-[230px]">
                {/* Masking tape on top */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-100/40 border border-yellow-200/20 backdrop-blur-sm z-10 transform -rotate-2" />
                
                {/* Polaroid frame */}
                <div className="bg-zinc-100 p-3 pb-8 rounded shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-zinc-200/50">
                  <img 
                    src={personalAvatar} 
                    alt={personalName} 
                    className="w-full h-[180px] object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="mt-3 text-center font-handwritten text-xl font-bold text-zinc-800 tracking-tight">
                    {personalName}
                  </div>
                </div>

                {/* Yellow sticky note at the bottom overlapping the polaroid */}
                <div className="absolute bottom-[-45px] left-[-35px] w-[140px] h-[130px] bg-yellow-200/90 text-zinc-800 p-3 shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-200 flex flex-col justify-between border-l-2 border-yellow-300">
                  <div className="font-handwritten text-sm leading-tight font-bold">
                    Serious code.<br />
                    Silly jokes.<br />
                    Great results. 🙂
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 text-right font-sans">
                    Dressing Room
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Performance Skills (Progress Bars) */}
            <div id="skills" className="flex flex-col gap-4 bg-zinc-950/60 p-6 rounded-2xl border border-orange-950/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h2 className="font-heading text-3xl font-black uppercase tracking-wider text-red-500 mb-4 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] text-left border-b border-orange-950/40 pb-2">
                TOP SKILLS
              </h2>

              <div className="flex flex-col gap-5">
                {skills.slice(0, 7).map((skill, index) => {
                  const skillLevel = (skill.level !== undefined && skill.level !== null) ? skill.level : 75;
                  return (
                    <div key={skill.name || index} className="text-left">
                      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-amber-500">{skillLevel}%</span>
                      </div>
                      
                      {/* Slotted Progress Bar */}
                      <div className="w-full h-3.5 bg-black rounded-full p-0.5 border border-zinc-800/80 overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skillLevel}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-amber-600 to-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Set List Overview Board */}
            <div className="flex flex-col gap-4 bg-zinc-950/60 p-6 rounded-2xl border border-orange-950/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h2 className="font-heading text-3xl font-black uppercase tracking-wider text-amber-500 mb-4 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] text-left border-b border-orange-950/40 pb-2">
                SET LIST (PROJECTS)
              </h2>

              <div className="flex flex-col gap-4">
                {projects.slice(0, 5).map((project, index) => (
                  <div 
                    key={project.title || index}
                    onClick={() => handleNavClick("projects")}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-black/40 border border-zinc-900/60 hover:border-red-500/50 hover:bg-black/80 transition-all cursor-pointer group text-left"
                  >
                    <div className="mt-0.5 text-zinc-500 group-hover:text-red-500 transition-colors">
                      <Mic size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {Array.isArray(project.techStack) ? project.techStack.join(" | ") : "Software Set"}
                      </p>
                    </div>
                  </div>
                ))}

                {/* AND MORE text sign */}
                <div className="text-center py-2.5 mt-2 animate-pulse border-2 border-dashed border-red-500/20 rounded-xl">
                  <span className="font-heading font-black text-xl text-red-500 uppercase tracking-widest drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]">
                    ... AND MORE!
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── DETAILED PROJECTS PERFORMANCE (COMEDY SCHEDULE) ── */}
        <section id="projects" className="py-16 max-w-7xl mx-auto border-t border-orange-950/20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-wider text-red-500 inline-block mb-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
              SHOW TIME (PROJECTS)
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Browse the developer set-list and select projects to check details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {projects.map((project, index) => (
              <motion.div
                key={project.title || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="flex flex-col bg-zinc-950/70 border border-zinc-900 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300"
              >
                {/* Project Image */}
                <div className="h-[180px] overflow-hidden relative group">
                  <img 
                    src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0 group-hover:brightness-95"
                  />
                  {/* Technology labels tags */}
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    {Array.isArray(project.techStack) && project.techStack.map((tech) => (
                      <span key={tech} className="bg-black/85 text-zinc-300 text-[9px] font-mono border border-zinc-800 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                {/* Card body content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Mic size={13} className="text-amber-500" />
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Buttons with red neon borders */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-900/60">
                    {project.liveUrl && (
                      <button type="button"
                        onClick={() => handleLinkClick(project.liveUrl)}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-500 border border-red-500/50 rounded-lg py-2 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_5px_rgba(239,68,68,0.2)] hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                      >
                        <ExternalLink size={12} />
                        🎤 Live
                      </button>
                    )}
                    {project.githubUrl && (
                      <button type="button"
                        onClick={() => handleLinkClick(project.githubUrl)}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-300 border border-zinc-800 rounded-lg py-2 hover:border-amber-500 hover:text-amber-400 hover:shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-all"
                      >
                        <Github size={12} />
                        📂 GitHub
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE SECTION (TOUR HISTORY) ── */}
        <section id="experience" className="py-16 max-w-4xl mx-auto border-t border-orange-950/20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-wider text-amber-500 inline-block mb-3 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">
              TOUR HISTORY (EXPERIENCE)
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Previous venues performed at and systems built
            </p>
          </div>

          <div className="relative pl-6 md:pl-8 border-l-2 border-dashed border-red-500/40 text-left">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company || index}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline lighting spot icon */}
                <div className="absolute left-[-35px] md:left-[-41px] top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]">
                  <Mic size={10} />
                </div>

                <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-2xl relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-heading text-xl font-bold uppercase text-zinc-100 tracking-wide">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
                        {exp.company}
                      </span>
                    </div>
                    <span className="bg-red-950/60 border border-red-900/60 text-red-400 text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider select-none shrink-0 self-start sm:self-center">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS SECTION (AUDIENCE SAYS) ── */}
        <section id="testimonials" className="py-16 max-w-7xl mx-auto border-t border-orange-950/20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-wider text-red-500 inline-block mb-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
              AUDIENCE SAYS
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Reviews from satisfied managers, founders and colleagues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            {testimonials.map((test, index) => (
              <motion.div
                key={test.name || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 relative shadow-[0_0_20px_rgba(0,0,0,0.5)] text-left hover:border-amber-500/40 transition-colors"
              >
                {/* Speech Bubble Quote bubble shape styling */}
                <div className="text-zinc-300 text-sm md:text-base italic leading-relaxed mb-6 flex-1 relative z-10 pl-6">
                  <span className="absolute left-0 top-[-5px] font-serif text-3xl text-red-500/70 select-none">“</span>
                  {test.text}
                </div>

                {/* Avatar info metadata */}
                <div className="flex items-center gap-3.5 border-t border-zinc-900/60 pt-4">
                  <img 
                    src={test.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"} 
                    alt={test.name} 
                    className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <div className="text-sm font-bold text-zinc-100 font-heading uppercase tracking-wide">
                      {test.name}
                    </div>
                    <div className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">
                      {test.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CONTACT SECTION (BOOK MY NEXT SHOW) ── */}
        <section id="contact" className="py-16 max-w-6xl mx-auto border-t border-orange-950/20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Contact left info */}
            <div className="lg:col-span-6 flex flex-col justify-between text-left">
              <div>
                <h2 className="font-heading text-4xl md:text-5xl font-black uppercase leading-tight tracking-wider mb-4 neon-text-red">
                  BOOK MY NEXT SHOW
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md">
                  Looking to hire a dynamic Full Stack Engineer who can solve bugs, ship features, and keep the team in good spirits? Let's talk about details!
                </p>

                {/* Contact links list details */}
                <div className="flex flex-col gap-4 max-w-sm">
                  {data.socials?.email && (
                    <a 
                      href={`mailto:${data.socials.email}`}
                      className="flex items-center gap-3 p-3 bg-zinc-950/80 border border-zinc-900 hover:border-amber-500/50 hover:bg-black rounded-xl transition-all group"
                    >
                      <div className="text-amber-500 p-1.5 bg-amber-500/10 rounded-md">
                        <Mail size={16} />
                      </div>
                      <div className="text-xs font-mono text-zinc-300 group-hover:text-zinc-100">
                        {data.socials.email}
                      </div>
                    </a>
                  )}
                  {personalLocation && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                      <div className="text-red-500 p-1.5 bg-red-500/10 rounded-md">
                        <MapPin size={16} />
                      </div>
                      <div className="text-xs font-mono text-zinc-300">
                        {personalLocation}
                      </div>
                    </div>
                  )}

                  {/* Social links row */}
                  <div className="flex gap-3 mt-4">
                    {data.socials?.github && (
                      <button type="button"
                        onClick={() => handleLinkClick(data.socials.github)}
                        className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500 rounded-xl transition-all shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                      >
                        <Github size={18} />
                      </button>
                    )}
                    {data.socials?.linkedin && (
                      <button type="button"
                        onClick={() => handleLinkClick(data.socials.linkedin)}
                        className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500 rounded-xl transition-all shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                      >
                        <Linkedin size={18} />
                      </button>
                    )}
                    {data.socials?.twitter && (
                      <button type="button"
                        onClick={() => handleLinkClick(data.socials.twitter)}
                        className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500 rounded-xl transition-all shadow-[0_0_8px_rgba(0,0,0,0.6)]"
                      >
                        <Twitter size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Pin Paper Note */}
              <div className="relative w-[210px] mt-8 transform -rotate-2 self-start hidden lg:block">
                {/* Red pushpin */}
                <div className="absolute top-[-8px] left-[30px] w-3 h-3 rounded-full bg-red-600 shadow-[0_3px_5px_rgba(0,0,0,0.4)] z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-0.5 left-0.5" />
                </div>
                <div className="bg-yellow-100 text-zinc-800 p-4 shadow-xl border-l-4 border-yellow-200 rounded-sm">
                  <p className="font-handwritten text-base leading-tight font-bold">
                    Let's create something funny & impactful together!
                  </p>
                  <div className="mt-3 text-right text-[10px] uppercase tracking-wider text-zinc-500 font-sans">
                    ★ Pinned Notes
                  </div>
                </div>
              </div>
            </div>

            {/* Contact right form panel */}
            <div className="lg:col-span-6 bg-zinc-950/70 border border-zinc-900 p-6 md:p-8 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-center">
              <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-zinc-100 mb-6 text-left flex items-center gap-2">
                <Volume2 size={20} className="text-amber-500" />
                GRAB THE MIC
              </h3>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full bg-black/60 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-black/60 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                    Message
                  </label>
                  <textarea 
                    rows={4} 
                    placeholder="Describe your gig or offer..." 
                    className="w-full bg-black/60 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-red-500 border border-red-500 rounded-xl py-3 select-none uppercase hover:bg-red-500 hover:text-white transition-all shadow-[0_0_8px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                >
                  Send Message ↗
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-8 border-t border-orange-950/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto text-zinc-500 text-xs">
          <div>
            © {new Date().getFullYear()} {personalName}. Built for Stand-up Shows.
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">
              Live Stage Connected
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
