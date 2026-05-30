import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gamepad2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Award, 
  Activity,
  Flame,
  User,
  CheckCircle2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Dynamic 8-bit sound effects using the browser's Web Audio API
const playRetroSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } 
    else if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
    else if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
    else if (type === 'coin') {
      // Classic coin sound (two high square-wave tones)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc1.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      
      gain1.gain.setValueAtTime(0.04, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.25);
    }
    else if (type === 'win') {
      // Ascending major chord power-up
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        
        gain.gain.setValueAtTime(0.03, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.15);
      });
    }
  } catch (err) {
    console.warn('Web Audio API not supported or blocked:', err);
  }
};

export default function HighScoreBoard() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  
  // Interactive Minigame / User score states
  const [userScore, setUserScore] = useState(0);
  const [initials, setInitials] = useState(['A', 'A', 'A']);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(-1);

  // Projects Leaderboard State
  const [projects, setProjects] = useState([
    { rank: 1, initials: 'KSP', score: 95500, name: 'AI Career Pilot Platform', role: 'Full-Stack Hero', lang: 'React/Node' },
    { rank: 2, initials: 'JOD', score: 87200, name: 'Retro 2D RPG Game Engine', role: 'Lead Engine Dev', lang: 'C++/WebGL' },
    { rank: 3, initials: 'SAM', score: 74900, name: 'Cloud Infrastructure Orchestrator', role: 'DevOps Knight', lang: 'Go/Docker' },
    { rank: 4, initials: 'ALX', score: 63800, name: 'Decentralized Data Ledger', role: 'Smart Contract Mage', lang: 'Solidity' },
    { rank: 5, initials: 'NIO', score: 52100, name: 'Automated Testing Suite', role: 'QA Tactician', lang: 'Python/Jest' }
  ]);

  // Skill XP stats (styled like fighting-game health/mana bars)
  const skills = [
    { name: 'Frontend (React/Tailwind/JS)', xp: 95, level: 99, color: 'bg-emerald-400' },
    { name: 'Backend (Node.js/Express)', xp: 85, level: 85, color: 'bg-cyan-400' },
    { name: 'Databases (Firebase/SQL)', xp: 75, level: 75, color: 'bg-amber-400' },
    { name: 'Cloud & DevOps (Docker/AWS)', xp: 60, level: 60, color: 'bg-rose-400' },
    { name: 'System Architecture & Algos', xp: 80, level: 80, color: 'bg-violet-400' }
  ];

  // Achievements stats
  const achievements = [
    { title: 'The Ultimate Commit', desc: 'Pushed 1,000+ career contributions.', xp: '+15,000 XP', status: 'UNLOCKED', unlocked: true },
    { title: 'Bug Obliterator', desc: 'Squashed high-priority production bugs.', xp: '+10,000 XP', status: 'UNLOCKED', unlocked: true },
    { title: 'GSSoC Legendary Contributor', desc: 'Successfully merged interactive UI modules.', xp: '+20,000 XP', status: 'UNLOCKED', unlocked: true },
    { title: 'Polyglot Mage', desc: 'Shipped production code in 5 different languages.', xp: '+12,500 XP', status: 'UNLOCKED', unlocked: true },
    { title: 'Zero Downtime Architect', desc: 'Migrated live legacy databases securely.', xp: '+25,000 XP', status: 'LOCKED', unlocked: false }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    playRetroSound('beep', isMuted);
  };

  // Minigame interactions
  const handleTapForXp = () => {
    if (hasSubmitted) return;
    setUserScore(prev => prev + 2500);
    playRetroSound('coin', isMuted);
    
    // Tiny confetti pop at key milestones
    if ((userScore + 2500) % 25000 === 0) {
      triggerConfetti(0.2);
      playRetroSound('win', isMuted);
    }
  };

  const changeLetter = (index, direction) => {
    if (hasSubmitted) return;
    playRetroSound('select', isMuted);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#';
    setInitials(prev => {
      const next = [...prev];
      const curIndex = alphabet.indexOf(next[index]);
      let nextIndex = curIndex + direction;
      if (nextIndex < 0) nextIndex = alphabet.length - 1;
      if (nextIndex >= alphabet.length) nextIndex = 0;
      next[index] = alphabet[nextIndex];
      return next;
    });
  };

  const triggerConfetti = (scalar = 1) => {
    try {
      confetti({
        particleCount: Math.floor(80 * scalar),
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ffffff']
      });
    } catch (e) {
      // Fallback
    }
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (hasSubmitted || userScore === 0) return;

    playRetroSound('win', isMuted);
    triggerConfetti(1.2);

    const userInitialsString = initials.join('');
    const newRecord = {
      rank: 0, // Assigned below
      initials: userInitialsString,
      score: userScore,
      name: 'User Custom Contribution',
      role: 'Guest Champion',
      lang: 'Web Console'
    };

    // Merge & Sort leaderboards
    const mergedList = [...projects, newRecord].sort((a, b) => b.score - a.score);
    
    // Re-rank items and slice to top 6
    const reRanked = mergedList.map((item, idx) => ({ ...item, rank: idx + 1 }));
    const sliced = reRanked.slice(0, 6);

    // Find if user is in the top 6 and highlight
    const newIdx = sliced.findIndex(item => item.initials === userInitialsString && item.score === userScore);
    
    setProjects(sliced);
    setHasSubmitted(true);
    setIsNewHighScore(true);
    if (newIdx !== -1) {
      setHighlightedRowIndex(newIdx);
    }
  };

  const handleResetGame = () => {
    setUserScore(0);
    setInitials(['A', 'A', 'A']);
    setHasSubmitted(false);
    setIsNewHighScore(false);
    setHighlightedRowIndex(-1);
    playRetroSound('beep', isMuted);
  };

  return (
    <section className="w-full min-h-screen bg-[#070714] text-white py-16 px-4 md:px-8 font-vt323 relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* Dynamic scanline overlay block */}
      <div className="absolute inset-0 pointer-events-none z-20 pointer-events-none select-none crt-scanlines" />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-radial-vignette" />

      {/* Font imports & Retro CRT Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        .font-press-start {
          font-family: 'Press Start 2P', monospace;
        }
        
        .font-vt323 {
          font-family: 'VT323', monospace;
        }

        .crt-scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.3)
          );
          background-size: 100% 4px;
        }

        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 40%, #000 100%);
        }

        @keyframes retro-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-retro-blink {
          animation: retro-blink 1.2s infinite;
        }

        @keyframes screen-flicker {
          0% { opacity: 0.99; }
          50% { opacity: 0.98; }
          100% { opacity: 0.99; }
        }

        .animate-screen-flicker {
          animation: screen-flicker 0.15s infinite;
        }

        .pixel-border-double {
          border: 4px solid #00ffff;
          box-shadow: 
            0 0 0 4px #070714, 
            0 0 0 8px #ff00ff,
            0 0 15px rgba(0,255,255,0.4);
        }

        .pixel-border-yellow {
          border: 4px solid #ffff00;
          box-shadow: 0 0 0 4px #070714, 0 0 0 8px #ff00ff;
        }

        .pixel-card-shadow {
          box-shadow: 5px 5px 0px 0px #ff00ff;
        }

        .pixel-btn-shadow:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px 0px #00ffff;
        }
      `}</style>

      {/* Main Arcade Frame Wrapper */}
      <div className="w-full max-w-5xl z-10 animate-screen-flicker">
        
        {/* Header Title with nostalgic 8-bit text styles */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex justify-between items-center w-full max-w-md mb-2">
            <span className="text-cyan-400 text-sm tracking-wider font-press-start animate-pulse">
              ★ SYSTEM REBOOT ★
            </span>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                playRetroSound('coin', !isMuted);
              }}
              className="p-1 px-3 bg-[#121232] border-2 border-magenta-500 rounded text-xs flex items-center gap-1.5 hover:bg-[#ff00ff]/20 active:translate-y-0.5 border-dashed border-[#ff00ff] cursor-pointer"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[10px] font-press-start text-rose-500">SOUND: OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-press-start text-emerald-400">SOUND: ON</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-300 to-pink-500 uppercase leading-none drop-shadow-[0_4px_0_rgba(0,0,0,1)] flex items-center gap-3">
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 animate-bounce shrink-0" />
            HIGH SCORE BOARD
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 animate-bounce shrink-0" />
          </h1>
          
          <p className="mt-4 font-press-start text-[10px] md:text-xs text-yellow-300 animate-retro-blink uppercase">
            {isNewHighScore ? "!! NEW RECORD UNLOCKED !!" : "⚡ INSERT COIN TO SUBMIT YOUR XP ⚡"}
          </p>
        </div>

        {/* Arcade Cabinet Panel */}
        <div className="w-full bg-[#0a0a24]/90 rounded-none pixel-border-double p-5 md:p-8 flex flex-col gap-8 relative">
          
          {/* Neon Corner Screws */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-[#ffff00] border border-black" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-[#ffff00] border border-black" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#ffff00] border border-black" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#ffff00] border border-black" />

          {/* Category Tabs (Arcade Style Buttons) */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 border-b-4 border-[#ff00ff] pb-4">
            {[
              { id: 'projects', label: 'PROJECTS', icon: Trophy, color: 'text-yellow-400' },
              { id: 'skills', label: 'SKILLS XP', icon: Activity, color: 'text-cyan-400' },
              { id: 'achievements', label: 'QUESTS', icon: Award, color: 'text-pink-400' }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    py-2 md:py-4 px-1 md:px-3 text-sm md:text-xl font-press-start rounded-none border-4 transition-all uppercase select-none cursor-pointer flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3
                    ${isActive 
                      ? 'bg-[#ff00ff] border-cyan-400 text-black shadow-[0_0_10px_#00ffff] translate-y-1' 
                      : 'bg-[#121232] border-[#2b2b63] text-gray-400 hover:text-white hover:border-[#ff00ff]/60'
                    }
                  `}
                >
                  <TabIcon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-black' : tab.color}`} />
                  <span className="text-[9px] md:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Core Scoreboard Screens */}
          <div className="w-full flex-1">
            
            {/* Category: Projects Table */}
            {activeTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-lg md:text-2xl border-collapse">
                  <thead>
                    <tr className="border-b-2 border-dashed border-[#ff00ff]/50 text-yellow-300 font-press-start text-[10px] md:text-xs">
                      <th className="py-2 px-1">RANK</th>
                      <th className="py-2 px-2">INITIALS</th>
                      <th className="py-2 px-3">PROJECT TITLE</th>
                      <th className="py-2 px-2 text-right">HIGH SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => {
                      const isHighlighted = index === highlightedRowIndex;
                      return (
                        <tr 
                          key={`${project.initials}-${index}`} 
                          className={`
                            border-b border-white/[0.05] font-vt323 tracking-wide
                            transition-all duration-300
                            ${isHighlighted ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400 font-bold scale-[1.01]' : 'hover:bg-[#121238]/60'}
                          `}
                        >
                          <td className="py-3 px-1 flex items-center gap-1.5">
                            {project.rank === 1 && <span className="text-yellow-400 animate-pulse">🥇</span>}
                            {project.rank === 2 && <span className="text-slate-300">🥈</span>}
                            {project.rank === 3 && <span className="text-amber-600">🥉</span>}
                            {project.rank > 3 && <span className="text-gray-500 pl-2"></span>}
                            <span className={project.rank <= 3 ? "font-bold text-yellow-300" : "text-cyan-300"}>
                              {String(project.rank).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono font-bold tracking-widest text-[#ff00ff] text-xl md:text-3xl">
                            {project.initials}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="text-white hover:text-cyan-400 transition-colors text-base md:text-2xl">{project.name}</span>
                              <span className="text-[10px] md:text-xs text-gray-400 font-press-start flex items-center gap-2">
                                <span className="text-cyan-400">{project.role}</span> // <span className="text-emerald-400">{project.lang}</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-emerald-400 text-xl md:text-3xl">
                            {project.score.toLocaleString()} PTS
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Category: Skills Health Bars */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-1 md:gap-2">
                    <div className="flex justify-between items-center text-base md:text-2xl font-press-start">
                      <span className="text-white text-xs md:text-sm">{skill.name}</span>
                      <span className="text-yellow-300 text-xs md:text-sm">LVL {skill.level}</span>
                    </div>
                    
                    {/* Retro HP Bar */}
                    <div className="w-full bg-[#121232] h-6 md:h-8 border-4 border-[#2b2b63] relative flex items-center px-1">
                      <div 
                        className={`h-full ${skill.color} shadow-[0_0_8px_rgba(0,255,255,0.4)] transition-all duration-1000`}
                        style={{ width: `${skill.xp}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-black font-press-start text-[8px] md:text-[10px] font-bold">
                        {skill.xp}/100 XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category: Achievements/Quests */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.title} 
                    className={`
                      border-4 p-4 flex justify-between items-center flex-wrap md:flex-nowrap gap-3
                      ${ach.unlocked 
                        ? 'bg-[#121b12]/60 border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]' 
                        : 'bg-[#1c1212]/60 border-rose-900/60 opacity-60'
                      }
                    `}
                  >
                    <div className="flex gap-3.5 items-start">
                      {ach.unlocked ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-1 animate-pulse" />
                      ) : (
                        <Lock className="w-8 h-8 text-rose-500 shrink-0 mt-1" />
                      )}
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold ${ach.unlocked ? 'text-emerald-300' : 'text-gray-400'}`}>
                          {ach.title}
                        </h3>
                        <p className="text-sm md:text-lg text-gray-300 leading-tight">{ach.desc}</p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 text-xs md:text-sm font-press-start ${ach.unlocked ? 'text-yellow-300 bg-yellow-400/10' : 'text-gray-500 bg-gray-900/40'}`}>
                        {ach.xp}
                      </span>
                      <div className={`mt-2.5 font-press-start text-[9px] md:text-[11px] ${ach.unlocked ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`}>
                        {ach.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Bottom Controls / Mini-game Console Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#07071c] p-4 md:p-6 border-4 border-dashed border-[#ff00ff]/40">
            
            {/* Clicker Mini-game Section (Left column on large screen) */}
            <div className="lg:col-span-5 flex flex-col justify-between items-center text-center border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-[#ff00ff]/40 pb-6 lg:pb-0 lg:pr-6 gap-4">
              <div className="w-full">
                <span className="font-press-start text-[10px] md:text-xs text-cyan-400 flex items-center justify-center gap-1">
                  <Gamepad2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  XP ACCUMULATOR MINIGAME
                </span>
                
                {/* Visualizer score */}
                <div className="mt-3 bg-black border-2 border-[#2b2b63] py-2.5 px-4 rounded-none font-mono">
                  <div className="text-[10px] text-gray-500 font-press-start">ACCUMULATED SCORE</div>
                  <div className="text-3xl md:text-4xl text-yellow-300 font-bold leading-none tracking-widest mt-1">
                    {String(userScore).padStart(6, '0')} <span className="text-xs text-[#ff00ff]">XP</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTapForXp}
                disabled={hasSubmitted}
                className={`
                  w-full font-press-start py-3 px-4 rounded-none border-4 transition-all text-xs md:text-sm select-none cursor-pointer flex justify-center items-center gap-2
                  ${hasSubmitted 
                    ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50' 
                    : 'bg-emerald-500 border-yellow-300 text-black hover:bg-emerald-400 shadow-[0_4px_0_#ff00ff] hover:shadow-[0_2px_0_#ff00ff] hover:translate-y-0.5 active:translate-y-1'
                  }
                `}
              >
                <Flame className="w-4 h-4 animate-bounce text-red-600 shrink-0" />
                {hasSubmitted ? "GAME OVER" : "MASH FOR HIGH SCORE!"}
              </button>
            </div>

            {/* Initials Submission Form (Right column on large screen) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="text-center lg:text-left">
                <span className="font-press-start text-[10px] md:text-xs text-pink-500 flex items-center justify-center lg:justify-start gap-1">
                  <User className="w-4 h-4 text-pink-500" />
                  SUBMIT YOUR SCORE TO HALL OF FAME
                </span>
                <p className="text-base text-gray-300 mt-1">
                  Use arrows to select initials. Tap submit to inject your record into the Projects list!
                </p>
              </div>

              <form onSubmit={handleScoreSubmit} className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* 3-Character Letters Selector */}
                <div className="flex gap-4">
                  {initials.map((char, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => changeLetter(index, 1)}
                        disabled={hasSubmitted}
                        className="p-1 text-cyan-400 hover:text-yellow-300 active:scale-95 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-6 h-6 animate-pulse" />
                      </button>
                      
                      <div className="w-12 h-14 bg-black border-4 border-cyan-400 flex items-center justify-center font-mono text-3xl font-black text-[#ff00ff] select-none shadow-[0_0_8px_rgba(0,255,255,0.4)]">
                        {char}
                      </div>

                      <button
                        type="button"
                        onClick={() => changeLetter(index, -1)}
                        disabled={hasSubmitted}
                        className="p-1 text-cyan-400 hover:text-yellow-300 active:scale-95 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Submission Action */}
                <div className="w-full md:w-auto flex-1">
                  {hasSubmitted ? (
                    <button
                      type="button"
                      onClick={handleResetGame}
                      className="w-full font-press-start py-4 px-6 rounded-none border-4 bg-[#ff00ff] border-cyan-400 text-black hover:bg-[#ff00ff]/80 shadow-[0_4px_0_#00ffff] hover:shadow-[0_2px_0_#00ffff] hover:translate-y-0.5 active:translate-y-1 cursor-pointer flex justify-center items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-black shrink-0 animate-spin" />
                      PLAY AGAIN
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={userScore === 0}
                      className={`
                        w-full font-press-start py-4 px-6 rounded-none border-4 transition-all text-xs md:text-sm select-none cursor-pointer flex justify-center items-center gap-2
                        ${userScore === 0
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-yellow-400 border-cyan-400 text-black hover:bg-yellow-300 shadow-[0_4px_0_#ff00ff] hover:shadow-[0_2px_0_#ff00ff] hover:translate-y-0.5 active:translate-y-1'
                        }
                      `}
                    >
                      <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
                      LOCK IN HIGHSCORE
                    </button>
                  )}
                </div>
              </form>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
