<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";

const Leaf = ({ style, className }) => (
  <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 55 C20 55 2 40 2 22 C2 10 10 2 20 2 C30 2 38 10 38 22 C38 40 20 55 20 55Z" fill="currentColor" opacity="0.85"/>
    <line x1="20" y1="8" x2="20" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    <line x1="20" y1="20" x2="10" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
    <line x1="20" y1="28" x2="10" y2="36" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
    <line x1="20" y1="20" x2="30" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
    <line x1="20" y1="28" x2="30" y2="36" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
  </svg>
);

const TreeSilhouette = ({ className, style }) => (
  <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="52" y="140" width="16" height="60" fill="currentColor"/>
    <polygon points="60,10 10,90 110,90" fill="currentColor"/>
    <polygon points="60,40 15,110 105,110" fill="currentColor"/>
    <polygon points="60,70 20,140 100,140" fill="currentColor"/>
  </svg>
);

const Firefly = ({ style }) => (
  <div className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200" style={{ boxShadow: "0 0 6px 2px rgba(253,230,138,0.8), 0 0 12px 4px rgba(253,230,138,0.4)", ...style }}/>
);

const LEAVES = [
  { top: "8%", left: "5%", size: 32, color: "#4ade80", rotate: -20, delay: 0 },
  { top: "15%", left: "88%", size: 24, color: "#86efac", rotate: 30, delay: 0.5 },
  { top: "60%", left: "3%", size: 28, color: "#16a34a", rotate: 10, delay: 1 },
  { top: "75%", left: "92%", size: 20, color: "#22c55e", rotate: -15, delay: 1.5 },
  { top: "40%", left: "95%", size: 18, color: "#4ade80", rotate: 40, delay: 0.8 },
  { top: "30%", left: "1%", size: 22, color: "#86efac", rotate: -35, delay: 1.2 },
];

const FIREFLIES = [
  { top: "35%", left: "20%", delay: "0s", duration: "3s" },
  { top: "55%", left: "70%", delay: "1s", duration: "4s" },
  { top: "25%", left: "60%", delay: "2s", duration: "3.5s" },
  { top: "70%", left: "35%", delay: "0.5s", duration: "5s" },
  { top: "45%", left: "80%", delay: "1.5s", duration: "4s" },
  { top: "20%", left: "40%", delay: "2.5s", duration: "3s" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(180deg, #0a1f0e 0%, #0d2e14 40%, #14451e 70%, #1a5c28 100%)" }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }}/>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(34,197,94,0.08) 0%, transparent 70%)" }}/>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(187,247,208,0.12) 0%, transparent 70%)" }}/>

      {LEAVES.map((leaf, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ top: leaf.top, left: leaf.left, width: leaf.size, height: leaf.size * 1.5, color: leaf.color, transform: `rotate(${leaf.rotate}deg)`, opacity: mounted ? 0.7 : 0, transition: `opacity 1s ease ${leaf.delay}s` }}>
          <Leaf style={{ width: "100%", height: "100%" }}/>
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between pointer-events-none px-4 md:px-12">
        {[
          { size: 160, color: "#052e16", opacity: 0.95, offset: "-20px" },
          { size: 120, color: "#064e3b", opacity: 0.8, offset: "10px" },
          { size: 200, color: "#052e16", opacity: 1, offset: "0px" },
          { size: 140, color: "#065f46", opacity: 0.75, offset: "5px" },
          { size: 180, color: "#052e16", opacity: 0.9, offset: "-10px" },
        ].map((tree, i) => (
          <TreeSilhouette key={i} style={{ width: tree.size, height: tree.size * 1.6, color: tree.color, opacity: tree.opacity, marginBottom: tree.offset, filter: `blur(${i % 2 === 0 ? 0 : 1}px)` }}/>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(187,247,208,0.08) 0%, transparent 100%)" }}/>

      {FIREFLIES.map((ff, i) => (
        <Firefly key={i} style={{ top: ff.top, left: ff.left, animation: `fireflyPulse ${ff.duration} ease-in-out ${ff.delay} infinite` }}/>
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase mb-8" style={{ borderColor: "rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.08)", color: "#86efac", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s" }}>
          <span style={{ fontSize: 14 }}>🌿</span>
          Portfolio — Nature Forest Theme
        </div>

        <h1 className="font-bold leading-none tracking-tight mb-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "#f0fdf4", textShadow: "0 2px 40px rgba(74,222,128,0.25), 0 0 80px rgba(34,197,94,0.1)", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s" }}>
          Rooted in <span style={{ color: "#4ade80", fontStyle: "italic" }}>craft.</span>
          <br/>
          Grown with <span style={{ color: "#86efac", fontStyle: "italic" }}>purpose.</span>
        </h1>

        <div className="flex items-center gap-3 mb-6" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}>
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-500/50"/>
          <svg viewBox="0 0 20 28" fill="none" width={16} height={22}><path d="M10 26C10 26 2 18 2 10C2 5 5.5 2 10 2C14.5 2 18 5 18 10C18 18 10 26 10 26Z" fill="#4ade80" opacity="0.9"/></svg>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-500/50"/>
        </div>

        <p className="text-base md:text-lg leading-relaxed max-w-xl mb-10" style={{ color: "rgba(187,247,208,0.75)", fontFamily: "'Georgia', serif", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s" }}>
          A developer who finds beauty in clean code and finds inspiration in the quiet depth of ancient forests. Every project built intentionally — like a tree, from the roots up.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.9s ease 0.9s, transform 0.9s ease 0.9s" }}>
          <button className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", color: "#052e16", boxShadow: "0 4px 24px rgba(74,222,128,0.35)", border: "none" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 32px rgba(74,222,128,0.55), 0 0 0 4px rgba(74,222,128,0.15)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(74,222,128,0.35)"}>
            View My Work
          </button>
          <button className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95" style={{ background: "transparent", color: "#86efac", border: "1.5px solid rgba(74,222,128,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; }}>
            Get in Touch
          </button>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2" style={{ opacity: mounted ? 0.5 : 0, transition: "opacity 1s ease 1.4s" }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: "#86efac" }}>Explore</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(74,222,128,0.6), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }}/>
        </div>
      </div>

      <style>{`
        @keyframes fireflyPulse {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </section>
=======
import React from 'react';

export default function Hero() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-500">Nature_Forest Theme - Hero Section</h2>
      <p className="mt-4 text-gray-400">Implementation pending. Open an issue to contribute!</p>
    </div>
>>>>>>> upstream/main
  );
}
