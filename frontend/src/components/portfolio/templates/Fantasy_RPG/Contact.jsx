/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Send,
  CheckCircle,
  RotateCcw,
  Swords,
  Shield,
  Scroll,
  Wand2,
  Heart,
  Coins,
  Gem,
  Sparkles,
  AlertCircle,
  Compass,
  Award
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// Helper to ensure social URLs are absolute
const ensureAbsoluteUrl = (url, platform) => {
  if (!url || url === "#") return "#";
  if (platform === 'email') {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) {
      return `mailto:${url}`;
    }
    return url;
  }
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

export default function Contact({
  personal = data.personal,
  socials = data.socials
}) {
  const [characterStats, setCharacterStats] = useState({
    level: 42,
    xp: 6800,
    maxXp: 10000,
    hp: 92,
    maxHp: 100,
    mana: 80,
    maxMana: 100,
    gold: 1420
  });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isCasting, setIsCasting] = useState(false);
  const [castProgress, setCastProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef(null);

  // Intersection Observer for fade-in effect
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Slowly regenerate mana in background
  useEffect(() => {
    const timer = setInterval(() => {
      setCharacterStats((prev) => ({
        ...prev,
        mana: Math.min(prev.maxMana, prev.mana + 1)
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Inventory Items representing Socials
  const ITEMS = [
    {
      id: 'email',
      name: "Quill of Far-Speaking",
      rarity: "LEGENDARY",
      rarityColor: "text-orange-500",
      rarityBg: "bg-orange-950/20 border-orange-800/40",
      glowClass: "shadow-[0_0_15px_rgba(249,115,22,0.4)] border-orange-500",
      attributes: [
        { name: "Telepathy Speed", val: "+25" },
        { name: "Arcane Link", val: "+15" }
      ],
      desc: "An ancient quill harvested from a celestial phoenix. Allows instantaneous parchment transmission across dimensions.",
      lore: "Written contracts signed by this quill are bound by ancient magic and rarely ignored.",
      actionLabel: "DISPATCH TELEPATHY",
      icon: Mail,
      url: ensureAbsoluteUrl(socials.email, 'email')
    },
    {
      id: 'github',
      name: "Codex of Source Craft",
      rarity: "EPIC",
      rarityColor: "text-purple-400",
      rarityBg: "bg-purple-950/20 border-purple-800/40",
      glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-500",
      attributes: [
        { name: "Intellect Sigil", val: "+30" },
        { name: "Technical Refactor", val: "+20" }
      ],
      desc: "A massive, iron-bound ledger holding thousands of lines of arcane syntax and modular systems.",
      lore: "Contains the source code of historical empires, repelling technical debt like a holy shield.",
      actionLabel: "INSPECT LORE CODE",
      icon: Github,
      url: ensureAbsoluteUrl(socials.github, 'github')
    },
    {
      id: 'linkedin',
      name: "Charter of the Alliance",
      rarity: "RARE",
      rarityColor: "text-sky-400",
      rarityBg: "bg-sky-950/20 border-sky-800/40",
      glowClass: "shadow-[0_0_15px_rgba(56,189,248,0.4)] border-sky-500",
      attributes: [
        { name: "Charisma Buff", val: "+15" },
        { name: "Guild Reputation", val: "+12" }
      ],
      desc: "A formal scroll signed by guild leaders of the Realm. Establishes commercial pacts and campaigns.",
      lore: "Essential for entering elite alliances and recruiting high-tier mercenaries.",
      actionLabel: "SIGN CHARTER",
      icon: Linkedin,
      url: ensureAbsoluteUrl(socials.linkedin, 'linkedin')
    },
    {
      id: 'twitter',
      name: "Amulet of Whispers",
      rarity: "COMMON",
      rarityColor: "text-emerald-400",
      rarityBg: "bg-emerald-950/20 border-emerald-800/40",
      glowClass: "shadow-[0_0_10px_rgba(16,185,129,0.3)] border-emerald-500",
      attributes: [
        { name: "Scroll Broadcasting", val: "+18" },
        { name: "Networking Aura", val: "+8" }
      ],
      desc: "A lightweight amulet that vibrates when peers nearby whisper their thoughts in the main square.",
      lore: "Broadcasts runic thoughts to the entire realm instantly, though whispers fade fast.",
      actionLabel: "WHISPER IN SQUARE",
      icon: Twitter,
      url: ensureAbsoluteUrl(socials.twitter, 'twitter')
    }
  ];

  const activeItem = ITEMS[activeItemIndex];

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Adventurer Name is required";
    if (!form.email.trim()) errs.email = "Communication Sigil (Email) is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid Conduit address";
    if (!form.message.trim()) errs.message = "Quest Contract details are required";
    return errs;
  };

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleQuestSubmit = (e) => {
    e.preventDefault();
    if (isCasting || submitted) return;

    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    // Spell cost is 30 mana
    if (characterStats.mana < 30) {
      setErrors({ form: "Insufficient Mana! Meditate for a few seconds to restore mana reserves." });
      return;
    }

    // Spend Mana and begin cast phase
    setCharacterStats((prev) => ({ ...prev, mana: Math.max(0, prev.mana - 30) }));
    setIsCasting(true);
    setCastProgress(0);

    const castDuration = 1800; // 1.8 seconds casting
    const intervalTime = 30;
    const increment = (intervalTime / castDuration) * 100;

    const timer = setInterval(() => {
      setCastProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          completeQuest();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);
  };

  const completeQuest = () => {
    setIsCasting(false);
    setSubmitted(true);

    const xpGained = 150;
    const goldGained = 50;

    setCharacterStats((prev) => {
      const nextGold = prev.gold + goldGained;
      let nextXp = prev.xp + xpGained;
      let nextLevel = prev.level;
      let didLevelUp = false;

      if (nextXp >= prev.maxXp) {
        nextXp = nextXp - prev.maxXp;
        nextLevel += 1;
        didLevelUp = true;
      }

      if (didLevelUp) {
        setLevelUpMessage(`✨ LEVEL UP! You have advanced to Level ${nextLevel}! Attributes enhanced!`);
        setTimeout(() => setLevelUpMessage(null), 6000);
      }

      return {
        ...prev,
        gold: nextGold,
        xp: nextXp,
        level: nextLevel
      };
    });
  };

  const handleResetForm = () => {
    setForm({ name: '', email: '', message: '' });
    setSubmitted(false);
    setErrors({});
  };

  return (
    <>
      {/* ──────────────── Medieval RPG Typography and Animation Keyframes ──────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=MedievalSharp&family=Inter:wght@400;500;600&display=swap');

        .font-fantasy-title {
          font-family: 'Cinzel', serif;
        }
        .font-fantasy-game {
          font-family: 'MedievalSharp', cursive;
        }
        .font-fantasy-body {
          font-family: 'Inter', sans-serif;
        }

        @keyframes gold-shimmer {
          0% { border-color: #b48c3b; box-shadow: 0 0 5px rgba(180, 140, 59, 0.4); }
          50% { border-color: #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.8); }
          100% { border-color: #b48c3b; box-shadow: 0 0 5px rgba(180, 140, 59, 0.4); }
        }

        @keyframes spell-glow {
          0%, 100% { text-shadow: 0 0 2px #d4af37, 0 0 8px rgba(212, 175, 55, 0.4); }
          50% { text-shadow: 0 0 5px #d4af37, 0 0 15px rgba(212, 175, 55, 0.7); }
        }

        @keyframes float-runes {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }

        .gold-border-glow {
          animation: gold-shimmer 4s infinite ease-in-out;
        }

        .spell-glow-text {
          animation: spell-glow 3s infinite ease-in-out;
        }

        .floating-rune {
          animation: float-runes 5s infinite ease-in-out;
        }

        .metal-corner-tl::before {
          content: ""; position: absolute; top: 0; left: 0; width: 12px; height: 12px;
          border-top: 3px solid #d4af37; border-left: 3px solid #d4af37; pointer-events: none;
        }
        .metal-corner-tr::before {
          content: ""; position: absolute; top: 0; right: 0; width: 12px; height: 12px;
          border-top: 3px solid #d4af37; border-right: 3px solid #d4af37; pointer-events: none;
        }
        .metal-corner-bl::before {
          content: ""; position: absolute; bottom: 0; left: 0; width: 12px; height: 12px;
          border-bottom: 3px solid #d4af37; border-left: 3px solid #d4af37; pointer-events: none;
        }
        .metal-corner-br::before {
          content: ""; position: absolute; bottom: 0; right: 0; width: 12px; height: 12px;
          border-bottom: 3px solid #d4af37; border-right: 3px solid #d4af37; pointer-events: none;
        }
      `}} />

      <section
        id="contact"
        ref={sectionRef}
        className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-b-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Magical Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />
        <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Top Border Arch */}
        <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center opacity-40">
          <div className="w-full max-w-7xl border-b border-double border-amber-700/40 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-12 h-6 bg-[#0a090e] border border-amber-700/50 rounded-full flex items-center justify-center">
              <span className="text-amber-500 font-fantasy-game text-xs">◆</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

          {/* ──────────────── LEVEL UP NOTIFICATION ──────────────── */}
          <AnimatePresence>
            {levelUpMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="w-full max-w-4xl bg-gradient-to-r from-amber-600/90 via-yellow-600/90 to-amber-700/90 border-2 border-yellow-400 p-4 rounded-xl mb-6 text-center text-amber-950 font-fantasy-game font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.6)] z-50 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-amber-950 animate-bounce" />
                {levelUpMessage}
                <Sparkles className="w-5 h-5 text-amber-950 animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ──────────────── CHARACTER STATUS HUD ──────────────── */}
          <div className="w-full max-w-5xl bg-[#121118]/90 border-2 border-[#302718] p-4 rounded-xl mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative gold-border-glow">
            <div className="metal-corner-tl" />
            <div className="metal-corner-tr" />
            <div className="metal-corner-bl" />
            <div className="metal-corner-br" />

            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
              {/* Class Banner */}
              <div className="md:col-span-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-amber-900/40 pb-4 md:pb-0 md:pr-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-amber-950 border-2 border-amber-500 rounded-lg flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)]">
                  <span className="font-fantasy-game text-[10px] text-amber-300 tracking-wider">LVL</span>
                  <span className="font-fantasy-game text-xl text-amber-100 font-bold leading-none">{characterStats.level}</span>
                </div>
                <div>
                  <h4 className="font-fantasy-title text-sm font-bold text-amber-300 tracking-wide uppercase">THE ADVENTURER</h4>
                  <p className="font-fantasy-game text-xs text-amber-500/80">Fullstack Alchemist</p>
                </div>
              </div>

              {/* HUD Health & Mana Bars */}
              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Health points */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-fantasy-game">
                    <span className="flex items-center gap-1 text-red-400">
                      <Heart className="w-3.5 h-3.5 fill-red-950 text-red-500" />
                      HEALTH / STAMINA
                    </span>
                    <span className="text-red-300 font-bold">{characterStats.hp} / {characterStats.maxHp}</span>
                  </div>
                  <div className="w-full h-3 bg-red-950/70 border border-red-800 rounded overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-red-700 to-rose-500 rounded transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      style={{ width: `${(characterStats.hp / characterStats.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mana Points */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-fantasy-game">
                    <span className="flex items-center gap-1 text-sky-400">
                      <Wand2 className="w-3.5 h-3.5 text-sky-400" />
                      MANA (AUTOREGEN)
                    </span>
                    <span className="text-sky-300 font-bold">{characterStats.mana} / {characterStats.maxMana}</span>
                  </div>
                  <div className="w-full h-3 bg-sky-950/70 border border-sky-800 rounded overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-sky-700 to-cyan-500 rounded transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                      style={{ width: `${(characterStats.mana / characterStats.maxMana) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* XP & Gold Summary */}
              <div className="md:col-span-3 flex items-center justify-between border-t md:border-t-0 md:border-l border-amber-900/40 pt-4 md:pt-0 md:pl-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-fantasy-game text-xs text-amber-300">
                    <Coins className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span>GOLD:</span>
                    <span className="text-amber-100 font-bold">{characterStats.gold} g</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[8px] font-fantasy-game text-amber-400/80">
                      <span>EXP: {characterStats.xp} XP</span>
                      <span>{characterStats.maxXp} MAX</span>
                    </div>
                    <div className="w-32 h-1.5 bg-amber-950 border border-amber-800/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${(characterStats.xp / characterStats.maxXp) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full border border-amber-800/60 bg-amber-950/30 flex items-center justify-center text-amber-500">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────── SECTION HEADER ──────────────── */}
          <div className="relative w-full max-w-4xl flex flex-col items-center text-center mb-16 px-4">
            <div className="absolute -top-12 opacity-10 pointer-events-none">
              <Scroll className="w-48 h-48 text-amber-300" />
            </div>

            <div className="flex items-center gap-4 mb-3">
              <Swords className="w-7 h-7 text-amber-500 animate-pulse" />
              <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
                ALLIANCE CONDUIT
              </span>
              <Swords className="w-7 h-7 text-amber-500 animate-pulse" />
            </div>

            <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              QUEST CONTRACT BOARD
            </h2>

            <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
              POST A QUEST CONTRACT TO ENLIST {personal.name.toUpperCase()} OR SIGN AN ALLIANCE PACT
            </p>

            <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="text-amber-500/60 font-fantasy-game">✦</span>
              <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>
          </div>

          {/* ──────────────── MAIN SPLIT VIEW ──────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl items-start">

            {/* LEFT COLUMN: THE QUEST CONTRACT FORM */}
            <div className="lg:col-span-7 w-full bg-[#121118]/95 border-2 border-[#302718] p-6 sm:p-8 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative gold-border-glow">
              <div className="metal-corner-tl" />
              <div className="metal-corner-tr" />
              <div className="metal-corner-bl" />
              <div className="metal-corner-br" />

              {!submitted ? (
                <>
                  <div className="flex items-center gap-3 border-b border-amber-900/40 pb-3 mb-6">
                    <Scroll className="w-5 h-5 text-amber-400" />
                    <h3 className="font-fantasy-title text-sm font-bold text-amber-300 uppercase tracking-wider">
                      POST QUEST CONTRACT
                    </h3>
                  </div>

                  <form onSubmit={handleQuestSubmit} className="space-y-5" noValidate>
                    {/* Error Alerts */}
                    {errors.form && (
                      <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/60 text-red-400 rounded-lg text-xs font-fantasy-game">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.form}</span>
                      </div>
                    )}

                    {/* Adventurer Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rpg-name" className="font-fantasy-game text-[10px] text-amber-400/80 uppercase tracking-widest flex items-center justify-between">
                        <span>ADVENTURER / GUILD NAME</span>
                        <span className="text-amber-600/40">REQUIRED</span>
                      </label>
                      <input
                        id="rpg-name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange('name')}
                        placeholder="e.g. Sir Galahad of Camelot"
                        disabled={isCasting}
                        className={`w-full bg-black/60 border font-fantasy-body text-xs text-amber-100 px-4 py-3 rounded-lg placeholder-amber-900/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors ${
                          errors.name ? 'border-red-800' : 'border-amber-900/50'
                        }`}
                      />
                      {errors.name && <p className="font-fantasy-game text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                    </div>

                    {/* Pigeon Conduit Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rpg-email" className="font-fantasy-game text-[10px] text-amber-400/80 uppercase tracking-widest flex items-center justify-between">
                        <span>COMMUNICATION SIGIL (EMAIL)</span>
                        <span className="text-amber-600/40">REQUIRED</span>
                      </label>
                      <input
                        id="rpg-email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange('email')}
                        placeholder="e.g. galahad@knightguild.realm"
                        disabled={isCasting}
                        className={`w-full bg-black/60 border font-fantasy-body text-xs text-amber-100 px-4 py-3 rounded-lg placeholder-amber-900/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors ${
                          errors.email ? 'border-red-800' : 'border-amber-900/50'
                        }`}
                      />
                      {errors.email && <p className="font-fantasy-game text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                    </div>

                    {/* Quest Objectives */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rpg-message" className="font-fantasy-game text-[10px] text-amber-400/80 uppercase tracking-widest flex items-center justify-between">
                        <span>QUEST OBJECTIVES / DETAILS</span>
                        <span className="text-amber-600/40">REQUIRED</span>
                      </label>
                      <textarea
                        id="rpg-message"
                        rows={5}
                        value={form.message}
                        onChange={handleInputChange('message')}
                        placeholder="Describe the campaign parameters, goals, and technical requirements..."
                        disabled={isCasting}
                        className={`w-full bg-black/60 border font-fantasy-body text-xs text-amber-100 px-4 py-3 rounded-lg placeholder-amber-900/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none ${
                          errors.message ? 'border-red-800' : 'border-amber-900/50'
                        }`}
                      />
                      {errors.message && <p className="font-fantasy-game text-[10px] text-red-500 mt-0.5">{errors.message}</p>}
                    </div>

                    {/* Submit casting button */}
                    <div className="pt-2">
                      <AnimatePresence mode="wait">
                        {isCasting ? (
                          <motion.div
                            key="casting-bar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col items-center gap-2 p-1.5 border border-amber-600/40 bg-amber-950/20 rounded-xl"
                          >
                            <div className="w-full h-8 bg-black/60 border border-amber-900/60 rounded-lg overflow-hidden p-0.5 relative flex items-center justify-center">
                              <div
                                className="absolute left-0.5 top-0.5 bottom-0.5 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 rounded transition-all duration-100 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                                style={{ width: `calc(${castProgress}% - 4px)` }}
                              />
                              <span className="relative z-30 font-fantasy-game text-[9px] font-bold text-amber-100 select-none tracking-widest spell-glow-text uppercase">
                                CASTING SCROLL INVOCATION... {Math.round(castProgress)}%
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="submit-btn"
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-b from-amber-700 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-amber-100 font-fantasy-game text-xs font-bold border border-amber-500/60 rounded-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:text-white transition-all cursor-pointer uppercase tracking-wider"
                          >
                            <Wand2 className="w-4 h-4" />
                            CAST TELEPATHY SCROLL (COST: 30 MANA)
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-emerald-500 bg-emerald-950/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>

                  <h3 className="font-fantasy-title text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 tracking-wide uppercase mb-2">
                    QUEST CONTRACT SEALED!
                  </h3>

                  <p className="font-fantasy-game text-xs text-amber-500/80 mb-6">
                    THE HERO {personal.name.toUpperCase()} HAS BEEN NOTIFIED. TRANSMISSION SEAL REMAIN ACTIVE.
                  </p>

                  {/* Medieval wax-sealed scroll mockup */}
                  <div className="w-full max-w-sm bg-[#18161f] border border-amber-900/60 rounded-xl p-5 mb-8 relative">
                    <div className="metal-corner-tl opacity-40" />
                    <div className="metal-corner-tr opacity-40" />
                    <div className="metal-corner-bl opacity-40" />
                    <div className="metal-corner-br opacity-40" />

                    <div className="flex items-center gap-1.5 justify-center font-fantasy-game text-[10px] text-amber-400 border-b border-amber-900/40 pb-2 mb-3">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>BOUNTY REWARDS ACQUIRED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center justify-center text-center">
                      <div className="bg-black/60 border border-amber-900/40 p-2.5 rounded-lg">
                        <span className="font-fantasy-game text-[9px] text-amber-500 block mb-1">XP REWARD</span>
                        <div className="flex items-center justify-center gap-1 font-fantasy-game text-sm text-sky-400">
                          <Gem className="w-4 h-4" />
                          <span className="font-bold">+150 XP</span>
                        </div>
                      </div>
                      <div className="bg-black/60 border border-amber-900/40 p-2.5 rounded-lg">
                        <span className="font-fantasy-game text-[9px] text-amber-500 block mb-1">GOLD BOUNTY</span>
                        <div className="flex items-center justify-center gap-1 font-fantasy-game text-sm text-yellow-500">
                          <Coins className="w-4 h-4" />
                          <span className="font-bold">+50 g</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-fantasy-body text-[11px] text-amber-100/40 leading-relaxed italic mt-4">
                      "A messenger falcon has been dispatched to carry the contract scroll across the boundaries. {personal.name} will return with parchment feedback shortly."
                    </p>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="flex items-center gap-1.5 px-6 py-3 border border-amber-900/80 bg-amber-950/20 hover:bg-amber-900/20 text-amber-400 hover:text-amber-300 font-fantasy-game text-[10px] rounded transition-all cursor-pointer uppercase"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    POST ANOTHER QUEST
                  </button>
                </motion.div>
              )}
            </div>

            {/* RIGHT COLUMN: HERO'S INVENTORY & LOOT SOCIALS */}
            <div className="lg:col-span-5 w-full flex flex-col gap-6">

              {/* LOOT SLOTS GRID */}
              <div className="bg-[#121118]/90 border-2 border-[#302718] p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative">
                <div className="metal-corner-tl opacity-50" />
                <div className="metal-corner-tr opacity-50" />
                <div className="metal-corner-bl opacity-50" />
                <div className="metal-corner-br opacity-50" />

                <div className="flex items-center gap-2 border-b border-amber-900/40 pb-2 mb-4">
                  <Shield className="w-4.5 h-4.5 text-amber-400" />
                  <h3 className="font-fantasy-title text-xs font-bold text-amber-300 uppercase tracking-wide">
                    EQUIPPED LOOT SOCIALS
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  {ITEMS.map((item, index) => {
                    const isSelected = activeItemIndex === index;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItemIndex(index)}
                        className={`aspect-square p-4 bg-black/60 border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative ${
                          isSelected
                            ? `${item.glowClass} shadow-[0_0_15px_rgba(212,175,55,0.15)]`
                            : 'border-amber-900/40 hover:border-amber-700/60 text-amber-400/40 hover:text-amber-300 hover:bg-amber-900/10'
                        }`}
                      >
                        {/* Selected overlay indicator */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
                        )}

                        <div className={`w-10 h-10 border border-amber-900/60 bg-amber-950/20 rounded-lg flex items-center justify-center ${
                          isSelected ? 'text-amber-200 border-amber-500' : ''
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <span className="font-fantasy-game text-[9px] uppercase tracking-wide text-center leading-tight truncate w-full">
                          {item.name}
                        </span>

                        <span className={`font-fantasy-game text-[7px] px-1.5 py-0.5 border border-amber-900/30 rounded ${item.rarityBg} ${item.rarityColor}`}>
                          {item.rarity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE ITEM DETAILS PANEL */}
              <div className="bg-[#121118]/95 border border-[#302718] p-6 rounded-2xl shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] relative overflow-hidden flex-1 min-h-[300px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-700/5 to-transparent pointer-events-none" />

                <div className="metal-corner-tl opacity-30" />
                <div className="metal-corner-tr opacity-30" />
                <div className="metal-corner-bl opacity-30" />
                <div className="metal-corner-br opacity-30" />

                <div className="flex flex-col gap-4">
                  {/* Item Header */}
                  <div className="border-b border-amber-900/40 pb-3">
                    <div className="flex items-center justify-between text-[8px] font-fantasy-game text-amber-500 tracking-widest uppercase mb-1">
                      <span>EQUIPMENT DESCRIPTION</span>
                      <span className={`${activeItem.rarityColor} font-black`}>{activeItem.rarity} TOOL</span>
                    </div>
                    <h4 className="font-fantasy-title text-base font-black text-amber-200 tracking-wide uppercase leading-tight">
                      {activeItem.name}
                    </h4>
                  </div>

                  {/* Attributes Block */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeItem.attributes.map((attr) => (
                      <div key={attr.name} className="bg-black/60 border border-amber-900/40 rounded-lg px-3 py-2 text-center">
                        <span className="font-fantasy-game text-[8px] text-amber-500 block mb-0.5 uppercase tracking-wider">{attr.name}</span>
                        <span className="font-fantasy-game text-sm text-sky-400 font-bold">{attr.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="font-fantasy-body text-xs text-amber-100/60 leading-relaxed min-h-[60px]">
                    {activeItem.desc}
                  </p>

                  {/* Lore Quote */}
                  <p className="font-fantasy-body italic text-[10px] text-amber-500/60 leading-normal border-l-2 border-amber-900/40 pl-3">
                    "{activeItem.lore}"
                  </p>

                  {/* Platform action button */}
                  <div className="pt-2 mt-auto">
                    <a
                      href={activeItem.url}
                      target={activeItem.id !== 'email' ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-b from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-100 font-fantasy-game text-[10px] font-bold border border-amber-500/60 rounded-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:text-white transition-all cursor-pointer uppercase text-center"
                    >
                      <activeItem.icon className="w-3.5 h-3.5" />
                      {activeItem.actionLabel}
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ──────────────── BOTTOM DECORATIVE HUD ──────────────── */}
          <div className="w-full max-w-5xl mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-dashed border-amber-900/40 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-700 border border-amber-200 rounded-full flex items-center justify-center shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)] animate-[spin_5s_linear_infinite] floating-rune">
                <span className="font-fantasy-game text-[10px] text-amber-950 font-black">g</span>
              </div>
              <p className="font-fantasy-game text-xs text-amber-500/60 uppercase tracking-wide">
                Complete quests to earn gold and legendary experience points
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-fantasy-game text-amber-500/60 bg-amber-950/10 px-4 py-2 border border-amber-900/30 rounded">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>PARTY LEADER STATS: ACTIVE SPELLS ACTIVE</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
