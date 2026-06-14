import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  Star,
  Briefcase,
  Send,
  ChevronDown,
  Lock,
  Search
} from 'lucide-react';

// Wand element SVG
const MagicWandSVG = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 85C13 83 13 80 15 78L78 15C80 13 83 13 85 15C87 17 87 20 85 22L22 85C20 87 17 87 15 85Z" fill="#5c3a21" stroke="#3d2514" strokeWidth="2" />
    <path d="M78 15C76 17 78 20 80 22C82 24 85 22 85 20C85 18 82 18 78 15Z" fill="#d4af37" />
    <circle cx="85" cy="15" r="3" fill="#fff" className="animate-ping" />
  </svg>
);

// Footprint SVG pair component
const FootprintPair = ({ className = '', delay = 0, angle = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className={`absolute flex gap-3 pointer-events-none ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {/* Left foot */}
      <svg width="8" height="18" viewBox="0 0 8 18" fill="none" className="text-[#5c1d1d] opacity-60">
        <path d="M5.5 1C3.5 1 2 2.5 1.5 4.5C1 6.5 2 9.5 3.5 11C4.5 12 5 14 5 15C5 16 4.5 17 3.5 17C3 17 2.5 16.5 2.5 16C2.5 15.5 2 15 1 15C0.5 15 0 15.5 0 16C0 17 1 18 3 18C5 18 7 16.5 7 14.5C7 12.5 6 10.5 5 9C4 7.5 3.5 6 4 4.5C4.5 3 5.5 2 6.5 2C7 2 7.5 1.5 7.5 1C7.5 0.5 7 1 5.5 1Z" fill="currentColor" />
      </svg>
      {/* Right foot (offset slightly) */}
      <motion.svg
        initial={{ y: 0 }}
        animate={{ y: [0, 4, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: delay + 0.2 }}
        width="8"
        height="18"
        viewBox="0 0 8 18"
        fill="none"
        className="text-[#5c1d1d] opacity-60 mt-2 ml-1"
      >
        <path d="M2.5 1C4.5 1 6 2.5 6.5 4.5C7 6.5 6 9.5 4.5 11C3.5 12 3 14 3 15C3 16 3.5 17 4.5 17C5 17 5.5 16.5 5.5 16C5.5 15.5 6 15 7 15C7.5 15 8 15.5 8 16C8 17 7 18 5 18C3 18 1 16.5 1 14.5C1 12.5 2 10.5 3 9C4 7.5 4.5 6 4 4.5C3.5 3 2.5 2 1.5 2C1 2 0.5 1.5 0.5 1C0.5 0.5 1 1 2.5 1Z" fill="currentColor" />
      </motion.svg>
    </motion.div>
  );
};

// Hogwarts Castle Crest Silhouette
const HogwartsCrest = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.15">
    <path d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" />
    <path d="M50 10 L50 90" />
    <path d="M20 50 L80 50" />
    <circle cx="50" cy="50" r="25" />
    <text x="32" y="42" fontSize="10" fontFamily="serif" fill="currentColor">G</text>
    <text x="62" y="42" fontSize="10" fontFamily="serif" fill="currentColor">S</text>
    <text x="32" y="70" fontSize="10" fontFamily="serif" fill="currentColor">H</text>
    <text x="62" y="70" fontSize="10" fontFamily="serif" fill="currentColor">R</text>
  </svg>
);

export default function HogwartsMaraudersMap({ portfolioData }) {
  const context = usePortfolio();
  const data = portfolioData || context?.portfolioData;
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Load wizarding fonts from Google Fonts dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=IM+Fell+DW+Pica:ital@0;1&family=MedievalSharp&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#1c120c] text-[#d4af37] flex items-center justify-center font-serif">
        <div className="text-center p-8 border border-[#d4af37]/30 rounded-lg bg-[#2b1b11]">
          <Compass className="animate-spin w-12 h-12 mx-auto mb-4 text-[#d4af37]" />
          <p className="text-lg">Locating magical signature...</p>
        </div>
      </div>
    );
  }

  const { personal = {}, skills = [], experience = [], projects = [], testimonials = [], socials = {} } = data;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleClose = () => {
    setIsRevealed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const skillCategories = [...new Set(skills.map((s) => s.category || s.type || 'Spells'))];

  return (
    <div
      className="min-h-screen text-[#4a2e1e] overflow-x-hidden selection:bg-[#5c1d1d] selection:text-[#f7f0df]"
      style={{
        backgroundColor: '#f6ebd4',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(248, 240, 218, 0.15) 0%, rgba(230, 215, 185, 0.35) 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
        fontFamily: "'IM Fell DW Pica', Georgia, serif"
      }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          // Folded/Closed Cover Screen
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
          >
            {/* Castle crest silhouette in background */}
            <HogwartsCrest className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] text-[#5c1d1d] opacity-15 pointer-events-none" />

            {/* Random Footprints Walking on Cover */}
            <FootprintPair className="top-[15%] left-[20%]" delay={0.5} angle={45} />
            <FootprintPair className="top-[45%] right-[25%]" delay={2.5} angle={-30} />
            <FootprintPair className="bottom-[20%] left-[35%]" delay={1.5} angle={90} />

            {/* Main Folded Scroll Wrapper */}
            <div className="w-full max-w-xl border-4 border-double border-[#5c1d1d]/40 rounded-xl p-8 md:p-12 text-center bg-[#fdfaf2] shadow-2xl relative">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#5c1d1d] opacity-40 font-serif">✥</div>
              <div className="absolute top-2 right-2 text-[#5c1d1d] opacity-40 font-serif">✥</div>
              <div className="absolute bottom-2 left-2 text-[#5c1d1d] opacity-40 font-serif">✥</div>
              <div className="absolute bottom-2 right-2 text-[#5c1d1d] opacity-40 font-serif">✥</div>

              <h2 className="text-xl md:text-2xl uppercase tracking-widest text-[#5c1d1d] mb-8 font-semibold opacity-80" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                Messrs. Moony, Wormtail, Padfoot, & Prongs
              </h2>
              <p className="text-sm italic text-[#7c5c43] mb-2">are proud to present</p>
              
              <div className="w-16 h-0.5 bg-[#5c1d1d]/30 mx-auto mb-6" />

              <h1 className="text-4xl md:text-5xl font-black text-[#5c1d1d] tracking-normal mb-8" style={{ fontFamily: "'Cinzel Decorative', serif", lineHeight: '1.2' }}>
                THE PORTFOLIO OF <br/>
                <span className="text-[#8c1d1d] underline decoration-double decoration-[#d4af37]">{personal.name || 'AN ACCOMPLISHED WIZARD'}</span>
              </h1>

              <div className="w-24 h-24 mx-auto mb-10 relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5c1d1d]/30 animate-spin" style={{ animationDuration: '20s' }} />
                <Compass className="w-16 h-16 text-[#5c1d1d]/70 absolute inset-0 m-auto" />
              </div>

              <p className="text-lg text-[#5c1d1d] italic font-semibold mb-6">
                "This map is blank. Tap the wand to reveal."
              </p>

              {/* Magical Wand Activation Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReveal}
                className="group relative inline-flex flex-col items-center justify-center p-4 bg-[#5c1d1d] hover:bg-[#802222] text-[#f7f0df] border-2 border-[#d4af37] rounded-lg transition-all duration-300 shadow-xl"
              >
                <MagicWandSVG className="w-16 h-16 mb-2 transform group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm tracking-wider uppercase" style={{ fontFamily: "'MedievalSharp', serif" }}>
                  I solemnly swear that I am up to no good
                </span>
                <Sparkles className="absolute -top-2 -right-2 text-[#d4af37] w-6 h-6 animate-pulse" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // Unfolded / Revealed Map Layout
          <motion.div
            key="opened"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen"
          >
            {/* Custom Sticky Header resembling a magical banner */}
            <header className="sticky top-0 z-50 bg-[#fbf6eb]/90 backdrop-blur-sm border-b-2 border-double border-[#5c1d1d]/20 px-4 py-3 shadow-md">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xl font-bold tracking-wider text-[#5c1d1d] cursor-pointer hover:opacity-80" style={{ fontFamily: "'Cinzel Decorative', serif" }} onClick={handleClose}>
                  {personal.name?.toUpperCase()}'S MAP
                </span>
                <nav className="flex flex-wrap justify-center gap-2 md:gap-4">
                  {[
                    { id: 'hero', label: 'The Gates' },
                    { id: 'about', label: "Headmaster's Study" },
                    { id: 'skills', label: 'Spellbook' },
                    { id: 'projects', label: 'Requirement Room' },
                    { id: 'experience', label: 'Daily Prophet' },
                    { id: 'contact', label: 'Owl Post' }
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 text-sm rounded border transition-all duration-200 ${
                        activeSection === sec.id
                          ? 'bg-[#5c1d1d] text-[#f7f0df] border-[#d4af37]'
                          : 'border-transparent hover:border-[#5c1d1d]/30 text-[#5c1d1d] hover:bg-[#5c1d1d]/5'
                      }`}
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      {sec.label}
                    </button>
                  ))}
                </nav>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-24 relative">
              
              {/* Floating footprints connecting sections */}
              <FootprintPair className="top-[12%] left-[45%]" delay={0.2} angle={90} />
              <FootprintPair className="top-[25%] right-[20%]" delay={1.8} angle={15} />
              <FootprintPair className="top-[38%] left-[15%]" delay={3.2} angle={-60} />
              <FootprintPair className="top-[55%] right-[40%]" delay={0.9} angle={180} />
              <FootprintPair className="top-[70%] left-[30%]" delay={2.5} angle={120} />
              <FootprintPair className="bottom-[10%] right-[25%]" delay={4.0} angle={45} />

              {/* 1. Hero / Entrance Section */}
              <section id="hero" className="min-h-[70vh] flex flex-col items-center justify-center text-center relative scroll-mt-20">
                <HogwartsCrest className="absolute w-[60vw] h-[60vw] max-w-[500px] text-[#5c1d1d] opacity-10 pointer-events-none" />
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="max-w-2xl bg-[#fdfaf2]/40 backdrop-blur-xs p-8 rounded-xl border border-[#5c1d1d]/20 relative"
                >
                  <Compass className="w-12 h-12 text-[#5c1d1d] mx-auto mb-6 animate-pulse" />
                  
                  <p className="text-[#5c1d1d] text-sm uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Welcome to the Inner Chamber of
                  </p>
                  
                  <h1 className="text-5xl md:text-7xl font-extrabold text-[#5c1d1d] mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    {personal.name}
                  </h1>

                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#5c1d1d] to-transparent mx-auto mb-6" />

                  <p className="text-2xl md:text-3xl text-[#8c1d1d] italic mb-6">
                    {personal.title}
                  </p>

                  <div className="inline-flex items-center gap-2 text-sm text-[#7c5c43] bg-[#fbf6eb] px-4 py-2 rounded-full border border-[#5c1d1d]/10 mb-6">
                    <MapPin className="w-4 h-4 text-[#5c1d1d]" />
                    <span>{personal.location || 'Hogwarts, Highlands'}</span>
                  </div>

                  <p className="text-lg md:text-xl text-[#4a2e1e] leading-relaxed max-w-lg mx-auto border-t border-b border-dashed border-[#5c1d1d]/20 py-4 my-2">
                    "{personal.tagline || 'Working spells, creating digital artifacts, and exploring hidden chambers.'}"
                  </p>
                </motion.div>
                
                <ChevronDown className="w-8 h-8 text-[#5c1d1d] animate-bounce mt-12 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} />
              </section>

              {/* 2. About Me - Headmaster's Study */}
              <section id="about" className="scroll-mt-20">
                <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg relative">
                  <div className="absolute top-4 right-4 opacity-15">
                    <BookOpen className="w-24 h-24 text-[#5c1d1d]" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-[#5c1d1d] mb-6 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    <span>I. The Headmaster's Study</span>
                  </h2>

                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Avatar Frame resembling a magical portrait */}
                    <div className="flex justify-center">
                      <div className="relative p-3 bg-[#e6d7b9] rounded-lg shadow-xl border-4 border-[#5c1d1d] max-w-[220px]">
                        {/* Golden portrait plaque */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#5c1d1d] font-bold text-xs px-3 py-0.5 rounded border border-[#5c1d1d] shadow-sm uppercase whitespace-nowrap" style={{ fontFamily: "'MedievalSharp', serif" }}>
                          Active Portrait
                        </div>
                        <div className="w-44 h-44 overflow-hidden rounded border-2 border-[#5c1d1d]/40 bg-[#fbf6eb]">
                          {personal.avatar ? (
                            <img
                              src={personal.avatar}
                              alt={personal.name}
                              className="w-full h-full object-cover grayscale contrast-125"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-[#5c1d1d]/30 bg-[#5c1d1d]/5">
                              {personal.name ? personal.name[0] : 'W'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio details */}
                    <div className="md:col-span-2 space-y-6">
                      <h3 className="text-xl font-bold text-[#8c1d1d] italic">"The wand chooses the wizard, and a coder chooses their stack..."</h3>
                      <p className="text-lg leading-relaxed text-[#4a2e1e] whitespace-pre-line">
                        {personal.bio || 'Enter a bio to reveal details of your magical journey through software engineering.'}
                      </p>
                      
                      {/* Magical Stats / Achievements */}
                      {data.stats && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-[#5c1d1d]/20">
                          {[
                            { label: 'Years Experience', value: data.stats.yearsExperience || '0' },
                            { label: 'Artifacts Created', value: data.stats.projectsCompleted || '0' },
                            { label: 'Wizard Commits', value: data.stats.happyClients || '0' }
                          ].map((stat, idx) => (
                            <div key={idx} className="text-center p-3 border border-[#5c1d1d]/15 bg-[#fbf6eb] rounded-lg shadow-xs">
                              <span className="block text-2xl md:text-3xl font-black text-[#5c1d1d]" style={{ fontFamily: "'MedievalSharp', serif" }}>{stat.value}</span>
                              <span className="block text-xs uppercase text-[#7c5c43] tracking-wide mt-1">{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Skills - The Spellbook & Potions Lab */}
              <section id="skills" className="scroll-mt-20">
                <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    <span>II. The Spellbook & Magical Aptitude</span>
                  </h2>

                  <div className="space-y-8">
                    {skillCategories.length === 0 ? (
                      <p className="text-center text-lg italic text-[#7c5c43]">Your spellbook is currently empty. Add skills to reveal spells.</p>
                    ) : (
                      skillCategories.map((cat) => (
                        <div key={cat} className="space-y-4">
                          <h3 className="text-xl font-bold text-[#5c1d1d] flex items-center gap-2" style={{ fontFamily: "'MedievalSharp', serif" }}>
                            <Sparkles className="w-5 h-5 text-[#d4af37]" />
                            <span className="underline decoration-dotted decoration-[#5c1d1d]/40">{cat}</span>
                          </h3>

                          <div className="grid md:grid-cols-2 gap-6">
                            {skills
                              .filter((s) => (s.category || s.type || 'Spells') === cat)
                              .map((skill, i) => (
                                <div key={i} className="p-4 border border-[#5c1d1d]/15 bg-[#fbf6eb] rounded-lg shadow-xs hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-[#5c1d1d] text-lg">{skill.name}</span>
                                    <span className="text-sm font-semibold text-[#8c1d1d]" style={{ fontFamily: "'MedievalSharp', serif" }}>
                                      {skill.level || `${skill.rating || 80}%`}
                                    </span>
                                  </div>
                                  
                                  {/* Progress bar styled like a gold-mana spell bar */}
                                  <div className="w-full h-3 bg-[#e6d7b9] rounded-full overflow-hidden border border-[#5c1d1d]/20 p-0.5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${skill.rating || (skill.level === 'Expert' ? 95 : skill.level === 'Advanced' ? 85 : 70)}%` }}
                                      transition={{ duration: 1, delay: i * 0.05 }}
                                      className="h-full bg-gradient-to-r from-[#8c1d1d] to-[#d4af37] rounded-full"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* 4. Projects - The Room of Requirement */}
              <section id="projects" className="scroll-mt-20">
                <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    <span>III. Room of Requirement: Digital Artifacts</span>
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    {projects.length === 0 ? (
                      <p className="text-center md:col-span-2 text-lg italic text-[#7c5c43]">The room remains quiet. No artifacts have materialized yet.</p>
                    ) : (
                      projects.map((project, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -5 }}
                          className="flex flex-col border border-[#5c1d1d]/20 bg-[#fbf6eb] rounded-lg overflow-hidden shadow-md group hover:border-[#8c1d1d]/40 transition-all duration-300"
                        >
                          {/* Project Image resembling a canvas portal */}
                          <div className="relative h-44 bg-[#e6d7b9] overflow-hidden border-b border-[#5c1d1d]/20">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#5c1d1d]/40">
                                <Search className="w-12 h-12 stroke-[1]" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-[#5c1d1d] text-[#f7f0df] text-xs px-2 py-0.5 rounded border border-[#d4af37] font-semibold uppercase tracking-wider" style={{ fontFamily: "'MedievalSharp', serif" }}>
                              {project.status || 'Active'}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-6 flex flex-col flex-1 gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-[#5c1d1d] mb-2">{project.title}</h3>
                              <p className="text-[#4a2e1e] leading-relaxed text-base italic">
                                {project.description}
                              </p>
                            </div>

                            {/* Tech stack tags styled as potion ingredient components */}
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {(project.techStack || project.technologies || []).map((tech) => (
                                <span key={tech} className="text-xs px-2.5 py-1 rounded bg-[#e6d7b9]/40 border border-[#5c1d1d]/20 text-[#5c1d1d] font-bold" style={{ fontFamily: "'MedievalSharp', serif" }}>
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-4 pt-2 border-t border-[#5c1d1d]/10">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-sm font-bold text-[#5c1d1d] hover:text-[#8c1d1d] transition-colors"
                                  style={{ fontFamily: "'MedievalSharp', serif" }}
                                >
                                  <ExternalLink className="w-4 h-4" /> Live Portal
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-sm font-bold text-[#5c1d1d] hover:text-[#8c1d1d] transition-colors"
                                  style={{ fontFamily: "'MedievalSharp', serif" }}
                                >
                                  <Github className="w-4 h-4" /> Spell Book
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* 5. Experience - The Daily Prophet Chronicle */}
              <section id="experience" className="scroll-mt-20">
                <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    <span>IV. The Daily Prophet: Career Chronicles</span>
                  </h2>

                  <div className="relative border-l-2 border-dashed border-[#5c1d1d]/30 ml-4 pl-6 space-y-12">
                    {experience.length === 0 ? (
                      <p className="text-lg italic text-[#7c5c43]">Chronicle list is empty. Add history events to record them.</p>
                    ) : (
                      experience.map((exp, i) => (
                        <div key={i} className="relative">
                          {/* Custom dot resembling an ancient seal */}
                          <div className="absolute -left-[35px] top-1.5 bg-[#fdfaf2] p-1 rounded-full border border-[#5c1d1d]/30">
                            <div className="w-4 h-4 bg-[#8c1d1d] rounded-full border border-[#d4af37]" />
                          </div>

                          <div className="bg-[#fbf6eb] p-6 rounded-lg border border-[#5c1d1d]/15 shadow-xs">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-[#5c1d1d]" style={{ fontFamily: "'MedievalSharp', serif" }}>{exp.role || exp.title}</h3>
                                <p className="text-base font-semibold text-[#8c1d1d]">{exp.company}</p>
                              </div>
                              <span className="text-sm font-semibold text-[#7c5c43] bg-[#e6d7b9]/30 px-3 py-1 rounded border border-[#5c1d1d]/10 self-start md:self-auto" style={{ fontFamily: "'MedievalSharp', serif" }}>
                                {exp.period || `${exp.startDate} - ${exp.endDate}`}
                              </span>
                            </div>

                            <p className="text-[#4a2e1e] leading-relaxed text-base italic mb-4">
                              {exp.description}
                            </p>

                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="list-disc pl-5 space-y-1.5 text-base text-[#5c3a21]">
                                {exp.highlights.map((high, idx) => (
                                  <li key={idx}>{high}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* 6. Testimonials - Wax-Sealed Letters */}
              {testimonials.length > 0 && (
                <section id="testimonials" className="scroll-mt-20">
                  <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                      <span>V. Owl Post: Correspondence</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      {testimonials.map((test, i) => (
                        <div key={i} className="bg-[#fbf6eb] p-6 rounded-lg border border-[#5c1d1d]/15 shadow-xs relative overflow-hidden">
                          {/* Seal element in background */}
                          <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-[#8c1d1d] opacity-80 border-2 border-[#d4af37] flex items-center justify-center font-bold text-[#f7f0df] text-xs shadow-md" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                            M
                          </div>

                          <p className="text-lg italic text-[#4a2e1e] mb-6 leading-relaxed">
                            "{test.content || test.text}"
                          </p>

                          <div className="flex items-center gap-3 pt-4 border-t border-[#5c1d1d]/10">
                            {test.avatar && (
                              <img src={test.avatar} alt={test.author || test.name} className="w-10 h-10 rounded-full border-2 border-[#5c1d1d] object-cover grayscale" />
                            )}
                            <div>
                              <p className="font-bold text-[#5c1d1d] text-base">{test.author || test.name}</p>
                              <p className="text-xs text-[#7c5c43] font-semibold">{test.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* 7. Contact - Floo Network Send a Message */}
              <section id="contact" className="scroll-mt-20">
                <div className="border-2 border-double border-[#5c1d1d]/30 bg-[#fdfaf2] rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-[#5c1d1d] mb-6 border-b border-[#5c1d1d]/20 pb-3 uppercase tracking-wider text-center" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    <span>VI. Send a Howler</span>
                  </h2>

                  <p className="text-center text-[#7c5c43] italic mb-8 max-w-md mx-auto">
                    "Send an envelope through the owl service to strike up dynamic correspondence."
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;
                      const name = form.elements["name"].value;
                      const email = form.elements["email"].value;
                      const message = form.elements["message"].value;
                      window.location.href = `mailto:${socials.email || 'wizard@example.com'}?subject=Magical Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AReply back to: ${encodeURIComponent(email)}`;
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-[#5c1d1d] mb-1.5 uppercase" style={{ fontFamily: "'MedievalSharp', serif" }}>Name Signatory</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Albus Dumbledore"
                        required
                        className="w-full px-4 py-3 bg-[#fbf6eb] text-[#5c1d1d] border border-[#5c1d1d]/30 rounded focus:outline-none focus:border-[#8c1d1d] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-[#5c1d1d] mb-1.5 uppercase" style={{ fontFamily: "'MedievalSharp', serif" }}>Return Address (Email)</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="albus@hogwarts.edu"
                        required
                        className="w-full px-4 py-3 bg-[#fbf6eb] text-[#5c1d1d] border border-[#5c1d1d]/30 rounded focus:outline-none focus:border-[#8c1d1d] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-[#5c1d1d] mb-1.5 uppercase" style={{ fontFamily: "'MedievalSharp', serif" }}>Message Content</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Formulate your scroll request..."
                        required
                        className="w-full px-4 py-3 bg-[#fbf6eb] text-[#5c1d1d] border border-[#5c1d1d]/30 rounded focus:outline-none focus:border-[#8c1d1d] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#5c1d1d] hover:bg-[#802222] text-[#f7f0df] border-2 border-[#d4af37] rounded font-bold uppercase tracking-wider transition-colors duration-200"
                      style={{ fontFamily: "'MedievalSharp', serif" }}
                    >
                      Dispatch Owl Mail
                    </button>
                  </form>

                  {/* Social Handles */}
                  <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-[#5c1d1d]/10">
                    {[
                      { icon: Github, url: socials.github, label: 'Spellbook Repo' },
                      { icon: Linkedin, url: socials.linkedin, label: 'Ministry Profile' },
                      { icon: Twitter, url: socials.twitter, label: 'Owl Feed' }
                    ].map((soc, idx) => {
                      if (!soc.url) return null;
                      const Icon = soc.icon;
                      return (
                        <a
                          key={idx}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-[#5c1d1d]/30 bg-[#fbf6eb] hover:bg-[#5c1d1d] hover:text-[#f7f0df] text-[#5c1d1d] transition-all"
                          title={soc.label}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Magical fold-back trigger ("Mischief managed") */}
              <section className="flex flex-col items-center justify-center pt-12">
                <div className="w-24 h-0.5 bg-[#5c1d1d]/20 mb-6" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-6 py-3 bg-[#fdfaf2] text-[#5c1d1d] border-2 border-[#5c1d1d] hover:bg-[#5c1d1d] hover:text-[#f7f0df] rounded-lg transition-all shadow-md font-bold uppercase tracking-wider"
                  style={{ fontFamily: "'MedievalSharp', serif" }}
                >
                  Mischief managed
                </motion.button>
              </section>

            </main>

            {/* Wizarding footer banner */}
            <footer className="py-8 px-4 text-center border-t-2 border-double border-[#5c1d1d]/20 bg-[#fbf6eb]/50 mt-12 text-[#7c5c43]">
              <p className="text-sm">
                © {new Date().getFullYear()} {personal.name}. Solemnly sworn to build excellence. | Hogwarts Marauder's Map Portfolio
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
