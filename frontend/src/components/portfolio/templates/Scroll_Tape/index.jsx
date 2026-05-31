import React, { useState, useEffect, useRef } from 'react';
import data from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Scroll Tape Portfolio Template
 * Category: Scroll-Triggered / Retro VHS
 */
export default function ScrollTape() {
  const [vcrState, setVcrState] = useState('PLAY'); // PLAY, PAUSE, FF, REW
  const [timecode, setTimecode] = useState('0:00:00');
  const [activeSection, setActiveSection] = useState('hero');
  
  const scrollContainerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const sectionRefs = {
    hero: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    testimonials: useRef(null),
    contact: useRef(null),
  };

  const tabs = [
    { id: 'hero', label: '01. INTRO' },
    { id: 'about', label: '02. BIO' },
    { id: 'skills', label: '03. SKILLS' },
    { id: 'projects', label: '04. WORK' },
    { id: 'experience', label: '05. HISTORY' },
    { id: 'testimonials', label: '06. QUOTES' },
    { id: 'contact', label: '07. CONTACT' },
  ];

  // Dynamic canvas noise loop for VHS static/glitch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      if (vcrState === 'PAUSE') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (vcrState === 'FF' || vcrState === 'REW') {
        // High density static noise for tape search transitions
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val;     // R
          data[i + 1] = val; // G
          data[i + 2] = val; // B
          data[i + 3] = Math.random() > 0.4 ? 120 : 35; // A (semi-transparent static)
        }
        ctx.putImageData(imgData, 0, 0);

        // Tracking bars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const barHeight = Math.random() * 40 + 10;
        const barY = Math.random() * canvas.height;
        ctx.fillRect(0, barY, canvas.width, barHeight);
      } else if (vcrState === 'PLAY') {
        // Subtle scanline flicker/noise (occasional horizontal tracking glitch)
        if (Math.random() > 0.97) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 8 + 2);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [vcrState]);

  // Scroll handler to track section entry and timecode
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercent = scrollTop / (scrollHeight - clientHeight || 1);

    // Calculate OSD Timecode (max 15 mins tape length: 0:15:00)
    const totalSeconds = Math.round(scrollPercent * 900); // 900 secs = 15 mins
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor(Math.random() * 100);
    const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    setTimecode(formattedTime);

    // Detect active section based on vertical scroll midpoint
    const containerMid = scrollTop + clientHeight / 2;
    let currentSec = 'hero';

    for (const [sectionId, ref] of Object.entries(sectionRefs)) {
      if (ref.current) {
        const offsetTop = ref.current.offsetTop;
        const offsetHeight = ref.current.offsetHeight;
        if (containerMid >= offsetTop && containerMid <= offsetTop + offsetHeight) {
          currentSec = sectionId;
          break;
        }
      }
    }

    setActiveSection(currentSec);

    // Set momentary play state
    if (vcrState === 'PAUSE') {
      setVcrState('PLAY');
    }
  };

  // Navigate to a section via physical buttons
  const navigateToSection = (sectionId) => {
    const target = sectionRefs[sectionId]?.current;
    const container = scrollContainerRef.current;
    if (!target || !container) return;

    const currentOffset = container.scrollTop;
    const targetOffset = target.offsetTop;

    // Trigger rewind or fast forward state depending on scroll direction
    if (targetOffset > currentOffset) {
      setVcrState('FF');
    } else {
      setVcrState('REW');
    }

    // Smooth scroll inside container
    container.scrollTo({
      top: targetOffset,
      behavior: 'smooth',
    });

    // Reset VCR state back to PLAY after transition delay
    setTimeout(() => {
      setVcrState('PLAY');
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#a0a5b5] flex flex-col items-center justify-center p-4 md:p-8 font-mono select-none overflow-x-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Retro scanlines and CRT overlay definition */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes crt-flicker {
          0% { opacity: 0.985; }
          50% { opacity: 0.995; }
          100% { opacity: 0.985; }
        }
        @keyframes scanline-roll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .crt-screen {
          animation: crt-flicker 0.15s infinite;
          position: relative;
          background: #0f1015;
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.95), 
                      inset 0 0 20px rgba(34, 211, 238, 0.15);
        }
        .crt-screen::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%);
          background-size: 100% 4px;
          z-index: 40;
          pointer-events: none;
          opacity: 0.85;
        }
        .crt-screen::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
          z-index: 41;
          pointer-events: none;
        }
        .crt-scanline-roll {
          position: absolute;
          top: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.04), transparent);
          animation: scanline-roll 8s linear infinite;
          z-index: 42;
          pointer-events: none;
        }
        .vcr-btn-glow {
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.2);
        }
        .vcr-btn-glow-active {
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
        }
      `}} />

      {/* Main CRT Monitor Cabinet */}
      <div className="w-full max-w-5xl bg-[#1e2029] rounded-[30px] md:rounded-[50px] p-4 md:p-8 border-4 border-[#2d313f] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),_inset_0_4px_0_rgba(255,255,255,0.1)] relative">
        
        {/* VCR Style Brand Label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[#5c6175] font-bold uppercase hidden md:block">
          CP-8200 VCR SYSTEM
        </div>

        {/* CRT Glass Frame Bezel */}
        <div className="bg-[#121319] p-3 md:p-6 rounded-[20px] md:rounded-[36px] border-2 border-[#191b22] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]">
          
          {/* CRT Screen Area */}
          <div className="crt-screen rounded-[12px] md:rounded-[24px] overflow-hidden border border-[#232733] min-h-[500px] md:min-h-[620px] flex flex-col relative">
            <div className="crt-scanline-roll" />

            {/* Screen Content Wrapper */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 p-6 md:p-10 flex flex-col relative z-10 overflow-y-auto max-h-[500px] md:max-h-[620px] scroll-smooth gap-16 md:gap-24"
            >
              <div ref={sectionRefs.hero}><Hero data={data} onNext={() => navigateToSection('about')} /></div>
              <div ref={sectionRefs.about}><About data={data} /></div>
              <div ref={sectionRefs.skills}><Skills data={data} /></div>
              <div ref={sectionRefs.projects}><Projects data={data} /></div>
              <div ref={sectionRefs.experience}><Experience data={data} /></div>
              <div ref={sectionRefs.testimonials}><Testimonials data={data} /></div>
              <div ref={sectionRefs.contact}><Contact data={data} /></div>
            </div>

            {/* Canvas overlay for static noise */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-30 mix-blend-screen"
            />

            {/* Neon Glitch HUD Overlay */}
            <div className="absolute top-4 left-4 z-20 text-[10px] md:text-xs font-bold text-[#ff0055] tracking-widest pointer-events-none select-none flex flex-col gap-1">
              <div>MODE: {vcrState}</div>
              <div className="text-cyan-400">TAPE: {timecode}</div>
            </div>
          </div>
        </div>

        {/* Physical Monitor Base Control Deck */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2 md:px-6">
          {/* Status Indicators */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ${vcrState === 'PLAY' ? 'animate-pulse' : ''}`} />
              <span className="text-[#8e94a9] text-[11px] font-bold">POWER ON</span>
            </div>
            <div className="h-4 w-[1px] bg-[#2d313f]" />
            <div className="text-cyan-400 font-bold tracking-widest text-[11px] uppercase">
              TAPE LOADED
            </div>
          </div>

          {/* VCR Navigation buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-[#121319] p-2 rounded-xl border border-[#2d313f]">
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateToSection(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all uppercase tracking-wide cursor-pointer ${
                    isActive
                      ? 'bg-pink-600 text-white border-b-2 border-pink-800 scale-95 vcr-btn-glow-active'
                      : 'bg-[#1e2029] text-[#8e94a9] border-b-2 border-black hover:text-white hover:bg-[#252835] active:scale-95'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Cassette Eject/Refresh system */}
          <button
            onClick={() => {
              setVcrState('REW');
              scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => setVcrState('PLAY'), 850);
            }}
            className="px-4 py-2 rounded-lg bg-[#cc3333]/15 hover:bg-[#cc3333]/25 text-[#ff4d4d] border border-[#cc3333]/40 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>⏏</span> REWIND / RESET
          </button>
        </div>
      </div>

      {/* Tiny instructions info */}
      <div className="mt-4 text-[10px] text-[#4d5162] tracking-wider uppercase text-center">
        Use VCR deck buttons or scroll inside CRT screen to navigate tape sections
      </div>
    </div>
  );
}
