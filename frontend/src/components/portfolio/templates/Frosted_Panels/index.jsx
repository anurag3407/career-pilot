import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Mail,
  MapPin,
  Terminal,
  Cpu,
  Sparkles,
  Fingerprint,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Compass,
  Database,
  Cloud,
  Layers,
  Award,
  ExternalLink,
  Briefcase,
  Quote,
  Send,
  MessageSquare,
  CheckCircle,
  BadgeCheck,
  User,
  Code2,
  Palette,
  Layers3,
  BriefcaseBusiness,
  CalendarDays,
  Phone
} from 'lucide-react';

/**
 * Frosted Panels Portfolio Template (Glass / Modern UI)
 * Theme: Refined Balanced Light-Dark Glassmorphism with Tighter Spacing & Unified Frosted styling
 * Visual elements adjusted for ultimate polish:
 * - Background: 135deg light-slate-blue gradient (#ece8f5 to #dde4f2 to #eef1f8)
 * - Section Spacing: Tighter (py-16 md:py-20, mb-8 headers, gap-6 lists)
 * - Glass Cards: bg-white/25, backdrop-blur-xl, border-white/40, rounded-3xl, shadow-lg
 * - Navbar: bg-white/40, backdrop-blur-2xl, border-white/50
 * - Background connection: Absolute background panels connecting the user's flow
 */
