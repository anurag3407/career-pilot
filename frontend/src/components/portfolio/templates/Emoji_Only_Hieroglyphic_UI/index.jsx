import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  ChevronDown, ArrowUp, Send, CheckCircle, HelpCircle, Sparkles
} from 'lucide-react';
import dummyData from '../../../../data/dummy_data.json';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ── Hieroglyphs & Emojis Map ──────────────────────────────────── */
const GLYPHS_MAP = {
  about: '𓀀 👤 📜',
  skills: '𓋹 🛠️ 🧱',
  projects: '𓆣 🚀 📦',
  experience: '𓀔 ⏳ 💼',
  testimonials: '𓁹 💬 🤝',
  contact: '𓅓 ✉️ 📞',
  frontend: '𓋹 🎨 🖥️',
  backend: '𓆣 ⚙️ 💾',
  devops: '𓇳 ☁️ 🚀',
  design: '𓁹 🎨 📐',
  tools: '𓀋 🔧 🛠️',
  database: '𓏏 🛢️ 🗄️',
  github: '𓆗 🌐 🐙',
  linkedin: '𓀔 💼 👔',
  twitter: '𓅓 🐦 💬',
  email: '𓅓 ✉️ 📬',
  location: '𓏏 📍 🗺️',
  years: '𓇳 ⏳ 𓏲',
  projectsCompleted: '𓆣 🏆 𓏏',
  happyClients: '𓀠 👥 🤝',
};

const KEYWORDS = {
  developer: '💻𓀋',
  engineer: '🛠️𓀋',
  design: '🎨𓁹',
  code: '⌨️𓏲',
  web: '🌐𓋹',
  app: '📱𓏲',
  javascript: '🟨𓏲',
  react: '⚛️𓋹',
  node: '🟩𓆣',
  python: '🐍𓆗',
  database: '🛢️𓏏',
  cloud: '☁️𓇳',
  scale: '⚖️𓎛',
  build: '🏗️𓏏',
  team: '👥𓀔',
  client: '🤝𓀠',
  work: '💼𓀔',
  lead: '👑𓀀',
  manager: '👑𓀀',
  project: '📦𓆣',
  system: '⚙️𓎛',
  years: '⏳𓇳',
  experience: '💼⏳',
  software: '💻𓏲',
  fullstack: '🥞𓆣',
};

const EGYPTIAN_ALPHABET = {
  a: '𓀀', b: '𓀓', c: '𓀠', d: '𓀔', e: '𓋹', f: '𓆑', g: '𓅓', h: '𓎛', i: '𓏤',
  j: '𓏲', k: '𓎡', l: '𓏠', m: '𓅱', n: '𓈖', o: '𓇳', p: '𓊖', q: '𓍴', r: '𓂋',
  s: '𓊃', t: '𓏏', u: '𓅃', v: '𓆗', w: '𓅯', x: '𓆣', y: '𓁹', z: '𓎘'
};

const DECORATIVE_EMOJIS = ["🧱", "🏺", "📜", "𓋹", "𓆣", "𓁹", "𓃠", "𓅓", "𓆗", "𓇳", "𓎛", "𓏏"];

function translateToHieroglyphs(text) {
  if (!text) return '';
  const words = text.split(' ');
  const translated = words.map((word) => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (KEYWORDS[clean]) return KEYWORDS[clean];
    
    let glyph = '';
    for (let char of clean) {
      glyph += EGYPTIAN_ALPHABET[char] || char;
    }
    
    const emojiIdx = clean.charCodeAt(0) % DECORATIVE_EMOJIS.length;
    const deco = isNaN(emojiIdx) ? '𓋹' : DECORATIVE_EMOJIS[emojiIdx];
    return glyph.slice(0, 3) + deco;
  });
  return translated.slice(0, 16).join(' ') + (translated.length > 16 ? ' 𓏲...' : '');
}

