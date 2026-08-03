import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Sparkles, ArrowRight, CheckCircle2, Zap, Layout, Globe, Code2, 
  BarChart3, Star, GitFork, Cpu, ShieldCheck, Terminal, HelpCircle, ChevronDown, 
  Layers, ExternalLink, RefreshCw, Eye, Sparkle, UserCheck, Flame, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

import Navbar from '../../components/Navbar';

export default function GithubPortfolioLanding() {
  const [username, setUsername] = useState('');
  const [activeTheme, setActiveTheme] = useState('dark-fluid');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    const handle = username.replace('@', '').trim();
    if (!handle) {
      toast.error('Please enter a GitHub username');
      return;
    }
    toast.success(`Fetching GitHub data for @${handle}...`);
    navigate(`/github-portfolio/build?username=${handle}`);
  };

  const presetHandles = ['gaearon', 'shadcn', 'sindresorhus', 'torvalds'];

  const themes = [
    {
      id: 'dark-fluid',
      name: 'Minimal Dark Fluid',
      tag: 'Most Popular',
      desc: 'Sleek dark gradient glassmorphism with smooth glowing accents and floating cards.',
      color: 'from-blue-600/30 to-purple-600/30',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 'neon-cityscape',
      name: 'Neon Cityscape',
      tag: 'Cyberpunk',
      desc: 'Vibrant neon cyan & magenta glows designed for web3, game, and frontend devs.',
      color: 'from-cyan-500/30 to-fuchsia-500/30',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'terminal-os',
      name: 'Terminal Skills',
      tag: 'Hacker Aesthetic',
      desc: 'Retro green & amber monospaced terminal environment with live shell commands.',
      color: 'from-emerald-600/30 to-teal-600/30',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'swiss-typography',
      name: 'Swiss Typography',
      tag: 'Editorial Clean',
      desc: 'Bold modernist grid layout focusing on heavy typography and high-contrast spacing.',
      color: 'from-slate-600/30 to-zinc-600/30',
      badgeColor: 'text-slate-300 bg-slate-500/10 border-slate-500/20'
    }
  ];

  const features = [
    {
      title: "Automated GitHub OAuth Sync",
      desc: "Connect once. Your portfolio automatically updates whenever you push commits, star repos, or create releases.",
      icon: <Github className="w-6 h-6 text-purple-400" />,
      badge: "Live Sync",
      color: "from-purple-500/20 via-purple-500/10 to-transparent"
    },
    {
      title: "AI README & Bio Extractor",
      desc: "Our neural parser extracts key features, tech stacks, and screenshots directly from your project README markdown files.",
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      badge: "AI Powered",
      color: "from-cyan-500/20 via-cyan-500/10 to-transparent"
    },
    {
      title: "Contribution Heatmap Matrix",
      desc: "Display an interactive, beautifully styled version of your GitHub commit activity matrix with streak metrics.",
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      badge: "Analytics",
      color: "from-emerald-500/20 via-emerald-500/10 to-transparent"
    },
    {
      title: "30+ Award-Winning Themes",
      desc: "Switch between glassmorphism, terminal shell, minimal dark, and editorial layouts with a single click.",
      icon: <Palette className="w-6 h-6 text-rose-400" />,
      badge: "Customization",
      color: "from-rose-500/20 via-rose-500/10 to-transparent"
    },
    {
      title: "1-Click Custom Domain Deploy",
      desc: "Deploy directly to Vercel, Netlify, GitHub Pages, or attach your personal domain with zero setup friction.",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      badge: "Instant Deploy",
      color: "from-blue-500/20 via-blue-500/10 to-transparent"
    },
    {
      title: "Recruiter Engagement Insights",
      desc: "Track visitor traffic, recruiter profile views, PDF resume downloads, and top-performing project cards.",
      icon: <Eye className="w-6 h-6 text-amber-400" />,
      badge: "Telemetry",
      color: "from-amber-500/20 via-amber-500/10 to-transparent"
    }
  ];

  const faqs = [
    {
      question: "Is the GitHub Portfolio Generator free?",
      answer: "Yes! Creating your portfolio site, syncing with GitHub, and picking from 30+ themes is 100% free with unlimited hosting."
    },
    {
      question: "Can I use my own custom domain?",
      answer: "Absolutely. You can link any custom domain (e.g., alexsmith.dev) with automatic SSL certificate provisioning."
    },
    {
      question: "Do I need to manually update my projects?",
      answer: "Never. Whenever you push new commits or create repos on GitHub, your portfolio updates automatically in real-time."
    },
    {
      question: "Can I hide specific repositories?",
      answer: "Yes, you have full control to curate, reorder, pin, or hide any repository from appearing on your public portfolio page."
    },
    {
      question: "How does the AI README parsing work?",
      answer: "We analyze your repository's README file, extract code blocks, hero images, badges, and project highlights to generate a beautiful showcase card."
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden font-sans relative">
      
      {/* Background Glow Orbs */}
      <div className="fixed top-0 right-1/4 translate-x-1/2 w-[700px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="fixed bottom-0 left-1/4 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '11s' }} />
      
      {/* Grid Mesh Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.12] z-0" 
        style={{ 
          backgroundImage: `radial-gradient(#a855f7 1px, transparent 1px)`, 
          backgroundSize: '36px 36px' 
        }} 
      />

      {/* Main Global Landing Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto pt-6 pb-12">
          
          {/* Floating Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-md mb-8 hover:border-purple-400/50 transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold tracking-wide text-purple-300 uppercase">
              🚀 Automated GitHub-to-Portfolio Engine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            Turn Your Repositories Into a <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400">
              $100k Developer Portfolio
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
          >
            Automatically curate your top commits, star counts, language stats, contribution heatmaps, and live deployments into a portfolio recruiters love.
          </motion.p>

          {/* USERNAME INPUT FORM CARD */}
          <motion.div
            id="generator-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <form onSubmit={handleGenerate} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-65 transition duration-700"></div>
              
              <div className="relative flex items-center bg-[#0e0c18]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 shadow-2xl transition-all">
                <Github className="w-6 h-6 text-purple-400 ml-3 mr-3 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username (e.g. gaearon)"
                  className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-white placeholder:text-slate-500 font-medium"
                />
                <button
                  type="submit"
                  className="ml-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/30 active:scale-95 transition-all shrink-0 shadow-lg flex items-center gap-2 border border-purple-400/30"
                >
                  <span>Build Portfolio</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Preset Handle Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400"
          >
            <span className="font-medium text-slate-400 mr-1">Preview famous devs:</span>
            {presetHandles.map((handle, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUsername(handle);
                  navigate(`/github-portfolio/build?username=${handle}`);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-purple-300 transition-all font-mono text-slate-300 flex items-center gap-1.5"
              >
                <Github className="w-3 h-3 text-purple-400" />
                @{handle}
              </button>
            ))}
          </motion.div>

        </div>

        {/* LIVE DEMO PORTFOLIO PREVIEW WIDGET */}
        <motion.div 
          id="live-preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-5xl mx-auto my-16 rounded-3xl bg-[#0b0a16]/90 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Window Bar & Theme Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-xs text-slate-400">
                https://alex-dev.careerpilot.app
              </span>
            </div>

            {/* Live Theme Toggle Chips */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-medium">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTheme === t.id 
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Portfolio Window */}
          <div className={cn(
            "relative min-h-[380px] rounded-2xl border p-6 flex flex-col justify-between transition-all duration-500 overflow-hidden",
            activeTheme === 'dark-fluid' && "bg-[#070913] border-purple-500/30",
            activeTheme === 'neon-cityscape' && "bg-[#050c18] border-cyan-500/40 shadow-cyan-500/10 shadow-2xl",
            activeTheme === 'terminal-os' && "bg-[#05120a] border-emerald-500/40 font-mono",
            activeTheme === 'swiss-typography' && "bg-[#0c0d12] border-slate-700"
          )}>

            {/* Profile Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-500 p-0.5 shadow-lg">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexDev" 
                    alt="Dev Avatar" 
                    className="w-full h-full rounded-[14px] bg-slate-900"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Alex Rivera
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">Senior Full Stack Engineer & OSS Contributor</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">📍 San Francisco, CA • Open to opportunities</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Available for Hire
                </span>
              </div>
            </div>

            {/* Contribution Matrix Simulation */}
            <div className="my-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>1,840 commits in 2026</span>
                <span className="text-purple-400 font-semibold">Top 1% Contributor</span>
              </div>
              <div className="grid grid-cols-24 sm:grid-cols-32 gap-1 p-3 rounded-xl bg-black/40 border border-white/5">
                {Array.from({ length: 48 }).map((_, i) => {
                  const levels = ['bg-slate-800', 'bg-purple-900/60', 'bg-purple-600', 'bg-purple-400'];
                  const level = levels[i % 4];
                  return <div key={i} className={cn("w-full h-3 rounded-xs transition-transform hover:scale-125", level)} />;
                })}
              </div>
            </div>

            {/* Repositories Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    neural-vector-db
                  </span>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    1.4k
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">High-performance Rust vector search engine with SIMD acceleration.</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Rust</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">C++</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    react-flow-architect
                  </span>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    890
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">Drag-and-drop node graph canvas for microservice architecture.</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">React</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* METRICS & RECRUITER PROOF BANNER */}
        <div className="py-12 border-y border-white/10 my-16 bg-white/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">3x</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">More Recruiter Inquiries</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1">100%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Automated Sync</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mb-1">30+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Award-Winning Themes</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">&lt; 60s</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Build & Deploy Time</div>
            </div>
          </div>
        </div>

        {/* THEMES CAROUSEL GRID */}
        <div id="themes" className="my-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Curated Layouts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Explore 30+ Premium Portfolio Themes
            </h2>
            <p className="text-slate-400 text-base">
              Match your aesthetic — whether you want minimalist luxury, hacker terminal, or modern cyberpunk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {themes.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-7 rounded-2xl bg-[#0c0a18] border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 shadow-xl"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", t.color)} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn("text-xs font-bold px-3 py-1 rounded-full border", t.badgeColor)}>
                      {t.tag}
                    </span>
                    <button 
                      onClick={() => navigate('/github-portfolio/build')}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Use Theme <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {t.name}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {t.desc}
                  </p>

                  <div className="w-full h-24 rounded-xl bg-black/50 border border-white/5 p-3 flex flex-col justify-between font-mono text-[10px] text-slate-400">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>alex-rivera.dev</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-16 rounded bg-purple-500/40" />
                      <div className="h-2 w-10 rounded bg-cyan-500/40" />
                      <div className="h-2 w-12 rounded bg-indigo-500/40" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FEATURE MATRIX GRID */}
        <div id="features" className="my-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Designed to Get You Noticed by Tech Lead Recruiters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative p-7 rounded-2xl bg-[#0b0916] border border-white/10 overflow-hidden group transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 backdrop-blur-xl"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", feature.color)} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WORKFLOW STEPPER */}
        <div className="my-24 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Fast Setup
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 mb-12">
            3 Clicks to Live Deployment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Connect GitHub", desc: "Authenticate with 1-click GitHub OAuth." },
              { num: "02", title: "Select & Curate Repos", desc: "Pick your best repositories, pinned projects, and bio." },
              { num: "03", title: "Pick Theme & Deploy", desc: "Publish instantly with custom domain support." }
            ].map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-[#0b0916] border border-white/10 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center shadow-lg shadow-purple-500/20 mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div id="faq" className="my-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-[#090714] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-purple-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180 text-purple-400")} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CONVERSION CTA */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-blue-950/60 border border-purple-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl my-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Upgrade Your Developer Brand?
            </h2>
            <p className="text-slate-300 text-base mb-8">
              Connect your GitHub account and launch your automated portfolio in less than 60 seconds.
            </p>
            <button
              onClick={() => navigate('/github-portfolio/build')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 border border-purple-400/30"
            >
              <Github className="w-5 h-5 text-purple-200" />
              Connect GitHub & Build Free
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
