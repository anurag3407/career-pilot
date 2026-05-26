import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Files, Search, GitBranch, Settings, ChevronRight, ChevronDown, 
  Terminal, Code, User, Briefcase, FolderGit2, MessageSquare, 
  Mail, Menu, X, Link2, Github, Linkedin, Twitter, Globe, Info
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const VSCodeTheme = () => {
  // Navigation mapping using standard VS Code file structure simulation
  const tabs = [
    { id: 'hero', name: 'welcome.json', icon: <Code size={14} className="text-amber-400" /> },
    { id: 'about', name: 'about_me.md', icon: <User size={14} className="text-sky-400" /> },
    { id: 'skills', name: 'skills.ts', icon: <Info size={14} className="text-teal-400" /> },
    { id: 'projects', name: 'projects.json', icon: <FolderGit2 size={14} className="text-emerald-400" /> },
    { id: 'experience', name: 'experience.csv', icon: <Briefcase size={14} className="text-purple-400" /> },
    { id: 'testimonials', name: 'testimonials.graphql', icon: <MessageSquare size={14} className="text-pink-400" /> },
    { id: 'contact', name: 'contact.html', icon: <Mail size={14} className="text-red-400" /> }
  ];

  const [activeTab, setActiveTab] = useState('hero');
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Rendering simulated structural syntax highlighted containers
  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6 font-mono selection:bg-purple-500/30">
            <span className="text-slate-500 text-sm block">// Hit absolute entry initialization views</span>
            <div className="text-purple-400 text-sm">
              <span className="text-blue-400">const</span> portfolioMeta <span className="text-slate-300">=</span> <span className="text-yellow-400">{'{'}</span>
            </div>
            <div className="pl-6 space-y-2 text-sm sm:text-base">
              <div>
                <span className="text-sky-400">"developerName"</span>: <span className="text-emerald-300">"{data.personal.name}"</span>,
              </div>
              <div>
                <span className="text-sky-400">"professionalTitle"</span>: <span className="text-emerald-300">"{data.personal.title}"</span>,
              </div>
              <div>
                <span className="text-sky-400">"metricsSummary"</span>: <span className="text-yellow-400">{'{'}</span>
                <div className="pl-6 text-slate-300">
                  <span className="text-sky-400">"experienceYears"</span>: <span className="text-amber-400">{data.stats.yearsExperience}</span>,
                  <br />
                  <span className="text-sky-400">"projectsCompleted"</span>: <span className="text-amber-400">{data.stats.projectsCompleted}</span>,
                  <br />
                  <span className="text-sky-400">"happyClients"</span>: <span className="text-amber-400">{data.stats.happyClients}</span>
                </div>
                <span className="text-yellow-400">{'}'}</span>,
              </div>
              <div>
                <span className="text-sky-400">"status"</span>: <span className="text-emerald-300">"Open for structural contributions"</span>
              </div>
            </div>
            <div className="text-yellow-400 text-sm">{'}'};</div>
            
            <div className="pt-8 max-w-xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {data.personal.name}
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-purple-400 font-medium">
                {data.personal.title}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-lg border border-purple-400/20 transition-all duration-200 shadow-lg shadow-purple-600/10 hover:scale-[1.02]"
                >
                  cat projects.json
                </button>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-5 py-2.5 rounded-lg border border-slate-700 transition-all duration-200 hover:scale-[1.02]"
                >
                  initiate_contact.sh
                </button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="prose prose-invert font-sans max-w-3xl selection:bg-sky-500/30">
            <div className="font-mono text-slate-500 text-sm mb-4"># Profile / Biography Summary</div>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
              {data.personal.avatar && (
                <img 
                  src={data.personal.avatar} 
                  alt={data.personal.name} 
                  className="w-32 h-32 rounded-2xl object-cover ring-2 ring-sky-500/30 bg-slate-800 shadow-xl border border-slate-700/50 shrink-0" 
                />
              )}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">{data.personal.name}</h2>
                <p className="text-slate-300 leading-relaxed text-base">
                  {data.personal.bio}
                </p>
                <div className="font-mono text-xs text-sky-400 bg-sky-950/40 border border-sky-800/30 px-3 py-2 rounded-lg">
                  📍 Location baseline: {data.personal.location || 'Distributed Node Network'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-8 font-mono selection:bg-teal-500/30">
            <span className="text-slate-500 text-sm block">// Mapped technical capability sets</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-100 font-medium text-sm">{skill.name}</span>
                    <span className="text-xs text-teal-400 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-900/40">
                      {skill.category || 'Core Tech'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level || 85}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6 font-mono selection:bg-emerald-500/30">
            <span className="text-slate-500 text-sm block">// Array outputs from showcase repository matrix</span>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-emerald-500/20 transition-all duration-200 shadow-xl group">
                  {project.image && (
                    <div className="relative h-44 overflow-hidden bg-slate-950 border-b border-slate-800/60">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm font-sans text-slate-400 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech, tIdx) => (
                            <span key={tIdx} className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-4 border-t border-slate-800/80 pt-3 text-xs">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
                            <Link2 size={13} /> Deploy
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
                            <Github size={13} /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6 font-mono selection:bg-purple-500/30">
            <span className="text-slate-500 text-sm block">// Chronological execution stack</span>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-slate-800">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-10 group">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 group-hover:bg-purple-400 transition-colors z-10" />
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2 hover:border-purple-500/20 transition-all">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{exp.role}</h3>
                        <span className="text-sm text-purple-400 font-medium">{exp.company}</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700/50">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-sans text-slate-300 leading-relaxed pt-2">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6 font-mono selection:bg-pink-500/30">
            <span className="text-slate-500 text-sm block">// Peer validation data loops</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.testimonials.map((test, index) => (
                <div key={index} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4 shadow-md hover:border-pink-500/20 transition-all">
                  <p className="text-sm font-sans text-slate-300 italic leading-relaxed">
                    "{test.text}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-slate-800/60 pt-3">
                    {test.avatar && (
                      <img src={test.avatar} alt={test.name} className="w-9 h-9 rounded-full bg-slate-800 object-cover" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{test.name}</h4>
                      <span className="text-xs text-pink-400">{test.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6 font-mono selection:bg-red-500/30 max-w-xl">
            <span className="text-slate-500 text-sm block">// Input gateway channel interface</span>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 bg-slate-900/40 border border-slate-800 p-6 rounded-xl">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">client_nameString:</label>
                <input 
                  type="text" 
                  placeholder="Enter your query descriptor" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-slate-600 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">routing_returnEmail:</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-slate-600 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">payload_messageBuffer:</label>
                <textarea 
                  rows={4}
                  placeholder="Compile communication log strings here..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-slate-600 font-mono resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600/90 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-md shadow-red-900/10 hover:scale-[1.01]"
              >
                transmit_packet.cmd
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col antialiased select-none font-mono text-sm">
      {/* Structural IDE Header Top-Bar Area */}
      <header className="bg-[#3c3c3c] h-9 shrink-0 flex items-center justify-between px-3 border-b border-[#2b2b2b] text-xs text-slate-400 z-30">
        <div className="flex items-center gap-2">
          <Menu 
            size={16} 
            className="md:hidden text-slate-300 cursor-pointer hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <div className="flex gap-1.5 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 font-medium hidden sm:inline text-slate-300">CareerPilot IDE — Portfolio System Container</span>
        </div>
        <div className="text-[#858585] text-[11px] hidden md:block">
          {data.personal.name.toLowerCase().replace(/\s+/g, '_')}_workspace
        </div>
      </header>

      {/* Primary Inner Layout Workspace Frame Wrapper */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Side Activity Sidebar Node Columns */}
        <aside className="w-12 bg-[#333333] shrink-0 border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 z-20">
          <div className="space-y-4 w-full flex flex-col items-center">
            <button 
              onClick={() => setExplorerOpen(!explorerOpen)}
              className={`p-2 w-full flex justify-center border-l-2 transition-colors duration-150 ${explorerOpen ? 'border-purple-500 text-white bg-slate-800/40' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              title="Toggle Workspace Explorer"
            >
              <Files size={20} />
            </button>
            <div className="text-slate-600 hover:text-slate-400 p-2 cursor-not-allowed">
              <Search size={20} />
            </div>
            <div className="text-slate-600 hover:text-slate-400 p-2 cursor-not-allowed">
              <GitBranch size={20} />
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="text-slate-500 hover:text-slate-300 p-2 cursor-pointer transition-colors">
              <Settings size={20} />
            </div>
          </div>
        </aside>

        {/* Dynamic Nested Explorer Hierarchy Drawer Panel */}
        <AnimatePresence>
          {explorerOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="bg-[#252526] shrink-0 border-r border-[#2b2b2b] hidden md:flex flex-col overflow-hidden whitespace-nowrap"
            >
              <div className="h-9 px-3 flex items-center justify-between uppercase tracking-wider text-[11px] font-bold text-slate-400 bg-[#202020]/40">
                <span>Explorer Matrix</span>
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1 text-slate-300 font-bold px-1 py-1 text-xs">
                  <ChevronDown size={14} className="text-slate-400" />
                  <span>WORKSPACE_ROOT</span>
                </div>
                <div className="pl-3 space-y-0.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${activeTab === tab.id ? 'bg-purple-900/30 text-purple-300 border-l-2 border-purple-500 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2a2b]'}`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Dynamic Route Menu Panel Sheet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute inset-y-0 left-12 w-64 bg-[#252526] border-r border-[#2b2b2b] md:hidden flex flex-col z-40 shadow-2xl"
            >
              <div className="h-10 px-4 flex items-center justify-between border-b border-[#2b2b2b]">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">File Directory</span>
                <X size={16} className="text-slate-400 cursor-pointer hover:text-white" onClick={() => setMobileMenuOpen(false)} />
              </div>
              <div className="p-3 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all ${activeTab === tab.id ? 'bg-purple-900/40 text-purple-300 border-l-2 border-purple-500 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Editor Engine Viewport Layout Split Window */}
        <main className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden min-w-0">
          {/* Top Active Session Tab Buffers Bar */}
          <div className="bg-[#2d2d2d] h-9 border-b border-[#252526] flex overflow-x-auto scrollbar-none shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`h-full flex items-center gap-2 px-4 border-r border-[#252526] transition-all relative shrink-0 text-xs ${activeTab === tab.id ? 'bg-[#1e1e1e] text-white border-t-2 border-purple-500 font-medium' : 'bg-[#2d2d2d] text-slate-500 hover:bg-[#2a2a2a] hover:text-slate-300'}`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80 ml-1" />}
              </button>
            ))}
          </div>

          {/* Dynamic Active File View Body Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full min-w-0"
            >
              {renderTabContent()}
            </motion.div>
          </div>

          {/* Terminal / Output Panel Diagnostics Console Simulation Panel */}
          <section className="h-40 bg-[#181818] border-t border-[#2b2b2b] flex flex-col shrink-0 min-w-0 font-mono">
            <div className="h-8 bg-[#1e1e1e] border-b border-[#2b2b2b] px-4 flex items-center gap-6 text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5 text-slate-200 border-b-2 border-purple-500 h-full px-1 font-semibold cursor-pointer">
                <Terminal size={12} />
                <span>terminal</span>
              </div>
              <div className="text-slate-600 cursor-not-allowed">problems</div>
              <div className="text-slate-600 cursor-not-allowed">output</div>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-xs space-y-1.5 text-slate-300 selection:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">career-pilot-shell</span>
                <span className="text-slate-500">on</span>
                <span className="text-emerald-400">🌐 live-node-cluster</span>
                <span className="text-slate-400">[~]</span>
              </div>
              <div className="text-slate-500">
                $ curl -sS https://api.{data.personal.name.toLowerCase().replace(/\s+/g, '')}.dev/social_mesh
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-slate-400">
                {data.socials.email && (
                  <a href={`mailto:${data.socials.email}`} className="flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Mail size={12} /> {data.socials.email}
                  </a>
                )}
                {data.socials.github && (
                  <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Github size={12} /> GitHub Link
                  </a>
                )}
                {data.socials.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-400 transition-colors">
                    <Linkedin size={12} /> LinkedIn Profile
                  </a>
                )}
                {data.socials.twitter && (
                  <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                    <Twitter size={12} /> Twitter Profile
                  </a>
                )}
              </div>
              <div className="text-slate-600 text-[11px] pt-2 animate-pulse">
                // System monitoring: 0 warnings, compilation complete. Ready for integration.
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Interface Status Banner Bar */}
      <footer className="bg-purple-700 h-6 shrink-0 flex items-center justify-between px-3 text-[11px] text-purple-100 font-medium z-30 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-purple-800 px-2 h-full flex items-center gap-1 cursor-pointer hover:bg-purple-900 transition-colors">
            <GitBranch size={11} />
            <span>main</span>
          </div>
          <div className="hidden sm:inline-block text-purple-200">
            ✓ Synchronization: Verified Production Build
          </div>
        </div>
        <div className="flex items-center gap-4 text-purple-200">
          <div>UTF-8</div>
          <div className="hidden sm:block">Spaces: 2</div>
          <div>React (JSX)</div>
        </div>
      </footer>
    </div>
  );
};

export default VSCodeTheme;