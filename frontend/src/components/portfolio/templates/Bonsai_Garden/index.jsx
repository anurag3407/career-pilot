import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  ChevronDown, Quote, Leaf, Wind, Star, Briefcase, User, Code, MessageSquare, Phone
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

/* ─────────────────────────────────────────────
   THEME TOKENS (inline CSS vars via style prop)
───────────────────────────────────────────── */
const theme = {
  sand:       "#e8dcc8",
  sandLight:  "#f4ede0",
  sandDark:   "#c9b99a",
  moss:       "#4a6741",
  mossLight:  "#6b8f62",
  mossDark:   "#2d4228",
  stone:      "#7a7268",
  stoneLight: "#a09890",
  bark:       "#5c3d2e",
  barkLight:  "#8b6252",
  ink:        "#1a1a1a",
  mist:       "rgba(232,220,200,0.6)",
};

/* ─── Raked Sand Pattern (CSS SVG background) ─── */
const rakedSandBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 10 Q15 8 30 10 Q45 12 60 10' stroke='%23c9b99a' stroke-width='0.8' fill='none' opacity='0.5'/%3E%3Cpath d='M0 20 Q15 18 30 20 Q45 22 60 20' stroke='%23c9b99a' stroke-width='0.8' fill='none' opacity='0.5'/%3E%3Cpath d='M0 30 Q15 28 30 30 Q45 32 60 30' stroke='%23c9b99a' stroke-width='0.8' fill='none' opacity='0.5'/%3E%3Cpath d='M0 40 Q15 38 30 40 Q45 42 60 40' stroke='%23c9b99a' stroke-width='0.8' fill='none' opacity='0.5'/%3E%3Cpath d='M0 50 Q15 48 30 50 Q45 52 60 50' stroke='%23c9b99a' stroke-width='0.8' fill='none' opacity='0.5'/%3E%3C/svg%3E")`;

/* ─── SVG Bonsai Tree ─── */
const BonsaiSVG = ({ size = 280, className = "" }) => (
  <svg viewBox="0 0 300 320" width={size} height={size} className={className} aria-hidden="true">
    {/* Pot */}
    <rect x="115" y="285" width="70" height="12" rx="3" fill="#5c3d2e" />
    <polygon points="108,285 192,285 182,268 118,268" fill="#7a5c48" />
    <rect x="105" y="280" width="90" height="8" rx="2" fill="#4a2e20" />
    {/* Trunk */}
    <path d="M150 268 C148 240 145 210 143 185 C141 165 138 145 142 120 C144 108 148 98 150 85"
          stroke="#5c3d2e" strokeWidth="9" fill="none" strokeLinecap="round" />
    {/* Main branches */}
    <path d="M143 190 C125 180 105 172 88 162" stroke="#6b4c3a" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M145 160 C162 148 178 138 195 125" stroke="#6b4c3a" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M142 140 C128 128 112 118 98 105" stroke="#7a5c48" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M148 115 C158 100 168 88 178 72" stroke="#7a5c48" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M143 205 C130 200 116 196 102 192" stroke="#8b6252" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Foliage clusters */}
    {[
      { cx: 85, cy: 152, r: 26, op: 0.9 },
      { cx: 68, cy: 138, r: 20, op: 0.8 },
      { cx: 97, cy: 138, r: 18, op: 0.85 },
      { cx: 195, cy: 118, r: 24, op: 0.9 },
      { cx: 212, cy: 105, r: 18, op: 0.8 },
      { cx: 180, cy: 105, r: 20, op: 0.85 },
      { cx: 93, cy: 98, r: 22, op: 0.9 },
      { cx: 75, cy: 86, r: 17, op: 0.8 },
      { cx: 108, cy: 86, r: 16, op: 0.8 },
      { cx: 178, cy: 65, r: 22, op: 0.9 },
      { cx: 162, cy: 53, r: 16, op: 0.8 },
      { cx: 194, cy: 52, r: 14, op: 0.8 },
      { cx: 148, cy: 75, r: 22, op: 0.9 },
      { cx: 135, cy: 62, r: 16, op: 0.8 },
      { cx: 160, cy: 64, r: 14, op: 0.75 },
      { cx: 98, cy: 188, r: 16, op: 0.75 },
    ].map((c, i) => (
      <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.r} ry={c.r * 0.88}
        fill={i % 3 === 0 ? "#4a6741" : i % 3 === 1 ? "#6b8f62" : "#3a5232"}
        opacity={c.op} />
    ))}
    {/* Stones at base */}
    <ellipse cx="108" cy="272" rx="10" ry="5" fill="#9a9088" opacity="0.7" />
    <ellipse cx="192" cy="272" rx="8" ry="4" fill="#7a7268" opacity="0.7" />
    <ellipse cx="150" cy="275" rx="6" ry="3" fill="#b0a898" opacity="0.6" />
  </svg>
);

