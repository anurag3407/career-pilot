import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const defaultData = {
  personal: {
    name: "Aiden Mercer",
    title: "Full-Stack Engineer & Creative Technologist",
    bio: "I craft digital experiences that live at the intersection of engineering and art. Passionate about building systems that breathe, interfaces that feel alive, and products that leave a mark.",
    avatar: "",
    email: "aiden@deepweb.dev",
    location: "San Francisco, CA",
    website: "https://aidenmercer.dev",
  },
  socials: [
    { platform: "GitHub", url: "https://github.com", icon: "GH" },
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "LI" },
    { platform: "Twitter", url: "https://twitter.com", icon: "TW" },
    { platform: "Dribbble", url: "https://dribbble.com", icon: "DR" },
  ],
  skills: [
    { name: "React / Next.js", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Frontend" },
    { name: "Node.js", level: 88, category: "Backend" },
    { name: "Python", level: 82, category: "Backend" },
    { name: "PostgreSQL", level: 78, category: "Database" },
    { name: "GraphQL", level: 85, category: "API" },
    { name: "Docker / K8s", level: 75, category: "DevOps" },
    { name: "WebGL / Three.js", level: 70, category: "Creative" },
    { name: "Figma / Design", level: 80, category: "Design" },
  ],
  projects: [
    {
      title: "NeuralCanvas",
      description: "Real-time collaborative AI art generation platform with WebSocket sync, custom diffusion pipeline, and generative UI components.",
      tech: ["React", "Python", "WebSocket", "CUDA"],
      link: "https://github.com",
      year: "2024",
      color: "#00d4ff",
    },
    {
      title: "OceanDB",
      description: "Distributed time-series database optimized for IoT sensor streams. Handles 1M+ writes/sec with sub-millisecond query latency.",
      tech: ["Rust", "RocksDB", "gRPC", "K8s"],
      link: "https://github.com",
      year: "2024",
      color: "#7b2fff",
    },
    {
      title: "Lumina UI",
      description: "Open-source React component library with physics-based animations, 40+ components, and full accessibility compliance.",
      tech: ["TypeScript", "React", "Framer", "Storybook"],
      link: "https://github.com",
      year: "2023",
      color: "#00ff9d",
    },
    {
      title: "DeepRoute",
      description: "ML-powered route optimization engine for last-mile delivery. Reduced average delivery time by 32% across 50k daily routes.",
      tech: ["Python", "TensorFlow", "FastAPI", "Redis"],
      link: "https://github.com",
      year: "2023",
      color: "#ff6b35",
    },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Anthropic",
      period: "2023 – Present",
      description: "Building large-scale ML infrastructure and developer tooling for frontier AI systems.",
    },
    {
      role: "Software Engineer II",
      company: "Vercel",
      period: "2021 – 2023",
      description: "Core contributor to Edge Runtime and middleware architecture powering 1M+ deployments.",
    },
    {
      role: "Full-Stack Engineer",
      company: "Figma",
      period: "2020 – 2021",
      description: "Built real-time collaboration features and plugin API infrastructure used by 4M+ designers.",
    },
    {
      role: "Frontend Engineer",
      company: "Stripe",
      period: "2018 – 2020",
      description: "Developed Stripe Dashboard components and payment UX flows processing $500B+ annually.",
    },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const safe = (val, fallback = []) => (Array.isArray(val) ? val : fallback);
const safeOpen = (url) => {
  if (!url || typeof url !== "string") return;
  try { new URL(url); window.open(url, "_blank", "noopener,noreferrer"); } catch {}
};

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#020b18",
  deep: "#030e20",
  mid: "#041525",
  surface: "rgba(0,180,220,0.05)",
  border: "rgba(0,210,255,0.12)",
  borderHover: "rgba(0,210,255,0.35)",
  cyan: "#00d4ff",
  teal: "#00ffc3",
  violet: "#7b2fff",
  bio: "#0af",
  text: "#c8e8f0",
  muted: "#5a8a9a",
  white: "#e8f4f8",
  glow: "0 0 40px rgba(0,212,255,0.25)",
  glowStrong: "0 0 60px rgba(0,212,255,0.45), 0 0 120px rgba(0,212,255,0.15)",
};

