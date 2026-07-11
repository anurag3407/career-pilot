import React, { useEffect, useRef, useState } from 'react';
import { Settings, Play, Pause, RefreshCw, Layers, ShieldAlert } from 'lucide-react';

export default function FluidCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Settings state (controlled by overlay)
  const [isOpen, setIsOpen] = useState(false);
  const [particleCount, setParticleCount] = useState(400);
  const [flowSpeed, setFlowSpeed] = useState(1.2);
  const [viscosity, setViscosity] = useState(0.96); // lower means more friction (higher viscosity)
  const [turbulence, setTurbulence] = useState(0.6);
  const [particleSize, setParticleSize] = useState(2.2);
  const [colorMode, setColorMode] = useState('aqua'); // aqua, nebula, magma, acid
  const [showVectors, setShowVectors] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Keep settings refs so the anim loop has instant access without recreation
  const settingsRef = useRef({
    particleCount,
    flowSpeed,
    viscosity,
    turbulence,
    particleSize,
    colorMode,
    showVectors,
    isPaused
  });

  useEffect(() => {
    settingsRef.current = {
      particleCount,
      flowSpeed,
      viscosity,
      turbulence,
      particleSize,
      colorMode,
      showVectors,
      isPaused
    };
  }, [particleCount, flowSpeed, viscosity, turbulence, particleSize, colorMode, showVectors, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: 0,
      lastY: 0,
      active: false
    };

    // Particles list
    let particles = [];
    // Shockwaves from clicks
    let shockwaves = [];

    // Helper to generate a particle
    const createParticle = (x = Math.random() * width, y = Math.random() * height, isBurst = false) => {
      const colors = {
        aqua: ['#06b6d4', '#3b82f6', '#60a5fa', '#0ea5e9'],
        nebula: ['#a855f7', '#ec4899', '#f43f5e', '#d946ef'],
        magma: ['#f97316', '#ef4444', '#f59e0b', '#dc2626'],
        acid: ['#10b981', '#84cc16', '#22c55e', '#a3e635']
      };
      
      const themeColors = colors[settingsRef.current.colorMode] || colors.aqua;
      const color = themeColors[Math.floor(Math.random() * themeColors.length)];

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: (Math.random() * 0.8 + 0.6) * settingsRef.current.particleSize,
        color,
        alpha: Math.random() * 0.5 + 0.3,
        life: isBurst ? Math.random() * 60 + 40 : Infinity,
        maxLife: isBurst ? 100 : Infinity
      };
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < settingsRef.current.particleCount; i++) {
        particles.push(createParticle());
      }
    };
    initParticles();

    // Event listener: fluid bursts on demand
    const handleBurst = (e) => {
      const { x, y, count = 25, color } = e.detail || {};
      const actualX = x || Math.random() * width;
      const actualY = y || Math.random() * height;
      
      for (let i = 0; i < count; i++) {
        const p = createParticle(actualX, actualY, true);
        if (color) p.color = color;
        // Explode velocity outwards
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.size *= 1.4;
        particles.push(p);
      }
    };
    window.addEventListener('fluid-burst', handleBurst);

    // Event listener: push current flow
    const handleFlow = (e) => {
      const { x, y, dx, dy, radius = 200, strength = 3 } = e.detail || {};
      particles.forEach(p => {
        const distSq = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / radius) * strength;
          p.vx += dx * force;
          p.vy += dy * force;
        }
      });
    };
    window.addEventListener('fluid-flow', handleFlow);

    // Mouse handlers
    const handleMouseMove = (e) => {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = mouse.x - mouse.lastX;
      mouse.vy = mouse.y - mouse.lastY;
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseClick = (e) => {
      // Trigger shockwave
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 280,
        strength: 18,
        speed: 8
      });
      // also create local particle explosion
      window.dispatchEvent(new CustomEvent('fluid-burst', {
        detail: { x: e.clientX, y: e.clientY, count: 20 }
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Flow Field math solver
    const getFlowVector = (x, y, time) => {
      const speed = settingsRef.current.flowSpeed;
      // Combine multiple layered sine waves to produce scrolling organic vortices
      const scale1 = 0.0025;
      const scale2 = 0.006;
      
      const angle1 = Math.sin(x * scale1 + time * 0.04 * speed) * Math.cos(y * scale1 - time * 0.03 * speed) * Math.PI * 2.5;
      const angle2 = Math.cos(x * scale2 - time * 0.025 * speed) * Math.sin(y * scale2 + time * 0.035 * speed) * Math.PI * 1.5;
      
      const angle = (angle1 + angle2) * 0.5;
      
      return {
        x: Math.cos(angle) * 0.45 * speed,
        y: Math.sin(angle) * 0.45 * speed
      };
    };

    let time = 0;
    
    // Animation frame loop
    const loop = () => {
      if (!settingsRef.current.isPaused) {
        time += 0.5;

        // Clear screen with custom trails (motion blur advection)
        ctx.fillStyle = 'rgba(8, 8, 12, 0.088)';
        ctx.fillRect(0, 0, width, height);

        // Draw Vector Field arrows if toggled
        if (settingsRef.current.showVectors) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
          ctx.lineWidth = 1;
          const spacing = 40;
          for (let x = spacing / 2; x < width; x += spacing) {
            for (let y = spacing / 2; y < height; y += spacing) {
              const vector = getFlowVector(x, y, time);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + vector.x * 35, y + vector.y * 35);
              ctx.stroke();
            }
          }
        }

        // Update & Render Shockwaves
        shockwaves = shockwaves.filter(s => {
          s.radius += s.speed;
          // draw subtle ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - s.radius / s.maxRadius)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.stroke();
          return s.radius < s.maxRadius;
        });

        // Decay mouse velocity
        mouse.vx *= 0.92;
        mouse.vy *= 0.92;

        // Maintain constant particles count
        const maxNormalParticles = settingsRef.current.particleCount;
        let normalCount = 0;
        particles.forEach(p => {
          if (p.life === Infinity) normalCount++;
        });

        if (normalCount < maxNormalParticles) {
          for (let i = 0; i < maxNormalParticles - normalCount; i++) {
            particles.push(createParticle());
          }
        }

        // Update and draw particles
        particles = particles.filter(p => {
          // Calculate flow field vector at particle position
          const flow = getFlowVector(p.x, p.y, time);
          
          // Apply flow field force
          p.vx += flow.x * 0.15;
          p.vy += flow.y * 0.15;

          // Apply turbulence (random walks)
          const turb = settingsRef.current.turbulence;
          if (turb > 0) {
            p.vx += (Math.random() - 0.5) * turb * 0.25;
            p.vy += (Math.random() - 0.5) * turb * 0.25;
          }

          // Apply mouse interaction
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 160;

            if (dist < influenceRadius && dist > 1) {
              const strength = 1.0 - dist / influenceRadius;
              
              // 1. Swirl vortex force
              const swirlSpeed = 2.4;
              p.vx += (-dy / dist) * strength * swirlSpeed;
              p.vy += (dx / dist) * strength * swirlSpeed;

              // 2. Drag velocity along with mouse movement
              p.vx += mouse.vx * strength * 0.12;
              p.vy += mouse.vy * strength * 0.12;

              // 3. Dynamic repulsion
              const pushForce = 0.5;
              p.vx += (dx / dist) * strength * pushForce;
              p.vy += (dy / dist) * strength * pushForce;
            }
          }

          // Apply Shockwaves
          shockwaves.forEach(s => {
            const dx = p.x - s.x;
            const dy = p.y - s.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const thickness = 40;

            if (Math.abs(dist - s.radius) < thickness) {
              const pushStrength = (1.0 - Math.abs(dist - s.radius) / thickness) * s.strength;
              // Push outwards
              p.vx += (dx / (dist || 1)) * pushStrength * 0.5;
              p.vy += (dy / (dist || 1)) * pushStrength * 0.5;
            }
          });

          // Apply Viscosity/Friction
          p.vx *= settingsRef.current.viscosity;
          p.vy *= settingsRef.current.viscosity;

          // Move particle
          p.x += p.vx;
          p.y += p.vy;

          // Decay burst particle life
          if (p.life !== Infinity) {
            p.life--;
            p.alpha = (p.life / p.maxLife) * 0.8;
          }

          // Handle boundaries
          let keep = true;
          if (p.life === Infinity) {
            const padding = 10;
            if (p.x < -padding) p.x = width + padding;
            else if (p.x > width + padding) p.x = -padding;
            
            if (p.y < -padding) p.y = height + padding;
            else if (p.y > height + padding) p.y = -padding;
          } else {
            // Remove burst particles when dead
            keep = p.life > 0;
          }

          // Draw particle
          if (keep) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          return keep;
        });

        // Reset globalAlpha
        ctx.globalAlpha = 1.0;
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fluid-burst', handleBurst);
      window.removeEventListener('fluid-flow', handleFlow);
    };
  }, []);

  // Trigger recalculation of particles
  const triggerReset = () => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: { x: window.innerWidth / 2, y: window.innerHeight / 2, count: 100 }
    }));
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto block" />
      
      {/* Visual Hexagonal Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} 
      />

      {/* Floating Simulation Settings Panel (Interactive controls) */}
      <div className="absolute bottom-6 left-6 z-40 pointer-events-auto select-none font-sans text-xs">
        <button type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-700/50 backdrop-blur-md rounded-lg text-slate-300 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
        >
          <Settings className={`w-4 h-4 ${isOpen ? 'animate-spin' : ''}`} />
          <span>Simulation Controls</span>
        </button>

        {isOpen && (
          <div className="mt-3 p-4 w-72 bg-slate-900/90 border border-slate-700/50 backdrop-blur-xl rounded-xl shadow-2xl text-slate-300 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Flow Dynamics Solver
              </span>
              <button type="button" 
                onClick={() => setIsPaused(!isPaused)} 
                className="p-1 hover:bg-slate-800 rounded transition"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-green-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>

            {/* Particle count */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Particle Density</span>
                <span className="font-mono text-cyan-400">{particleCount}</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Flow speed */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Current Velocity</span>
                <span className="font-mono text-cyan-400">{flowSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={flowSpeed}
                onChange={(e) => setFlowSpeed(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Turbulence */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Turbulence Ratio</span>
                <span className="font-mono text-cyan-400">{turbulence.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={turbulence}
                onChange={(e) => setTurbulence(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Damping / Viscosity */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Fluid Viscosity</span>
                <span className="font-mono text-cyan-400">
                  {((1 - viscosity) * 100).toFixed(0)} cSt
                </span>
              </div>
              <input
                type="range"
                min="0.90"
                max="0.99"
                step="0.01"
                value={viscosity}
                onChange={(e) => setViscosity(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Particle size */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Blob Radius</span>
                <span className="font-mono text-cyan-400">{particleSize.toFixed(1)}px</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.2"
                value={particleSize}
                onChange={(e) => setParticleSize(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Colors modes */}
            <div className="space-y-2">
              <span>Simulation Chemistry</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'aqua', label: 'Aqua', class: 'bg-cyan-500 border-cyan-400 text-cyan-100' },
                  { id: 'nebula', label: 'Nebula', class: 'bg-purple-500 border-purple-400 text-purple-100' },
                  { id: 'magma', label: 'Magma', class: 'bg-orange-500 border-orange-400 text-orange-100' },
                  { id: 'acid', label: 'Acid', class: 'bg-emerald-500 border-emerald-400 text-emerald-100' }
                ].map(mode => (
                  <button type="button"
                    key={mode.id}
                    onClick={() => setColorMode(mode.id)}
                    className={`px-1 py-1 rounded text-[10px] border font-bold transition cursor-pointer text-center ${
                      colorMode === mode.id 
                        ? `${mode.class} shadow-lg scale-105` 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra options */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 bg-slate-800 focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
                />
                <span>Vector Grid</span>
              </label>

              <button type="button"
                onClick={triggerReset}
                className="flex items-center gap-1 hover:text-white transition cursor-pointer bg-slate-800 px-2 py-1 rounded"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Inject Flow</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
