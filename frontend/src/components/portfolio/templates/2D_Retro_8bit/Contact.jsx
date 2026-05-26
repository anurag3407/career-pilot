import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Twitter, Send, User, MessageSquare, FileText, Gamepad2, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

export default function Contact() {
  // Sound controls (visual-only panel setting toggle but with nice click feedback visual state)
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Game metrics / interaction states
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(999990);
  const [activeTab, setActiveTab] = useState('LEADERBOARD'); // LEADERBOARD, HOW_TO_PLAY
  
  // Form submission state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom message response triggers
  const [systemLog, setSystemLog] = useState('READY PLAYER ONE - INSERT MESSAGE');

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Health click micro-interaction
  const handleHeartClick = (index) => {
    if (health === index + 1) {
      setHealth((prev) => Math.max(0, prev - 1));
      setSystemLog(`OOF! -1 HP. HEALTH AT ${index}/3.`);
    } else if (health === index) {
      setHealth((prev) => Math.min(3, prev + 1));
      setSystemLog(`EXTRALIFE! +1 HP. HEALTH AT ${index + 1}/3.`);
    } else {
      setSystemLog('CLICK THE FARTHEST HEART TO REDUCE HP!');
    }
    setScore((prev) => prev + 100);
  };

  // Reset health
  const resetHealth = () => {
    setHealth(3);
    setSystemLog('HEALTH RESTORED TO MAX!');
    setScore((prev) => prev + 500);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const errors = {};
    if (!formData.name.trim()) errors.name = 'NAME REQ! INPUT NAME';
    if (!formData.email.trim()) {
      errors.email = 'EMAIL REQ! NEED ADDR';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'INVALID EMAIL! RE-INSERT';
    }
    if (!formData.message.trim()) errors.message = 'MSG EMPTY! DESCRIBE MISSION';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSystemLog('ERROR DETECTED! VERIFY INPUT SYSTEMS');
      return;
    }

    // Submit animation flow
    setIsSubmitting(true);
    setSystemLog('ESTABLISHING NEURAL LINK... TRANSMITTING');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSubmitProgress(progress);
      
      if (progress === 30) setSystemLog('LOADING PROTOCOLS... 30%');
      if (progress === 60) setSystemLog('PACKET SYNTHESIS IN PROGRESS... 60%');
      if (progress === 90) setSystemLog('DELIVERING TO COORD [0x44f12]... 90%');
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          setScore((prev) => prev + 1250);
          setSystemLog('MESSAGE TRANSMITTED! SCORE LEVEL CLEARED!');
        }, 300);
      }
    }, 150);
  };

  // Reset form
  const handlePlayAgain = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
    setSubmitProgress(0);
    setSystemLog('CABINET RE-ARMED. CHOOSE NEXT INPUT');
  };

  return (
    <section className="relative w-full min-h-screen bg-[#07020d] text-[#39ff14] overflow-hidden py-16 px-4 md:px-8 font-mono select-none">
      
      {/* Google Fonts and Custom 8-bit CSS Styles inside JSX */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        .font-8bit-title {
          font-family: 'Press Start 2P', monospace;
          line-height: 1.5;
        }
        
        .font-8bit-body {
          font-family: 'VT323', monospace;
          font-size: 1.35rem;
          line-height: 1.4;
          letter-spacing: 1px;
        }

        /* Twinkling starfield */
        .pixel-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: #fff;
          opacity: 0.3;
          animation: blink 2.5s infinite steps(5);
        }

        /* Moving grid background */
        .retro-grid {
          background-image: 
            linear-gradient(to right, rgba(42, 12, 78, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(42, 12, 78, 0.15) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: grid-scroll 25s linear infinite;
        }

        /* CRT Screen scanline effect */
        .crt-screen::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
          background-size: 100% 4px;
          z-index: 20;
          pointer-events: none;
          animation: scanlines 20s linear infinite;
        }

        /* CRT Screen curve and phosphor glow */
        .crt-screen::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.45) 100%);
          z-index: 21;
          pointer-events: none;
        }

        /* Phosphor screen twitch */
        @keyframes blink {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }

        @keyframes grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 640px; }
        }

        @keyframes scanlines {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }

        /* Retro blinking animation */
        .retro-blink {
          animation: arcade-blink 1s steps(2, start) infinite;
        }

        @keyframes arcade-blink {
          to { visibility: hidden; }
        }

        /* Pixel art corners */
        .pixel-corners {
          clip-path: polygon(
            0px 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0px,
            calc(100% - 8px) 0px, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px,
            100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%,
            8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0px calc(100% - 8px)
          );
        }

        /* Pixel border outline double-pass styling */
        .pixel-border-outer {
          border: 4px solid #000;
          box-shadow: 
            0 4px 0 -4px #000, 
            0 -4px 0 -4px #000, 
            4px 0 0 -4px #000, 
            -4px 0 0 -4px #000;
        }
      `}</style>

      {/* Twinkling Stars Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="pixel-star" style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
        <div className="pixel-star" style={{ top: '15%', left: '75%', animationDelay: '0.5s' }} />
        <div className="pixel-star" style={{ top: '35%', left: '45%', animationDelay: '1.2s' }} />
        <div className="pixel-star" style={{ top: '65%', left: '12%', animationDelay: '0.8s' }} />
        <div className="pixel-star" style={{ top: '70%', left: '88%', animationDelay: '1.7s' }} />
        <div className="pixel-star" style={{ top: '85%', left: '30%', animationDelay: '0.3s' }} />
        <div className="pixel-star" style={{ top: '90%', left: '60%', animationDelay: '2.1s' }} />
      </div>

      {/* Scrolling Vector Grid Background */}
      <div className="absolute inset-0 z-0 retro-grid opacity-25 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col space-y-8">
        
        {/* ================= HEADER HUD SECTION ================= */}
        <div className="w-full bg-[#120722]/80 border-4 border-black p-4 pixel-border-outer shadow-[6px_6px_0px_0px_#000] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-8bit-title bg-opacity-95">
          
          {/* Top Left Indicator */}
          <div className="flex items-center gap-4">
            <span className="text-[#ff007f] animate-pulse">1UP</span>
            <span className="text-white">SCORE</span>
            <span className="text-[#00ffff]">{String(score).padStart(6, '0')}</span>
          </div>

          {/* Game Title Indicator */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-[#ffd700]" />
            <span className="text-[#ffd700] tracking-widest text-center select-none">
              STAGE 5: COMM-LINKS
            </span>
          </div>

          {/* Top Right Stats Indicator */}
          <div className="flex items-center gap-6">
            {/* Health Section */}
            <div className="flex items-center gap-1.5 bg-[#000]/40 px-3 py-1 rounded-sm border-2 border-black">
              <span className="text-[10px] text-white/70 mr-1 select-none">HP:</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => handleHeartClick(idx)}
                    className="focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                    title={`Heart ${idx + 1} - click to interact!`}
                  >
                    <Heart
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        idx < health
                          ? 'text-[#ff007f] fill-[#ff007f]'
                          : 'text-gray-600 fill-gray-800'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {health === 0 && (
                <button
                  onClick={resetHealth}
                  className="ml-2 text-[9px] text-[#ffd700] hover:text-white bg-[#ff007f] px-1.5 py-0.5 border border-black shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none"
                >
                  HEAL
                </button>
              )}
            </div>

            {/* Audio Toggle (Visual & Interactive panel feedback indicator) */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                setSystemLog(`AUDIO SIGNALS: ${!soundEnabled ? 'ENABLED' : 'MUTED'}`);
              }}
              className="p-1 border-2 border-black bg-black/40 text-[#00ffff] hover:bg-[#ff007f] hover:text-white transition-colors"
              title="Toggle retro audio visuals"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ================= SUB-HEADER LOG FEEDBACK ================= */}
        <div className="w-full bg-[#1b0a30] border-4 border-black px-4 py-2 text-xs font-8bit-title text-[#00ffff] flex items-center gap-3">
          <span className="text-[#ff007f] flex shrink-0">&gt;</span>
          <span className="truncate">{systemLog}</span>
          <div className="w-2.5 h-3.5 bg-[#00ffff] retro-blink shrink-0 ml-auto" />
        </div>

        {/* ================= MAIN COLUMN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: LEADERBOARD & SOCIALS ================= */}
          <div className="col-span-1 lg:col-span-5 flex flex-col space-y-6 h-full">
            
            {/* Navigation Tabs */}
            <div className="flex border-4 border-black bg-black overflow-hidden">
              <button
                onClick={() => {
                  setActiveTab('LEADERBOARD');
                  setSystemLog('LOADED SOCIAL LEADERBOARD CONNECTORS');
                }}
                className={`flex-1 py-3 text-center text-xs font-8bit-title border-r-4 border-black transition-colors ${
                  activeTab === 'LEADERBOARD'
                    ? 'bg-[#ff007f] text-white'
                    : 'bg-[#120722] text-[#39ff14] hover:bg-[#1b0a30]'
                }`}
              >
                SOCIAL HUD
              </button>
              <button
                onClick={() => {
                  setActiveTab('HOW_TO_PLAY');
                  setSystemLog('LOADED OPERATIONAL INSTRUCTIONS');
                }}
                className={`flex-1 py-3 text-center text-xs font-8bit-title transition-colors ${
                  activeTab === 'HOW_TO_PLAY'
                    ? 'bg-[#ff007f] text-white'
                    : 'bg-[#120722] text-[#39ff14] hover:bg-[#1b0a30]'
                }`}
              >
                HOW TO PLAY
              </button>
            </div>

            {/* Tab 1 Content: Social Scoreboard Leaderboard */}
            {activeTab === 'LEADERBOARD' ? (
              <div className="bg-[#120722]/85 border-4 border-black p-6 pixel-border-outer shadow-[6px_6px_0px_0px_#000] flex-1">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-8bit-title text-[#ffd700] tracking-wider mb-2">HI-SCORE BOARD</h3>
                  <p className="text-xs text-[#00ffff] font-8bit-title">RANK PORT SOCIAL CONNECTIONS</p>
                </div>

                <div className="space-y-4 font-8bit-body">
                  
                  {/* Leaderboard Titles */}
                  <div className="flex justify-between items-center text-xs text-white/50 border-b-4 border-black pb-2 mb-2 font-8bit-title">
                    <span>RANK / NODE</span>
                    <span>POINTS / LINK</span>
                  </div>

                  {/* 1st Rank: GitHub */}
                  <a
                    href="https://github.com/kashviporwal-byte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center py-2 px-3 bg-black/40 border-2 border-transparent hover:border-[#00ffff] hover:bg-[#1b0a30] transition-all group group-hover:scale-[1.02]"
                    onClick={() => {
                      setSystemLog('ROUTING TO TARGET SYSTEM: GITHUB NODE');
                      setScore((prev) => prev + 500);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#ffd700] text-sm font-8bit-title group-hover:animate-bounce">1ST</span>
                      <Github className="w-5 h-5 text-[#ff007f] shrink-0" />
                      <span className="text-white font-semibold">GITHUB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ffff] font-8bit-title text-xs">999K</span>
                      <span className="text-white/30 text-[10px]">&gt;&gt;</span>
                    </div>
                  </a>

                  {/* 2nd Rank: LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center py-2 px-3 bg-black/40 border-2 border-transparent hover:border-[#00ffff] hover:bg-[#1b0a30] transition-all group hover:scale-[1.02]"
                    onClick={() => {
                      setSystemLog('ROUTING TO TARGET SYSTEM: LINKEDIN NODE');
                      setScore((prev) => prev + 400);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 text-sm font-8bit-title">2ND</span>
                      <Linkedin className="w-5 h-5 text-[#00ffff] shrink-0" />
                      <span className="text-white font-semibold">LINKEDIN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#39ff14] font-8bit-title text-xs">850K</span>
                      <span className="text-white/30 text-[10px]">&gt;&gt;</span>
                    </div>
                  </a>

                  {/* 3rd Rank: Twitter */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center py-2 px-3 bg-black/40 border-2 border-transparent hover:border-[#00ffff] hover:bg-[#1b0a30] transition-all group hover:scale-[1.02]"
                    onClick={() => {
                      setSystemLog('ROUTING TO TARGET SYSTEM: TWITTER NODE');
                      setScore((prev) => prev + 300);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#ff9d00] text-sm font-8bit-title">3RD</span>
                      <Twitter className="w-5 h-5 text-[#ffd700] shrink-0" />
                      <span className="text-white font-semibold">TWITTER</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#ff007f] font-8bit-title text-xs">720K</span>
                      <span className="text-white/30 text-[10px]">&gt;&gt;</span>
                    </div>
                  </a>

                  {/* 4th Rank: Direct Email */}
                  <a
                    href="mailto:contact@careerpilot.io"
                    className="flex justify-between items-center py-2 px-3 bg-black/40 border-2 border-transparent hover:border-[#00ffff] hover:bg-[#1b0a30] transition-all group hover:scale-[1.02]"
                    onClick={() => {
                      setSystemLog('ROUTING DIRECT COMMS: MAIL ROUTER');
                      setScore((prev) => prev + 200);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm font-8bit-title">4TH</span>
                      <Mail className="w-5 h-5 text-[#39ff14] shrink-0" />
                      <span className="text-white font-semibold">EMAIL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#ffd700] font-8bit-title text-xs">500K</span>
                      <span className="text-white/30 text-[10px]">&gt;&gt;</span>
                    </div>
                  </a>
                </div>

                {/* Scoreboard Pixel Footer Graphics */}
                <div className="mt-8 border-t-4 border-black pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 8 8" fill="currentColor" className="text-[#ffd700] animate-bounce">
                      {/* Pixel Star */}
                      <path d="M3 0h2v1H3zm-1 1h4v1H2zm-2 2h8v1H0zm1 1h6v1H1zm-1 1h8v1H0zm2 2h4v1H2zm1 1h2v1H3z" />
                    </svg>
                    <span className="text-[11px] text-white/60">CLICK CONNECTORS FOR EXTRA SCORE</span>
                  </div>
                  <span className="text-[10px] text-[#ff007f] font-8bit-title">CREDIT: 99</span>
                </div>
              </div>
            ) : (
              /* Tab 2 Content: Instructions Manual */
              <div className="bg-[#120722]/85 border-4 border-black p-6 pixel-border-outer shadow-[6px_6px_0px_0px_#000] flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-8bit-title text-[#ffd700] tracking-wider mb-1">USER MANUAL</h3>
                    <p className="text-xs text-[#00ffff] font-8bit-title">HOW TO SUBMIT COMMS</p>
                  </div>
                  
                  <div className="font-8bit-body space-y-4 text-white/80">
                    <div className="flex items-start gap-3">
                      <span className="text-[#ff007f] font-8bit-title text-sm shrink-0">1.</span>
                      <p>INSERT YOUR HERO CREDS IN THE FORMS SHOWN IN PLAYER MESSAGE CABINET.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#ff007f] font-8bit-title text-sm shrink-0">2.</span>
                      <p>INSERT NEURAL DATA (NAME, EMAIL, MISSION/MESSAGE) INTO LOG PORTS.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#ff007f] font-8bit-title text-sm shrink-0">3.</span>
                      <p>PRESS THE FLASHING [INSERT COIN] ACTION CONTROLLER TO SECURE YOUR TRANSMISSION.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#ff007f] font-8bit-title text-sm shrink-0">4.</span>
                      <p>VISIT SOCIAL NODES FOR EXTRA HIGH-SCORE VALUE MULTIPLIERS.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t-4 border-black pt-4 flex justify-between items-center text-xs">
                  <span className="text-[#ff007f]">SYSTEM STABILITY: 100%</span>
                  <button 
                    onClick={() => {
                      setActiveTab('LEADERBOARD');
                      setSystemLog('RETURNED TO LEADERBOARD DISPLAY');
                    }}
                    className="text-[#00ffff] hover:underline font-8bit-title text-[9px]"
                  >
                    BACK TO LEADERBOARD
                  </button>
                </div>
              </div>
            )}

            {/* Custom Pixel Art Controller Panel Card */}
            <div className="bg-[#120722]/85 border-4 border-black p-4 pixel-border-outer shadow-[6px_6px_0px_0px_#000] flex justify-around items-center bg-opacity-95">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 relative flex items-center justify-center bg-black border-2 border-gray-700">
                  {/* D-Pad Layout */}
                  <div className="absolute top-1 w-3 h-3 bg-gray-500 hover:bg-[#ff007f] cursor-pointer" onClick={() => setSystemLog('D-PAD UP: NAVIGATE NODE UP')} />
                  <div className="absolute bottom-1 w-3 h-3 bg-gray-500 hover:bg-[#ff007f] cursor-pointer" onClick={() => setSystemLog('D-PAD DOWN: NAVIGATE NODE DOWN')} />
                  <div className="absolute left-1 w-3 h-3 bg-gray-500 hover:bg-[#ff007f] cursor-pointer" onClick={() => setSystemLog('D-PAD LEFT: NAVIGATE LEFT')} />
                  <div className="absolute right-1 w-3 h-3 bg-gray-500 hover:bg-[#ff007f] cursor-pointer" onClick={() => setSystemLog('D-PAD RIGHT: NAVIGATE RIGHT')} />
                  <div className="w-2.5 h-2.5 bg-gray-900 z-10" />
                </div>
                <span className="text-[9px] font-8bit-title text-white/50 mt-1">D-PAD</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setScore((prev) => prev + 250);
                      setSystemLog('SELECT BUTTON: BONUS APPLIED!');
                    }} 
                    className="w-10 h-3.5 bg-gray-600 rounded-full border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer" 
                  />
                  <span className="text-[8px] font-8bit-title text-white/50 mt-1">SELECT</span>
                </div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setScore((prev) => prev + 500);
                      setSystemLog('START BUTTON: GAME MATRIX INITIALIZED');
                    }}
                    className="w-10 h-3.5 bg-gray-600 rounded-full border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer" 
                  />
                  <span className="text-[8px] font-8bit-title text-white/50 mt-1">START</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setScore((prev) => prev + 100);
                      setSystemLog('BUTTON B: PUNCH ATTACK! (+100 PTS)');
                    }}
                    className="w-8 h-8 rounded-full bg-[#ff007f] border-2 border-black font-8bit-title text-[9px] text-white flex items-center justify-center shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    B
                  </button>
                  <span className="text-[8px] font-8bit-title text-white/50 mt-1">FIRE</span>
                </div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => {
                      setScore((prev) => prev + 200);
                      setSystemLog('BUTTON A: HIGH JUMP! (+200 PTS)');
                    }}
                    className="w-8 h-8 rounded-full bg-[#ffd700] border-2 border-black font-8bit-title text-[9px] text-black flex items-center justify-center shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    A
                  </button>
                  <span className="text-[8px] font-8bit-title text-white/50 mt-1">JUMP</span>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: ARCADE CABINET MESSAGE SCREEN ================= */}
          <div className="col-span-1 lg:col-span-7">
            
            {/* Arcade Cabinet Frame Container */}
            <div className="relative border-8 border-gray-800 bg-gray-900 p-2 md:p-6 pixel-border-outer shadow-[8px_8px_0px_0px_#000]">
              
              {/* Cabinet Side Borders Accent Decals */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#ff007f]" />
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#00ffff]" />

              {/* CRT Glass Screen Container */}
              <div className="crt-screen relative bg-[#150a21] border-4 border-black p-4 md:p-6 overflow-hidden rounded-md">
                
                {/* Micro Starfield on the cabinet screen itself */}
                <div className="absolute inset-0 bg-[#0f041d]/90 retro-grid opacity-15 pointer-events-none z-0" />

                {/* Submitting overlay loader */}
                {isSubmitting && (
                  <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-8 font-8bit-title text-center text-xs text-[#39ff14]">
                    <div className="border-4 border-[#39ff14] p-6 max-w-sm bg-black shadow-[4px_4px_0_0_#39ff14] flex flex-col items-center space-y-6">
                      <span className="animate-bounce">UPLOADING DATA PACKETS</span>
                      
                      {/* Loading progress bar */}
                      <div className="w-48 h-6 border-4 border-[#39ff14] p-0.5 bg-black flex items-center">
                        <div 
                          className="h-full bg-[#39ff14] transition-all duration-150" 
                          style={{ width: `${submitProgress}%` }}
                        />
                      </div>
                      
                      <span>STATUS: {submitProgress}%</span>
                    </div>
                  </div>
                )}

                {/* Level Complete / Submission Success Screen */}
                {isSubmitted ? (
                  <div className="relative z-30 py-8 px-4 text-center flex flex-col items-center space-y-6">
                    
                    {/* Retro Blinking Success Badge */}
                    <div className="text-xl md:text-2xl font-8bit-title text-[#ffd700] tracking-widest leading-loose animate-bounce">
                      LEVEL CLEARED!
                    </div>

                    <div className="border-4 border-[#39ff14] p-6 bg-black/60 backdrop-blur-sm max-w-md w-full shadow-[6px_6px_0px_0px_#000] space-y-4 font-8bit-body text-left">
                      <div className="flex justify-between items-center border-b-2 border-[#39ff14]/30 pb-2 text-xs font-8bit-title text-[#00ffff]">
                        <span>QUEST REPORT</span>
                        <span>[ TRANSMITTED ]</span>
                      </div>
                      
                      <div className="space-y-2 text-[#39ff14] text-sm md:text-base">
                        <p className="flex justify-between">
                          <span>HERO NAME:</span>
                          <span className="text-white truncate max-w-[200px]">{formData.name}</span>
                        </p>
                        <p className="flex justify-between">
                          <span>PORT EMAIL:</span>
                          <span className="text-white truncate max-w-[200px]">{formData.email}</span>
                        </p>
                        {formData.subject && (
                          <p className="flex justify-between">
                            <span>MISSION:</span>
                            <span className="text-white truncate max-w-[200px]">{formData.subject}</span>
                          </p>
                        )}
                        <p className="border-t-2 border-[#39ff14]/30 pt-2 text-[#ffd700] text-xs font-8bit-title">
                          MESSAGE DEPOSITED IN CABINET SLOT. RESPONSES WILL BE BEAMED BACK SHARPLY.
                        </p>
                      </div>
                    </div>

                    {/* Level complete statistics */}
                    <div className="flex flex-col items-center space-y-2 text-xs font-8bit-title text-white">
                      <span>BONUS GAINED: +1250 PTS</span>
                      <span className="text-[#00ffff]">TOTAL SCORE: {score}</span>
                    </div>

                    {/* Restart / Play Again Button */}
                    <button
                      onClick={handlePlayAgain}
                      className="cursor-pointer px-6 py-3 bg-[#ff007f] hover:bg-[#ff2a85] text-white text-xs font-8bit-title border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 group"
                    >
                      <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0 group-hover:rotate-12 transition-transform" />
                      SUBMIT NEW QUEST
                    </button>

                  </div>
                ) : (
                  
                  /* Regular Comms Input Form */
                  <div className="relative z-30 flex flex-col space-y-6">
                    
                    {/* Form Intro Title */}
                    <div className="border-b-4 border-black pb-4">
                      <h3 className="text-base md:text-lg font-8bit-title text-white flex items-center gap-2.5">
                        <MessageSquare className="w-5 h-5 text-[#ff007f]" />
                        MESSAGE CABINET
                      </h3>
                      <p className="text-xs text-[#00ffff] font-8bit-title mt-1.5 select-none">
                        STAGE PROTOCOL: RECORDING HERO INFORMATION
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 font-8bit-body text-base">
                      
                      {/* Name input */}
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="name" className="text-xs font-8bit-title text-[#39ff14] flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#00ffff]" />
                          HERO NAME
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2 border-4 border-black bg-black/60 text-[#00ffff] rounded-sm focus:outline-none focus:border-[#ffd700] focus:ring-4 focus:ring-[#ffd700]/15 ${
                            formErrors.name ? 'border-[#ff007f] focus:border-[#ff007f]' : ''
                          }`}
                          placeholder="ENTER NAME OR CALLSIGN"
                          disabled={isSubmitting}
                        />
                        {formErrors.name && (
                          <span className="text-xs font-8bit-title text-[#ff007f]">{formErrors.name}</span>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="email" className="text-xs font-8bit-title text-[#39ff14] flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#00ffff]" />
                          EMAIL LOG
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3.5 py-2 border-4 border-black bg-black/60 text-[#00ffff] rounded-sm focus:outline-none focus:border-[#ffd700] focus:ring-4 focus:ring-[#ffd700]/15 ${
                            formErrors.email ? 'border-[#ff007f] focus:border-[#ff007f]' : ''
                          }`}
                          placeholder="HERO@MAIL.COM"
                          disabled={isSubmitting}
                        />
                        {formErrors.email && (
                          <span className="text-xs font-8bit-title text-[#ff007f]">{formErrors.email}</span>
                        )}
                      </div>

                      {/* Subject input */}
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="subject" className="text-xs font-8bit-title text-[#39ff14] flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#00ffff]" />
                          MISSION / SUBJECT
                        </label>
                        <input
                          id="subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 border-4 border-black bg-black/60 text-[#00ffff] rounded-sm focus:outline-none focus:border-[#ffd700] focus:ring-4 focus:ring-[#ffd700]/15"
                          placeholder="MISSION TARGET OR JOB INQUIRY"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Message body input */}
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="message" className="text-xs font-8bit-title text-[#39ff14] flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-[#00ffff]" />
                          MESSAGE DETAILS
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="4"
                          className={`w-full px-3.5 py-2 border-4 border-black bg-black/60 text-[#00ffff] rounded-sm focus:outline-none focus:border-[#ffd700] focus:ring-4 focus:ring-[#ffd700]/15 resize-none ${
                            formErrors.message ? 'border-[#ff007f] focus:border-[#ff007f]' : ''
                          }`}
                          placeholder="DESCRIBE THE CO-OP MISSION..."
                          disabled={isSubmitting}
                        />
                        {formErrors.message && (
                          <span className="text-xs font-8bit-title text-[#ff007f]">{formErrors.message}</span>
                        )}
                      </div>

                      {/* Submit action panel */}
                      <div className="pt-2 flex justify-between items-center gap-4">
                        
                        {/* Status visual panel indicator */}
                        <div className="hidden sm:flex items-center gap-2 bg-black/40 px-3 py-2 border-2 border-black">
                          <div className="w-3 h-3 bg-[#39ff14] rounded-full animate-ping" />
                          <span className="text-[10px] font-8bit-title text-white">SYS ONLINE</span>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="cursor-pointer w-full sm:w-auto px-6 py-3.5 bg-[#ffd700] hover:bg-[#ffe600] text-black text-xs font-8bit-title border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <Send className="w-4 h-4 text-black shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          INSERT COIN &amp; SEND
                        </button>
                      </div>

                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ================= ================= FOOTER CREDIT PANEL ================= ================= */}
        <div className="w-full bg-[#120722]/80 border-4 border-black p-4 pixel-border-outer shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-8bit-title text-white/50 bg-opacity-95">
          <span>CAREER PILOT CORE SYSTEM v2.4.1</span>
          <div className="flex items-center gap-1.5">
            <span>MADE WITH</span>
            <Heart className="w-3.5 h-3.5 text-[#ff007f] fill-[#ff007f] animate-pulse" />
            <span>FOR GSSOC '26</span>
          </div>
          <span>ALL RIGHTS RESERVED 2026</span>
        </div>

      </div>
    </section>
  );
}
