import React, { useState, useEffect, useRef } from "react";
import {
  Gamepad2,
  Trophy,
  Star,
  ExternalLink,
  Github,
  Coins,
  Flame,
  Shield,
  Heart,
  Tv,
  Grid,
  List,
  Sparkles,
  Zap,
  Code
} from "lucide-react";

// Dynamic Fallback Projects styled for 8-bit arcade themes
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "CYBER QUEST RPG",
    description: "A 2D browser-based multiplayer role-playing game featuring beautiful pixel art, real-time socket synchronization, and web3 smart-contract loot systems.",
    techStack: ["React", "Phaser.js", "Socket.io", "Solidity"],
    liveUrl: "https://example.com/cyberquest",
    githubUrl: "https://github.com/example/cyberquest",
    featured: true,
    category: "Game Dev",
    stats: { stars: 384, forks: 92, score: 98700 },
    difficulty: "BOSS STAGE"
  },
  {
    id: 2,
    title: "RETRO OS SIMULATOR",
    description: "A nostalgic in-browser operating system simulation inspired by classic 80s personal computers. Features customizable themes, shell console, and mini-games.",
    techStack: ["JavaScript", "HTML5", "Tailwind CSS", "WebAudio"],
    liveUrl: "https://example.com/retroos",
    githubUrl: "https://github.com/example/retroos",
    featured: false,
    category: "Web Apps",
    stats: { stars: 219, forks: 45, score: 76400 },
    difficulty: "LVL 5"
  },
  {
    id: 3,
    title: "LEGEND OF API GATEWAY",
    description: "A lightning-fast, ultra-low latency API gateway designed for heavy planetary workloads. Includes interactive live charts and self-healing systems.",
    techStack: ["Go", "Redis", "Docker", "Prometheus"],
    liveUrl: "https://example.com/apigateway",
    githubUrl: "https://github.com/example/apigateway",
    featured: false,
    category: "Backend",
    stats: { stars: 156, forks: 28, score: 54100 },
    difficulty: "LVL 4"
  },
  {
    id: 4,
    title: "PIXEL SYNTH ENGINE",
    description: "A retro chiptune synthesizer utilizing Web Audio API to let users compose, record, and download 8-bit sound loops and gaming sound effects directly in-browser.",
    techStack: ["TypeScript", "WebAudio API", "React", "Canvas"],
    liveUrl: "https://example.com/pixelsynth",
    githubUrl: "https://github.com/example/pixelsynth",
    featured: true,
    category: "Creative",
    stats: { stars: 412, forks: 118, score: 104500 },
    difficulty: "BOSS STAGE"
  },
  {
    id: 5,
    title: "8-BIT PHYSICS ENGINE",
    description: "Rigid-body 2D physics simulation utilizing cellular automata concepts to simulate gravity, collision, and thermal transfer inside a pixel grid.",
    techStack: ["React", "HTML5 Canvas", "C++ WASM", "Tailwind"],
    liveUrl: "https://example.com/physics",
    githubUrl: "https://github.com/example/physics",
    featured: false,
    category: "Systems",
    stats: { stars: 189, forks: 34, score: 68200 },
    difficulty: "LVL 3"
  }
];

