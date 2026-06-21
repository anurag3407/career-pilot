import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import logger from '../../../../utils/logger';
import {
  Sparkles,
  Trophy,
  Coins,
  Crown,
  Play,
  RefreshCw,
  Award,
  Volume2,
  VolumeX,
  Flame,
  User
} from "lucide-react";

// Technical Badges representing symbols on the Slot Machine reels
const SYMBOLS = [
  {
    id: "react",
    label: "React",
    emoji: "⚛️",
    color: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-400/50",
    textColor: "text-cyan-400",
    score: 100,
    milestone: "⚛️ React Architect: Designed 15+ high-performance SPAs with custom Hooks and scalable Context architecture."
  },
  {
    id: "node",
    label: "Node.js",
    emoji: "🟢",
    color: "from-green-400 to-emerald-600",
    glow: "shadow-green-400/50",
    textColor: "text-green-400",
    score: 200,
    milestone: "🟢 Backend Master: Orchestrated production-ready REST & GraphQL microservices with Express & Socket.io."
  },
  {
    id: "css",
    label: "CSS/UI",
    emoji: "🎨",
    color: "from-pink-400 to-rose-500",
    glow: "shadow-pink-400/50",
    textColor: "text-pink-400",
    score: 50,
    milestone: "🎨 UI/UX Virtuoso: Crafted beautiful glassmorphic interfaces, bespoke micro-animations, and fluid responsive designs."
  },
  {
    id: "sql",
    label: "Databases",
    emoji: "💾",
    color: "from-blue-400 to-indigo-600",
    glow: "shadow-blue-400/50",
    textColor: "text-blue-400",
    score: 150,
    milestone: "💾 DB Optimizer: Solved complex PostgreSQL queries, indexed tables, and integrated secure Firebase Firestore schemas."
  },
  {
    id: "js",
    label: "JavaScript",
    emoji: "⚡",
    color: "from-yellow-400 to-amber-500",
    glow: "shadow-yellow-400/50",
    textColor: "text-yellow-400",
    score: 80,
    milestone: "⚡ JS Ninja: Built algorithmic systems, asynchronous data-fetching hooks, and robust object models."
  },
  {
    id: "git",
    label: "DevOps",
    emoji: "🐙",
    color: "from-purple-400 to-fuchsia-600",
    glow: "shadow-purple-400/50",
    textColor: "text-purple-400",
    score: 60,
    milestone: "🐙 CI/CD Champion: Streamlined developer pipelines, automated GitHub actions, and configured instant site deployments."
  }
];

// Pure static helper for spin generation placed outside the React render scope to satisfy react-hooks/purity rules
const generateSpinResult = (isCheatMode) => {
  let targets = [];
  if (isCheatMode) {
    // Cheat mode forces a jackpot match
    const targetSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    targets = [targetSymbol, targetSymbol, targetSymbol];
  } else {
    // Standard mathematical probability
    const prob = Math.random();
    if (prob < 0.20) {
      // 20% Jackpot (3 identical matching symbols)
      const targetSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      targets = [targetSymbol, targetSymbol, targetSymbol];
    } else if (prob < 0.60) {
      // 40% Partial Match (2 identical symbols)
      const matched = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const mixed = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const correctMixed = mixed.id === matched.id ? SYMBOLS[(SYMBOLS.indexOf(mixed) + 1) % SYMBOLS.length] : mixed;
      targets = [matched, matched, correctMixed];
    } else {
      // 40% Completely mixed random items
      const s1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const s2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const s3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      targets = [s1, s2, s3];
    }
  }
  return targets;
};

