import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import {
  Heart, Sparkles, MapPin, Mail, Linkedin, Github, Twitter,
  ExternalLink, MessageSquare, Briefcase, Star, X, Check,
  ChevronLeft, ChevronRight, Info, User, Award, Send,
  Flame, Zap, RotateCcw, MessageCircle, Settings, LogOut, CheckCircle
} from "lucide-react";

// ── Floating Hearts Background Component ──
function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        x: Math.random() * 100, // percentage of viewport width
        size: Math.random() * 20 + 10, // size from 10px to 30px
        duration: Math.random() * 4 + 4, // duration in seconds
        delay: Math.random() * 2
      };
      setHearts(prev => [...prev.slice(-20), newHeart]); // Keep last 20 hearts
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: "105vh", x: `${heart.x}vw`, opacity: 0, scale: 0.5 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1.2, 1, 0.8],
            rotate: [0, 45, -45, 0]
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeInOut"
          }}
          className="absolute text-rose-400/40"
          style={{ width: heart.size, height: heart.size }}
        >
          <Heart fill="currentColor" className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
}

// ── Particle Sparkles Component ──
function SparkleEffect({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      {[...Array(12)].map((_, i) => {
        const angle = (i * 36) * (Math.PI / 180);
        const distance = Math.random() * 100 + 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0], x, y }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-yellow-400"
          >
            <Sparkles size={16} fill="currentColor" />
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main Template Component ──
export default function SwipeRightDatingApp() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData;

  // Open URL safely to prevent target="_blank" vulnerability and javascript: scheme execution
  const openSafeUrl = (url) => {
    if (!url || url === "#") return;
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Tabs: 'discover' (Hero), 'profile' (About), 'skills' (Skills), 'projects' (Projects), 'chats' (Experience), 'testimonials' (Testimonials), 'match' (Contact)
  const [activeTab, setActiveTab] = useState("discover");
  const [isSparkling, setIsSparkling] = useState(false);
  const [heartsExplosion, setHeartsExplosion] = useState([]);

  // Projects Stack State
  const [projectIndex, setProjectIndex] = useState(0);
  const projects = data?.projects || [];

  // Experience Chat State
  const experienceList = data?.experience || [];
  const [activeChatIdx, setActiveChatIdx] = useState(0);
  const activeCompany = experienceList[activeChatIdx];

  // Reset/clamp activeChatIdx when experienceList changes
  useEffect(() => {
    if (experienceList.length > 0) {
      if (activeChatIdx >= experienceList.length) {
        setActiveChatIdx(0);
      }
    }
  }, [experienceList, activeChatIdx]);

  // Testimonials Matching Inbox State
  const testimonials = data?.testimonials || [];
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Trigger heart explosion on super-like
  const triggerSuperLike = () => {
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 1000);
    const newExplosion = [...Array(15)].map((_, i) => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 300,
      y: -Math.random() * 400 - 100,
      scale: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * 360
    }));
    setHeartsExplosion(newExplosion);
    setTimeout(() => setHeartsExplosion([]), 1500);
  };

  // Navigations tabs helpers
  const tabs = [
    { id: "discover", label: "Discover", icon: Flame },
    { id: "profile", label: "Profile", icon: User },
    { id: "skills", label: "Interests", icon: Award },
    { id: "projects", label: "Match Cards", icon: Heart },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "testimonials", label: "Matches", icon: Star },
    { id: "match", label: "Connect", icon: Zap }
  ];

  return (
    <div className="bg-gradient-to-tr from-rose-50 to-pink-100 min-h-screen text-slate-800 font-sans relative overflow-hidden flex flex-col lg:flex-row">
      <FloatingHearts />

      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-20 pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none z-0" style={{ animationDelay: "2s" }} />

      {/* ── DESKTOP LEFT SIDEBAR ── */}
      <aside className="hidden lg:flex w-80 shrink-0 border-r border-rose-100/50 bg-white/80 backdrop-blur-xl flex-col h-screen sticky top-0 z-30 shadow-lg">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-rose-50 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("discover")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-pink-500/20">
              <Flame size={20} className="text-white fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              DevMatch
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("match")}
              className="p-2 text-rose-400 hover:bg-rose-50 rounded-full transition-colors"
              title="Connect"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Mini Profile (Switches to Profile tab) */}
        <div
          onClick={() => setActiveTab("profile")}
          className={`p-4 mx-4 my-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border ${
            activeTab === "profile"
              ? "bg-rose-500 text-white border-rose-600 shadow-md"
              : "bg-white hover:bg-rose-50/50 border-gray-100 shadow-sm"
          }`}
        >
          <div className="relative">
            <img
              src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"}
              alt={data?.personal?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-pink-400"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="overflow-hidden">
            <h4 className={`font-bold text-sm truncate ${activeTab === "profile" ? "text-white" : "text-slate-800"}`}>
              {data?.personal?.name || "Developer Name"}
            </h4>
            <p className={`text-xs truncate ${activeTab === "profile" ? "text-rose-100" : "text-rose-400"} flex items-center gap-1 font-semibold`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Active Now
            </p>
          </div>
        </div>

        {/* Navigation Sidebar List */}
        <nav className="px-4 py-2 flex-1 space-y-1 overflow-y-auto">
          <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Main Discovery</p>
          {tabs.slice(0, 4).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-rose-50 text-rose-500 border-l-4 border-rose-500 shadow-sm"
                    : "text-slate-600 hover:bg-rose-50/30 hover:text-rose-500"
                }`}
              >
                <Icon size={18} className={isActive ? "text-rose-500 fill-rose-500/20" : ""} />
                {tab.label}
              </button>
            );
          })}

          <p className="px-3 py-1 pt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversations</p>

          {/* Matches / Testimonials trigger list */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "testimonials"
                  ? "bg-rose-50 text-rose-500 border-l-4 border-rose-500 shadow-sm"
                  : "text-slate-600 hover:bg-rose-50/30"
              }`}
            >
              <Star size={18} className={activeTab === "testimonials" ? "text-rose-500 fill-rose-500/20" : ""} />
              Matches ({testimonials.length})
            </button>
            <div className="flex gap-2 px-3 py-1 overflow-x-auto scrollbar-none">
              {testimonials.map((testi, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTestimonialIdx(i);
                    setActiveTab("testimonials");
                  }}
                  className="w-10 h-10 rounded-full shrink-0 relative hover:scale-105 transition-transform"
                  title={`${testi.author} - Match`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400">
                    <img
                      src={testi.avatar || `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop`}
                      alt={testi.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {i === activeTestimonialIdx && activeTab === "testimonials" && (
                    <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 border border-white">
                      <Heart size={8} fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DMs / Experience list */}
          <div className="space-y-1 pt-2">
            <button
              onClick={() => setActiveTab("chats")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "chats"
                  ? "bg-rose-50 text-rose-500 border-l-4 border-rose-500 shadow-sm"
                  : "text-slate-600 hover:bg-rose-50/30"
              }`}
            >
              <MessageCircle size={18} className={activeTab === "chats" ? "text-rose-500 fill-rose-500/20" : ""} />
              Direct Messages
            </button>
            <div className="space-y-1">
              {experienceList.map((exp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveChatIdx(i);
                    setActiveTab("chats");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "chats" && activeChatIdx === i
                      ? "bg-rose-50 text-rose-500 font-bold"
                      : "text-slate-500 hover:bg-rose-50/20"
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="truncate">{exp.company}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-rose-50 text-center">
          <button
            onClick={() => setActiveTab("match")}
            className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-md hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
          >
            <Heart size={14} fill="currentColor" /> Let's Match
          </button>
        </div>
      </aside>

      {/* ── MOBILE / TABLET HEADER ── */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-rose-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2" onClick={() => setActiveTab("discover")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-pink-500/20">
            <Flame size={18} className="text-white fill-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            DevMatch
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("profile")}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-400"
          >
            <img
              src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
              alt={data?.personal?.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CANVAS ── */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-56px)] lg:min-h-screen relative overflow-y-auto px-4 py-8 lg:p-8 pb-24 lg:pb-8 items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full max-w-md"
            >
              {/* DISCOVERY HERO CARD */}
              <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden relative border border-rose-100 flex flex-col group transform transition-all duration-300 hover:shadow-pink-300/20">
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  {/* Glowing light overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />

                  <img
                    src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop"}
                    alt={data?.personal?.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Super Like Sparks Container */}
                  <SparkleEffect active={isSparkling} />

                  {/* Floating hearts explosion container */}
                  {heartsExplosion.map(heart => (
                    <motion.div
                      key={heart.id}
                      initial={{ opacity: 1, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                      animate={{
                        opacity: 0,
                        scale: heart.scale,
                        x: heart.x,
                        y: heart.y,
                        rotate: heart.rotation
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 text-rose-500 z-30"
                    >
                      <Heart size={32} fill="currentColor" />
                    </motion.div>
                  ))}

                  {/* Badges on Hero Image */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-rose-500/80 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                      <Flame size={12} className="fill-white" /> Active Now
                    </span>
                    {data?.stats?.yearsExperience && (
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1">
                        ✨ {data.stats.yearsExperience}+ Years Exp
                      </span>
                    )}
                  </div>

                  {/* Title and Details Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                        {data?.personal?.name || "Developer Name"}
                      </h2>
                      <span className="text-2xl font-semibold opacity-90">
                        {data?.stats?.yearsExperience ? data.stats.yearsExperience + 20 : 25}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-rose-300 font-semibold drop-shadow-sm text-sm">
                      <Briefcase size={14} />
                      <span className="truncate">{data?.personal?.title || "Full Stack Engineer"}</span>
                    </div>

                    {data?.personal?.location && (
                      <div className="flex items-center gap-1 text-slate-300 text-xs font-medium mt-1">
                        <MapPin size={12} />
                        <span>{data.personal.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info and Short Bio Section */}
                <div className="p-6 bg-white border-t border-rose-50 flex-1">
                  <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider mb-2 text-rose-500">
                    My Tagline
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 italic font-medium">
                    "{data?.personal?.tagline || "Building elegant solutions to complex web puzzles."}"
                  </p>

                  <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider mb-2 text-rose-500">
                    Short Bio
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {data?.personal?.bio || "Passionate engineer specialized in React, Javascript, and responsive design systems."}
                  </p>
                </div>

                {/* Tinder Action Buttons */}
                <div className="p-5 bg-gradient-to-t from-rose-50/50 to-white flex items-center justify-around border-t border-rose-50/50">
                  {/* Rewind */}
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                    }}
                    className="w-12 h-12 bg-white text-yellow-500 hover:text-yellow-600 rounded-full flex items-center justify-center border border-gray-100 shadow-md transition-all active:scale-95 group"
                    title="Profile Details"
                  >
                    <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform" />
                  </button>

                  {/* Pass */}
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="w-14 h-14 bg-white text-rose-500 hover:bg-rose-50 rounded-full flex items-center justify-center border border-gray-100 shadow-md transition-all active:scale-95 hover:scale-105"
                    title="Nope"
                  >
                    <X size={24} />
                  </button>

                  {/* Super Like */}
                  <button
                    onClick={triggerSuperLike}
                    className="w-12 h-12 bg-white text-sky-400 hover:bg-sky-50 rounded-full flex items-center justify-center border border-gray-100 shadow-md transition-all active:scale-95 hover:scale-105"
                    title="Super Like"
                  >
                    <Star size={20} fill="currentColor" />
                  </button>

                  {/* Like */}
                  <button
                    onClick={() => setActiveTab("match")}
                    className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all active:scale-95 hover:scale-105"
                    title="Like & Match"
                  >
                    <Heart size={24} fill="currentColor" />
                  </button>

                  {/* Boost */}
                  <button
                    onClick={() => setActiveTab("skills")}
                    className="w-12 h-12 bg-white text-purple-500 hover:text-purple-600 rounded-full flex items-center justify-center border border-gray-100 shadow-md transition-all active:scale-95 group"
                    title="Developer Interests / Skills"
                  >
                    <Zap size={20} className="fill-currentColor group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* PROFILE ABOUT ME DETAIL CARD */}
              <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-rose-100">
                <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold">Dating Profile Info</h2>
                    <p className="text-rose-100 text-xs">Let's check if we match requirements ❤️</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Grid stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Age</p>
                      <p className="text-slate-800 text-lg font-extrabold mt-1">
                        {data?.stats?.yearsExperience ? `${data.stats.yearsExperience} Years Exp` : "5+ Years Exp"}
                      </p>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lives in</p>
                      <p className="text-slate-800 text-lg font-extrabold mt-1 truncate">
                        {data?.personal?.location || "Earth"}
                      </p>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Looking for</p>
                      <p className="text-slate-800 text-lg font-extrabold mt-1 truncate">
                        {data?.personal?.title || "Software Engineer"}
                      </p>
                    </div>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Relationship Status</p>
                      <p className="text-slate-800 text-sm font-extrabold mt-1">
                        Committed to clean code ❤️
                      </p>
                    </div>
                  </div>

                  {/* Bio prompt */}
                  <div className="space-y-2 border-t border-rose-50 pt-6">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full">
                      💬 My Self Summary
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed pt-2">
                      {data?.personal?.bio || "Full stack developer who enjoys engineering fast, responsive interfaces, writing robust microservices, and solving customer problems."}
                    </p>
                  </div>

                  {/* Custom Prompt 1 */}
                  <div className="space-y-2 border-t border-rose-50 pt-6">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                      🔥 My Golden Rule
                    </span>
                    <p className="text-slate-700 font-semibold text-sm italic pt-2">
                      "{data?.personal?.tagline || "Always leave the playground cleaner than you found it."}"
                    </p>
                  </div>

                  {/* Custom Prompt 2 */}
                  <div className="space-y-2 border-t border-rose-50 pt-6">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      💡 Ideal First Match
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed pt-2">
                      Collaborating on real-world projects that improve user experience. I am motivated by complex frontend layouts, state machines, clean APIs, and elegant CSS. Let's connect and code!
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/50 border-t border-rose-50 flex gap-3">
                  <button
                    onClick={() => setActiveTab("skills")}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 shadow-md text-sm transition-all flex items-center justify-center gap-2"
                  >
                    View My Skills / Interests <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* SKILLS AS INTEREST BADGES */}
              <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-rose-100">
                <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold">My Interests & Badges</h2>
                    <p className="text-rose-100 text-xs">These are the stacks I swiped right on ⚡</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Interest Tags ({data?.skills?.length || 0})
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {data?.skills?.map((skill, index) => {
                      const name = typeof skill === "string" ? skill : skill.name;
                      const level = typeof skill === "string" ? 90 : (skill.level || skill.rating || 90);
                      const cat = typeof skill === "string" ? "Core" : (skill.category || skill.type || "Core");

                      // Define gradient styles based on indices or categories
                      const gradients = [
                        "from-rose-400 to-pink-500 text-white",
                        "from-orange-400 to-amber-500 text-white",
                        "from-indigo-400 to-blue-500 text-white",
                        "from-emerald-400 to-teal-500 text-white",
                        "from-purple-400 to-fuchsia-500 text-white"
                      ];
                      const styleClass = gradients[index % gradients.length];

                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`px-4 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r ${styleClass} shadow-sm border border-white/10 flex items-center gap-1.5 cursor-pointer`}
                        >
                          <Sparkles size={12} fill="currentColor" />
                          <span>{name}</span>
                          <span className="opacity-75 bg-black/20 rounded-full px-1.5 py-0.5 text-[9px]">
                            {level}%
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Skills summary footer */}
                  <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3 text-xs text-yellow-800 leading-relaxed items-start mt-4">
                    <Info size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Pro-tip:</span> These badges represent technical proficiency. Tap on matches below to view my live portfolio projects built using these technologies.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/50 border-t border-rose-50">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 shadow-md text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Swipe My Projects <Heart size={14} fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md flex flex-col items-center"
            >
              <div className="w-full text-center mb-4">
                <span className="px-3 py-1 bg-white/80 border border-rose-100 rounded-full text-xs font-bold text-rose-500 shadow-sm">
                  Project Cards
                </span>
              </div>

              {/* CARD DECK CONTAINER */}
              <div className="relative w-full aspect-[4/5] z-10 flex items-center justify-center">
                {projects.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center w-full h-full flex flex-col items-center justify-center">
                    <Heart size={48} className="text-rose-300 animate-pulse" />
                    <h3 className="font-extrabold text-slate-800 mt-4">No Projects Available</h3>
                    <p className="text-slate-500 text-sm mt-1">This user hasn't added projects yet.</p>
                  </div>
                ) : projectIndex >= projects.length ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                      <Sparkles size={36} fill="currentColor" />
                    </div>
                    <h3 className="font-black text-2xl text-slate-800">You've Swiped 'Em All!</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                      You've swiped through all of my projects. Reset the stack to review them again or check out my employment chats.
                    </p>
                    <button
                      onClick={() => setProjectIndex(0)}
                      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full shadow-md text-sm transition-all hover:opacity-90 flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw size={16} /> Reset Cards Stack
                    </button>
                  </motion.div>
                ) : (
                  projects.map((project, idx) => {
                    if (idx < projectIndex) return null;
                    const isTop = idx === projectIndex;
                    const indexOffset = idx - projectIndex;

                    return (
                      <ProjectCard
                        key={idx}
                        project={project}
                        isTop={isTop}
                        indexOffset={indexOffset}
                        onSwipeLeft={() => {
                          setProjectIndex(prev => prev + 1);
                          openSafeUrl(project.githubUrl);
                        }}
                        onSwipeRight={() => {
                          setProjectIndex(prev => prev + 1);
                          openSafeUrl(project.liveUrl);
                        }}
                        onPass={() => {
                          setProjectIndex(prev => prev + 1);
                        }}
                      />
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "chats" && (
            <motion.div
              key="chats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* CHATS DIRECT MESSAGES EXPERIENCE */}
              <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-rose-100 flex flex-col h-[75vh]">
                {/* Chat Header */}
                <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors lg:hidden"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold border-2 border-white/60">
                      {activeCompany?.company?.slice(0, 2)?.toUpperCase() || "CP"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-extrabold text-sm truncate">{activeCompany?.company || "Employment Chat"}</h3>
                    <p className="text-[10px] text-rose-100 truncate">{activeCompany?.role || "Software Engineer"}</p>
                  </div>
                  <div className="ml-auto text-xs text-rose-100 font-bold bg-white/25 px-2.5 py-0.5 rounded-full">
                    {activeCompany?.period || "Timeline"}
                  </div>
                </div>

                {/* Main chat bubbles content */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50 flex flex-col">
                  {experienceList.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                      <MessageCircle size={32} />
                      <p className="text-sm mt-2">No experience available.</p>
                    </div>
                  ) : (
                    <>
                      {/* Message 1 */}
                      <div className="flex gap-2 max-w-[85%] items-end">
                        <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-600">
                          {activeCompany?.company?.slice(0, 2)?.toUpperCase() || "CP"}
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-xs text-slate-700 leading-relaxed border border-rose-50/50">
                          Hey Alex! We match. Excited to chat. What was your role at <span className="font-bold">{activeCompany?.company || "Employer"}</span> and what did you focus on?
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="flex gap-2 max-w-[85%] items-end self-end justify-end">
                        <div className="bg-rose-500 text-white p-3 rounded-2xl rounded-br-none shadow-sm text-xs leading-relaxed">
                          Hey there! I worked as a <span className="font-bold">{activeCompany?.role || "Developer"}</span> from <span className="italic">{activeCompany?.period || "Timeline"}</span>. My main mission was driving frontend architecture, reducing rendering bottlenecks, and optimizing deployment systems.
                        </div>
                        <img
                          src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                          alt={data?.personal?.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-pink-400"
                        />
                      </div>

                      {/* Message 3 */}
                      <div className="flex gap-2 max-w-[85%] items-end">
                        <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-600">
                          {activeCompany?.company?.slice(0, 2)?.toUpperCase() || "CP"}
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-xs text-slate-700 leading-relaxed border border-rose-50/50">
                          Nice! Can you tell us more about the specific projects or achievements you delivered? Any key highlights?
                        </div>
                      </div>

                      {/* Message 4 */}
                      <div className="flex gap-2 max-w-[85%] items-end self-end justify-end">
                        <div className="bg-rose-500 text-white p-3 rounded-2xl rounded-br-none shadow-sm text-xs leading-relaxed space-y-2">
                          <p>{activeCompany?.description || "Here are some of the key milestones I accomplished:"}</p>
                          {activeCompany?.highlights && activeCompany.highlights.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-100">
                              {activeCompany.highlights.map((highlight, index) => (
                                <li key={index}>{highlight}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <img
                          src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                          alt={data?.personal?.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-pink-400"
                        />
                      </div>

                      {/* Message 5 */}
                      <div className="flex gap-2 max-w-[85%] items-end">
                        <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-600">
                          {activeCompany?.company?.slice(0, 2)?.toUpperCase() || "CP"}
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-xs text-slate-700 leading-relaxed border border-rose-50/50">
                          Impressive metrics! Let's match up and talk next steps. See you at the Match Connect panel!
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Chat Switcher Buttons */}
                {experienceList.length > 1 && (
                  <div className="p-3 bg-white border-t border-rose-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
                    <button
                      disabled={activeChatIdx === 0}
                      onClick={() => setActiveChatIdx(prev => prev - 1)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1 font-bold"
                    >
                      <ChevronLeft size={14} /> Previous Employer
                    </button>
                    <span className="font-semibold text-slate-400">
                      {activeChatIdx + 1} / {experienceList.length}
                    </span>
                    <button
                      disabled={activeChatIdx === experienceList.length - 1}
                      onClick={() => setActiveChatIdx(prev => prev + 1)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1 font-bold"
                    >
                      Next Employer <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "testimonials" && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              {/* TESTIMONIAL MATCHES INBOX */}
              <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-rose-100 flex flex-col h-[75vh]">
                <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-2xl font-extrabold">My Matches (Feedback)</h2>
                    <p className="text-rose-100 text-xs">Inbox recommendations from collaborators ⭐</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Testimonial bubbles */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50">
                  {testimonials.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                      <Star size={32} />
                      <p className="text-sm mt-2">No recommendations in inbox.</p>
                    </div>
                  ) : (
                    testimonials.map((testi, idx) => {
                      const isLeft = idx % 2 === 0;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex gap-3 max-w-[85%] items-end ${!isLeft ? "self-end justify-end ml-auto" : ""}`}
                        >
                          {isLeft && (
                            <img
                              src={testi.avatar || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=100&h=100&fit=crop`}
                              alt={testi.author}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-pink-400"
                            />
                          )}
                          <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed border ${
                            isLeft
                              ? "bg-white text-slate-700 border-rose-50/50 rounded-bl-none"
                              : "bg-rose-500 text-white border-rose-600 rounded-br-none"
                          }`}>
                            {/* Stars rating */}
                            <div className="flex gap-1 mb-2">
                              {[...Array(5)].map((_, starI) => (
                                <Star
                                  key={starI}
                                  size={10}
                                  fill="currentColor"
                                  className={isLeft ? "text-yellow-400" : "text-yellow-300"}
                                />
                              ))}
                            </div>
                            <p className="font-medium italic">"{testi.content}"</p>
                            <div className={`mt-2 font-bold text-[10px] text-right ${isLeft ? "text-slate-400" : "text-rose-200"}`}>
                              — {testi.author}, {testi.role}
                            </div>
                          </div>
                          {!isLeft && (
                            <img
                              src={testi.avatar || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=100&h=100&fit=crop`}
                              alt={testi.author}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-pink-400"
                            />
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 bg-rose-50/50 border-t border-rose-50 shrink-0">
                  <button
                    onClick={() => setActiveTab("match")}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 shadow-md text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Meet Me & Let's Match <Zap size={14} className="fill-currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "match" && (
            <motion.div
              key="match"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="w-full max-w-md"
            >
              {/* CONTACT - ITS A MATCH CARD */}
              <div className="bg-slate-900 rounded-[32px] p-6 md:p-8 text-center text-white border-2 border-pink-500 shadow-2xl relative overflow-hidden flex flex-col items-center">
                {/* Neon glow effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 space-y-6">
                  {/* Brand Flame Icon */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/40 mx-auto"
                  >
                    <Flame size={32} className="text-white fill-white" />
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-black italic tracking-tight bg-gradient-to-r from-rose-400 via-pink-500 to-red-400 bg-clip-text text-transparent drop-shadow-md">
                    It's a Match!
                  </h2>

                  <p className="text-slate-300 text-xs md:text-sm font-medium max-w-xs mx-auto">
                    You and <span className="font-extrabold text-white text-base block my-0.5">{data?.personal?.name || "the developer"}</span> have swiped right on each other. You look like a perfect tech match!
                  </p>

                  {/* Overlapping circular avatars */}
                  <div className="flex items-center justify-center -space-x-6 py-4">
                    {/* Dev avatar */}
                    <motion.div
                      initial={{ x: -60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-rose-500 shadow-xl relative z-10"
                    >
                      <img
                        src={data?.personal?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"}
                        alt={data?.personal?.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    {/* Pulse Heart */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-md relative z-20"
                    >
                      <Heart size={20} fill="currentColor" />
                    </motion.div>
                    {/* Recruiter Avatar */}
                    <motion.div
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-24 h-24 rounded-full bg-slate-800 border-4 border-pink-400 shadow-xl relative z-10 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <User size={36} className="text-slate-400 mx-auto" />
                        <span className="text-[10px] text-pink-400 font-bold block leading-none mt-1">HIRING</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Call to actions */}
                  <div className="space-y-3 pt-4">
                    <a
                      href={`mailto:${data?.socials?.email || "alex@example.com"}?subject=Tech Match Inquiry`}
                      className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold rounded-2xl hover:opacity-90 shadow-lg shadow-pink-500/20 text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={16} /> Let's Match ❤️
                    </a>

                    <div className="flex gap-2">
                      {data?.socials?.github && (
                        <a
                          href={data.socials.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Github size={14} /> GitHub
                        </a>
                      )}
                      {data?.socials?.linkedin && (
                        <a
                          href={data.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Linkedin size={14} /> LinkedIn
                        </a>
                      )}
                      {data?.socials?.twitter && (
                        <a
                          href={data.socials.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Twitter size={14} /> Twitter
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Reset Discovery */}
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="text-slate-400 hover:text-slate-200 text-xs font-semibold pt-4 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <RotateCcw size={12} /> Keep Swiping
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── MOBILE / TABLET BOTTOM NAVIGATION BAR ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-rose-100 flex items-center justify-around z-40 shadow-xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <Icon
                size={20}
                className={`transition-all ${
                  isActive ? "text-rose-500 scale-110 fill-rose-500/10" : "text-slate-400"
                }`}
              />
              <span className={`text-[9px] font-bold mt-1 tracking-tight transition-colors ${
                isActive ? "text-rose-500" : "text-slate-400"
              }`}>
                {tab.label === "Match Cards" ? "Cards" : tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabDotMobile"
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-rose-500"
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Interactive Project Swiper Card ──
function ProjectCard({ project, isTop, indexOffset, onSwipeLeft, onSwipeRight, onPass }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  const cardControls = useAnimation();

  // Color gradient map for tech badges
  const getBadgeColor = (techName) => {
    const sum = Array.from(techName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const classes = [
      "bg-rose-50 text-rose-600 border-rose-100",
      "bg-orange-50 text-orange-600 border-orange-100",
      "bg-indigo-50 text-indigo-600 border-indigo-100",
      "bg-emerald-50 text-emerald-600 border-emerald-100",
      "bg-purple-50 text-purple-600 border-purple-100"
    ];
    return classes[sum % classes.length];
  };

  const handleDragEnd = async (event, info) => {
    if (!isTop) return;
    const threshold = 120;
    if (info.offset.x > threshold) {
      // Swipe Right -> Match / Live
      await cardControls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      // Swipe Left -> Like / GitHub
      await cardControls.start({ x: -300, opacity: 0, transition: { duration: 0.2 } });
      onSwipeLeft();
    } else {
      // Return to center
      cardControls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 200, damping: 15 } });
    }
  };

  // Stamp opacity calculation when dragging
  const likeStampOpacity = useTransform(x, [-100, -20, 0], [1, 0, 0]);
  const matchStampOpacity = useTransform(x, [0, 20, 100], [0, 0, 1]);

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={cardControls}
      style={{
        x,
        y,
        rotate,
        opacity: isTop ? opacity : 1,
        zIndex: 50 - indexOffset,
        scale: isTop ? 1 : Math.max(0.95 - indexOffset * 0.03, 0.85),
        translateY: isTop ? 0 : indexOffset * -15
      }}
      className={`absolute w-full h-full bg-white rounded-[32px] border border-rose-100 shadow-xl overflow-hidden flex flex-col group transition-shadow select-none ${
        isTop ? "cursor-grab active:cursor-grabbing shadow-rose-300/10" : "pointer-events-none shadow-sm"
      }`}
    >
      {/* Visual Stamps Overlay when Dragging */}
      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeStampOpacity }}
            className="absolute top-8 right-8 z-30 border-4 border-rose-500 text-rose-500 font-black text-2xl uppercase tracking-widest px-3 py-1 rounded-xl rotate-[12deg] pointer-events-none"
          >
            LIKE (GitHub)
          </motion.div>
          <motion.div
            style={{ opacity: matchStampOpacity }}
            className="absolute top-8 left-8 z-30 border-4 border-emerald-500 text-emerald-500 font-black text-2xl uppercase tracking-widest px-3 py-1 rounded-xl rotate-[-12deg] pointer-events-none"
          >
            MATCH (Live)
          </motion.div>
        </>
      )}

      {/* Project Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"}
          alt={project.title}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        {/* Project Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
          <h3 className="text-xl font-extrabold drop-shadow-md">{project.title}</h3>
          <span className="text-[10px] uppercase font-extrabold text-pink-400 bg-pink-900/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-pink-500/30 inline-block mt-1">
            {project.category || "Development"}
          </span>
        </div>
      </div>

      {/* Description & Stacks */}
      <div className="p-5 flex-1 flex flex-col overflow-y-auto">
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4 select-text">
          {project.description || "Interactive web project showcasing responsive engineering and clean UI design."}
        </p>

        {/* Tech Badges */}
        <div className="mt-auto">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.techStack || project.technologies || project.tech || []).map((t, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${getBadgeColor(t)}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Buttons (only interactive on top card) */}
      <div className="p-4 bg-slate-50 border-t border-rose-50 flex items-center justify-around shrink-0">
        {/* Pass Button */}
        <button
          onClick={isTop ? onPass : undefined}
          className="w-10 h-10 bg-white hover:bg-rose-50 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center border border-gray-200 shadow-sm transition-all active:scale-95"
          title="Pass Card"
        >
          <X size={16} />
        </button>

        {/* Like Button (opens Github) */}
        <button
          onClick={isTop ? () => {
            onSwipeLeft();
          } : undefined}
          className="px-4 py-2 bg-white text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-1 text-xs font-extrabold shadow-sm transition-all active:scale-95"
          title="Like - GitHub"
        >
          <Heart size={12} fill="currentColor" /> Like (Git)
        </button>

        {/* Match Button (opens Live Link) */}
        <button
          onClick={isTop ? () => {
            onSwipeRight();
          } : undefined}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl flex items-center gap-1 text-xs font-extrabold shadow-md hover:opacity-90 transition-all active:scale-95"
          title="Match - Live Demo"
        >
          <ExternalLink size={12} /> Match (Live)
        </button>
      </div>
    </motion.div>
  );
}
