import React, { useState, useEffect, useRef } from 'react';
import {
  Scroll,
  Swords,
  Shield,
  Sparkles,
  Download,
  ExternalLink,
  Star,
  Flame,
  BookOpen,
  Gem
} from 'lucide-react';
import "./ResumeCTA.css";

export default function ResumeCTA({
  resumeUrl = "#",
  portfolioUrl = "#",
  characterName = "THE ADVENTURER",
  characterClass = "Fullstack Alchemist",
  characterLevel = 42,
  achievements = [
    { icon: "⚔️", label: "100+ Quests Completed" },
    { icon: "🏆", label: "Guild Rank: Legendary" },
    { icon: "📜", label: "Ancient Scrolls Mastered" },
  ]
}) {
  const [visible, setVisible] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const sectionRef = useRef(null);
  const sanitizeUrl = (url) => {
  if (!url || url === '#') return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return '#';
};

  // Fade-in on scroll (matches Projects.jsx pattern)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if ('IntersectionObserver' in window) {
      if (sectionRef.current) observer.observe(sectionRef.current);
    } else {
      setVisible(true);
    }
    return () => observer.disconnect();
  }, []);

  // Alternating glow pulse
  useEffect(() => {
    const interval = setInterval(() => setGlowPulse(p => !p), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>

      <section
        id="resume-cta"
        ref={sectionRef}
        className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-b-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* Background dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />
        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-900/8 rounded-full blur-3xl pointer-events-none" />

        {/* Top border ornament */}
        <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center opacity-40">
          <div className="w-full max-w-7xl border-b border-double border-amber-700/40 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-6 bg-[#0a090e] border border-amber-700/50 rounded-full flex items-center justify-center">
              <span className="text-amber-500 font-fantasy-game text-xs">◆</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-12">

          {/* ── Section Header ── */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Scroll className="w-5 h-5 text-amber-500 rpg-cta-floating-rune" />
              <span className="font-fantasy-game text-xs tracking-[0.3em] text-amber-500/80 uppercase">
                Guild Registry · Official Document
              </span>
              <Scroll className="w-5 h-5 text-amber-500 rpg-cta-floating-rune" style={{ animationDelay: '1s' }} />
            </div>
            <h2 className="font-fantasy-title text-4xl sm:text-5xl font-black text-amber-100 tracking-wide uppercase mb-3"
              style={{ textShadow: '0 0 30px rgba(212,175,55,0.4)' }}>
              Claim the Sacred Scroll
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-700/60" />
              <Swords className="w-4 h-4 text-amber-600" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-700/60" />
            </div>
          </div>

          {/* ── Main Parchment Card ── */}
          <div className="w-full bg-[#121118]/90 border-2 border-[#302718] rounded-xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] relative rpg-cta-gold-border-glow">
            <div className="metal-corner-tl" />
            <div className="metal-corner-tr" />
            <div className="metal-corner-bl" />
            <div className="metal-corner-br" />

            {/* Character identity row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-amber-900/40">
              {/* Avatar badge */}
              <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-amber-700 to-amber-950 border-2 border-amber-500 rounded-xl flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.15)]">
                <span className="font-fantasy-game text-[10px] text-amber-300 tracking-wider">LVL</span>
                <span className="font-fantasy-game text-2xl text-amber-100 font-bold leading-none">{characterLevel}</span>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-fantasy-title text-2xl font-black text-amber-200 tracking-widest uppercase"
                  style={{ textShadow: '0 0 12px rgba(212,175,55,0.3)' }}>
                  {characterName}
                </h3>
                <p className="font-fantasy-game text-sm text-amber-500/80 mt-1">{characterClass}</p>
                {/* XP bar */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-fantasy-game text-[9px] text-amber-400/70">REPUTATION</span>
                  <div className="w-32 h-1.5 bg-amber-950 border border-amber-800/40 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-amber-700 to-amber-400 rounded-full" />
                  </div>
                  <Star className="w-3 h-3 text-amber-500" />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-16 w-px bg-amber-900/40 mx-2" />

              {/* Achievements */}
              <div className="flex flex-col gap-2 flex-1">
                {achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 font-fantasy-game text-xs text-amber-300/80">
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll flavor text */}
            <div className="relative mb-8 p-5 rounded-lg text-center"
              style={{ background: 'rgba(180,140,59,0.06)', border: '1px solid rgba(180,140,59,0.2)' }}>
              <BookOpen className="absolute top-3 left-3 w-4 h-4 text-amber-700/50" />
              <Gem className="absolute top-3 right-3 w-4 h-4 text-amber-700/50" />
              <p className="font-fantasy-body text-sm leading-relaxed italic text-amber-200/70 px-4">
                "Herein lies the complete chronicle of this hero's conquests — every battle fought,
                every arcane framework mastered, every kingdom of code erected from nothing.
                The worthy adventurer who claims this scroll shall uncover the full legend."
              </p>
            </div>

            {/* Rune divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="font-fantasy-game text-amber-600 text-sm">⚔ ◆ ⚔</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={sanitizeUrl(resumeUrl)}
                className="rpg-btn-primary font-fantasy-title font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-lg flex items-center gap-3 cursor-pointer cta-beacon"
              >
                <Download className="w-4 h-4" />
                Claim the Resume Scroll
              </a>

              <a
                href={sanitizeUrl(portfolioUrl)}
                className="rpg-btn-secondary font-fantasy-title font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-lg flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Enter the Realm
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Footer badge */}
            <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
              <Flame className="w-3 h-3 text-amber-600" />
              <span className="font-fantasy-game text-[10px] tracking-widest text-amber-600 uppercase">
                Verified Hero · Guild Registry · Est. MMXXVI
              </span>
              <Flame className="w-3 h-3 text-amber-600" />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}