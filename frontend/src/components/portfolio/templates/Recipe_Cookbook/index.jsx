import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChefHat, Flame, Star, Clock, Users, BookOpen,
  Github, Linkedin, Twitter, Mail, ExternalLink,
  Check, MapPin, Award, Utensils, Coffee,
  ThumbsUp, Quote, Send, ArrowRight, Timer,
  Layers, Code2, Sparkles, ScrollText
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

/* ──────────────────────────────────────────────────────────
   DESIGN TOKENS  (Artisanal Culinary Palette)
   Base: Soft Vanilla Paper, Rich Olive Greens, Cast Iron Dark, Saffron Accent
────────────────────────────────────────────────────────── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Mono:wght@400;500&display=swap');
.rcb-root { font-family: 'Cormorant Garamond', Georgia, serif; }
.rcb-root * { box-sizing: border-box; }
.rcb-root ::selection { background: rgba(67, 106, 92, 0.2); color: #2E4A3F; }
.rcb-root ::-webkit-scrollbar { width: 8px; background: #EAE6DB; }
.rcb-root ::-webkit-scrollbar-thumb { background: #2E4A3F; border-radius: 4px; }
.font-playfair { font-family: 'Playfair Display', serif !important; }
.font-mono-dm  { font-family: 'DM Mono', monospace !important; }
.font-corm     { font-family: 'Cormorant Garamond', serif !important; }

/* Cookbook Premium Matte Paper Styling */
.paper-texture {
  position: relative;
  background-color: #FCFAF2 !important;
}
.paper-texture::before {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
  background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(46, 74, 63, 0.03) 27px, rgba(46, 74, 63, 0.03) 28px);
}

/* Print grain overlay */
.grain::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:999;
  opacity:.30;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

@keyframes badge-spin    { to { transform: rotate(360deg); } }
@keyframes badge-counter { to { transform: rotate(-360deg); } }
@keyframes ticker-move   { from { transform:translateX(0); } to { transform:translateX(-50%); } }
@keyframes herb-float    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(4deg)} }

.ticker-track { animation: ticker-move 25s linear infinite; }
.badge-spin   { animation: badge-spin 20s linear infinite; }
.badge-inner  { animation: badge-counter 20s linear infinite; }
.herb         { animation: herb-float 7s ease-in-out infinite; }

.skill-bar-fill { transition: width 1.2s cubic-bezier(.23,1,.32,1); }

/* Stunning organic cookbook card lift */
.lift { transition: transform .3s cubic-bezier(.25, 1, .5, 1), box-shadow .3s ease, border-color .3s ease; }
.lift:hover { 
  transform: translateY(-6px) scale(1.01); 
  box-shadow: 0 20px 35px rgba(46, 74, 63, 0.12);
  border-color: #2E4A3F !important;
}

/* Culinary Star review items */
.star-filled { color: #E5A93C; fill: #E5A93C; }
.star-empty  { color: #EAE6DB; fill: #EAE6DB; }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "rcb-fonts";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = FONTS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* Dynamic color parser utilizing culinary heat maps */
const heatColor = (temp) => {
  if (temp < 140) return "#436A5C"; // Fresh Herb Sage
  if (temp < 180) return "#E5A93C"; // Simmering Saffron Gold
  if (temp < 220) return "#C86B45"; // Roasted Terracotta
  return "#2E4A3F"; // Deep Cast Iron Olive
};

const stationAccents = ["#2E4A3F", "#436A5C", "#E5A93C", "#C86B45"];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [.25,1,.5,1] } },
});

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref} className={className}
      initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={fadeUp(delay)}
    >
      {children}
    </motion.div>
  );
}

function ChapterLabel({ children, color = "#2E4A3F" }) {
  return (
    <span
      className="font-mono-dm block mb-3"
      style={{ fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color, fontWeight: 500 }}
    >
      {children}
    </span>
  );
}

