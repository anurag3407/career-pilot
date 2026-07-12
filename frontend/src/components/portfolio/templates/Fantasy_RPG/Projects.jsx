import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Shield,
  Scroll,
  BookOpen,
  Sparkles,
  Trophy,
  Coins,
  Flame,
  Heart,
  Wand2,
  Skull,
  Gem,
  ExternalLink,
  Github,
  Lock,
  Compass,
  Volume2,
  VolumeX,
  RefreshCw,
  Award
} from 'lucide-react';
import "./Projects.css";

// Dynamic Fallback Projects styled for Fantasy RPG theme
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "THE MERCHANT'S BAZAAR",
    description: "A legendary full-stack marketplace featuring real-time merchant trading, cart enchantments, secure payment sigils, and a dynamic merchant ledger.",
    techStack: ["React", "Node.js", "GraphQL", "Stripe API"],
    liveUrl: "https://example.com/bazaar",
    githubUrl: "https://github.com/example/bazaar",
    featured: true,
    category: "Arcane Scrolls",
    difficulty: "LEGENDARY",
    difficultyColor: "text-red-500 border-red-500 bg-red-950/40",
    xpReward: 950,
    goldReward: 350,
    lore: "Forged in the fires of heavy user traffic, this bazaar has stood undefeated against 10,000 concurrent shopping requests."
  },
  {
    id: 2,
    title: "THE ARCHMAGE'S ORACLE",
    description: "An AI-powered knowledge scroll utilizing advanced LLM magic to answer complex arcane queries, translate ancient runes, and generate sorcery scripts.",
    techStack: ["Next.js", "Python", "OpenAI API", "Vector DB"],
    liveUrl: "https://example.com/oracle",
    githubUrl: "https://github.com/example/oracle",
    featured: true,
    category: "Arcane Scrolls",
    difficulty: "EPIC",
    difficultyColor: "text-purple-400 border-purple-500 bg-purple-950/40",
    xpReward: 800,
    goldReward: 240,
    lore: "Whispers say the oracle holds the answers to the universe, cached at the edge for ultra-low response latency."
  },
  {
    id: 3,
    title: "FORTRESS SENTINEL",
    description: "A containerized network shield that repels cyber-goblins, visualizes real-time siege telemetry, and sounds deep alerts when castle gates are breached.",
    techStack: ["Go", "Docker", "Prometheus", "Slack API"],
    liveUrl: "https://example.com/sentinel",
    githubUrl: "https://github.com/example/sentinel",
    featured: false,
    category: "War Forge",
    difficulty: "RARE",
    difficultyColor: "text-blue-400 border-blue-500 bg-blue-950/40",
    xpReward: 600,
    goldReward: 150,
    lore: "No malicious packages shall pass this gateway. The firewall sentinel stands ever vigilant, consuming minimal RAM."
  },
  {
    id: 4,
    title: "ALCHEMIST'S COMPANION",
    description: "A mobile potion-brewing tracker featuring offline inventory storage, barcode scanners for rare herbs, and interactive elemental combination charts.",
    techStack: ["React Native", "SQLite", "Tailwind CSS"],
    liveUrl: "https://example.com/alchemist",
    githubUrl: "https://github.com/example/alchemist",
    featured: false,
    category: "Rogue's Cloak",
    difficulty: "COMMON",
    difficultyColor: "text-green-400 border-green-500 bg-green-950/40",
    xpReward: 400,
    goldReward: 80,
    lore: "Brewing stamina potions offline was never this easy. Synchronizes immediately when returning to standard dimensions."
  },
  {
    id: 5,
    title: "DUNGEON MAP MAPPER",
    description: "A high-performance procedurally generated graph visualizer that routes paths through coordinate maps, helping adventurers find optimal loot paths.",
    techStack: ["TypeScript", "HTML5 Canvas", "WebAssembly"],
    liveUrl: "https://example.com/mapper",
    githubUrl: "https://github.com/example/mapper",
    featured: false,
    category: "War Forge",
    difficulty: "RARE",
    difficultyColor: "text-blue-400 border-blue-500 bg-blue-950/40",
    xpReward: 650,
    goldReward: 180,
    lore: "Find the shortest route to chests while dodging structural traps. Compiled directly to machine code for maximum speed."
  }
];

