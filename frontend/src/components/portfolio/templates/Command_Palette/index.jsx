import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Briefcase, Code, FolderGit2, Mail, ExternalLink, Github, Command, CornerDownLeft, Sparkles, MoveRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('menu'); 
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { personal, socials, skills, projects, experience, stats } = data;

  const menuItems = [
    { id: 'about', title: 'About Me', description: 'Get to know me and my background', icon: User },
    { id: 'projects', title: 'Projects', description: 'Explore my selected works', icon: FolderGit2 },
    { id: 'skills', title: 'Skills', description: 'Tools and technologies I use', icon: Code },
    { id: 'experience', title: 'Experience', description: 'My professional journey', icon: Briefcase },
    { id: 'contact', title: 'Contact', description: 'Let’s build something together', icon: Mail },
  ];

  const filteredItems = menuItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeView !== 'menu') {
          setActiveView('menu');
          setQuery('');
          setSelectedIndex(0);
          inputRef.current?.focus();
        } else if (isOpen) {
          setIsOpen(false);
        }
      }

      if (isOpen && activeView === 'menu') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        if (e.key === 'Enter' && filteredItems[selectedIndex]) {
          e.preventDefault();
          handleSelect(filteredItems[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeView, filteredItems, selectedIndex]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (id) => {
    if (id === 'contact') {
      window.location.href = `mailto:${socials.email}`;
    } else {
      setActiveView(id);
      setQuery('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black font-sans selection:bg-indigo-500/30 overflow-hidden flex items-center justify-center">
      
      {/* Asthetic Ambient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <AnimatePresence>
        {!isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="z-10 flex flex-col items-center cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl group-hover:scale-105 transition-transform duration-300">
              <Command className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
              Press <kbd className="font-mono text-white/70 bg-white/10 px-2 py-1 rounded-md border border-white/10 shadow-sm">⌘K</kbd> to open command palette
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="z-20 w-full max-w-[640px] mx-4 flex flex-col max-h-[85vh] bg-[#0c0c0c]/80 backdrop-blur-3xl border border-white/[0.08] shadow-[0_0_80px_rgba(79,70,229,0.15)] rounded-2xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center px-4 py-4 border-b border-white/[0.05]">
              <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={activeView === 'menu' ? "What do you want to explore?" : "Press Escape to go back..."}
                readOnly={activeView !== 'menu'}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg font-light"
                autoFocus
              />
              {activeView !== 'menu' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5">
                  ESC
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar scroll-smooth">
              <AnimatePresence mode="wait">
                
                {/* MENU VIEW */}
                {activeView === 'menu' && (
                  <motion.div 
                    key="menu"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-2"
                    ref={listRef}
                  >
                    <div className="px-3 py-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Navigation
                    </div>
                    {filteredItems.length === 0 ? (
                      <div className="py-12 text-center text-white/40 font-medium flex flex-col items-center">
                        <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                        No results found for "{query}"
                      </div>
                    ) : (
                      filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const isSelected = index === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className="relative flex items-center px-4 py-3 mx-1 my-1 rounded-xl cursor-pointer"
                          >
                            {isSelected && (
                              <motion.div 
                                layoutId="highlight" 
                                className="absolute inset-0 bg-white/10 rounded-xl border border-white/5" 
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <div className="relative z-10 flex items-center w-full">
                              <div className={`p-2 rounded-lg mr-4 transition-colors ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/40'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 flex flex-col">
                                <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-white/70'}`}>{item.title}</span>
                                <span className="text-xs text-white/40">{item.description}</span>
                              </div>
                              {isSelected && (
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md"
                                >
                                  Enter <CornerDownLeft className="w-3 h-3" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {/* ABOUT VIEW */}
                {activeView === 'about' && (
                  <motion.div 
                    key="about"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left mb-8">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                        <img src={personal.avatar} alt={personal.name} className="relative w-28 h-28 rounded-2xl border border-white/10 object-cover" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-1">{personal.name}</h2>
                        <p className="text-indigo-400 font-medium mb-4">{personal.title}</p>
                        <p className="text-white/60 leading-relaxed text-sm">{personal.bio}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Years Exp', value: stats.yearsExperience },
                        { label: 'Projects', value: stats.projectsCompleted },
                        { label: 'Clients', value: stats.happyClients }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* PROJECTS VIEW */}
                {activeView === 'projects' && (
                  <motion.div 
                    key="projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 flex flex-col gap-3"
                  >
                    {projects.map((project, i) => (
                      <div key={i} className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                        <img src={project.image} alt={project.title} className="w-full sm:w-32 h-32 rounded-xl object-cover border border-white/10" />
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                          <p className="text-sm text-white/50 mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex gap-3 mt-auto">
                            {project.liveUrl && (
                              <a href={project.liveUrl} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-colors flex items-center gap-1.5">
                                Live Preview <MoveRight className="w-3 h-3" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5">
                                <Github className="w-3 h-3" /> Source
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* SKILLS VIEW */}
                {activeView === 'skills' && (
                  <motion.div 
                    key="skills"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {skills.map((skill, i) => (
                        <div key={i} className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                          <span className="font-medium text-white/80 group-hover:text-white transition-colors">{skill.name}</span>
                          <span className="text-xs font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">{skill.level}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* EXPERIENCE VIEW */}
                {activeView === 'experience' && (
                  <motion.div 
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 md:p-8"
                  >
                    <div className="relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent space-y-8">
                      {experience.map((exp, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0c0c0c] border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-1">{exp.period}</div>
                            <h4 className="font-bold text-white text-lg">{exp.role}</h4>
                            <div className="text-white/50 text-sm font-medium mb-3">{exp.company}</div>
                            <p className="text-sm text-white/40 leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-4 text-[11px] text-white/30 font-medium">
                <span className="flex items-center gap-1"><CornerDownLeft className="w-3.5 h-3.5" /> Select</span>
                <span className="flex items-center gap-1"><Command className="w-3.5 h-3.5" /> K Toggle</span>
              </div>
              <div className="flex gap-3">
                {socials.github && <a href={socials.github} className="text-white/30 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>}
                {socials.linkedin && <a href={socials.linkedin} className="text-white/30 hover:text-white transition-colors"><User className="w-4 h-4" /></a>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