export default function SlotMachine() {
  // --- STATE ---
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const [isSpinning, setIsSpinning] = useState([false, false, false]);
  const [leverPulled, setLeverPulled] = useState(false);
  
  // Game metrics
  const [credits, setCredits] = useState(1000);
  const [spins, setSpins] = useState(0);
  const [jackpots, setJackpots] = useState(0);
  const [score, setScore] = useState(0);
  
  // Custom features
  const [volumeOn, setVolumeOn] = useState(true);
  const [isCheatMode, setIsCheatMode] = useState(false);
  const [unlockedMilestones, setUnlockedMilestones] = useState([]);
  const [winStatus, setWinStatus] = useState("");

  // Refs for tracking reels intermediate cycles
  const intervalRefs = useRef([null, null, null]);
  const timeoutRefs = useRef([]);
  const audioContextRef = useRef(null);

  const scheduleTimeout = (callback, delay) => {
    const timeoutId = setTimeout(() => {
      const index = timeoutRefs.current.indexOf(timeoutId);
      if (index !== -1) timeoutRefs.current.splice(index, 1);
      callback();
    }, delay);

    timeoutRefs.current.push(timeoutId);
    return timeoutId;
  };

  // --- AUDIO SYNTHESIS ENGINE (Web Audio API) ---
  const playRetroSound = (type) => {
    if (!volumeOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      
      if (type === "tick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "spin") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "win") {
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscNode.type = "sine";
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
          
          gainNode.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.09 + 0.15);
          
          oscNode.start(ctx.currentTime + idx * 0.09);
          oscNode.stop(ctx.currentTime + idx * 0.09 + 0.16);
        });
      } else if (type === "jackpot") {
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscNode.type = "square";
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
          
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.07);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.07 + 0.12);
          
          oscNode.start(ctx.currentTime + idx * 0.07);
          oscNode.stop(ctx.currentTime + idx * 0.07 + 0.14);
        });
      }
    } catch (err) {
      logger.warn('Web Audio Synthesis failed:', err);
    }
  };

  // --- CELEBRATION EFFECTS ---
  const triggerConfetti = (isJackpot) => {
    const config = {
      particleCount: isJackpot ? 180 : 80,
      spread: isJackpot ? 100 : 60,
      origin: { y: 0.65 },
      colors: ["#FBBF24", "#F59E0B", "#EF4444", "#ffffff"]
    };
    confetti(config);
  };

  // --- SPINNING CONTROLLER ---
  const handleSpin = () => {
    // Prevent double clicking while spinning or starting from the lever with no credits.
    if (isSpinning.some(Boolean) || credits <= 0) return;
    
    // Deduct entry fee
    setCredits((prev) => Math.max(0, prev - 25));
    setSpins((prev) => prev + 1);
    setWinStatus("");
    setLeverPulled(true);
    
    // Play lever hum
    playRetroSound("spin");

    // Animate visual lever pull sequence
    scheduleTimeout(() => {
      setLeverPulled(false);
    }, 250);

    // Call pure outer randomizer helper
    const targets = generateSpinResult(isCheatMode);

    // Set reels active state
    setIsSpinning([true, true, true]);

    // Start cycling reel display indices rapidly (simulates loop motion)
    const runCycle = (reelIdx) => {
      let index = 0;
      intervalRefs.current[reelIdx] = setInterval(() => {
        setReels((prev) => {
          const next = [...prev];
          next[reelIdx] = SYMBOLS[index];
          return next;
        });
        index = (index + 1) % SYMBOLS.length;
      }, 70);
    };

    runCycle(0);
    runCycle(1);
    runCycle(2);

    // Stop Reel 1 (1.6s)
    scheduleTimeout(() => {
      clearInterval(intervalRefs.current[0]);
      setReels((prev) => {
        const next = [...prev];
        next[0] = targets[0];
        return next;
      });
      setIsSpinning((prev) => [false, prev[1], prev[2]]);
      playRetroSound("tick");
    }, 1600);

    // Stop Reel 2 (2.2s)
    scheduleTimeout(() => {
      clearInterval(intervalRefs.current[1]);
      setReels((prev) => {
        const next = [...prev];
        next[1] = targets[1];
        return next;
      });
      setIsSpinning((prev) => [prev[0], false, prev[2]]);
      playRetroSound("tick");
    }, 2200);

    // Stop Reel 3 (2.8s)
    scheduleTimeout(() => {
      clearInterval(intervalRefs.current[2]);
      setReels((prev) => {
        const next = [...prev];
        next[2] = targets[2];
        return next;
      });
      setIsSpinning([false, false, false]);
      playRetroSound("tick");
      
      // Calculate scores and rewards
      evaluateResult(targets);
    }, 2800);
  };

  // --- RESULT EVALUATION ---
  const evaluateResult = (finalReels) => {
    const [r1, r2, r3] = finalReels;
    
    // Case 1: Triple Match (JACKPOT)
    if (r1.id === r2.id && r2.id === r3.id) {
      setJackpots((prev) => prev + 1);
      setCredits((prev) => prev + 1000);
      setScore((prev) => prev + 500);
      setWinStatus(`🎰 JACKPOT MATCH! Unlocked: ${r1.label} Achievement`);
      
      // Unlock achievement milestone
      unlockMilestone(r1);
      
      // Play Synthesized sound + golden confetti explosion
      scheduleTimeout(() => {
        playRetroSound("jackpot");
        triggerConfetti(true);
      }, 100);
    } 
    // Case 2: Double Match (Partial match)
    else if (r1.id === r2.id || r2.id === r3.id || r1.id === r3.id) {
      const matchedSymbol = (r1.id === r2.id || r1.id === r3.id) ? r1 : r2;
      setCredits((prev) => prev + 250);
      setScore((prev) => prev + 150);
      setWinStatus(`🌟 Match! Unlocked: ${matchedSymbol.label} Milestone`);
      
      // Unlock achievement milestone
      unlockMilestone(matchedSymbol);
      
      scheduleTimeout(() => {
        playRetroSound("win");
        triggerConfetti(false);
      }, 100);
    } 
    // Case 3: Mixed (No matches)
    else {
      setWinStatus("Clean Compile! Try another spin to unlock a jackpot.");
    }
  };

  const unlockMilestone = (symbolItem) => {
    setUnlockedMilestones((prev) => {
      if (prev.some((m) => m.id === symbolItem.id)) return prev;
      return [...prev, symbolItem];
    });
  };

  // Cleanup active reel cycles, delayed spin callbacks, and the shared audio context.
  useEffect(() => {
    const currentIntervals = intervalRefs.current;
    const currentTimeouts = timeoutRefs.current;

    return () => {
      currentIntervals.forEach((ref) => {
        if (ref) clearInterval(ref);
      });

      currentTimeouts.forEach((ref) => {
        if (ref) clearTimeout(ref);
      });

      const currentAudioContext = audioContextRef.current;
      if (currentAudioContext && currentAudioContext.state !== "closed") {
        currentAudioContext.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#04040a] py-24 px-4 text-white">
      {/* Self-contained Custom Embedded CSS styles for high-fidelity animations */}
      <style>{`
        @keyframes reelScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-reel-scroll {
          animation: reelScroll 0.22s linear infinite;
        }
        .neon-gold-border {
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2);
        }
        .neon-ruby-border {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
        .digital-font {
          font-family: 'Courier New', Courier, monospace;
        }
      `}</style>

      {/* Floating Laser/Neon Glows in background */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HEADER SECTION */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-6 py-2.5 backdrop-blur-md mb-6">
            <Sparkles className="animate-pulse text-yellow-400" size={18} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
              Interactive Arcade Showcase
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-gradient-to-r from-yellow-200 via-amber-400 to-red-500 bg-clip-text drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            WIN THE CAREER JACKPOT
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-gray-400 font-medium">
            Pull the golden slot machine lever to match symbols and unlock my key professional milestones, technologies, and achievements!
          </p>
        </div>

        {/* MAIN GAME INTERFACE CONTAINER */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* SLOT MACHINE MACHINE (9 Columns) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            {/* The Physical Cabinet Outer Frame */}
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#11111e] via-[#090910] to-[#040409] rounded-3xl p-6 md:p-8 border-4 border-yellow-500/30 neon-gold-border">
              
              {/* Gold & Neon Ruby Red Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-yellow-500/30 pb-4 mb-8">
                <div className="flex items-center gap-2">
                  <Coins className="text-yellow-400 animate-bounce" size={24} />
                  <span className="text-sm font-bold uppercase tracking-wider text-yellow-300 font-mono">
                    VEGAS SYSTEM v2.0
                  </span>
                </div>
                
                {/* Audio and Cheat Controls inside cabinet */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setVolumeOn(!volumeOn);
                      playRetroSound("tick");
                    }}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 transition-all cursor-pointer text-gray-400 hover:text-yellow-300"
                    title={volumeOn ? "Mute Sounds" : "Unmute Sounds"}
                  >
                    {volumeOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>

                  <button
                    onClick={() => {
                      setIsCheatMode(!isCheatMode);
                      playRetroSound("tick");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isCheatMode 
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-amber-500/50 hover:text-amber-300"
                    }`}
                  >
                    <Flame size={12} className={isCheatMode ? "animate-pulse" : ""} />
                    High Roller Mode
                  </button>
                </div>
              </div>

              {/* SLOT MACHINE CONTAINER WITH 3 WINDOWS & LEVER ATTACHMENT */}
              <div className="relative flex items-center justify-between gap-6 md:gap-8">
                
                {/* 3 Reel Windows Frame */}
                <div className="flex-1 grid grid-cols-3 gap-3 md:gap-5 bg-black p-4 md:p-6 rounded-2xl border border-red-500/40 shadow-inner">
                  {[0, 1, 2].map((reelIdx) => {
                    const activeSym = reels[reelIdx];
                    const isReelSpinning = isSpinning[reelIdx];

                    return (
                      <div
                        key={reelIdx}
                        className="relative h-44 md:h-52 overflow-hidden bg-gradient-to-b from-[#06060c] via-[#10101f] to-[#06060c] rounded-xl border border-yellow-500/20 flex flex-col items-center justify-center text-center p-2"
                      >
                        {/* Shimmer/Reflection Glass Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

                        {isReelSpinning ? (
                          /* SPINNING MOTION VIEW: Double list scrolling loop */
                          <div className="absolute flex flex-col items-center justify-around h-[800px] w-full animate-reel-scroll filter blur-[2px] opacity-75">
                            {[...SYMBOLS, ...SYMBOLS].map((sym, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl mb-1">{sym.emoji}</span>
                                <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase">{sym.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* STATIC SYMBOL VIEW: Clean bounce entry */
                          <Motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 14 }}
                            className="flex flex-col items-center justify-center"
                          >
                            {/* Glowing Aura Gradient Behind Symbol */}
                            <div className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${activeSym.color} opacity-20 blur-xl pointer-events-none`} />
                            
                            {/* The Emoji and Badge */}
                            <span className="text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] mb-2 animate-pulse">
                              {activeSym.emoji}
                            </span>
                            <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${activeSym.textColor} drop-shadow-md`}>
                              {activeSym.label}
                            </span>
                          </Motion.div>
                        )}
                        
                        {/* Horizontal guidelines overlay (classic machine vibe) */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-red-500/10 border-t border-b border-red-500/5 pointer-events-none" />
                      </div>
                    );
                  })}
                </div>

                {/* THE INTERACTIVE SPRING LEVER ON THE RIGHT */}
                <div className="w-12 h-60 flex flex-col items-center justify-center relative">
                  
                  {/* Lever Bracket Base */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-700 border-2 border-yellow-400 shadow-md z-10 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-black/40" />
                  </div>

                  {/* Lever Handle Shaft */}
                  <Motion.div
                    animate={{
                      height: leverPulled ? 35 : 95,
                      y: leverPulled ? 35 : 0
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 12 }}
                    onClick={handleSpin}
                    className="w-3 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 rounded-full cursor-pointer absolute bottom-[110px] z-0 shadow-inner"
                  />

                  {/* Lever Shiny Red Knob Ball */}
                  <Motion.div
                    animate={{
                      y: leverPulled ? 55 : -25
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 12 }}
                    onClick={handleSpin}
                    className="w-10 h-10 bg-gradient-to-tr from-red-800 via-red-500 to-rose-400 rounded-full cursor-pointer absolute bottom-[180px] z-20 shadow-[0_0_15px_rgba(239,68,68,0.7)] border border-red-400/40 hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              {/* ACTION STATS BAR AND PLAY TRIGGER BUTTON */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Glowing LED Win Status Panel */}
                <div className="w-full md:flex-1 h-14 bg-black rounded-xl border border-red-500/30 px-4 flex items-center justify-center text-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none" />
                  <p className="font-mono text-xs md:text-sm font-semibold tracking-wider text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)]">
                    {winStatus || "System Clean. Ready for lever pull!"}
                  </p>
                </div>

                {/* Big Spin Button */}
                <button
                  onClick={handleSpin}
                  disabled={isSpinning.some(Boolean) || credits <= 0}
                  className={`w-full md:w-auto min-w-[180px] h-14 rounded-2xl flex items-center justify-center gap-3.5 text-base font-black uppercase tracking-widest text-black transition-all cursor-pointer relative overflow-hidden select-none ${
                    isSpinning.some(Boolean)
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500"
                      : "bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 border border-yellow-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95"
                  }`}
                >
                  {isSpinning.some(Boolean) ? (
                    <>
                      <RefreshCw className="animate-spin text-gray-400" size={20} />
                      SPINNING...
                    </>
                  ) : (
                    <>
                      <Play className="fill-black" size={20} />
                      PULL LEVER
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* REAL-TIME GLASS DASHBOARD (STATS) */}
            <div className="w-full max-w-2xl mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "SPINS PLAYED", value: spins, icon: RefreshCw, color: "text-amber-400" },
                { label: "JACKPOTS WON", value: jackpots, icon: Crown, color: "text-red-500" },
                { label: "CAREER SCORE", value: score, icon: Trophy, color: "text-yellow-400" },
                { label: "CREDITS BAL", value: credits, icon: Coins, color: "text-green-400" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-center hover:border-yellow-400/20 transition-colors"
                  >
                    <div className="flex justify-center mb-1.5">
                      <Icon className={`${item.color} animate-pulse`} size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      {item.label}
                    </span>
                    <h4 className="text-2xl font-black font-mono mt-1 text-white tracking-wider">
                      {item.value}
                    </h4>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ACHIEVEMENTS CABINET (4 Columns) */}
          <div className="lg:col-span-4 h-full">
            <div className="h-full rounded-3xl border border-yellow-500/20 bg-white/[0.02] backdrop-blur-md p-6 relative overflow-hidden flex flex-col">
              
              {/* Outer Glows */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-yellow-400/10 blur-2xl pointer-events-none" />
              
              {/* Section Header */}
              <div className="mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-yellow-300">
                    Unlocked Rewards
                  </h3>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    Developer Milestones Log
                  </p>
                </div>
              </div>

              {/* Milestones dynamic scrolling section */}
              <div className="flex-1 min-h-[300px] overflow-y-auto space-y-4 max-h-[480px] pr-1">
                <AnimatePresence initial={false}>
                  {unlockedMilestones.length === 0 ? (
                    <Motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-10"
                    >
                      <User className="text-white/10 mb-3 animate-pulse" size={64} />
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest font-mono">
                        No matches unlocked
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Pull the lever to match symbols and reveal tech milestones!
                      </p>
                    </Motion.div>
                  ) : (
                    unlockedMilestones.map((milestone) => (
                      <Motion.div
                        key={milestone.id}
                        initial={{ x: 50, opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 180, damping: 15 }}
                        className="group relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-white/[0.04] p-4 transition-all duration-300 hover:border-yellow-400/40 hover:bg-white/[0.08]"
                      >
                        {/* Tiny Glow accent inside matched card */}
                        <div className={`absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-gradient-to-r ${milestone.color} opacity-10 blur-xl pointer-events-none`} />

                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{milestone.emoji}</span>
                            <h4 className="font-extrabold text-sm text-yellow-300 tracking-wide">
                              {milestone.label} Unlocked
                            </h4>
                          </div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse shrink-0">
                            + {milestone.score} PTS
                          </span>
                        </div>

                        {/* Achievement text */}
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          {milestone.milestone}
                        </p>
                      </Motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative Casino Chip at bottom */}
              <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-8 border-yellow-500/10 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