const ensureAbsoluteUrl = (url) => {
  if (!url || url === "#") return "#";
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

export default function Projects({
  projects = DEFAULT_PROJECTS,
  title = "CHOOSE YOUR QUEST",
  subtitle = "SELECT A STAGE AND EXPLORE MY CREATIVE ADVENTURES"
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or leaderboard
  const [crtFilter, setCrtFilter] = useState(true);
  const [coinsCount, setCoinsCount] = useState(5);
  const [playerLives, setPlayerLives] = useState(3);
  const [isInserting, setIsInserting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for retro screen fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Set default selected project
  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  // Extract unique categories
  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  // Filter projects
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // Mechanical insert coin trigger
  const handleInsertCoin = () => {
    setIsInserting(true);
    setTimeout(() => {
      setCoinsCount((prev) => prev + 1);
      setIsInserting(false);
    }, 400);
  };

  // Live click interactive easter egg
  const handleHeartClick = (index) => {
    if (playerLives > 1) {
      setPlayerLives((prev) => prev - 1);
    } else {
      setPlayerLives(3); // Reset lives
    }
  };

  return (
    <>
      {/* ──────────────── Injecting Custom Retro Typography and Keyframes ──────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        /* Dynamic Scanline Shimmering */
        @keyframes crt-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pixel-flicker {
          0%, 100% { opacity: 0.99; }
          50% { opacity: 0.95; }
        }
        @keyframes neon-glow-cyan {
          0%, 100% { text-shadow: 0 0 2px #00f0ff, 0 0 10px rgba(0, 240, 255, 0.5); }
          50% { text-shadow: 0 0 6px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.8); }
        }
        @keyframes coin-spin {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
        }
        @keyframes hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        
        .font-retro-title {
          font-family: 'Press Start 2P', monospace;
        }
        .font-retro-body {
          font-family: 'VT323', monospace;
        }
        .retro-scanline::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
          z-index: 40;
        }
        .retro-scanline::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(
            to bottom,
            rgba(0, 240, 255, 0) 0%,
            rgba(0, 240, 255, 0.05) 50%,
            rgba(0, 240, 255, 0) 100%
          );
          animation: crt-scan 8s linear infinite;
          pointer-events: none;
          z-index: 41;
        }
      `}} />

      <section
        id="projects"
        ref={sectionRef}
        className={`relative min-h-screen w-full bg-[#0c051a] py-20 px-4 sm:px-6 lg:px-8 border-t-8 border-b-8 border-black select-none ${
          crtFilter ? "retro-scanline" : ""
        } transition-all duration-300`}
        style={{ animation: "pixel-flicker 0.15s infinite" }}
      >
        {/* ────────────── Retro Space Background Patterns ────────────── */}
        <div className="absolute inset-0 bg-[radial-gradient(#1c0f3a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        
        {/* Glowing Retro Grid Floor (Laser Grid) */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(to_bottom,transparent,rgba(15,5,30,0.9))] pointer-events-none z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col items-center">
          
          {/* ────────────── Arcade Machine Header / Title Marquee ────────────── */}
          <div className="w-full max-w-4xl bg-neutral-900 border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            {/* Red glowing status bulb */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 border border-neutral-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="font-retro-title text-[8px] text-red-500 tracking-wider">LIVE</span>
            </div>

            {/* Glowing neon decorative top band */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-yellow-400 via-cyan-400 to-violet-500 bg-[length:200%_auto] animate-shimmer" />

            <div className="flex flex-col items-center text-center mt-2">
              <div className="flex items-center gap-3 mb-2 animate-bounce">
                <Gamepad2 className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" />
                <span className="font-retro-title text-[#ffde00] text-[10px] sm:text-xs bg-black px-3 py-1 border-2 border-[#ffde00]">
                  SELECT STAGE
                </span>
                <Gamepad2 className="w-8 h-8 text-[#ff007f] drop-shadow-[0_0_8px_#ff007f]" />
              </div>

              {/* Glowing Arcade Marquee Heading */}
              <h2 className="font-retro-title text-2xl sm:text-3xl md:text-4xl text-white tracking-wider my-3 select-none">
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff007f] to-[#ffde00]"
                  style={{ animation: "neon-glow-cyan 3s infinite" }}
                >
                  {title}
                </span>
              </h2>

              <p className="font-retro-body text-lg md:text-2xl text-neutral-400 max-w-2xl uppercase tracking-wider mt-1">
                {subtitle}
              </p>
            </div>

            {/* Bottom Cabinet Decorative Trim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />
          </div>

          {/* ────────────── Interactive Control Panel ────────────── */}
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-neutral-900 border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000] relative">
            
            {/* Level Select Buttons ("Stage Switcher") */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <span className="font-retro-title text-[9px] text-[#ffde00] mr-2">STAGE SELECT:</span>
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-retro-title text-[9px] px-3.5 py-2 border-2 border-black transition-all cursor-pointer relative
                    ${
                      activeCategory === cat
                        ? "bg-[#00f0ff] text-black shadow-[2px_2px_0px_0px_#000000] translate-x-[2px] translate-y-[2px]"
                        : "bg-neutral-800 text-neutral-400 hover:text-white shadow-[4px_4px_0px_0px_#000000] hover:bg-neutral-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000]"
                    }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Cabinet Game Stats Panel */}
            <div className="flex flex-wrap items-center gap-6 self-end md:self-auto">
              {/* Insert Coin Slot & Coin Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleInsertCoin}
                  disabled={isInserting}
                  className={`flex items-center gap-1.5 px-3 py-2 bg-[#ff007f] hover:bg-[#d8006c] text-white border-2 border-black font-retro-title text-[9px] shadow-[4px_4px_0px_0px_#000000] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000] ${
                    isInserting ? "animate-pulse" : ""
                  }`}
                >
                  <Coins className={`w-3.5 h-3.5 ${isInserting ? "animate-spin" : ""}`} />
                  INSERT COIN
                </button>
                <div className="bg-black border-2 border-neutral-700 px-3 py-2 text-center flex items-center gap-2">
                  <span className="font-retro-title text-[9px] text-neutral-400">CREDIT:</span>
                  <span className="font-retro-title text-[9px] text-[#ffde00] w-6 inline-block">
                    {String(coinsCount).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* CRT Scanline Filter Toggle */}
              <button
                onClick={() => setCrtFilter(!crtFilter)}
                className={`flex items-center gap-1.5 px-3 py-2 border-2 border-black font-retro-title text-[9px] shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000000] transition-colors cursor-pointer
                  ${
                    crtFilter
                      ? "bg-neutral-800 text-[#00f0ff]"
                      : "bg-neutral-850 text-neutral-500 border-neutral-800"
                  }`}
              >
                <Tv className="w-3.5 h-3.5" />
                CRT: {crtFilter ? "ON" : "OFF"}
              </button>

              {/* Toggle Game View Layout Mode */}
              <div className="flex rounded-md overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-[#00f0ff] text-black" : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("leaderboard")}
                  className={`p-2 transition-colors cursor-pointer ${
                    viewMode === "leaderboard" ? "bg-[#00f0ff] text-black" : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                  aria-label="Leaderboard Scoreboard View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Player Hearts / Health Bar */}
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-2 border-2 border-neutral-800 rounded">
                <span className="font-retro-title text-[9px] text-neutral-400 mr-1">LIVES:</span>
                {[...Array(3)].map((_, index) => (
                  <Heart
                    key={index}
                    onClick={() => handleHeartClick(index)}
                    className={`w-3.5 h-3.5 cursor-pointer transition-transform hover:scale-125
                      ${
                        index < playerLives
                          ? "text-red-500 fill-red-500 animate-pulse"
                          : "text-neutral-700"
                      }`}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* ────────────── Dynamic Content Container (Cabinet Screen) ────────────── */}
          <div className="w-full max-w-6xl z-20">
            {viewMode === "grid" ? (
              /* GRID VIEW: Cabinet screen with retro arcade card slots */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, i) => (
                  <div
                    key={project.id}
                    className="flex flex-col bg-[#120a2a] border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:border-[#00f0ff] transition-all relative overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Retro card decorative corner notch */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-black rotate-45 translate-x-4 -translate-y-4 border-b-4 border-l-4 border-black" />

                    {/* Stage badge banner */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#00f0ff]/10 border-2 border-[#00f0ff] flex items-center justify-center">
                          <Code className="w-3.5 h-3.5 text-[#00f0ff]" />
                        </div>
                        <span className="font-retro-title text-[8px] text-[#00f0ff] tracking-wider">
                          {project.category.toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`font-retro-title text-[8px] px-2.5 py-1 border-2 border-black
                          ${
                            project.featured
                              ? "bg-[#ffde00] text-black"
                              : "bg-neutral-800 text-neutral-300"
                          }`}
                      >
                        {project.difficulty}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="font-retro-title text-sm sm:text-base text-white mb-3 tracking-wide truncate group-hover:text-[#00f0ff] transition-colors">
                      {project.title}
                    </h3>

                    {/* Project Description (Fills body) */}
                    <p className="font-retro-body text-lg text-neutral-400 leading-snug mb-5 flex-grow line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Badges / Loot Inventory */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-retro-body text-[13px] text-neutral-300 bg-neutral-900 border border-neutral-700 px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project Stat Values (Stars, Forks) */}
                    <div className="flex items-center justify-between border-t-2 border-dashed border-neutral-800 pt-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#ffde00] fill-[#ffde00]" />
                          <span className="font-retro-title text-[9px] text-[#ffde00]">
                            {project.stats.stars}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 bg-[#ff007f] relative inline-block animate-pulse"
                            style={{ clipPath: "polygon(50% 0%, 100% 35%, 82% 100%, 50% 70%, 18% 100%, 0% 35%)" }}
                          />
                          <span className="font-retro-title text-[9px] text-[#ff007f]">
                            {project.stats.forks}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-black px-2.5 py-0.5 border border-neutral-800">
                        <span className="font-retro-title text-[8px] text-neutral-400">SCORE:</span>
                        <span className="font-retro-title text-[8px] text-[#00f0ff]">
                          {project.stats.score}
                        </span>
                      </div>
                    </div>

                    {/* Mechanical action links */}
                    <div className="flex items-center gap-3 mt-auto">
                      {project.liveUrl && (
                        <a
                          href={ensureAbsoluteUrl(project.liveUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#00f0ff] hover:bg-[#00c5d3] text-black font-retro-title text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <Gamepad2 className="w-3 h-3" />
                          PLAY DEMO
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={ensureAbsoluteUrl(project.githubUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-retro-title text-[9px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <Github className="w-3 h-3" />
                          GET CODE
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LEADERBOARD VIEW: Nostalgic arcade scoreboard table */
              <div className="w-full bg-[#120a2a] border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto relative">
                {/* Board neon trim border */}
                <div className="absolute inset-0 border border-dashed border-[#00f0ff]/30 pointer-events-none" />

                <div className="min-w-[650px]">
                  {/* Table title bar */}
                  <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#ffde00] drop-shadow-[0_0_6px_#ffde00]" />
                      <span className="font-retro-title text-xs sm:text-sm text-[#ffde00] tracking-wide">
                        ALL TIME HIGH SCORES
                      </span>
                    </div>
                    <span className="font-retro-title text-[9px] text-neutral-400">
                      LEVEL SELECT: {activeCategory.toUpperCase()}
                    </span>
                  </div>

                  {/* High Scores Headers */}
                  <div className="grid grid-cols-12 bg-black/60 py-3 px-4 border-2 border-black font-retro-title text-[9px] text-[#00f0ff] mb-2 tracking-wider">
                    <div className="col-span-1 text-center">RANK</div>
                    <div className="col-span-4 pl-4">PROJECT TITLE</div>
                    <div className="col-span-2 text-center">CATEGORY</div>
                    <div className="col-span-2 text-center">RATING</div>
                    <div className="col-span-2 text-right">HI-SCORE</div>
                    <div className="col-span-1 text-center">LINK</div>
                  </div>

                  {/* Scores List rows */}
                  <div className="flex flex-col gap-2">
                    {filteredProjects
                      .sort((a, b) => b.stats.score - a.stats.score)
                      .map((project, index) => {
                        const rank = index + 1;
                        let rankColor = "text-white";
                        let rowBorderColor = "border-neutral-800";
                        if (rank === 1) {
                          rankColor = "text-[#ffde00]"; // Gold
                          rowBorderColor = "border-[#ffde00]";
                        } else if (rank === 2) {
                          rankColor = "text-[#00f0ff]"; // Cyan
                          rowBorderColor = "border-[#00f0ff]/50";
                        } else if (rank === 3) {
                          rankColor = "text-[#ff007f]"; // Pink
                        }

                        return (
                          <div
                            key={project.id}
                            className={`grid grid-cols-12 items-center bg-neutral-900 border-2 ${rowBorderColor} hover:bg-neutral-800/80 transition-colors py-3.5 px-4 font-retro-title text-[10px] sm:text-xs relative`}
                          >
                            {/* Rank Column */}
                            <div className={`col-span-1 text-center font-bold ${rankColor}`}>
                              {rank === 1 ? "1ST" : rank === 2 ? "2ND" : rank === 3 ? "3RD" : `${rank}TH`}
                            </div>

                            {/* Title Column */}
                            <div className="col-span-4 pl-4 text-white font-bold flex items-center gap-2 truncate">
                              <span>{project.title}</span>
                              {project.featured && (
                                <Sparkles className="w-3.5 h-3.5 text-[#ffde00] inline flex-shrink-0" />
                              )}
                            </div>

                            {/* Category Column */}
                            <div className="col-span-2 text-center font-retro-body text-lg text-[#00f0ff]">
                              {project.category}
                            </div>

                            {/* Stars Rating Column */}
                            <div className="col-span-2 flex items-center justify-center gap-1 text-[#ffde00]">
                              <Star className="w-3.5 h-3.5 fill-[#ffde00]" />
                              <span>{project.stats.stars}</span>
                            </div>

                            {/* High Score Stats */}
                            <div className="col-span-2 text-right text-[#ffde00] font-bold font-retro-body text-xl">
                              {project.stats.score.toLocaleString()} PTS
                            </div>

                            {/* Play Link Actions */}
                            <div className="col-span-1 flex items-center justify-center gap-3">
                              {project.liveUrl && (
                                <a
                                  href={ensureAbsoluteUrl(project.liveUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neutral-400 hover:text-[#00f0ff] transition-colors"
                                  title="Play Demo"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={ensureAbsoluteUrl(project.githubUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neutral-400 hover:text-white transition-colors"
                                  title="View Code"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ────────────── Empty State Handler ────────────── */}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl bg-neutral-900 border-4 border-black shadow-[6px_6px_0px_0px_#000000] text-center mt-6">
              <Shield className="w-12 h-12 text-[#ff007f] mb-4 animate-bounce" />
              <p className="font-retro-title text-xs text-[#ff007f] mb-2">ERROR: AREA LOCK</p>
              <p className="font-retro-body text-xl text-neutral-400 uppercase max-w-sm px-4">
                No quests completed in this sector yet. Keep building!
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-6 font-retro-title text-[9px] px-4 py-2 border-2 border-black bg-[#00f0ff] hover:bg-[#00c5d3] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                RETURN TO LOBBY
              </button>
            </div>
          )}

          {/* ────────────── Premium Arcade Bottom Visuals ────────────── */}
          <div className="w-full max-w-6xl mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t-4 border-dashed border-neutral-800 pt-8 z-20">
            {/* Spinning Coin SVG Decorator */}
            <div className="flex items-center gap-3">
              <div 
                className="w-7 h-7 bg-[#ffde00] border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]"
                style={{ animation: "coin-spin 1.8s linear infinite" }}
              >
                <span className="font-retro-title text-[9px] text-black font-bold">$</span>
              </div>
              <p className="font-retro-body text-xl text-neutral-400 uppercase tracking-wide">
                Insert coin to trigger extra character updates and premium slots
              </p>
            </div>

            {/* Arcade Cabinet Controller Decorator */}
            <div className="flex items-center gap-4">
              <span className="font-retro-title text-[8px] text-neutral-500">PLAYER 1 KEYMAP:</span>
              <div className="flex gap-1.5">
                <span className="font-retro-title text-[8px] px-2 py-1.5 bg-neutral-900 border-2 border-black text-neutral-400">W</span>
                <span className="font-retro-title text-[8px] px-2 py-1.5 bg-neutral-900 border-2 border-black text-neutral-400">A</span>
                <span className="font-retro-title text-[8px] px-2 py-1.5 bg-neutral-900 border-2 border-black text-neutral-400">S</span>
                <span className="font-retro-title text-[8px] px-2 py-1.5 bg-neutral-900 border-2 border-black text-neutral-400">D</span>
              </div>
              <div className="flex gap-1.5 ml-2">
                <span className="font-retro-title text-[8px] px-3 py-1.5 bg-red-600 border-2 border-black text-white rounded-full shadow-[2px_2px_0px_0px_#000000]">A</span>
                <span className="font-retro-title text-[8px] px-3 py-1.5 bg-yellow-500 border-2 border-black text-white rounded-full shadow-[2px_2px_0px_0px_#000000]">B</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
