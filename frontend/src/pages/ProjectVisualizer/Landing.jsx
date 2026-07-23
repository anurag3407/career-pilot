import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Search, Zap, Users, Bot, AlertTriangle, 
  ArrowRight, History, Loader2, Trash2, Clock, Star, GitFork, Package, BookOpen, BrainCircuit,
  CheckCircle2, Sparkles, Code2, Layers, Cpu, ShieldCheck, Terminal, HelpCircle, ChevronDown, Activity, RefreshCw, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { cn } from '../../lib/utils';

import Navbar from '../../components/Navbar';

export default function ProjectVisualizerLanding() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState('graph');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const navigate = useNavigate();
  const { setStatus, setAnalysisData, setRepoUrl, status, reset } = useProjectVisualizerStore();

  useEffect(() => {
    reset();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await projectVisualizerApi.getHistory();
      if (data?.success !== false && Array.isArray(data)) {
        setHistory(data);
      }
    } catch (e) {
      console.warn("Failed to load history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    try {
      await projectVisualizerApi.deleteHistory(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      toast.success('History item deleted');
    } catch (e) {
      toast.error('Failed to delete history');
    }
  };

  const handleSubmit = async (e, repoUrlToUse) => {
    if (e) e.preventDefault();
    const targetUrl = repoUrlToUse || url;
    
    if (!targetUrl || !targetUrl.includes('github.com')) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      setStatus('analyzing');
      setRepoUrl(targetUrl);
      
      toast.loading('Analyzing repository AST & module relationships...', { id: 'analyze' });
      
      const result = await projectVisualizerApi.analyze(targetUrl);
      
      toast.success('Architecture map generated successfully!', { id: 'analyze' });
      
      setAnalysisData(result);
      navigate(`/project-visualizer/dashboard/${result.sessionId}`);
      
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Failed to analyze repository', { id: 'analyze' });
    }
  };

  const presetRepos = [
    { label: 'facebook/react', url: 'https://github.com/facebook/react' },
    { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
    { label: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
    { label: 'torvalds/linux', url: 'https://github.com/torvalds/linux' }
  ];

  const features = [
    {
      title: "3D Architecture Graph",
      desc: "Interactive visual module dependency graph rendering files, imports, and cross-boundary function calls.",
      icon: <GitBranch className="w-6 h-6 text-cyan-400" />,
      badge: "3D Graph Engine",
      color: "from-cyan-500/20 via-cyan-500/10 to-transparent",
      borderColor: "hover:border-cyan-500/50"
    },
    {
      title: "Dependency Scanner",
      desc: "Automated inspection of node modules, lock files, and packages for known vulnerabilities and security flags.",
      icon: <Package className="w-6 h-6 text-amber-400" />,
      badge: "Security & Risk",
      color: "from-amber-500/20 via-amber-500/10 to-transparent",
      borderColor: "hover:border-amber-500/50"
    },
    {
      title: "Context-Aware Codebase AI",
      desc: "Ask deep questions, discover logic flows, and query exact line references with custom LLM embeddings.",
      icon: <Bot className="w-6 h-6 text-violet-400" />,
      badge: "AI Assistant",
      color: "from-violet-500/20 via-violet-500/10 to-transparent",
      borderColor: "hover:border-violet-500/50"
    },
    {
      title: "Mock Interview Practice",
      desc: "Generate targeted technical interview questions based directly on the repo's internal architecture.",
      icon: <BrainCircuit className="w-6 h-6 text-rose-400" />,
      badge: "Interview Prep",
      color: "from-rose-500/20 via-rose-500/10 to-transparent",
      borderColor: "hover:border-rose-500/50"
    },
    {
      title: "Automated Onboarding Wiki",
      desc: "Auto-generate comprehensive markdown guides, CONTRIBUTING.md, and architecture schematics in seconds.",
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      badge: "Developer Docs",
      color: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/50"
    },
    {
      title: "Code Hotspots & Complexity",
      desc: "Identify structural bottlenecks, circular dependencies, high-churn files, and missing unit test coverage.",
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      badge: "Quality Audit",
      color: "from-orange-500/20 via-orange-500/10 to-transparent",
      borderColor: "hover:border-orange-500/50"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to analyze a repository?",
      answer: "Most medium-to-large repositories are fully parsed in 5 to 12 seconds. Our AST parsing engine runs in parallel to extract module dependencies and file hierarchies almost instantly."
    },
    {
      question: "Does this work with private GitHub repositories?",
      answer: "Yes! Once you authenticate with your GitHub account, Project Visualizer can securely read private repos with zero code storage on our servers."
    },
    {
      question: "What programming languages are supported?",
      answer: "We support JavaScript, TypeScript, Python, Rust, Go, Java, C/C++, PHP, Ruby, Kotlin, and Swift out of the box."
    },
    {
      question: "Can I export the architecture diagrams?",
      answer: "Absolutely. You can export generated interactive graphs as High-Res SVG, PNG, or JSON formats to drop directly into your team docs or pull requests."
    },
    {
      question: "How does the AI Codebase Chat work?",
      answer: "We construct an AST and vector index of your repository files. When you ask a question, the AI looks up exact structural references and gives precise line-level explanations."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans relative">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="fixed top-1/3 right-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none z-0" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] z-0" 
        style={{ 
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Main Global Landing Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto pt-6 pb-12">
          
          {/* Top Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-md mb-8 hover:border-cyan-400/50 transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
              Next-Gen Neural Codebase Architecture
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            Turn Complex Repos Into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-sm">
              Interactive 3D Visual Maps
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
          >
            Instantly parse dependencies, generate module graphs, calculate health metrics, and chat directly with any GitHub codebase in seconds.
          </motion.p>

          {/* INPUT FORM CARD */}
          <motion.div
            id="analyzer-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <form onSubmit={(e) => handleSubmit(e)} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-700"></div>
              
              <div className="relative flex items-center bg-[#0d121d]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 shadow-2xl transition-all">
                <Search className="w-6 h-6 text-cyan-400 ml-3 mr-3 shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-white placeholder:text-slate-500 font-medium"
                  disabled={status === 'analyzing'}
                />
                <button
                  type="submit"
                  disabled={status === 'analyzing' || !url}
                  className={cn(
                    "ml-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all shrink-0 shadow-lg",
                    status === 'analyzing'
                      ? "bg-slate-800 cursor-not-allowed text-slate-400 border border-slate-700"
                      : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 hover:shadow-cyan-500/30 active:scale-95 border border-cyan-400/30"
                  )}
                >
                  {status === 'analyzing' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
                      <span>Parsing AST...</span>
                    </>
                  ) : (
                    <>
                      <span>Visualize</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Presets */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400"
          >
            <span className="font-medium text-slate-400 mr-1">Try famous repos:</span>
            {presetRepos.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(preset.url);
                  handleSubmit(null, preset.url);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all font-mono text-slate-300 flex items-center gap-1.5"
              >
                <GitBranch className="w-3 h-3 text-cyan-400" />
                {preset.label}
              </button>
            ))}
          </motion.div>

        </div>

        {/* INTERACTIVE DEMO PREVIEW CANVAS */}
        <motion.div 
          id="interactive-demo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-5xl mx-auto my-16 rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Header Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-xs text-slate-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                architect-canvas://demo-session-9842
              </span>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-medium">
              {[
                { id: 'graph', label: '3D Architecture Graph', icon: GitBranch },
                { id: 'calltree', label: 'Module Call Tree', icon: Layers },
                { id: 'health', label: 'Security & Health', icon: ShieldCheck },
                { id: 'chat', label: 'Code AI Assistant', icon: Bot }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                    activeTab === tab.id 
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="relative min-h-[380px] rounded-2xl bg-[#06080e] border border-white/5 p-6 flex flex-col justify-between overflow-hidden">
            
            {activeTab === 'graph' && (
              <div className="relative w-full h-full flex flex-col justify-between min-h-[340px]">
                {/* Node Graph Mockup */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                  <svg className="w-full h-full" viewBox="0 0 600 300">
                    <line x1="150" y1="150" x2="300" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    <line x1="150" y1="150" x2="300" y2="220" stroke="#818cf8" strokeWidth="2" />
                    <line x1="300" y1="80" x2="450" y2="150" stroke="#34d399" strokeWidth="2" />
                    <line x1="300" y1="220" x2="450" y2="150" stroke="#f472b6" strokeWidth="2" />
                  </svg>
                </div>

                {/* Floating Node Chips */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-cyan-300">src/server.ts</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <p className="text-xs text-slate-400">Entry point router & HTTP bootstrap layer</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-indigo-300">src/auth/service.ts</span>
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400">OAuth2 JWT handler & session store</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-emerald-300">src/db/prisma.ts</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400">Database connection pool & ORM client</p>
                  </motion.div>
                </div>

                {/* Bottom Canvas Stats Bar */}
                <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-6">
                    <span className="text-cyan-300">Nodes: 1,420</span>
                    <span className="text-indigo-300">Edges: 8,390</span>
                    <span className="text-emerald-300">Cyclomatic Rating: A+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Clean Architecture Verified
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calltree' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-cyan-300">
                  <span>ROOT → app.listen(3000)</span>
                  <span className="text-slate-500">12ms</span>
                </div>
                <div className="ml-4 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between text-slate-300">
                  <span>├── router.use('/api/v1/auth', authRouter)</span>
                  <span className="text-slate-500">4ms</span>
                </div>
                <div className="ml-8 p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-slate-300">
                  <span>│ └── passport.authenticate('github-jwt')</span>
                  <span className="text-slate-500">2ms</span>
                </div>
                <div className="ml-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-slate-300">
                  <span>└── router.use('/api/v1/visualize', visualizerRouter)</span>
                  <span className="text-slate-500">6ms</span>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">98/100</div>
                  <div className="text-xs text-slate-300">Security Score</div>
                  <div className="text-[10px] text-slate-400 mt-1">Zero CVE vulnerabilities</div>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">94.2%</div>
                  <div className="text-xs text-slate-300">Test Coverage</div>
                  <div className="text-[10px] text-slate-400 mt-1">214 Vitest assertions</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">Low</div>
                  <div className="text-xs text-slate-300">Technical Debt</div>
                  <div className="text-[10px] text-slate-400 mt-1">Well structured modules</div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">U</div>
                  <div>
                    <span className="font-semibold text-white">User:</span> How does authentication flow work in this codebase?
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 flex items-start gap-2">
                  <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-cyan-300">AI Assistant:</span> Authentication uses JWT tokens handled by <code className="bg-cyan-900/40 px-1 py-0.5 rounded font-mono text-cyan-300">src/auth/service.ts</code> line 42. Requests pass through <code className="bg-cyan-900/40 px-1 py-0.5 rounded font-mono text-cyan-300">middleware/auth.ts</code> before reaching controllers.
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* METRICS & PROOF BANNER */}
        <div className="py-12 border-y border-white/10 my-16 bg-white/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">500k+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Repos Analyzed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mb-1">99.8%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">AST Parsing Accuracy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-1">&lt; 8s</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Processing Time</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Developer Rating</div>
            </div>
          </div>
        </div>

        {/* FEATURE MATRIX GRID */}
        <div id="features" className="my-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Everything You Need to Understand Any Codebase
            </h2>
            <p className="text-slate-400 text-base">
              No more hours spent reading outdated README files. Get instantaneous visual maps and context-aware intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "relative p-7 rounded-2xl bg-[#0c101a]/80 border border-white/10 overflow-hidden group transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl",
                  feature.borderColor
                )}
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
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
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

        {/* HOW IT WORKS STEPPER */}
        <div className="my-24 max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Simple 3-Step Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-4 mb-12">
            How Project Visualizer Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { num: "01", title: "Paste Repository", desc: "Input any public or authenticated private GitHub repo URL." },
              { num: "02", title: "Neural Code Parsing", desc: "Our engine builds AST diagrams, call trees, and health metrics." },
              { num: "03", title: "Explore & Ask AI", desc: "Navigate interactive 3D graphs, inspect files, and chat with AI." }
            ].map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-[#0a0e17] border border-white/10 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-mono font-bold text-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ANALYSIS HISTORY */}
        {!isLoadingHistory && history.length > 0 && (
          <motion.div
            id="history"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto my-24"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <History className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Recent Analyses</h2>
                  <p className="text-xs text-slate-400">Quickly re-open your previously generated codebase maps</p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {history.length} Saved Sessions
              </span>
            </div>

            <div className="grid gap-4">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/project-visualizer/dashboard/${item.sessionId}`)}
                  className="group flex flex-wrap items-center justify-between p-5 rounded-2xl bg-[#0b0f19] border border-white/10 hover:border-cyan-500/40 hover:bg-[#0e1423] cursor-pointer transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <GitBranch className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        {item.repoOwner} / {item.repoName}
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(item.lastAnalyzed).toLocaleDateString()}
                        </span>
                        {item.github?.stars !== undefined && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                            {item.github.stars} stars
                          </span>
                        )}
                        {item.stats?.totalFiles !== undefined && (
                          <span className="flex items-center gap-1 font-mono text-cyan-400">
                            <GitFork className="w-3.5 h-3.5" />
                            {item.stats.totalFiles} files
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      View Map
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistory(item._id, e)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete history entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ ACCORDION */}
        <div id="faq" className="my-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Questions & Answers
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
                  className="rounded-2xl bg-[#090d16] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180 text-cyan-400")} />
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

        {/* HIGH-CONVERTING CTA BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-indigo-950/60 border border-cyan-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl my-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Visualize Your First Codebase?
            </h2>
            <p className="text-slate-300 text-base mb-8">
              Paste your GitHub repository link and get an interactive architecture map in under 10 seconds.
            </p>
            <a
              href="#analyzer-form"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 text-cyan-200" />
              Get Started Now — It's Free
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