export default function FrostedPanels() {
  const { portfolioData: data } = usePortfolio();

  const [activeSection, setActiveSection] = useState('home');
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle sticky navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  // Soft pastel glass themes for skill categories using optimized colors and bg-white/25
  const getCategoryTheme = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('front')) {
      return {
        bg: 'bg-white/25 bg-gradient-to-br from-[#4f46e5]/5 to-[#4f46e5]/8',
        border: 'border-white/40',
        glow: 'shadow-lg hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]',
        text: 'text-[#4f46e5]',
        accent: '#4f46e5',
        accentLight: 'rgba(139, 92, 246, 0.2)',
        bar: 'bg-gradient-to-r from-[#4f46e5] to-[#0ea5e9]',
        icon: <Code2 className="w-4 h-4 text-[#4f46e5]" />
      };
    } else if (cat.includes('back')) {
      return {
        bg: 'bg-white/25 bg-gradient-to-br from-teal-500/5 to-emerald-500/8',
        border: 'border-white/40',
        glow: 'shadow-lg hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)]',
        text: 'text-teal-600',
        accent: '#14b8a6',
        accentLight: 'rgba(20, 184, 166, 0.2)',
        bar: 'bg-gradient-to-r from-teal-500 to-emerald-400',
        icon: <Database className="w-4 h-4 text-teal-600" />
      };
    } else if (cat.includes('dev') || cat.includes('ops')) {
      return {
        bg: 'bg-white/25 bg-gradient-to-br from-[#0ea5e9]/5 to-[#0ea5e9]/8',
        border: 'border-white/40',
        glow: 'shadow-lg hover:shadow-[0_8px_30px_rgba(76,201,255,0.12)]',
        text: 'text-sky-600',
        accent: '#0ea5e9',
        accentLight: 'rgba(76, 201, 255, 0.2)',
        bar: 'bg-gradient-to-r from-[#0ea5e9] to-[#4f46e5]',
        icon: <Cloud className="w-4 h-4 text-sky-600" />
      };
    } else {
      return {
        bg: 'bg-white/25 bg-gradient-to-br from-[#6366f1]/5 to-[#6366f1]/8',
        border: 'border-white/40',
        glow: 'shadow-lg hover:shadow-[0_8px_30px_rgba(255,95,210,0.12)]',
        text: 'text-[#6366f1]',
        accent: '#6366f1',
        accentLight: 'rgba(255, 95, 210, 0.2)',
        bar: 'bg-gradient-to-r from-[#6366f1] to-[#4f46e5]',
        icon: <Palette className="w-4 h-4 text-[#6366f1]" />
      };
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div
      className="min-h-screen text-[#1b1435] font-sans overflow-x-hidden relative selection:bg-indigo-200 selection:text-indigo-900"
    >
      {/* Full-page fixed background so gradient+blobs cover the whole scrollable page */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, #ece9f6 0%, #dde6f4 45%, #edf2fb 100%)' }} />

      {/* ========================================================================= */}
      {/* 0. DYNAMIC GRADIENT BACKGROUND BLOBS (Pink #6366f1, Purple #4f46e5, Blue #0ea5e9) */}
      {/* ========================================================================= */}
      {/* Fixed blobs — covers full scrollable page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,20,53,0.012)_1px,transparent_1px)] [background-size:32px_32px] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_60%)]" />

        {/* Indigo Glow Blob — top-left */}
        <motion.div
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[450px] md:w-[800px] h-[450px] md:h-[800px] rounded-full bg-gradient-to-br from-[#6366f1]/20 via-[#818cf8]/15 to-[#4f46e5]/8 blur-[100px] md:blur-[140px] opacity-70"
        />

        {/* Sky Blue Glow Blob — top-right */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.92, 1.12, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[-5%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-gradient-to-tr from-[#0ea5e9]/20 via-[#38bdf8]/15 to-[#4f46e5]/10 blur-[100px] md:blur-[130px] opacity-65"
        />

        {/* Indigo Glow Blob — mid-left */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 40, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[45%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#4f46e5]/15 to-[#6366f1]/8 blur-[110px] md:blur-[140px] opacity-60"
        />

        {/* Sky Blue Accent Glow — bottom-right */}
        <motion.div
          animate={{
            x: [0, -20, 20, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[75%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#0ea5e9]/12 blur-[120px] opacity-50"
        />

        {/* Extra indigo blob — lower section depth */}
        <motion.div
          animate={{
            x: [0, 25, -15, 0],
            y: [0, 20, -25, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[130%] left-[30%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6366f1]/12 to-[#0ea5e9]/8 blur-[140px] opacity-55"
        />
      </div>



      {/* ========================================================================= */}
      {/* 1. FLOATING FROSTED GLASS NAVBAR (bg-white/40, blur-2xl, border-white/50) */}
      {/* ========================================================================= */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav className={`w-full max-w-6xl bg-white/20 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] px-6 py-3.5 flex items-center justify-between transition-all duration-500 relative group hover:bg-white/30 hover:border-white/50 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] ${scrolled ? 'bg-white/35 backdrop-blur-3xl shadow-xl' : ''}`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Left: Brand / Logo */}
          <a href="#home" className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#4f46e5] to-[#0ea5e9] p-[2px] shadow-[0_2px_10px_rgba(139,92,247,0.15)] flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-sm tracking-tight text-[#1b1435]">
                {data.personal.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <span className="font-black text-[#1b1435] tracking-tight text-lg hover:text-[#4f46e5] transition-colors duration-300">
              {data.personal.name}
            </span>
          </a>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 relative z-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setActiveSection(link.id)}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-colors duration-300 relative text-[#5f6885] hover:text-[#1b1435]"
                >
                  <span className="relative z-10">{link.label}</span>

                  {hoveredLink === link.id && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 rounded-full bg-[#1b1435]/[0.04] border border-white/40"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute bottom-0 left-3 right-3 lg:left-4 lg:right-4 h-[2px] bg-gradient-to-r from-[#6366f1] to-[#0ea5e9] shadow-[0_1px_8px_rgba(255,95,210,0.4)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: Glass Style Contact Button */}
          <div className="hidden md:block relative z-10">
            <motion.a
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${data.socials.email}`}
              className="relative inline-flex items-center gap-2 px-4.5 py-1.5 lg:px-5.5 lg:py-2.5 rounded-full border border-white/50 bg-white/30 text-xs lg:text-sm font-extrabold tracking-wide text-[#1b1435] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] transition-all backdrop-blur-xl duration-300"
            >
              <Mail className="w-4 h-4 text-[#4f46e5]" />
              <span>Let's Talk</span>
            </motion.a>
          </div>

          {/* Hamburger Mobile Menu Toggle Button */}
          <div className="md:hidden relative z-20">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/50 border border-white/40 text-[#1b1435] hover:bg-white/80 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden rounded-3xl border border-white/50 bg-white/95 backdrop-blur-2xl p-6 shadow-xl flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-between ${activeSection === link.id
                    ? 'bg-gradient-to-r from-[#6366f1]/5 to-[#4f46e5]/5 border border-[#4f46e5]/10 text-[#4f46e5]'
                    : 'text-[#5f6885] hover:text-[#1b1435] hover:bg-slate-50'
                    }`}
                >
                  <span>{link.label}</span>
                  {activeSection === link.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] shadow-[0_0_8px_rgba(255,95,210,0.5)]" />
                  )}
                </a>
              ))}
            </div>
            <div className="h-[1px] bg-slate-100 my-1" />
            <a
              href={`mailto:${data.socials.email}`}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9] text-white font-bold text-center text-sm tracking-wide shadow-md hover:shadow-indigo-500/15 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact via Email</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. HERO / LANDING SECTION (Reduced spacing: pt-24 pb-16 md:pt-32 md:pb-20) */}
      {/* ========================================================================= */}
      <section
        id="home"
        className="relative min-h-screen lg:h-screen lg:max-h-screen flex items-center pt-32 lg:pt-24 pb-8 px-6 max-w-6xl mx-auto z-10 lg:overflow-hidden scroll-mt-24 lg:scroll-mt-28"
      >
        {/* Giant Typographic Background Watermark from Image 2 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span
            className="text-[15vw] font-black tracking-tighter uppercase opacity-[0.07] text-[#1b1435] leading-none whitespace-nowrap"
            style={{
              WebkitTextStroke: '2px rgba(27, 20, 53, 0.35)',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {data.personal.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center w-full relative z-10">

          {/* Left Hero Column - Left aligned perfectly with logo */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-3 lg:space-y-3.5 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[11px] font-bold text-[#4f46e5] tracking-wide shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <MapPin className="w-3 h-3 text-[#6366f1]" />
              <span className="opacity-95">{data.personal.location}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-0.5 select-none"
            >
              <p className="text-[#6366f1] text-xs font-extrabold uppercase tracking-widest pl-1 font-mono">
                {data.personal.tagline || "Creative Technologist"}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-[1.08] text-[#1b1435]">
                <span className="block font-medium text-slate-400 text-xs sm:text-sm lg:text-base tracking-normal mb-0.5">
                  Hi, my name is
                </span>
                <span className="block bg-gradient-to-r from-[#1b1435] via-[#4f46e5] to-[#6366f1] bg-clip-text text-transparent pb-1">
                  {data.personal.name}
                </span>
                <span className="block mt-0.5 tracking-tight font-black text-[#1b1435] opacity-20">
                  {data.personal.title.split('&')[0].trim()}
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[#5f6885] text-xs sm:text-sm md:text-sm lg:text-base leading-relaxed max-w-xl font-normal"
            >
              {data.personal.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-2.5 w-full sm:w-auto"
            >
              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#projects"
                className="w-full sm:w-auto text-center px-5 py-3 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9] text-white font-bold text-xs tracking-wider shadow-[0_4px_15px_rgba(255,95,210,0.12)] hover:shadow-[0_4px_20px_rgba(255,95,210,0.2)] transition-all flex items-center justify-center gap-1.5 group"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, y: -1, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="w-full sm:w-auto text-center px-5 py-3 rounded-2xl border border-white/40 bg-white/25 text-[#1b1435] font-bold text-xs tracking-wider backdrop-blur-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Get In Touch</span>
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 border-t border-slate-200/50 w-full max-w-xl"
            >
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                ].map((avatarUrl, idx) => (
                  <div key={idx} className="w-7.5 h-7.5 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={avatarUrl} alt="Client avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-7.5 h-7.5 rounded-full border-2 border-white bg-gradient-to-r from-[#6366f1] to-[#4f46e5] flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                  +{data.stats.happyClients || 32}
                </div>
              </div>
              <div className="text-[#5f6885] text-[11px] leading-snug">
                <span className="text-[#1b1435] font-bold">Trusted by global partners.</span>
                <span className="block mt-0.5 opacity-90">
                  Delivered over {data.stats.projectsCompleted || 48} premium platforms with {data.stats.yearsExperience || 5}+ years of experience.
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Premium Right-Aligned Frosted Glass Panels Stack */}
          <div className="lg:col-span-5 w-full flex flex-col items-center lg:items-end justify-center mt-8 lg:mt-0 relative z-10">
            {/* Glowing colorful background sphere */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#6366f1]/15 via-[#4f46e5]/12 to-[#0ea5e9]/15 blur-[55px] pointer-events-none z-0" />

            {/* Centered Cards Stack with identical widths */}
            <div className="flex flex-col gap-4 w-full max-w-[370px] relative z-10">

              {/* Card 1: Profile Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-full bg-white/40 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(27,20,53,0.06)] p-4.5 cursor-default select-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/5 via-white/15 to-transparent pointer-events-none rounded-2xl" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative flex-shrink-0">
                    <img
                      src={data.personal.avatar}
                      alt={data.personal.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white/85 shadow-sm"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow-sm" />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="text-sm font-black text-[#1b1435] leading-tight truncate">{data.personal.name}</h3>
                    <p className="text-[11px] text-[#4f46e5] font-semibold leading-snug mt-0.5 truncate">{data.personal.title.split('&')[0].trim()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6366f1] flex-shrink-0" />
                      <span className="text-[10px] text-[#5f6885] font-sans leading-none truncate">{data.personal.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Stats Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-full bg-white/40 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(27,20,53,0.06)] p-4.5 cursor-default select-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none rounded-2xl" />
                <div className="grid grid-cols-3 gap-2 divide-x divide-white/35 relative z-10">
                  {[
                    { label: 'Projects', value: data.stats.projectsCompleted || 48 },
                    { label: 'Clients', value: data.stats.happyClients || 32 },
                    { label: 'Years', value: data.stats.yearsExperience || 5 }
                  ].map((s, i) => (
                    <div key={i} className="text-center px-2">
                      <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4f46e5] to-[#6366f1] block leading-none">{s.value}+</span>
                      <span className="text-[9px] text-[#5f6885] uppercase tracking-wider font-sans block mt-1.5">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3: Capabilities Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="w-full bg-white/40 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(27,20,53,0.06)] p-4.5 cursor-default select-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0ea5e9]/4 via-white/10 to-transparent pointer-events-none rounded-2xl" />
                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
                      <Cpu className="w-3 h-3 text-[#6366f1]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4f46e5] font-sans">Capabilities</span>
                    <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-sans font-semibold">LIVE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {data.skills.slice(0, 4).map((skill, i) => (
                      <div key={i} className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#1b1435] font-semibold font-sans truncate max-w-[65px]">{skill.name}</span>
                          <span className="text-[9px] text-[#4f46e5] font-bold font-sans">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/50 border border-white/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#0ea5e9]"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT SECTION (Reduced padding py-16 md:py-20, header mb-8)              */}
      {/* ========================================================================= */}
      <section
        id="about"
        className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto z-10 relative flex items-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <span
            className="text-[100px] sm:text-[180px] md:text-[240px] font-black tracking-widest opacity-[0.03]"
            style={{
              WebkitTextStroke: '2px rgba(27, 20, 53, 0.4)',
              WebkitTextFillColor: 'transparent'
            }}
          >
            JOURNEY
          </span>
        </div>

        {/* Dynamic soft pink/blue vector mountain overlay in background */}
        <div className="absolute bottom-0 right-0 left-0 h-[280px] md:h-[450px] overflow-hidden pointer-events-none opacity-40 z-0">
          <svg viewBox="0 0 1440 400" className="absolute bottom-0 w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400L280 200L510 320L850 110L1150 250L1440 90V400H0Z" fill="url(#mountainGradIndigo)" opacity="0.18" />
            <path d="M150 400L450 160L800 280L1180 120L1440 210V400H150Z" fill="url(#mountainGradSky)" opacity="0.15" />
            <defs>
              <linearGradient id="mountainGradIndigo" x1="720" y1="90" x2="720" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="1" stopColor="#dde4f2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mountainGradSky" x1="795" y1="120" x2="795" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" stopOpacity="0.25" />
                <stop offset="1" stopColor="#dde4f2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center w-full z-10">

          {/* Left Column: Overlapping Glass Panels */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[380px] sm:h-[450px] w-full">

            {/* Primary Portrait Card (bg-white/30, blur-2xl, border border-white/50, shadow-xl, rounded-3xl) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute left-2 sm:left-0 bottom-4 w-[170px] sm:w-[280px] h-[220px] sm:h-[350px] bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-300 hover:bg-white/35 hover:shadow-2xl p-3 overflow-hidden group/avatar z-10 sm:z-20 hover:z-30"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500 ease-out scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#dde4f2]/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#4f46e5] font-mono flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Creator Profile</span>
                  </span>
                  <p className="text-[#1b1435] text-sm font-black">{data.personal.name}</p>
                </div>
              </div>
            </motion.div>

            {/* Secondary Scenic Card (bg-white/30, blur-2xl, border border-white/50, shadow-xl, rounded-3xl) */}
            <motion.div
              initial={{ opacity: 0, y: -40, x: 40 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-2 sm:right-0 top-4 w-[130px] sm:w-[220px] h-[170px] sm:h-[280px] bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-300 hover:bg-white/35 hover:shadow-2xl p-3 z-20 sm:z-10 hover:z-30"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gradient-to-tr from-sky-200/50 via-indigo-100/50 to-indigo-100/50">
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.8),transparent_60%)] z-10" />
                <div className="absolute bottom-0 inset-x-0 h-28 bg-[#6366f1]/10 blur-md rounded-full pointer-events-none" />
                <div className="absolute bottom-4 inset-x-0 h-24 bg-[#0ea5e9]/15 blur-md rounded-full pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop"
                  alt="Scenic peaks reference"
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 text-left z-20">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-[#0ea5e9] font-mono">Inspiration</span>
                  <p className="text-[#1b1435] text-xs font-black leading-tight">Live On Your Own Terms</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8 z-10">
            <div className="space-y-3">
              <span className="text-[#6366f1] text-xs md:text-sm font-extrabold uppercase tracking-widest pl-1 font-mono">
                About Me
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435] leading-tight">
                Crafting With <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Precision & Design</span>
              </h2>
            </div>

            {/* About Card: bg-white/25, backdrop-blur-xl, border border-white/40, rounded-3xl, shadow-lg */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white/25 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />

              <p className="text-[#5f6885] text-base md:text-lg leading-relaxed font-normal">
                {data.personal.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5f6885] uppercase block tracking-wider font-semibold font-mono">Current Base</span>
                    <span className="text-sm font-bold text-[#1b1435]">{data.personal.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5f6885] uppercase block tracking-wider font-semibold font-mono">Key Focus</span>
                    <span className="text-sm font-bold text-[#1b1435]">{data.personal.title.split('&')[1]?.trim() || "Creative Engineering"}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="border-l-2 border-[#6366f1] pl-4 py-1.5 text-left">
              <p className="text-[#5f6885] italic text-sm md:text-base font-light">
                "{data.personal.tagline || 'Building the future, one elegant line of code at a time.'}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SKILLS SECTION (Reduced padding py-16 md:py-20, header mb-8)            */}
      {/* ========================================================================= */}
      <section
        id="skills"
        className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto z-10 relative flex flex-col justify-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="space-y-3 text-center md:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-xs font-semibold text-[#4f46e5] tracking-wide font-mono shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>Tech Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435]">
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Capabilities</span>
          </h2>
          <p className="text-[#5f6885] text-base max-w-2xl font-normal">
            A comprehensive matrix of technologies and toolsets I specialize in. Rendered as 3D layered pastel block cards.
          </p>
        </div>

        {/* Unified Gap-6 grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {data.skills.map((skill, index) => {
            const theme = getCategoryTheme(skill.category);
            const isHovered = hoveredSkill === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredSkill(index)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="relative bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl p-6 cursor-default select-none flex flex-col justify-between overflow-hidden group hover:scale-[1.02]"
                style={{
                  boxShadow: isHovered ? `0 12px 30px -4px ${theme.accentLight}` : ''
                }}
              >
                <div
                  className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: theme.accent }}
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[8px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full border border-white/60 bg-white/70 font-mono ${theme.text}`}
                    >
                      {skill.category}
                    </span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/40 border border-white/60 group-hover:border-white/80 transition-colors shadow-inner">
                      {theme.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#1b1435] group-hover:translate-x-0.5 transition-transform duration-300 text-left">
                    {skill.name}
                  </h3>
                </div>

                <div className="mt-8 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#5f6885]/80 uppercase tracking-widest">PROFICIENCY</span>
                    <span className={`font-extrabold ${theme.text}`}>{skill.level}%</span>
                  </div>

                  {/* Clean Horizontal Glass Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-white/40 border border-white/60 overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full ${theme.bar} relative`}
                      style={{ boxShadow: `0 0 8px ${theme.accentLight}` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite] -translate-x-full" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROJECTS SECTION (Reduced padding py-16 md:py-20, header mb-8, gap-6)   */}
      {/* ========================================================================= */}
      <section
        id="projects"
        className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto z-10 relative flex flex-col justify-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="space-y-3 text-center md:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-xs font-semibold text-[#4f46e5] tracking-wide font-mono shadow-sm">
            <Layers3 className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435]">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Projects</span>
          </h2>
          <p className="text-[#5f6885] text-base max-w-2xl font-normal">
            A grid of client platforms and production-ready applications I've engineered from scratch.
          </p>
        </div>

        {/* Refined gap-6 layout and frosted class bg-white/25, rounded-3xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {data.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className="group/proj bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-300 hover:bg-white/35 hover:shadow-2xl flex flex-col justify-between cursor-pointer select-none overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

              <div className="space-y-4">
                {/* Project Image Panel */}
                <div className="h-48 overflow-hidden relative border-b border-slate-100 bg-slate-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover/proj:scale-105 transition-all duration-500 grayscale-[10%] group-hover/proj:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.9),transparent_60%)]" />

                  {/* Glowing tags */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    {project.techStack.slice(0, 2).map((tech, idx) => (
                      <span key={idx} className="text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-white/80 backdrop-blur border border-white/80 font-mono text-[#4f46e5] shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-3 text-left">
                  <h3 className="text-xl font-extrabold text-[#1b1435] group-hover/proj:text-[#6366f1] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#5f6885] text-sm leading-relaxed font-normal line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Project Card Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-200/30 mt-4">
                <div className="flex gap-2">
                  {project.techStack.slice(2, 4).map((tech, idx) => (
                    <span key={idx} className="text-[9px] font-mono text-[#5f6885]/80">
                      #{tech.toLowerCase()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1, color: '#6366f1' }}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5f6885] hover:text-[#1b1435]"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, color: '#0ea5e9' }}
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5f6885] hover:text-[#1b1435]"
                    title="Launch Live Platform"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EXPERIENCE SECTION (Reduced padding py-16 md:py-20, header mb-8, gap-6)  */}
      {/* ========================================================================= */}
      <section
        id="experience"
        className="py-16 md:py-20 px-6 md:px-12 max-w-5xl mx-auto z-10 relative flex flex-col justify-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="space-y-3 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-xs font-semibold text-[#4f46e5] tracking-wide font-mono shadow-sm">
            <BriefcaseBusiness className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435]">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Journey</span>
          </h2>
          <p className="text-[#5f6885] text-base max-w-xl mx-auto font-normal">
            A comprehensive log of my engineering and leadership milestones at global tech teams.
          </p>
        </div>

        {/* Timeline track (gap-6 structure) */}
        <div className="relative pl-6 md:pl-8 border-l border-slate-300 space-y-6 text-left">
          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group/exp"
            >
              {/* Glowing timeline node */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#dde4f2] border-2 border-[#6366f1] group-hover/exp:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(255,95,210,0.3)]" />

              {/* Experience Card: bg-white/30, backdrop-blur-2xl, border border-white/50, shadow-xl, rounded-3xl */}
              <div className="bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl hover:scale-[1.01] p-6 md:p-8 space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-[#1b1435] group-hover/exp:text-[#6366f1] transition-colors">
                      {exp.role}
                    </h3>
                    <span className="text-sky-600 font-bold text-sm tracking-wide">{exp.company}</span>
                  </div>
                  <span className="px-3.5 py-1 rounded-full border border-white/40 bg-white/25 backdrop-blur-xl text-xs font-semibold text-[#4f46e5] tracking-wider font-mono w-fit flex items-center gap-1.5 shadow-sm">
                    <CalendarDays className="w-3.5 h-3.5 text-[#6366f1]" />
                    {exp.period}
                  </span>
                </div>

                <p className="text-[#5f6885] font-normal text-sm md:text-base leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIALS SECTION (Reduced padding py-16 md:py-20, header mb-8, gap-6)*/}
      {/* ========================================================================= */}
      <section
        id="testimonials"
        className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto z-10 relative flex flex-col justify-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="space-y-3 text-center md:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-xs font-semibold text-[#4f46e5] tracking-wide font-mono shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>Testimonial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435]">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Reviews</span>
          </h2>
          <p className="text-[#5f6885] text-base max-w-2xl font-normal">
            Genuine accounts of projects delivered ahead of schedule and collaborations that built beautiful platforms.
          </p>
        </div>

        {/* Testimonials Card: bg-white/25, backdrop-blur-xl, border-white/40, shadow-lg, rounded-3xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {data.testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl hover:scale-[1.01] p-6 md:p-8 flex flex-col justify-between items-start text-left relative overflow-hidden group/test"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none" />
              <Quote className="w-10 h-10 text-[#6366f1]/10 group-hover/test:text-[#6366f1]/25 transition-colors duration-300 absolute right-6 top-6" />

              <p className="text-[#5f6885] italic text-sm md:text-base leading-relaxed font-normal mb-6 z-10 relative pl-2 border-l border-slate-200">
                "{test.text}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/40 w-full z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-250 bg-white shadow-sm">
                  <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[#1b1435] font-extrabold text-sm md:text-base">{test.name}</h4>
                  <span className="text-[#5f6885] text-xs md:text-sm font-light font-mono block mt-0.5">{test.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CONTACT / FOOTER SECTION (Reduced padding py-16 md:py-20, gap-6)        */}
      {/* ========================================================================= */}
      <section
        id="contact"
        className="py-16 md:py-20 px-6 md:px-12 max-w-6xl mx-auto z-10 relative flex flex-col justify-center scroll-mt-24 lg:scroll-mt-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-start w-full">

          {/* Left Contact Details Panel */}
          <div className="lg:col-span-5 text-left space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-xs font-semibold text-[#4f46e5] tracking-wide font-mono shadow-sm">
                <Mail className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <span>Get in touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1b1435] leading-tight">
                Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#0ea5e9]">Extraordinary</span>
              </h2>
              <p className="text-[#5f6885] text-sm md:text-base font-normal leading-relaxed max-w-md">
                Have a project idea, query, or want to integrate creative systems? Send a message and let's collaborate.
              </p>
            </div>

            {/* Micro Details Cards: bg-white/30, backdrop-blur-2xl, border border-white/50, rounded-3xl, shadow-xl */}
            <div className="space-y-4 max-w-md">
              <a
                href={`mailto:${data.socials.email}`}
                className="flex items-center gap-4 p-4 bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl group hover:scale-[1.01]"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-[#6366f1]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#5f6885] uppercase tracking-wider block font-semibold font-mono">Direct Email</span>
                  <span className="text-sm font-extrabold text-[#1b1435] group-hover:text-[#6366f1] transition-colors">{data.socials.email}</span>
                </div>
              </a>

              <a
                href={`tel:${data.socials.phone || "+15551234567"}`}
                className="flex items-center gap-4 p-4 bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl group hover:scale-[1.01]"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-[#4f46e5]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#5f6885] uppercase tracking-wider block font-semibold font-mono">Phone</span>
                  <span className="text-sm font-extrabold text-[#1b1435] group-hover:text-[#4f46e5] transition-colors">{data.socials.phone || "+1 (555) 123-4567"}</span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl group">
                <div className="w-11 h-11 rounded-xl bg-sky-500/5 border border-sky-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#5f6885] uppercase tracking-wider block font-semibold font-mono">Location</span>
                  <span className="text-sm font-extrabold text-[#1b1435]">{data.personal.location}</span>
                </div>
              </div>
            </div>

            {/* Social Medias Frosted Row (bg-white/30, border border-white/50) */}
            <div className="flex gap-3">
              {[
                { icon: <Github className="w-5 h-5" />, href: data.socials.github, title: 'GitHub' },
                { icon: <Linkedin className="w-5 h-5" />, href: data.socials.linkedin, title: 'LinkedIn' },
                { icon: <Twitter className="w-5 h-5" />, href: data.socials.twitter, title: 'Twitter' }
              ].map((soc, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  title={soc.title}
                  className="w-11 h-11 bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-300 hover:bg-white/35 hover:shadow-2xl flex items-center justify-center text-[#5f6885] hover:text-[#1b1435]"
                >
                  {soc.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Fully functional Frosted Contact Form: bg-white/25, backdrop-blur-xl, border-white/40, shadow-lg */}
          <div className="lg:col-span-7 w-full z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent pointer-events-none" />

              <h3 className="text-xl sm:text-2xl font-black text-[#1b1435] text-left pl-1 border-b border-slate-200/30 pb-4">
                Message Portal
              </h3>

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center gap-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/5 border border-green-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <CheckCircle className="w-8 h-8 text-green-500 animate-bounce" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">Transmission Successful</h4>
                    <p className="text-[#5f6885] text-sm max-w-xs font-normal">
                      Your message has been beamed securely. I will reach out to you shortly. Thank you!
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleFormSubmit}
                    className="space-y-4 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#5f6885] uppercase tracking-widest pl-1 font-mono font-semibold">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/20 focus:bg-white/40 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all text-sm font-normal shadow-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#5f6885] uppercase tracking-widest pl-1 font-mono font-semibold">Your Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/20 focus:bg-white/40 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all text-sm font-normal shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#5f6885] uppercase tracking-widest pl-1 font-mono font-semibold">Your Message</label>
                      <textarea
                        required
                        rows="5"
                        placeholder="Say hi or describe your project requirements in detail..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/20 focus:bg-white/40 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all text-sm font-normal shadow-sm resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-sky-500 hover:from-indigo-600 hover:via-indigo-600 hover:to-sky-600 text-white font-extrabold text-sm tracking-wider shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 group mt-6"
                    >
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Footer — Frosted Glass Panel */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 w-full bg-white/30 backdrop-blur-2xl border-t border-l border-white/50 border-r border-b border-white/35 rounded-3xl shadow-xl transition-all duration-350 hover:bg-white/35 hover:shadow-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/10 pointer-events-none rounded-3xl" />

          {/* Left: Brand */}
          <div className="text-left z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#818cf8] via-[#4f46e5] to-[#38bdf8] p-[1.5px] flex items-center justify-center shadow-sm">
                <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                  <span className="text-[7px] font-black text-[#4f46e5]">
                    {data.personal.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <span className="text-sm font-black text-[#1b1435] tracking-tight">{data.personal.name}</span>
            </div>
            <p className="text-[11px] text-[#5f6885] font-normal pl-8">
              Crafting beautiful digital experiences.
            </p>
            <p className="text-[10px] text-[#5f6885]/70 font-mono pl-8 mt-0.5">
              &copy; 2026 {data.personal.name}. All rights reserved.
            </p>
          </div>

          {/* Middle: Social Icons */}
          <div className="flex items-center gap-3 z-10">
            {[
              { icon: <Github className="w-4 h-4" />, href: data.socials.github, title: 'GitHub' },
              { icon: <Linkedin className="w-4 h-4" />, href: data.socials.linkedin, title: 'LinkedIn' },
              { icon: <Mail className="w-4 h-4" />, href: `mailto:${data.socials.email}`, title: 'Email' }
            ].map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-white/25 backdrop-blur-xl border border-white/40 rounded-xl flex items-center justify-center text-[#5f6885] hover:text-[#1b1435] hover:bg-white/40 transition-all duration-300"
                title={soc.title}
              >
                {soc.icon}
              </a>
            ))}
          </div>

          {/* Right: Nav Links */}
          <div className="flex items-center gap-1 z-10">
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#5f6885] hover:text-[#1b1435] hover:bg-white/50 transition-all duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.footer>
      </section>

    </div>
  );
}