/* Premium vintage border separator */
function OrnDiv({ char = "🜎  ✦  🜎", color = "#436A5C" }) {
  return (
    <div className="flex items-center gap-4 my-5" style={{ color }}>
      <span className="flex-1 h-px" style={{ background:`linear-gradient(90deg, transparent, ${color})` }} />
      <span style={{ fontSize:"0.8rem", letterSpacing:"0.15em", opacity: 0.85 }}>{char}</span>
      <span className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

function ProgressBar({ color }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-1 z-50 pointer-events-none"
      style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${color}, #E5A93C)`, transition:"width .1s linear" }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   1. NAVIGATION
══════════════════════════════════════════════════════════ */
function Nav({ temp, setTemp }) {
  const color = heatColor(temp);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href:"#about",      label:"Philosophy" },
    { href:"#skills",     label:"Spice Rack" },
    { href:"#projects",   label:"Menu" },
    { href:"#experience", label:"Ledger" },
    { href:"#testimonials", label:"Reviews" },
    { href:"#contact",    label:"Reserve" },
  ];

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 lg:px-12"
      style={{
        height:76,
        background: scrolled ? "#FCFAF2d9" : "#FCFAF2bc",
        backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${scrolled ? "#1E252222" : "#1E25220c"}`,
        transition:"all .3s ease",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: color, transition:"background .4s", boxShadow: `0 4px 12px ${color}33` }}
        >
          <ChefHat size={20} style={{ color: color === "#E5A93C" ? "#1E2522" : "#FCFAF2" }} />
        </div>
        <div>
          <span
            className="font-mono-dm block font-bold"
            style={{ fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#1E2522" }}
          >
            TAB RESERVATION MASTER
          </span>
          <span
            className="font-mono-dm block mt-0.5"
            style={{ fontSize:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#436A5C" }}
          >
            Interactive Logbook // Rev 2026
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
        {links.map(l => (
          <li key={l.href}>
            <a
              href={l.href}
              className="font-mono-dm tracking-widest font-medium"
              style={{ fontSize:"0.62rem", textTransform:"uppercase",
                color:"#1E2522", textDecoration:"none", transition:"all .2s ease" }}
              onMouseEnter={e => { e.target.style.color = color; e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.target.style.color = "#1E2522"; e.target.style.transform = "none"; }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Stove Controller Dashboard */}
      <div
        className="flex items-center gap-3 px-3.5 py-2 rounded-xl"
        style={{ background:"#EAE6DB", border:"1px solid #436A5C44", boxShadow:"inset 0 1px 2px rgba(46,74,63,.06)" }}
      >
        <Flame size={14} style={{ color, transition:"color .4s" }} />
        <span className="font-mono-dm hidden sm:block font-bold" style={{ fontSize:"0.55rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"#1E2522" }}>
          Stove:
        </span>
        <input
          type="range" min="100" max="250" value={temp}
          onChange={e => setTemp(+e.target.value)}
          className="w-20 h-1 cursor-pointer accent-current"
          style={{ color: color }}
        />
        <span className="font-mono-dm font-bold text-center" style={{ fontSize:"0.7rem", color, transition:"color .4s", minWidth:42 }}>
          {temp}°C
        </span>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   2. HERO
══════════════════════════════════════════════════════════ */
function Hero({ temp }) {
  const color = heatColor(temp);

  return (
    <section id="hero" className="relative overflow-hidden" style={{ minHeight:"calc(100vh - 76px)" }}>
      <div className="grid lg:grid-cols-2" style={{ minHeight:"calc(100vh - 76px)" }}>

        {/* ── LEFT SIDE: Deep Olive/Cast Iron Canvas ── */}
        <div
          className="relative flex flex-col justify-center px-8 lg:px-16 py-20 overflow-hidden"
          style={{ background:"#1E2522" }}
        >
          {/* Ambient organic textures */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background:`radial-gradient(circle at 20% 80%, rgba(229,169,60,.12) 0%, transparent 60%),
                        radial-gradient(circle at 80% 20%, rgba(67,106,92,.15) 0%, transparent 50%)`
          }}/>
          
          {/* Floating artistic spice vectors */}
          {[
            {e:"🌿",top:"10%",right:"10%",size:"2.6rem",delay:"0s"},
            {e:"🌶",bottom:"15%",left:"8%",size:"2.2rem",delay:"3.5s"},
            {e:"🫙",top:"50%",right:"12%",size:"1.8rem",delay:"1.8s"},
          ].map((h,i) => (
            <span key={i} className="herb absolute pointer-events-none select-none"
              style={{ fontSize:h.size, top:h.top, bottom:h.bottom, left:h.left, right:h.right,
                opacity:.15, animationDelay:h.delay }}
            >{h.e}</span>
          ))}

          {/* Intro Ribbon */}
          <motion.div
            initial={{opacity:0, y:15}} animate={{opacity:1, y:0}}
            transition={{duration:.6, delay:.1}}
            className="flex items-center gap-3 mb-6 relative z-10"
          >
            <span className="inline-block h-px w-10" style={{ background:"#E5A93C" }}/>
            <span className="font-mono-dm font-medium tracking-widest text-emerald-100" style={{ fontSize:"0.58rem", textTransform:"uppercase", color:"#E5A93C" }}>
              Page 01 // Daily Special Recipe
            </span>
          </motion.div>

          {/* Name Display */}
          <motion.h1
            className="font-playfair relative z-10"
            initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}
            transition={{duration:.7, delay:.2}}
            style={{ fontSize:"clamp(3.2rem, 6.8vw, 5.8rem)", fontWeight:900, lineHeight:0.95,
              letterSpacing:"-.02em", color:"#EAE6DB" }}
          >
            {data.personal?.name || "Chef Architect"}
          </motion.h1>

          {/* Subtitle Highlight */}
          <motion.div
            className="relative z-10 mt-4 mb-2 inline-block"
            initial={{opacity:0, y:12}} animate={{opacity:1, y:0}}
            transition={{duration:0.6, delay:0.35}}
          >
            <span
              className="font-playfair"
              style={{ fontSize:"clamp(1.15rem, 2.6vw, 1.75rem)", fontStyle:"italic", fontWeight:500,
                color: color === "#1E2522" ? "#E5A93C" : color, transition:"color .4s" }}
            >
              ✦ {data.personal?.title} ✦
            </span>
          </motion.div>

          {/* Location details */}
          {data.personal?.location && (
            <motion.div
              className="flex items-center gap-2 mt-2 relative z-10"
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}
            >
              <MapPin size={13} style={{ color:"#436A5C" }}/>
              <span className="font-mono-dm tracking-wider" style={{ fontSize:"0.58rem", textTransform:"uppercase", color:"#EAE6DB" }}>
                {data.personal.location}
              </span>
            </motion.div>
          )}

          <OrnDiv color={color === "#1E2522" ? "#2E4A3F" : color} />

          {/* Bio text block */}
          {/* 1. Add this variable right at the top of your Hero component function */}
const heroIntro = data.personal?.heroIntro || data.personal?.bio || "A thoughtfully curated portfolio collection of premium engineering components.";

{/* 2. Update your JSX block to look like this: */}
<motion.p
  className="relative z-10 font-corm"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  style={{ 
    fontSize: "1.1rem", 
    fontStyle: "italic", 
    color: "#EAE6DBcc",
    lineHeight: 1.8, 
    maxWidth: 460 
  }}
>
  {heroIntro}
</motion.p>

          {/* Action Triggers */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8 relative z-10"
            initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
            transition={{duration:.5, delay:.6}}
          >
            <a
              href="#projects"
              className="font-mono-dm inline-flex items-center gap-2 font-bold tracking-widest text-center transition-all"
              style={{ fontSize:"0.62rem", textTransform:"uppercase",
                background: color === "#1E2522" ? "#2E4A3F" : color, padding:"1rem 1.8rem", textDecoration:"none",
                color: (color === "#E5A93C" || color === "#436A5C") ? "#1E2522" : "#FCFAF2",
                borderRadius: "4px", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.filter="brightness(1.15)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.filter=""}}
            >
              Open Plated Projects <ArrowRight size={13}/>
            </a>
            <a
              href="#skills"
              className="font-mono-dm inline-flex items-center gap-2 tracking-widest transition-all"
              style={{ fontSize:"0.62rem", textTransform:"uppercase",
                border:`1px solid #436A5C88`, color:"#EAE6DB",
                padding:"1rem 1.8rem", textDecoration:"none", borderRadius: "4px" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#E5A93C"; e.currentTarget.style.color="#E5A93C"; e.currentTarget.style.background="#FCFAF208"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#436A5C88"; e.currentTarget.style.color="#EAE6DB"; e.currentTarget.style.background="transparent"}}
            >
              Inspect Ingredients
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT SIDE: Premium Matte Cream Ledger ── */}
        <div
          className="relative flex flex-col justify-center px-8 lg:px-14 py-20"
          style={{ background:"#FCFAF2", borderLeft:"1px solid #1E252215" }}
        >
          {/* Editorial background symbol watermark */}
          <span className="font-playfair absolute pointer-events-none select-none font-black italic"
            style={{ fontSize:"20rem", color:"#1E252204", bottom:"-2rem", right:"1rem", lineHeight:1 }}
          >🜎</span>

          {/* Rotating Stamp Emblem Badge */}
          <div className="badge-spin absolute" style={{ top:"2.5rem", right:"2.5rem",
            width:100, height:100, borderRadius:"50%", background:"#2E4A3F",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#FCFAF2", boxShadow:`0 6px 20px rgba(46,74,63,0.2)`, zIndex: 5 }}
          >
            <div className="badge-inner flex flex-col items-center font-mono-dm text-center"
              style={{ fontSize:"0.46rem", letterSpacing:"0.12em", textTransform:"uppercase", lineHeight:1.3 }}
            >
              <span className="font-playfair block font-bold tracking-tight" style={{ fontSize:"1.2rem", fontStyle:"italic", color:"#E5A93C" }}>★★★</span>
              MICHELIN<br/><span style={{color:"#EAE6DB"}}>CODER</span>
            </div>
          </div>

          {/* Profile Image Portrait Canvas Frame */}
          <div className="flex justify-center mb-10">
            <div className="relative" style={{ width:230, height:230 }}>
              {/* Embossed Ring outline */}
              <div className="absolute inset-0 rounded-full" style={{
                border:"3px double #436A5C",
                boxShadow:"0 12px 36px rgba(46,74,63,0.12)"
              }}/>
              {/* Decorative dynamic frame layer */}
              <div className="badge-spin absolute rounded-full" style={{
                inset:10, border:`1.5px dashed ${color}`, opacity:.6,
                transition:"border-color .4s"
              }}/>
              {/* Soft visual glow blur behind portrait */}
              <div className="absolute rounded-full" style={{
                inset:40, background:color, opacity:.12, filter:"blur(10px)",
                transition:"background .4s"
              }}/>
              {/* Avatar image frame */}
              <div className="absolute rounded-full overflow-hidden" style={{
                inset:16, border:"1px solid #1E25221a",
                boxShadow:"inset 0 0 16px rgba(46,74,63,0.15)"
              }}>
                <img
                  src={data.personal?.avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"}
                  alt={data.personal?.name}
                  className="w-full h-full object-cover"
                  style={{ filter:"sepia(5%) contrast(1.02) brightness(0.99)", transition:"transform .6s ease" }}
                  onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
                  onMouseLeave={e=>e.target.style.transform="none"}
                />
                <div className="absolute inset-0 rounded-full"
                  style={{ background:"linear-gradient(180deg, transparent 50%, rgba(46,74,63,0.2) 100%)" }}/>
              </div>
            </div>
          </div>

          {/* Signature Tasting Menu Card */}
          <div
            className="relative"
            style={{ background:"#EAE6DB", border:"1px solid #436A5C66",
              padding:"1.6rem", boxShadow:"5px 5px 0 #1E252212" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background:`linear-gradient(90deg, #2E4A3F, #E5A93C, #436A5C)` }}/>
            <ChapterLabel color="#2E4A3F">// Today's Tasting Menu</ChapterLabel>
            <p className="font-playfair font-bold" style={{ fontSize:"1.2rem", color:"#1E2522" }}>
              The Full-Stack Tasting Experience
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { v: data.stats?.yearsExperience  || "3+",    l:"Kitchen Runtime" },
                { v: data.stats?.projectsCompleted || "25+",  l:"Signature Dishes" },
                { v: data.stats?.happyClients      || "100%", l:"Patron Approval" },
                { v: "⭐⭐⭐",                                l:"Michelin Rating" },
              ].map((s,i) => (
                <div key={i} className="text-center p-3.5"
                  style={{ background:"#FCFAF2", border:"1px dashed #436A5C77" }}>
                  <span className="font-playfair block font-black text-lg" style={{ color: color === "#E5A93C" ? "#2E4A3F" : color }}>{s.v}</span>
                  <span className="font-mono-dm block mt-1 tracking-wider font-medium" style={{ fontSize:"0.46rem", textTransform:"uppercase", color:"#1E2522" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MARQUEE TICKER BANNER
══════════════════════════════════════════════════════════ */
function Ticker({ color }) {
  const items = [
    "Full-Stack Engineering","UI/UX Design","React & TypeScript",
    "API Architecture","Performance Optimization","Database Design",
    "Cloud Infrastructure","Open to Collaboration",
  ];
  const doubled = [...items,...items];
  return (
    <div className="overflow-hidden py-3" style={{ background: color === "#E5A93C" ? "#2E4A3F" : color, transition:"background .4s" }}>
      <div className="ticker-track flex gap-10 whitespace-nowrap">
        {doubled.map((item,i) => (
          <span key={i} className="font-mono-dm flex-shrink-0 tracking-widest font-bold"
            style={{ fontSize:"0.58rem", textTransform:"uppercase", color: "#FCFAF2" }}
          >
            {item} <span style={{ color: "#FCFAF255", margin:"0 6px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3. ABOUT SECTION (The Recipe Manifesto)
══════════════════════════════════════════════════════════ */
function About({ temp }) {
  const color = heatColor(temp);
  return (
    <section id="about" className="relative py-28 paper-texture"
      style={{ borderTop:"1px solid #1E25221a", borderBottom:"1px solid #1E25221a" }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Vintage Illustration Picture Frame Wrapper */}
        <Reveal>
          <div className="relative max-w-xs mx-auto lg:mx-0">
            {/* Custom structural stamp seal */}
            <div className="absolute -top-4 -right-4 z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all"
              style={{ background:"#2E4A3F", boxShadow:`0 4px 14px rgba(46,74,63,0.35)`,
                fontSize:"0.55rem", fontFamily:"DM Mono,monospace", textTransform:"uppercase",
                letterSpacing:".08em", lineHeight:1.2, textAlign:"center" }}
            >
              <span className="font-playfair block text-base font-bold" style={{ color:"#E5A93C" }}>5★</span>
              Rated<br/><span style={{color:"#EAE6DB"}}>Dev</span>
            </div>
            {/* Vintage Canvas Border Block */}
            <div className="relative overflow-hidden"
              style={{ aspectRatio:"3/4", borderRadius:"2px",
                boxShadow:"8px 8px 0 #EAE6DB, 16px 16px 0 rgba(46,74,63,0.06)", border:"1px solid #1E252218" }}
            >
              <img
                src={data.personal?.avatar || "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=600&fit=crop&crop=face"}
                alt={data.personal?.name}
                className="w-full h-full object-cover"
                style={{ filter:"sepia(15%) contrast(1.02)", mixBlendMode:"multiply", opacity:0.88 }}
              />
              <div className="absolute inset-0"
                style={{ background:"linear-gradient(180deg, transparent 50%, rgba(30,37,34,0.85) 100%)" }}/>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="font-playfair text-white font-bold" style={{ fontSize:"1.35rem", fontStyle:"italic" }}>
                  {data.personal?.name}
                </h3>
                <p className="font-mono-dm mt-1 tracking-wider font-semibold" style={{ fontSize:"0.52rem", textTransform:"uppercase", color:"#E5A93C" }}>
                  {data.personal?.title}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Informational Text Column */}
        <div>
          <Reveal delay={0.1}>
            <ChapterLabel color={color === "#FCFAF2" ? "#2E4A3F" : color}>// MASTER BLUEPRINT</ChapterLabel>
            <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 4.8vw, 3.4rem)",
              fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#1E2522" }}>
              The Chef's<br/><em style={{ color: "#2E4A3F" }}>Philosophy</em>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <blockquote className="font-playfair my-6"
              style={{ fontSize:"clamp(1.2rem, 2.6vw, 1.65rem)", fontStyle:"italic",
                color:"#1E2522", lineHeight:1.5, borderLeft:`4px solid #2E4A3F`,
                paddingLeft:"1.5rem" }}
            >
              "{data.personal?.bio || 'Assembling structural logic boards with micro-component clarity.'}"
            </blockquote>
          </Reveal>

          {/* Core Numeric Ribbon */}
          <Reveal delay={0.3}>
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6"
              style={{ borderTop:"1px solid #1E25221c" }}>
              {[
                { v: data.stats?.yearsExperience  || "3+",    l:"Kitchen Runtime",  icon:<Clock size={16}/> },
                { v: data.stats?.projectsCompleted || "25+",  l:"Dishes Plated",    icon:<Utensils size={16}/> },
                { v: data.stats?.happyClients      || "100%", l:"Patron Approval",  icon:<ThumbsUp size={16}/> },
              ].map((s,i) => (
                <div key={i} className="p-4 text-center transition-all"
                  style={{ background:"#FCFAF2", border:"1px solid #436A5C55", borderRadius:"4px" }}
                >
                  <div style={{ color:"#2E4A3F", marginBottom:6, display:"flex", justifyContent:"center" }}>{s.icon}</div>
                  <span className="font-playfair block font-black text-2xl" style={{ color:"#1E2522" }}>{s.v}</span>
                  <span className="font-mono-dm block mt-1 tracking-wider" style={{ fontSize:"0.44rem",
                    textTransform:"uppercase", color:"#2E4A3F", fontWeight: 500 }}>{s.l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   4. SKILLS (The Ingredient Chopping Board)
══════════════════════════════════════════════════════════ */
function Skills() {
  
  const [chopped, setChopped] = useState({});

  const byStation = (data.skills || []).reduce((acc, s) => {
    const k = s.category || "Secret Spices";
    (acc[k] = acc[k] || []).push(s);
    return acc;
  }, {});

  const levelPct = (lvl) => {
    if (typeof lvl === 'number' || !isNaN(lvl)) return parseInt(lvl, 10);
    const map = { Beginner: 30, Intermediate: 58, Advanced: 78, Expert: 92, Master: 100 };
    return map[lvl] || 75;
  };

  return (
    <section id="skills" className="relative py-28"
      style={{ background:"#EAE6DB" }}
    >
      {/* Dynamic textual watermarking background design */}
      <span className="font-playfair absolute pointer-events-none select-none font-black tracking-widest italic"
        style={{ top:"2rem", right:"3rem", fontSize:"6rem", color:"#1E252203" }}>SPICE RACK</span>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <ChapterLabel color="#2E4A3F">// REGISTRY INDEX 02 //</ChapterLabel>
          <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#1E2522" }}>
            The Kitchen <em style={{ color: "#2E4A3F" }}>Chopping Board</em>
          </h2>
          <p className="font-corm mt-2.5" style={{ fontStyle:"italic", color:"#1E2522b3",
            fontSize:"1.05rem", lineHeight:1.6, maxWidth:420 }}>
            Click core tech ingredients to activate slicing. Watch metrics fill the gauge.
          </p>
        </Reveal>

        {/* Structural Skill Columns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {Object.entries(byStation).map(([station, skills], si) => (
            <Reveal key={station} delay={si * 0.08}>
              <div className="relative lift"
                style={{ background:"#FCFAF2", border:"1px solid #436A5C44", padding:"1.6rem",
                  borderRadius: "4px", cursor:"default" }}
              >
                {/* Visual marker top badge layout line */}
                <div className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: stationAccents[si % stationAccents.length] }}/>
                
                <p className="font-mono-dm mb-1 font-bold"
                  style={{ fontSize:"0.52rem", textTransform:"uppercase", letterSpacing:".15em", color:"#436A5C" }}>
                  Station {String(si+1).padStart(2,"0")}
                </p>
                <h3 className="font-playfair font-bold pb-3.5 mb-5"
                  style={{ fontSize:"1.1rem", color:"#1E2522",
                    borderBottom:"1px solid #1E252214" }}>
                  🔪 {station} Station
                </h3>

                <div className="space-y-4.5">
                  {skills.map((skill, idx) => {
                    const isChopped = !!chopped[skill.name];
                    const pct = levelPct(skill.level);
                    return (
                      <button
  key={idx}
  type="button"
  className="group/item w-full text-left bg-transparent border-none p-0"
  onClick={() => setChopped(p => ({ ...p, [skill.name]: !p[skill.name] }))}
  aria-pressed={isChopped}
>
                        <div className="flex items-center justify-between gap-2 cursor-pointer select-none mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Checkbox button styling */}
                            <div className="w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 transition-all border"
                              style={{ 
                                borderColor: isChopped ? "#2E4A3F" : "#436A5Caa",
                                background: isChopped ? "#2E4A3F" : "transparent" 
                              }}
                            >
                              {isChopped && <Check size={11} strokeWidth={3} color="#FCFAF2"/>}
                            </div>
                            <span className="font-corm transition-all font-medium"
                              style={{ fontSize:"1.05rem",
                                color: isChopped ? "#1E252266" : "#1E2522",
                                textDecoration: isChopped ? "line-through" : "none",
                                fontStyle: isChopped ? "italic" : "normal" }}
                            >
                              {skill.name}
                            </span>
                          </div>
                          <span className="font-mono-dm flex-shrink-0 transition-colors"
                            style={{ fontSize:"0.46rem", textTransform:"uppercase",
                              letterSpacing:".08em", color:"#1E2522",
                              background: isChopped ? "#EAE6DB" : "#E5A93C",
                              padding:"2px 7px", borderRadius:"2px", fontWeight: 500 }}
                          >
                            {skill.level || "Expert"}
                          </span>
                        </div>
                        {/* Dynamic heat progress bar gauges */}
                        <div className="w-full rounded-full overflow-hidden"
                          style={{ height:4, background:"#1E252212" }}>
                          <div
                            className="h-full rounded-full skill-bar-fill"
                            style={{ width: isChopped ? "100%" : `${pct}%`,
                              background: isChopped ? "#436A5Cdd" : "#2E4A3F",
                              transition:"width 1s cubic-bezier(.25,1,.5,1), background .3s" }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   5. PROJECTS (The Plated Service Menu)
══════════════════════════════════════════════════════════ */
function Projects() {
  
  const techFilters = ["all", ...new Set(
    (data.projects || []).flatMap(p => p.techStack || []).filter(Boolean)
  )].slice(0, 6);
  const [active, setActive] = useState("all");

  const filtered = (data.projects || []).filter(p =>
    active === "all" || p.techStack?.includes(active)
  );

  return (
    <section id="projects" className="relative py-28 overflow-hidden"
      style={{ background:"#1E2522" }}
    >
      {/* Background illumination gradient maps */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:`radial-gradient(circle at 10% 50%, rgba(229,169,60,.06) 0%, transparent 50%),
                    radial-gradient(circle at 90% 20%, rgba(46,74,63,.4) 0%, transparent 50%)`
      }}/>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <ChapterLabel color="#E5A93C">// CATALOG SPECIFICATION 03 //</ChapterLabel>
          <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#EAE6DB" }}>
            The Plated <em style={{ color: "#E5A93C" }}>Service Menu</em>
          </h2>
          <p className="font-corm mt-2.5" style={{ fontStyle:"italic", fontSize:"1.05rem",
            color:"#EAE6DBa3", lineHeight:1.7, maxWidth:450 }}>
            Each dish crafted from first principles — clean architecture and obsessive attention to detail.
          </p>
        </Reveal>

        {/* Interactive Filtering Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-10 mb-10 p-2 rounded"
          style={{ background:"rgba(234,230,219,0.04)", border:"1px solid rgba(67,106,92,0.15)" }}>
          {techFilters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className="font-mono-dm cursor-pointer transition-all tracking-widest font-medium rounded-sm"
              style={{ fontSize:"0.56rem", textTransform:"uppercase",
                padding:"0.55rem 1.1rem",
                border: active===f ? "1px solid #E5A93C" : "1px solid transparent",
                background: active===f ? "#E5A93C" : "transparent",
                color: active===f ? "#1E2522" : "#EAE6DBaa" }}
            >
              {f === "all" ? "All Formations" : f}
            </button>
          ))}
        </div>

        {/* Structural Menu Items Grid Layout */}
        <div className="grid md:grid-cols-2 gap-7 pb-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.title || idx} layout
                initial={{opacity:0, y:15}} animate={{opacity:1, y:0}}
                exit={{opacity:0, y:-10}} transition={{duration:.35}}
                className={`flex flex-col relative overflow-hidden transition-all duration-300 ${idx%2!==0?"md:mt-8":""}`}
                style={{ background:"#FCFAF2", border:"1px solid #436A5C33", borderRadius:"4px", cursor:"default" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#E5A93C"; e.currentTarget.style.transform="translateY(-4px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#436A5C33"; e.currentTarget.style.transform=""}}
              >
                {/* Visual Ribbon marker badge */}
                <div className="absolute top-3 right-3 z-10 p-2 rounded-sm"
                  style={{ background:"#EAE6DB", border:"1px solid #436A5C44" }}>
                  <BookOpen size={13} color="#2E4A3F"/>
                </div>

                {/* Project Image Frame Box */}
                <div className="relative overflow-hidden" style={{ height:220, background:"#1E2522" }}>
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1556910103-1c02745aae4d"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ filter:"sepia(5%) contrast(1.02)", transition:"transform 0.5s ease" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.target.style.transform="none"}
                  />
                  <div className="absolute inset-0"
                    style={{ background:"linear-gradient(180deg, transparent 40%, rgba(30,37,34,0.7) 100%)" }}/>
                  <span className="font-playfair absolute top-2 left-4 font-black"
                    style={{ fontSize:"2.5rem", color:"#FCFAF21a", lineHeight:1, userSelect:"none" }}>
                    {String(idx+1).padStart(2,"0")}
                  </span>
                </div>

                {/* Card Content Interior Body */}
                <div className="flex flex-col flex-1 p-6">
                  <p className="font-mono-dm mb-2 font-bold"
                    style={{ fontSize:"0.52rem", textTransform:"uppercase",
                      letterSpacing:".15em", color:"#2E4A3F" }}>
                    // BLUEPRINT ASSEMBLY DISH #{idx+1}
                  </p>
                  <h3 className="font-playfair font-black text-xl" style={{ color:"#1E2522", lineHeight:1.2 }}>
                    {project.title}
                  </h3>
                  <p className="font-corm flex-1 mt-2"
                    style={{ fontStyle:"italic", fontSize:"0.95rem",
                      color:"#1E2522b3", lineHeight:1.65 }}>
                    "{project.description}"
                  </p>

                  {/* Micro Tech Tags Labeling */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.techStack?.map((t,i) => (
                      <span key={i} className="font-mono-dm font-medium"
                        style={{ fontSize:"0.48rem", textTransform:"uppercase",
                          padding:"3px 8px", background:"#EAE6DB", borderRadius:"2px",
                          color:"#1E2522" }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Structural CTA Interactive Links */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-4"
                    style={{ borderTop:"1px solid #1E252214" }}>
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="font-mono-dm inline-flex items-center justify-center gap-1.5 text-white font-bold tracking-wider"
                        style={{ fontSize:"0.54rem", textTransform:"uppercase",
                          padding:"0.65rem 1rem", background:"#2E4A3F", textDecoration:"none", borderRadius:"2px" }}
                        onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.1)"}
                        onMouseLeave={e=>e.currentTarget.style.filter=""}
                      >
                        Taste Demo <ExternalLink size={11}/>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="font-mono-dm inline-flex items-center justify-center gap-1.5 font-bold tracking-wider transition-colors"
                        style={{ fontSize:"0.54rem", textTransform:"uppercase",
                          padding:"0.65rem 1rem", background:"#EAE6DB",
                          border:"1px solid #436A5C44", color:"#1E2522", textDecoration:"none", borderRadius:"2px" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#436A5C44"}}
                        onMouseLeave={e=>{e.currentTarget.style.background="#EAE6DB"}}
                      >
                        Source Code <Github size={11}/>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   6. EXPERIENCE (The Kitchen Operational Ledger)
══════════════════════════════════════════════════════════ */
function Experience() {
 
  if (!data.experience?.length) return null;

  return (
    <section id="experience" className="relative py-28 paper-texture"
      style={{ borderTop:"1px solid #1E252215" }}
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <ChapterLabel color="#2E4A3F">// SECTION 04 // OPERATIONAL TIMELINE</ChapterLabel>
            <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#1E2522" }}>
              The Kitchen <em style={{ color: "#2E4A3F" }}>Service Ledger</em>
            </h2>
            <OrnDiv color="#436A5C"/>
          </div>
        </Reveal>

        {/* Structural Vertical Timeline Board */}
        <div className="relative pl-8 ml-2" style={{ borderLeft:"2px dashed #436A5C77" }}>
          {data.experience.map((job, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="relative mb-12 group">
                {/* Node pin visual design locator element */}
                <div className="absolute rounded-full transition-all duration-300"
                  style={{ left:"-2.62rem", top:".45rem", width:14, height:14,
                    background:"#2E4A3F", border:"3px solid #FCFAF2",
                    boxShadow:"0 0 0 4px rgba(46,74,63,0.15)" }}
                />
                {/* Ledger Item Box container */}
                <div className="relative overflow-hidden transition-all duration-300"
                  style={{ background:"#FCFAF2", border:"1px solid #436A5C55",
                    padding:"1.5rem 1.8rem", borderRadius:"2px",
                    boxShadow:"4px 4px 0 #EAE6DB" }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="6px 6px 0 #436A5C44"; e.currentTarget.style.transform="translateX(2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="4px 4px 0 #EAE6DB"; e.currentTarget.style.transform=""}}
                >
                  {/* Decorative card border highlight asset */}
                  <div className="absolute top-0 left-0 right-0 h-1"
                    style={{ background:`linear-gradient(90deg, #2E4A3F, #E5A93C)` }}/>
                  
                  {/* Ledger Item header row details */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3.5 mb-4"
                    style={{ borderBottom:"1px solid #1E252214" }}>
                    <div>
                      <h4 className="font-playfair font-black text-xl" style={{ color:"#1E2522" }}>
                        {job.role}
                      </h4>
                      <span className="font-mono-dm block mt-1 tracking-wider font-bold"
                        style={{ fontSize:"0.54rem", textTransform:"uppercase", color:"#2E4A3F" }}>
                        {job.company}
                      </span>
                    </div>
                    <span className="font-mono-dm flex-shrink-0 self-start sm:self-center font-bold tracking-wider"
                      style={{ fontSize:"0.48rem", background:"#EAE6DB",
                        color:"#1E2522", padding:"4px 10px", borderRadius:"2px" }}>
                      {job.period}
                    </span>
                  </div>
                  <p className="font-corm" style={{ fontStyle:"italic", fontSize:"1rem",
                    color:"#1E2522cc", lineHeight:1.8 }}>
                    "{job.description}"
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   7. TESTIMONIALS (The Guest Review Book)
══════════════════════════════════════════════════════════ */
function Testimonials() {
  
  const [active, setActive] = useState(0);
  const testimonials = data.testimonials || [];
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="relative py-28 overflow-hidden"
      style={{ background:"#1E2522" }}
    >
      {/* Background radial soft light gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:`radial-gradient(circle at 50% 50%, rgba(67,106,92,0.08) 0%, transparent 65%)`
      }}/>
      
      {/* Editorial typography background watermark decoration */}
      <span className="font-playfair absolute pointer-events-none select-none font-black italic tracking-widest"
        style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          fontSize:"clamp(6rem, 16vw, 15rem)", color:"#FCFAF202", whiteSpace:"nowrap", lineHeight:1 }}>
        REVIEWS
      </span>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <ChapterLabel color="#E5A93C">// SECTION 05 // PATRON FEEDBACK</ChapterLabel>
            <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#EAE6DB" }}>
              The Guest <em style={{ color: "#E5A93C" }}>Review Book</em>
            </h2>
          </div>
        </Reveal>

        {/* Featured Testimonial Slider Canvas view container */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{opacity:0, y:15}} animate={{opacity:1, y:0}}
            exit={{opacity:0, y:-15}} transition={{duration:.4}}
            className="relative p-8 lg:p-14 text-center"
            style={{ background:"#FCFAF2", border:"1px solid #436A5C44", borderRadius:"4px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{ background:`linear-gradient(90deg, transparent, #2E4A3F, transparent)` }}/>
            
            <Quote size={36} style={{ color:"#436A5C55", margin:"0 auto 1.5rem" }}/>
            
            {/* Culinary Graphic Star ratings */}
            <div className="flex justify-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="star-filled"/>
              ))}
            </div>
            
            <p className="font-playfair" style={{ fontSize:"clamp(1.25rem, 2.6vw, 1.8rem)",
              fontStyle:"italic", color:"#1E2522", lineHeight:1.55, maxWidth:660, margin:"0 auto" }}>
              "{testimonials[active].text}"
            </p>
            
            {/* Author Attribution Meta block elements */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {testimonials[active].avatar && (
                <img src={testimonials[active].avatar} alt={testimonials[active].name}
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ width:52, height:52, border:"2px solid #2E4A3F" }}
                />
              )}
              <div className="text-left">
                <p className="font-playfair font-black text-lg" style={{ color:"#1E2522" }}>
                  {testimonials[active].name}
                </p>
                <p className="font-mono-dm mt-0.5 tracking-wider font-semibold" style={{ fontSize:"0.52rem",
                  textTransform:"uppercase", color:"#2E4A3F" }}>
                  {testimonials[active].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots system dashboard elements */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="rounded-full transition-all cursor-pointer border-none"
              style={{ width: i===active ? 32 : 8, height:8,
                background: i===active ? "#E5A93C" : "rgba(234,230,219,0.2)" }}
            />
          ))}
        </div>

        {/* Mini Grid Reviews Index display cards underneath overview */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i*0.08}>
              <div
                className="p-5 cursor-pointer transition-all duration-200 rounded-sm"
                style={{ 
                  background: i===active ? "rgba(229,169,60,0.08)" : "rgba(234,230,219,0.03)",
                  border: i===active ? "1px solid #E5A93C55" : "1px solid rgba(234,230,219,0.08)" 
                }}
                onClick={() => setActive(i)}
              >
                <div className="flex gap-0.5 mb-2.5">
                  {[...Array(5)].map((_, j)=>(<Star key={j} size={12} className="star-filled"/>))}
                </div>
                <p className="font-corm" style={{ fontStyle:"italic", fontSize:"0.9rem",
                  color:"#EAE6DBb3", lineHeight:1.6,
                  display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2.5 mt-4">
                  {t.avatar && (
                    <img src={t.avatar} alt={t.name} className="rounded-full object-cover flex-shrink-0"
                      style={{ width:32, height:32 }}/>
                  )}
                  <div>
                    <p className="font-playfair font-bold text-sm" style={{ color:"#EAE6DB" }}>{t.name}</p>
                    <p className="font-mono-dm tracking-wider text-2xs" style={{ fontSize:"0.44rem", color:"#436A5C" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   8. CONTACT (The Station Booking Desk)
══════════════════════════════════════════════════════════ */
function Contact() {
  
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  // Add this ref near the top of your Contact component
  const timeoutRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    
    // Clear any existing active timeout just in case
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => { 
      setSent(false); 
      setForm({ name: "", email: "", subject: "", message: "" }); 
    }, 3500);
  };

  // Add this hook inside the Contact component to clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const inputStyle = {
    fontFamily:"'Cormorant Garamond', serif", fontSize:"1.05rem", color:"#1E2522",
    background:"#FCFAF2", border:"1px solid #436A5C55",
    padding:"0.8rem 1.1rem", outline:"none", width:"100%", borderRadius:"2px",
    transition:"all .25s ease",
  };

  return (
    <section id="contact" className="relative py-28"
      style={{ background:"#EAE6DB" }}
    >
      {/* Visual background star illustration emblem branding */}
      <span className="absolute pointer-events-none select-none font-black"
        style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          fontSize:"28rem", color:"#1E252202", lineHeight:1 }}>✦</span>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <ChapterLabel color="#2E4A3F">// SECTION 06 // BOOKING DESK</ChapterLabel>
            <h2 className="font-playfair" style={{ fontSize:"clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight:900, lineHeight:1, letterSpacing:"-.02em", color:"#1E2522" }}>
              Secure a <em style={{ color: "#2E4A3F" }}>Station Booking</em>
            </h2>
            <p className="font-corm mt-3" style={{ fontStyle:"italic", fontSize:"1.1rem",
              color:"#1E2522b3", lineHeight:1.65, maxWidth:440, margin:"0.8rem auto 0" }}>
              Have an architectural pipeline to build? Drop a message onto the chef deck.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Reservation submission form grid system layout workspace */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="relative p-8 lg:p-10"
              style={{ background:"#FCFAF2", border:"1px solid #436A5C44",
                boxShadow:"6px 6px 0 rgba(30,37,34,0.06)", borderRadius:"4px" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background:`linear-gradient(90deg, #2E4A3F, #E5A93C, #436A5C)` }}/>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success"
                    initial={{opacity:0, scale:.95}} animate={{opacity:1, scale:1}}
                    exit={{opacity:0}} className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background:"rgba(46,74,63,0.08)" }}>
                      <Check size={32} style={{ color: "#2E4A3F" }}/>
                    </div>
                    <p className="font-playfair font-black text-2xl" style={{ color:"#1E2522" }}>
                      Message Sent to the Kitchen!
                    </p>
                    <p className="font-corm mt-2.5" style={{ fontStyle:"italic", color:"#2E4A3F", fontSize:"1.05rem" }}>
                      We'll plate a response shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4.5">
                      {[
                        { key:"name",    label:"Your Name",     ph:"Gordon Ramsay"      },
                        { key:"email",   label:"Email Address", ph:"chef@kitchen.com"   },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="font-mono-dm block mb-1.5 font-bold"
                            style={{ fontSize:"0.54rem", textTransform:"uppercase", trackingWidth:"0.12em", color:"#1E2522" }}>
                            {f.label}
                          </label>
                          <input
                            type={f.key === "email" ? "email" : "text"}
                            placeholder={f.ph} required value={form[f.key]}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = "#2E4A3F"; e.target.style.boxShadow = "0 0 0 3px rgba(46,74,63,0.08)" }}
                            onBlur={e => { e.target.style.borderColor = "#436A5C55"; e.target.style.boxShadow = "" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="font-mono-dm block mb-1.5 font-bold"
                        style={{ fontSize:"0.54rem", textTransform:"uppercase", trackingWidth:"0.12em", color:"#1E2522" }}>
                        Subject / Occasion
                      </label>
                      <input type="text" placeholder="Building a 3-course web application..."
                        value={form.subject}
                        onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#2E4A3F"; e.target.style.boxShadow = "0 0 0 3px rgba(46,74,63,0.08)" }}
                        onBlur={e => { e.target.style.borderColor = "#436A5C55"; e.target.style.boxShadow = "" }}
                      />
                    </div>
                    <div>
                      <label className="font-mono-dm block mb-1.5 font-bold"
                        style={{ fontSize:"0.54rem", textTransform:"uppercase", trackingWidth:"0.12em", color:"#1E2522" }}>
                        Your Recipe Brief
                      </label>
                      <textarea
                        placeholder="Tell me about your project — the more detail, the better the dish..."
                        required value={form.message} rows={5}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        style={{ ...inputStyle, resize:"none" }}
                        onFocus={e => { e.target.style.borderColor = "#2E4A3F"; e.target.style.boxShadow = "0 0 0 3px rgba(46,74,63,0.08)" }}
                        onBlur={e => { e.target.style.borderColor = "#436A5C55"; e.target.style.boxShadow = "" }}
                      />
                    </div>
                    <button type="submit"
                      className="font-mono-dm w-full flex items-center justify-center gap-2 cursor-pointer font-bold tracking-widest transition-all"
                      style={{ fontSize:"0.65rem", textTransform:"uppercase",
                        background:"#2E4A3F", color:"#FCFAF2", border:"none",
                        padding:"1.1rem 2rem", borderRadius:"2px", boxShadow:"0 4px 12px rgba(46,74,63,0.15)" }}
                      onMouseEnter={e=>{e.currentTarget.style.filter="brightness(1.1)"; e.currentTarget.style.transform="translateY(-1px)"}}
                      onMouseLeave={e=>{e.currentTarget.style.filter=""; e.currentTarget.style.transform=""}}
                    >
                      Send the Reservation ✦ <Send size={13}/>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Social connections profile tracking list items row column */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="space-y-6 h-full flex flex-col justify-between">
              <div>
                <ChapterLabel color="#1E2522">Direct Lines</ChapterLabel>
                <div className="space-y-3.5 mt-4">
                  {[
                    { href:`mailto:${data.socials?.email}`, icon:<Mail size={16}/>, label:"Open Comms Order", val:data.socials?.email, show:!!data.socials?.email },
                    { href:data.socials?.github,  icon:<Github size={16}/>,   label:"Git Log Index",  val:"GitHub Profile",  show:!!data.socials?.github  },
                    { href:data.socials?.linkedin, icon:<Linkedin size={16}/>, label:"Connect Office", val:"LinkedIn Profile", show:!!data.socials?.linkedin },
                    { href:data.socials?.twitter,  icon:<Twitter size={16}/>,  label:"Twitter Station", val:"Twitter Profile", show:!!data.socials?.twitter  },
                  ].filter(l=>l.show).map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-4 p-3.5 font-mono-dm group transition-all"
                      style={{ background:"#FCFAF2", border:"1px solid #436A5C44",
                        textDecoration:"none", borderRadius:"2px",
                        boxShadow:"2px 2px 0 rgba(30,37,34,0.04)" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="#2E4A3F"; e.currentTarget.style.boxShadow="4px 4px 0 #436A5C44"}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#436A5C44"; e.currentTarget.style.boxShadow="2px 2px 0 rgba(30,37,34,0.04)"}}
                    >
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                        style={{ background:"#EAE6DB", color:"#1E2522", borderRadius:"2px" }}>
                        {l.icon}
                      </div>
                      <div>
                        <span className="block font-bold" style={{ fontSize:"0.52rem", textTransform:"uppercase", color:"#2E4A3F" }}>{l.label}</span>
                        <span className="block mt-0.5 font-corm text-base font-semibold" style={{ fontStyle:"italic", color:"#1E2522" }}>{l.val}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* System Availability notification layout stamp box widget element */}
              <div className="p-6 relative overflow-hidden"
                style={{ background:"#2E4A3F", borderRadius:"4px", boxShadow:"0 6px 16px rgba(46,74,63,0.2)" }}>
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage:"repeating-linear-gradient(transparent, transparent 14px, #FCFAF2 14px, #FCFAF2 15px)" }}/>
                <p className="font-mono-dm relative z-10 font-bold"
                  style={{ fontSize:"0.52rem", textTransform:"uppercase", trackingWidth:"0.15em", color:"#E5A93C" }}>
                  // Current Status
                </p>
                <p className="font-playfair relative z-10 mt-1.5 font-black text-xl text-white">
                  Kitchen is Open ✦
                </p>
                <p className="font-corm relative z-10 mt-1 text-emerald-50 text-base"
                  style={{ fontStyle:"italic", opacity:0.85, color:"#EAE6DB" }}>
                  Accepting new projects & collaborations.
                </p>
                <div className="flex items-center gap-2 mt-4 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow:"0 0 8px #34d399" }}/>
                  <span className="font-mono-dm text-white font-medium tracking-wide" style={{ fontSize:"0.52rem", textTransform:"uppercase" }}>
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function Footer() {
  
  return (
    <footer className="py-10 text-center"
      style={{ background:"#1E2522", borderTop:"1px solid rgba(67,106,92,0.15)" }}>
      <div className="flex items-center justify-center gap-3.5 mb-3">
        <div className="h-px w-14" style={{ background:`linear-gradient(90deg, transparent, #436A5C)` }}/>
        <ChefHat size={18} style={{ color:"#E5A93C" }}/>
        <div className="h-px w-14" style={{ background:`linear-gradient(90deg, #436A5C, transparent)` }}/>
      </div>
      <p className="font-mono-dm font-medium tracking-widest"
        style={{ fontSize:"0.54rem", textTransform:"uppercase", color:"#EAE6DB88" }}>
        © {new Date().getFullYear()}{" "}
        <span style={{ color:"#E5A93C" }}>{data.personal?.name || "Kitchen System"}</span>
        {" "}— Framed cleanly with custom magazine components.
      </p>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT MASTER ENGINE
══════════════════════════════════════════════════════════ */
export default function RecipeCookbookPortfolio() {
  const [temp, setTemp] = useState(165);
  const color = heatColor(temp);

  return (
    <div className="rcb-root grain">
      <StyleInjector />
      <ProgressBar color={color} />
      <Nav temp={temp} setTemp={setTemp} />
      <Hero temp={temp} />
      <Ticker color={color} />
      <About temp={temp} />
      <Skills temp={temp} />
      <Projects temp={temp} />
      <Experience temp={temp} />
      <Testimonials temp={temp} />
      <Contact temp={temp} />
      <Footer temp={temp} />
    </div>
  );
}