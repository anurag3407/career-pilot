import React, { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

// ─── DEFAULT DATA (mirrors dummy_data.json shape exactly) ────────────────────
const defaultData = {
  personal: {
    name: "Alex Rivera",
    title: "Full Stack Developer & Creative Technologist",
    bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications. I love turning complex problems into elegant, user-friendly solutions.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    location: "San Francisco, CA",
    tagline: "Building the future, one line of code at a time.",
  },
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "alex.rivera@email.com",
  },
  stats: { yearsExperience: 5, projectsCompleted: 48, happyClients: 32 },
  skills: [
    { name: "React", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Frontend" },
    { name: "Next.js", level: 88, category: "Frontend" },
    { name: "Node.js", level: 87, category: "Backend" },
    { name: "PostgreSQL", level: 82, category: "Backend" },
    { name: "GraphQL", level: 75, category: "Backend" },
    { name: "AWS", level: 70, category: "DevOps" },
    { name: "Docker", level: 72, category: "DevOps" },
    { name: "Figma", level: 85, category: "Design" },
  ],
  projects: [
    {
      title: "NeuralDash",
      description: "AI-powered analytics dashboard with real-time data visualization, predictive insights, and customizable widget layouts.",
      techStack: ["React", "Python", "TensorFlow", "WebSocket"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    },
    {
      title: "PixelForge Studio",
      description: "Browser-based creative suite for digital artists — vector illustration, pixel art, and animation tools. 50K+ monthly active users.",
      techStack: ["Canvas API", "WebGL", "Vue.js", "Rust/WASM"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=450&fit=crop",
    },
    {
      title: "EcoTrack",
      description: "Sustainability platform that helps businesses measure, reduce, and offset their carbon footprint with real-time market integration.",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      image: "https://images.unsplash.com/photo-1569163139394-de4e5f43e5ca?w=800&h=450&fit=crop",
    },
    {
      title: "Pulse CRM",
      description: "Lightweight CRM for indie businesses — contact management, deal pipelines, email sequences, and revenue analytics.",
      techStack: ["React", "Express", "MySQL", "Redis"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    },
  ],
  experience: [
    {
      role: "Senior Full Stack Engineer",
      company: "Vercel",
      period: "2022 – Present",
      description: "Leading the development of Next.js deployment pipelines and edge runtime features. Reduced cold-start latency by 60% through custom caching strategies.",
    },
    {
      role: "Frontend Engineer",
      company: "Figma",
      period: "2020 – 2022",
      description: "Built the multiplayer presence system and real-time cursor sync using WebSockets and CRDTs. Shipped Auto Layout 3.0.",
    },
    {
      role: "Full Stack Developer",
      company: "Stripe",
      period: "2019 – 2020",
      description: "Developed internal tooling for fraud detection and risk management. Built a real-time transaction monitoring dashboard.",
    },
    {
      role: "Junior Developer",
      company: "Startup Studio",
      period: "2018 – 2019",
      description: "Worked across 5 early-stage startups as an embedded developer. Built MVPs from zero to launch in under 3 months each.",
    },
  ],
  testimonials: [],
};

// ─── CARD ACCENT COLORS (cycled per project index) ───────────────────────────
const CARD_COLORS = ["#00d4ff", "#7b2fff", "#00ffc3", "#ff6b35", "#00d4ff", "#7b2fff"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const safe = (val, fallback = []) => (Array.isArray(val) ? val : fallback);
const safeOpen = (url) => {
  if (!url || typeof url !== "string") return;
  try { new URL(url); window.open(url, "_blank", "noopener,noreferrer"); } catch {}
};
const hexToRgb = (hex = "#00d4ff") => {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  } catch { return "0,212,255"; }
};

// normalise socials object → array of {platform, url, icon} for rendering
const socialsToArray = (socials) => {
  if (!socials || typeof socials !== "object") return [];
  const map = {
    github: { platform: "GitHub", icon: "GH" },
    linkedin: { platform: "LinkedIn", icon: "LI" },
    twitter: { platform: "Twitter", icon: "TW" },
    dribbble: { platform: "Dribbble", icon: "DR" },
    website: { platform: "Website", icon: "WS" },
  };
  return Object.entries(socials)
    .filter(([, url]) => url && typeof url === "string" && url.startsWith("http"))
    .map(([key, url]) => ({ ...(map[key] || { platform: key, icon: key.slice(0, 2).toUpperCase() }), url }));
};

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#020b18",
  surface: "rgba(0,180,220,0.05)",
  border: "rgba(0,210,255,0.12)",
  borderHover: "rgba(0,210,255,0.35)",
  cyan: "#00d4ff",
  teal: "#00ffc3",
  violet: "#7b2fff",
  text: "#c8e8f0",
  muted: "#5a8a9a",
  white: "#e8f4f8",
  glow: "0 0 40px rgba(0,212,255,0.25)",
  glowStrong: "0 0 60px rgba(0,212,255,0.45), 0 0 120px rgba(0,212,255,0.15)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
  .opm-root * { box-sizing: border-box; }
  .opm-root { scroll-behavior: smooth; }
  .opm-root ::-webkit-scrollbar { width: 4px; }
  .opm-root ::-webkit-scrollbar-track { background: #020b18; }
  .opm-root ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.4); border-radius: 2px; }
  @keyframes opm-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes opm-pulse { 0%,100%{opacity:0.4;box-shadow:0 0 20px rgba(0,212,255,0.3)} 50%{opacity:1;box-shadow:0 0 60px rgba(0,212,255,0.7)} }
  @keyframes opm-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes opm-orbit { from{transform:rotate(0deg) translateX(var(--r,60px)) rotate(0deg)} to{transform:rotate(360deg) translateX(var(--r,60px)) rotate(-360deg)} }
  @keyframes opm-breathe { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
  @keyframes opm-twinkle { 0%,100%{opacity:0.15;transform:scale(0.8)} 50%{opacity:0.9;transform:scale(1.2)} }
  @keyframes opm-textglow {
    0%,100% { text-shadow: 0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2); }
    50%      { text-shadow: 0 0 40px rgba(0,212,255,0.9), 0 0 80px rgba(0,212,255,0.4); }
  }
  @keyframes opm-rise { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes opm-fillbar { from{width:0%} to{width:var(--w)} }
  @keyframes opm-bubble {
    0%   { transform:translateY(0) translateX(0) scale(1); opacity:0.6; }
    50%  { transform:translateY(-50vh) translateX(6px) scale(0.95); opacity:0.5; }
    100% { transform:translateY(-100vh) translateX(-4px) scale(0.8); opacity:0; }
  }
  @keyframes opm-fade-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes opm-caustic { 0%,100%{opacity:0.6} 50%{opacity:1} }
`;

// ─── BUBBLE FIELD ─────────────────────────────────────────────────────────────
const BubbleField = () => {
  const bubbles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 4 + Math.random() * 12,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 11,
      opacity: 0.12 + Math.random() * 0.3,
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {bubbles.map((b) => (
        <div key={b.id} style={{
          position: "absolute", bottom: -20, left: b.left,
          width: b.size, height: b.size, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(0,212,255,0.08))",
          border: "1px solid rgba(0,212,255,0.35)",
          opacity: b.opacity,
          animation: `opm-bubble ${b.duration}s ${b.delay}s infinite linear`,
        }} />
      ))}
    </div>
  );
};

// ─── PLANKTON FIELD ───────────────────────────────────────────────────────────
const PlanktonField = () => {
  const dots = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.2,
      delay: Math.random() * 5,
      dur: 2 + Math.random() * 3,
      color: i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.teal : C.violet,
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {dots.map((d) => (
        <div key={d.id} style={{
          position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size, borderRadius: "50%",
          background: d.color, boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
          animation: `opm-twinkle ${d.dur}s ${d.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
};

// ─── CURSOR BIOLUMINESCENCE ───────────────────────────────────────────────────
const CursorGlow = () => {
  useEffect(() => {
    const MAX = 10;
    const dots = Array.from({ length: MAX }, (_, i) => {
      const el = document.createElement("div");
      const size = 6 + i * 2.5;
      Object.assign(el.style, {
        position: "fixed", borderRadius: "50%", pointerEvents: "none",
        zIndex: 9999, transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, rgba(0,212,255,${0.65 - i * 0.05}), transparent)`,
        width: `${size}px`, height: `${size}px`,
        filter: `blur(${i * 0.6}px)`, opacity: 0, transition: "opacity 0.3s",
      });
      document.body.appendChild(el);
      return { el, x: -200, y: -200 };
    });

    let mx = -200, my = -200;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf;
    const animate = () => {
      let px = mx, py = my;
      dots.forEach((d, i) => {
        d.el.style.opacity = 1;
        d.x += (px - d.x) * (0.32 - i * 0.024);
        d.y += (py - d.y) * (0.32 - i * 0.024);
        d.el.style.left = `${d.x}px`;
        d.el.style.top = `${d.y}px`;
        px = d.x; py = d.y;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.el.remove());
    };
  }, []);
  return null;
};

// ─── CAUSTIC OVERLAY ─────────────────────────────────────────────────────────
const CausticOverlay = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
    background: `
      radial-gradient(ellipse 80% 60% at 20% 20%, rgba(0,180,255,0.045) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,255,180,0.03) 0%, transparent 70%),
      radial-gradient(ellipse 100% 40% at 50% 50%, rgba(100,0,255,0.02) 0%, transparent 70%)
    `,
    animation: "opm-caustic 8s ease-in-out infinite",
  }} />
);

// ─── SCROLL-REVEAL SECTION ───────────────────────────────────────────────────
const Section = ({ id, children, style = {} }) => {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} style={{
      padding: "100px 0",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(36px)",
      transition: "opacity 0.75s ease, transform 0.75s ease",
      ...style,
    }}>
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
    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 800, color: C.white, animation: "opm-textglow 4s ease-in-out infinite" }}>
      {title}
    </h2>
    <div style={{ width: 60, height: 2, margin: "18px auto 0", background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)` }} />
  </div>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = ({ name }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const sections = ["home", "about", "skills", "projects", "experience", "contact"];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const cur = sections.find((s) => {
        const el = document.getElementById(s);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 120 && r.bottom > 120;
      });
      if (cur) setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 clamp(20px,5vw,80px)", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(2,11,24,0.93)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.4s ease",
    }}>
      <button type="button" onClick={() => scrollTo("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20,
        color: C.cyan, letterSpacing: 1,
        animation: "opm-textglow 4s ease-in-out infinite",
      }}>
        {(name || "Alex").split(" ")[0]}<span style={{ color: C.teal }}>.</span>
      </button>
      <div style={{ display: "flex", gap: "clamp(10px,2vw,28px)" }}>
        {sections.map((s) => (
          <button type="button" key={s} onClick={() => scrollTo(s)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Space Mono', monospace", fontSize: 11,
            letterSpacing: 1.5, textTransform: "uppercase",
            color: active === s ? C.cyan : C.muted,
            textShadow: active === s ? `0 0 10px ${C.cyan}` : "none",
            borderBottom: `1px solid ${active === s ? C.cyan : "transparent"}`,
            transition: "all 0.3s", padding: "4px 0",
          }}>{s}</button>
        ))}
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const HeroSection = ({ data }) => {
  const p = data.personal || defaultData.personal;
  const socials = socialsToArray(data.socials || defaultData.socials);
  const stats = data.stats || defaultData.stats;
  const [typed, setTyped] = useState("");
  const full = p.title || defaultData.personal.title;

  useEffect(() => {
    let i = 0;
    setTyped("");
    const iv = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, [full]);

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", padding: "80px clamp(20px,5vw,80px) 0",
      textAlign: "center", overflow: "hidden",
    }}>
      {/* Depth rings */}
      {[200, 340, 480, 620].map((r, i) => (
        <div key={r} style={{
          position: "absolute", borderRadius: "50%", width: r, height: r,
          border: `1px solid rgba(0,212,255,${0.12 - i * 0.025})`,
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          animation: `opm-breathe ${3 + i}s ${i * 0.6}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(0,212,255,0.07), transparent 70%)",
        animation: "opm-pulse 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 5, maxWidth: 800 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 5, color: C.teal, textTransform: "uppercase", marginBottom: 24, opacity: 0.8, animation: "opm-rise 0.8s 0.1s both" }}>
          ◈ &nbsp; Bioluminescent Interface &nbsp; ◈
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(42px,7vw,94px)",
          fontWeight: 800, lineHeight: 1.06, color: C.white, marginBottom: 20,
          animation: "opm-rise 0.8s 0.3s both, opm-textglow 4s 1.1s ease-in-out infinite",
        }}>
          {p.name || defaultData.personal.name}
        </h1>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(13px,1.8vw,20px)", color: C.cyan, minHeight: 30, marginBottom: 24, animation: "opm-rise 0.8s 0.5s both" }}>
          {typed}<span style={{ animation: "opm-pulse 1s infinite", opacity: 0.9 }}>|</span>
        </div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,1.4vw,17px)", color: C.text, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px", animation: "opm-rise 0.8s 0.7s both" }}>
          {p.bio || defaultData.personal.bio}
        </p>

        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 40, flexWrap: "wrap", animation: "opm-rise 0.8s 0.9s both" }}>
            {[
              { val: `${stats.yearsExperience || 5}+`, label: "Years" },
              { val: `${stats.projectsCompleted || 48}+`, label: "Projects" },
              { val: `${stats.happyClients || 32}+`, label: "Clients" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: C.cyan, animation: "opm-textglow 4s ease-in-out infinite" }}>{s.val}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animation: "opm-rise 0.8s 1.0s both" }}>
          <button type="button" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "13px 34px", borderRadius: 2, cursor: "pointer", border: `1px solid ${C.cyan}`, background: "rgba(0,212,255,0.08)", color: C.cyan, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", boxShadow: C.glow, transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = C.glowStrong; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; e.currentTarget.style.boxShadow = C.glow; }}>
            Explore Work
          </button>
          <button type="button" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "13px 34px", borderRadius: 2, cursor: "pointer", border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            Get In Touch
          </button>
        </div>

        {socials.length > 0 && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, animation: "opm-rise 0.8s 1.1s both" }}>
            {socials.map((s, i) => (
              <button type="button" key={i} onClick={() => safeOpen(s.url)} title={s.platform}
                style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, color: C.muted, fontFamily: "'Space Mono', monospace", fontSize: 9, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.cyan; e.currentTarget.style.boxShadow = C.glow; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.boxShadow = "none"; }}>
                {s.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", animation: "opm-float 2.2s ease-in-out infinite" }}>
        <div style={{ width: 1, height: 46, background: `linear-gradient(to bottom, ${C.cyan}, transparent)`, margin: "0 auto" }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginTop: 8 }}>Dive</div>
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const AboutSection = ({ data }) => {
  const p = data.personal || defaultData.personal;
  const facts = [
    { label: "Location", val: p.location || defaultData.personal.location },
    { label: "Title", val: p.title || defaultData.personal.title },
    { label: "Tagline", val: p.tagline || defaultData.personal.tagline },
  ].filter((f) => f.val);

  return (
    <Section id="about">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// origin.story" title="About Me" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 210, height: 210, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, rgba(0,212,255,0.14), rgba(0,20,40,0.9))",
              border: `1px solid ${C.border}`,
              boxShadow: `0 0 80px rgba(0,212,255,0.18), inset 0 0 60px rgba(0,212,255,0.04)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "opm-breathe 4s ease-in-out infinite", overflow: "hidden",
            }}>
              {p.avatar ? (
                <img src={p.avatar} alt={p.name || "avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 68, fontWeight: 800, color: C.cyan, opacity: 0.6 }}>
                  {(p.name || "A").charAt(0)}
                </span>
              )}
            </div>
            {[C.cyan, C.teal, C.violet].map((col, i) => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 8, height: 8, borderRadius: "50%",
                background: col, boxShadow: `0 0 14px ${col}`,
                "--r": `${110 + i * 20}px`,
                animation: `opm-orbit ${5 + i * 2}s ${i * 0.8}s linear infinite`,
              }} />
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px,1.3vw,17px)", color: C.text, lineHeight: 1.9, marginBottom: 36 }}>
              {p.bio || defaultData.personal.bio}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {facts.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 3, height: 22, background: `linear-gradient(to bottom, ${C.cyan}, ${C.teal})`, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 2, width: 72, flexShrink: 0, paddingTop: 2 }}>{f.label}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: C.text }}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SkillsSection = ({ data }) => {
  const skills = safe(data.skills, defaultData.skills);
  const [hov, setHov] = useState(null);
  const categories = [...new Set(skills.map((s) => s.category || "Core"))];

  return (
    <Section id="skills">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// bio.luminescence" title="Skills & Expertise" />
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => (s.category || "Core") === cat);
            return (
              <div key={cat}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.teal, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18, opacity: 0.8 }}>
                  ▸ {cat}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 14 }}>
                  {catSkills.map((skill, i) => {
                    const key = `${cat}-${i}`;
                    const isHov = hov === key;
                    return (
                      <div key={i} onMouseEnter={() => setHov(key)} onMouseLeave={() => setHov(null)}
                        style={{
                          padding: "16px 20px",
                          border: `1px solid ${isHov ? C.borderHover : C.border}`,
                          borderRadius: 4, background: C.surface,
                          transition: "all 0.3s",
                          transform: isHov ? "translateY(-3px)" : "none",
                          boxShadow: isHov ? C.glow : "none",
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: C.white }}>{skill.name}</span>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.cyan }}>{skill.level || 75}%</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(0,212,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 2,
                            background: `linear-gradient(90deg, ${C.cyan}, ${C.teal})`,
                            boxShadow: `0 0 8px ${C.cyan}`,
                            "--w": `${skill.level || 75}%`,
                            animation: `opm-fillbar 1.1s ${i * 0.07}s both ease-out`,
                          }} />
                        </div>
                      </div>
                    );
                  })}
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
  const col = CARD_COLORS[index % CARD_COLORS.length];
  const tech = safe(project.techStack || project.tech, []);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? col + "55" : C.border}`,
        borderRadius: 6, padding: "28px 24px",
        background: hov ? `rgba(${hexToRgb(col)},0.04)` : C.surface,
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        transform: hov ? "translateY(-7px) scale(1.01)" : "none",
        boxShadow: hov ? `0 20px 55px rgba(${hexToRgb(col)},0.14), 0 0 0 1px ${col}33` : "none",
        position: "relative", overflow: "hidden",
        animation: `opm-fade-up 0.65s ${index * 0.1}s both ease`,
      }}>
      {hov && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.035) 50%, transparent 60%)",
          animation: "opm-shimmer 0.7s ease", pointerEvents: "none",
        }} />
      )}

      {project.image && (
        <div style={{ width: "100%", height: 140, borderRadius: 3, overflow: "hidden", marginBottom: 18, opacity: hov ? 1 : 0.7, transition: "opacity 0.3s" }}>
          <img src={project.image} alt={project.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle, ${col}22, transparent)`, border: `1px solid ${col}44`, boxShadow: `0 0 18px ${col}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◎</div>
      </div>

      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: C.white, marginBottom: 8 }}>
        {project.title || "Project"}
      </h3>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 16 }}>
        {project.description || ""}
      </p>

      {tech.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {tech.map((t, i) => (
            <span key={i} style={{ padding: "2px 9px", borderRadius: 2, border: `1px solid ${col}44`, background: `${col}0d`, fontFamily: "'Space Mono', monospace", fontSize: 9, color: col, letterSpacing: 0.5 }}>{t}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 14 }}>
        {project.liveUrl && (
          <button type="button" onClick={() => safeOpen(project.liveUrl)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, color: hov ? col : C.muted, letterSpacing: 1, transition: "color 0.3s", padding: 0 }}>
            Live ↗
          </button>
        )}
        {project.githubUrl && (
          <button type="button" onClick={() => safeOpen(project.githubUrl)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10, color: hov ? col : C.muted, letterSpacing: 1, transition: "color 0.3s", padding: 0 }}>
            GitHub ↗
          </button>
        )}
      </div>
    </div>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const ProjectsSection = ({ data }) => {
  const projects = safe(data.projects, defaultData.projects);
  return (
    <Section id="projects">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// deep.works" title="Projects" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px,1fr))", gap: 22 }}>
          {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </div>
    </Section>
  );
};

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const ExperienceSection = ({ data }) => {
  const experience = safe(data.experience, defaultData.experience);
  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = Math.min(activeIdx, experience.length - 1);
  const active = experience[safeIdx];

  if (experience.length === 0) return null;

  return (
    <Section id="experience">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// current.depth" title="Experience" />
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {experience.map((e, i) => (
              <button type="button" key={i} onClick={() => setActiveIdx(i)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "16px 0 16px 22px", textAlign: "left",
                  borderLeft: `2px solid ${safeIdx === i ? C.cyan : C.border}`,
                  transition: "all 0.3s",
                }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: safeIdx === i ? C.white : C.muted, marginBottom: 3, transition: "color 0.3s" }}>
                  {e.company}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: safeIdx === i ? C.teal : C.muted, transition: "color 0.3s" }}>
                  {e.period}
                </div>
              </button>
            ))}
          </div>

          {active && (
            <div key={safeIdx} style={{ padding: "26px 30px", border: `1px solid ${C.border}`, borderRadius: 6, background: C.surface, animation: "opm-fade-up 0.35s ease" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 6 }}>
                {active.role}
              </div>
              <div style={{ display: "flex", gap: 14, marginBottom: 22, alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: C.cyan }}>@ {active.company}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted }}>{active.period}</span>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.text, lineHeight: 1.85 }}>
                {active.description}
              </p>
              <div style={{ marginTop: 24, width: 36, height: 2, background: `linear-gradient(90deg, ${C.cyan}, transparent)` }} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const ContactSection = ({ data }) => {
  const p = data.personal || defaultData.personal;
  const socials = data.socials || defaultData.socials;
  const email = socials?.email || p.email || "";
  const socialLinks = socialsToArray(socials).filter((s) => s.platform !== "email");

  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const inputStyle = (key) => ({
    width: "100%", padding: "13px 16px",
    background: focused === key ? "rgba(0,212,255,0.06)" : "rgba(0,212,255,0.02)",
    border: `1px solid ${focused === key ? C.cyan + "88" : C.border}`,
    borderRadius: 4, color: C.white,
    fontFamily: "'Syne', sans-serif", fontSize: 14,
    outline: "none", transition: "all 0.3s",
    boxShadow: focused === key ? "0 0 20px rgba(0,212,255,0.1)" : "none",
  });

  return (
    <Section id="contact">
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 clamp(20px,5vw,80px)" }}>
        <SectionHead label="// signal.transmission" title="Contact" />
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: C.text, lineHeight: 1.75, textAlign: "center", marginBottom: 44 }}>
          Let's build something remarkable. Drop a message into the deep.
        </p>

        {sent ? (
          <div style={{ textAlign: "center", padding: "56px 0" }}>
            <div style={{ fontSize: 46, marginBottom: 14 }}>◎</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: C.teal, marginBottom: 8 }}>Signal Received.</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.muted }}>I'll be in touch shortly.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
              rows={5} style={{ ...inputStyle("message"), resize: "vertical" }} />
            <button type="button" onClick={() => { if (fields.name && fields.email) setSent(true); }}
              style={{ padding: "15px 0", borderRadius: 4, cursor: "pointer", border: `1px solid ${C.cyan}`, background: "rgba(0,212,255,0.08)", color: C.cyan, fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", boxShadow: C.glow, transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.18)"; e.currentTarget.style.boxShadow = C.glowStrong; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.08)"; e.currentTarget.style.boxShadow = C.glow; }}>
              Transmit Message →
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 48, flexWrap: "wrap" }}>
          {email && (
            <a href={`mailto:${email}`}
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted, textDecoration: "none", transition: "color 0.3s", letterSpacing: 1 }}
              onMouseEnter={(e) => { e.target.style.color = C.cyan; }}
              onMouseLeave={(e) => { e.target.style.color = C.muted; }}>
              {email}
            </a>
          )}
          {socialLinks.slice(0, 3).map((s, i) => (
            <button type="button" key={i} onClick={() => safeOpen(s.url)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted, transition: "color 0.3s", letterSpacing: 1, padding: 0 }}
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
const Footer = ({ name }) => (
  <footer style={{ textAlign: "center", padding: "36px 20px", borderTop: `1px solid ${C.border}`, fontFamily: "'Space Mono', monospace", fontSize: 11, color: C.muted, letterSpacing: 2 }}>
    <span style={{ color: C.cyan }}>◈</span>{" "}
    {new Date().getFullYear()} {name || "Alex Rivera"} — Built in the deep.{" "}
    <span style={{ color: C.cyan }}>◈</span>
  </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function OnePixelMaster() {
  const { portfolioData } = usePortfolio();
  const data = (portfolioData && Object.keys(portfolioData).length) ? portfolioData : defaultData;

  return (
    <div className="opm-root" style={{ background: C.bg, minHeight: "100vh", color: C.white, overflowX: "hidden", position: "relative" }}>
      <style>{FONT_STYLE}</style>
      <CursorGlow />
      <PlanktonField />
      <BubbleField />
      <CausticOverlay />

      {/* Deep bg gradient layers */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 100% 70% at 50% 0%, rgba(0,80,120,0.16) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 0% 100%, rgba(0,40,80,0.1) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 100% 80%, rgba(80,0,160,0.07) 0%, transparent 50%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 10 }}>
        <Nav name={data.personal?.name} />
        <HeroSection data={data} />
        <AboutSection data={data} />
        <SkillsSection data={data} />
        <ProjectsSection data={data} />
        <ExperienceSection data={data} />
        <ContactSection data={data} />
        <Footer name={data.personal?.name} />
      </div>
    </div>
  );
}
