import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ─── STYLES ────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --navy:   #0a0e1a;
    --navy2:  #111827;
    --navy3:  #1a2236;
    --cyan:   #00f5ff;
    --magenta:#ff2d78;
    --gold:   #ffd700;
    --green:  #39ff14;
    --white:  #e8eaf0;
    --gray:   #6b7280;
    --pixel:  'Press Start 2P', monospace;
    --body:   'Inter', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: var(--body);
    overflow-x: hidden;
  }

  /* Scanline overlay */
  .scanlines::after {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px, transparent 3px,
      rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* ── GAME BACKGROUND ── */
  .erm-bg-game {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 0;
    pointer-events: none;
  }
  .erm-game-canvas { display: block; width: 100%; height: 100%; }

  .erm-game-hud {
    position: fixed;
    top: 20px; left: 30px; right: 30px;
    display: flex;
    justify-content: space-between;
    font-family: var(--pixel);
    font-size: 0.8rem;
    color: var(--gold);
    z-index: 1;
    text-shadow: 2px 2px 0 var(--navy3), 0 0 10px rgba(255,215,0,0.5);
  }

  /* ── CONTENT WRAPPER ── */
  .erm-content-wrapper {
    position: relative;
    z-index: 10;
  }

  /* ── HERO ── */
  .erm-hero {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .erm-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,245,255,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,45,120,0.06) 0%, transparent 70%),
      rgba(10,14,26,0.6);
    z-index: -1;
  }
  .erm-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* PULLS THE HERO CONTENT UPWARDS */
    transform: translateY(-8vh); 
  }
  
  .erm-hero-avatar-wrap {
    position: relative;
    margin-bottom: 1.5rem;
    display: inline-block;
  }
  .erm-hero-avatar {
    width: 130px;
    height: 130px;
    border-radius: 6px;
    border: 3px solid var(--cyan);
    box-shadow: 6px 6px 0 var(--magenta), 0 0 20px rgba(0,245,255,0.3);
    object-fit: cover;
    display: block;
    background-color: var(--navy2);
  }

  .erm-hero-title {
    font-family: var(--pixel);
    font-size: clamp(1.2rem, 3.5vw, 2.2rem);
    color: var(--gold);
    text-shadow: 0 0 30px rgba(255,215,0,0.5), 4px 4px 0 var(--magenta);
    text-align: center;
    margin-bottom: 0.8rem;
    line-height: 1.4;
  }
  .erm-hero-sub {
    font-family: var(--pixel);
    font-size: clamp(0.5rem, 1.2vw, 0.8rem);
    color: var(--cyan);
    letter-spacing: 0.15em;
    text-align: center;
    text-shadow: 0 0 10px var(--cyan);
    margin-bottom: 2rem;
  }
  .erm-start-btn {
    font-family: var(--pixel);
    font-size: 0.6rem;
    padding: 1rem 2rem;
    border: 2px solid var(--cyan);
    background: rgba(0,245,255,0.1);
    color: var(--cyan);
    cursor: pointer;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(0,245,255,0.2);
    backdrop-filter: blur(4px);
  }
  .erm-start-btn:hover {
    background: var(--cyan);
    color: var(--navy);
    box-shadow: 0 0 25px rgba(0,245,255,0.6);
  }
  .erm-game-controls {
    margin-top: 2rem;
    font-family: var(--pixel);
    font-size: 0.5rem;
    color: var(--white);
    text-align: center;
    letter-spacing: 0.05em;
    background: rgba(10,14,26,0.8);
    padding: 0.5rem 1rem;
    border: 1px solid var(--navy3);
    border-radius: 4px;
  }
  .erm-key {
    display: inline-block;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    border-radius: 2px;
    padding: 2px 6px;
    margin: 0 4px;
    background: rgba(0,245,255,0.1);
  }

  /* ── SECTIONS ── */
  .erm-section {
    padding: 4rem 2rem;
    max-width: 1100px;
    margin: 2rem auto;
    background: rgba(10, 14, 26, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 245, 255, 0.15);
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  }
  .erm-section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  .erm-section-label {
    font-family: var(--pixel);
    font-size: 0.55rem;
    color: var(--magenta);
    letter-spacing: 0.15em;
    text-shadow: 0 0 8px var(--magenta);
  }
  .erm-section-title {
    font-family: var(--pixel);
    font-size: clamp(0.85rem, 2vw, 1.2rem);
    color: var(--white);
    letter-spacing: 0.06em;
  }
  .erm-section-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), transparent);
  }

  /* ── ABOUT ── */
  .erm-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  @media (max-width: 700px) { .erm-about-grid { grid-template-columns: 1fr; } }
  .erm-about-bio { font-size: 1rem; line-height: 1.75; color: rgba(232,234,240,0.85); }
  .erm-about-tagline { font-family: var(--pixel); font-size: 0.6rem; color: var(--cyan); margin-top: 1rem; line-height: 1.6; text-shadow: 0 0 8px rgba(0,245,255,0.4); }
  .erm-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .erm-stat-card {
    background: rgba(17,24,39,0.7);
    border: 1px solid var(--navy3);
    border-top: 2px solid var(--cyan);
    padding: 1.5rem 1rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .erm-stat-num { font-family: var(--pixel); font-size: clamp(1.2rem, 3vw, 1.8rem); color: var(--gold); display: block; text-shadow: 0 0 20px rgba(255,215,0,0.4); }
  .erm-stat-lbl { font-size: 0.75rem; color: var(--gray); margin-top: 0.4rem; letter-spacing: 0.05em; text-transform: uppercase; }

  /* ── SKILLS ── */
  .erm-skills-cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
  .erm-cat-btn {
    font-family: var(--pixel); font-size: 0.45rem; padding: 0.4rem 0.8rem;
    border: 2px solid var(--navy3); background: rgba(17,24,39,0.7); color: var(--gray);
    cursor: pointer; transition: all .2s; letter-spacing: 0.05em;
  }
  .erm-cat-btn.active, .erm-cat-btn:hover { border-color: var(--cyan); color: var(--cyan); text-shadow: 0 0 8px var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.15); }
  .erm-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.75rem; }
  .erm-skill-item { background: rgba(17,24,39,0.7); border: 1px solid var(--navy3); padding: 0.85rem 1rem; transition: border-color .2s, transform .2s; }
  .erm-skill-item:hover { border-color: var(--cyan); transform: translateY(-2px); }
  .erm-skill-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .erm-skill-name { font-family: var(--pixel); font-size: 0.5rem; color: var(--white); letter-spacing: 0.04em; }
  .erm-skill-pct { font-family: var(--pixel); font-size: 0.45rem; color: var(--cyan); text-shadow: 0 0 6px var(--cyan); }
  .erm-skill-bar { height: 6px; background: var(--navy3); border-radius: 0; overflow: hidden; position: relative; }
  .erm-skill-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--magenta)); box-shadow: 0 0 8px rgba(0,245,255,0.5); transition: width 0.8s cubic-bezier(.22,.61,.36,1); }

  /* ── PROJECTS ── */
  .erm-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .erm-project-card { background: rgba(17,24,39,0.7); border: 1px solid var(--navy3); overflow: hidden; transition: border-color .25s, transform .25s, box-shadow .25s; position: relative; }
  .erm-project-card:hover { border-color: var(--cyan); transform: translateY(-4px); box-shadow: 0 0 30px rgba(0,245,255,0.12); }
  .erm-project-img-wrap { position: relative; height: 160px; overflow: hidden; }
  .erm-project-img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.7) brightness(0.8); transition: filter .3s, transform .3s; }
  .erm-project-card:hover .erm-project-img { filter: saturate(1) brightness(0.9); transform: scale(1.04); }
  .erm-project-badge { position: absolute; top: 8px; left: 8px; font-family: var(--pixel); font-size: 0.38rem; background: var(--magenta); color: var(--white); padding: 3px 6px; letter-spacing: 0.05em; }
  .erm-project-body { padding: 1.25rem; }
  .erm-project-title { font-family: var(--pixel); font-size: 0.6rem; color: var(--gold); letter-spacing: 0.05em; margin-bottom: 0.6rem; line-height: 1.5; }
  .erm-project-desc { font-size: 0.82rem; color: rgba(232,234,240,0.75); line-height: 1.6; margin-bottom: 1rem; }
  .erm-project-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .erm-tech-tag { font-family: var(--pixel); font-size: 0.35rem; padding: 3px 6px; border: 1px solid var(--navy3); color: var(--cyan); letter-spacing: 0.04em; background: rgba(0,245,255,0.05); }
  .erm-project-links { display: flex; gap: 0.75rem; }
  .erm-link-btn { font-family: var(--pixel); font-size: 0.4rem; padding: 5px 10px; border: 2px solid var(--cyan); color: var(--cyan); text-decoration: none; letter-spacing: 0.05em; transition: background .2s, color .2s; }
  .erm-link-btn:hover { background: var(--cyan); color: var(--navy); }
  .erm-link-btn.secondary { border-color: var(--navy3); color: var(--gray); }
  .erm-link-btn.secondary:hover { border-color: var(--white); color: var(--white); }

  /* ── EXPERIENCE ── */
  .erm-timeline { position: relative; padding-left: 2rem; }
  .erm-timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--cyan), var(--magenta), transparent); }
  .erm-exp-item { position: relative; padding: 0 0 2.5rem 1.5rem; }
  .erm-exp-item::before { content: '▶'; position: absolute; left: -0.7rem; top: 0.1rem; font-size: 0.6rem; color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }
  .erm-exp-header { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline; margin-bottom: 0.4rem; }
  .erm-exp-role { font-family: var(--pixel); font-size: 0.55rem; color: var(--white); letter-spacing: 0.04em; }
  .erm-exp-company { font-family: var(--pixel); font-size: 0.5rem; color: var(--cyan); text-shadow: 0 0 6px rgba(0,245,255,0.4); }
  .erm-exp-period { font-family: var(--pixel); font-size: 0.38rem; color: var(--gray); margin-left: auto; }
  .erm-exp-desc { font-size: 0.9rem; color: rgba(232,234,240,0.75); line-height: 1.65; }

  /* ── TESTIMONIALS ── */
  .erm-test-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .erm-test-card { background: rgba(17,24,39,0.7); border: 1px solid var(--navy3); border-left: 4px solid var(--magenta); padding: 1.5rem; transition: transform .2s, box-shadow .2s; }
  .erm-test-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(255,45,120,0.1); }
  .erm-test-quote { font-size: 0.88rem; line-height: 1.7; color: rgba(232,234,240,0.85); margin-bottom: 1.25rem; font-style: italic; }
  .erm-test-quote::before { content: '"'; color: var(--magenta); font-size: 1.2rem; }
  .erm-test-author { display: flex; align-items: center; gap: 0.75rem; }
  .erm-test-avatar { width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--magenta); object-fit: cover; }
  .erm-test-name { font-family: var(--pixel); font-size: 0.45rem; color: var(--white); letter-spacing: 0.04em; margin-bottom: 3px; }
  .erm-test-role { font-size: 0.75rem; color: var(--gray); }

  /* ── CONTACT ── */
  .erm-contact-inner { max-width: 640px; margin: 0 auto; text-align: center; }
  .erm-contact-text { font-size: 1rem; color: rgba(232,234,240,0.8); line-height: 1.75; margin-bottom: 2rem; }
  .erm-socials { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; }
  .erm-social-link { font-family: var(--pixel); font-size: 0.45rem; padding: 0.6rem 1.2rem; border: 1px solid var(--navy3); background: rgba(17,24,39,0.7); color: var(--white); text-decoration: none; letter-spacing: 0.06em; transition: border-color .2s, color .2s, box-shadow .2s; display: flex; align-items: center; gap: 0.4rem; }
  .erm-social-link:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 16px rgba(0,245,255,0.15); }
  .erm-cta-email { font-family: var(--pixel); font-size: 0.55rem; padding: 0.8rem 2rem; border: 2px solid var(--gold); background: transparent; color: var(--gold); text-decoration: none; letter-spacing: 0.08em; transition: background .2s, color .2s; display: inline-block; margin-bottom: 1.5rem; text-shadow: 0 0 8px rgba(255,215,0,0.3); }
  .erm-cta-email:hover { background: var(--gold); color: var(--navy); text-shadow: none; }

  /* ── FOOTER ── */
  .erm-footer { padding: 2rem 1.5rem; text-align: center; font-family: var(--pixel); font-size: 0.4rem; color: var(--gray); letter-spacing: 0.06em; position: relative; z-index: 10; }
  .erm-footer span { color: var(--magenta); }

  /* ── SCROLL ANIMATIONS ── */
  .erm-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .erm-reveal.visible { opacity: 1; transform: translateY(0); }
