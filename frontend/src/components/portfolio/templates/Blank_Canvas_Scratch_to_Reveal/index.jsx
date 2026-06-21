import React, { useEffect, useState, useRef } from 'react';
import dummyData from '../../../../data/dummy_data.json';
import { PortfolioContext } from './PortfolioContext';
import { motion } from 'framer-motion';

// Section imports
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';

export default function BlankCanvasReveal({ portfolioData }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const canvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  
  const lastPos = useRef(null);
  const isDrawing = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const [pointerActive, setPointerActive] = useState(false);
  const lastCheckRef = useRef(0);
  
  const particlesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const spotlightAnimationRef = useRef(null);

  // Load Google Fonts (Outfit & Inter) dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Lock and unlock body scroll
  useEffect(() => {
    if (!isRevealed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRevealed]);

  // Handle pointer/wheel gestures to prevent scrolling background
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e) => {
      if (!isRevealed) {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', preventScroll, { passive: false });
    container.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventScroll);
      container.removeEventListener('touchmove', preventScroll);
    };
  }, [isRevealed]);

  // Main Canvas repainting loop for Metallic Card and Spotlight
  const drawMainCanvas = () => {
    const canvas = canvasRef.current;
    const offscreen = offscreenCanvasRef.current;
    if (!canvas || !offscreen) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Reset composite operation to draw background
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    // 1. Draw premium brushed pure black/charcoal gradient (no blues)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.25, '#0a0a0a');
    grad.addColorStop(0.45, '#050505');
    grad.addColorStop(0.5, '#222222'); // white-specular metallic reflection ridge
    grad.addColorStop(0.55, '#080808');
    grad.addColorStop(0.75, '#121212');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Draw brushed metal grains (fine semi-transparent diagonal streaks)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
    ctx.lineWidth = 0.5;
    const streakSpacing = 6;
    for (let i = -h; i < w; i += streakSpacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    // 3. Draw fine charcoal grid guidelines for blueprint aesthetic
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const gridSpacing = 60;
    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 4. Draw luxury card design markings (border frame and circles)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.strokeRect(36, 36, w - 72, h - 72);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.18, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Draw active spotlight highlight following the cursor or breathing in center (no blue)
    const time = Date.now() * 0.002;
    const pointerX = pointerActive ? pointerPosRef.current.x : w / 2;
    const pointerY = pointerActive ? pointerPosRef.current.y : h / 2;
    const spotSize = pointerActive ? 300 : 240 + Math.sin(time) * 15;

    const spotGrad = ctx.createRadialGradient(
      pointerX, pointerY, 0,
      pointerX, pointerY, spotSize
    );
    // Neutral white and grey specular lights (completely monochromatic)
    spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    spotGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, w, h);

    // 6. Draw offscreen scratch mask using destination-out to subtract pixels
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(offscreen, 0, 0);

    ctx.restore();
  };

  const initSpotlightLoop = () => {
    const render = () => {
      drawMainCanvas();
      spotlightAnimationRef.current = requestAnimationFrame(render);
    };
    spotlightAnimationRef.current = requestAnimationFrame(render);
  };

  // Resize canvas handler
  const handleResize = () => {
    const canvas = canvasRef.current;
    const pCanvas = particleCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0 || h === 0) return;

    if (!offscreenCanvasRef.current) {
      const offscreen = document.createElement('canvas');
      offscreenCanvasRef.current = offscreen;
    }

    const offscreen = offscreenCanvasRef.current;
    
    // Save current scratch state
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = offscreen.width;
    tempCanvas.height = offscreen.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    const isInitial = offscreen.width === 0;
    if (!isInitial) {
      tempCtx.drawImage(offscreen, 0, 0);
    }

    // Set sizes
    canvas.width = w;
    canvas.height = h;
    offscreen.width = w;
    offscreen.height = h;
    if (pCanvas) {
      pCanvas.width = w;
      pCanvas.height = h;
    }

    // Restore scratch mask onto resized offscreen
    if (!isInitial) {
      const oCtx = offscreen.getContext('2d');
      oCtx.drawImage(tempCanvas, 0, 0, w, h);
    }

    // Render immediately
    drawMainCanvas();
  };

  useEffect(() => {
    handleResize();
    initSpotlightLoop();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (spotlightAnimationRef.current) {
        cancelAnimationFrame(spotlightAnimationRef.current);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Particle updates (Drifting Luxury Silver/White metallic shavings - no blue/gold)
  const initParticleLoop = (particleCanvas) => {
    const ctx = particleCanvas.getContext('2d');

    const updateAndDraw = () => {
      const w = particleCanvas.width;
      const h = particleCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.x += Math.sin(Date.now() * 0.01 + p.seed) * 0.25;
        p.alpha -= p.fadeSpeed;
        p.life -= 1;

        if (p.life <= 0 || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(updateAndDraw);
      } else {
        animFrameIdRef.current = null;
      }
    };

    if (!animFrameIdRef.current) {
      animFrameIdRef.current = requestAnimationFrame(updateAndDraw);
    }
  };

  const emitParticles = (x, y) => {
    const pCanvas = particleCanvasRef.current;
    if (!pCanvas) return;

    if (particlesRef.current.length > 80) return;

    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: Math.random() * 2 + 1,
        gravity: Math.random() * 0.05 + 0.02,
        alpha: 0.95,
        fadeSpeed: Math.random() * 0.015 + 0.01,
        life: Math.floor(Math.random() * 45) + 25,
        seed: Math.random() * 100,
        glow: Math.random() * 10 + 4,
        // Monochrome sparkles only: pure whites and silver/grey shades
        color: i % 2 === 0 ? '#ffffff' : '#94a3b8'
      });
    }

    initParticleLoop(pCanvas);
  };

  // Scratch progress check
  const checkReveal = () => {
    const offscreen = offscreenCanvasRef.current;
    if (!offscreen) return;
    const ctx = offscreen.getContext('2d');
    const w = offscreen.width;
    const h = offscreen.height;
    if (w === 0 || h === 0) return;

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const pixels = imgData.data;
      let transparent = 0;
      let total = 0;

      const step = 120;
      for (let i = 3; i < pixels.length; i += step * 4) {
        total++;
        if (pixels[i] > 0) {
          transparent++;
        }
      }

      const percent = Math.round((transparent / total) * 100);
      setScratchPercent(percent);

      if (percent >= 55) {
        revealAll();
      }
    } catch (e) {
      console.error('Scratch reveal check failed', e);
    }
  };

  const checkRevealThrottled = () => {
    const now = Date.now();
    if (now - lastCheckRef.current > 150) {
      lastCheckRef.current = now;
      checkReveal();
    }
  };

  const revealAll = () => {
    if (isFading || isRevealed) return;
    setIsFading(true);
    setScratchPercent(100);
    document.body.style.overflow = '';
    
    setTimeout(() => {
      setIsRevealed(true);
      if (spotlightAnimationRef.current) {
        cancelAnimationFrame(spotlightAnimationRef.current);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    }, 750);
  };

  // Pointer drawing interaction handlers
  const handlePointerDown = (e) => {
    isDrawing.current = true;
    setPointerActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerPosRef.current = { x, y };
    lastPos.current = { x, y };
    scratch(x, y, true);
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerPosRef.current = { x, y };

    if (!pointerActive) {
      setPointerActive(true);
    }

    if (!isDrawing.current) return;
    scratch(x, y, false);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
    checkReveal();
  };

  const handlePointerLeave = () => {
    isDrawing.current = false;
    lastPos.current = null;
    setPointerActive(false);
    checkReveal();
  };

  const scratch = (x, y, isStart) => {
    const offscreen = offscreenCanvasRef.current;
    if (!offscreen) return;
    const ctx = offscreen.getContext('2d');

    ctx.save();
    
    // Increased scratch brush size to 85 (170px diameter) for much faster reveals
    const brushRadius = 85;
    
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = brushRadius * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isStart || !lastPos.current) {
      const grad = ctx.createRadialGradient(x, y, brushRadius * 0.3, x, y, brushRadius);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      const grad = ctx.createRadialGradient(x, y, brushRadius * 0.3, x, y, brushRadius);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    lastPos.current = { x, y };

    emitParticles(x, y);
    checkRevealThrottled();
  };

  // Merge portfolio data with fallback dummy data
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };

  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ['Frontend', 'Backend', 'Tools', 'Technologies'];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: Math.floor(Math.random() * 20) + 75,
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  let projects = dummyData.projects;

