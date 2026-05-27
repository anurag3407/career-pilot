import { useEffect, useRef, useState } from "react";
import { Sparkles, Zap, Triangle, Hexagon, Star } from "lucide-react";
 
const PRISM_COLORS = [
  { stop: "0%", color: "#ff0080" },
  { stop: "16%", color: "#ff4d00" },
  { stop: "33%", color: "#ffee00" },
  { stop: "50%", color: "#00ff88" },
  { stop: "66%", color: "#00cfff" },
  { stop: "83%", color: "#7b2fff" },
  { stop: "100%", color: "#ff0080" },
];
 
const FLOATING_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));
 
const skills = [
  { label: "React", icon: Zap, value: 92 },
  { label: "Design", icon: Star, value: 85 },
  { label: "Motion", icon: Sparkles, value: 78 },
  { label: "Systems", icon: Hexagon, value: 88 },
];
 
function HoloPrism({ size = 120, rotate = 0, delay = 0, opacity = 0.6 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        animation: `prismFloat ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <defs>
          <linearGradient id={`holoGrad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {PRISM_COLORS.map(({ stop, color }) => (
              <stop key={stop} offset={stop} stopColor={color} stopOpacity="0.9" />
            ))}
          </linearGradient>
          <filter id={`glow-${delay}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <polygon
          points="60,8 112,100 8,100"
          fill={`url(#holoGrad-${delay})`}
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.4"
          filter={`url(#glow-${delay})`}
        />
        <polygon
          points="60,8 112,100 8,100"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <line x1="60" y1="8" x2="60" y2="100" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
        <line x1="8" y1="100" x2="86" y2="54" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
        <line x1="112" y1="100" x2="34" y2="54" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
      </svg>
    </div>
  );
}
 
function SkillBar({ label, icon: Icon, value, index }) {
  const [animated, setAnimated] = useState(false);
 
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), index * 150 + 300);
    return () => clearTimeout(timer);
  }, [index]);
 
  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-md"
            style={{
              background: "linear-gradient(135deg, rgba(255,0,128,0.2), rgba(0,207,255,0.2))",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}
          >
            <Icon size={12} style={{ color: "#00cfff" }} />
          </div>
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {label}
          </span>
        </div>
        <span
          className="text-xs font-bold"
          style={{
            background: "linear-gradient(90deg, #ff0080, #00cfff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${value}%` : "0%",
            background: `linear-gradient(90deg, #ff0080, #7b2fff, #00cfff)`,
            boxShadow: "0 0 8px rgba(0,207,255,0.6)",
          }}
        />
      </div>
    </div>
  );
}
 