/* ── Scoped CSS styles ─────────────────────────────────────────── */
function HieroglyphicStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

      .eg-root {
        --basalt: #0d0805;
        --basalt-alt: #160f0a;
        --gold: #d4af37;
        --gold-glow: rgba(212, 175, 55, 0.4);
        --lapis: #0f2b5c;
        --papyrus: #f2e6d5;
        --parchment: #f9f2e7;
        --text-dark: #2a1f15;
        --text-gold: #f3dfa2;
        --text-muted: #a39587;
        
        font-family: 'Cinzel', Georgia, serif;
        background-color: var(--basalt);
        color: var(--text-gold);
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Sand Texture Overlay */
      .eg-sand {
        background-image: 
          radial-gradient(rgba(212, 175, 55, 0.04) 1px, transparent 0),
          radial-gradient(rgba(212, 175, 55, 0.02) 2px, transparent 0);
        background-size: 24px 24px, 48px 48px;
        background-position: 0 0, 12px 12px;
      }

      /* Golden Cartouche pill style */
      .eg-cartouche {
        border: 3px double var(--gold);
        border-radius: 9999px;
        padding: 8px 28px;
        background: linear-gradient(135deg, var(--lapis), var(--basalt));
        box-shadow: 0 0 15px var(--gold-glow);
        display: inline-block;
      }

      /* Papyrus Scroll card style */
      .eg-papyrus-card {
        background-color: var(--papyrus);
        border: 2px solid #c5b49f;
        box-shadow: 
          5px 5px 0px #8c7b67,
          0 10px 20px rgba(0,0,0,0.5);
        color: var(--text-dark);
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }
      .eg-papyrus-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 6px;
        background: repeating-linear-gradient(90deg, #c5b49f, #c5b49f 10px, #b4a28d 10px, #b4a28d 20px);
      }

      /* Hieroglyphic character lines */
      .eg-glyph-divider {
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.3em;
        color: var(--gold);
        opacity: 0.7;
        text-shadow: 0 0 4px var(--gold-glow);
        text-align: center;
        user-select: none;
      }

      /* Obelisk style timeline node */
      .eg-obelisk-node {
        border-left: 2px dashed var(--gold);
        position: relative;
        padding-left: 24px;
      }
      .eg-obelisk-node::before {
        content: '𓉶';
        position: absolute;
        left: -10px;
        top: -2px;
        background: var(--basalt);
        color: var(--gold);
        font-size: 1.1rem;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Rosetta stone rotation animations */
      @keyframes eg-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .eg-stone-spin {
        animation: eg-spin 20s linear infinite;
      }

      /* Custom scroll bar */
      .eg-root::-webkit-scrollbar {
        width: 10px;
      }
      .eg-root::-webkit-scrollbar-track {
        background: var(--basalt);
      }
      .eg-root::-webkit-scrollbar-thumb {
        background: var(--gold);
        border: 2px solid var(--basalt);
        border-radius: 5px;
      }
    `}</style>
  );
}

/* ── Section Heading ───────────────────────────────────────────── */
function SectionHeading({ title, glyphKey, decoded }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const label = decoded ? title : GLYPHS_MAP[glyphKey] || '𓋹 𓆣 𓁹';

  return (
    <div ref={ref} className="text-center mb-12">
      <div className="eg-glyph-divider text-xs mb-3">𓋹 𓆣 𓁹 𓃠 𓅓 𓆗</div>
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-extrabold tracking-widest text-gold uppercase"
      >
        {label}
      </motion.h2>
      <div className="w-16 h-0.5 bg-gold mx-auto mt-4 shadow-[0_0_8px_var(--gold)]" />
    </div>
  );
}

export default function EmojiOnlyHieroglyphicUI() {
  const { portfolioData } = usePortfolio();
  const [decoded, setDecoded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Contact Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const contactTimerRef = useRef(null);

  // Clear contact timer on unmount
  useEffect(() => {
    return () => {
      if (contactTimerRef.current) {
        clearTimeout(contactTimerRef.current);
      }
    };
  }, []);

  // Monitor Scroll for Go-To-Top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const data = portfolioData || dummyData;

  const handleRosettaToggle = () => {
    setDecoded(prev => !prev);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    if (contactTimerRef.current) {
      clearTimeout(contactTimerRef.current);
    }
    contactTimerRef.current = setTimeout(() => {
      setFormSent(false);
      setFormState({ name: '', email: '', message: '' });
    }, 3000);
  };

  // Nav list items with emojis
  const navItems = [
    { id: 'about', emoji: '👤', name: 'About' },
    { id: 'skills', emoji: '🧱', name: 'Skills' },
    { id: 'projects', emoji: '📦', name: 'Projects' },
    { id: 'experience', emoji: '⏳', name: 'Experience' },
    { id: 'testimonials', emoji: '🤝', name: 'Reviews' },
    { id: 'contact', emoji: '📞', name: 'Contact' },
  ];

  return (
    <div className="eg-root eg-sand relative min-h-screen">
      <HieroglyphicStyles />

      {/* ── Fixed Rosetta Stone Decoder Button ──────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1">
        <motion.button
          onClick={handleRosettaToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-700 border-2 border-gold flex items-center justify-center cursor-pointer shadow-[0_0_20px_var(--gold-glow)] relative overflow-hidden group"
          title={decoded ? "Activate Hieroglyphs Mode" : "Activate Rosetta Stone Translation"}
          aria-label={decoded ? "Activate Hieroglyphs Mode" : "Activate Rosetta Stone Translation"}
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
          
          {/* Rosetta Stone Glyphs Amulet */}
          <div className={`w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-black/40 text-2xl eg-stone-spin`}>
            𓆣
          </div>
          
          {/* Absolute Center Emoji */}
          <div className="absolute text-xl font-bold">
            {decoded ? '𓋹' : '🔍'}
          </div>
        </motion.button>
        <span className="bg-black/80 px-2 py-0.5 border border-gold/30 rounded text-[9px] font-mono tracking-widest text-gold uppercase shadow">
          {decoded ? 'Translate 𓆣' : 'Decode 🔤'}
        </span>
      </div>

      {/* ── Go To Top ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-lg bg-basalt-alt border border-gold/40 flex items-center justify-center text-gold cursor-pointer hover:border-gold hover:bg-basalt transition-all shadow"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Header / Navbar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-basalt/90 border-b border-gold/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded border border-gold flex items-center justify-center text-gold bg-lapis">
              𓋹
            </div>
            <span className="font-mono text-xs tracking-widest font-bold text-gold uppercase hidden sm:inline">
              {decoded ? data.personal?.name?.split(' ')[0] : '𓀀 𓋹 𓆣'}
            </span>
          </div>

          <nav className="flex items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-gold/10 text-gold/90 hover:text-gold cursor-pointer"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="hidden md:inline font-mono text-xs tracking-wider uppercase">
                  {decoded ? item.name : translateToHieroglyphs(item.name).slice(0, 3)}
                </span>
                
                {/* Popover helper translation */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-basalt border border-gold/30 rounded py-1 px-2.5 text-[9px] font-mono tracking-widest text-gold uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                  {decoded ? translateToHieroglyphs(item.name) : item.name}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════
          HERO SECTION
         ═════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-gold/15 flex flex-col items-center justify-center min-h-[85vh] text-center">
        {/* Dynamic Decorative Pyramids */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-basalt-alt to-transparent pointer-events-none z-0" />
        
        {/* Ancient symbols backdrop */}
        <div className="absolute top-1/4 opacity-[0.03] select-none text-[12vw] tracking-widest font-mono pointer-events-none z-0">
          𓋹 𓆣 𓁹 𓃠 𓅓 𓆗 𓇳
        </div>

        <div className="max-w-3xl relative z-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gold/5 border border-gold/25 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_10px_rgba(212,175,55,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-gold uppercase">
              {decoded ? 'Available For Adventure' : '𓇳 𓋹 🟢'}
            </span>
          </motion.div>

          {/* Cartouche Name */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="eg-cartouche mb-6"
          >
            <h1 className="text-3xl sm:text-5xl font-black text-gold tracking-widest uppercase">
              {decoded ? data.personal?.name : translateToHieroglyphs(data.personal?.name)}
            </h1>
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl font-bold tracking-widest text-gold/80 mb-6 font-mono uppercase"
          >
            {decoded ? data.personal?.title : translateToHieroglyphs(data.personal?.title)}
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm sm:text-base text-text-muted italic max-w-lg mx-auto leading-relaxed mb-10 font-sans"
          >
            &ldquo;{decoded ? data.personal?.tagline : translateToHieroglyphs(data.personal?.tagline)}&rdquo;
          </motion.p>

          {/* Stats Obelisk Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10"
          >
            {[
              { key: 'yearsExperience', label: 'Years Exp', glyph: 'years', value: data.stats?.yearsExperience ?? '5+' },
              { key: 'projectsCompleted', label: 'Artifacts', glyph: 'projectsCompleted', value: data.stats?.projectsCompleted ?? '48+' },
              { key: 'happyClients', label: 'Fans/Allies', glyph: 'happyClients', value: data.stats?.happyClients ?? '32+' },
            ].map((stat) => (
              <div
                key={stat.key}
                className="bg-basalt-alt border border-gold/20 rounded-xl p-4 flex flex-col justify-center items-center shadow-lg relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl sm:text-2xl font-black text-gold font-mono">{stat.value}</span>
                <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase mt-1">
                  {decoded ? stat.label : GLYPHS_MAP[stat.glyph]?.split(' ')[0]}
                </span>
                
                {/* Micro-hover label help */}
                <div className="absolute top-1 right-1 opacity-20 text-[10px] group-hover:opacity-80 transition-opacity font-mono">
                  {decoded ? GLYPHS_MAP[stat.glyph]?.split(' ')[0] : stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-gold hover:bg-yellow-500 text-basalt font-extrabold text-xs tracking-widest uppercase px-6 py-3 rounded-md cursor-pointer hover:shadow-[0_0_15px_var(--gold-glow)] transition-all"
            >
              {decoded ? 'View Artifacts' : '𓆣 🗳️'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="border border-gold text-gold hover:bg-gold/10 font-extrabold text-xs tracking-widest uppercase px-6 py-3 rounded-md cursor-pointer transition-all"
            >
              {decoded ? 'Send Message' : '𓅓 ✉️'}
            </button>
          </motion.div>
        </div>

        {/* Scroll cues */}
        <div className="absolute bottom-6 flex flex-col items-center gap-1.5 text-gold/40 text-xs font-mono tracking-wider animate-bounce select-none">
          <span>SCROLL</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          ABOUT SECTION (IDENTITY SCROLL)
         ═════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 px-4 max-w-5xl mx-auto border-b border-gold/15">
        <SectionHeading title="Identity Scroll" glyphKey="about" decoded={decoded} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Avatar Egyptian Frame */}
          <div className="flex flex-col items-center">
            <div className="relative p-2.5 bg-basalt-alt border-2 border-gold rounded-lg shadow-xl shadow-black/80 max-w-[240px] w-full">
              {/* Corner glyph decorations */}
              <div className="absolute top-1 left-1 text-[10px] text-gold/50">𓋹</div>
              <div className="absolute top-1 right-1 text-[10px] text-gold/50">𓆣</div>
              <div className="absolute bottom-1 left-1 text-[10px] text-gold/50">𓁹</div>
              <div className="absolute bottom-1 right-1 text-[10px] text-gold/50">𓃠</div>
              
              <div className="aspect-[3/4] overflow-hidden rounded border border-gold/30 bg-basalt">
                {data.personal?.avatar ? (
                  <img
                    src={data.personal.avatar}
                    alt={data.personal.name}
                    className="w-full h-full object-cover grayscale contrast-[1.1] sepia-[0.3]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gold font-mono">
                    𓀀
                  </div>
                )}
              </div>
            </div>

            {/* Social handles formatted like cartouches */}
            <div className="flex justify-center gap-3 mt-6">
              {[
                { url: data.socials?.github, icon: Github, col: '#f3dfa2', name: 'github' },
                { url: data.socials?.linkedin, icon: Linkedin, col: '#0f2b5c', name: 'linkedin' },
                { url: data.socials?.twitter, icon: Twitter, col: '#38A0C0', name: 'twitter' },
                { url: data.socials?.email ? `mailto:${data.socials.email}` : null, icon: Mail, col: '#d4af37', name: 'email' },
              ].filter(s => s.url).map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-basalt-alt text-gold hover:border-gold hover:text-white transition-all shadow group relative"
                  aria-label={s.name}
                >
                  <s.icon size={15} />
                  
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 bg-basalt border border-gold/30 rounded py-0.5 px-2 text-[9px] font-mono tracking-widest text-gold uppercase opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                    {decoded ? s.name : GLYPHS_MAP[s.name]}
                  </span>
                </a>
              ))}
            </div>

            {data.personal?.location && (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted font-mono uppercase tracking-wider">
                <MapPin size={11} className="text-gold" />
                <span>{decoded ? data.personal.location : translateToHieroglyphs(data.personal.location)}</span>
              </div>
            )}
          </div>

          {/* Bio Scroll */}
          <div className="md:col-span-2">
            <div className="eg-papyrus-card p-6 sm:p-8">
              {/* Hieroglyphic watermarks */}
              <div className="absolute top-2 right-2 text-text-dark/15 text-2xl select-none font-mono">𓁹 📜</div>
              
              <h3 className="font-bold text-xl mb-4 text-text-dark border-b border-text-dark/10 pb-2 uppercase tracking-wide">
                {decoded ? 'Tome of the Creator' : '𓀀 📜 𓋹'}
              </h3>
              <p className="text-sm leading-relaxed text-text-dark/95 font-sans whitespace-pre-line">
                {decoded ? data.personal?.bio : translateToHieroglyphs(data.personal?.bio)}
              </p>

              {/* Decorative signature-like cartouche */}
              <div className="flex justify-end mt-6">
                <div className="border border-text-dark/30 rounded-full px-4 py-1 text-[10px] font-mono tracking-widest text-text-dark/70 uppercase">
                  {decoded ? data.personal?.name : '𓀀 𓋹 𓆣'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SKILLS SECTION (VU METERS OF POWER)
         ═════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-24 px-4 bg-basalt-alt border-b border-gold/15">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="VU Meters of Power" glyphKey="skills" decoded={decoded} />

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
              (data.skills || []).reduce((acc, curr) => {
                const cat = curr.category || 'Core';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(curr);
                return acc;
              }, {})
            ).map(([category, list], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-basalt border border-gold/15 rounded-xl p-5 shadow-lg group hover:border-gold/30 transition-all"
              >
                {/* Header Category Cartouche */}
                <div className="flex items-center justify-between border-b border-gold/15 pb-3 mb-4">
                  <span className="font-mono text-xs tracking-widest text-gold uppercase font-bold">
                    {decoded ? category : GLYPHS_MAP[category.toLowerCase()] || translateToHieroglyphs(category)}
                  </span>
                  <div className="text-xs opacity-50 font-mono">𓋹</div>
                </div>

                {/* Skill Bars */}
                <div className="space-y-4">
                  {list.map((skill, sidx) => (
                    <div key={sidx}>
                      <div className="flex justify-between text-xs font-mono mb-1 text-gold/80">
                        <span className="tracking-wide">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      
                      {/* Pyramid Brick Bar */}
                      <div className="h-5 bg-black/50 border border-gold/20 rounded overflow-hidden p-0.5 flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, bIdx) => {
                          const active = skill.level >= (bIdx + 1) * 10;
                          return (
                            <motion.div
                              key={bIdx}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: sidx * 0.05 + bIdx * 0.03 }}
                              className={`flex-1 rounded-sm ${
                                active
                                  ? 'bg-gradient-to-t from-yellow-600 to-gold shadow-[0_0_4px_var(--gold-glow)]'
                                  : 'bg-gold/5 border border-gold/5'
                              }`}
                              style={{ transformOrigin: 'bottom' }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          PROJECTS SECTION (TREASURE VAULT)
         ═════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 px-4 max-w-6xl mx-auto border-b border-gold/15">
        <SectionHeading title="Treasure Vault" glyphKey="projects" decoded={decoded} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects || []).map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-basalt-alt border border-gold/15 rounded-xl overflow-hidden hover:border-gold/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Image Frame */}
              <div className="relative aspect-video overflow-hidden border-b border-gold/10 bg-basalt">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500 opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gold/30 font-mono">
                    𓆣
                  </div>
                )}
                {/* Tech stack badge list */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {(project.techStack || []).slice(0, 3).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-basalt/90 border border-gold/30 text-gold text-[9px] font-mono px-2 py-0.5 rounded shadow"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-gold font-mono font-bold text-base mb-2 flex items-center justify-between gap-2">
                    <span>{decoded ? project.title : translateToHieroglyphs(project.title)}</span>
                    <span className="text-gold/30 text-xs font-mono">𓏏</span>
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed font-sans line-clamp-3">
                    {decoded ? project.description : translateToHieroglyphs(project.description)}
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gold/10 text-gold text-xs font-mono">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Github size={12} />
                      <span>{decoded ? 'Code' : '𓆗'}</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>{decoded ? 'Tome' : '𓋹'}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          EXPERIENCE SECTION (CHRONOLOGY OBELISK)
         ═════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-24 px-4 bg-basalt-alt border-b border-gold/15">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Chronology Obelisk" glyphKey="experience" decoded={decoded} />

          <div className="space-y-8 pl-4">
            {(data.experience || []).map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="eg-obelisk-node"
              >
                <div className="bg-basalt border border-gold/10 hover:border-gold/30 transition-all rounded-xl p-6 shadow-md relative overflow-hidden group">
                  <div className="absolute top-2 right-2 text-gold/5 font-mono text-5xl pointer-events-none">𓀔</div>

                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-gold font-mono font-bold text-base">
                        {decoded ? exp.role : translateToHieroglyphs(exp.role)}
                      </h3>
                      <span className="text-yellow-600/80 font-mono text-xs tracking-wider">
                        {decoded ? exp.company : translateToHieroglyphs(exp.company)}
                      </span>
                    </div>

                    <span className="bg-basalt-alt border border-gold/20 text-gold text-xs font-mono px-3 py-1 rounded-full shadow">
                      {decoded ? exp.period : translateToHieroglyphs(exp.period)}
                    </span>
                  </div>

                  <div className="h-px bg-gold/10 mb-4" />
                  
                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-sans">
                    {decoded ? exp.description : translateToHieroglyphs(exp.description)}
                  </p>

                  <div className="flex items-center gap-1.5 mt-4">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-yellow-500 shadow-[0_0_8px_var(--gold-glow)]' : 'bg-gold/30'}`} />
                    <span className="text-[10px] font-mono text-gold/60 tracking-wider uppercase">
                      {idx === 0 ? (decoded ? 'Active Campaign' : '𓇳 𓋹') : (decoded ? 'Archived Inscription' : '𓏏')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION (SCRIBES' TESTAMENTS)
         ═════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-4 max-w-5xl mx-auto border-b border-gold/15">
        <SectionHeading title="Scribes' Testaments" glyphKey="testimonials" decoded={decoded} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="eg-papyrus-card p-6 flex flex-col justify-between"
            >
              <div>
                {/* Decorative Hieroglyph quote */}
                <div className="text-text-dark/15 text-5xl font-mono leading-none select-none">𓁹</div>
                <p className="text-xs sm:text-sm leading-relaxed text-text-dark italic font-sans mt-2 mb-6">
                  &ldquo;{decoded ? t.text : translateToHieroglyphs(t.text)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-text-dark/10">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-text-dark/30 grayscale contrast-110"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-text-dark/10 border border-text-dark/30 flex items-center justify-center text-text-dark/70 font-mono text-sm font-bold">
                    𓀀
                  </div>
                )}
                <div>
                  <div className="text-text-dark font-bold text-xs uppercase tracking-wide">
                    {decoded ? t.name : translateToHieroglyphs(t.name)}
                  </div>
                  <div className="text-text-dark/60 font-mono text-[9px] tracking-wider uppercase mt-0.5">
                    {decoded ? t.role : translateToHieroglyphs(t.role)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          CONTACT SECTION (MESSAGE SCROLL)
         ═════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-4 bg-basalt-alt">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Contact Inscription" glyphKey="contact" decoded={decoded} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Context Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-gold font-mono font-bold text-2xl mb-4 leading-tight">
                {decoded ? 'Inscribe a scroll.' : '𓅓 ✉️ 𓏲'}
              </h3>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                {decoded
                  ? 'Send a messenger owl. Propose alliance, projects, or hire Scribes to design artifacts.'
                  : '𓅓 ✉️ 𓏲 Propose alliance 𓀠 👥 🤝 or design artifacts 𓆣 🗳️.'}
              </p>

              <div className="flex flex-col gap-3 font-mono text-xs text-gold/80 mb-6">
                {data.socials?.email && (
                  <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <Mail size={12} className="text-gold" />
                    <span>{decoded ? data.socials.email : translateToHieroglyphs(data.socials.email)}</span>
                  </a>
                )}
                {data.socials?.github && (
                  <a href={data.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Github size={12} className="text-gold" />
                    <span>{decoded ? 'GitHub' : '𓆗'}</span>
                  </a>
                )}
                {data.socials?.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Linkedin size={12} className="text-gold" />
                    <span>{decoded ? 'LinkedIn' : '𓀔'}</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Form Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-basalt border border-gold/15 rounded-xl p-6 shadow-xl relative overflow-hidden">
                {/* Papyrus-like form field borders */}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="scribe-name" className="text-[10px] font-mono tracking-widest text-gold block mb-1 uppercase">
                      {decoded ? 'Scribe Name (--name)' : '𓀀 Name'}
                    </label>
                    <input
                      id="scribe-name"
                      type="text"
                      required
                      placeholder={decoded ? "Your name..." : "𓀀 ..."}
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-basalt-alt border border-gold/20 rounded px-3 py-2 text-xs font-sans text-gold focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="signal-email" className="text-[10px] font-mono tracking-widest text-gold block mb-1 uppercase">
                      {decoded ? 'Signal Frequency (--email)' : '𓅓 Email'}
                    </label>
                    <input
                      id="signal-email"
                      type="email"
                      required
                      placeholder={decoded ? "Your email..." : "𓅓 ..."}
                      value={formState.email}
                      onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-basalt-alt border border-gold/20 rounded px-3 py-2 text-xs font-sans text-gold focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="inscription-message" className="text-[10px] font-mono tracking-widest text-gold block mb-1 uppercase">
                      {decoded ? 'Inscription Scroll (--message)' : '📜 Message'}
                    </label>
                    <textarea
                      id="inscription-message"
                      required
                      rows={4}
                      placeholder={decoded ? "Write scroll..." : "📜 ..."}
                      value={formState.message}
                      onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-basalt-alt border border-gold/20 rounded px-3 py-2 text-xs font-sans text-gold focus:border-gold outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded text-xs font-mono font-bold tracking-widest uppercase cursor-pointer border flex items-center justify-center gap-2 transition-all ${
                      formSent
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-gold border-gold text-basalt hover:bg-yellow-500'
                    }`}
                  >
                    {formSent ? (
                      <>
                        <CheckCircle size={14} />
                        <span>{decoded ? 'Inscribed!' : '𓏏 Sent!'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>{decoded ? 'Inscribe Scroll' : '𓅓 Send Scroll'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-basalt border-t border-gold/20 py-8 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
            © {new Date().getFullYear()} {decoded ? data.personal?.name : translateToHieroglyphs(data.personal?.name)}
          </div>
          
          {/* Scroll footer decoration glyphs */}
          <div className="font-mono text-xs text-gold/40 select-none">
            𓋹 𓆣 𓁹 𓃠 𓅓 𓆗 𓇳
          </div>
          
          <div className="text-[10px] font-mono text-gold/60 tracking-widest uppercase">
            {decoded ? 'Designed by Antigravity' : '𓀀 Antigravity'}
          </div>
        </div>
      </footer>
    </div>
  );
}
