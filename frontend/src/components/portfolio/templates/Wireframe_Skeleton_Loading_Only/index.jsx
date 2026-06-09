import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Layers, GitBranch, Share2, 
  ExternalLink, Mail, Phone, MapPin, Check, 
  Sparkles, RefreshCw, Eye, ThumbsUp, Code 
} from 'lucide-react';
import dummyData from '../../../../data/dummy_data.json';
import { PortfolioContext } from '../../../../context/PortfolioContext';

/**
 * Wireframe Skeleton Loading Only Theme
 * A premium tech-blueprint style portfolio template that integrates
 * real user data inside a gorgeous wireframe outline with active
 * skeleton loading shimmers and interactive elements.
 */
export default function WireframeSkeletonLoadingOnly({ portfolioData: propPortfolioData }) {
  const contextPortfolioData = useContext(PortfolioContext);
  const portfolioData = contextPortfolioData || propPortfolioData;

  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadProgress, setLoadProgress] = useState(100);

  // Trigger loading animation simulation on refresh click
  const triggerRefreshSim = () => {
    setIsRefreshing(true);
    setLoadProgress(0);
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRefreshing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Merge AI data with dummyData
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };

  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ["Core", "Frontend", "Backend"];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: Math.floor(Math.random() * 20) + 75,
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  let projects = dummyData.projects;
  if (portfolioData?.projects?.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || 'Project',
      description: p.description || '',
      techStack: p.technologies || p.techStack || [],
      image: p.image || dummyData.projects[i % dummyData.projects.length].image,
      liveUrl: p.liveUrl || "#",
      githubUrl: p.githubUrl || "#"
    }));
  }

  const experience = portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;
  const testimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;
  const stats = portfolioData?.stats || dummyData.stats;

  // CSS styling classes for the wireframe blueprint theme
  const borderStyle = "border border-zinc-800/80 hover:border-zinc-700/80 transition-colors duration-300";
  const cyanGlow = "shadow-[0_0_15px_rgba(6,182,212,0.15)] border-cyan-500/40";
  const pulseClass = isRefreshing ? "animate-pulse" : "";

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-300 font-mono relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, white 1px, transparent 0),
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px, 80px 80px, 80px 80px'
        }}
      />

      {/* Cybernetic Accent Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none" />

      {/* Header Controls */}
      <header className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold tracking-widest text-zinc-100 uppercase">
            SYS.WF_TEMPLATE // v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Refresh Simulator */}
          <button 
            onClick={triggerRefreshSim}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-xs text-zinc-400 hover:text-cyan-400 transition-all cursor-pointer"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            SIMULATE LOAD ({loadProgress}%)
          </button>
        </div>
      </header>

      {/* Main Content Wrap */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* HERO SECTION */}
        <section className={`relative p-8 md:p-12 ${borderStyle} rounded-2xl bg-zinc-950/20 backdrop-blur-sm overflow-hidden`}>
          {/* Decorative Blueprint Crosshairs */}
          <div className="absolute top-2 left-2 text-zinc-800 text-[10px] select-none">+ TRACE_01</div>
          <div className="absolute bottom-2 right-2 text-zinc-800 text-[10px] select-none">SCALE_1:1</div>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-800" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-800" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-800" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-800" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold bg-cyan-950/30 px-2.5 py-1 border border-cyan-800/40 rounded">
                  Status: Online
                </span>
              </div>
              <h1 className={`text-4xl md:text-6xl font-extrabold text-zinc-100 ${pulseClass}`}>
                {isRefreshing ? '████████████' : personal.name}
              </h1>
              <p className={`text-lg md:text-2xl text-cyan-400/90 font-medium ${pulseClass}`}>
                {isRefreshing ? '██████████████████' : personal.title}
              </p>
              <p className={`text-zinc-500 max-w-xl leading-relaxed text-sm ${pulseClass}`}>
                {isRefreshing ? '██████████████████████████████████████████████████████████' : personal.tagline}
              </p>
            </div>
            
            {/* Visualizer Radar */}
            <div className="w-48 h-48 rounded-full border border-zinc-800 flex items-center justify-center relative bg-zinc-950/10">
              <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-zinc-900" />
              <div className="absolute w-[60%] h-[60%] rounded-full border border-zinc-900" />
              <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
              <div className="absolute inset-0 rounded-full border-t border-cyan-500/20 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="absolute bottom-3 text-[9px] text-zinc-600">RADAR_LINK: ACTIVE</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-900/60 flex flex-wrap gap-4 items-center">
            {socials.email && (
              <a href={`mailto:${socials.email}`} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-400 transition-colors">
                <Mail className="w-3.5 h-3.5" /> {socials.email}
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-400 transition-colors">
                <Code className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-cyan-400 transition-colors">
                <Cpu className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
          </div>
        </section>

        {/* STATS WIRE */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'PROJECTS_BUILT', val: stats?.projectsCompleted || 12 },
            { label: 'EXPERIENCE_YRS', val: stats?.experienceYears || '3+' },
            { label: 'TECH_STACKS', val: skills.length },
            { label: 'SYSTEM_LOAD', val: isRefreshing ? 'WAIT...' : 'NOMINAL' }
          ].map((st, i) => (
            <div key={i} className={`p-5 rounded-xl ${borderStyle} bg-zinc-950/10 flex flex-col justify-between h-28 relative overflow-hidden`}>
              <div className="absolute right-2 top-2 text-[8px] text-zinc-700">#0{i+1}</div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{st.label}</span>
              <span className={`text-2xl md:text-3xl font-bold text-zinc-100 ${pulseClass}`}>
                {isRefreshing ? '███' : st.val}
              </span>
            </div>
          ))}
        </section>

        {/* ABOUT & SKILLS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bio Box */}
          <div className={`md:col-span-2 p-6 rounded-xl ${borderStyle} bg-zinc-950/10 space-y-4 relative`}>
            <div className="absolute top-2 right-2 text-[9px] text-zinc-700">// BIO_DATA</div>
            <h2 className="text-lg font-bold text-zinc-200 border-b border-zinc-900 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> [01] ABSTRACT
            </h2>
            <p className={`text-zinc-400 text-sm leading-relaxed ${pulseClass}`}>
              {isRefreshing ? '██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████' : personal.bio}
            </p>
          </div>

          {/* Skills Radar List */}
          <div className={`p-6 rounded-xl ${borderStyle} bg-zinc-950/10 space-y-4 relative`}>
            <div className="absolute top-2 right-2 text-[9px] text-zinc-700">// CORE_ENGINE</div>
            <h2 className="text-lg font-bold text-zinc-200 border-b border-zinc-900 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> [02] CORE_SKILLS
            </h2>
            <div className="space-y-3">
              {skills.slice(0, 5).map((sk, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">{sk.name}</span>
                    <span className="text-cyan-400">{isRefreshing ? '██%' : `${sk.level || 90}%`}</span>
                  </div>
                  {/* Wireframe Progress Bar */}
                  <div className="h-2 w-full rounded border border-zinc-800 bg-zinc-950/40 overflow-hidden relative">
                    <div 
                      className="h-full bg-cyan-400/80 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      style={{ width: isRefreshing ? '0%' : `${sk.level || 90}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" /> [03] DESIGN_BLUEPRINTS
            </h2>
            <div className="flex gap-2">
              {['all', 'core', 'web'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1 rounded text-xs border uppercase ${
                    activeTab === cat 
                      ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400 font-bold' 
                      : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  } transition-all cursor-pointer`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((proj, idx) => (
              <div 
                key={idx} 
                className={`group rounded-xl ${borderStyle} bg-zinc-950/10 p-5 flex flex-col justify-between gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden`}
              >
                <div className="absolute right-2 top-2 text-[8px] text-zinc-800">PRJ-{100 + idx}</div>
                <div className="space-y-3">
                  {/* Blueprint outline placeholder for images */}
                  <div className="h-32 w-full border border-dashed border-zinc-800 rounded-lg flex items-center justify-center bg-zinc-950/30 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                    <span className="text-zinc-600 text-[10px] uppercase font-bold flex items-center gap-1.5 z-10">
                      <Code className="w-3.5 h-3.5" /> IMAGE_RENDER_HINT
                    </span>
                    {/* Active Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                  </div>
                  <h3 className={`font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors ${pulseClass}`}>
                    {isRefreshing ? '████████████' : proj.title}
                  </h3>
                  <p className={`text-zinc-500 text-xs leading-relaxed ${pulseClass}`}>
                    {isRefreshing ? '████████████████████████████████████████' : proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-900/60">
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-500 hover:text-cyan-400 transition-colors">
                        <Code className="w-3.5 h-3.5" /> CODE
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-cyan-500/70 hover:text-cyan-400 transition-colors">
                        LIVE <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE / EXPERIENCE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> [04] TIME_MATRIX
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Historical engineering timelines and legacy system implementations mapped to chronological markers.
            </p>
          </div>

          <div className="md:col-span-2 space-y-6 relative border-l border-zinc-800/60 pl-6 ml-2">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative group space-y-2">
                {/* Timeline node */}
                <div className="absolute left-[-29px] top-1.5 w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-cyan-400 transition-colors" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <h3 className={`font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors ${pulseClass}`}>
                    {isRefreshing ? '██████████████' : exp.role}
                  </h3>
                  <span className="text-zinc-500 font-semibold uppercase">{exp.duration || exp.period}</span>
                </div>
                
                <p className="text-cyan-500/80 text-xs font-semibold uppercase">{exp.company}</p>
                <p className={`text-zinc-400 text-xs leading-relaxed ${pulseClass}`}>
                  {isRefreshing ? '████████████████████████████████████████████████████████████████' : exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials && testimonials.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Share2 className="w-5 h-5 text-cyan-400" /> [05] ENDORSEMENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, 2).map((t, i) => (
                <div key={i} className={`p-5 rounded-xl ${borderStyle} bg-zinc-950/10 relative space-y-4`}>
                  <div className="absolute top-2 right-2 text-[8px] text-zinc-800">REF-{i+1}</div>
                  <p className={`text-zinc-400 text-xs italic leading-relaxed ${pulseClass}`}>
                    "{isRefreshing ? '████████████████████████████████████████████████████████████████' : t.content || t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase">
                      {t.name ? t.name[0] : 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-300">{t.name}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase">{t.role} {t.company && `@ ${t.company}`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WIREFRAME CONTACT */}
        <section className={`p-8 rounded-2xl ${borderStyle} bg-zinc-950/20 backdrop-blur-sm relative space-y-6 overflow-hidden`}>
          <div className="absolute top-2 right-2 text-[8px] text-zinc-800">// COMMS_INTERRUPT_VECTOR</div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> [06] ESTABLISH_LINK
            </h2>
            <p className="text-zinc-500 text-xs max-w-lg leading-relaxed">
              Initiate connection matrix. Outgoing payloads are routed dynamically through encrypted messaging components.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500">Sender_Identity</label>
                <input 
                  type="text" 
                  placeholder="Enter name..."
                  className="w-full bg-[#070709] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
                  disabled
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-zinc-500">Contact_Address</label>
                <input 
                  type="email" 
                  placeholder="Enter email..."
                  className="w-full bg-[#070709] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-zinc-500">Message_Payload</label>
              <textarea 
                rows="4" 
                placeholder="Enter message text..."
                className="w-full bg-[#070709] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50 resize-none"
                disabled
              />
            </div>
            <button 
              type="button" 
              className="px-4 py-2 border border-cyan-500/30 hover:border-cyan-500 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase rounded transition-all cursor-not-allowed opacity-50"
              disabled
            >
              TRANSMIT_DATA
            </button>
          </form>
        </section>

      </main>

      {/* Blueprint grid coordinates footer */}
      <footer className="border-t border-zinc-900 py-6 px-6 text-center text-[9px] text-zinc-600 flex justify-between items-center">
        <span>LOC: [WFS_01_GRID]</span>
        <span>COPYRIGHT_MATRIX // © {new Date().getFullYear()}</span>
        <span>SYS_OK: 200</span>
      </footer>
    </div>
  );
}