if (portfolioData?.projects?.length > 0) {
  projects = portfolioData.projects
    .map((p, i) => {
      const techCount = (p.technologies || p.techStack || []).length;

      const score =
        (p.description?.length || 0) +
        techCount * 10 +
        (p.liveUrl ? 20 : 0) +
        (p.githubUrl ? 15 : 0);

      return {
        title: p.title || p.name || "Project",
        description: p.description || "",
        techStack: p.technologies || p.techStack || [],
        image:
          p.image ||
          dummyData.projects[i % dummyData.projects.length].image,
        liveUrl: p.liveUrl || "#",
        githubUrl: p.githubUrl || "#",
        highlightScore: score,
        featured: false,
      };
    })
    .sort((a, b) => b.highlightScore - a.highlightScore);

  projects = projects.map((project, index) => ({
    ...project,
    featured: index < 3,
  }));
}

const featuredProjects = projects.filter(
  (project) => project.featured
);

  const experience = portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;
  const testimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;
  const stats = portfolioData?.stats || dummyData.stats;

  const data = { personal, socials, skills, projects, experience, testimonials, stats, portfolioData };

  return (
    <PortfolioContext.Provider value={data}>
      <div className="min-h-screen bg-black text-[#f4f4f7] font-sans antialiased selection:bg-slate-800 selection:text-white overflow-x-hidden relative">
        {/* Monochromatic grid background for the whole page */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        
        {/* Soft, neutral, dark grey ambient glows (no blue) */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </div>

        {/* Global Viewport Scratch Overlay (Pure Black/Charcoal metallic theme) */}
        {!isRevealed && (
          <div
            ref={containerRef}
            className={`fixed inset-0 z-50 w-screen h-screen select-none overflow-hidden touch-none transition-all duration-750 ease-out bg-black ${
              isFading ? 'opacity-0 scale-105 blur-md pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* Scratch Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerLeave}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
            
            {/* Particle Canvas Overlay */}
            <canvas
              ref={particleCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />
            
            {/* Visual UI layer (mouse/touch events pass through to canvas) */}
            <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none z-30 py-16 px-6 text-center">
              {/* Top bar: Brand / Mode */}
              <div className="flex flex-col items-center gap-1.5 mt-4">
                <span className="text-[9px] font-mono tracking-[0.4em] text-slate-400 uppercase font-semibold">
                  ★ PREMIUM BLACK COLLECTOR EDITION ★
                </span>
                <div className="w-12 h-px bg-slate-800" />
              </div>

              {/* Middle: Title & Instruction */}
              <div className="flex flex-col items-center max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-slate-900 backdrop-blur-md text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Scratch to Unlock Portfolio</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-600 mb-6 uppercase leading-none select-none">
                  BLANK CANVAS
                </h1>
                
                <p className="text-xs md:text-sm font-mono tracking-[0.2em] text-slate-400 uppercase max-w-md leading-relaxed select-none">
                  Discover the creator behind the canvas
                </p>
              </div>

              {/* Bottom: Progress & Accessible Skip */}
              <div className="flex flex-col items-center gap-6 z-45 mb-4">
                {/* Progress Bar & Percentage */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-48 h-1 bg-slate-950 border border-slate-900 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      style={{ width: `${scratchPercent}%` }} 
                      className="h-full bg-gradient-to-r from-slate-600 via-slate-400 to-white transition-all duration-150 rounded-full" 
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-medium tracking-widest uppercase">
                    {scratchPercent}% Uncovered / 55% Required
                  </span>
                </div>

                {/* Skip button (Pointer events enabled) */}
                <button
                  onClick={revealAll}
                  className="pointer-events-auto px-6 py-2.5 rounded-lg bg-black border border-slate-800 hover:border-white text-[10px] font-mono tracking-widest uppercase text-slate-300 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-2xl"
                  aria-label="Skip scratching and reveal portfolio immediately"
                >
                  Reveal Portfolio (Skip)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortfolioContext.Provider>
  );
}