// ─── FONT INJECTION ───────────────────────────────────────────────────────────
const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #020b18; }
  ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.4); border-radius: 2px; }
  @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
  @keyframes pulse-glow { 0%,100%{opacity:0.4;box-shadow:0 0 20px rgba(0,212,255,0.3)} 50%{opacity:1;box-shadow:0 0 60px rgba(0,212,255,0.7)} }
  @keyframes caustic { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes orbit { from{transform:rotate(0deg) translateX(var(--r,60px)) rotate(0deg)} to{transform:rotate(360deg) translateX(var(--r,60px)) rotate(-360deg)} }
  @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
  @keyframes breathe { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
  @keyframes waveflow {
    0%   { d: path("M0,40 C80,60 160,20 240,40 C320,60 400,20 480,40 C560,60 640,20 720,40 L720,80 L0,80 Z"); }
    50%  { d: path("M0,40 C80,20 160,60 240,40 C320,20 400,60 480,40 C560,20 640,60 720,40 L720,80 L0,80 Z"); }
    100% { d: path("M0,40 C80,60 160,20 240,40 C320,60 400,20 480,40 C560,60 640,20 720,40 L720,80 L0,80 Z"); }
  }
  @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
  @keyframes textglow {
    0%,100% { text-shadow: 0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2); }
    50%      { text-shadow: 0 0 40px rgba(0,212,255,0.9), 0 0 80px rgba(0,212,255,0.4), 0 0 120px rgba(0,212,255,0.2); }
  }
  @keyframes rise { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fillbar { from{width:0%} to{width:var(--w)} }
  @keyframes bubble-rise {
    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
    25% { transform: translateY(-25vh) translateX(8px) scale(1.05); opacity: 0.8; }
    50% { transform: translateY(-50vh) translateX(-6px) scale(0.95); opacity: 0.7; }
    75% { transform: translateY(-75vh) translateX(10px) scale(1.02); opacity: 0.5; }
    100% { transform: translateY(-100vh) translateX(-4px) scale(0.8); opacity: 0; }
  }
  @keyframes fade-in-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
`;

// ─── BUBBLE PARTICLE SYSTEM ───────────────────────────────────────────────────
const BubbleField = () => {
  const bubbles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 14,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            bottom: "-20px",
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), rgba(0,212,255,0.1))`,
            border: "1px solid rgba(0,212,255,0.4)",
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s ${b.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
};

// ─── CURSOR BIOLUMINESCENCE ───────────────────────────────────────────────────
const CursorGlow = () => {
  const trailRef = useRef([]);
  const rafRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const MAX = 12;
    const dots = Array.from({ length: MAX }, (_, i) => {
      const el = document.createElement("div");
      const size = 6 + i * 2.2;
      Object.assign(el.style, {
        position: "fixed", borderRadius: "50%", pointerEvents: "none",
        zIndex: 9999, transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, rgba(0,212,255,${0.7 - i * 0.05}), transparent)`,
        width: `${size}px`, height: `${size}px`,
        filter: `blur(${i * 0.5}px)`,
        transition: `opacity 0.3s`,
        opacity: 0,
      });
      document.body.appendChild(el);
      return { el, x: 0, y: 0 };
    });
    trailRef.current = dots;

    let mx = 0, my = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      let px = mx, py = my;
      dots.forEach((d, i) => {
        d.el.style.opacity = 1;
        setTimeout(() => {
          d.x += (px - d.x) * (0.35 - i * 0.025);
          d.y += (py - d.y) * (0.35 - i * 0.025);
          d.el.style.left = `${d.x}px`;
          d.el.style.top = `${d.y}px`;
          px = d.x; py = d.y;
        }, i * 12);
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      dots.forEach((d) => d.el.remove());
    };
  }, []);

  return null;
};

// ─── ANIMATED STARS / PLANKTON ────────────────────────────────────────────────
const PlanktonField = () => {
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 5,
      color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.teal : C.violet,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            animation: `twinkle ${2 + Math.random() * 3}s ${s.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

// ─── CAUSTIC LIGHT OVERLAY ────────────────────────────────────────────────────
const CausticOverlay = () => (
  <div
    style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
      background: `
        radial-gradient(ellipse 80% 60% at 20% 20%, rgba(0,180,255,0.04) 0%, transparent 70%),
        radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,255,180,0.03) 0%, transparent 70%),
        radial-gradient(ellipse 100% 40% at 50% 50%, rgba(100,0,255,0.02) 0%, transparent 70%)
      `,
      animation: "caustic 12s ease-in-out infinite",
    }}
  />
);

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
const Section = ({ id, children, style = {} }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      id={id}
      ref={ref}
      style={{
        padding: "100px 0",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        ...style,
      }}
    >
      {children}
    </section>
  );
};

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
const SectionHead = ({ label, title }) => (
  <div style={{ marginBottom: 56, textAlign: "center" }}>
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: C.teal, textTransform: "uppercase", marginBottom: 12, opacity: 0.8 }}>
      {label}
    </div>
    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: C.white, animation: "textglow 4s ease-in-out infinite" }}>
      {title}
    </h2>
    <div style={{ width: 60, height: 2, margin: "20px auto 0", background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)` }} />
  </div>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = ({ data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const sections = ["home", "about", "skills", "projects", "experience", "contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const cur = sections.find((s) => {
        const el = document.getElementById(s);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });
      if (cur) setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 clamp(20px,5vw,80px)",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(2,11,24,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: C.cyan, letterSpacing: 1, cursor: "pointer", animation: "textglow 4s ease-in-out infinite" }}
        onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}>
        {(data?.personal?.name || defaultData.personal.name).split(" ")[0]}
        <span style={{ color: C.teal }}>.</span>
      </div>
      <div style={{ display: "flex", gap: "clamp(12px,2vw,32px)", alignItems: "center" }}>
        {sections.map((s) => (
          <button key={s} onClick={() => document.getElementById(s)?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: 11,
              letterSpacing: 1.5, textTransform: "uppercase",
              color: active === s ? C.cyan : C.muted,
              textShadow: active === s ? `0 0 12px ${C.cyan}` : "none",
              transition: "all 0.3s",
              padding: "4px 0",
              borderBottom: active === s ? `1px solid ${C.cyan}` : "1px solid transparent",
            }}>
            {s}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const HeroSection = ({ data }) => {
  const p = data?.personal || defaultData.personal;
  const socials = safe(data?.socials, defaultData.socials);
  const [typed, setTyped] = useState("");
  const full = p.title || defaultData.personal.title;

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [full]);

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", padding: "0 clamp(20px,5vw,80px)",
      textAlign: "center", overflow: "hidden",
    }}>
      {/* Depth rings */}
      {[200, 340, 480, 620].map((r, i) => (
        <div key={r} style={{
          position: "absolute", borderRadius: "50%",
          width: r, height: r,
          border: `1px solid rgba(0,212,255,${0.12 - i * 0.025})`,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          animation: `breathe ${3 + i}s ${i * 0.5}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Central organism glow */}
      <div style={{
        position: "absolute", width: 280, height: 280, borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)",
        animation: "pulse-glow 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 5, maxWidth: 780 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 5,
          color: C.teal, textTransform: "uppercase", marginBottom: 24, opacity: 0.8,
          animation: "rise 1s 0.2s both ease",
        }}>
          ◈ &nbsp; Depth: ∞ &nbsp; ◈ &nbsp; Bioluminescent Interface &nbsp; ◈
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(44px,7vw,96px)",
          fontWeight: 800, lineHeight: 1.05,
          color: C.white,
          animation: "rise 1s 0.4s both ease, textglow 4s 1.4s ease-in-out infinite",
          marginBottom: 24,
        }}>
          {p.name || defaultData.personal.name}
        </h1>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(14px,2vw,22px)",
          color: C.cyan, minHeight: 32, marginBottom: 28,
          animation: "rise 1s 0.6s both ease",
        }}>
          {typed}
          <span style={{ animation: "pulse-glow 1s infinite", opacity: 0.8 }}>|</span>
        </div>

        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(15px,1.5vw,18px)",
          color: C.text, lineHeight: 1.75, maxWidth: 580, margin: "0 auto 44px",
          animation: "rise 1s 0.8s both ease",
        }}>
          {p.bio || defaultData.personal.bio}
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "rise 1s 1s both ease" }}>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "14px 36px", borderRadius: 2, cursor: "pointer",
              border: `1px solid ${C.cyan}`,
              background: "rgba(0,212,255,0.08)",
              color: C.cyan, fontFamily: "'Space Mono', monospace",
              fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
              boxShadow: C.glow, transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(0,212,255,0.18)"; e.target.style.boxShadow = C.glowStrong; }}
            onMouseLeave={(e) => { e.target.style.background = "rgba(0,212,255,0.08)"; e.target.style.boxShadow = C.glow; }}>
            Explore Work
          </button>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "14px 36px", borderRadius: 2, cursor: "pointer",
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.muted, fontFamily: "'Space Mono', monospace",
              fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = C.cyan; e.target.style.color = C.cyan; }}
            onMouseLeave={(e) => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; }}>
            Get In Touch
          </button>
        </div>

        {socials.length > 0 && (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 44, animation: "rise 1s 1.2s both ease" }}>
            {socials.map((s, i) => (
              <button key={i} onClick={() => safeOpen(s.url)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  color: C.muted, fontFamily: "'Space Mono', monospace", fontSize: 10,
                  cursor: "pointer", transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; e.currentTarget.style.boxShadow = C.glow; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.boxShadow = "none"; }}
                title={s.platform}>
                {s.icon || s.platform?.slice(0, 2)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite" }}>
        <div style={{ width: 1, height: 50, background: `linear-gradient(to bottom, ${C.cyan}, transparent)`, margin: "0 auto" }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginTop: 8 }}>Dive</div>
      </div>
    </section>
  );
};

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
const AboutSection = ({ data }) => {
  const p = data?.personal || defaultData.personal;
  const facts = [
    { label: "Location", val: p.location || defaultData.personal.location },
    { label: "Focus", val: "Full-Stack Engineering" },
    { label: "Email", val: p.email || defaultData.personal.email },
  ];

  return (
    <Section id="about">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// origin.story" title="About Me" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Organism avatar */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 220, height: 220, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, rgba(0,212,255,0.15), rgba(0,20,40,0.9))`,
              border: `1px solid ${C.border}`,
              boxShadow: `0 0 80px rgba(0,212,255,0.2), inset 0 0 60px rgba(0,212,255,0.05)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "breathe 4s ease-in-out infinite",
              overflow: "hidden",
            }}>
              {p.avatar ? (
                <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800, color: C.cyan, opacity: 0.6 }}>
                  {(p.name || "A").charAt(0)}
                </span>
              )}
            </div>
            {/* Orbiting dots */}
            {[C.cyan, C.teal, C.violet].map((col, i) => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 8, height: 8, borderRadius: "50%",
                background: col, boxShadow: `0 0 12px ${col}`,
                "--r": `${115 + i * 18}px`,
                animation: `orbit ${5 + i * 2}s ${i * 0.7}s linear infinite`,
              }} />
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(15px,1.4vw,18px)", color: C.text, lineHeight: 1.9, marginBottom: 40 }}>
              {p.bio || defaultData.personal.bio}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {facts.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 3, height: 24, background: `linear-gradient(to bottom, ${C.cyan}, ${C.teal})`, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, width: 80, flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.text }}>{f.val}</span>
                </div>
              ))}
            </div>
            {p.website && (
              <button onClick={() => safeOpen(p.website)}
                style={{
                  marginTop: 32, padding: "10px 24px", borderRadius: 2,
                  border: `1px solid ${C.border}`, background: "transparent",
                  color: C.cyan, fontFamily: "'Space Mono', monospace", fontSize: 11,
                  cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.boxShadow = C.glow; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
                Visit Website ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

// ─── SKILLS SECTION ───────────────────────────────────────────────────────────
const SkillsSection = ({ data }) => {
  const skills = safe(data?.skills, defaultData.skills);
  const [hovered, setHovered] = useState(null);
  const categories = [...new Set(skills.map((s) => s.category || "Other"))];

  return (
    <Section id="skills">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// bio.luminescence" title="Skills & Expertise" />
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => (s.category || "Other") === cat);
            return (
              <div key={cat}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.teal, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, opacity: 0.8 }}>
                  ▸ {cat}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
                  {catSkills.map((skill, i) => (
                    <div key={i}
                      onMouseEnter={() => setHovered(`${cat}-${i}`)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        padding: "18px 22px",
                        border: `1px solid ${hovered === `${cat}-${i}` ? C.borderHover : C.border}`,
                        borderRadius: 4, background: C.surface,
                        transition: "all 0.3s",
                        boxShadow: hovered === `${cat}-${i}` ? C.glow : "none",
                        cursor: "default",
                        transform: hovered === `${cat}-${i}` ? "translateY(-3px)" : "none",
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: C.white }}>{skill.name}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.cyan }}>{skill.level}%</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(0,212,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          background: `linear-gradient(90deg, ${C.cyan}, ${C.teal})`,
                          boxShadow: `0 0 8px ${C.cyan}`,
                          "--w": `${skill.level}%`,
                          animation: `fillbar 1.2s ${i * 0.08}s both ease-out`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => {
  const [hov, setHov] = useState(false);
  const col = project.color || C.cyan;
  const tech = safe(project.tech, []);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? col + "55" : C.border}`,
        borderRadius: 6, padding: "32px 28px",
        background: hov ? `rgba(${hexToRgb(col)},0.04)` : C.surface,
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "translateY(-8px) scale(1.01)" : "none",
        boxShadow: hov ? `0 20px 60px rgba(${hexToRgb(col)},0.15), 0 0 0 1px ${col}33` : "none",
        cursor: "pointer",
        animation: `fade-in-up 0.7s ${index * 0.12}s both ease`,
        position: "relative", overflow: "hidden",
      }}
      onClick={() => safeOpen(project.link)}>

      {/* shimmer on hover */}
      {hov && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)`,
          animation: "shimmer 0.8s ease",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `radial-gradient(circle, ${col}22, transparent)`,
          border: `1px solid ${col}44`,
          boxShadow: `0 0 20px ${col}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          ◎
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted }}>{project.year}</span>
      </div>

      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: C.white, marginBottom: 10 }}>
        {project.title}
      </h3>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 20 }}>
        {project.description}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tech.map((t, i) => (
          <span key={i} style={{
            padding: "3px 10px", borderRadius: 2,
            border: `1px solid ${col}44`,
            background: `${col}0d`,
            fontFamily: "'Space Mono', monospace", fontSize: 10,
            color: col, letterSpacing: 0.5,
          }}>{t}</span>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: hov ? col : C.muted, transition: "color 0.3s" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 1 }}>View Project</span>
        <span style={{ fontSize: 14 }}>→</span>
      </div>
    </div>
  );
};