const ensureAbsoluteUrl = (url) => {
  if (!url || url === "#") return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export default function Projects({
  projects = DEFAULT_PROJECTS,
  title = "ACTIVE QUEST BOARD",
  subtitle = "EMBARK ON MY CREATIVE ADVENTURES AND CLAIM TREASURE"
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [characterStats, setCharacterStats] = useState({
    level: 42,
    xp: 6800,
    maxXp: 10000,
    hp: 92,
    maxHp: 100,
    mana: 80,
    maxMana: 100,
    gold: 1420
  });

  const [d20State, setD20State] = useState({
    isRolling: false,
    currentRoll: null,
    flavorText: "Roll the D20 in the Tavern to test your fortune!",
    luckBonus: 0
  });

  const [equippedWeapon, setEquippedWeapon] = useState("Amulet of React Hooks");
  const [showInventory, setShowInventory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for fade-in effect
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

  // Slowly regenerate mana in background
  useEffect(() => {
    const timer = setInterval(() => {
      setCharacterStats((prev) => ({
        ...prev,
        mana: Math.min(prev.maxMana, prev.mana + 1)
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Inventory Weapons List
  const WEAPONS = [
    { name: "Amulet of React Hooks", desc: "Reduces React re-render fatigue. (+10 Intellect)" },
    { name: "Sword of Clean Code", desc: "Strikes down technical debt with swift refactoring. (+15 Strength)" },
    { name: "Shield of TypeScript", desc: "Protects against dangerous runtime errors. (+20 Defense)" },
    { name: "Dagger of Tailwind CSS", desc: "Delivers incredibly rapid styling strikes. (+12 Agility)" }
  ];

  // Roll D20 Game logic
  const handleD20Roll = () => {
    if (d20State.isRolling) return;

    setD20State((prev) => ({ ...prev, isRolling: true }));

    // Spend 15 Mana to roll
    if (characterStats.mana < 15) {
      setD20State({
        isRolling: false,
        currentRoll: null,
        flavorText: "Insufficient Mana! Meditate for a few seconds to restore mana reserves.",
        luckBonus: 0
      });
      return;
    }

    setCharacterStats((prev) => ({ ...prev, mana: Math.max(0, prev.mana - 15) }));

    let counter = 0;
    const interval = setInterval(() => {
      // Simulate random numbers during spin
      setD20State((prev) => ({
        ...prev,
        currentRoll: Math.floor(Math.random() * 20) + 1
      }));
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        
        // Final Roll
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        let outcomeText = "";
        let goldChange = 0;
        let xpChange = 0;
        let hpChange = 0;

        if (finalRoll === 20) {
          outcomeText = "✨ CRITICAL SUCCESS! The gods of compilation smile upon you. Granted 'Fabled Keyboard' stat! (+250 XP, +100 Gold)";
          xpChange = 250;
          goldChange = 100;
        } else if (finalRoll >= 17) {
          outcomeText = "🔥 GREAT SUCCESS! You resolved a merge conflict without needing git revert. (+150 XP, +50 Gold)";
          xpChange = 150;
          goldChange = 50;
        } else if (finalRoll >= 13) {
          outcomeText = "📜 SUCCESS! You found a working snippet on StackOverflow. It works, and nobody knows why. (+100 XP)";
          xpChange = 100;
        } else if (finalRoll >= 9) {
          outcomeText = "🛡️ AVERAGE! A goblin QA tester finds a minor bug, but you patch it immediately. (-10 Stamina/HP)";
          hpChange = -10;
        } else if (finalRoll >= 3) {
          outcomeText = "💀 FAILURE! Syntax error blocks your path. You spend hours searching for a missing semicolon. (-15 Stamina/HP, -30 Gold)";
          hpChange = -15;
          goldChange = -30;
        } else {
          outcomeText = "🌪️ CRITICAL FAIL! Goblins set fire to your node_modules directory. (-25 Stamina/HP, -100 Gold)";
          hpChange = -25;
          goldChange = -100;
        }

        setD20State({
          isRolling: false,
          currentRoll: finalRoll,
          flavorText: outcomeText,
          luckBonus: finalRoll >= 13 ? 10 : -5
        });

        // Apply stat changes
        setCharacterStats((prev) => {
          const nextHp = Math.max(1, Math.min(prev.maxHp, prev.hp + hpChange));
          const nextGold = Math.max(0, prev.gold + goldChange);
          let nextXp = prev.xp + xpChange;
          let nextLevel = prev.level;
          if (nextXp >= prev.maxXp) {
            nextXp = nextXp - prev.maxXp;
            nextLevel += 1;
          }
          return {
            ...prev,
            hp: nextHp,
            gold: nextGold,
            xp: nextXp,
            level: nextLevel
          };
        });
      }
    }, 100);
  };

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>

      <section
        id="projects"
        ref={sectionRef}
        className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-b-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Subtle Magical Particle Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Top Archway / Medieval Border SVG */}
        <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center opacity-40">
          <div className="w-full max-w-7xl border-b border-double border-amber-700/40 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-6 bg-[#0a090e] border border-amber-700/50 rounded-full flex items-center justify-center">
              <span className="text-amber-500 font-fantasy-game text-xs">◆</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          
          {/* ──────────────── CHARACTER STATUS HUD (RPG Dashboard) ──────────────── */}
          <div className="w-full max-w-5xl bg-[#121118]/90 border-2 border-[#302718] p-4 rounded-xl mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative rpg-proj-gold-border-glow">
            {/* HUD Metal Ornaments */}
            <div className="metal-corner-tl" />
            <div className="metal-corner-tr" />
            <div className="metal-corner-bl" />
            <div className="metal-corner-br" />

            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
              {/* Level & Class Badges */}
              <div className="md:col-span-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-amber-900/40 pb-4 md:pb-0 md:pr-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-amber-950 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)]">
                  <span className="font-fantasy-game text-[10px] text-amber-300 tracking-wider">LVL</span>
                  <span className="font-fantasy-game text-xl text-amber-100 font-bold leading-none">{characterStats.level}</span>
                </div>
                <div>
                  <h4 className="font-fantasy-title text-sm font-bold text-amber-300 tracking-wide uppercase">THE ADVENTURER</h4>
                  <p className="font-fantasy-game text-xs text-amber-500/80">Fullstack Alchemist</p>
                </div>
              </div>

              {/* Character Bars (HP / MANA) */}
              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Health/Stamina Bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-fantasy-game">
                    <span className="flex items-center gap-1 text-red-400">
                      <Heart className="w-3.5 h-3.5 fill-red-950 text-red-500" />
                      HEALTH / STAMINA
                    </span>
                    <span className="text-red-300 font-bold">{characterStats.hp} / {characterStats.maxHp}</span>
                  </div>
                  <div className="w-full h-3 bg-red-950/70 border border-red-800 rounded overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-red-700 to-rose-500 rounded transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      style={{ width: `${(characterStats.hp / characterStats.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mana Bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-fantasy-game">
                    <span className="flex items-center gap-1 text-sky-400">
                      <Wand2 className="w-3.5 h-3.5 text-sky-400" />
                      MANA (AUTOREGEN)
                    </span>
                    <span className="text-sky-300 font-bold">{characterStats.mana} / {characterStats.maxMana}</span>
                  </div>
                  <div className="w-full h-3 bg-sky-950/70 border border-sky-800 rounded overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-sky-700 to-cyan-500 rounded transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      style={{ width: `${(characterStats.mana / characterStats.maxMana) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* XP, Gold & Inventory Panel */}
              <div className="md:col-span-3 flex items-center justify-between border-t md:border-t-0 md:border-l border-amber-900/40 pt-4 md:pt-0 md:pl-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-fantasy-game text-xs text-amber-300">
                    <Coins className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span>GOLD:</span>
                    <span className="text-amber-100 font-bold">{characterStats.gold} g</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] font-fantasy-game text-amber-400/80">
                      <span>EXP: {characterStats.xp} XP</span>
                      <span>{characterStats.maxXp} MAX</span>
                    </div>
                    <div className="w-32 h-1.5 bg-amber-950 border border-amber-800/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${(characterStats.xp / characterStats.maxXp) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button type="button"
                    onClick={() => setShowInventory(!showInventory)}
                    className="flex flex-col items-center justify-center p-2.5 bg-amber-900/30 hover:bg-amber-900/60 border border-amber-700/60 rounded-lg text-amber-400 hover:text-amber-200 transition-all shadow-[2px_2px_4px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-fantasy-game text-[8px] mt-1 tracking-wider uppercase">ARSENAL</span>
                  </button>

                  {/* Character Inventory Dropdown Popover */}
                  {showInventory && (
                    <div className="absolute right-0 top-14 w-64 bg-[#18171f] border-2 border-amber-600 rounded-xl shadow-2xl p-4 z-40 metal-corner-tl metal-corner-tr metal-corner-bl metal-corner-br">
                      <div className="flex items-center justify-between border-b border-amber-900/60 pb-2 mb-2">
                        <span className="font-fantasy-title text-xs font-bold text-amber-400">EQUIPPED ARSENAL</span>
                        <span className="font-fantasy-game text-[9px] text-amber-500">ATTRIBUTES ACTIVE</span>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {WEAPONS.map((w) => {
                          const isEquipped = equippedWeapon === w.name;
                          return (
                            <div
                              key={w.name}
                              onClick={() => {
                                setEquippedWeapon(w.name);
                                setShowInventory(false);
                              }}
                              className={`p-2 border rounded-lg cursor-pointer transition-all ${
                                isEquipped
                                  ? 'bg-amber-900/20 border-amber-500 text-amber-200'
                                  : 'bg-black/40 border-amber-900/40 text-amber-400/60 hover:text-amber-300 hover:bg-amber-900/10'
                              }`}
                            >
                              <div className="flex items-center justify-between font-fantasy-game text-[10px] font-bold">
                                <span>{w.name}</span>
                                {isEquipped && <span className="text-emerald-400 text-[8px] uppercase tracking-wider">EQUIPPED</span>}
                              </div>
                              <p className="font-fantasy-body text-[9px] mt-1 text-amber-100/40 leading-tight">{w.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────── THEMED ROYAL BOARD DECREE / HEADER ──────────────── */}
          <div className="relative w-full max-w-4xl flex flex-col items-center text-center mb-16 px-4">
            <div className="absolute -top-12 opacity-10 pointer-events-none">
              <Scroll className="w-48 h-48 text-amber-300" />
            </div>

            <div className="flex items-center gap-4 mb-3">
              <Swords className="w-7 h-7 text-amber-500 animate-pulse" />
              <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
                TAVERN TASK
              </span>
              <Swords className="w-7 h-7 text-amber-500 animate-pulse" />
            </div>

            <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {title}
            </h2>

            <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
              {subtitle}
            </p>

            {/* Ancient divider SVG */}
            <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="text-amber-500/60 font-fantasy-game">✦</span>
              <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>
          </div>

          {/* ──────────────── TAVERN DICE ROLLER GAME (EASTER EGG) ──────────────── */}
          <div className="w-full max-w-5xl bg-[#14121a] border border-[#2b221a] rounded-2xl p-6 mb-12 shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col lg:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-700/5 to-transparent pointer-events-none" />

            {/* Spinner Container */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer" onClick={handleD20Roll}>
                <div className={`w-28 h-28 flex items-center justify-center text-amber-100 font-fantasy-game font-bold text-3xl select-none transition-all duration-300 relative z-20 ${
                  d20State.isRolling ? 'dice-anim' : 'hover:scale-105 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                }`}>
                  {/* Custom 20-sided D20 Die SVG */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500/90 hover:text-amber-400 fill-black/60 stroke-amber-600 stroke-[1.5] transition-all">
                    <polygon points="50,2 95,28 95,72 50,98 5,72 5,28" />
                    <polygon points="50,2 50,30 95,28" />
                    <polygon points="95,28 50,30 73,50" />
                    <polygon points="95,28 73,50 95,72" />
                    <polygon points="95,72 73,50 50,75" />
                    <polygon points="95,72 50,75 50,98" />
                    <polygon points="50,98 50,75 5,72" />
                    <polygon points="5,72 27,50 50,75" />
                    <polygon points="5,72 5,28 27,50" />
                    <polygon points="5,28 27,50 50,30" />
                    <polygon points="5,28 50,30 50,2" />
                    {/* Inner triangle faces */}
                    <polygon points="50,30 73,50 27,50" />
                    <polygon points="27,50 73,50 50,75" />
                  </svg>
                  {/* Display Roll Value */}
                  <span className="relative z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-black text-amber-300">
                    {d20State.isRolling ? '?' : d20State.currentRoll || '20'}
                  </span>
                </div>
                {/* Glowing spell ring around the D20 */}
                <div className="absolute inset-0 w-28 h-28 border border-dashed border-amber-600/30 rounded-full scale-125 animate-[spin_20s_linear_infinite] pointer-events-none" />
              </div>
              <span className="font-fantasy-game text-[10px] text-amber-500/80 uppercase tracking-widest">
                {d20State.isRolling ? "CHARGING SPELL..." : "ROLL DIE (COST: 15 MANA)"}
              </span>
            </div>

            {/* Fortune result log */}
            <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 font-fantasy-game text-xs text-amber-400">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>TAVERN CHRONICLES</span>
                {d20State.currentRoll && (
                  <span className="bg-amber-900/30 px-2 py-0.5 border border-amber-700/60 text-[10px]">
                    ROLL: <b className="text-amber-200">{d20State.currentRoll}</b>
                  </span>
                )}
              </div>
              <p className="font-fantasy-game text-sm sm:text-base text-amber-100 font-bold leading-relaxed mb-3 min-h-[48px]">
                {d20State.flavorText}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[10px] font-fantasy-game text-amber-500/60">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Equipped: <b className="text-amber-400">{equippedWeapon}</b>
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Fortune buff: <b className={`transition-colors ${
                    d20State.luckBonus > 0 ? 'text-emerald-400' : d20State.luckBonus < 0 ? 'text-red-400' : 'text-amber-400'
                  }`}>{d20State.luckBonus > 0 ? `+${d20State.luckBonus}% Luck` : d20State.luckBonus < 0 ? `${d20State.luckBonus}% Luck` : 'None'}</b>
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────── CATEGORY FILTER SWITCHERS (Tavern Signposts) ──────────────── */}
          <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 bg-[#121118]/80 border border-[#32271c] p-4 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
              <span className="font-fantasy-game text-[10px] text-amber-500 tracking-wider mr-2 uppercase">SELECT QUEST CLASS:</span>
              {categories.map((cat) => (
                <button type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-fantasy-game text-[10px] px-4 py-2 border rounded transition-all cursor-pointer relative uppercase
                    ${
                      activeCategory === cat
                        ? "bg-amber-900/30 text-amber-200 border-amber-500 shadow-[inset_0_0_8px_rgba(212,175,55,0.4)]"
                        : "bg-black/60 text-amber-500/60 border-amber-900/60 hover:text-amber-300 hover:bg-amber-900/10"
                    }`}
                >
                  {cat === "All" ? "ALL ADVENTURES" : cat}
                </button>
              ))}
            </div>

            {/* Quick Stat Highlights */}
            <div className="hidden md:flex items-center gap-4 text-xs font-fantasy-game text-amber-400/80">
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 border border-amber-900/40 rounded">
                <Compass className="w-4 h-4 text-amber-500 animate-spin-slow" />
                QUESTS AVAILABLE: <b className="text-amber-200 ml-1">{filteredProjects.length}</b>
              </span>
            </div>
          </div>

          {/* ──────────────── DYNAMIC QUEST LOG GRID ──────────────── */}
          <div className="w-full max-w-5xl z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => {
                let badgeColor = "border-amber-600/50 bg-amber-950/30 text-amber-400";
                let runeThemeColor = "from-sky-700/20 to-sky-950/40 border-sky-800 text-sky-300";

                if (project.category === "Arcane Scrolls") {
                  runeThemeColor = "from-purple-900/10 to-indigo-950/40 border-purple-800 text-purple-300";
                } else if (project.category === "War Forge") {
                  runeThemeColor = "from-red-900/10 to-rose-950/40 border-rose-800 text-rose-300";
                } else if (project.category === "Rogue's Cloak") {
                  runeThemeColor = "from-emerald-900/10 to-teal-950/40 border-emerald-800 text-emerald-300";
                }

                return (
                  <div
                    key={project.id}
                    className="flex flex-col bg-[#121118]/90 border border-[#2b221a] hover:border-amber-500 rounded-xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Metal corner highlights on cards */}
                    <div className="metal-corner-tl opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-tr opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-bl opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-br opacity-30 group-hover:opacity-100 transition-opacity" />

                    {/* Quest Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-fantasy-game text-[9px] text-amber-500/80 tracking-widest uppercase">
                        {project.category}
                      </span>
                      <span className={`font-fantasy-game text-[9px] px-2.5 py-1 border rounded ${project.difficultyColor}`}>
                        {project.difficulty}
                      </span>
                    </div>

                    {/* Quest Card Title */}
                    <h3 className="font-fantasy-title text-base sm:text-lg font-bold text-amber-200 mb-2 group-hover:text-amber-400 transition-colors uppercase tracking-wide">
                      {project.title}
                    </h3>

                    {/* Lore text italic block */}
                    <p className="font-fantasy-body italic text-[11px] text-amber-500/60 leading-normal border-l-2 border-amber-900/60 pl-3 mb-4">
                      "{project.lore}"
                    </p>

                    {/* Quest Task Description */}
                    <p className="font-fantasy-body text-xs text-amber-100/60 leading-relaxed mb-6 flex-grow">
                      {project.description}
                    </p>

                    {/* Tech runes / enchantments inventory */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-fantasy-game text-[9px] text-amber-300 bg-black/60 border border-amber-900/60 px-2.5 py-1 rounded"
                        >
                          RUNE: {tech.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Quest Loot / Rewards values */}
                    <div className="flex items-center justify-between border-t border-amber-900/40 pt-4 mb-5">
                      <span className="font-fantasy-game text-[9px] text-amber-500/70 tracking-wider">REWARDS:</span>
                      <div className="flex items-center gap-4 text-[10px] font-fantasy-game text-amber-400">
                        <span className="flex items-center gap-1">
                          <Gem className="w-3.5 h-3.5 text-sky-400" />
                          <span>+{project.xpReward} XP</span>
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Coins className="w-3.5 h-3.5" />
                          <span>+{project.goldReward}g</span>
                        </span>
                      </div>
                    </div>

                    {/* Quest Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {project.liveUrl && (
                        <a
                          href={ensureAbsoluteUrl(project.liveUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-b from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-100 font-fantasy-game text-[10px] font-bold border border-amber-500/60 rounded shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:text-amber-200 transition-all cursor-pointer text-center"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          EMBARK QUEST
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={ensureAbsoluteUrl(project.githubUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-black/60 hover:bg-[#18161f] text-amber-400/80 hover:text-amber-300 font-fantasy-game text-[10px] border border-amber-900/60 rounded transition-all cursor-pointer text-center"
                        >
                          <Scroll className="w-3.5 h-3.5" />
                          INSPECT SCROLL
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──────────────── EMPTY STATE COMPONENT ──────────────── */}
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 w-full max-w-4xl bg-[#121118] border border-amber-900/60 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.8)] text-center mt-6">
              <Skull className="w-14 h-14 text-red-500 mb-4 animate-bounce" />
              <p className="font-fantasy-game text-sm text-red-400 mb-2 tracking-widest uppercase">AREA LOCKED OR DEFEATED</p>
              <p className="font-fantasy-body text-xs text-amber-100/40 uppercase max-w-xs px-4">
                No quests active in this realm sector yet. Explore other categories or level up!
              </p>
              <button type="button"
                onClick={() => setActiveCategory("All")}
                className="mt-6 font-fantasy-game text-[10px] px-6 py-2.5 border border-amber-500 bg-amber-950/30 hover:bg-amber-900/20 text-amber-300 rounded shadow-md transition-all cursor-pointer uppercase"
              >
                RETURN TO OVERWORLD MAP
              </button>
            </div>
          )}

          {/* ──────────────── PREMIUM RPG FOOTER ORNAMENTS ──────────────── */}
          <div className="w-full max-w-5xl mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-dashed border-amber-900/40 pt-8">
            {/* Spinning Coin / XP Decorator */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-700 border border-amber-200 rounded-full flex items-center justify-center shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)] animate-[spin_5s_linear_infinite] rpg-proj-floating-rune">
                <span className="font-fantasy-game text-[10px] text-amber-950 font-black">g</span>
              </div>
              <p className="font-fantasy-game text-xs text-amber-500/60 uppercase tracking-wide">
                Complete quests to earn gold and legendary experience points
              </p>
            </div>

            {/* Level Up alert bar */}
            <div className="flex items-center gap-2 text-[10px] font-fantasy-game text-amber-500/60 bg-amber-950/10 px-4 py-2 border border-amber-900/30 rounded">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>PARTY LEADER STATS: ACTIVE SPELLS ACTIVE</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