`;

/* ─── HOOK: USE REVEAL ──────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.erm-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── FULL BACKGROUND PIXEL RUNNER ENGINE ───────────────────────────────── */
const PixelRunner = forwardRef(({ onGameStateChange }, ref) => {
  const { portfolioData } = usePortfolio();
  const skills = portfolioData?.skills || [];
  const skillNames = skills.map(s => s.name.length > 8 ? s.name.slice(0, 7) + '.' : s.name);
  
  const canvasRef = useRef(null);
  const skillsRef = useRef(skillNames);
  
  useEffect(() => { skillsRef.current = skillNames; }, [skillNames]);

  const stateRef = useRef({
    running: false, score: 0, hi: 0, speed: 6, // INCREASED INITIAL BASE SPEED
    playerY: 0, velY: 0, jumping: false, dead: false,
    obstacles: [], particles: [],
    frame: 0, groundX: 0,
  });
  const rafRef = useRef(null);
  const [hudScore, setHudScore] = useState(0);
  const [hudHi, setHudHi] = useState(0);

  const PLAYER_W = 33, PLAYER_H = 39;
  const PLAYER_X = 120;

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.running || s.dead) return;
    if (!s.jumping) { s.velY = -12; s.jumping = true; } 
  }, []);

  function startGame() {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (canvas) {
        const H = canvas.height;
        const GROUND = H - Math.min(150, H * 0.15);
        s.playerY = GROUND - PLAYER_H;
    }
    s.running = true; s.score = 0; s.speed = 6.0; // INCREASED GAME START SPEED
    s.velY = 0; s.jumping = false; s.dead = false;
    s.obstacles = []; s.particles = []; s.frame = 0; s.groundX = 0;
    
    if (onGameStateChange) onGameStateChange('running');
    if (!rafRef.current) loop();
  }

  useImperativeHandle(ref, () => ({
    startGame, jump
  }));

  function loop() {
    rafRef.current = requestAnimationFrame(loop);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    const GROUND = H - Math.min(150, H * 0.15);

    ctx.clearRect(0, 0, W, H);

    if (!s.running && !s.dead) {
      drawStatic(ctx, W, H, GROUND);
      return;
    }

    s.frame++;
    if (!s.dead) {
      s.score += 0.08;
      // INCREASED SPEED SCALING OVER TIME
      s.speed = 6.0 + s.score * 0.02; 
    }

    s.groundX = (s.groundX - s.speed) % 80;

    // SCALED DOWN SPAWN FRAME MATH TO ACCOUNT FOR FASTER SPEED
    if (!s.dead && s.frame % Math.max(40, 70 - Math.floor(s.score * 0.3)) === 0) {
      const arr = skillsRef.current.length > 0 ? skillsRef.current : ['DEV', 'CODE'];
      const nameIdx = Math.floor(Math.random() * arr.length);
      const obsH = 30 + Math.random() * 35;
      s.obstacles.push({
        x: W + 20, w: 22, h: obsH, label: arr[nameIdx],
        color: `hsl(${Math.random() * 60 + 340},90%,60%)`,
      });
    }

    if (!s.dead) {
      s.velY += 0.6; // Gravity
      s.playerY += s.velY;
      if (s.playerY >= GROUND - PLAYER_H) {
        s.playerY = GROUND - PLAYER_H;
        s.velY = 0;
        s.jumping = false;
      }
    }

    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,245,255,0.15)';
    ctx.lineWidth = 1;
    for (let x = s.groundX; x < W; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x - 50, H); ctx.stroke();
    }

    drawPlayer(ctx, PLAYER_X, s.playerY, s.frame, s.dead);

    let collisionOccurred = false;
    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      const obs = s.obstacles[i];
      if (!s.dead) obs.x -= s.speed;

      const obsY = GROUND - obs.h;

      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obsY, obs.w, obs.h);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(obs.x, obsY, obs.w, obs.h);

      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(obs.label, obs.x + obs.w / 2, obsY - 8);

      if (!s.dead) {
        const px = PLAYER_X + 6, py = s.playerY + 6;
        const pw = PLAYER_W - 12, ph = PLAYER_H - 12;
        if (px < obs.x + obs.w && px + pw > obs.x && py < obsY + obs.h && py + ph > obsY) {
          collisionOccurred = true;
        }
      }

      if (obs.x < -60) s.obstacles.splice(i, 1);
    }

    if (collisionOccurred && !s.dead) {
        s.dead = true;
        s.running = false;
        if (s.score > s.hi) s.hi = s.score;
        for (let p = 0; p < 20; p++) {
          s.particles.push({
            x: PLAYER_X + PLAYER_W / 2, y: s.playerY + PLAYER_H / 2,
            vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6 - 2,
            life: 40, color: `hsl(${Math.random() * 60},100%,60%)`,
          });
        }
        setHudHi(Math.floor(s.hi));
        if (onGameStateChange) onGameStateChange('dead');
    }

    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.life--;
      ctx.globalAlpha = p.life / 40;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 6, 6);
      ctx.globalAlpha = 1;
      if (p.life <= 0) s.particles.splice(i, 1);
    }

    if (!s.dead) setHudScore(Math.floor(s.score));

    ctx.textAlign = 'left'; 
  }

  function drawStatic(ctx, W, H, GROUND) {
    ctx.strokeStyle = '#00f5ff33';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    drawPlayer(ctx, PLAYER_X, GROUND - PLAYER_H, 0, false);
  }

  function drawPlayer(ctx, x, y, frame, dead) {
    const run = Math.floor(frame / 6) % 2; 
    ctx.fillStyle = dead ? '#ff2d78' : '#00f5ff';
    ctx.fillRect(x + 7, y, 18, 15);
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(x + 12, y + 4, 3, 3);
    ctx.fillRect(x + 19, y + 4, 3, 3);
    ctx.fillStyle = dead ? '#ff2d78' : '#00bcd4';
    ctx.fillRect(x + 6, y + 15, 21, 15);
    ctx.fillStyle = dead ? '#ff2d78' : '#0097a7';
    if (!dead) {
      ctx.fillRect(x + 7, y + 30, 7, run ? 7 : 5);
      ctx.fillRect(x + 18, y + 30, 7, run ? 5 : 7);
    } else {
      ctx.fillRect(x + 6, y + 30, 9, 6);
      ctx.fillRect(x + 18, y + 30, 9, 6);
    }
    ctx.shadowColor = dead ? '#ff2d78' : '#00f5ff';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(x, y, PLAYER_W, PLAYER_H);
    ctx.shadowBlur = 0;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);
    
    rafRef.current = requestAnimationFrame(loop);
    
    const onKey = (e) => { 
        if (['Space','ArrowUp'].includes(e.code)) { 
            e.preventDefault(); 
            jump(); 
        } 
    };
    window.addEventListener('keydown', onKey);
    
    return () => { 
        cancelAnimationFrame(rafRef.current); 
        rafRef.current = null; 
        window.removeEventListener('resize', setSize); 
        window.removeEventListener('keydown', onKey); 
    };
  }, [jump]);

  return (
    <>
      {stateRef.current.running || stateRef.current.dead || stateRef.current.score > 0 ? (
        <div className="erm-game-hud">
          <span>SCORE: {hudScore}</span>
          <span>HI: {hudHi}</span>
        </div>
      ) : null}
      <canvas ref={canvasRef} className="erm-game-canvas" />
    </>
  );
});

/* ─── SECTION HEADER ─────────────────────────────────────────────────────  */
function SectionHeader({ label, title }) {
  return (
    <div className="erm-section-header">
      <div>
        <div className="erm-section-label">{label}</div>
        <div className="erm-section-title">{title}</div>
      </div>
      <div className="erm-section-line" />
    </div>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────────────────────── */
function About() {
  const { portfolioData } = usePortfolio();
  const { personal, stats } = portfolioData || {};

  if (!personal || !stats) return null;

  return (
    <section className="erm-section erm-reveal" id="about">
      <SectionHeader label="// PLAYER.INFO" title="About" />
      <div className="erm-about-grid">
        <div>
          <p className="erm-about-bio">{personal.bio}</p>
          <p className="erm-about-tagline">&gt; {personal.tagline}</p>
        </div>
        <div className="erm-stats-grid">
          <div className="erm-stat-card">
            <span className="erm-stat-num">{stats.yearsExperience}+</span>
            <span className="erm-stat-lbl">Years XP</span>
          </div>
          <div className="erm-stat-card">
            <span className="erm-stat-num">{stats.projectsCompleted}</span>
            <span className="erm-stat-lbl">Projects</span>
          </div>
          <div className="erm-stat-card">
            <span className="erm-stat-num">{stats.happyClients}</span>
            <span className="erm-stat-lbl">Clients</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────────────────  */
function Skills() {
  const { portfolioData } = usePortfolio();
  const skills = portfolioData?.skills || [];
  
  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const [active, setActive] = useState('All');
  const [animate, setAnimate] = useState(false);

  const filtered = active === 'All' ? skills : skills.filter(s => s.category === active);

  const handleCat = (cat) => {
    setAnimate(false);
    setTimeout(() => { setActive(cat); setAnimate(true); }, 10);
  };
  
  useEffect(() => { setAnimate(true); }, []);

  if (skills.length === 0) return null;

  return (
    <section className="erm-section erm-reveal" id="skills">
      <SectionHeader label="// CHAR.STATS" title="Skills" />
      <div className="erm-skills-cats">
        {categories.map(cat => (
          <button key={cat} className={`erm-cat-btn${active === cat ? ' active' : ''}`} onClick={() => handleCat(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="erm-skills-grid">
        {filtered.map((skill) => (
          <div className="erm-skill-item" key={skill.name}>
            <div className="erm-skill-row">
              <span className="erm-skill-name">{skill.name}</span>
              <span className="erm-skill-pct">{skill.level}%</span>
            </div>
            <div className="erm-skill-bar">
              <div className="erm-skill-fill" style={{ width: animate ? `${skill.level}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────────────────  */