function hexToRgb(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  } catch { return "0,212,255"; }
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
const ProjectsSection = ({ data }) => {
  const projects = safe(data?.projects, defaultData.projects);
  return (
    <Section id="projects">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// deep.works" title="Projects" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 24 }}>
          {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </div>
    </Section>
  );
};

// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────
const ExperienceSection = ({ data }) => {
  const experience = safe(data?.experience, defaultData.experience);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <Section id="experience">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// current.depth" title="Experience" />
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}>
          {/* Timeline nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {experience.map((e, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "18px 0", textAlign: "left",
                  borderLeft: `2px solid ${activeIdx === i ? C.cyan : C.border}`,
                  paddingLeft: 24, transition: "all 0.3s",
                }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: activeIdx === i ? C.white : C.muted, marginBottom: 4, transition: "color 0.3s" }}>
                  {e.company}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: activeIdx === i ? C.teal : C.muted, transition: "color 0.3s" }}>
                  {e.period}
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          {experience[activeIdx] && (
            <div key={activeIdx} style={{ padding: "28px 32px", border: `1px solid ${C.border}`, borderRadius: 6, background: C.surface, animation: "fade-in-up 0.4s ease" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 4 }}>
                {experience[activeIdx].role}
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: C.cyan }}>@ {experience[activeIdx].company}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted }}>{experience[activeIdx].period}</span>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.text, lineHeight: 1.85 }}>
                {experience[activeIdx].description}
              </p>
              <div style={{ marginTop: 28, width: 40, height: 2, background: `linear-gradient(90deg, ${C.cyan}, transparent)` }} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
const ContactSection = ({ data }) => {
  const p = data?.personal || defaultData.personal;
  const socials = safe(data?.socials, defaultData.socials);
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const inputStyle = (key) => ({
    width: "100%", padding: "14px 18px",
    background: focused === key ? "rgba(0,212,255,0.06)" : "rgba(0,212,255,0.02)",
    border: `1px solid ${focused === key ? C.cyan + "88" : C.border}`,
    borderRadius: 4, color: C.white,
    fontFamily: "'Syne', sans-serif", fontSize: 14,
    outline: "none", transition: "all 0.3s",
    boxShadow: focused === key ? `0 0 20px rgba(0,212,255,0.1)` : "none",
  });

  return (
    <Section id="contact">
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// signal.transmission" title="Contact" />

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: C.text, lineHeight: 1.7 }}>
            Let's build something remarkable together. Drop a message into the deep.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: C.teal, marginBottom: 8 }}>Signal Received.</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: C.muted }}>I'll be in touch shortly.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input placeholder="Your Name" value={fields.name}
              onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
              style={inputStyle("name")} />
            <input placeholder="Email Address" value={fields.email}
              onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              style={inputStyle("email")} />
            <textarea placeholder="Your message..." value={fields.message}
              onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
              onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
              rows={5}
              style={{ ...inputStyle("message"), resize: "vertical" }} />
            <button
              onClick={() => { if (fields.name && fields.email) setSent(true); }}
              style={{
                padding: "16px 0", borderRadius: 4, cursor: "pointer",
                border: `1px solid ${C.cyan}`,
                background: "rgba(0,212,255,0.08)",
                color: C.cyan, fontFamily: "'Space Mono', monospace",
                fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
                boxShadow: C.glow, transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = C.glowStrong; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; e.currentTarget.style.boxShadow = C.glow; }}>
              Transmit Message →
            </button>
          </div>
        )}

        {/* Direct links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 52, flexWrap: "wrap" }}>
          {p.email && (
            <a href={`mailto:${p.email}`} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.muted, textDecoration: "none", transition: "color 0.3s", letterSpacing: 1 }}
              onMouseEnter={(e) => { e.target.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.target.style.color = C.muted; }}>
              {p.email}
            </a>
          )}
          {socials.slice(0, 3).map((s, i) => (
            <button key={i} onClick={() => safeOpen(s.url)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.muted,
                transition: "color 0.3s", letterSpacing: 1, padding: 0,
              }}
              onMouseEnter={(e) => { e.target.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.target.style.color = C.muted; }}>
              {s.platform}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ data }) => {
  const name = data?.personal?.name || defaultData.personal.name;
  return (
    <footer style={{
      textAlign: "center", padding: "40px 20px",
      borderTop: `1px solid ${C.border}`,
      fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted, letterSpacing: 2,
    }}>
      <span style={{ color: C.cyan }}>◈</span> {new Date().getFullYear()} {name} — Built in the deep.{" "}
      <span style={{ color: C.cyan }}>◈</span>
    </footer>
  );
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
const OnePixelMaster = ({ portfolioData }) => {
  const data = portfolioData ?? defaultData;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.white, overflowX: "hidden", position: "relative" }}>
      <style>{FONT_STYLE}</style>
      <CursorGlow />
      <PlanktonField />
      <BubbleField />
      <CausticOverlay />

      {/* Deep gradient bg layers */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 100% 70% at 50% 0%, rgba(0,80,120,0.18) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 40% at 0% 100%, rgba(0,40,80,0.12) 0%, transparent 50%),
                     radial-gradient(ellipse 50% 30% at 100% 80%, rgba(80,0,160,0.08) 0%, transparent 50%)`,
      }} />

      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav data={data} />
        <HeroSection data={data} />
        <AboutSection data={data} />
        <SkillsSection data={data} />
        <ProjectsSection data={data} />
        <ExperienceSection data={data} />
        <ContactSection data={data} />
        <Footer data={data} />
      </div>
    </div>
  );
};

export default OnePixelMaster;