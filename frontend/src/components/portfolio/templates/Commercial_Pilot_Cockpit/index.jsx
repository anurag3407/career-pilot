import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';
import {
  Compass,
  MapPin,
  Mail,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  RotateCcw,
  Gauge,
  Radio,
  Cpu,
  Navigation,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  Send
} from 'lucide-react';

export default function Commercial_Pilot_Cockpit({ data: localData, portfolioData }) {
  // 🔒 Fallback default data matching aviation creative direction
  const localDefault = {
    personal: {
      name: "Sarah Lindbergh",
      title: "Senior Avionics Architect & Lead Engineer",
      email: "sarah.lindbergh@airline.com",
      phone: "+1 (425) 555-0190",
      location: "Seattle, WA",
      bio: "Avionics software engineer with 10+ years of experience designing safety-critical HUD displays, real-time flight telemetry systems, and glass cockpit simulation dashboards. Specializing in high-performance web systems and embedded avionics controllers.",
      avatar: "",
      website: "https://sarahlindbergh.dev",
      tagline: "Engineering high-integrity flight software and modern flight decks for the next generation of aerospace."
    },
    skills: [
      { name: "C++ / Rust", level: 98 },
      { name: "React / Next.js", level: 95 },
      { name: "WebGL / Three.js", level: 92 },
      { name: "Real-time Telemetry", level: 96 },
      { name: "Embedded systems", level: 90 },
      { name: "Tailwind CSS", level: 95 }
    ],
    experience: [
      {
        role: "Lead Avionics Engineer",
        company: "Boeing Commercial Airplanes",
        period: "2022 - Present",
        description: "Leading development of next-generation primary flight displays and autopilot mode control panel web dashboards. Spearheaded a WebGL telemetry viewer reducing simulation lag by 45%."
      },
      {
        role: "Flight Controls Systems Developer",
        company: "Airbus Group",
        period: "2019 - 2022",
        description: "Implemented safety-critical embedded flight system diagnostics. Developed visual test simulation tools for flight deck instrument clusters."
      }
    ],
    projects: [
      {
        title: "Flight deck HUD HUD telemetry viewer",
        description: "A real-time WebGL rendering tool displaying artificial horizon pitch and roll ladders, altitude/airspeed indicators, and flight path telemetry.",
        techStack: ["React", "WebGL", "Rust"],
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        title: "Autopilot MCP Dashboard Interface",
        description: "A simulation dashboard replicas of Mode Control Panels used for pilot flight guidance test beds.",
        techStack: ["Next.js", "Zustand", "Tailwind CSS"],
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        title: "AR Aeronautical Charts System",
        description: "Augmented reality overlay dashboard rendering visual flight rules (VFR) charts and landing waypoint indicators.",
        techStack: ["Three.js", "WebXR", "TypeScript"],
        liveUrl: "#",
        githubUrl: "#"
      }
    ],
    testimonials: [
      {
        name: "Capt. Marcus Vance",
        role: "Chief Technical Pilot at Horizon Jetways",
        text: "Sarah's interface designs feel natural and clean, mirroring the high levels of ergonomic safety required in real flight decks."
      }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  };

  // Resolve data source
  const context = usePortfolio();
  const incoming = portfolioData || localData || context?.portfolioData || {};

  // Safe merging helper
  const personal = { ...localDefault.personal, ...incoming.personal, ...(incoming.personalInfo || {}) };
  const experience = incoming.experience && incoming.experience.length > 0 ? incoming.experience : localDefault.experience;
  const projects = incoming.projects && incoming.projects.length > 0 ? incoming.projects : localDefault.projects;
  const skills = incoming.skills && incoming.skills.length > 0 ? incoming.skills : localDefault.skills;
  const socials = { ...localDefault.socials, ...incoming.socials };

  // Timeline State: 'approach' -> 'window-lock' -> 'cabin-entry' -> 'cabin-walk' -> 'door-approach' -> 'cockpit-reveal' -> 'portfolio'
  const [stage, setStage] = useState('approach');
  const [activeTab, setActiveTab] = useState('pfd'); // 'pfd' (About), 'mfd' (Projects), 'nd' (Experience), 'cdu' (Contact)
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedWaypoint, setSelectedWaypoint] = useState(0);

  // Calibration progress
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);

  // Auto transition timeline
  useEffect(() => {
    let t1, t2, t3, t4, t5, t6;

    t1 = setTimeout(() => setStage('window-lock'), 2500);
    t2 = setTimeout(() => setStage('cabin-entry'), 4500);
    t3 = setTimeout(() => setStage('cabin-walk'), 7000);
    t4 = setTimeout(() => setStage('door-approach'), 10000);
    t5 = setTimeout(() => setStage('cockpit-reveal'), 16000);
    t6 = setTimeout(() => setStage('portfolio'), 19000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  // Unlock door keypad only when the door starts sliding open (1s more delay, 4.5s total)
  useEffect(() => {
    if (stage === 'door-approach') {
      const timer = setTimeout(() => {
        setIsDoorUnlocked(true);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setIsDoorUnlocked(false);
    }
  }, [stage]);

  // Simulate loading logs in cockpit-reveal stage
  useEffect(() => {
    if (stage === 'cockpit-reveal') {
      const logs = [
        "INITIALIZING FLIGHT INSTRUMENT BOOT...",
        "CHECKING SENSORS (ADIRS) ... OK",
        "CONNECTING FLIGHT CONTROL COMPUTERS ... OK",
        "SYNCING WAYPOINTS & CO-ORDINATES ... OK",
        "CALIBRATING PRIMARY HORIZON DIAL ... OK",
        "ALL SYSTEMS GO. CAPTAIN SEAT ASSIGNED."
      ];

      logs.forEach((log, index) => {
        setTimeout(() => {
          setSystemLogs(prev => [...prev, log]);
          setCalibrationProgress(((index + 1) / logs.length) * 100);
        }, index * 300);
      });
    }
  }, [stage]);

  const handleReplay = () => {
    setStage('approach');
    setCalibrationProgress(0);
    setSystemLogs([]);
    setSelectedProject(0);
    setSelectedWaypoint(0);
    setActiveTab('pfd');

    setTimeout(() => setStage('window-lock'), 2500);
    setTimeout(() => setStage('cabin-entry'), 4500);
    setTimeout(() => setStage('cabin-walk'), 7000);
    setTimeout(() => setStage('door-approach'), 10000);
    setTimeout(() => setStage('cockpit-reveal'), 16000);
    setTimeout(() => setStage('portfolio'), 19000);
  };

  // SVG commercial airplane drawing
  const airplaneSvg = (
    <svg viewBox="0 0 600 200" className="w-full h-full drop-shadow-[0_15px_20px_rgba(0,0,0,0.3)]">
      {/* Fuselage main body */}
      <path d="M 120 110 Q 250 85 450 110 Q 520 115 540 120 Q 560 125 540 130 C 500 135 250 135 120 110 Z" fill="#ffffff" />
      {/* Nose Cone */}
      <path d="M 540 120 Q 555 122 550 125 Q 540 130 538 126 Z" fill="#1e293b" />
      {/* Aviation Blue Stripe */}
      <path d="M 130 112 Q 250 95 440 115 Q 500 120 540 123 L 538 126 Q 500 124 440 120 Q 250 102 130 114 Z" fill="#003366" />
      {/* Airline Red Stripe */}
      <path d="M 140 115 Q 250 100 430 118 Q 480 122 520 125 L 519 127 Q 480 125 430 121 Q 250 106 140 117 Z" fill="#cc0000" />
      {/* Cabin Windows */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={180 + i * 20} y={111 - (i * 0.2)} width="6" height="4" rx="2" fill="#1e293b" opacity="0.85" />
      ))}
      {/* Zoom Highlight focal passenger window */}
      <rect x={320} y={109.5} width="6" height="4" rx="2" fill="#38bdf8" className="animate-pulse" />
      {/* Front Cockpit Glass */}
      <path d="M 522 115 Q 532 116 536 122 L 528 122 Z" fill="#155e75" />
      {/* Main Wing (Side view overlay) */}
      <path d="M 280 120 L 220 180 L 260 185 L 340 124 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      {/* Wing Engine */}
      <path d="M 270 145 C 270 140 310 140 310 145 C 310 152 270 152 270 145 Z" fill="#64748b" />
      <circle cx="272" cy="145" r="4" fill="#cc0000" />
      {/* Tail Fin */}
      <path d="M 120 110 L 80 40 L 115 40 L 160 105 Z" fill="#003366" />
      <path d="M 85 45 L 82 40 L 100 40 L 105 45 Z" fill="#cc0000" />
      {/* Tail stabilizer */}
      <path d="M 130 110 L 100 125 L 115 127 L 140 112 Z" fill="#64748b" />
    </svg>
  );

  // ==========================================
  // Premium Cabin Rendering Helper Functions
  // ==========================================
  const renderWallPanel = (i, side) => {
    const isLeft = side === 'left';
    return (
      <svg viewBox="0 0 200 320" className="w-full h-full">
        <defs>
          <linearGradient id={`sky-grad-${i}-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0f19" />
            <stop offset="35%" stopColor="#1e1b4b" />
            <stop offset="70%" stopColor="#881337" />
            <stop offset="85%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>

        {/* Outer panel structure */}
        <rect x="0" y="0" width="200" height="320" fill="#141824" rx="4" />

        {/* Curved fuselage rib highlights */}
        <path d="M 8 0 L 8 320" stroke="#252d42" strokeWidth="2" opacity="0.4" />
        <path d="M 192 0 L 192 320" stroke="#252d42" strokeWidth="2" opacity="0.4" />

        {/* Horizontal design seams */}
        <path d="M 0 45 L 200 45" stroke="#0b0d14" strokeWidth="3" />
        <path d="M 0 265 L 200 265" stroke="#0b0d14" strokeWidth="3" />

        {/* Oval window bezel (rendered on both sides to mirror each other) */}
        <g transform="translate(80, 70)">
          {/* Outer shadow/bezel border */}
          <rect x="-2" y="-2" width="44" height="74" rx="22" fill="#080a0f" />
          {/* Main plastic bezel */}
          <rect x="0" y="0" width="40" height="70" rx="20" fill="#2d3345" stroke="#48526d" strokeWidth="1.2" />
          {/* Dark inner cavity */}
          <rect x="4" y="4" width="32" height="62" rx="16" fill="#11141c" stroke="#1c2130" strokeWidth="1" />

          <mask id={`win-mask-${i}-${side}`}>
            <rect x="6" y="6" width="28" height="58" rx="14" fill="#ffffff" />
          </mask>

          {/* Sky / Outside View */}
          <g mask={`url(#win-mask-${i}-${side})`}>
            <rect x="6" y="6" width="28" height="58" fill={`url(#sky-grad-${i}-${side})`} />

            {/* Animated clouds drifting */}
            <g className={i % 2 === 0 ? "animate-cloud-slow" : "animate-cloud-fast"}>
              <path d="M -20 30 Q -5 20 10 30 Q 25 20 40 30 Q 45 40 30 50 Q 10 50 -10 50 Z" fill="#fef08a" opacity="0.3" />
              <path d="M 20 20 Q 35 10 50 20 Q 65 10 80 20 Q 85 30 70 40 Q 50 40 30 40 Z" fill="#ffffff" opacity="0.2" />
            </g>
          </g>

          {/* Glass Glare reflection overlay */}
          <path d="M 8 18 Q 20 8 32 18" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.18" fill="none" mask={`url(#win-mask-${i}-${side})`} />

          {/* Window shade */}
          {i === 4 ? (
            <rect x="6" y="6" width="28" height="28" rx="2" fill="#242936" opacity="0.95" stroke="#131720" strokeWidth="0.8" mask={`url(#win-mask-${i}-${side})`} />
          ) : i === 6 ? (
            <rect x="6" y="6" width="28" height="56" rx="2" fill="#242936" opacity="0.95" stroke="#131720" strokeWidth="0.8" mask={`url(#win-mask-${i}-${side})`} />
          ) : null}
        </g>

        {/* Seat Row label backlights */}
        <rect x={isLeft ? 15 : 161} y="15" width="24" height="10" rx="2" fill="#090b10" />
        <text x={isLeft ? 27 : 173} y="22" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity="0.7">
          {12 - i}{isLeft ? 'A' : 'F'}
        </text>
      </svg>
    );
  };

  const renderSeatPanel = (i, side) => {
    const isLeft = side === 'left';
    return (
      <svg viewBox="0 0 190 320" className="w-full h-full">
        <defs>
          <filter id="tablet-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="quilt-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0 M 0 0 L 10 10" stroke="#0a0f1d" strokeWidth="0.5" opacity="0.4" />
          </pattern>

          <radialGradient id="tablet-light-reflection" cx="35%" cy="65%" r="60%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Seat support leg structures */}
        <rect x="30" y="270" width="8" height="50" fill="#242c3d" rx="2" />
        <rect x="91" y="270" width="8" height="50" fill="#242c3d" rx="2" />
        <rect x="152" y="270" width="8" height="50" fill="#242c3d" rx="2" />
        <rect x="10" y="260" width="170" height="12" fill="#151b26" rx="4" />

        {/* SEAT C (Aisle) */}
        <g transform="translate(6, 100)">
          <rect x="0" y="0" width="46" height="120" rx="8" fill="#0c1017" stroke="#1d2636" strokeWidth="1.5" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="#1b2234" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="url(#quilt-pattern)" />

          <rect x="4" y="-18" width="38" height="24" rx="6" fill="#0c1017" />
          <rect x="7" y="-15" width="32" height="20" rx="4" fill="#1d2636" />
          <rect x="9" y="-15" width="28" height="14" rx="2" fill="#f1f5f9" />
          <path d="M 18 -8 L 28 -8" stroke="#cbd5e1" strokeWidth="1" />

          <rect x="4" y="70" width="38" height="40" rx="3" fill="#101520" stroke="#222c42" strokeWidth="1" />
          <path d="M 7 64 L 18 64 L 18 72 L 7 72 Z" fill="#ef4444" opacity="0.9" />
          <path d="M 20 62 L 38 62 L 38 72 L 20 72 Z" fill="#38bdf8" opacity="0.8" />
          <path d="M 4 80 L 42 80 M 4 90 L 42 90 M 13 70 L 13 110 M 26 70 L 26 110" stroke="#151d2b" strokeWidth="0.5" opacity="0.4" />
        </g>

        {/* SEAT B (Middle) */}
        <g transform="translate(64, 100)">
          <rect x="0" y="0" width="46" height="120" rx="8" fill="#0c1017" stroke="#1d2636" strokeWidth="1.5" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="#1b2234" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="url(#quilt-pattern)" />

          <rect x="4" y="-18" width="38" height="24" rx="6" fill="#0c1017" />
          <rect x="7" y="-15" width="32" height="20" rx="4" fill="#1d2636" />
          <rect x="9" y="-15" width="28" height="14" rx="2" fill="#f1f5f9" />
          <path d="M 18 -8 L 28 -8" stroke="#cbd5e1" strokeWidth="1" />

          <rect x="4" y="70" width="38" height="40" rx="3" fill="#101520" stroke="#222c42" strokeWidth="1" />
          <path d="M 7 64 L 18 64 L 18 72 L 7 72 Z" fill="#ef4444" opacity="0.9" />
          <path d="M 20 62 L 38 62 L 38 72 L 20 72 Z" fill="#38bdf8" opacity="0.8" />
          <path d="M 4 80 L 42 80 M 4 90 L 42 90 M 13 70 L 13 110 M 26 70 L 26 110" stroke="#151d2b" strokeWidth="0.5" opacity="0.4" />
        </g>

        {/* SEAT A (Window) */}
        <g transform="translate(122, 100)">
          <rect x="0" y="0" width="46" height="120" rx="8" fill="#0c1017" stroke="#1d2636" strokeWidth="1.5" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="#1b2234" />
          <rect x="3" y="10" width="40" height="105" rx="5" fill="url(#quilt-pattern)" />

          <rect x="4" y="-18" width="38" height="24" rx="6" fill="#0c1017" />
          <rect x="7" y="-15" width="32" height="20" rx="4" fill="#1d2636" />
          <rect x="9" y="-15" width="28" height="14" rx="2" fill="#f1f5f9" />
          <path d="M 18 -8 L 28 -8" stroke="#cbd5e1" strokeWidth="1" />

          <rect x="4" y="70" width="38" height="40" rx="3" fill="#101520" stroke="#222c42" strokeWidth="1" />
          <path d="M 7 64 L 18 64 L 18 72 L 7 72 Z" fill="#ef4444" opacity="0.9" />
          <path d="M 20 62 L 38 62 L 38 72 L 20 72 Z" fill="#38bdf8" opacity="0.8" />
          <path d="M 4 80 L 42 80 M 4 90 L 42 90 M 13 70 L 13 110 M 26 70 L 26 110" stroke="#151d2b" strokeWidth="0.5" opacity="0.4" />
        </g>

        {/* Passenger in Seat A (Row 10 Window Seat, i === 2) */}
        {isLeft && i === 2 && (
          <g transform="translate(122, 75)">
            <path d="M -15 25 Q -20 40 -15 80 L 5 90 Z" fill="#06080c" opacity="0.5" />
            <path d="M -18 40 Q -10 32 12 35 L 22 85 L -10 90 Z" fill="#111625" />
            <circle cx="2" cy="12" r="11" fill="#ffdbac" />
            <path d="M -8 12 Q -12 -5 2 -4 Q 8 2 2 12 Z" fill="#3d2a20" />
            <path d="M -8 8 C -14 10 -15 18 -10 20 C -7 18 -6 12 -8 8" fill="#3d2a20" />
            <path d="M -5 55 Q 15 50 18 58" stroke="#ffdbac" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 12 58 Q 20 60 25 56" stroke="#ffdbac" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Glowing Tablet */}
            <rect
              x="12"
              y="42"
              width="22"
              height="15"
              rx="2"
              transform="rotate(15 20 48)"
              fill="#00e5ff"
              className="animate-tablet-glow"
              style={{ filter: 'url(#tablet-glow-filter)' }}
            />
            <path d="M 15 46 L 25 49 M 14 50 L 28 54 M 16 53 L 24 55" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" transform="rotate(15 20 48)" />

            <path d="M 12 42 L -8 18 L 8 8 L 22 42 Z" fill="url(#tablet-light-reflection)" style={{ mixBlendMode: 'screen' }} />
            <path d="M 12 42 L -12 45 L -8 65 L 18 55 Z" fill="url(#tablet-light-reflection)" style={{ mixBlendMode: 'screen' }} />
          </g>
        )}

        {/* Armrests */}
        <rect x="0" y="160" width="6" height="40" rx="3" fill="#334155" stroke="#1d2636" strokeWidth="1" />
        <rect x="52" y="160" width="12" height="40" rx="3" fill="#334155" stroke="#1d2636" strokeWidth="1" />
        <rect x="110" y="160" width="12" height="40" rx="3" fill="#334155" stroke="#1d2636" strokeWidth="1" />
        <rect x="168" y="160" width="6" height="40" rx="3" fill="#334155" stroke="#1d2636" strokeWidth="1" />

        <circle cx="3" cy="168" r="1" fill="#38bdf8" />
        <circle cx="58" cy="168" r="1" fill="#38bdf8" />
        <circle cx="116" cy="168" r="1" fill="#38bdf8" />
        <circle cx="171" cy="168" r="1" fill="#38bdf8" />
      </svg>
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#090b0d] text-white font-sans overflow-hidden select-none">

      {/* 🛠️ SVG Gradients definitions */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <linearGradient id="window-sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="35%" stopColor="#881337" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Autopilot HUD panel and Navigation grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 210, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />

      <AnimatePresence mode="wait">

        {/* ========================================================================= */}
        {/* STAGE 1 & 2: AIRCRAFT APPROACH & WINDOW LOCK */}
        {/* ========================================================================= */}
        {(stage === 'approach' || stage === 'window-lock') && (
          <motion.div
            key="approach-view"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#10141d] via-[#1b2536] to-[#0f141f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Ambient cloud clusters drifting behind */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-[400px] h-[150px] bg-white/5 blur-3xl rounded-full"
                animate={{ x: [-200, window.innerWidth + 200] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ top: '25%' }}
              />
              <motion.div
                className="absolute w-[500px] h-[200px] bg-white/5 blur-3xl rounded-full"
                animate={{ x: [window.innerWidth + 200, -300] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ top: '55%' }}
              />
            </div>

            {/* Jet aircraft flying diagonally */}
            <motion.div
              className="relative w-[500px] md:w-[700px] aspect-[3/1]"
              initial={{ x: '-100vw', y: '-30vh', scale: 0.5, rotate: -4 }}
              animate={stage === 'approach' ? {
                x: '10vw',
                y: '5vh',
                scale: 1,
                rotate: 0,
                transition: { duration: 2.2, ease: 'easeOut' }
              } : {
                // Focus/zoom target window lock
                x: '-45%',
                y: '-2%',
                scale: 8.5,
                transition: { duration: 2.0, ease: 'easeInOut' }
              }}
            >
              {airplaneSvg}

              {/* Engine Contrail lines */}
              <div className="absolute top-[72.5%] left-0 w-24 h-1 flex flex-col gap-1.5 opacity-40">
                <motion.div
                  className="h-0.5 bg-gradient-to-l from-white/80 to-transparent rounded-full shadow-[0_0_8px_#fff]"
                  animate={{ width: [150, 450], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="h-0.5 bg-gradient-to-l from-white/80 to-transparent rounded-full shadow-[0_0_8px_#fff]"
                  animate={{ width: [100, 400], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, delay: 0.2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Window focus overlay HUD */}
            {stage === 'window-lock' && (
              <motion.div
                className="absolute border border-[#00d2ff]/30 w-32 h-20 rounded-lg flex items-center justify-center font-mono text-[9px] text-[#00d2ff] bg-[#00d2ff]/5"
                style={{ top: '51%', left: '50%', transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="animate-pulse">LOCK ON WINDOW</div>
                  <div className="text-[7px] text-white/50">CABIN ENTRY SECURED</div>
                </div>
                {/* Border bracket UI corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d2ff]" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00d2ff]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00d2ff]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d2ff]" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3 & 4: CABIN TRAVERSAL & DOOR APPROACH */}
        {/* ========================================================================= */}
        {(stage === 'cabin-entry' || stage === 'cabin-walk' || stage === 'door-approach') && (
          <motion.div
            key="cabin-view"
            className="absolute inset-0 bg-[#07090d] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              perspective: '1500px',
              perspectiveOrigin: '50% 40%'
            }}
          >
            {/* Inline CSS styling for animations */}
            <style>{`
              @keyframes cloud-drift {
                0% { transform: translateX(120px); }
                100% { transform: translateX(-160px); }
              }
              .animate-cloud-slow {
                animation: cloud-drift 45s linear infinite;
              }
              .animate-cloud-fast {
                animation: cloud-drift 22s linear infinite;
              }
              @keyframes tablet-pulse {
                0% { opacity: 0.8; filter: drop-shadow(0 0 5px #00e5ff); }
                50% { opacity: 1; filter: drop-shadow(0 0 15px #00e5ff); }
                100% { opacity: 0.8; filter: drop-shadow(0 0 5px #00e5ff); }
              }
              .animate-tablet-glow {
                animation: tablet-pulse 1.8s infinite ease-in-out;
              }
            `}</style>

            {/* 3D cabin walls corridor container */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ translateZ: '-300px', rotateY: 90, x: -160, y: 0, scale: 1.35 }}
              animate={
                stage === 'cabin-entry' ? {
                  translateZ: '-300px',
                  rotateY: 90,
                  x: -160,
                  y: 0,
                  scale: 1.35,
                  transition: { duration: 2.0, ease: 'easeOut' }
                } : stage === 'cabin-walk' ? {
                  translateZ: '500px',
                  rotateY: 0,
                  x: 0,
                  scale: 1.45,
                  y: [0, -6, 0, -6, 0], // Walking bobbing effect
                  transition: {
                    translateZ: { duration: 3.0, ease: 'easeInOut' },
                    rotateY: { duration: 1.8, ease: 'easeInOut' },
                    x: { duration: 1.8, ease: 'easeInOut' },
                    scale: { duration: 2.2, ease: 'easeInOut' },
                    y: { duration: 3.0, ease: 'linear', repeat: 0 }
                  }
                } : {
                  // door-approach: smooth cinematic dolly straight towards cockpit door
                  translateZ: '1320px',
                  rotateY: 0,
                  x: 0,
                  y: [0, -2, 0, -2, 0], // Smooth dolly vertical bob
                  scale: 1.45,
                  transition: {
                    translateZ: { duration: 3.8, ease: 'easeInOut' },
                    x: { duration: 3.8, ease: 'easeInOut' },
                    y: { duration: 3.8, ease: 'linear' },
                    scale: { duration: 3.8, ease: 'easeInOut' }
                  }
                }
              }
            >
              {/* Ceiling Panel Vaulted Structure */}
              <div
                className="absolute top-[8%] w-[500px] h-[3000px] bg-gradient-to-b from-[#0a0c10] via-[#151c2a] to-[#0a0c10] border-x border-[#232a3d]/20 shadow-2xl"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%) rotateX(90deg) translateZ(160px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Recessed LED running light strips */}
                <div className="absolute left-[80px] right-[80px] top-0 bottom-0 flex justify-between">
                  <div className="w-1.5 h-full bg-[#00d2ff] opacity-80 shadow-[0_0_12px_#00d2ff]" />
                  <div className="w-1.5 h-full bg-[#00d2ff] opacity-80 shadow-[0_0_12px_#00d2ff]" />
                </div>
                {/* AC Ventilation Grids */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-black/50 border-x border-slate-900" />
              </div>

              {/* Left Fuselage Wall Panels */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`left-wall-${i}`}
                  className="absolute w-[200px] h-80 overflow-hidden"
                  style={{
                    left: '50%',
                    marginLeft: '-100px',
                    transform: `translateX(-250px) translateZ(${-i * 200}px) rotateY(90deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {renderWallPanel(i, 'left')}
                </div>
              ))}

              {/* Left Passenger Seat Rows (Layered 3D transforms with mirrored scaleX and narrow width to prevent wall intersection) */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`left-seat-${i}`}
                  className="absolute w-[190px] h-80 overflow-hidden"
                  style={{
                    left: '50%',
                    transform: `translateX(-100%) translateX(-60px) translateZ(${-i * 200}px) scaleX(-1)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {renderSeatPanel(i, 'left')}
                </div>
              ))}

              {/* Right Fuselage Wall Panels */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`right-wall-${i}`}
                  className="absolute w-[200px] h-80 overflow-hidden"
                  style={{
                    left: '50%',
                    marginLeft: '-100px',
                    transform: `translateX(250px) translateZ(${-i * 200}px) rotateY(-90deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {renderWallPanel(i, 'right')}
                </div>
              ))}

              {/* Right Passenger Seat Rows (Narrow width to prevent wall intersection) */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`right-seat-${i}`}
                  className="absolute w-[190px] h-80 overflow-hidden"
                  style={{
                    left: '50%',
                    transform: `translateX(60px) translateZ(${-i * 200}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {renderSeatPanel(i, 'right')}
                </div>
              ))}

              {/* Overhead Luggage bins left */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`left-bin-${i}`}
                  className="absolute w-72 h-36 bg-gradient-to-b from-[#181d29] via-[#0f121a] to-[#07090d] border-b border-[#242933]/30"
                  style={{
                    left: '50%',
                    top: '5%',
                    transform: `translateX(-100%) translateX(-250px) translateZ(${-i * 200}px) rotateY(-18deg)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                  }}
                >
                  <div className="absolute bottom-2 left-6 right-6 h-8 border border-[#242933]/40 rounded flex items-center justify-center bg-black/30">
                    <div className="w-16 h-3 bg-slate-900 border border-slate-800 rounded-sm" />
                  </div>
                  <div className="absolute bottom-0 right-4 flex gap-3 opacity-60">
                    <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-white opacity-80" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-white opacity-80" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Overhead Luggage bins right */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={`right-bin-${i}`}
                  className="absolute w-72 h-36 bg-gradient-to-b from-[#181d29] via-[#0f121a] to-[#07090d] border-b border-[#242933]/30"
                  style={{
                    left: '50%',
                    top: '5%',
                    transform: `translateX(250px) translateZ(${-i * 200}px) rotateY(18deg)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                  }}
                >
                  <div className="absolute bottom-2 left-6 right-6 h-8 border border-[#242933]/40 rounded flex items-center justify-center bg-black/30">
                    <div className="w-16 h-3 bg-slate-900 border border-slate-800 rounded-sm" />
                  </div>
                  <div className="absolute bottom-0 left-4 flex gap-3 opacity-60">
                    <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-white opacity-80" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-white opacity-80" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Floor Carpet & LED path */}
              <div
                className="absolute bottom-0 w-[500px] h-[3000px] bg-gradient-to-b from-[#06080c] via-[#10131d] to-[#06080c] border-x border-slate-800"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%) rotateX(90deg) translateZ(-160px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]" />

                {/* Emergency exit floor path lights */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[120px] top-0 bottom-0 flex justify-between">
                  <div className="w-1 h-full bg-emerald-500 opacity-60 shadow-[0_0_8px_#10b981] flex flex-col justify-around py-4">
                    {Array.from({ length: 40 }).map((_, idx) => (
                      <div key={idx} className="w-1 h-2 bg-emerald-400 rounded-full" />
                    ))}
                  </div>
                  <div className="w-1 h-full bg-emerald-500 opacity-60 shadow-[0_0_8px_#10b981] flex flex-col justify-around py-4">
                    {Array.from({ length: 40 }).map((_, idx) => (
                      <div key={idx} className="w-1 h-2 bg-emerald-400 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* 🧑‍✈️ FLIGHT ATTENDANT (Standing at the front of the cabin near the cockpit door) */}
              {(stage === 'cabin-walk' || stage === 'door-approach') && (
                <motion.div
                  className="absolute w-44 h-72 flex flex-col items-center justify-end"
                  style={{
                    transform: 'translateX(50px) translateZ(-1150px) translateY(40px)',
                    transformStyle: 'preserve-3d'
                  }}
                  animate={{
                    opacity: stage === 'door-approach' ? [1, 1, 0] : 1,
                    scale: stage === 'door-approach' ? [1, 1.2, 1.4] : 1
                  }}
                  transition={{
                    duration: 3.8,
                    times: [0, 0.6, 0.8]
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                >

                  {/* Flight Attendant Vector SVG */}
                  <svg viewBox="0 0 100 200" className="w-32 h-60 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                    <defs>
                      <linearGradient id="uniform-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="30%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <linearGradient id="skin-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffeedd" />
                        <stop offset="100%" stopColor="#ffdbac" />
                      </linearGradient>
                    </defs>

                    <circle cx="50" cy="32" r="11" fill="url(#skin-grad)" />
                    <path d="M 38 30 C 36 20 44 14 54 15 C 62 16 64 24 62 30 C 66 22 66 18 58 17 C 50 16 42 20 40 30" fill="#2d1e18" />
                    <circle cx="58" cy="22" r="4" fill="#2d1e18" />

                    <path d="M 59 32 Q 62 33 60 35 Q 58 36 58 38 Z" fill="#e0a980" opacity="0.5" />
                    <rect x="47" y="42" width="6" height="8" fill="url(#skin-grad)" />
                    <path d="M 30 50 Q 50 46 70 50 L 65 120 L 35 120 Z" fill="url(#uniform-grad)" />
                    <path d="M 35 118 L 65 118" stroke="#d4af37" strokeWidth="1.5" />
                    <path d="M 40 50 L 50 70 L 60 50 Z" fill="#ffffff" />
                    <path d="M 46 50 Q 50 64 54 50 Z" fill="#dc2626" />
                    <path d="M 48 50 L 45 62 L 50 68 L 52 50 Z" fill="#ef4444" />
                    <path d="M 36 62 L 44 62 Q 40 68 36 62 Z" fill="#d4af37" />
                    <circle cx="40" cy="62" r="1" fill="#ffffff" />
                    <path d="M 30 50 Q 14 62 8 85 L 14 88 Q 20 68 34 58 Z" fill="url(#uniform-grad)" />
                    <circle cx="7.5" cy="87" r="3.5" fill="url(#skin-grad)" />
                    <path d="M 70 50 Q 76 72 73 98 L 67 98 Q 70 74 64 58 Z" fill="url(#uniform-grad)" />
                    <circle cx="71" cy="100" r="3.5" fill="url(#skin-grad)" />
                    <path d="M 35 120 L 65 120 L 68 165 L 32 165 Z" fill="url(#uniform-grad)" />
                    <rect x="41" y="165" width="5.5" height="30" fill="url(#skin-grad)" />
                    <rect x="53" y="165" width="5.5" height="30" fill="url(#skin-grad)" />
                    <path d="M 37 195 L 47 195 C 47 198 37 198 37 195 Z" fill="#090b11" />
                    <path d="M 53 195 L 63 195 C 63 198 53 198 53 195 Z" fill="#090b11" />
                  </svg>
                </motion.div>
              )}

              {/* ======================================= */}
              {/* THE COCKPIT DOOR (At the end of the aisle) */}
              {/* ======================================= */}
              <motion.div
                className="absolute w-[200px] h-[340px] bg-gradient-to-b from-[#151a24] to-[#07090d] border-4 border-slate-700/80 rounded relative overflow-hidden"
                style={{
                  transform: 'translateZ(-1400px) translateY(-20px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 0 50px rgba(0, 0, 0, 0.95)'
                }}
              >
                {/* Cockpit Control Section Preview (Behind sliding door panels) */}
                <div className="absolute inset-0 bg-[#090b0f] flex flex-col justify-between p-4 overflow-hidden">
                  {/* Cockpit Windshield (Stars & Horizon) */}
                  <div className="w-full h-16 bg-[#04060a] border-b border-slate-800/80 relative rounded-t flex justify-around items-end">
                    {/* Stars in background */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:8px_8px]" />
                    {/* Horizon line */}
                    <div className="w-full h-px bg-sky-500/20 absolute bottom-2" />
                    {/* Windshield center pillar */}
                    <div className="w-2 h-full bg-slate-800" />
                  </div>

                  {/* Instrument Panel Glare Shield */}
                  <div className="w-full h-2 bg-slate-900 shadow-lg" />

                  {/* Glowing Flight Instrument Screens */}
                  <div className="flex-1 w-full bg-[#0b0f19] p-2 flex justify-between gap-1.5 border-t border-slate-800">
                    {/* Left Screen (PFD) */}
                    <div className="flex-1 h-full bg-black border border-sky-500/40 rounded p-0.5 flex flex-col justify-between relative">
                      <div className="w-full h-1/2 bg-sky-900/20 border-b border-sky-500/20 relative overflow-hidden">
                        {/* Artificial Horizon Pitch Ladder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-0.5 bg-emerald-500" />
                          <div className="w-4 h-4 border border-sky-400 rounded-full opacity-60 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex justify-between text-[3px] font-mono text-sky-400">
                        <span>ALT 12K</span>
                        <span>SPD 240</span>
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,210,255,0.07)_50%,transparent_50%)] bg-[size:100%_4px]" />
                    </div>

                    {/* Center Screen (MFD / Engine Displays) */}
                    <div className="flex-1 h-full bg-black border border-emerald-500/40 rounded p-0.5 flex flex-col justify-between relative">
                      <div className="flex-1 flex flex-col justify-around py-1">
                        {/* Engine Dial Simulators */}
                        <div className="flex justify-around">
                          <div className="w-3 h-3 rounded-full border border-emerald-500/40 flex items-center justify-center">
                            <div className="w-1.5 h-0.5 bg-emerald-400 -rotate-45" />
                          </div>
                          <div className="w-3 h-3 rounded-full border border-emerald-500/40 flex items-center justify-center">
                            <div className="w-1.5 h-0.5 bg-[#00d2ff] -rotate-12" />
                          </div>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-emerald-500" />
                        </div>
                      </div>
                      <div className="text-[3px] font-mono text-emerald-400 text-center">EGT NORMAL</div>
                    </div>

                    {/* Right Screen (ND / Map Display) */}
                    <div className="flex-1 h-full bg-black border border-sky-500/40 rounded p-0.5 flex flex-col justify-between relative overflow-hidden">
                      {/* Radar sweep line */}
                      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,rgba(0,210,255,0.15))] animate-[spin_4s_linear_infinite]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border border-sky-500/20 rounded-full" />
                        <div className="w-3 h-3 border border-sky-500/20 rounded-full" />
                        {/* Waypoint dots */}
                        <div className="absolute w-0.5 h-0.5 rounded-full bg-amber-400 left-3 top-3" />
                        <div className="absolute w-0.5 h-0.5 rounded-full bg-sky-400 right-4 bottom-3" />
                      </div>
                      <div className="text-[3px] font-mono text-sky-400 z-10">TFC ACCURATE</div>
                    </div>
                  </div>

                  {/* Throttle Pedestal Console & Yoke */}
                  <div className="w-full h-12 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800 p-1 flex justify-around items-end">
                    {/* Left Pilot Yoke */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-2 border-t border-x border-slate-600 rounded-t-sm" />
                      <div className="w-1 h-4 bg-slate-700" />
                    </div>

                    {/* Throttle Levers */}
                    <div className="w-8 h-8 bg-slate-950 border border-slate-800 rounded p-0.5 flex justify-center gap-1">
                      <div className="w-1.5 h-full bg-slate-800 rounded relative">
                        <div className="absolute top-1 left-0 right-0 h-2 bg-slate-500 rounded-sm" />
                      </div>
                      <div className="w-1.5 h-full bg-slate-800 rounded relative">
                        <div className="absolute top-2 left-0 right-0 h-2 bg-slate-500 rounded-sm" />
                      </div>
                    </div>

                    {/* Right Pilot Yoke */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-2 border-t border-x border-slate-600 rounded-t-sm" />
                      <div className="w-1 h-4 bg-slate-700" />
                    </div>
                  </div>
                </div>

                {/* Left Sliding Door Panel */}
                <motion.div
                  className="absolute left-0 top-0 w-[100px] h-[332px] bg-gradient-to-r from-[#202735] via-[#151a24] to-[#0f121a] border-r border-[#334155] p-3 flex flex-col justify-between z-10"
                  animate={{ x: stage === 'door-approach' ? -92 : 0 }}
                  transition={{ delay: 4.5, duration: 1.0, ease: 'easeInOut' }}
                >
                  <div className="w-full h-px bg-slate-800" />
                  <div className="flex flex-col gap-1 items-end pr-1 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  </div>

                  {/* Secure latch bolt indicators */}
                  <div className="w-6 h-12 bg-slate-900 border border-slate-800 rounded flex flex-col justify-around items-center py-1 self-end">
                    <div className="w-3 h-1 bg-[#cc0000] rounded-sm" />
                    <div className="w-3 h-1 bg-[#cc0000] rounded-sm" />
                  </div>

                  <div className="w-full h-px bg-slate-800" />
                </motion.div>

                {/* Right Sliding Door Panel */}
                <motion.div
                  className="absolute right-0 top-0 w-[100px] h-[332px] bg-gradient-to-l from-[#202735] via-[#151a24] to-[#0f121a] border-l border-[#334155] p-3 flex flex-col justify-between z-10"
                  animate={{ x: stage === 'door-approach' ? 92 : 0 }}
                  transition={{ delay: 4.5, duration: 1.0, ease: 'easeInOut' }}
                >
                  {/* Keyless Entry Keypad */}
                  <div className="w-12 h-20 bg-[#030712] border border-slate-800/80 rounded p-1.5 self-start flex flex-col justify-between mt-6">
                    <div className="grid grid-cols-3 gap-0.5 font-mono text-[4px] text-sky-400 font-bold text-center">
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={idx} className="border border-slate-900 py-0.5 bg-slate-900/60">{idx + 1}</div>
                      ))}
                    </div>
                    {/* Status LED display */}
                    <div className={`h-2.5 rounded-sm font-mono text-[4px] text-center font-bold flex items-center justify-center ${isDoorUnlocked ? 'bg-[#064e3b] text-emerald-400' : 'bg-[#881337] text-rose-400'}`}>
                      {isDoorUnlocked ? 'OPEN' : 'LOCK'}
                    </div>
                  </div>

                  {/* Cockpit Door Window */}
                  <div className="w-16 h-12 bg-[#090b0e] rounded border border-slate-800 self-center flex items-center justify-center overflow-hidden relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
                    <motion.div
                      className="w-10 h-6 bg-[#fb8500]/30 blur-md rounded-full"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#090b0e_90%)]" />
                    <div className="font-mono text-[5px] text-emerald-500/60 font-bold rotate-6 tracking-widest">COCKPIT</div>
                  </div>

                  <div className="w-full h-px bg-slate-800" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: COCKPIT REVEAL & SYSTEM STARTUP */}
        {/* ========================================================================= */}
        {stage === 'cockpit-reveal' && (
          <motion.div
            key="cockpit-reveal-view"
            className="absolute inset-0 bg-[#090b0d] flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Calibration HUD frame overlay */}
            <div className="w-full max-w-2xl border border-sky-500/20 rounded-lg bg-[#0e1116] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00d2ff]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d2ff]" />

              <h2 className="font-mono text-xs uppercase tracking-widest text-[#00d2ff] mb-2 flex items-center gap-1.5 animate-pulse">
                <Activity size={14} /> SYSTEM CALIBRATION IN PROGRESS
              </h2>

              {/* Terminal calibration log */}
              <div className="w-full h-48 bg-black/60 border border-slate-800 rounded p-4 font-mono text-[10px] text-emerald-400 space-y-1 overflow-y-auto mb-6">
                {systemLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &gt; {log}
                  </motion.div>
                ))}
              </div>

              {/* Progress Loading Bar */}
              <div className="relative w-full h-4 bg-slate-900 border border-slate-800 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-600 via-sky-400 to-[#00d2ff] shadow-[0_0_10px_#00d2ff]"
                  style={{ width: `${calibrationProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white font-bold">
                  {Math.round(calibrationProgress)}% COMPLETE
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 6: FULLY INTERACTIVE COCKPIT PORTFOLIO */}
        {/* ========================================================================= */}
        {stage === 'portfolio' && (
          <motion.div
            key="portfolio-view"
            className="absolute inset-0 bg-[#0e1114] flex flex-col justify-between overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Top Windshield frame with window reflections */}
            <div className="w-full h-[12%] bg-[#1c1f24] border-b-4 border-[#121418] relative flex justify-between items-end px-12 z-20 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
              {/* Left Windshield Pane */}
              <div className="w-[45%] h-full bg-[#0b0c0e] rounded-t-3xl border-t border-x border-[#2b3038]/40 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00aaff]/2 to-transparent pointer-events-none" />
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">WINDSHIELD REFLECTION LAYER</span>
              </div>

              {/* Center Autopilot MCP Control Panel (Header & Nav Menu) */}
              <div className="w-[50%] h-[85%] bg-[#121417] border-t-2 border-x-2 border-[#2b3038] rounded-t-xl px-4 flex items-center justify-between shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-1.5">
                  <Gauge size={14} className="text-[#ff3333]" />
                  <span className="font-mono text-[9px] font-bold text-slate-300">A/P MODE CONTROL</span>
                </div>

                {/* Autopilot MCP Selector Keys */}
                <div className="flex gap-1.5">
                  {[
                    { id: 'pfd', label: 'PFD / BIO' },
                    { id: 'mfd', label: 'MFD / PROJ' },
                    { id: 'nd', label: 'ND / WORK' },
                    { id: 'cdu', label: 'CDU / COMMS' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === tab.id
                        ? 'bg-[#00d2ff] text-[#090b0d] shadow-[0_0_8px_#00d2ff]'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplay}
                    className="flex items-center justify-center w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Replay Flight Intro"
                  >
                    <RotateCcw size={10} />
                  </button>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>

              {/* Right Windshield Pane */}
              <div className="w-[45%] h-full bg-[#0b0c0e] rounded-t-3xl border-t border-x border-[#2b3038]/40 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00aaff]/2 to-transparent pointer-events-none" />
                <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">HEADING LOCK COMPASS</span>
              </div>
            </div>

            {/* Main Instrument Dashboard Cluster */}
            <div className="flex-1 w-full bg-[#16191c] p-4 flex gap-4 overflow-hidden relative">

              {/* ========================================================================= */}
              {/* SCREEN 1: PRIMARY FLIGHT DISPLAY (PFD) - ABOUT & BIO */}
              {/* ========================================================================= */}
              <div
                onClick={() => setActiveTab('pfd')}
                className={`w-[28%] h-full rounded border-2 p-3 transition-all flex flex-col justify-between overflow-hidden relative cursor-pointer ${activeTab === 'pfd'
                  ? 'border-[#00d2ff] bg-[#0b0d10] shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                  : 'border-slate-800 bg-[#090b0d] opacity-50 hover:opacity-80'
                  }`}
              >
                {/* Horizontal Attitude Gyro Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col justify-between py-12">
                  <div className="w-full h-px bg-[#00d2ff]" />
                  <div className="w-full h-px bg-[#00d2ff]" />
                  {/* Central horizon circle */}
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 border border-dashed border-[#00d2ff] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 border border-[#00d2ff] rounded-full" />
                  </div>
                </div>

                {/* Airspeed & Altitude Tapes */}
                <div className="absolute left-1.5 top-8 bottom-8 w-6 bg-slate-950 border border-slate-800 rounded flex flex-col justify-between py-2 items-center text-[7px] font-mono text-[#00d2ff]">
                  <span>140</span>
                  <span>120</span>
                  <span className="bg-[#ff3333] text-white px-0.5 font-bold rounded">100</span>
                  <span>80</span>
                  <span>60</span>
                </div>
                <div className="absolute right-1.5 top-8 bottom-8 w-6 bg-slate-950 border border-slate-800 rounded flex flex-col justify-between py-2 items-center text-[7px] font-mono text-[#00d2ff]">
                  <span>2400</span>
                  <span>2200</span>
                  <span className="bg-[#00d2ff] text-slate-950 px-0.5 font-bold rounded">2000</span>
                  <span>1800</span>
                  <span>1600</span>
                </div>

                {/* Glass Cockpit HUD header */}
                <div className="flex justify-between items-center font-mono text-[8px] text-[#00d2ff] border-b border-sky-500/20 pb-1.5 z-10">
                  <span className="flex items-center gap-1"><Activity size={10} /> PFD v1.2</span>
                  <span className="text-[#ff3333] font-bold">SPD 100KT</span>
                </div>

                {/* About Profile Content */}
                <div className="my-auto px-6 space-y-4 text-center z-10">
                  <div>
                    <h1 className="text-xl font-extrabold uppercase tracking-tight text-white">
                      {personal.name}
                    </h1>
                    <p className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase tracking-wider mt-1">
                      {personal.title}
                    </p>
                  </div>

                  <div className="text-left bg-black/40 border border-slate-800/80 p-3 rounded space-y-2.5">
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {personal.bio}
                    </p>
                    {personal.tagline && (
                      <p className="text-[9px] italic text-[#00d2ff]">
                        "{personal.tagline}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center font-mono text-[9px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-[#00d2ff]" /> {personal.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={10} className="text-[#00d2ff]" /> {personal.email}
                    </span>
                  </div>
                </div>

                {/* Pitch Ladder indicators */}
                <div className="flex justify-between items-center font-mono text-[7px] text-slate-500 border-t border-sky-500/10 pt-1.5 z-10">
                  <span>HDG 320°</span>
                  <span>AP LOCK</span>
                  <span>VS +200</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SCREEN 2: MULTIFUNCTION DISPLAY (MFD) - PROJECTS */}
              {/* ========================================================================= */}
              <div
                onClick={() => setActiveTab('mfd')}
                className={`w-[44%] h-full rounded border-2 p-3 transition-all flex flex-col justify-between overflow-hidden relative cursor-pointer ${activeTab === 'mfd'
                  ? 'border-[#00d2ff] bg-[#0b0d10] shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                  : 'border-slate-800 bg-[#090b0d] opacity-50 hover:opacity-80'
                  }`}
              >
                {/* HUD Header */}
                <div className="flex justify-between items-center font-mono text-[8px] text-[#00d2ff] border-b border-sky-500/20 pb-1.5 z-10">
                  <span className="flex items-center gap-1"><Layers size={10} /> MFD // MULTIFUNCTION DISPLAY</span>
                  <span className="text-[#00d2ff]">RADAR SWEEP ONLINE</span>
                </div>

                {/* Radar Grid Graphic backdrop */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                  <div className="w-80 h-80 border-4 border-[#00d2ff] rounded-full flex items-center justify-center">
                    <div className="w-60 h-60 border-2 border-[#00d2ff] rounded-full flex items-center justify-center">
                      <div className="w-40 h-40 border border-[#00d2ff] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Main Interactive Radar Projects Panel */}
                <div className="flex-1 grid grid-cols-12 gap-3 my-3 z-10 overflow-hidden">

                  {/* Radial flight targets selector (Left Col) */}
                  <div className="col-span-4 flex flex-col justify-center gap-2 border-r border-slate-800/80 pr-2">
                    <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1">Radar Targets</span>
                    {projects.map((proj, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(idx);
                          setActiveTab('mfd');
                        }}
                        className={`font-mono text-[9px] text-left p-2 rounded border flex items-center justify-between transition-all cursor-pointer ${selectedProject === idx
                          ? 'bg-[#00d2ff]/10 border-[#00d2ff] text-[#00d2ff] font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                      >
                        <span className="truncate">TGT_{idx + 1}: {proj.title || proj.name}</span>
                        <ChevronRight size={10} />
                      </button>
                    ))}
                  </div>

                  {/* Selected Project Specs (Right Col) */}
                  <div className="col-span-8 flex flex-col justify-between bg-black/30 border border-slate-800/80 p-3 rounded overflow-y-auto">
                    <div>
                      {/* Subtitle engine grid target stats */}
                      <div className="flex justify-between items-center font-mono text-[8px] text-[#00d2ff] border-b border-slate-800/50 pb-1.5 mb-2">
                        <span>SYS ID: TARGET_0{selectedProject + 1}</span>
                        <span>LATENCY: 12ms</span>
                      </div>

                      <h3 className="text-md font-bold text-white mb-2 uppercase">
                        {projects[selectedProject]?.title || projects[selectedProject]?.name}
                      </h3>
                      <p className="text-[10px] leading-relaxed text-slate-300 font-serif mb-4">
                        {projects[selectedProject]?.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {((projects[selectedProject]?.techStack || projects[selectedProject]?.technologies) || []).map((tech, tIdx) => (
                          <span key={tIdx} className="text-[8px] font-mono border border-[#00d2ff]/20 px-1.5 py-0.5 rounded bg-slate-950 text-[#00d2ff]">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {projects[selectedProject]?.liveUrl && (
                          <a
                            href={projects[selectedProject].liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[9px] font-bold text-slate-950 bg-[#00d2ff] px-2.5 py-1.5 rounded hover:bg-sky-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            RUN SIMULATION <ExternalLink size={10} />
                          </a>
                        )}
                        {projects[selectedProject]?.githubUrl && (
                          <a
                            href={projects[selectedProject].githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[9px] font-bold border border-[#00d2ff]/40 text-[#00d2ff] px-2.5 py-1 rounded hover:bg-[#00d2ff]/10 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            VIEW SOURCE <Github size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle dial readings */}
                <div className="flex justify-between items-center font-mono text-[7px] text-slate-500 border-t border-sky-500/10 pt-1.5 z-10">
                  <span>RADAR COMPASS LOCK ON</span>
                  <span>EICAS SYS CHECK: NORMAL</span>
                  <span>ENG 1: 94% / ENG 2: 94%</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SCREEN 3: NAVIGATION DISPLAY (ND) - EXPERIENCE */}
              {/* ========================================================================= */}
              <div
                onClick={() => setActiveTab('nd')}
                className={`w-[28%] h-full rounded border-2 p-3 transition-all flex flex-col justify-between overflow-hidden relative cursor-pointer ${activeTab === 'nd'
                  ? 'border-[#00d2ff] bg-[#0b0d10] shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                  : 'border-slate-800 bg-[#090b0d] opacity-50 hover:opacity-80'
                  }`}
              >
                {/* HUD Header */}
                <div className="flex justify-between items-center font-mono text-[8px] text-[#00d2ff] border-b border-sky-500/20 pb-1.5 z-10">
                  <span className="flex items-center gap-1"><Navigation size={10} /> ND // NAV FLIGHT PLAN MAP</span>
                  <span className="text-[#00d2ff]">GPS AUTOSTEER</span>
                </div>

                {/* Interactive Flightplan waypoint maps */}
                <div className="flex-1 flex flex-col my-3 gap-2 overflow-hidden z-10">
                  {/* Waypoints line map */}
                  <div className="h-[22%] bg-black/40 border border-slate-800/80 rounded p-2 flex items-center justify-around relative overflow-hidden">
                    <div className="absolute w-[80%] h-0.5 bg-dashed border-t border-sky-500/30 top-1/2 left-10 -translate-y-1/2 pointer-events-none" />
                    {experience.map((exp, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWaypoint(idx);
                          setActiveTab('nd');
                        }}
                        className={`relative z-10 px-2 py-1 rounded border font-mono text-[8px] flex flex-col items-center cursor-pointer ${selectedWaypoint === idx
                          ? 'bg-[#00d2ff] text-slate-950 font-bold border-[#00d2ff]'
                          : 'bg-slate-950 border-slate-800 text-[#00d2ff]'
                          }`}
                      >
                        <Compass size={8} className="mb-0.5 animate-spin" style={{ animationDuration: selectedWaypoint === idx ? '6s' : '15s' }} />
                        <span>WP_0{idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* Waypoint details */}
                  <div className="flex-1 bg-black/30 border border-slate-800/80 p-3 rounded flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[8px] text-[#00d2ff] border-b border-slate-800/60 pb-1 mb-2">
                        <span>WAYPOINT STATS</span>
                        <span>DIST: {140 + selectedWaypoint * 60}NM</span>
                      </div>

                      <h3 className="text-xs font-bold text-white uppercase mb-1">
                        {experience[selectedWaypoint]?.role || experience[selectedWaypoint]?.position}
                      </h3>
                      <h4 className="text-[9px] font-mono font-bold text-[#00d2ff] uppercase mb-2">
                        @{experience[selectedWaypoint]?.company}
                      </h4>
                      <p className="text-[10px] leading-relaxed text-slate-300 font-serif">
                        {experience[selectedWaypoint]?.description}
                      </p>
                    </div>

                    <div className="font-mono text-[9px] text-[#ff3333] border border-[#ff3333]/20 py-0.5 px-2 bg-[#ff3333]/5 rounded mt-2 text-right">
                      ACTIVE TIME: {experience[selectedWaypoint]?.period || experience[selectedWaypoint]?.startDate}
                    </div>
                  </div>
                </div>

                {/* Subtitle dial indicators */}
                <div className="flex justify-between items-center font-mono text-[7px] text-slate-500 border-t border-sky-500/10 pt-1.5 z-10">
                  <span>GPS LOCK ON WP_0{selectedWaypoint + 1}</span>
                  <span>ETE: 1H 45M</span>
                  <span>WPT NAV COMPLETED</span>
                </div>
              </div>

            </div>

            {/* Bottom Console Panel with Control Display Unit (CDU / Contact Comms) */}
            <div className="w-full h-[32%] bg-[#121417] border-t-4 border-[#1c1f24] p-4 flex gap-6 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.6)]">

              {/* CDU (Control Display Unit) CRT Screen */}
              <div className="w-[45%] h-full bg-slate-950 border border-slate-800 rounded p-4 font-mono text-emerald-400 flex flex-col justify-between shadow-[inset_0_2px_10px_rgba(0,0,0,0.95)] relative overflow-hidden">
                {/* CRT screen raster lines overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

                <div className="flex justify-between items-center text-[8px] text-[#00d2ff] border-b border-sky-500/20 pb-1">
                  <span>FMC COMMS CONTROL UNIT</span>
                  <span>ACTIVE VHF-1</span>
                </div>

                <div className="flex-1 grid grid-cols-12 gap-2 my-2 text-[9px]">
                  {/* Left coordinates labeled */}
                  <div className="col-span-7 space-y-1.5 py-1">
                    <div className="text-slate-500 text-[8px]">ACTIVE CO-ORDINATES // CONTACT</div>
                    {socials.github && (
                      <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-white transition-colors">
                        <Github size={12} className="text-[#00d2ff]" /> <span>GITHUB // LINK</span>
                      </a>
                    )}
                    {socials.linkedin && (
                      <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-white transition-colors">
                        <Linkedin size={12} className="text-[#00d2ff]" /> <span>LINKEDIN // PROFILE</span>
                      </a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-white transition-colors">
                        <Twitter size={12} className="text-[#00d2ff]" /> <span>TWITTER // LOGS</span>
                      </a>
                    )}
                  </div>

                  {/* Right coordinates input screen */}
                  <div className="col-span-5 border-l border-slate-800 pl-3 flex flex-col justify-between">
                    <div>
                      <div className="text-slate-500 text-[8px]">CORE ARSENAL</div>
                      <div className="flex flex-wrap gap-1 mt-1.5 max-h-12 overflow-y-auto pr-1">
                        {skills.slice(0, 4).map((skill, idx) => {
                          const skillName = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <span key={idx} className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 px-1 py-0.5 rounded text-[8px] font-bold uppercase truncate max-w-full">
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[#00d2ff] font-bold text-[8px] text-right">
                      FREQ 121.50 MHz
                    </div>
                  </div>
                </div>

                <div className="text-[7px] text-slate-500 flex justify-between">
                  <span>CDU COMMS UNIT v4.8</span>
                  <span>CAPTAIN SEAT ENABLED</span>
                </div>
              </div>

              {/* CDU Tactile alphanumeric button layout */}
              <div className="flex-1 h-full bg-[#1e2229] border border-slate-700/50 rounded p-3 grid grid-cols-12 gap-2 items-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]">

                {/* FMC Left side line select keys */}
                <div className="col-span-2 flex flex-col gap-1.5 justify-around h-full py-1">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i === 1 ? 'pfd' : i === 2 ? 'mfd' : i === 3 ? 'nd' : 'cdu')}
                      className="w-8 h-4 bg-slate-900 border border-slate-700 rounded-sm hover:bg-[#00d2ff]/20 transition-all cursor-pointer"
                    />
                  ))}
                </div>

                {/* Main letter pad buttons */}
                <div className="col-span-8 h-full grid grid-cols-6 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'].map((char) => (
                    <button
                      key={char}
                      onClick={() => {
                        if (char === 'B') setActiveTab('pfd');
                        if (char === 'P') setActiveTab('mfd');
                        if (char === 'W') setActiveTab('nd');
                        if (char === 'C') setActiveTab('cdu');
                      }}
                      className="bg-[#2a303a] border border-slate-700/80 rounded-sm text-[8px] font-bold font-mono text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center p-1 active:scale-90 transition-transform cursor-pointer"
                    >
                      {char}
                    </button>
                  ))}
                </div>

                {/* FMC Right side function select keys */}
                <div className="col-span-2 flex flex-col gap-1.5 justify-around h-full py-1">
                  {['INIT', 'RTE', 'DEP', 'ARR'].map((fn, idx) => (
                    <button
                      key={fn}
                      onClick={() => setActiveTab(idx === 0 ? 'pfd' : idx === 1 ? 'mfd' : idx === 2 ? 'nd' : 'cdu')}
                      className="h-4 bg-[#2a303a] border border-slate-700 rounded-sm text-[7px] font-bold font-mono text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                    >
                      {fn}
                    </button>
                  ))}
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* 2D HUD Speech Dialogue Overlay (Centred at the bottom to prevent clipping, rendered at root level) */}
      {stage === 'door-approach' && (
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[#0c1017]/95 border-2 border-sky-400/60 text-white px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,210,255,0.3)] font-mono text-xs w-[450px] max-w-[90%] text-center z-[100] backdrop-blur-md"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, 10] }}
          transition={{
            duration: 5.5,
            times: [0, 0.08, 0.9, 1.0],
            ease: 'easeInOut'
          }}
        >
          <div className="font-bold text-[#00d2ff] mb-1.5 tracking-wider text-sm">PURSER // FLIGHT CREW</div>
          "Welcome aboard, Captain. Flight deck systems are fully calibrated for departure."
        </motion.div>
      )}
    </div>
  );
}