function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  if (projects.length === 0) return null;

  return (
    <section className="erm-section erm-reveal" id="projects">
      <SectionHeader label="// QUEST.LOG" title="Projects" />
      <div className="erm-projects-grid">
        {projects.map((p, i) => (
          <div className="erm-project-card" key={p.title || i}>
            <div className="erm-project-img-wrap">
              <img className="erm-project-img" src={p.image} alt={p.title || "Project Screenshot"} loading="lazy" />
              <span className="erm-project-badge">STAGE {String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="erm-project-body">
              <div className="erm-project-title">{p.title}</div>
              <p className="erm-project-desc">{p.description}</p>
              <div className="erm-project-stack">
                {(p.techStack || []).map(t => <span className="erm-tech-tag" key={t}>{t}</span>)}
              </div>
              <div className="erm-project-links">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="erm-link-btn">PLAY</a>}
                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="erm-link-btn secondary">SRC</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ─────────────────────────────────────────────────────────  */
function Experience() {
  const { portfolioData } = usePortfolio();
  const experience = portfolioData?.experience || [];

  if (experience.length === 0) return null;

  return (
    <section className="erm-section erm-reveal" id="experience">
      <SectionHeader label="// MATCH.HISTORY" title="Experience" />
      <div className="erm-timeline">
        {experience.map((exp, i) => (
          <div className="erm-exp-item" key={i}>
            <div className="erm-exp-header">
              <span className="erm-exp-role">{exp.role}</span>
              <span className="erm-exp-company">@ {exp.company}</span>
              <span className="erm-exp-period">{exp.period}</span>
            </div>
            <p className="erm-exp-desc">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────────────────  */
function Testimonials() {
  const { portfolioData } = usePortfolio();
  const testimonials = portfolioData?.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="erm-section erm-reveal" id="testimonials">
      <SectionHeader label="// PLAYER.REVIEWS" title="Testimonials" />
      <div className="erm-test-grid">
        {testimonials.map((t, i) => (
          <div className="erm-test-card" key={i}>
            <p className="erm-test-quote">{t.text}</p>
            <div className="erm-test-author">
              <img className="erm-test-avatar" src={t.avatar} alt={t.name || "Profile Avatar"} />
              <div>
                <div className="erm-test-name">{t.name}</div>
                <div className="erm-test-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────────────  */
function Contact() {
  const { portfolioData } = usePortfolio();
  const socials = portfolioData?.socials || {};

  return (
    <section className="erm-section erm-reveal" id="contact">
      <SectionHeader label="// CONTINUE?" title="Contact Me" />
      <div className="erm-contact-inner">
        <p className="erm-contact-text">
          Got a project in mind, or just want to say hi? My inbox is always open.
          Let's build something great together.
        </p>
        <a href={`mailto:${socials.email || ''}`} className="erm-cta-email">&gt; SEND MESSAGE_</a>
        <div className="erm-socials">
          {socials.github   && <a href={socials.github}   target="_blank" rel="noopener noreferrer" className="erm-social-link">⬡ GitHub</a>}
          {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="erm-social-link">⬡ LinkedIn</a>}
          {socials.twitter  && <a href={socials.twitter}  target="_blank" rel="noopener noreferrer" className="erm-social-link">⬡ Twitter</a>}
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN TEMPLATE ──────────────────────────────────────────────────────  */
export default function EndlessRunnerMinigame() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};

  useReveal();

  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('idle'); // idle | running | dead

  const handleStartGame = () => {
      gameRef.current?.startGame();
  };

  return (
    <div className="scanlines">
      <style>{STYLES}</style>
      
      {/* ── BACKGROUND GAME ── */}
      <div className="erm-bg-game">
        <PixelRunner ref={gameRef} onGameStateChange={setGameState} />
      </div>

      {/* ── FOREGROUND CONTENT ── */}
      <div className="erm-content-wrapper">
          <section className="erm-hero">
            <div className="erm-hero-bg" />
            
            <div className="erm-hero-content">
                {/* ── AVATAR INTEGRATION ── */}
                {personal.avatar && (
                  <div className="erm-hero-avatar-wrap">
                    <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="erm-hero-avatar" />
                  </div>
                )}

                <div className="erm-hero-title">{personal.name || 'PLAYER 1'}</div>
                <div className="erm-hero-sub">{personal.title || 'Developer'}</div>
                
                {gameState === 'idle' && (
                    <button className="erm-start-btn" onClick={handleStartGame}>
                        START BACKGROUND GAME
                    </button>
                )}

                {gameState === 'dead' && (
                    <button className="erm-start-btn" style={{ borderColor: '#ff2d78', color: '#ff2d78' }} onClick={handleStartGame}>
                        GAME OVER // RETRY
                    </button>
                )}

                {gameState === 'running' && (
                    <div className="erm-game-controls">
                        <span className="erm-key">SPACE</span> or <span className="erm-key">↑</span> to JUMP over obstacles!
                    </div>
                )}
            </div>
          </section>

          <About />
          <Skills />
          <Projects />
          <Experience />
          <Testimonials />
          <Contact />

          <footer className="erm-footer">
            © {new Date().getFullYear()} <span>{personal.name || 'DEV'}</span> · CRAFTED WITH &lt;3 · {personal.location || 'THE WEB'}
          </footer>
      </div>
    </div>
  );
}