/* ─── Floating Leaf ─── */
const FloatingLeaf = ({ delay = 0, x = 0 }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0, y: -20, x: x, rotate: 0 }}
    animate={{ opacity: [0, 0.7, 0], y: 120, x: x + 30, rotate: 180 }}
    transition={{ duration: 6, delay, repeat: Infinity, repeatDelay: Math.random() * 4 + 2, ease: "easeIn" }}
  >
    <Leaf size={14} color={theme.mossLight} />
  </motion.div>
);

/* ─── Section Wrapper ─── */
const Section = ({ id, children, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ─── Section Heading ─── */
const SectionHeading = ({ jp, en }) => (
  <div className="mb-12 flex flex-col items-center gap-1">
    <span style={{ color: theme.stoneLight, fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.15em" }}
      className="text-sm uppercase tracking-widest">{jp}</span>
    <h2 style={{ color: theme.mossDark, fontFamily: "'Playfair Display', serif" }}
      className="text-3xl md:text-4xl font-bold">{en}</h2>
    <div className="flex items-center gap-3 mt-2">
      <div style={{ background: theme.sandDark }} className="h-px w-16" />
      <Leaf size={14} color={theme.moss} />
      <div style={{ background: theme.sandDark }} className="h-px w-16" />
    </div>
  </div>
);

/* ─── Skill Bar ─── */
const SkillBar = ({ name, level, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span style={{ color: theme.ink, fontFamily: "'Lora', serif" }} className="text-sm font-medium">{name}</span>
        <span style={{ color: theme.stone }} className="text-xs">{level}%</span>
      </div>
      <div style={{ background: theme.sandDark, borderRadius: 99 }} className="h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.1, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, ${theme.moss}, ${theme.mossLight})`, borderRadius: 99 }}
          className="h-full"
        />
      </div>
    </div>
  );
};

/* ─── Stone Divider ─── */
const StoneDivider = () => (
  <div className="flex items-center justify-center gap-4 my-2">
    {[18, 10, 22, 10, 18].map((r, i) => (
      <div key={i} style={{ background: theme.stoneLight, borderRadius: "50%", width: r, height: r * 0.6, opacity: 0.6 }} />
    ))}
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function BonsaiGarden() {
  const [activeNav, setActiveNav] = useState("hero");
  const [navOpen, setNavOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const personal    = data.personal    || {};
  const socials     = data.socials     || {};
  const skills      = data.skills      || [];
  const projects    = data.projects    || [];
  const experience  = data.experience  || [];
  const testimonials= data.testimonials|| [];
  const stats       = data.stats       || {};

  const navLinks = [
    { id: "about",        label: "About" },
    { id: "skills",       label: "Skills" },
    { id: "projects",     label: "Projects" },
    { id: "experience",   label: "Experience" },
    { id: "testimonials", label: "Words" },
    { id: "contact",      label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(l => document.getElementById(l.id));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollY) {
          setActiveNav(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  /* Group skills by category */
  const skillsByCategory = skills.reduce((acc, s) => {
    const cat = s.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ background: theme.sandLight, color: theme.ink, fontFamily: "'Lora', serif", minHeight: "100vh" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        html { scroll-behavior: smooth; }
        ::selection { background: ${theme.moss}; color: ${theme.sandLight}; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "left", background: theme.moss, position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100 }}
      />

      {/* ── Navigation ── */}
      <nav style={{ background: "rgba(244,237,224,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.sandDark}` }}
        className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} style={{ fontFamily: "'Noto Serif JP', serif", color: theme.mossDark }}
            className="text-lg font-bold tracking-wide flex items-center gap-2">
            <BonsaiSVG size={32} /> <span className="hidden sm:inline">{personal.name || "Portfolio"}</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                style={{
                  color: activeNav === l.id ? theme.moss : theme.stone,
                  fontFamily: "'Lora', serif",
                  borderBottom: activeNav === l.id ? `2px solid ${theme.moss}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}
                className="text-sm pb-0.5 hover:text-green-700">{l.label}</button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setNavOpen(v => !v)}
            aria-label="Toggle menu">
            {[0,1,2].map(i => (
              <motion.div key={i}
                animate={navOpen ? (i === 1 ? { opacity: 0 } : i === 0 ? { rotate: 45, y: 8 } : { rotate: -45, y: -8 }) : { rotate: 0, y: 0, opacity: 1 }}
                style={{ background: theme.mossDark, height: 2, width: 22, borderRadius: 2 }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ background: theme.sandLight, borderTop: `1px solid ${theme.sandDark}` }}
              className="md:hidden overflow-hidden">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  style={{ color: theme.mossDark, fontFamily: "'Lora', serif" }}
                  className="block w-full text-left px-6 py-3 text-sm hover:bg-amber-50">{l.label}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ════ HERO ════ */}
      <section id="hero" style={{ background: `${rakedSandBg}, linear-gradient(160deg, ${theme.sandLight} 60%, ${theme.sand})`, minHeight: "100vh", paddingTop: "4rem" }}
        className="relative flex flex-col items-center justify-center overflow-hidden">

        {/* Floating leaves */}
        {[60, 120, 200, 300, 400].map((x, i) => <FloatingLeaf key={i} delay={i * 1.2} x={x} />)}

        {/* Ink wash circle */}
        <div style={{ position: "absolute", right: "-5%", top: "10%", width: 420, height: 420,
          background: `radial-gradient(circle, ${theme.moss}18 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-8%", bottom: "15%", width: 350, height: 350,
          background: `radial-gradient(circle, ${theme.sandDark}40 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <p style={{ color: theme.stone, fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.2em" }}
              className="text-xs uppercase tracking-widest mb-3">静けさと技巧 — Serenity & Craft</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: theme.mossDark, lineHeight: 1.15 }}
              className="text-4xl md:text-6xl font-bold mb-4">
              {personal.name || "Your Name"}
            </h1>
            <p style={{ color: theme.barkLight, fontFamily: "'Playfair Display', serif" }}
              className="text-xl md:text-2xl italic mb-6">{personal.title || "Creative Developer"}</p>
            <p style={{ color: theme.stone }} className="text-base leading-relaxed mb-8 max-w-md">
              {personal.bio ? personal.bio.slice(0, 160) + "…" : "Crafting digital experiences with care and intention."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("projects")}
                style={{ background: theme.moss, color: theme.sandLight, fontFamily: "'Lora', serif" }}
                className="px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
                View My Work
              </button>
              <button onClick={() => scrollTo("contact")}
                style={{ border: `1.5px solid ${theme.moss}`, color: theme.moss, fontFamily: "'Lora', serif" }}
                className="px-7 py-3 rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
                Get in Touch
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { val: stats.yearsExperience || "5+", label: "Years" },
                { val: stats.projectsCompleted || "40+", label: "Projects" },
                { val: stats.happyClients || "30+", label: "Clients" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: theme.mossDark }} className="text-2xl font-bold">{s.val}</p>
                  <p style={{ color: theme.stoneLight }} className="text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bonsai illustration */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex justify-center items-end">
            <div className="relative">
              {/* Sand tray */}
              <div style={{ background: `linear-gradient(180deg, ${theme.sand}, ${theme.sandDark})`,
                border: `3px solid ${theme.bark}`, borderRadius: 12, padding: "8px 20px 4px",
                boxShadow: `0 8px 32px ${theme.bark}30` }}>
                <BonsaiSVG size={260} />
              </div>
              {/* Wind lines */}
              <motion.div className="absolute top-8 right-0" animate={{ x: [0, 6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Wind size={20} color={theme.sandDark} opacity={0.5} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => scrollTo("about")}>
          <span style={{ color: theme.stoneLight, fontFamily: "'Noto Serif JP', serif" }} className="text-xs">scroll</span>
          <ChevronDown size={16} color={theme.stoneLight} />
        </motion.div>
      </section>

      {/* ════ ABOUT ════ */}
      <Section id="about" style={{ background: theme.sand }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading jp="私について" en="About Me" />
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Avatar */}
            <div className="md:col-span-2 flex justify-center">
              <div style={{ position: "relative" }}>
                <div style={{ width: 220, height: 220, borderRadius: "50%", overflow: "hidden",
                  border: `4px solid ${theme.moss}`, boxShadow: `0 0 0 8px ${theme.sandDark}50, 0 12px 40px ${theme.bark}30` }}>
                  <img src={personal.avatar || "https://i.pravatar.cc/300"} alt={personal.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {/* Stone accent */}
                <div style={{ position: "absolute", bottom: 8, right: -8, background: theme.stone,
                  borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Leaf size={22} color={theme.sandLight} />
                </div>
              </div>
            </div>
            {/* Bio */}
            <div className="md:col-span-3">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: theme.mossDark }} className="text-2xl font-bold mb-4">
                Cultivating excellence, one commit at a time.
              </h3>
              <p style={{ color: theme.stone, lineHeight: 1.9 }} className="mb-6">{personal.bio || "A passionate developer with a love for clean design and elegant solutions."}</p>
              {personal.location && (
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={16} color={theme.moss} />
                  <span style={{ color: theme.stone }} className="text-sm">{personal.location}</span>
                </div>
              )}
              {/* Social links */}
              <div className="flex gap-4 flex-wrap">
                {[
                  
                  { key: "github", Icon: Github, label: "GitHub" },
                  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
                  { key: "twitter", Icon: Twitter, label: "Twitter" },
                  { key: "email", Icon: Mail, label: "Email", href: `mailto:${socials.email}` },
                ].filter(s => socials[s.key] || s.href).map(({ key, Icon, label, href }) => (
                  <a key={key} href={href || socials[key]} target="_blank" rel="noopener noreferrer"
                    style={{ background: theme.mist, border: `1px solid ${theme.sandDark}`, color: theme.moss }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm hover:shadow-md transition-shadow">
                    <Icon size={15} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ════ SKILLS ════ */}
      <Section id="skills" style={{ background: rakedSandBg + `, ${theme.sandLight}` }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading jp="技術・スキル" en="Skills" />
          <div className="grid md:grid-cols-2 gap-10">
            {Object.entries(skillsByCategory).map(([cat, catSkills], ci) => (
              <div key={cat} style={{ background: theme.mist, border: `1px solid ${theme.sandDark}`, borderRadius: 16,
                padding: "24px 28px", boxShadow: `0 4px 20px ${theme.sandDark}20` }}>
                <h3 style={{ color: theme.mossDark, fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold mb-5 flex items-center gap-2">
                  <Code size={16} color={theme.moss} /> {cat}
                </h3>
                {catSkills.map((sk, i) => (
                  <SkillBar key={sk.name} name={sk.name} level={sk.level || 75} delay={ci * 4 + i} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════ PROJECTS ════ */}
      <Section id="projects" style={{ background: theme.sand }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading jp="作品集" en="Projects" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, i) => (
              <motion.div key={proj.title || i}
                whileHover={{ y: -6, boxShadow: `0 16px 40px ${theme.bark}25` }}
                transition={{ duration: 0.3 }}
                style={{ background: theme.sandLight, border: `1px solid ${theme.sandDark}`, borderRadius: 18,
                  overflow: "hidden", boxShadow: `0 4px 20px ${theme.bark}15` }}>
                {/* Project image */}
                <div style={{ height: 180, overflow: "hidden", background: theme.sandDark }}>
                  {proj.image
                    ? <img src={proj.image} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                        background: `linear-gradient(135deg, ${theme.moss}30, ${theme.sandDark})` }}>
                        <BonsaiSVG size={120} />
                      </div>
                  }
                </div>
                <div className="p-6">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: theme.mossDark }} className="text-lg font-bold mb-2">{proj.title}</h3>
                  <p style={{ color: theme.stone }} className="text-sm leading-relaxed mb-4 line-clamp-3">{proj.description}</p>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(proj.techStack || []).slice(0, 5).map(t => (
                      <span key={t} style={{ background: `${theme.moss}20`, color: theme.moss, border: `1px solid ${theme.moss}40` }}
                        className="text-xs px-2.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  {/* Links */}
                  <div className="flex gap-3">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                        style={{ background: theme.moss, color: theme.sandLight }}
                        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                        style={{ border: `1px solid ${theme.stone}`, color: theme.stone }}
                        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full hover:bg-stone-100 transition-colors">
                        <Github size={12} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════ EXPERIENCE ════ */}
      <Section id="experience" style={{ background: theme.sandLight }} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading jp="職歴・経験" en="Experience" />
          <div className="relative">
            {/* Timeline line */}
            <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${theme.moss}, ${theme.sandDark})` }} />
            <div className="space-y-10">
              {experience.map((exp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-8">
                  {/* Dot */}
                  <div style={{ minWidth: 48, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: theme.moss, border: `3px solid ${theme.sandLight}`,
                      boxShadow: `0 0 0 3px ${theme.moss}40`, zIndex: 1 }} />
                  </div>
                  {/* Card */}
                  <div style={{ background: theme.mist, border: `1px solid ${theme.sandDark}`, borderRadius: 14, padding: "20px 24px",
                    flex: 1, boxShadow: `0 4px 16px ${theme.sandDark}20` }}>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: theme.mossDark }} className="text-lg font-bold">{exp.role}</h3>
                        <p style={{ color: theme.barkLight }} className="text-sm font-medium flex items-center gap-1.5">
                          <Briefcase size={13} /> {exp.company}
                        </p>
                      </div>
                      <span style={{ background: `${theme.moss}20`, color: theme.moss, border: `1px solid ${theme.moss}30` }}
                        className="text-xs px-3 py-1 rounded-full whitespace-nowrap">{exp.period}</span>
                    </div>
                    <p style={{ color: theme.stone }} className="text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════ TESTIMONIALS ════ */}
      <Section id="testimonials" style={{ background: `${rakedSandBg}, ${theme.sand}` }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading jp="お言葉" en="Kind Words" />
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}
                style={{ background: theme.sandLight, border: `1px solid ${theme.sandDark}`, borderRadius: 18,
                  padding: "28px 30px", boxShadow: `0 4px 20px ${theme.bark}12`, position: "relative" }}>
                <Quote size={32} color={`${theme.moss}30`} style={{ position: "absolute", top: 20, right: 24 }} />
                <p style={{ color: theme.stone, lineHeight: 1.8, fontStyle: "italic" }} className="mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.moss}` }}>
                    <img src={t.avatar || `https://i.pravatar.cc/100?img=${i + 5}`} alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <p style={{ color: theme.mossDark, fontFamily: "'Playfair Display', serif" }} className="font-bold text-sm">{t.name}</p>
                    <p style={{ color: theme.stoneLight }} className="text-xs">{t.role}</p>
                  </div>
                </div>
                {/* Star row */}
                <div className="flex gap-1 mt-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={theme.moss} color={theme.moss} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════ CONTACT ════ */}
      <Section id="contact" style={{ background: theme.mossDark }} className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ color: `${theme.sandDark}99`, fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.2em" }}
            className="text-xs uppercase tracking-widest mb-2">ご連絡</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: theme.sandLight }} className="text-3xl md:text-4xl font-bold mb-4">
            Let's Grow Together
          </h2>
          <p style={{ color: `${theme.sandDark}cc` }} className="mb-10 text-base leading-relaxed max-w-lg mx-auto">
            Every great project starts with a simple conversation. Reach out and let's cultivate something extraordinary.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {[
              { icon: Mail, label: "Email", val: socials.email, href: `mailto:${socials.email}` },
              { icon: Github, label: "GitHub", val: "View Profile", href: socials.github },
              { icon: Linkedin, label: "LinkedIn", val: "Connect", href: socials.linkedin },
              { icon: MapPin, label: "Location", val: personal.location, href: null },
            ].filter(c => c.val).map(c => (
              <a key={c.label} href={c.href || undefined} target={c.href ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ background: `${theme.mossLight}22`, border: `1px solid ${theme.mossLight}40`,
                  borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
                  textDecoration: "none", cursor: c.href ? "pointer" : "default" }}
                className="hover:bg-green-900 transition-colors">
                <c.icon size={20} color={theme.sandDark} />
                <div className="text-left">
                  <p style={{ color: `${theme.sandLight}80` }} className="text-xs">{c.label}</p>
                  <p style={{ color: theme.sandLight }} className="text-sm font-medium">{c.val}</p>
                </div>
              </a>
            ))}
          </div>

          <StoneDivider />
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer style={{ background: theme.mossDark, borderTop: `1px solid ${theme.mossLight}30`, padding: "20px 24px" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BonsaiSVG size={28} />
            <span style={{ color: `${theme.sandDark}80`, fontFamily: "'Noto Serif JP', serif" }} className="text-xs">
              {personal.name || "Portfolio"} © {new Date().getFullYear()}
            </span>
          </div>
          <p style={{ color: `${theme.sandDark}50` }} className="text-xs text-center">
            Crafted with patience & precision · Bonsai Garden Theme
          </p>
        </div>
      </footer>
    </div>
  );
}