function PrismLightBeam({ angle, color, delay }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(${angle}deg, transparent 40%, ${color}08 50%, transparent 60%)`,
        animation: `beamSweep ${8 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
 
export default function PrismEffect({ name = "Alex Rivera", title = "Creative Developer", tagline = "Refracting ideas into reality" }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);
 
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes prismFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-12px) rotate(2deg); }
        66% { transform: translateY(6px) rotate(-1deg); }
      }
      @keyframes beamSweep {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes holoPulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
      }
      @keyframes particleDrift {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(-60px) translateX(20px); opacity: 0; }
      }
      @keyframes rainbowShift {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      @keyframes scanLine {
        0% { top: -2px; }
        100% { top: 100%; }
      }
      @keyframes holoShimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
 
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
 
  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#03010a" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(123,47,255,0.15) 0%, rgba(0,207,255,0.08) 30%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,0,128,0.1) 0%, transparent 50%), #03010a`,
          transition: "background 0.3s ease",
        }}
      />
 
      {/* Light beams from prism */}
      <PrismLightBeam angle={30} color="#ff0080" delay={0} />
      <PrismLightBeam angle={80} color="#00cfff" delay={2} />
      <PrismLightBeam angle={150} color="#7b2fff" delay={4} />
      <PrismLightBeam angle={210} color="#ffee00" delay={1.5} />
 
      {/* Floating particles */}
      {FLOATING_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(${(p.id * 37) % 360}, 100%, 70%)`,
            boxShadow: `0 0 ${p.size * 2}px hsl(${(p.id * 37) % 360}, 100%, 70%)`,
            animation: `particleDrift ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
 
      {/* Floating prisms — background layer */}
      <div className="absolute top-16 left-8 md:left-24">
        <HoloPrism size={60} rotate={-20} delay={0} opacity={0.25} />
      </div>
      <div className="absolute top-24 right-8 md:right-20">
        <HoloPrism size={80} rotate={15} delay={1.5} opacity={0.2} />
      </div>
      <div className="absolute bottom-32 left-4 md:left-16">
        <HoloPrism size={50} rotate={30} delay={3} opacity={0.2} />
      </div>
      <div className="absolute bottom-16 right-4 md:right-32">
        <HoloPrism size={70} rotate={-10} delay={2} opacity={0.15} />
      </div>
 
      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
 
        {/* Left — Prism hero */}
        <div className="flex-shrink-0 relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
 
          {/* Rotating rainbow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #ff0080, #ff4d00, #ffee00, #00ff88, #00cfff, #7b2fff, #ff0080)",
              animation: "rainbowShift 4s linear infinite",
              padding: "2px",
              borderRadius: "50%",
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ background: "#03010a" }}
            />
          </div>
 
          {/* Inner glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "8px",
              background: "radial-gradient(circle, rgba(123,47,255,0.2) 0%, rgba(0,207,255,0.1) 50%, transparent 70%)",
              animation: "holoPulse 3s ease-in-out infinite",
            }}
          />
 
          {/* Central prism */}
          <div
            className="relative z-10"
            style={{ animation: "holoPulse 4s ease-in-out infinite", animationDelay: "0.5s" }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="mainPrismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  {PRISM_COLORS.map(({ stop, color }) => (
                    <stop key={stop} offset={stop} stopColor={color} stopOpacity="0.95" />
                  ))}
                </linearGradient>
                <filter id="mainGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Glow layer */}
              <polygon
                points="70,6 134,118 6,118"
                fill="url(#mainPrismGrad)"
                opacity="0.3"
                filter="url(#mainGlow)"
              />
              {/* Main prism */}
              <polygon
                points="70,6 134,118 6,118"
                fill="url(#mainPrismGrad)"
                stroke="white"
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              {/* Internal geometry */}
              <line x1="70" y1="6" x2="70" y2="118" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="6" y1="118" x2="102" y2="62" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="134" y1="118" x2="38" y2="62" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
              {/* Highlight */}
              <polygon
                points="70,6 95,48 45,48"
                fill="white"
                opacity="0.12"
              />
            </svg>
          </div>
 
          {/* Scan line effect */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            style={{ mixBlendMode: "overlay" }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                animation: "scanLine 3s linear infinite",
              }}
            />
          </div>
 
          {/* Corner badges */}
          <div
            className="absolute -top-3 -right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #7b2fff, #00cfff)",
              color: "white",
              fontFamily: "'Courier New', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              boxShadow: "0 0 12px rgba(123,47,255,0.6)",
            }}
          >
            <Sparkles size={10} />
            HOLO
          </div>
        </div>
 
        {/* Right — Info panel */}
        <div className="flex-1 text-center lg:text-left">
 
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="px-3 py-1 rounded-full text-xs tracking-widest uppercase"
              style={{
                background: "rgba(0,207,255,0.1)",
                border: "0.5px solid rgba(0,207,255,0.3)",
                color: "rgba(0,207,255,0.9)",
                fontFamily: "'Courier New', monospace",
              }}
            >
              ◈ Available for work
            </div>
          </div>
 
          {/* Name */}
          <h1
            className="text-4xl md:text-6xl font-black mb-3 leading-none"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h1>
 
          {/* Title — rainbow */}
          <div
            className="text-lg md:text-2xl font-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #ff0080, #7b2fff, #00cfff, #00ff88, #ff0080)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "holoShimmer 4s linear infinite",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </div>
 
          {/* Tagline */}
          <p
            className="text-sm mb-8 max-w-sm mx-auto lg:mx-0"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.08em",
            }}
          >
            ⟨ {tagline} ⟩
          </p>
 
          {/* Separator */}
          <div
            className="w-full h-px mb-8 mx-auto lg:mx-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              maxWidth: "400px",
            }}
          />
 
          {/* Skills */}
          <div className="space-y-4 max-w-sm mx-auto lg:mx-0 mb-8">
            {skills.map((skill, i) => (
              <SkillBar key={skill.label} {...skill} index={i} />
            ))}
          </div>
 
          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              className="group relative px-6 py-3 rounded-lg text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #ff0080, #7b2fff)",
                color: "white",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.1em",
                boxShadow: "0 0 20px rgba(123,47,255,0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={14} /> View Work
              </span>
            </button>
 
            <button
              className="px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: "transparent",
                border: "0.5px solid rgba(0,207,255,0.4)",
                color: "rgba(0,207,255,0.9)",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.1em",
              }}
            >
              <span className="flex items-center gap-2">
                <Triangle size={12} /> Contact
              </span>
            </button>
          </div>
        </div>
      </div>
 
      {/* Bottom grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
 
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,1,10,0.7) 100%)",
        }}
      />
    </section>
  );
}
 


